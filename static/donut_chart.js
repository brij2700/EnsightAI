

function generateDonutChart(data,chartTitle,dataAverage) {

    const morningValue = parseFloat(data.morning);
    const afternoonValue = parseFloat(data.afternoon);
    const eveningValue = parseFloat(data.evening);
    const nightValue = parseFloat(data.night);
    

    const ctx = document.getElementById('donutChart').getContext('2d');
    if (donutChart!=null){
    donutChart.destroy();
    }

    donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
            datasets: [{
                label: 'Consumption',
                data: [morningValue, afternoonValue, eveningValue, nightValue],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            cutout: '80%',
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size:16
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        },
        
    });

    ctx.canvas.addEventListener('click', function(event) {
        const segments = donutChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (segments.length > 0) {
            const segmentIndex = segments[0].index;
            const segmentLabel = donutChart.data.labels[segmentIndex];
            generateLineChart(monthlyData,segmentLabel,dataAverage)
            generateBarGraph(dailyData,segmentLabel)
        }
    });
}
