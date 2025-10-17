// Simple Reactive Agent Simulator
// Interactive agent that responds to environmental inputs

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
            <label>Environment Input:</label>
            <select id="envInput">
                <option value="sunny">Sunny Weather</option>
                <option value="rainy">Rainy Weather</option>
                <option value="cold">Cold Weather</option>
                <option value="hot">Hot Weather</option>
            </select>
        </div>
        <button class="btn" onclick="runAgent()">Run Agent</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


const agentHistory = [];

function runAgent() {
    const input = document.getElementById('envInput').value;
    
    const actions = {
        'sunny': { action: 'Go outside', reason: 'Weather is pleasant', utility: 0.9 },
        'rainy': { action: 'Stay inside', reason: 'Avoid getting wet', utility: 0.7 },
        'cold': { action: 'Wear jacket', reason: 'Stay warm', utility: 0.8 },
        'hot': { action: 'Turn on AC', reason: 'Cool down', utility: 0.85 }
    };
    
    const response = actions[input];
    agentHistory.push({ input, ...response, timestamp: Date.now() });
    
    courseUtils.displayOutput({
        'Input': input,
        'Action': response.action,
        'Reasoning': response.reason,
        'Utility Score': response.utility
    });
    
    updateVisualization();
}

function updateVisualization() {
    const labels = agentHistory.map((h, i) => `Action ${i+1}`);
    const data = agentHistory.map(h => h.utility);
    courseUtils.createLineChart('agentChart', labels, data, 'Agent Utility Over Time');
    
    const avgUtility = (agentHistory.reduce((sum, h) => sum + h.utility, 0) / agentHistory.length).toFixed(2);
    document.getElementById('metrics').innerHTML = 
        courseUtils.createMetricCard('Actions Taken', agentHistory.length) +
        courseUtils.createMetricCard('Avg Utility', avgUtility);
}