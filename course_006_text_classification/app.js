// Text Classification Demo
// Interactive demonstration of text classification

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
            <label>Input Text:</label>
            <textarea id="inputText" rows="3" placeholder="Enter text to classify..."></textarea>
        </div>
        <button class="btn" onclick="classify()">Classify</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


const classifications = [];

function classify() {
    const text = document.getElementById('inputText').value;
    const categories = ['Positive', 'Negative', 'Neutral'];
    const scores = categories.map(() => Math.random());
    const total = scores.reduce((a, b) => a + b, 0);
    const normalized = scores.map(s => (s / total).toFixed(3));
    
    const result = categories[scores.indexOf(Math.max(...scores))];
    classifications.push({ text, result, scores: normalized });
    
    courseUtils.displayOutput({
        'Input': text,
        'Classification': result,
        'Confidence': Math.max(...normalized)
    });
    
    updateClassificationChart();
}

function updateClassificationChart() {
    const labels = ['Positive', 'Negative', 'Neutral'];
    const counts = labels.map(l => classifications.filter(c => c.result === l).length);
    courseUtils.createBarChart('appChart', labels, counts, 'Classification Distribution');
}