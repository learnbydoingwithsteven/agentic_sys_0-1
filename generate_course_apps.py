"""
Generate interactive app examples for all 100 AI Agent courses
Each app is tailored to the specific course topic with relevant functionality
"""

import os
import json

# Course app templates with specific implementations
COURSE_APPS = {
    # BEGINNER LEVEL (1-20)
    1: {
        "title": "Simple Reactive Agent Simulator",
        "description": "Interactive agent that responds to environmental inputs",
        "controls": """
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
        """,
        "logic": """
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
"""
    },
    
    2: {
        "title": "Prompt Engineering Playground",
        "description": "Experiment with different prompting techniques",
        "controls": """
        <div class="control-group">
            <label>Prompting Technique:</label>
            <select id="technique">
                <option value="zero-shot">Zero-Shot</option>
                <option value="few-shot">Few-Shot</option>
                <option value="chain-of-thought">Chain-of-Thought</option>
                <option value="self-consistency">Self-Consistency</option>
            </select>
        </div>
        <div class="control-group">
            <label>Task:</label>
            <textarea id="taskInput" rows="3" placeholder="Enter your task...">Classify the sentiment: I love this product!</textarea>
        </div>
        <button class="btn" onclick="generatePrompt()">Generate Prompt</button>
        """,
        "logic": """
function generatePrompt() {
    const technique = document.getElementById('technique').value;
    const task = document.getElementById('taskInput').value;
    
    const prompts = {
        'zero-shot': `Task: ${task}\\n\\nAnswer:`,
        'few-shot': `Example 1: "Great service!" -> Positive\\nExample 2: "Terrible experience" -> Negative\\nExample 3: "It's okay" -> Neutral\\n\\nTask: ${task}\\n\\nAnswer:`,
        'chain-of-thought': `Task: ${task}\\n\\nLet's think step by step:\\n1. First, identify key words\\n2. Analyze emotional tone\\n3. Determine overall sentiment\\n\\nAnswer:`,
        'self-consistency': `Task: ${task}\\n\\nLet's solve this in multiple ways and find the most consistent answer.\\n\\nApproach 1:\\nApproach 2:\\nApproach 3:\\n\\nFinal Answer:`
    };
    
    const prompt = prompts[technique];
    const quality = Math.random() * 0.3 + 0.7; // 0.7-1.0
    
    courseUtils.displayOutput({
        'Technique': technique,
        'Generated Prompt': prompt,
        'Estimated Quality': quality.toFixed(2),
        'Token Count': prompt.split(' ').length
    });
    
    updatePromptMetrics(technique, quality);
}

const promptHistory = [];

function updatePromptMetrics(technique, quality) {
    promptHistory.push({ technique, quality });
    
    const techniques = [...new Set(promptHistory.map(p => p.technique))];
    const avgByTechnique = techniques.map(t => {
        const scores = promptHistory.filter(p => p.technique === t).map(p => p.quality);
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    });
    
    courseUtils.createBarChart('promptChart', techniques, avgByTechnique, 'Avg Quality by Technique');
}
"""
    },
    
    3: {
        "title": "Chatbot Conversation Simulator",
        "description": "Build a conversational agent with memory",
        "controls": """
        <div class="control-group">
            <label>User Message:</label>
            <input type="text" id="userMessage" placeholder="Type your message...">
        </div>
        <button class="btn" onclick="sendMessage()">Send</button>
        <button class="btn btn-secondary" onclick="clearConversation()">Clear History</button>
        <div id="chatHistory" style="margin-top: 20px; max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px;"></div>
        """,
        "logic": """
const conversationHistory = [];

function sendMessage() {
    const message = document.getElementById('userMessage').value.trim();
    if (!message) return;
    
    conversationHistory.push({ role: 'user', content: message, timestamp: Date.now() });
    
    // Simple response logic
    const response = generateResponse(message);
    conversationHistory.push({ role: 'assistant', content: response, timestamp: Date.now() });
    
    updateChatDisplay();
    document.getElementById('userMessage').value = '';
    
    updateConversationMetrics();
}

function generateResponse(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi')) {
        return 'Hello! How can I help you today?';
    } else if (lower.includes('name')) {
        return 'I am an AI chatbot assistant. What would you like to know?';
    } else if (lower.includes('how are you')) {
        return 'I\\'m functioning well, thank you! How can I assist you?';
    } else if (lower.includes('bye')) {
        return 'Goodbye! Have a great day!';
    } else {
        return `I understand you said: "${message}". I'm here to help with any questions!`;
    }
}

function updateChatDisplay() {
    const chatDiv = document.getElementById('chatHistory');
    chatDiv.innerHTML = conversationHistory.map(msg => 
        `<div style="margin: 10px 0; padding: 8px; background: ${msg.role === 'user' ? '#e3f2fd' : '#f5f5f5'}; border-radius: 5px;">
            <strong>${msg.role === 'user' ? 'You' : 'Bot'}:</strong> ${msg.content}
        </div>`
    ).join('');
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function clearConversation() {
    conversationHistory.length = 0;
    updateChatDisplay();
    updateConversationMetrics();
}

function updateConversationMetrics() {
    const userMsgs = conversationHistory.filter(m => m.role === 'user').length;
    const botMsgs = conversationHistory.filter(m => m.role === 'assistant').length;
    
    document.getElementById('metrics').innerHTML = 
        courseUtils.createMetricCard('User Messages', userMsgs) +
        courseUtils.createMetricCard('Bot Responses', botMsgs) +
        courseUtils.createMetricCard('Total Turns', Math.floor(conversationHistory.length / 2));
}
"""
    },
    
    4: {
        "title": "State Management Visualizer",
        "description": "Track and visualize agent state changes",
        "controls": """
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
        """,
        "logic": """
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
"""
    },
    
    5: {
        "title": "Agent Chain Pipeline Builder",
        "description": "Create and execute multi-step agent chains",
        "controls": """
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
        """,
        "logic": """
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
"""
    },
    
    46: {
        "title": "Multi-Agent Collaboration System",
        "description": "Simulate multiple agents working together on tasks",
        "controls": """
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
        """,
        "logic": """
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
    const labels = agents.map(a => `${a.name}\\n(${a.role})`);
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
"""
    },
}

