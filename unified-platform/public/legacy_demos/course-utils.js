
// Shared utilities & SMART DEMO SYSTEM
// This file is loaded by all legacy demos (11-100)

window.courseUtils = window.courseUtils || {};

// --- Core Utils ---
function markCourseComplete() {
    console.log("Marking complete (simulated inside iframe)");
}

function displayOutput(data) {
    const output = document.getElementById('demoOutput');
    if (!output) return;
    output.innerHTML = '';

    if (typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
            const div = document.createElement('div');
            div.className = 'output-item';
            div.innerHTML = `
                <div class="output-label">${key}</div>
                <div class="output-value">${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</div>
            `;
            output.appendChild(div);
        });
    } else {
        output.innerHTML = `<div class="output-item"><div class="output-value">${data}</div></div>`;
    }
}

function createMetricCard(label, value) {
    return `
        <div class="metric-card">
            <div class="metric-value">${value}</div>
            <div class="metric-label">${label}</div>
        </div>
    `;
}

// --- Smart Demo Bootstrap ---

function bootstrapDemo() {
    const title = document.title.replace('Demo ', '') || 'Agent System';
    const container = document.querySelector('.demo-panel');
    if (!container) return;

    // Clear existing generic content
    container.innerHTML = '';

    const header = document.createElement('h3');
    header.innerHTML = `⚡ ${title} <span style="font-size:0.7em; opacity:0.6; font-weight:normal">(Interactive)</span>`;
    container.appendChild(header);

    // Heuristic Router
    const t = title.toLowerCase();

    if (t.includes('chat') || t.includes('conversation') || t.includes('debate') || t.includes('support') || t.includes('assistant')) {
        renderChatTemplate(container, title);
    } else if (t.includes('analysis') || t.includes('metric') || t.includes('tuning') || t.includes('classification') || t.includes('sentiment')) {
        renderAnalysisTemplate(container, title);
    } else if (t.includes('extraction') || t.includes('processing') || t.includes('summarization') || t.includes('generation') || t.includes('writing')) {
        renderProcessorTemplate(container, title);
    } else {
        renderStandardTemplate(container, title);
    }
}

// --- Templates ---

// 1. Chat Template
function renderChatTemplate(container, title) {
    const chatBox = document.createElement('div');
    chatBox.className = 'chat-container';
    chatBox.innerHTML = `
        <div class="chat-messages" id="chatMsgs">
            <div class="chat-bubble chat-agent">Hello! I am the <strong>${title}</strong>. How can I assist you today?</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chatInput" placeholder="Type a message..." />
            <button class="btn" style="width:auto; margin:0;" id="sendBtn">Send</button>
        </div>
    `;
    container.appendChild(chatBox);

    const msgs = chatBox.querySelector('#chatMsgs');
    const input = chatBox.querySelector('#chatInput');
    const send = chatBox.querySelector('#sendBtn');

    const handleSend = async () => {
        const txt = input.value.trim();
        if (!txt) return;

        // Add User Msg
        msgs.innerHTML += `<div class="chat-bubble chat-user">${txt}</div>`;
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        // Simulate Thinking
        const loadingId = 'load-' + Date.now();
        msgs.innerHTML += `<div class="chat-bubble chat-agent" id="${loadingId}"><span class="loading-spinner"></span> Thinking...</div>`;
        msgs.scrollTop = msgs.scrollHeight;

        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        // Agent Response
        const response = generateMockResponse(title, txt);
        msgs.innerHTML += `<div class="chat-bubble chat-agent">${response}</div>`;
        msgs.scrollTop = msgs.scrollHeight;
    };

    send.onclick = handleSend;
    input.onkeypress = (e) => e.key === 'Enter' && handleSend();
}

