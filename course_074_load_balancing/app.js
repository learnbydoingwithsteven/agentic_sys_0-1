// Load Balancing Demo
// Interactive demonstration of load balancing

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupControls();
    setupVisualization();
}

function setupControls() {
    const controls = document.getElementById('demoControls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Input:</label>
            <input type="text" id="genericInput" placeholder="Enter input...">
        </div>
        <button class="btn" onclick="process()">Process</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


const results = [];

function process() {
    const input = document.getElementById('genericInput').value;
    const output = input.split('').reverse().join(''); // Simple transformation
    const score = Math.random();
    
    results.push({ input, output, score });
    
    courseUtils.displayOutput({
        'Input': input,
        'Output': output,
        'Score': score.toFixed(3),
        'Processed': results.length
    });
    
    updateChart();
}

function updateChart() {
    const labels = results.map((_, i) => `Item ${i+1}`);
    const data = results.map(r => r.score);
    courseUtils.createLineChart('appChart', labels, data, 'Processing Scores');
}