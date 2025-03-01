import flask
from flask import request, jsonify, render_template, url_for, session, redirect, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from database import init_db, add_emeralds_column
from functools import wraps

app = flask.Flask(__name__, static_url_path='/static')
app.secret_key = 'votre_clé_secrète_ici'  # À changer en production

# Vérifier si la base de données existe au démarrage
if not os.path.exists('database.db'):
    print("Initialisation de la base de données...")
    init_db()
    print("Base de données initialisée!")

try:
    print("Verification de la colonne emeralds...")
    add_emeralds_column()
    print("Structure de la base de données verifiée avec succès!")
except Exception as e:
    print(f"Erreur lors de la vérification de la structure de la base de données: {e}")

def get_db():
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Erreur de connexion à la base de données: {e}")
        raise

# Ajouter le décorateur login_required
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

@app.route('/api/register', methods=['POST'])
def register():
    try:
        print("Début de l'enregistrement")
        data = request.get_json()
        print(f"Données reçues: {data}")
        
        if not data:
            return jsonify({"error": "Aucune donnée reçue"}), 400
        
        if not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({"error": "Données manquantes"}), 400
        
        if not data['username'] or not data['email'] or not data['password']:
            return jsonify({"error": "Tous les champs sont obligatoires"}), 400
        
        db = get_db()
        print("Connexion à la base de données établie")
        cursor = db.cursor()
        
        # Vérifier si l'email existe déjà
        existing_user = cursor.execute(
            "SELECT * FROM users WHERE email = ?", (data['email'],)
        ).fetchone()
        
        if existing_user:
            return jsonify({"error": "Cet email est déjà utilisé"}), 400
        
        # Vérifier si le nom d'utilisateur existe déjà
        existing_username = cursor.execute(
            "SELECT * FROM users WHERE username = ?", (data['username'],)
        ).fetchone()
        
        if existing_username:
            return jsonify({"error": "Ce nom d'utilisateur est déjà utilisé"}), 400
        
        hashed_password = generate_password_hash(data['password'])
        
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (data['username'], data['email'], hashed_password)
        )
        
        db.commit()
        return jsonify({"message": "Inscription réussie", "status": "success"}), 201
    
    except sqlite3.Error as e:
        print(f"Erreur SQLite détaillée: {str(e)}")
        return jsonify({"error": f"Erreur de base de données: {str(e)}"}), 500
    except Exception as e:
        print(f"Erreur inattendue détaillée: {str(e)}")
        return jsonify({"error": f"Erreur inattendue: {str(e)}"}), 500
    finally:
        if 'db' in locals():
            db.close()

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Aucune donnée reçue"}), 400
        
        if not all(key in data for key in ['email', 'password']):
            return jsonify({"error": "Données manquantes"}), 400
        
        if not data['email'] or not data['password']:
            return jsonify({"error": "Tous les champs sont obligatoires"}), 400
        
        db = get_db()
        cursor = db.cursor()
        
        user = cursor.execute(
            "SELECT * FROM users WHERE email = ?", (data['email'],)
        ).fetchone()
        
        if user and check_password_hash(user['password'], data['password']):
            session['user_id'] = user['id']  # Ajouter l'ID à la session
            return jsonify({
                "message": "Connexion réussie",
                "status": "success",
                "user": {
                    "username": user['username'],
                    "email": user['email']
                },
                "redirect": "/dashboard"
            })
        
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401
    
    except sqlite3.Error as e:
        print(f"Erreur SQLite: {e}")
        return jsonify({"error": "Erreur de base de données"}), 500
    except Exception as e:
        print(f"Erreur inattendue: {e}")
        return jsonify({"error": "Une erreur inattendue s'est produite"}), 500
    finally:
        if 'db' in locals():
            db.close()

