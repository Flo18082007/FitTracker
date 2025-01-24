document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Inscription réussie!');
                    window.location.href = '/';
                } else {
                    alert(data.error || 'Erreur lors de l\'inscription');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'inscription');
            }
        });
    }
}); 