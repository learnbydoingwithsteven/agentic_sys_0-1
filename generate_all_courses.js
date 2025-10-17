const fs = require('fs');
const path = require('path');

// Load courses data
const coursesDataPath = './courses-data.js';
const coursesData = fs.readFileSync(coursesDataPath, 'utf8');

// Extract courses array
const coursesMatch = coursesData.match(/const courses = \[([\s\S]*)\];/);
if (!coursesMatch) {
    console.error('Could not parse courses data');
    process.exit(1);
}

// Parse courses (simplified - assumes consistent format)
const coursesText = coursesMatch[1];
const courseMatches = coursesText.matchAll(/\{id:\s*(\d+),\s*title:\s*"([^"]+)",.*?level:\s*"([^"]+)".*?folder:\s*"([^"]+)"/g);

const courses = Array.from(courseMatches).map(match => ({
    id: parseInt(match[1]),
    title: match[2],
    level: match[3],
    folder: match[4]
}));

console.log(`Found ${courses.length} courses to generate`);

// HTML template
function generateHTML(course) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course ${course.id}: ${course.title}</title>
    <link rel="stylesheet" href="../shared/course-styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
    <nav class="navbar">
        <a href="../index.html" class="back-btn">← Back to Courses</a>
        <h2>Course ${course.id}: ${course.title}</h2>
        <button class="complete-btn" onclick="markCourseComplete()">Mark Complete ✓</button>
    </nav>

    <div class="container">
        <div class="sidebar">
            <div class="course-info">
                <h3>Course ${course.id}</h3>
                <p class="level-badge level-${course.level}">${course.level.toUpperCase()}</p>
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

        <main class="content">
            <h1>${course.title}</h1>
            
            <h2>Course Overview</h2>
            <p>Welcome to Course ${course.id}: ${course.title}. This course is part of the ${course.level} level curriculum in our comprehensive agentic AI systems program.</p>
            
            <div class="info-box">
                <h4>What You'll Learn</h4>
                <ul>
                    <li>Core concepts and principles of ${course.title.toLowerCase()}</li>
                    <li>Practical implementation techniques</li>
                    <li>Real-world applications and use cases</li>
                    <li>Best practices and common pitfalls</li>
                </ul>
            </div>
            
            <h2>Key Concepts</h2>
            <p>This course covers essential topics in ${course.title.toLowerCase()}, providing you with both theoretical knowledge and practical skills.</p>
            
            <h3>Fundamentals</h3>
            <p>Understanding the foundational principles is crucial for mastering ${course.title.toLowerCase()}. We'll explore:</p>
            <ul>
                <li>Core architecture and design patterns</li>
                <li>Implementation strategies</li>
                <li>Performance considerations</li>
                <li>Integration with other systems</li>
            </ul>
            
            <h3>Advanced Topics</h3>
            <p>Building on the fundamentals, we'll dive into advanced concepts:</p>
            <ul>
                <li>Optimization techniques</li>
                <li>Scalability patterns</li>
                <li>Error handling and recovery</li>
                <li>Production deployment</li>
            </ul>
            
            <h2>Practical Applications</h2>
            <div class="success-box">
                <h4>Real-World Use Cases</h4>
                <p>The techniques learned in this course are widely used in:</p>
                <ul>
                    <li>Enterprise AI systems</li>
                    <li>Production applications</li>
                    <li>Research and development</li>
                    <li>Autonomous systems</li>
                </ul>
            </div>
            
            <h2>Implementation Example</h2>
            <div class="code-block">// Example implementation
class AgentSystem {
    constructor(config) {
        this.config = config;
        this.state = {};
    }
    
    async process(input) {
        // Process input
        const result = await this.execute(input);
        return result;
    }
    
    async execute(input) {
        // Implementation details
        return { success: true, data: input };
    }
}</div>
            
            <h2>Best Practices</h2>
            <ul>
                <li>✅ Start with clear requirements and goals</li>
                <li>✅ Implement comprehensive error handling</li>
                <li>✅ Monitor performance and optimize</li>
                <li>✅ Test thoroughly before deployment</li>
                <li>✅ Document your implementation</li>
                <li>❌ Don't skip validation steps</li>
                <li>❌ Avoid over-complication</li>
            </ul>
            
            <h2>Next Steps</h2>
            <p>After completing this course, you'll be ready to:</p>
            <ol>
                <li>Implement ${course.title.toLowerCase()} in your projects</li>
                <li>Optimize and scale your solutions</li>
                <li>Integrate with other AI systems</li>
                <li>Move on to more advanced topics</li>
            </ol>
            
            <div class="warning-box">
                <strong>Important:</strong> Make sure to complete the interactive demo to reinforce your learning!
            </div>
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
</html>`;
}

// JS template
function generateJS(course) {
    return `// Course ${course.id}: ${course.title}

document.addEventListener('DOMContentLoaded', () => {
    initializeCourse();
    setupDemo();
});

function initializeCourse() {
    const sections = ['Course Overview', 'Key Concepts', 'Practical Applications', 'Best Practices'];
    courseUtils.generateTOC(sections);
}