@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Récupérer tous les utilisateurs (sans les mots de passe)
        users = cursor.execute('''
            SELECT id, username, email, created_at 
            FROM users
            ORDER BY created_at DESC
        ''').fetchall()
        
        # Convertir les résultats en liste de dictionnaires
        users_list = [{
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'created_at': user['created_at']
        } for user in users]
        
        return jsonify({
            "status": "success",
            "count": len(users_list),
            "users": users_list
        })
    
    except sqlite3.Error as e:
        print(f"Erreur SQLite détaillée: {str(e)}")
        return jsonify({"error": f"Erreur de base de données: {str(e)}"}), 500
    except Exception as e:
        print(f"Erreur inattendue détaillée: {str(e)}")
        return jsonify({"error": f"Erreur inattendue: {str(e)}"}), 500
    finally:
        if 'db' in locals():
            db.close()

# Recherche d'un utilisateur spécifique
@app.route('/api/users/<username>', methods=['GET'])
@login_required
def get_user(username):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Rechercher l'utilisateur par son nom d'utilisateur
        user = cursor.execute('''
            SELECT id, username, email, created_at 
            FROM users 
            WHERE username = ?
        ''', (username,)).fetchone()
        
        if user:
            user_data = {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'created_at': user['created_at']
            }
            return jsonify({
                "status": "success",
                "user": user_data
            })
        else:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    except sqlite3.Error as e:
        print(f"Erreur SQLite détaillée: {str(e)}")
        return jsonify({"error": f"Erreur de base de données: {str(e)}"}), 500
    except Exception as e:
        print(f"Erreur inattendue détaillée: {str(e)}")
        return jsonify({"error": f"Erreur inattendue: {str(e)}"}), 500
    finally:
        if 'db' in locals():
            db.close()

# Route pour les statistiques de la base de données
@app.route('/api/stats', methods=['GET'])
@login_required
def get_stats():
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Nombre total d'utilisateurs
        total_users = cursor.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
        
        # Dernier utilisateur inscrit
        latest_user = cursor.execute('''
            SELECT username, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 1
        ''').fetchone()
        
        return jsonify({
            "status": "success",
            "statistics": {
                "total_users": total_users,
                "latest_user": {
                    "username": latest_user['username'] if latest_user else None,
                    "created_at": latest_user['created_at'] if latest_user else None
                }
            }
        })
    
    except sqlite3.Error as e:
        print(f"Erreur SQLite détaillée: {str(e)}")
        return jsonify({"error": f"Erreur de base de données: {str(e)}"}), 500
    except Exception as e:
        print(f"Erreur inattendue détaillée: {str(e)}")
        return jsonify({"error": f"Erreur inattendue: {str(e)}"}), 500
    finally:
        if 'db' in locals():
            db.close()

