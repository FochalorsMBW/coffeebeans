// Dark mode functionality
const darkModeToggle = document.getElementById('dark-mode-toggle');
const htmlElement = document.documentElement;

// Check for saved user preference
const savedDarkMode = localStorage.getItem('darkMode');

// Initialize dark mode based on saved preference
if (savedDarkMode === 'enabled') {
    enableDarkMode();
}

// Toggle dark mode
function toggleDarkMode() {
    // Check current mode
    if (htmlElement.classList.contains('dark-theme')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Enable dark mode
function enableDarkMode() {
    // Add class to html element
    htmlElement.classList.add('dark-theme');
    // Update toggle button appearance
    if (darkModeToggle) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeToggle.setAttribute('title', 'Switch to Light Mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', 'enabled');
}

// Disable dark mode
function disableDarkMode() {
    // Remove class from html element
    htmlElement.classList.remove('dark-theme');
    // Update toggle button appearance
    if (darkModeToggle) {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.setAttribute('title', 'Switch to Dark Mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', 'disabled');
}

// Add event listener to toggle button
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Detect system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!localStorage.getItem('darkMode')) {
        // Only auto-switch if user hasn't manually set a preference
        if (event.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
});

// Initialize based on system preference if no saved preference
if (!savedDarkMode) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    }
}