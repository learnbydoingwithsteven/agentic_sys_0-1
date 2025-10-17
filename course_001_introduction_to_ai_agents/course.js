
// Course 1: Simple Agent Demo
document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['What is an AI Agent?', 'Types of AI Agents', 'Agent Properties'];
    courseUtils.generateTOC(sections);
    courseUtils.updateProgress(0, sections.length);
}

function setupDemo() {
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
    
    // Initialize visualization
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = '<canvas id="agentChart" width="350" height="200"></canvas>';
}

let agentHistory = [];

function runAgent() {
    const input = document.getElementById('envInput').value;
    
    // Simple reactive agent logic
    const actions = {
        'sunny': { action: 'Go outside', reason: 'Weather is pleasant', utility: 0.9 },
        'rainy': { action: 'Stay inside', reason: 'Avoid getting wet', utility: 0.7 },
        'cold': { action: 'Wear jacket', reason: 'Stay warm', utility: 0.8 },
        'hot': { action: 'Turn on AC', reason: 'Cool down', utility: 0.85 }
    };
    
    const response = actions[input];
    agentHistory.push({ input, ...response });
    
    // Display output
    courseUtils.displayOutput({
        'Input': input,
        'Action': response.action,
        'Reasoning': response.reason,
        'Utility Score': response.utility
    });
    
    // Update visualization
    updateChart();
    
    // Update metrics
    const metrics = document.getElementById('demoVisuals');
    const avgUtility = (agentHistory.reduce((sum, h) => sum + h.utility, 0) / agentHistory.length).toFixed(2);
    metrics.innerHTML += courseUtils.createMetricCard('Actions Taken', agentHistory.length);
    metrics.innerHTML += courseUtils.createMetricCard('Avg Utility', avgUtility);
}

function updateChart() {
    const ctx = document.getElementById('agentChart');
    if (agentHistory.length > 0) {
        const labels = agentHistory.map((h, i) => `Action ${i+1}`);
        const data = agentHistory.map(h => h.utility);
        
        courseUtils.createLineChart('agentChart', labels, data, 'Agent Utility Over Time');
    }
}