@app.route('/process-emeralds-payment', methods=['POST'])
@login_required
def process_emeralds_payment():
    try:
        data = request.get_json()
        amount = data.get('amount')
        plan = data.get('plan')
        
        db = get_db()
        cursor = db.cursor()
        
        # Vérifier le solde actuel
        user_data = cursor.execute(
            'SELECT emeralds FROM users WHERE id = ?', (session['users_id'],)
        ).fetchone()
        
        current_emeralds = user_data['emeralds'] if user_data else 0
        
        if current_emeralds < amount:
            return jsonify({
                'success': False,
                'error': 'Solde insuffisant'
            }), 400
        
        # Mettre à jour le solde et l'abonnement
        cursor.execute('''
            UPDATE users 
            SET emeralds = emeralds - ?,
                subscription_plan = ?,
                subscription_status = 'active',
                subscription_start = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (amount, plan, session['users_id']))
        

        db.commit()
        
        return jsonify({
            'success': True,
            'new_balance': current_emeralds - amount
        })
        
    except sqlite3.Error as e:
        print(f"Erreur SQLite: {e}")
        return jsonify({  'success': False,
            'error': 'Une erreur est survenue'
        }), 500
    finally:
        if 'db' in locals():
            db.close()

@app.route('/addEmeralds', methods=['GET'])
@login_required
def add_emeralds():
    try:
        # Récupérer le montant depuis l'URL
        amount = request.args.get('amount', type=int)
        print(f"Tentative d'ajout de {amount} emeraudes")
        
        if not amount or amount <= 0:
            print("Montant invalide")
            flash('Montant invalide', 'error')
            return redirect(url_for('store'))
            
        db = get_db()
        cursor = db.cursor()
        
        # Vérifier le solde actuel
        current = cursor.execute(
            'SELECT emeralds FROM users WHERE id = ?', 
            (session['user_id'],)
        ).fetchone()
        print(f"Solde actuel: {current}")
        
        # Mettre à jour le solde d'emeraudes
        cursor.execute('''
            UPDATE users 
            SET emeralds = COALESCE(emeralds, 0) + ?
            WHERE id = ?
        ''', (amount, session['user_id']))
        
        db.commit()
        
        # Vérifier le nouveau solde
        new_balance = cursor.execute(
            'SELECT emeralds FROM users WHERE id = ?', 
            (session['user_id'],)
        ).fetchone()
        print(f"Nouveau solde: {new_balance}")
        
        if new_balance:
            flash(f'{amount} emeraudes ont été ajoutées à votre compte!', 'success')
        
        return redirect(url_for('store'))
        
    except sqlite3.Error as e:
        print(f"Erreur SQLite détaillée: {str(e)}")
        flash('Une erreur est survenue', 'error')
        return redirect(url_for('store'))
    finally:
        if 'db' in locals():
            db.close()
            
@app.route('/store')
@login_required
def store():
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Vérifier l'ID de l'utilisateur
        print(f"ID utilisateur: {session['user_id']}")
        
        # Récupérer les informations de l'utilisateur
        user_data = cursor.execute('''
            SELECT id, username, email, emeralds 
            FROM users 
            WHERE id = ?
        ''', (session['user_id'],)).fetchone()
        
        print(f"Données utilisateur: {user_data}")
        
        if not user_data:
            print("Utilisateur non trouvé")
            return redirect(url_for('home'))
            
        # Convertir en dictionnaire
        user = dict(user_data)
        print(f"Données converties: {user}")
        
        return render_template('store.html', user=user)
        
    except Exception as e:
        print(f"Erreur détaillée: {str(e)}")
        return redirect(url_for('home'))
    finally:
        if 'db' in locals():
            db.close()

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('Dashboard.html')

@app.route('/fromage')
@login_required
def fromage():
    return render_template('fromage.html')

@app.route('/planning')
@login_required
def planning():
    return render_template('planning.html')

@app.route('/alimentation')
@login_required
def alimentation():
    return render_template('alimentation.html')

@app.route('/db-online')
@login_required
def objectifs():
    return render_template('db-online.html')

@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html')

@app.route('/apparence')
@login_required
def apparence():
    return render_template('apparence.html')

@app.route('/settings/notifications')
@login_required
def settings_notifications():
    return render_template('notifications.html')

@app.route('/settings/securite')
@login_required
def settings_securite():
    return render_template('securite.html')

@app.route('/settings/apparence')
@login_required
def settings_apparence():
    return render_template('apparence.html')

@app.route('/profil')
@login_required
def profil():
    return render_template('profil.html')

@app.route('/abonnement')
@login_required
def abonnement():
    return render_template('abonnement.html')

@app.route('/paiement/<plan>')
@login_required
def paiement(plan):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Récupérer les informations de l'utilisateur
        user_data = cursor.execute(
            'SELECT * FROM users WHERE id = ?', (session['user_id'],)
        ).fetchone()
        
        if not user_data:
            return redirect(url_for('home'))
            
        # Convertir le Row en dictionnaire pour le passer au template
        user = dict(user_data)
        
        return render_template('paiement.html', user=user, plan=plan)
        
    except Exception as e:
        print(f"Erreur: {e}")
        return redirect(url_for('home'))
    finally:
        if 'db' in locals():
            db.close()


@app.route('/graphique')
@login_required
def graphique():
    return render_template('graphique.html')

# Ajouter une route de déconnexion
@app.route('/logout')
def logout():

    session.clear()
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
  