function generateBarGraph(data, selected) {
    var dataset1;
    var dataset2;
    console.log(selected)

    if (selected=="Total Consumption"){
        dataset1 = data[0].map(entry => entry.total_consumption);
        dataset2 = data[1].map(entry => entry.total_consumption);

    }
    else if (selected=="Morning"){
        dataset1 = data[0].map(entry => entry.morning);
        dataset2 = data[1].map(entry => entry.morning);
    }
    else if (selected=="Afternoon"){
        dataset1 = data[0].map(entry => entry.afternoon);
        dataset2 = data[1].map(entry => entry.afternoon);
    }
    else if (selected=="Evening"){
        dataset1 = data[0].map(entry => entry.evening);
        dataset2 = data[1].map(entry => entry.evening);
    }
    else{
        dataset1 = data[0].map(entry => entry.night);
        dataset2 = data[1].map(entry => entry.night);
    }

    const labels = data[0].map(entry => getDayOfWeek(entry.day));


    function getDayOfWeek(dateString) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }
    if (barGraph!=null){
        barGraph.destroy();
        }
    // Chart.js
    var ctx = document.getElementById('double_bargraph').getContext('2d');
    barGraph = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Past Week',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: dataset2
            }, {
                label: 'Current Week',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: dataset1
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: selected
                    }
                },
               
            },
            plugins: {
                title: {
                    display: true,
                    text: selected + ":Current week vs Past week"
                }
            }
        }
    });

}