# Generate apps for courses 6-100 with appropriate templates
def generate_course_app(course_id, course_title, course_tags):
    """Generate appropriate app based on course topic"""
    
    # Use predefined template if available
    if course_id in COURSE_APPS:
        return COURSE_APPS[course_id]
    
    # Generate based on tags and title
    app = {
        "title": f"{course_title} Demo",
        "description": f"Interactive demonstration of {course_title.lower()}",
        "controls": "",
        "logic": ""
    }
    
    # Customize based on course tags
    if 'classification' in course_tags or 'sentiment' in course_tags:
        app["controls"] = """
        <div class="control-group">
            <label>Input Text:</label>
            <textarea id="inputText" rows="3" placeholder="Enter text to classify..."></textarea>
        </div>
        <button class="btn" onclick="classify()">Classify</button>
        """
        app["logic"] = """
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
"""
    
    elif 'rag' in course_tags or 'retrieval' in course_tags or 'search' in course_tags:
        app["controls"] = """
        <div class="control-group">
            <label>Query:</label>
            <input type="text" id="queryInput" placeholder="Enter search query...">
        </div>
        <button class="btn" onclick="search()">Search</button>
        """
        app["logic"] = """
const documents = [
    { id: 1, text: 'AI agents are autonomous systems', score: 0 },
    { id: 2, text: 'Machine learning powers modern AI', score: 0 },
    { id: 3, text: 'Natural language processing enables chatbots', score: 0 },
    { id: 4, text: 'Vector databases store embeddings', score: 0 },
    { id: 5, text: 'RAG combines retrieval and generation', score: 0 }
];

function search() {
    const query = document.getElementById('queryInput').value.toLowerCase();
    
    documents.forEach(doc => {
        const words = query.split(' ');
        doc.score = words.filter(w => doc.text.toLowerCase().includes(w)).length;
    });
    
    const results = documents
        .filter(d => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
    courseUtils.displayOutput({
        'Query': query,
        'Results Found': results.length,
        'Top Result': results[0]?.text || 'No matches',
        'Relevance Score': results[0]?.score || 0
    });
    
    updateSearchChart(results);
}

function updateSearchChart(results) {
    const labels = results.map((_, i) => `Doc ${i+1}`);
    const data = results.map(r => r.score);
    courseUtils.createBarChart('appChart', labels, data, 'Relevance Scores');
}
"""
    
    elif 'multi-agent' in course_tags or 'collaboration' in course_tags:
        app["controls"] = """
        <div class="control-group">
            <label>Task:</label>
            <input type="text" id="taskInput" placeholder="Enter task...">
        </div>
        <div class="control-group">
            <label>Number of Agents:</label>
            <input type="number" id="agentCount" min="2" max="5" value="3">
        </div>
        <button class="btn" onclick="distributeTask()">Distribute Task</button>
        """
        app["logic"] = """
function distributeTask() {
    const task = document.getElementById('taskInput').value;
    const count = parseInt(document.getElementById('agentCount').value);
    
    const agents = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Agent ${i + 1}`,
        progress: Math.random(),
        status: Math.random() > 0.2 ? 'completed' : 'in-progress'
    }));
    
    const completed = agents.filter(a => a.status === 'completed').length;
    const avgProgress = agents.reduce((sum, a) => sum + a.progress, 0) / count;
    
    courseUtils.displayOutput({
        'Task': task,
        'Total Agents': count,
        'Completed': completed,
        'Avg Progress': (avgProgress * 100).toFixed(1) + '%'
    });
    
    updateAgentChart(agents);
}

function updateAgentChart(agents) {
    const labels = agents.map(a => a.name);
    const data = agents.map(a => a.progress * 100);
    courseUtils.createBarChart('appChart', labels, data, 'Agent Progress (%)');
}
"""
    
    elif 'code' in course_tags or 'programming' in course_tags:
        app["controls"] = """
        <div class="control-group">
            <label>Task Description:</label>
            <textarea id="codeTask" rows="3" placeholder="Describe what code to generate...">Create a function to calculate fibonacci numbers</textarea>
        </div>
        <button class="btn" onclick="generateCode()">Generate Code</button>
        """
        app["logic"] = """
function generateCode() {
    const task = document.getElementById('codeTask').value;
    
    const templates = {
        'fibonacci': 'def fibonacci(n):\\n    if n <= 1: return n\\n    return fibonacci(n-1) + fibonacci(n-2)',
        'sort': 'def quicksort(arr):\\n    if len(arr) <= 1: return arr\\n    pivot = arr[0]\\n    return quicksort([x for x in arr[1:] if x < pivot]) + [pivot] + quicksort([x for x in arr[1:] if x >= pivot])',
        'default': 'def solution():\\n    # Generated code\\n    pass'
    };
    
    let code = templates.default;
    if (task.toLowerCase().includes('fibonacci')) code = templates.fibonacci;
    if (task.toLowerCase().includes('sort')) code = templates.sort;
    
    const lines = code.split('\\n').length;
    const chars = code.length;
    
    courseUtils.displayOutput({
        'Task': task,
        'Generated Code': code,
        'Lines': lines,
        'Characters': chars
    });
}
"""
    
    elif 'memory' in course_tags or 'storage' in course_tags:
        app["controls"] = """
        <div class="control-group">
            <label>Store Data:</label>
            <input type="text" id="memoryKey" placeholder="Key">
            <input type="text" id="memoryValue" placeholder="Value">
        </div>
        <button class="btn" onclick="storeMemory()">Store</button>
        <button class="btn" onclick="retrieveMemory()">Retrieve All</button>
        <button class="btn btn-secondary" onclick="clearMemory()">Clear</button>
        """
        app["logic"] = """
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
"""
    
    else:
        # Generic demo
        app["controls"] = """
        <div class="control-group">
            <label>Input:</label>
            <input type="text" id="genericInput" placeholder="Enter input...">
        </div>
        <button class="btn" onclick="process()">Process</button>
        """
        app["logic"] = """
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
"""
    
    return app


