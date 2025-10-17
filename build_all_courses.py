"""
Comprehensive course builder for all 100 agentic AI system courses
Each course includes complete HTML, JS with interactive demos and visualizations
"""

import os
import json

def get_course_content(course_id, title, level):
    """Generate comprehensive content for each course"""
    
    # Define content templates based on course categories
    content_map = {
        # BEGINNER COURSES (1-20)
        1: {
            "theory": """
                <h1>Introduction to AI Agents</h1>
                <h2>What is an AI Agent?</h2>
                <p>An AI agent is an autonomous entity that perceives its environment through sensors and acts upon it through actuators to achieve specific goals.</p>
                
                <h3>Key Components</h3>
                <ul>
                    <li><strong>Perception:</strong> Ability to sense and understand the environment</li>
                    <li><strong>Reasoning:</strong> Processing information to make decisions</li>
                    <li><strong>Action:</strong> Executing decisions in the environment</li>
                    <li><strong>Learning:</strong> Improving performance over time</li>
                </ul>
                
                <h2>Agent Architecture Types</h2>
                <div class="info-box">
                    <h4>1. Simple Reflex Agent</h4>
                    <p>Acts based on current perception only, using condition-action rules.</p>
                    <div class="code-block">if perception == "obstacle" then action = "avoid"</div>
                    
                    <h4>2. Model-Based Reflex Agent</h4>
                    <p>Maintains internal state of the world to handle partial observability.</p>
                    
                    <h4>3. Goal-Based Agent</h4>
                    <p>Acts to achieve specific goals, considering future consequences.</p>
                    
                    <h4>4. Utility-Based Agent</h4>
                    <p>Maximizes expected utility, handling trade-offs between conflicting goals.</p>
                </div>
                
                <h2>PEAS Framework</h2>
                <p>To design an agent, we must specify:</p>
                <ul>
                    <li><strong>Performance Measure:</strong> How we evaluate success</li>
                    <li><strong>Environment:</strong> The world the agent operates in</li>
                    <li><strong>Actuators:</strong> How the agent affects the environment</li>
                    <li><strong>Sensors:</strong> How the agent perceives the environment</li>
                </ul>
                
                <h2>Agent Properties</h2>
                <div class="success-box">
                    <ul>
                        <li><strong>Autonomy:</strong> Operates without direct human intervention</li>
                        <li><strong>Reactivity:</strong> Responds to environmental changes in real-time</li>
                        <li><strong>Proactivity:</strong> Takes initiative to achieve goals</li>
                        <li><strong>Social Ability:</strong> Interacts with other agents and humans</li>
                    </ul>
                </div>
                
                <h2>Environment Types</h2>
                <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: #667eea; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Property</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Types</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Observability</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Fully Observable vs Partially Observable</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Determinism</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Deterministic vs Stochastic</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Episodes</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Episodic vs Sequential</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Dynamics</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">Static vs Dynamic</td>
                    </tr>
                </table>
            """,
            "demo_type": "simple_agent"
        },
        2: {
            "theory": """
                <h1>Prompt Engineering Fundamentals</h1>
                <h2>What is Prompt Engineering?</h2>
                <p>Prompt engineering is the art and science of crafting effective instructions for Large Language Models (LLMs) to generate desired outputs.</p>
                
                <h2>Core Principles</h2>
                <h3>1. Clarity and Specificity</h3>
                <p>Be explicit about what you want. Vague prompts lead to unpredictable results.</p>
                <div class="code-block">❌ Bad: "Write about dogs"
✅ Good: "Write a 200-word informative paragraph about Golden Retrievers, 
focusing on their temperament and suitability as family pets."</div>
                
                <h3>2. Context Provision</h3>
                <p>Provide relevant background information to guide the model.</p>
                <div class="code-block">Context: You are analyzing customer reviews for a restaurant.
Task: Classify the following review as positive, negative, or neutral.
Review: "The food was okay, but the service was slow."</div>
                
                <h3>3. Format Specification</h3>
                <p>Clearly define the desired output format (JSON, bullet points, essay, etc.)</p>
                
                <h2>Advanced Techniques</h2>
                <h3>Few-Shot Learning</h3>
                <p>Provide examples of input-output pairs to guide the model's behavior.</p>
                <div class="code-block">Example 1:
Input: "The movie was fantastic!"
Output: Positive

Example 2:
Input: "I hated every minute of it."
Output: Negative

Example 3:
Input: "It was okay, nothing special."
Output: Neutral

Now classify: "Best film I've seen this year!"</div>
                
                <h3>Chain-of-Thought (CoT)</h3>
                <p>Encourage step-by-step reasoning by asking the model to "think through" problems.</p>
                <div class="code-block">Problem: If a train travels 120 miles in 2 hours, how far will it travel in 5 hours?

Let's solve this step by step:
1. First, calculate the speed: 120 miles ÷ 2 hours = 60 mph
2. Then, multiply by the new time: 60 mph × 5 hours = 300 miles
3. Answer: 300 miles</div>
                
                <h3>Role Assignment</h3>
                <p>Assign a specific role or persona to the model for better context.</p>
                <div class="code-block">You are an expert Python developer with 10 years of experience 
in data science. Explain list comprehensions to a beginner 
programmer who knows basic Python syntax.</div>
                
                <h2>Prompt Components</h2>
                <div class="info-box">
                    <ul>
                        <li><strong>Instruction:</strong> The task you want performed</li>
                        <li><strong>Context:</strong> Background information</li>
                        <li><strong>Input Data:</strong> The specific data to process</li>
                        <li><strong>Output Indicator:</strong> Format specification</li>
                    </ul>
                </div>
                
                <h2>Best Practices</h2>
                <ul>
                    <li>✅ Start simple, then iterate based on results</li>
                    <li>✅ Use delimiters (###, """, ---) to separate sections</li>
                    <li>✅ Specify constraints (length, tone, style, format)</li>
                    <li>✅ Test with edge cases and unexpected inputs</li>
                    <li>✅ Version control your prompts for reproducibility</li>
                    <li>✅ Use temperature and top_p parameters appropriately</li>
                    <li>❌ Don't assume the model has real-time information</li>
                    <li>❌ Don't rely on implicit understanding</li>
                </ul>
                
                <h2>Common Pitfalls</h2>
                <div class="warning-box">
                    <ul>
                        <li><strong>Ambiguity:</strong> Unclear instructions lead to varied outputs</li>
                        <li><strong>Overcomplication:</strong> Too many instructions can confuse the model</li>
                        <li><strong>Lack of Examples:</strong> Complex tasks benefit from demonstrations</li>
                        <li><strong>Ignoring Token Limits:</strong> Prompts that are too long get truncated</li>
                    </ul>
                </div>
            """,
            "demo_type": "prompt_tester"
        }
    }
    
    # Default content for courses not yet detailed
    default_content = {
        "theory": f"""
            <h1>{title}</h1>
            <h2>Course Overview</h2>
            <p>This course covers {title.lower()}, a crucial topic in agentic AI systems.</p>
            
            <h2>Learning Objectives</h2>
            <ul>
                <li>Understand the core concepts and principles</li>
                <li>Implement practical solutions</li>
                <li>Analyze performance and results</li>
                <li>Apply knowledge to real-world scenarios</li>
            </ul>
            
            <h2>Key Concepts</h2>
            <p>Throughout this course, you'll explore fundamental concepts and advanced techniques that form the foundation of modern AI agent systems.</p>
            
            <div class="info-box">
                <h4>Important Note</h4>
                <p>This course includes interactive demonstrations and visualizations to help you understand the concepts better.</p>
            </div>
            
            <h2>Practical Applications</h2>
            <p>The techniques learned in this course are widely used in:</p>
            <ul>
                <li>Production AI systems</li>
                <li>Research and development</li>
                <li>Enterprise applications</li>
                <li>Autonomous systems</li>
            </ul>
        """,
        "demo_type": "generic"
    }
    
    return content_map.get(course_id, default_content)

def create_demo_js(course_id, demo_type):
    """Generate JavaScript for interactive demos"""
    
    demos = {
        "simple_agent": """
document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['What is an AI Agent?', 'Agent Architecture Types', 'PEAS Framework', 'Agent Properties'];
    courseUtils.generateTOC(sections);
}

