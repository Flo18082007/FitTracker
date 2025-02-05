
document.addEventListener('DOMContentLoaded', function() {
const cardNumber = document.getElementById('cardNumber');
const expDate = document.getElementById('expDate');
const cvc = document.getElementById('cvc');
const form = document.getElementById('paymentForm');

// Formatage du numéro de carte
cardNumber.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    e.target.value = formattedValue;
});

// Formatage de la date d'expiration
expDate.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
});

// Validation du formulaire
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulation de chargement
    const button = e.target.querySelector('button');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';

    // Simulation de traitement
    setTimeout(() => {
        // Redirection vers la page de succès
        window.location.href = '/success-payment';
    }, 2000);
});
});
