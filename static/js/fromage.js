document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    let pieChart;
    
    function initChart(proteines, lipides, glucides) {
        const data = {
            labels: [
                `Protéines (${proteines}%)`, 
                `Lipides (${lipides}%)`, 
                `Glucides (${glucides}%)`
            ],
            datasets: [{
                data: [proteines, lipides, glucides],
                backgroundColor: [
                    'rgb(255, 99, 132)',    // Rouge pour les protéines
                    'rgb(54, 162, 235)',    // Bleu pour les lipides
                    'rgb(255, 205, 86)'     // Jaune pour les glucides
                ],
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Répartition des Macronutriments',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        if (pieChart) {
            pieChart.destroy();
        }
        pieChart = new Chart(ctx, config);
    }

    // Initialiser le graphique avec les valeurs par défaut
    initChart(25, 25, 50);

    // Gestionnaire de mise à jour
    document.getElementById('updateButton').addEventListener('click', function() {
        const proteines = parseInt(document.getElementById('proteinesInput').value) || 0;
        const lipides = parseInt(document.getElementById('lipidesInput').value) || 0;
        const glucides = parseInt(document.getElementById('glucidesInput').value) || 0;
        const calories = parseInt(document.getElementById('caloriesInput').value) || 0;

        // Vérifier que le total fait 100%
        if (proteines + lipides + glucides !== 100) {
            alert('Le total des pourcentages doit être égal à 100%');
            return;
        }

        // Mettre à jour le graphique
        initChart(proteines, lipides, glucides);
        
        // Mettre à jour l'affichage des calories
        document.getElementById('totalCalories').textContent = calories;
    });
});
