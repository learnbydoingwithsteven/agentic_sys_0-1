
// Migrated Legacy Demo for course_100_own_framework.js
document.addEventListener('DOMContentLoaded', () => {
    if (window.courseUtils && window.courseUtils.bootstrapDemo) {
        window.courseUtils.bootstrapDemo();
    } else {
        console.error("Course Utils not loaded");
    }
});
