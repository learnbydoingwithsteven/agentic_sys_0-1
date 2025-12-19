// Shared utilities for all courses

// Mark course as complete
function markCourseComplete() {
    const courseId = parseInt(window.location.pathname.match(/course_(\d+)/)[1]);
    if (window.parent.markComplete) {
        window.parent.markComplete(courseId);
    } else {
        let completed = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));
        completed.add(courseId);
        localStorage.setItem('completedCourses', JSON.stringify([...completed]));
    }
    alert('Course marked as complete! 🎉');
}

// Generate table of contents
function generateTOC(sections) {
    const tocList = document.getElementById('tocList');
    tocList.innerHTML = sections.map((section, idx) => 
        `<li onclick="scrollToSection(${idx})">${section}</li>`
    ).join('');
}

// Scroll to section
function scrollToSection(index) {
    const headers = document.querySelectorAll('.content h2');
    if (headers[index]) {
        headers[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update progress
function updateProgress(completed, total) {
    const percentage = Math.round((completed / total) * 100);
    const progressFill = document.getElementById('sectionProgress');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
        progressFill.textContent = `${percentage}%`;
    }
}

// Simulate LLM API call (for demo purposes)
async function simulateLLMCall(prompt, delay = 1000) {
    await new Promise(resolve => setTimeout(resolve, delay));
    return {
        response: `Simulated response to: "${prompt.substring(0, 50)}..."`,
        tokens: Math.floor(Math.random() * 500) + 100,
        latency: delay
    };
}

// Display output in demo panel
function displayOutput(data) {
    const output = document.getElementById('demoOutput');
    if (typeof data === 'object') {
        output.innerHTML = Object.entries(data).map(([key, value]) => `
            <div class="output-item">
                <div class="output-label">${key}:</div>
                <div class="output-value">${JSON.stringify(value, null, 2)}</div>
            </div>
        `).join('');
    } else {
        output.innerHTML = `<div class="output-item"><div class="output-value">${data}</div></div>`;
    }
}

// Create metric card
function createMetricCard(label, value) {
    return `
        <div class="metric-card">
            <div class="metric-value">${value}</div>
            <div class="metric-label">${label}</div>
        </div>
    `;
}

// Create bar chart
function createBarChart(elementId, labels, data, title) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        return;
    }
    const c = ctx.getContext('2d');
    if (!c) return;
    const w = ctx.width || 350;
    const h = ctx.height || 200;
    c.clearRect(0,0,w,h);
    const pad = 20;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;
    const max = Math.max(...data, 1);
    const barW = innerW / data.length * 0.8;
    for (let i = 0; i < data.length; i++) {
        const x = pad + i * (innerW / data.length) + (innerW / data.length - barW) / 2;
        const y = pad + innerH - (data[i] / max) * innerH;
        const bh = (data[i] / max) * innerH;
        c.fillStyle = 'rgba(102,126,234,0.7)';
        c.fillRect(x, y, barW, bh);
    }
}

// Create line chart
function createLineChart(elementId, labels, data, title) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return;
    }
    const c = ctx.getContext('2d');
    if (!c) return;
    const w = ctx.width || 350;
    const h = ctx.height || 200;
    c.clearRect(0,0,w,h);
    const pad = 20;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;
    const max = Math.max(...data, 1);
    c.strokeStyle = 'rgba(102,126,234,1)';
    c.beginPath();
    for (let i = 0; i < data.length; i++) {
        const x = pad + (i / Math.max(data.length - 1, 1)) * innerW;
        const y = pad + innerH - (data[i] / max) * innerH;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
}

// Create plotly chart
function createPlotlyChart(elementId, data, layout) {
    Plotly.newPlot(elementId, data, layout, {responsive: true});
}

// Show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading"></div>';
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate statistics
function calculateStats(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    const sorted = [...data].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
        : sorted[Math.floor(sorted.length/2)];
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    return { sum, mean, median, min, max, count: data.length };
}

// Generate random data for demos
function generateRandomData(count, min = 0, max = 100) {
    return Array.from({length: count}, () => Math.random() * (max - min) + min);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
window.courseUtils = {
    markCourseComplete,
    generateTOC,
    scrollToSection,
    updateProgress,
    simulateLLMCall,
    displayOutput,
    createMetricCard,
    createBarChart,
    createLineChart,
    createPlotlyChart,
    showLoading,
    formatNumber,
    calculateStats,
    generateRandomData,
    debounce
};
