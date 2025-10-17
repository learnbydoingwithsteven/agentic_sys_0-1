// Long Term Memory Demo
// Interactive demonstration of long term memory

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
            <label>Store Data:</label>
            <input type="text" id="memoryKey" placeholder="Key">
            <input type="text" id="memoryValue" placeholder="Value">
        </div>
        <button class="btn" onclick="storeMemory()">Store</button>
        <button class="btn" onclick="retrieveMemory()">Retrieve All</button>
        <button class="btn btn-secondary" onclick="clearMemory()">Clear</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


const memory = {};

function storeMemory() {
    const key = document.getElementById('memoryKey').value;
    const value = document.getElementById('memoryValue').value;
    
    if (key && value) {
        memory[key] = { value, timestamp: Date.now() };
        courseUtils.displayOutput({
            'Action': 'Stored',
            'Key': key,
            'Value': value,
            'Total Items': Object.keys(memory).length
        });
    }
}

function retrieveMemory() {
    courseUtils.displayOutput({
        'Memory Contents': JSON.stringify(memory, null, 2),
        'Total Items': Object.keys(memory).length
    });
}

function clearMemory() {
    Object.keys(memory).forEach(k => delete memory[k]);
    courseUtils.displayOutput({ 'Action': 'Memory cleared' });
}