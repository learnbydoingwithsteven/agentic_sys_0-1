// Multi-Agent Collaboration System
// Simulate multiple agents working together on tasks

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
            <label>Task:</label>
            <input type="text" id="taskInput" placeholder="Enter collaborative task..." value="Build a web application">
        </div>
        <div class="control-group">
            <label>Number of Agents:</label>
            <input type="number" id="agentCount" min="2" max="5" value="3">
        </div>
        <button class="btn" onclick="distributeTask()">Start Collaboration</button>
        <button class="btn btn-secondary" onclick="resetAgents()">Reset</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


let agents = [];
let taskHistory = [];

function distributeTask() {
    const task = document.getElementById('taskInput').value;
    const count = parseInt(document.getElementById('agentCount').value);
    
    const roles = ['Planner', 'Executor', 'Reviewer', 'Optimizer', 'Coordinator'];
    agents = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Agent ${i + 1}`,
        role: roles[i % roles.length],
        progress: 0,
        status: 'working',
        contributions: []
    }));
    
    // Simulate collaboration
    simulateCollaboration(task);
}

function simulateCollaboration(task) {
    let step = 0;
    const maxSteps = 5;
    
    const interval = setInterval(() => {
        agents.forEach(agent => {
            if (agent.progress < 1) {
                agent.progress += Math.random() * 0.25;
                if (agent.progress >= 1) {
                    agent.progress = 1;
                    agent.status = 'completed';
                }
                agent.contributions.push(`Step ${step + 1}: ${agent.role} contribution`);
            }
        });
        
        step++;
        updateCollaborationDisplay(task);
        
        if (step >= maxSteps || agents.every(a => a.status === 'completed')) {
            clearInterval(interval);
            finalizeCollaboration(task);
        }
    }, 1000);
}

function updateCollaborationDisplay(task) {
    const completed = agents.filter(a => a.status === 'completed').length;
    const avgProgress = agents.reduce((sum, a) => sum + a.progress, 0) / agents.length;
    
    courseUtils.displayOutput({
        'Task': task,
        'Total Agents': agents.length,
        'Completed': completed,
        'In Progress': agents.length - completed,
        'Overall Progress': (avgProgress * 100).toFixed(1) + '%'
    });
    
    updateAgentChart();
}

function finalizeCollaboration(task) {
    taskHistory.push({
        task,
        agents: agents.length,
        completed: agents.filter(a => a.status === 'completed').length,
        timestamp: Date.now()
    });
    
    courseUtils.displayOutput({
        'Task': task,
        'Status': 'COMPLETED',
        'Total Agents': agents.length,
        'Success Rate': ((agents.filter(a => a.status === 'completed').length / agents.length) * 100).toFixed(0) + '%',
        'Tasks Completed': taskHistory.length
    });
}

function updateAgentChart() {
    const labels = agents.map(a => `${a.name}\n(${a.role})`);
    const data = agents.map(a => a.progress * 100);
    courseUtils.createBarChart('appChart', labels, data, 'Agent Progress (%)');
    
    document.getElementById('metrics').innerHTML = agents.map(a => 
        courseUtils.createMetricCard(`${a.name} (${a.role})`, (a.progress * 100).toFixed(0) + '%')
    ).join('');
}

function resetAgents() {
    agents = [];
    taskHistory = [];
    document.getElementById('metrics').innerHTML = '';
    courseUtils.displayOutput({ 'Status': 'Reset complete' });
}