def create_app_file(folder_path, app_data):
    """Create app.js file in course folder"""
    
    app_content = f"""
// {app_data['title']}
// {app_data['description']}

document.addEventListener('DOMContentLoaded', () => {{
    initializeApp();
}});

function initializeApp() {{
    setupControls();
    setupVisualization();
}}

function setupControls() {{
    const controls = document.getElementById('demoControls');
    controls.innerHTML = `{app_data['controls']}`;
}}

function setupVisualization() {{
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}}

{app_data['logic']}
"""
    
    app_path = os.path.join(folder_path, 'app.js')
    with open(app_path, 'w', encoding='utf-8') as f:
        f.write(app_content.strip())
    
    return app_path


def main():
    """Generate apps for all 100 courses"""
    
    # Load course data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Read courses from courses-data.js
    courses_data_path = os.path.join(script_dir, 'courses-data.js')
    
    # Parse course data (simplified - assumes specific format)
    courses = []
    for i in range(1, 101):
        # Generate based on course number
        course_folders = [
            f for f in os.listdir(script_dir) 
            if f.startswith(f'course_{i:03d}_') and os.path.isdir(os.path.join(script_dir, f))
        ]
        
        if course_folders:
            folder = course_folders[0]
            folder_path = os.path.join(script_dir, folder)
            
            # Extract title from folder name
            title = folder.replace(f'course_{i:03d}_', '').replace('_', ' ').title()
            
            # Determine tags from folder name
            tags = folder.replace(f'course_{i:03d}_', '').split('_')
            
            # Generate app
            app_data = generate_course_app(i, title, tags)
            
            # Create app.js file
            app_path = create_app_file(folder_path, app_data)
            
            print(f"✓ Created app for Course {i}: {title}")
            courses.append({
                'id': i,
                'title': title,
                'folder': folder,
                'app_created': True
            })
        else:
            print(f"✗ Folder not found for Course {i}")
    
    print(f"\n{'='*60}")
    print(f"Generated {len(courses)} course apps successfully!")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
