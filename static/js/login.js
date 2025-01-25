document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = data.redirect;
                } else {
                    alert(data.error || 'Erreur lors de la connexion');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la connexion');
            }
        });
    }
}); 