document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let selectedDate = null;
    const workouts = new Map(); // Pour stocker les entraînements

    // Initialisation du planning
    function initializePlanning() {
        updateWeekDisplay();
        renderWeek();
        setupEventListeners();
    }

    // Mise à jour de l'affichage de la semaine
    function updateWeekDisplay() {
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const options = { day: '2-digit', month: 'short' };
        document.getElementById('currentWeek').textContent = 
            `Semaine du ${startOfWeek.toLocaleDateString('fr-FR', options)} au ${endOfWeek.toLocaleDateString('fr-FR', options)}`;
    }

    // Obtenir le début de la semaine (Lundi)
    function getStartOfWeek(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        return start;
    }

    // Rendu de la semaine
    function renderWeek() {
        const container = document.querySelector('.grid');
        const template = document.getElementById('dayTemplate');
        const startOfWeek = getStartOfWeek(currentDate);

        // Supprime les anciennes cellules de jours
        const oldDays = container.querySelectorAll('.day-cell');
        oldDays.forEach(day => day.remove());

        // Crée les nouvelles cellules
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(dayDate.getDate() + i);
            
            const clone = template.content.cloneNode(true);
            const cell = clone.querySelector('.day-cell');
            const dateDisplay = clone.querySelector('.date-display');
            const workoutInfo = clone.querySelector('.workout-info');

            dateDisplay.textContent = dayDate.getDate();
            
            // Vérifie s'il y a un entraînement pour cette date
            const dateString = dayDate.toISOString().split('T')[0];
            if (workouts.has(dateString)) {
                const workout = workouts.get(dateString);
                workoutInfo.innerHTML = `
                    <div class="bg-blue-100 p-2 rounded">
                        <p class="font-semibold">${workout.type}</p>
                        <p>${workout.duration} min</p>
                        <p class="text-sm">${workout.notes}</p>
                    </div>
                `;
            }

            cell.addEventListener('click', () => openWorkoutModal(dayDate));
            container.appendChild(clone);
        }
    }

    // Gestion du modal
    function openWorkoutModal(date) {
        selectedDate = date;
        const modal = document.getElementById('workoutModal');
        const dateString = date.toISOString().split('T')[0];
        const workout = workouts.get(dateString);

        // Remplir le formulaire si un entraînement existe
        if (workout) {
            document.getElementById('workoutType').value = workout.type;
            document.getElementById('duration').value = workout.duration;
            document.getElementById('notes').value = workout.notes;
        } else {
            document.getElementById('workoutForm').reset();
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // Configuration des écouteurs d'événements
    function setupEventListeners() {
        document.getElementById('prevWeek').addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 7);
            updateWeekDisplay();
            renderWeek();
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 7);
            updateWeekDisplay();
            renderWeek();
        });

        document.getElementById('workoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            saveWorkout();
        });

        document.getElementById('cancelWorkout').addEventListener('click', () => {
            document.getElementById('workoutModal').classList.add('hidden');
        });

        document.getElementById('goToWeek').addEventListener('click', () => {
            const weekInput = document.getElementById('weekSelector').value;
            if (weekInput) {
                currentDate = new Date(weekInput + '-1'); // Le -1 ajoute le jour de la semaine
                updateWeekDisplay();
                renderWeek();
            }
        });
    }

    // Sauvegarde d'un entraînement
    function saveWorkout() {
        const dateString = selectedDate.toISOString().split('T')[0];
        const workout = {
            type: document.getElementById('workoutType').value,
            duration: document.getElementById('duration').value,
            notes: document.getElementById('notes').value
        };

        workouts.set(dateString, workout);
        document.getElementById('workoutModal').classList.add('hidden');
        renderWeek();

        // Ici, vous pourriez ajouter une sauvegarde dans localStorage ou une API
        saveToLocalStorage();
    }

    // Sauvegarde dans localStorage
    function saveToLocalStorage() {
        const workoutsObj = {};
        workouts.forEach((value, key) => {
            workoutsObj[key] = value;
        });
        localStorage.setItem('workouts', JSON.stringify(workoutsObj));
    }

    // Chargement depuis localStorage
    function loadFromLocalStorage() {
        const saved = localStorage.getItem('workouts');
        if (saved) {
            const workoutsObj = JSON.parse(saved);
            Object.entries(workoutsObj).forEach(([key, value]) => {
                workouts.set(key, value);
            });
        }
    }

    // Initialisation
    loadFromLocalStorage();
    initializePlanning();
});