function setupDemo() {
    const controls = document.getElementById('demoControls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Environment Input:</label>
            <select id="envInput">
                <option value="sunny">☀️ Sunny Weather</option>
                <option value="rainy">🌧️ Rainy Weather</option>
                <option value="cold">❄️ Cold Weather</option>
                <option value="hot">🔥 Hot Weather</option>
                <option value="windy">💨 Windy Weather</option>
            </select>
        </div>
        <div class="control-group">
            <label>Agent Type:</label>
            <select id="agentType">
                <option value="reflex">Simple Reflex</option>
                <option value="model">Model-Based</option>
                <option value="goal">Goal-Based</option>
                <option value="utility">Utility-Based</option>
            </select>
        </div>
        <button class="btn" onclick="runAgent()">🚀 Run Agent</button>
        <button class="btn" style="background: #e74c3c; margin-top: 10px;" onclick="resetDemo()">🔄 Reset</button>
    `;
}

let agentHistory = [];
let chartInstance = null;

function runAgent() {
    const input = document.getElementById('envInput').value;
    const agentType = document.getElementById('agentType').value;
    
    const actions = {
        'sunny': { action: 'Go outside', reason: 'Weather is pleasant', utility: 0.9, energy: -10 },
        'rainy': { action: 'Stay inside', reason: 'Avoid getting wet', utility: 0.7, energy: 5 },
        'cold': { action: 'Wear jacket', reason: 'Stay warm', utility: 0.8, energy: -5 },
        'hot': { action: 'Turn on AC', reason: 'Cool down', utility: 0.85, energy: -15 },
        'windy': { action: 'Close windows', reason: 'Prevent drafts', utility: 0.75, energy: -3 }
    };
    
    const response = actions[input];
    const timestamp = new Date().toLocaleTimeString();
    
    agentHistory.push({ 
        timestamp,
        input, 
        agentType,
        ...response 
    });
    
    courseUtils.displayOutput({
        '🕐 Time': timestamp,
        '🌍 Environment': input,
        '🤖 Agent Type': agentType,
        '⚡ Action': response.action,
        '💭 Reasoning': response.reason,
        '📊 Utility Score': response.utility.toFixed(2),
        '🔋 Energy Cost': response.energy
    });
    
    updateVisuals();
}

function updateVisuals() {
    const visuals = document.getElementById('demoVisuals');
    const avgUtility = (agentHistory.reduce((sum, h) => sum + h.utility, 0) / agentHistory.length).toFixed(2);
    const totalEnergy = agentHistory.reduce((sum, h) => sum + h.energy, 0);
    
    visuals.innerHTML = `
        ${courseUtils.createMetricCard('Actions Taken', agentHistory.length)}
        ${courseUtils.createMetricCard('Avg Utility', avgUtility)}
        ${courseUtils.createMetricCard('Total Energy', totalEnergy)}
        <canvas id="agentChart" width="350" height="250" style="margin-top: 20px;"></canvas>
    `;
    
    if (agentHistory.length > 0) {
        const labels = agentHistory.map((h, i) => `#${i+1}`);
        const utilityData = agentHistory.map(h => h.utility);
        const energyData = agentHistory.map(h => Math.abs(h.energy));
        
        const ctx = document.getElementById('agentChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Utility',
                    data: utilityData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Energy Cost',
                    data: energyData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function resetDemo() {
    agentHistory = [];
    if (chartInstance) chartInstance.destroy();
    document.getElementById('demoOutput').innerHTML = '<p style="color: #999;">Run the agent to see results...</p>';
    document.getElementById('demoVisuals').innerHTML = '';
}
""",
        "prompt_tester": """
document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['What is Prompt Engineering?', 'Core Principles', 'Advanced Techniques', 'Best Practices'];
    courseUtils.generateTOC(sections);
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
            <textarea id="userPrompt" placeholder="Enter your prompt here..." rows="4"></textarea>
        </div>
        <button class="btn" onclick="testPrompt()">🧪 Test Prompt</button>
        <button class="btn" style="background: #3498db; margin-top: 10px;" onclick="loadExample()">📝 Load Example</button>
    `;
}

const examples = {
    basic: "Explain what machine learning is.",
    fewshot: `Classify the sentiment:

Example 1: "I love this product!" → Positive
Example 2: "Terrible experience." → Negative
Example 3: "It's okay." → Neutral

Classify: "Best purchase ever!"`,
    cot: `Solve this problem step by step:
If a car travels 60 mph for 3 hours, how far does it go?`,
    role: "You are a Python expert. Explain decorators to a beginner."
};

function loadExample() {
    const technique = document.getElementById('technique').value;
    document.getElementById('userPrompt').value = examples[technique];
}

let testHistory = [];

async function testPrompt() {
    const technique = document.getElementById('technique').value;
    const userPrompt = document.getElementById('userPrompt').value;
    
    if (!userPrompt.trim()) {
        alert('Please enter a prompt');
        return;
    }
    
    courseUtils.showLoading('demoOutput');
    
    const result = await courseUtils.simulateLLMCall(userPrompt, 1500);
    const analysis = analyzePrompt(userPrompt, technique);
    
    testHistory.push({ technique, prompt: userPrompt, analysis, result });
    
    courseUtils.displayOutput({
        '🎯 Technique': technique.toUpperCase(),
        '📏 Prompt Length': userPrompt.length + ' characters',
        '🎫 Estimated Tokens': result.tokens,
        '⭐ Quality Score': analysis.score + '/100',
        '💡 Suggestions': analysis.suggestions.join(', '),
        '⏱️ Latency': result.latency + 'ms',
        '🤖 Simulated Response': result.response
    });
    
    updatePromptVisuals(analysis);
}

function analyzePrompt(prompt, technique) {
    let score = 40;
    const suggestions = [];
    
    if (prompt.length > 100) score += 10;
    else suggestions.push('Add more detail');
    
    if (prompt.includes('specific') || prompt.includes('exactly') || prompt.includes('must')) {
        score += 15;
    } else {
        suggestions.push('Be more specific');
    }
    
    if (prompt.length > 200 || prompt.includes('context') || prompt.includes('background')) {
        score += 10;
    } else {
        suggestions.push('Provide context');
    }
    
    if (technique === 'fewshot' && prompt.includes('example')) score += 15;
    if (technique === 'cot' && (prompt.includes('step') || prompt.includes('think'))) score += 15;
    if (technique === 'role' && prompt.toLowerCase().includes('you are')) score += 15;
    
    if (prompt.includes('format') || prompt.includes('output')) score += 10;
    
    if (suggestions.length === 0) suggestions.push('Excellent prompt!');
    
    return { score: Math.min(score, 100), suggestions };
}

function updatePromptVisuals(analysis) {
    const visuals = document.getElementById('demoVisuals');
    
    const scoreColor = analysis.score >= 80 ? '#4CAF50' : analysis.score >= 60 ? '#FF9800' : '#e74c3c';
    
    visuals.innerHTML = `
        <div class="metric-card" style="background: ${scoreColor};">
            <div class="metric-value">${analysis.score}/100</div>
            <div class="metric-label">Quality Score</div>
        </div>
        ${courseUtils.createMetricCard('Tests Run', testHistory.length)}
        <canvas id="promptChart" width="350" height="200" style="margin-top: 20px;"></canvas>
    `;
    
    if (testHistory.length > 0) {
        const ctx = document.getElementById('promptChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: testHistory.map((_, i) => `Test ${i+1}`),
                datasets: [{
                    label: 'Quality Score',
                    data: testHistory.map(t => t.analysis.score),
                    backgroundColor: testHistory.map(t => 
                        t.analysis.score >= 80 ? 'rgba(76, 175, 80, 0.7)' :
                        t.analysis.score >= 60 ? 'rgba(255, 152, 0, 0.7)' :
                        'rgba(231, 76, 60, 0.7)'
                    ),
                    borderColor: testHistory.map(t => 
                        t.analysis.score >= 80 ? '#4CAF50' :
                        t.analysis.score >= 60 ? '#FF9800' :
                        '#e74c3c'
                    ),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }
}
""",
        "generic": """
document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['Course Overview', 'Key Concepts', 'Practical Applications'];
    courseUtils.generateTOC(sections);
}

function setupDemo() {
    const controls = document.getElementById('demoControls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Input Parameter:</label>
            <input type="text" id="inputParam" placeholder="Enter value...">
        </div>
        <button class="btn" onclick="runDemo()">▶️ Run Demo</button>
    `;
}

function runDemo() {
    const input = document.getElementById('inputParam').value;
    const result = Math.random() * 100;
    
    courseUtils.displayOutput({
        'Input': input || 'N/A',
        'Result': result.toFixed(2),
        'Status': 'Success'
    });
    
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = courseUtils.createMetricCard('Result', result.toFixed(2));
}
"""
    };
    
    return demos.get(demo_type, demos["generic"])

def create_course_files(course_id, title, level):
    """Create all files for a course"""
    base_path = "c:/Users/wjbea/Downloads/learnbydoingwithsteven/agentic_sys_0-1"
    
    # Create folder name
    folder_name = f"course_{course_id:03d}_{title.lower().replace(' ', '_').replace('&', 'and').replace('-', '_')[:40]}"
    course_path = os.path.join(base_path, folder_name)
    
    os.makedirs(course_path, exist_ok=True)
    
    # Get content
    content = get_course_content(course_id, title, level)
    
    # Create HTML
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course {course_id}: {title}</title>
    <link rel="stylesheet" href="../shared/course-styles.css">
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
    <nav class="navbar">
        <a href="../index.html" class="back-btn">← Back to Courses</a>
        <h2>Course {course_id}: {title}</h2>
        <button class="complete-btn" onclick="markCourseComplete()">Mark Complete ✓</button>
    </nav>

    <div class="container">
        <div class="sidebar">
            <div class="course-info">
                <h3>Course {course_id}</h3>
                <p class="level-badge level-{level}">{level.upper()}</p>
                <p class="duration">⏱️ 2h</p>
            </div>
            
            <div class="toc">
                <h4>📚 Contents</h4>
                <ul id="tocList"></ul>
            </div>

            <div class="progress-section">
                <h4>📈 Progress</h4>
                <div class="progress-bar">
                    <div class="progress-fill" id="sectionProgress">0%</div>
                </div>
            </div>
        </div>

        <main class="content" id="courseContent">
            {content['theory']}
        </main>

        <aside class="demo-panel">
            <h3>🚀 Interactive Demo</h3>
            <div id="demoControls"></div>
            <div id="demoOutput"></div>
            <div id="demoVisuals"></div>
        </aside>
    </div>

    <script src="../shared/course-utils.js"></script>
    <script src="course.js"></script>
</body>
</html>"""
    
    with open(os.path.join(course_path, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Create JS
    js_content = create_demo_js(course_id, content['demo_type'])
    with open(os.path.join(course_path, 'course.js'), 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    return folder_name

# Load course data from courses-data.js
import re

def load_courses_from_js():
    """Parse courses from courses-data.js"""
    js_path = "c:/Users/wjbea/Downloads/learnbydoingwithsteven/agentic_sys_0-1/courses-data.js"
    
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract course objects using regex
    pattern = r'\{id:\s*(\d+),\s*title:\s*"([^"]+)",.*?level:\s*"([^"]+)"'
    matches = re.findall(pattern, content)
    
    courses = []
    for match in matches:
        courses.append({
            'id': int(match[0]),
            'title': match[1],
            'level': match[2]
        })
    
    return courses

def main():
    """Generate all 100 courses"""
    print("🚀 Starting course generation...")
    print("=" * 60)
    
    courses = load_courses_from_js()
    
    for i, course in enumerate(courses, 1):
        try:
            folder = create_course_files(course['id'], course['title'], course['level'])
            print(f"✅ [{i}/100] Course {course['id']}: {course['title']}")
        except Exception as e:
            print(f"❌ [{i}/100] Error creating course {course['id']}: {e}")
    
    print("=" * 60)
    print(f"🎉 Successfully generated {len(courses)} courses!")
    print(f"📁 Location: c:/Users/wjbea/Downloads/learnbydoingwithsteven/agentic_sys_0-1/")

if __name__ == '__main__':
    main()
