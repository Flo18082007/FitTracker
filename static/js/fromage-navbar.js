document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les boutons de menu déroulant
    const dropdownButtons = document.querySelectorAll('.group > button');

    // Ajouter un écouteur d'événements à chaque bouton
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Trouver le sous-menu associé au bouton
            const submenu = this.nextElementSibling;
            
            // Toggle la classe 'hidden' pour afficher/masquer le sous-menu
            submenu.classList.toggle('hidden');
            
            // Rotation de l'icône chevron
            const chevron = this.querySelector('.fa-chevron-down');
            chevron.style.transform = submenu.classList.contains('hidden') ? 
                'rotate(0deg)' : 'rotate(180deg)';
            chevron.style.transition = 'transform 0.2s ease';
        });
    });
});