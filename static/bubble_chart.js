// bubble_diagram.js

function drawBubbleDiagram() {
    var canvas = document.getElementById('bubbleDiagram');
    var ctx = canvas.getContext('2d');

    // Data for three bubbles (value and color)
    var bubbles = [
        { value: 50, color: 'red' },
        { value: 80, color: 'green' },
        { value: 120, color: 'blue' }
    ];

    // Draw bubbles
    bubbles.forEach(function(bubble, index) {
        var centerX = (index + 1) * (canvas.width / (bubbles.length + 1));
        var centerY = canvas.height / 2;
        var radius = Math.sqrt(bubble.value) * 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
    });
}