// 2. Analysis/Classification Template
function renderAnalysisTemplate(container, title) {
    container.innerHTML += `
        <div class="control-group">
            <label>Data / Text to Analyze</label>
            <textarea id="inputData" rows="4" placeholder="Enter text or data sample...">Sample input for analysis...</textarea>
        </div>
        <div class="control-group">
            <label>Model Sensitivity</label>
            <select id="sensitivity">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
            </select>
        </div>
        <button class="btn" id="runAnalysis">Run Analysis</button>
        <div id="demoOutput"></div>
        <div style="margin-top:20px"><canvas id="analysisChart"></canvas></div>
    `;

    document.getElementById('runAnalysis').onclick = async () => {
        const btn = document.getElementById('runAnalysis');
        const txt = document.getElementById('inputData').value;

        btn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 1500));

        const score = Math.random() * 0.8 + 0.2;
        const confidence = (score * 100).toFixed(1);

        displayOutput({
            "Status": "Complete",
            "Classification": score > 0.5 ? "Positive / High" : "Negative / Low",
            "Confidence": confidence + "%",
            "Processing Time": Math.floor(Math.random() * 200) + 50 + "ms"
        });

        // Chart
        if (window.Chart) {
            const ctx = document.getElementById('analysisChart');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Metric A', 'Metric B', 'Metric C'],
                    datasets: [{
                        label: 'Analysis Scores',
                        data: [Math.random(), Math.random(), score],
                        backgroundColor: ['#6366f1', '#818cf8', '#4f46e5']
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }

        btn.innerHTML = 'Run Analysis';
        btn.disabled = false;
    };
}

// 3. Processor Template (Summarization, Extraction)
function renderProcessorTemplate(container, title) {
    container.innerHTML += `
        <div class="control-group">
            <label>Input Content</label>
            <textarea id="inputText" rows="6" placeholder="Paste content here...">AI agents are autonomous systems that perceive their environment...</textarea>
        </div>
        <div class="metric-grid" id="statsGrid"></div>
        <button class="btn" id="processBtn">Process Content</button>
        <div class="control-group" style="margin-top:15px">
            <label>Result</label>
            <div id="resultBox" style="background:#f8fafc; padding:15px; border-radius:6px; border:1px solid #e2e8f0; min-height:80px; color:#334155;">
                <em>Results will appear here...</em>
            </div>
        </div>
    `;

    document.getElementById('processBtn').onclick = async () => {
        const btn = document.getElementById('processBtn');
        btn.innerHTML = '<span class="loading-spinner"></span> Processing...';
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 2000));

        const resultBox = document.getElementById('resultBox');
        resultBox.innerHTML = `<strong>Processed Output:</strong><br/>Here is the simulated output for ${title}. The agent successfully parsed the input and generated this structured response based on internal logic.`;

        document.getElementById('statsGrid').innerHTML = `
            ${createMetricCard('Tokens', Math.floor(Math.random() * 500))}
            ${createMetricCard('Latency', Math.floor(Math.random() * 300) + 'ms')}
        `;

        btn.innerHTML = 'Process Content';
        btn.disabled = false;
    };
}

// 4. Standard Fallback
function renderStandardTemplate(container, title) {
    container.innerHTML += `
        <div class="control-group">
            <label>Configuration</label>
            <select>
                <option>Default Mode</option>
                <option>Advanced Mode</option>
            </select>
        </div>
        <div class="control-group">
            <label>Input Parameters</label>
            <input type="text" placeholder="Enter parameters..." value="--optimize --verbose" />
        </div>
        <button class="btn" id="execBtn">Execute Agent</button>
        <div id="demoOutput"></div>
        <canvas id="perfChart"></canvas>
    `;

    document.getElementById('execBtn').onclick = async () => {
        const btn = document.getElementById('execBtn');
        btn.innerHTML = '<span class="loading-spinner"></span> Executing...';
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 1200));

        displayOutput({
            "Action": "Executed successfully",
            "Agent ID": "AGT-" + Math.floor(Math.random() * 9999),
            "State": "Idle",
            "Result": "Task completed with 0 errors."
        });

        if (window.Chart) {
            new Chart(document.getElementById('perfChart'), {
                type: 'line',
                data: {
                    labels: ['T1', 'T2', 'T3', 'T4', 'T5'],
                    datasets: [{
                        label: 'Performance',
                        data: [20, 45, 30, 80, 65],
                        borderColor: '#4f46e5',
                        tension: 0.4
                    }]
                }
            });
        }

        btn.innerHTML = 'Execute Agent';
        btn.disabled = false;
    };
}

// --- Mock Response Generator ---
function generateMockResponse(context, input) {
    const responses = [
        "I've processed that request based on my internal models.",
        "That's an interesting input. Here is my analysis...",
        "I'm optimizing the workflow for that specific parameter.",
        "Acknowledged. Executing next step in the agent chain.",
        "Based on the context of " + context + ", I recommend proceeding."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Export
window.courseUtils = {
    ...window.courseUtils,
    markCourseComplete,
    displayOutput,
    createMetricCard,
    bootstrapDemo
};
