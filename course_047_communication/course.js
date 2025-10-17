// Course 47: Agent Communication Protocols

document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['Course Overview', 'Key Concepts', 'Practical Applications', 'Best Practices'];
    courseUtils.generateTOC(sections);
}

function setupDemo() {
    const controls = document.getElementById('demoControls');
    controls.innerHTML = `
        <h4 style="margin-bottom: 15px;">🎮 Agent Communication Protocols Demo</h4>
        <div class="control-group">
            <label>Input Parameter:</label>
            <input type="text" id="inputParam" placeholder="Enter value..." value="test input">
        </div>
        <div class="control-group">
            <label>Processing Mode:</label>
            <select id="processingMode">
                <option value="fast">Fast Mode</option>
                <option value="balanced">Balanced Mode</option>
                <option value="accurate">Accurate Mode</option>
            </select>
        </div>
        <div class="control-group">
            <label>Iterations:</label>
            <input type="range" id="iterations" min="1" max="10" value="5">
            <span id="iterValue">5</span>
        </div>
        <button class="btn" onclick="runDemo()">▶️ Run Demo</button>
        <button class="btn" style="background: #e74c3c; margin-top: 10px;" onclick="resetDemo()">🔄 Reset</button>
    `;
    
    document.getElementById('iterations').addEventListener('input', (e) => {
        document.getElementById('iterValue').textContent = e.target.value;
    });
    
    document.getElementById('demoOutput').innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Configure parameters and click "Run Demo"</p>';
}

let demoHistory = [];
let chartInstance = null;

async function runDemo() {
    const input = document.getElementById('inputParam').value;
    const mode = document.getElementById('processingMode').value;
    const iterations = parseInt(document.getElementById('iterations').value);
    
    if (!input.trim()) {
        alert('Please enter an input parameter');
        return;
    }
    
    courseUtils.showLoading('demoOutput');
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = {
        input: input,
        mode: mode,
        iterations: iterations,
        output: `Processed: ${input}`,
        score: (Math.random() * 40 + 60).toFixed(2),
        latency: (Math.random() * 500 + 200).toFixed(0),
        accuracy: (Math.random() * 20 + 80).toFixed(2),
        timestamp: new Date().toLocaleTimeString()
    };
    
    demoHistory.push(result);
    
    courseUtils.displayOutput({
        '🕐 Time': result.timestamp,
        '📥 Input': result.input,
        '⚙️ Mode': result.mode.toUpperCase(),
        '🔄 Iterations': result.iterations,
        '📤 Output': result.output,
        '⭐ Score': result.score + '/100',
        '⏱️ Latency': result.latency + 'ms',
        '🎯 Accuracy': result.accuracy + '%'
    });
    
    updateVisuals(result);
}

function updateVisuals(result) {
    const visuals = document.getElementById('demoVisuals');
    
    const avgScore = (demoHistory.reduce((sum, h) => sum + parseFloat(h.score), 0) / demoHistory.length).toFixed(2);
    const avgLatency = (demoHistory.reduce((sum, h) => sum + parseFloat(h.latency), 0) / demoHistory.length).toFixed(0);
    
    visuals.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            ${courseUtils.createMetricCard('Runs', demoHistory.length)}
            ${courseUtils.createMetricCard('Avg Score', avgScore)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            ${courseUtils.createMetricCard('Avg Latency', avgLatency + 'ms')}
            ${courseUtils.createMetricCard('Last Score', result.score)}
        </div>
        <canvas id="demoChart" width="350" height="200"></canvas>
    `;
    
    if (demoHistory.length > 0) {
        const ctx = document.getElementById('demoChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: demoHistory.map((h, i) => `Run ${i+1}`),
                datasets: [{
                    label: 'Score',
                    data: demoHistory.map(h => parseFloat(h.score)),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Accuracy',
                    data: demoHistory.map(h => parseFloat(h.accuracy)),
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }
}

function resetDemo() {
    demoHistory = [];
    if (chartInstance) chartInstance.destroy();
    chartInstance = null;
    document.getElementById('demoOutput').innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Configure parameters and click "Run Demo"</p>';
    document.getElementById('demoVisuals').innerHTML = '';
}
