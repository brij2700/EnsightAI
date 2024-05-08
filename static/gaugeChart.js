function slider_function(score) {
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: score,
      title: { text: "Energy Efficiency", font: { size: 24, color: "white" } },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 100] },
        bar: { color: "green" },
        bgcolor: "black",
      },
    },
  ];

  var layout = {
    width: 500,
    height: 400,
    margin: { t: 0, b: 0 },
    paper_bgcolor: "black",
    plot_bgcolor: "black",
    font: {
      color: "white",
    },
  };
  Plotly.newPlot("gaugeChart", data, layout);
}
