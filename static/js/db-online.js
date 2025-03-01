let currentUser = null;

// Fonction pour charger les statistiques
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.status === 'success') {
            document.getElementById('totalUsers').textContent = data.statistics.total_users;
            document.getElementById('latestUser').textContent = data.statistics.latest_user.username || '--';
            document.getElementById('latestUserDate').textContent = new Date(data.statistics.latest_user.created_at).toLocaleDateString() || '--';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Fonction pour charger la liste des utilisateurs
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (data.status === 'success') {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            
            data.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${user.id}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${user.username}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${user.email}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="showUserDetails('${user.username}')" 
                                class="text-indigo-600 hover:text-indigo-900">
                            Détails
                        </button>
                    </td>
                `;
                usersList.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
    }
}

// Fonction pour afficher les détails d'un utilisateur
async function showUserDetails(username) {
    try {
        const response = await fetch(`/api/users/${username}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const userDetails = document.getElementById('userDetails');
            userDetails.innerHTML = `
                <div class="space-y-3">
                    <p class="text-sm text-gray-600">ID: <span class="font-medium text-gray-900">${data.user.id}</span></p>
                    <p class="text-sm text-gray-600">Nom d'utilisateur: <span class="font-medium text-gray-900">${data.user.username}</span></p>
                    <p class="text-sm text-gray-600">Email: <span class="font-medium text-gray-900">${data.user.email}</span></p>
                    <p class="text-sm text-gray-600">Date d'inscription: <span class="font-medium text-gray-900">${new Date(data.user.created_at).toLocaleDateString()}</span></p>
                </div>
            `;
            document.getElementById('userModal').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
    }
}

// Fonction pour fermer le modal
function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
}

// Fonction de recherche
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#usersList tr');
            
            rows.forEach(row => {
                const username = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (username.includes(searchTerm) || email.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Chargement initial des données
    loadStats();
    loadUsers();
    
    // Récupérer l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').textContent = user.username;
    }
});

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
} 