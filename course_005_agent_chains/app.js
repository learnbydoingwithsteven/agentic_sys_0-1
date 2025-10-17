// Agent Chain Pipeline Builder
// Create and execute multi-step agent chains

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
            <textarea id="chainInput" rows="3" placeholder="Enter text to process...">The quick brown fox jumps over the lazy dog.</textarea>
        </div>
        <div class="control-group">
            <label>Chain Steps:</label>
            <div>
                <input type="checkbox" id="step1" checked> Tokenize
                <input type="checkbox" id="step2" checked> Analyze
                <input type="checkbox" id="step3" checked> Transform
                <input type="checkbox" id="step4" checked> Summarize
            </div>
        </div>
        <button class="btn" onclick="executeChain()">Execute Chain</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


function executeChain() {
    const input = document.getElementById('chainInput').value;
    const steps = [
        { id: 'step1', name: 'Tokenize', fn: tokenize },
        { id: 'step2', name: 'Analyze', fn: analyze },
        { id: 'step3', name: 'Transform', fn: transform },
        { id: 'step4', name: 'Summarize', fn: summarize }
    ];
    
    let result = input;
    const outputs = [];
    let totalTime = 0;
    
    steps.forEach(step => {
        if (document.getElementById(step.id).checked) {
            const startTime = Date.now();
            result = step.fn(result);
            const duration = Date.now() - startTime;
            totalTime += duration;
            outputs.push({ step: step.name, output: result, duration });
        }
    });
    
    courseUtils.displayOutput({
        'Input': input,
        'Final Output': result,
        'Steps Executed': outputs.length,
        'Total Time': totalTime + 'ms',
        'Pipeline': outputs.map(o => o.step).join(' → ')
    });
    
    updateChainMetrics(outputs);
}

function tokenize(text) {
    return text.split(' ').join(' | ');
}

function analyze(text) {
    const wordCount = text.split(' ').length;
    return text + ` [Words: ${wordCount}]`;
}

function transform(text) {
    return text.toUpperCase();
}

function summarize(text) {
    return text.substring(0, 50) + '...';
}

function updateChainMetrics(outputs) {
    const labels = outputs.map(o => o.step);
    const data = outputs.map(o => o.duration);
    
    courseUtils.createBarChart('chainChart', labels, data, 'Step Duration (ms)');
}