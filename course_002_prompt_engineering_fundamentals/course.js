
// Course 2: Prompt Engineering Demo
document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['What is Prompt Engineering?', 'Core Principles', 'Advanced Techniques', 'Best Practices'];
    courseUtils.generateTOC(sections);
    courseUtils.updateProgress(0, sections.length);
}

function setupDemo() {
    const controls = document.getElementById('demoControls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Prompt Technique:</label>
            <select id="technique">
                <option value="basic">Basic Prompt</option>
                <option value="fewshot">Few-Shot Learning</option>
                <option value="cot">Chain-of-Thought</option>
                <option value="role">Role Assignment</option>
            </select>
        </div>
        <div class="control-group">
            <label>Your Prompt:</label>
            <textarea id="userPrompt" placeholder="Enter your prompt here..."></textarea>
        </div>
        <button class="btn" onclick="testPrompt()">Test Prompt</button>
    `;
}

async function testPrompt() {
    const technique = document.getElementById('technique').value;
    const userPrompt = document.getElementById('userPrompt').value;
    
    if (!userPrompt) {
        alert('Please enter a prompt');
        return;
    }
    
    courseUtils.showLoading('demoOutput');
    
    // Simulate LLM call
    const result = await courseUtils.simulateLLMCall(userPrompt, 1500);
    
    // Analyze prompt quality
    const analysis = analyzePrompt(userPrompt, technique);
    
    courseUtils.displayOutput({
        'Technique': technique,
        'Prompt Length': userPrompt.length + ' characters',
        'Estimated Tokens': result.tokens,
        'Quality Score': analysis.score + '/100',
        'Suggestions': analysis.suggestions.join(', '),
        'Simulated Response': result.response
    });
    
    // Display metrics
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = courseUtils.createMetricCard('Quality Score', analysis.score + '/100');
    visuals.innerHTML += courseUtils.createMetricCard('Token Count', result.tokens);
}

function analyzePrompt(prompt, technique) {
    let score = 50;
    const suggestions = [];
    
    // Check length
    if (prompt.length > 100) score += 10;
    else suggestions.push('Add more detail');
    
    // Check for specificity
    if (prompt.includes('specific') || prompt.includes('exactly')) score += 15;
    else suggestions.push('Be more specific');
    
    // Check for context
    if (prompt.toLowerCase().includes('context') || prompt.length > 200) score += 10;
    else suggestions.push('Provide context');
    
    // Technique bonus
    if (technique === 'fewshot' && prompt.includes('example')) score += 15;
    if (technique === 'cot' && prompt.includes('step')) score += 15;
    if (technique === 'role' && prompt.includes('you are')) score += 15;
    
    return { score: Math.min(score, 100), suggestions };
}
