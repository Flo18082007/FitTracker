document.addEventListener('DOMContentLoaded', function() {
    const mealForm = document.getElementById('mealForm');
    const mealsList = document.getElementById('mealsList');
    let meals = JSON.parse(localStorage.getItem('meals') || '[]');

    function updateCaloriesSummary() {
        const totalCalories = meals.reduce((sum, meal) => sum + Number(meal.calories), 0);
        const breakfastCalories = meals.filter(meal => meal.type === 'petit-dejeuner')
            .reduce((sum, meal) => sum + Number(meal.calories), 0);
        const lunchCalories = meals.filter(meal => meal.type === 'dejeuner')
            .reduce((sum, meal) => sum + Number(meal.calories), 0);
        const dinnerCalories = meals.filter(meal => meal.type === 'diner')
            .reduce((sum, meal) => sum + Number(meal.calories), 0);

        document.getElementById('totalCalories').textContent = totalCalories;
        document.getElementById('breakfastCalories').textContent = breakfastCalories;
        document.getElementById('lunchCalories').textContent = lunchCalories;
        document.getElementById('dinnerCalories').textContent = dinnerCalories;
    }

    function displayMeals() {
        mealsList.innerHTML = '';
        meals.forEach((meal, index) => {
            const mealElement = document.createElement('div');
            mealElement.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
            mealElement.innerHTML = `
                <div>
                    <h3 class="font-bold text-gray-800">${meal.name}</h3>
                    <p class="text-sm text-gray-600">${meal.type}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="font-bold text-indigo-600">${meal.calories} calories</span>
                    <button onclick="deleteMeal(${index})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            mealsList.appendChild(mealElement);
        });
        updateCaloriesSummary();
    }

    window.deleteMeal = function(index) {
        meals.splice(index, 1);
        localStorage.setItem('meals', JSON.stringify(meals));
        displayMeals();
    }

    mealForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const meal = {
            name: document.getElementById('mealName').value,
            calories: document.getElementById('calories').value,
            type: document.getElementById('mealType').value,
            date: new Date().toISOString()
        };

        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
        displayMeals();
        mealForm.reset();
    });

    displayMeals();
});