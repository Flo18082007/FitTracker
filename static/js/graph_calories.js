document.addEventListener('DOMContentLoaded', function() {
    console.log('graph_calories.js chargé');
});

 // Données pour le graphique en barres (calories)
 const caloriesData = [
    { date: '2024-01-15', calories: 1200 },
    { date: '2024-01-20', calories: 1500 },
    { date: '2024-01-25', calories: 1100 },
    { date: '2024-01-30', calories: 1800 },
    { date: '2024-02-05', calories: 2000 },
    { date: '2024-02-10', calories: 1700 }
];

 // Fonction pour formater la date
 function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleString('fr-FR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })}`;
}

const caloriesLabels = caloriesData.map(item => formatDate(item.date));
const caloriesValues = caloriesData.map(item => item.calories);

 // Configuration du graphique en barres (calories)
 const barCtx = document.getElementById('barChart').getContext('2d');
 let barChart = new Chart(barCtx, {
     type: 'bar',
     data: {
         labels: caloriesLabels,
         datasets: [{
             label: 'Calories journalières',
             data: caloriesValues,
             backgroundColor: '#10b981',
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Suivi des calories'
             }
         },
         scales: {
             y: {
                 min: 0,
                 max: 2500,
                 ticks: {
                     stepSize: 100
                 }
             }
         }
     }
 });

  // Gestionnaire pour les calories
  document.getElementById('addCaloriesButton').addEventListener('click', function() {
    const calories = parseFloat(document.getElementById('caloriesInput').value);
    const date = document.getElementById('caloriesDateInput').value;

    if (isNaN(calories) || !date) {
        alert('Veuillez entrer un nombre de calories valide et une date');
        return;
    }

    const dateFormatee = formatDate(date);

    barChart.data.labels.push(dateFormatee);
    barChart.data.datasets[0].data.push(calories);

    // Trier les données par date
    const combinedData = barChart.data.labels.map((label, index) => ({
        label,
        value: barChart.data.datasets[0].data[index]
    }));
    
    combinedData.sort((a, b) => new Date(a.label) - new Date(b.label));

    // Mettre à jour le graphique avec les données triées
    barChart.data.labels = combinedData.map(item => item.label);
    barChart.data.datasets[0].data = combinedData.map(item => item.value);

    // Limiter à 6 dernières entrées
    if (barChart.data.labels.length > 6) {
        barChart.data.labels.shift();
        barChart.data.datasets[0].data.shift();
    }

    barChart.update();

    document.getElementById('caloriesInput').value = '';
    document.getElementById('caloriesDateInput').value = '';
});
