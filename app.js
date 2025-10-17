// Main application logic
let currentFilter = 'all';
let completedCourses = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
    updateStats();
    setupEventListeners();
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