function setupDemo() {
    const controls = document.getElementById('demoControls');
    controls.innerHTML = \`
        <h4 style="margin-bottom: 15px;">🎮 ${course.title} Demo</h4>
        <div class="control-group">
            <label>Input Parameter:</label>
            <input type="text" id="inputParam" placeholder="Enter value..." value="test input">
        </div>
        <div class="control-group">
            <label>Processing Mode:</label>
            <select id="processingMode">
                <option value="fast">Fast Mode</option>
                <option value="balanced">Balanced Mode</option>
                <option value="accurate">Accurate Mode</option>
            </select>
        </div>
        <div class="control-group">
            <label>Iterations:</label>
            <input type="range" id="iterations" min="1" max="10" value="5">
            <span id="iterValue">5</span>
        </div>
        <button class="btn" onclick="runDemo()">▶️ Run Demo</button>
        <button class="btn" style="background: #e74c3c; margin-top: 10px;" onclick="resetDemo()">🔄 Reset</button>
    \`;
    
    document.getElementById('iterations').addEventListener('input', (e) => {
        document.getElementById('iterValue').textContent = e.target.value;
    });
    
    document.getElementById('demoOutput').innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Configure parameters and click "Run Demo"</p>';
}

let demoHistory = [];
let chartInstance = null;

async function runDemo() {
    const input = document.getElementById('inputParam').value;
    const mode = document.getElementById('processingMode').value;
    const iterations = parseInt(document.getElementById('iterations').value);
    
    if (!input.trim()) {
        alert('Please enter an input parameter');
        return;
    }
    
    courseUtils.showLoading('demoOutput');
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = {
        input: input,
        mode: mode,
        iterations: iterations,
        output: \`Processed: \${input}\`,
        score: (Math.random() * 40 + 60).toFixed(2),
        latency: (Math.random() * 500 + 200).toFixed(0),
        accuracy: (Math.random() * 20 + 80).toFixed(2),
        timestamp: new Date().toLocaleTimeString()
    };
    
    demoHistory.push(result);
    
    courseUtils.displayOutput({
        '🕐 Time': result.timestamp,
        '📥 Input': result.input,
        '⚙️ Mode': result.mode.toUpperCase(),
        '🔄 Iterations': result.iterations,
        '📤 Output': result.output,
        '⭐ Score': result.score + '/100',
        '⏱️ Latency': result.latency + 'ms',
        '🎯 Accuracy': result.accuracy + '%'
    });
    
    updateVisuals(result);
}

function updateVisuals(result) {
    const visuals = document.getElementById('demoVisuals');
    
    const avgScore = (demoHistory.reduce((sum, h) => sum + parseFloat(h.score), 0) / demoHistory.length).toFixed(2);
    const avgLatency = (demoHistory.reduce((sum, h) => sum + parseFloat(h.latency), 0) / demoHistory.length).toFixed(0);
    
    visuals.innerHTML = \`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            \${courseUtils.createMetricCard('Runs', demoHistory.length)}
            \${courseUtils.createMetricCard('Avg Score', avgScore)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            \${courseUtils.createMetricCard('Avg Latency', avgLatency + 'ms')}
            \${courseUtils.createMetricCard('Last Score', result.score)}
        </div>
        <canvas id="demoChart" width="350" height="200"></canvas>
    \`;
    
    if (demoHistory.length > 0) {
        const ctx = document.getElementById('demoChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: demoHistory.map((h, i) => \`Run \${i+1}\`),
                datasets: [{
                    label: 'Score',
                    data: demoHistory.map(h => parseFloat(h.score)),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Accuracy',
                    data: demoHistory.map(h => parseFloat(h.accuracy)),
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
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
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }
}

function resetDemo() {
    demoHistory = [];
    if (chartInstance) chartInstance.destroy();
    chartInstance = null;
    document.getElementById('demoOutput').innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Configure parameters and click "Run Demo"</p>';
    document.getElementById('demoVisuals').innerHTML = '';
}
`;
}

// Generate all courses
let successCount = 0;
let errorCount = 0;

courses.forEach((course, index) => {
    try {
        const folderPath = path.join(__dirname, course.folder);
        
        // Create folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        
        // Generate and write HTML
        const htmlContent = generateHTML(course);
        fs.writeFileSync(path.join(folderPath, 'index.html'), htmlContent, 'utf8');
        
        // Generate and write JS
        const jsContent = generateJS(course);
        fs.writeFileSync(path.join(folderPath, 'course.js'), jsContent, 'utf8');
        
        successCount++;
        console.log(`✅ [${index + 1}/${courses.length}] Course ${course.id}: ${course.title}`);
    } catch (error) {
        errorCount++;
        console.error(`❌ [${index + 1}/${courses.length}] Error creating course ${course.id}: ${error.message}`);
    }
});

console.log('\n' + '='.repeat(60));
console.log(`🎉 Generation complete!`);
console.log(`✅ Successfully created: ${successCount} courses`);
if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} courses`);
}
console.log('='.repeat(60));
