// Semantic Search Demo
// Interactive demonstration of semantic search

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
            <label>Query:</label>
            <input type="text" id="queryInput" placeholder="Enter search query...">
        </div>
        <button class="btn" onclick="search()">Search</button>
        `;
}

function setupVisualization() {
    const visuals = document.getElementById('demoVisuals');
    visuals.innerHTML = `
        <canvas id="appChart" width="400" height="250"></canvas>
        <div id="metrics" style="margin-top: 20px;"></div>
    `;
}


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