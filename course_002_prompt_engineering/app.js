// Prompt Engineering Playground
// Experiment with different prompting techniques

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
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


function generatePrompt() {
    const technique = document.getElementById('technique').value;
    const task = document.getElementById('taskInput').value;
    
    const prompts = {
        'zero-shot': `Task: ${task}\n\nAnswer:`,
        'few-shot': `Example 1: "Great service!" -> Positive\nExample 2: "Terrible experience" -> Negative\nExample 3: "It's okay" -> Neutral\n\nTask: ${task}\n\nAnswer:`,
        'chain-of-thought': `Task: ${task}\n\nLet's think step by step:\n1. First, identify key words\n2. Analyze emotional tone\n3. Determine overall sentiment\n\nAnswer:`,
        'self-consistency': `Task: ${task}\n\nLet's solve this in multiple ways and find the most consistent answer.\n\nApproach 1:\nApproach 2:\nApproach 3:\n\nFinal Answer:`
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