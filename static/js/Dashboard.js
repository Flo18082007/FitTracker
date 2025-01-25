document.querySelectorAll('.relative.group button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = button.nextElementSibling;
        const icon = button.querySelector('.fa-chevron-down');
        
        // Toggle la classe pour faire pivoter l'icône
        icon.classList.toggle('rotate-180');
        
        // Toggle l'affichage du sous-menu
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
            submenu.classList.add('block');
        } else {
            submenu.classList.remove('block');
            submenu.classList.add('hidden');
        }
    });
});