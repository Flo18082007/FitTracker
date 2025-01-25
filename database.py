import sqlite3
import os
from werkzeug.security import generate_password_hash

def init_db():
    # Vérifier si le fichier de base de données existe déjà
    db_exists = os.path.exists('database.db')
    
    # Créer une connexion (cela créera aussi le fichier s'il n'existe pas)
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    
    # Supprimer la table si elle existe déjà
    c.execute('DROP TABLE IF EXISTS users')
    
    # Création de la table users
    c.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    print("Base de données initialisée avec succès!")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    try:
        init_db()
        print("La base de données a été créée et initialisée avec succès!")
    except Exception as e:
        print(f"Erreur lors de l'initialisation de la base de données: {e}") 