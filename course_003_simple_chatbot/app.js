// Chatbot Conversation Simulator
// Build a conversational agent with memory

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
            <label>User Message:</label>
            <input type="text" id="userMessage" placeholder="Type your message...">
        </div>
        <button class="btn" onclick="sendMessage()">Send</button>
        <button class="btn btn-secondary" onclick="clearConversation()">Clear History</button>
        <div id="chatHistory" style="margin-top: 20px; max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px;"></div>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


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
        return 'I\'m functioning well, thank you! How can I assist you?';
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