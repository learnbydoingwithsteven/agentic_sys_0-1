// Main application logic
let currentFilter = 'all';
let completedCourses = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
    updateStats();
    setupEventListeners();
    const params = new URLSearchParams(window.location.search);
    if (params.has('autoTest')) {
        runAllCourseTests();
    }
});

// Render courses based on current filter
function renderCourses(searchTerm = '') {
    const grid = document.getElementById('coursesGrid');
    const filteredCourses = courses.filter(course => {
        const matchesFilter = currentFilter === 'all' || course.level === currentFilter;
        const matchesSearch = searchTerm === '' || 
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    grid.innerHTML = filteredCourses.map(course => `
        <div class="course-card" onclick="openCourse(${course.id})">
            <span class="course-number">Course ${course.id}</span>
            ${completedCourses.has(course.id) ? '<span style="float:right">✅</span>' : ''}
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <div>
                <span class="course-level level-${course.level}">${course.level.toUpperCase()}</span>
                <span class="tag">⏱️ ${course.duration}</span>
            </div>
            <div class="course-tags">
                ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.level;
            renderCourses(document.getElementById('searchBox').value);
        });
    });

    // Search box
    document.getElementById('searchBox').addEventListener('input', (e) => {
        renderCourses(e.target.value);
    });

    const runBtn = document.getElementById('runTestsBtn');
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            runAllCourseTests();
        });
    }
}

// Open a course
function openCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        window.location.href = `${course.folder}/index.html`;
    }
}

// Mark course as complete
function markComplete(courseId) {
    completedCourses.add(courseId);
    localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));
    updateStats();
}

// Update statistics
function updateStats() {
    const completed = completedCourses.size;
    const total = courses.length;
    const percentage = Math.round((completed / total) * 100);
    
    document.getElementById('completedCourses').textContent = completed;
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressFill').textContent = `${percentage}% Complete`;
    
    // Update current level
    let level = 'Beginner';
    if (completed >= 80) level = 'Master';
    else if (completed >= 60) level = 'Expert';
    else if (completed >= 40) level = 'Advanced';
    else if (completed >= 20) level = 'Intermediate';
    document.getElementById('currentLevel').textContent = level;
}

// Export for use in course pages
window.markComplete = markComplete;

async function runAllCourseTests() {
    const resultsEl = document.getElementById('testResults');
    const summaryEl = document.getElementById('testSummary');
    if (resultsEl) resultsEl.innerHTML = '';
    if (summaryEl) summaryEl.textContent = 'Running...';
    let passed = 0;
    let failed = 0;
    for (const course of courses) {
        const iframe = document.createElement('iframe');
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = '0';
        iframe.loading = 'eager';
        document.body.appendChild(iframe);

        const res = await runCourseTest(course, iframe);

        if (res.success) passed++; else failed++;
        if (resultsEl) {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = buildResultCardHtml(course, res);
            resultsEl.appendChild(card);
        }
        if (summaryEl) summaryEl.textContent = `Passed ${passed} • Failed ${failed}`;

        iframe.remove();
        await delay(200);
    }
}

async function runCourseTest(course, iframe) {
    try {
        iframe.src = `${course.folder}/index.html`;
        const loaded = await new Promise((resolve) => {
            const onLoad = () => resolve(true);
            const onError = () => resolve(false);
            iframe.addEventListener('load', onLoad, { once: true });
            iframe.addEventListener('error', onError, { once: true });
        });
        if (!loaded) return { success: false, message: 'Failed to load page' };

        const win = iframe.contentWindow;
        const doc = iframe.contentDocument;
        const hasControls = !!doc.getElementById('demoControls');
        const hasOutput = !!doc.getElementById('demoOutput');
        const hasVisuals = !!doc.getElementById('demoVisuals');
        if (!hasControls || !hasOutput || !hasVisuals) {
            return { success: false, message: 'Missing demo elements' };
        }

        await delay(50);

        const checks = [];
        checks.push({ name: 'TOC populated', pass: (doc.getElementById('tocList')?.children?.length || 0) > 0 });
        checks.push({ name: 'initializeCourse exists', pass: typeof win.initializeCourse === 'function' });
        checks.push({ name: 'setupDemo exists', pass: typeof win.setupDemo === 'function' });

        const completeBtn = doc.querySelector('.complete-btn');
        if (completeBtn) {
            const originalAlert = win.alert;
            win.alert = () => {};
            const beforeSet = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));
            try { completeBtn.click(); } catch {}
            await delay(50);
            const afterSet = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));
            const marked = afterSet.has(course.id) || afterSet.size > beforeSet.size;
            checks.push({ name: 'Mark Complete works', pass: marked });
            win.alert = originalAlert;
        } else {
            checks.push({ name: 'Mark Complete works', pass: false, details: 'No button' });
        }

        const before = doc.getElementById('demoOutput').textContent || '';
        if (typeof win.runDemo !== 'function') {
            return { success: false, message: 'runDemo not found', checks };
        }
        const maybePromise = win.runDemo();
        if (maybePromise && typeof maybePromise.then === 'function') await maybePromise;
        const changed = await waitFor(() => {
            const txt = doc.getElementById('demoOutput').textContent || '';
            return txt && txt !== before;
        }, 5000);
        checks.push({ name: 'Output updated', pass: !!changed });
        if (!changed) return { success: false, message: 'No output after runDemo', checks };

        const canvas = doc.getElementById('demoVisuals')?.querySelector('canvas');
        checks.push({ name: 'Chart rendered', pass: !!canvas });
        if (!canvas) return { success: false, message: 'No chart rendered', checks };
        const rect = canvas.getBoundingClientRect();
        const overflowRatio = doc.body.scrollHeight / win.innerHeight;
        checks.push({ name: 'No layout overflow', pass: !(overflowRatio > 6 || rect.height > 800 || rect.width > 2000) });
        if (overflowRatio > 6 || rect.height > 800 || rect.width > 2000) return { success: false, message: 'Layout overflow detected', checks };

        if (typeof win.resetDemo === 'function') {
            const beforeResetOut = doc.getElementById('demoOutput').textContent || '';
            const beforeResetVis = doc.getElementById('demoVisuals').innerHTML || '';
            const p = win.resetDemo(); if (p && typeof p.then === 'function') await p;
            const afterResetOut = doc.getElementById('demoOutput').textContent || '';
            const afterResetVis = doc.getElementById('demoVisuals').innerHTML || '';
            const resetOk = afterResetOut !== beforeResetOut && afterResetVis.length === 0;
            checks.push({ name: 'Reset clears output/visuals', pass: resetOk });
            if (!resetOk) return { success: false, message: 'Reset failed', checks };
        } else {
            checks.push({ name: 'Reset clears output/visuals', pass: false, details: 'No resetDemo()' });
            return { success: false, message: 'resetDemo not found', checks };
        }
        return { success: true, checks };
    } catch (e) {
        return { success: false, message: 'Error' };
    }
}

function waitFor(predicate, timeout = 5000) {
    return new Promise((resolve) => {
        const start = Date.now();
        const tick = () => {
            try {
                if (predicate()) return resolve(true);
            } catch {}
            if (Date.now() - start >= timeout) return resolve(false);
            setTimeout(tick, 100);
        };
        tick();
    });
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildResultCardHtml(course, res) {
    const failed = (res.checks || []).filter(c => !c.pass);
    const passedCount = (res.checks || []).length - failed.length;
    const failedList = failed.map(c => `❌ ${c.name}`).join('<br>');
    const detailsHtml = failed.length ? `<div class="output-item"><div class="output-label">Failed Checks</div><div class="output-value">${failedList}</div></div>` : '';
    return `
        <span class="course-number">Course ${course.id}</span>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-description">${res.success ? '✅ Passed' : '❌ Failed'}${res.message ? ' — ' + res.message : ''}</p>
        <div>
            <span class="course-level level-${course.level}">${course.level.toUpperCase()}</span>
            <a class="tag" href="${course.folder}/index.html" target="_blank">Open</a>
            <span class="tag">Checks: ${passedCount}/${(res.checks || []).length}</span>
        </div>
        ${detailsHtml}
    `;
}
