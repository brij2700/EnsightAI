function generateLineChart(monthlyData, selected, dataAverage) {
  // Formatting data for Chart.js
  const labels = monthlyData.map((item) => `${item.month}-${item.year}`);
  var selectedData;

  if (selected == "Total Consumption") {
    selectedData = monthlyData.map((item) =>
      parseFloat(item.total_consumption)
    );
  } else if (selected == "Morning") {
    selectedData = monthlyData.map((item) => parseFloat(item.morning));
  } else if (selected == "Afternoon") {
    selectedData = monthlyData.map((item) => parseFloat(item.afternoon));
  } else if (selected == "Evening") {
    selectedData = monthlyData.map((item) => parseFloat(item.evening));
  } else {
    selectedData = monthlyData.map((item) => parseFloat(item.night));
  }
  // Creating a line chart
  const ctx = document.getElementById("lineChart").getContext("2d");
  if (lineChart != null) {
    lineChart.destroy();
  }
  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: selected,
          data: selectedData,
          borderColor: "blue",
          backgroundColor: "transparent",
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: selected,
          },
        },
        x: {
          title: {
            display: true,
            text: "Month-Year",
          },
        },
      },
    },
  });

  // Adding click event to points on the line chart
  document.getElementById("lineChart").onclick = function (evt) {
    const activePoints = lineChart.getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      true
    );
    if (activePoints.length > 0) {
      const clickedIndex = activePoints[0].index;
      const clickedData = lineChart.data.datasets[0].data[clickedIndex];
      const monthYear = lineChart.data.labels[clickedIndex];

      // If you have access to the original monthly data, you can get morning, afternoon, evening, and night values
      // Assuming monthlyData is accessible here
      const dataPoint = monthlyData.find(
        (item) => `${item.month}-${item.year}` === monthYear
      );
      if (dataPoint) {
        console.log(dataPoint);
        const title = `${dataPoint.month}/${dataPoint.year}`;
        generateDonutChart(dataPoint, title);
        console.log(monthlyData,dataAverage)
        createRadarChart(monthlyData, dataAverage, dataPoint.month);
      }
    }
  };
}
