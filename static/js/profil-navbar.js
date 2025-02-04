document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les boutons de menu déroulant
    const dropdownButtons = document.querySelectorAll('.group > button');

    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Empêcher la propagation du clic
            e.preventDefault();
            e.stopPropagation();
            
            // Trouver le sous-menu associé au bouton
            const submenu = this.nextElementSibling;
            
            // Fermer tous les autres sous-menus
            dropdownButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherSubmenu = otherButton.nextElementSibling;
                    const otherChevron = otherButton.querySelector('.fa-chevron-down');
                    otherSubmenu.classList.add('hidden');
                    if (otherChevron) {
                        otherChevron.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle le sous-menu actuel
            submenu.classList.toggle('hidden');
            
            // Rotation de l'icône chevron
            const chevron = this.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = submenu.classList.contains('hidden') 
                    ? 'rotate(0deg)' 
                    : 'rotate(180deg)';
                chevron.style.transition = 'transform 0.2s ease';
            }
        });
    });

    // Fermer les sous-menus quand on clique en dehors
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.group')) {
            dropdownButtons.forEach(button => {
                const submenu = button.nextElementSibling;
                const chevron = button.querySelector('.fa-chevron-down');
                submenu.classList.add('hidden');
                if (chevron) {
                    chevron.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
});