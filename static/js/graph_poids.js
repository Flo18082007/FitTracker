document.addEventListener('DOMContentLoaded', function() {
    // Données communes
    const initialData = [
        { date: '2024-01-15', poids: 64 },
        { date: '2024-01-20', poids: 67 },
        { date: '2024-01-25', poids: 71 },
        { date: '2024-01-30', poids: 72.5 },
        { date: '2024-02-05', poids: 72 },
        { date: '2024-02-10', poids: 73 }
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

    // Formater les labels initiaux
    const poidsLabels = initialData.map(item => formatDate(item.date));
    const poidsData = initialData.map(item => item.poids);
    const caloriesLabels = caloriesData.map(item => formatDate(item.date));
    const caloriesValues = caloriesData.map(item => item.calories);

    // Configuration du graphique linéaire (poids)
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    let lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: poidsLabels,
            datasets: [{
                label: 'Poids du corps',
                data: poidsData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution du poids'
                }
            },
            scales: {
                y: {
                    min: 60,
                    max: 90,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });

    // Gestionnaire pour le poids
    document.getElementById('addPoidsButton').addEventListener('click', function() {
        const poids = parseFloat(document.getElementById('poidsInput').value);
        const date = document.getElementById('poidsDateInput').value;
        
        if (isNaN(poids) || !date) {
            alert('Veuillez entrer un poids valide et une date');
            return;
        }

        const dateFormatee = formatDate(date);
        
        // Ajout des nouvelles données
        lineChart.data.labels.push(dateFormatee);
        lineChart.data.datasets[0].data.push(poids);

        // Trier les données par date
        const combinedData = lineChart.data.labels.map((label, index) => ({
            label,
            value: lineChart.data.datasets[0].data[index]
        }));
        
        combinedData.sort((a, b) => new Date(a.label) - new Date(b.label));

        // Mettre à jour le graphique avec les données triées
        lineChart.data.labels = combinedData.map(item => item.label);
        lineChart.data.datasets[0].data = combinedData.map(item => item.value);

        // Limiter à 6 dernières entrées
        if (lineChart.data.labels.length > 6) {
            lineChart.data.labels.shift();
            lineChart.data.datasets[0].data.shift();
        }

        // Mise à jour du graphique
        lineChart.update();

        // Réinitialisation des champs
        document.getElementById('poidsInput').value = '';
        document.getElementById('poidsDateInput').value = '';
    });

});

