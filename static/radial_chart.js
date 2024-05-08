const factor = 1; 
const nerf = 1; 
const buff = 25; // buffs all


function createRadarChart(dataUser, dataAverage, month) {
  const ctx = document.getElementById("radial_chart").getContext("2d");
  if (window.myRadarChart instanceof Chart) {
    window.myRadarChart.destroy();
  }

  

  dataUser = dataUser[month-1];
  console.log(dataAverage,month)
  dataAverage_acr = dataAverage[month-1];

  console.log(dataUser);

  window.myRadarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Afternoon", "Evening", "Morning", "Night"],
      datasets: [
        {
          label: "Average",
          data: [
            dataAverage_acr.avg_afternoon * buff,
            dataAverage_acr.avg_evening * buff,
            dataAverage_acr.avg_morning * buff,
            dataAverage_acr.avg_night * buff,
        
          ],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "ID - " + dataUser.LCLid,
          data: [
            dataUser.afternoon * factor ,
            dataUser.evening * factor ,
            dataUser.morning * factor ,
            dataUser.night * factor ,
            // dataUser.total_consumption * factor * nerf ,
          ],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: "rgba(255, 255, 255, 0.4)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.4)",
          },
          pointLabels: {
            font: {
              size: 16, // Increase the font size for labels
            },
            position: "bottom"
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
      plugins: {
        title: {
            display: true,
            text: "Average acorn usage vs User usage for "+month+"/2013" 
        }
    }
    },
  });
}
