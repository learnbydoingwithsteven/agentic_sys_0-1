// Code Generation Demo
// Interactive demonstration of code generation

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
            <label>Task Description:</label>
            <textarea id="codeTask" rows="3" placeholder="Describe what code to generate...">Create a function to calculate fibonacci numbers</textarea>
        </div>
        <button class="btn" onclick="generateCode()">Generate Code</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


function generateCode() {
    const task = document.getElementById('codeTask').value;
    
    const templates = {
        'fibonacci': 'def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)',
        'sort': 'def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[0]\n    return quicksort([x for x in arr[1:] if x < pivot]) + [pivot] + quicksort([x for x in arr[1:] if x >= pivot])',
        'default': 'def solution():\n    # Generated code\n    pass'
    };
    
    let code = templates.default;
    if (task.toLowerCase().includes('fibonacci')) code = templates.fibonacci;
    if (task.toLowerCase().includes('sort')) code = templates.sort;
    
    const lines = code.split('\n').length;
    const chars = code.length;
    
    courseUtils.displayOutput({
        'Task': task,
        'Generated Code': code,
        'Lines': lines,
        'Characters': chars
    });
}