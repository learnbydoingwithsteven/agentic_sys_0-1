// State Management Visualizer
// Track and visualize agent state changes

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
            <label>Action:</label>
            <select id="stateAction">
                <option value="login">User Login</option>
                <option value="query">Process Query</option>
                <option value="update">Update Preferences</option>
                <option value="logout">User Logout</option>
            </select>
        </div>
        <button class="btn" onclick="performAction()">Execute Action</button>
        <button class="btn btn-secondary" onclick="resetState()">Reset State</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


let agentState = {
    authenticated: false,
    userId: null,
    sessionStart: null,
    queryCount: 0,
    preferences: {},
    lastAction: null
};

const stateHistory = [];

function performAction() {
    const action = document.getElementById('stateAction').value;
    
    switch(action) {
        case 'login':
            agentState.authenticated = true;
            agentState.userId = 'user_' + Math.floor(Math.random() * 1000);
            agentState.sessionStart = Date.now();
            break;
        case 'query':
            if (agentState.authenticated) agentState.queryCount++;
            break;
        case 'update':
            agentState.preferences = { theme: 'dark', language: 'en' };
            break;
        case 'logout':
            agentState.authenticated = false;
            agentState.userId = null;
            break;
    }
    
    agentState.lastAction = action;
    stateHistory.push({ ...agentState, timestamp: Date.now() });
    
    courseUtils.displayOutput({
        'Current State': JSON.stringify(agentState, null, 2),
        'Authenticated': agentState.authenticated,
        'Query Count': agentState.queryCount,
        'Last Action': action
    });
    
    updateStateVisualization();
}

function resetState() {
    agentState = {
        authenticated: false,
        userId: null,
        sessionStart: null,
        queryCount: 0,
        preferences: {},
        lastAction: null
    };
    stateHistory.length = 0;
    updateStateVisualization();
}

function updateStateVisualization() {
    const labels = stateHistory.map((_, i) => `State ${i+1}`);
    const data = stateHistory.map(s => s.queryCount);
    
    courseUtils.createLineChart('stateChart', labels, data, 'Query Count Over Time');
    
    document.getElementById('metrics').innerHTML = 
        courseUtils.createMetricCard('State Changes', stateHistory.length) +
        courseUtils.createMetricCard('Active Session', agentState.authenticated ? 'Yes' : 'No');
}