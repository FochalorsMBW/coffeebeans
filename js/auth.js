// Auth helper functions
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status and update UI
    updateAuthUI();
    
    // Register form event listener
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Login form event listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Update UI based on authentication status
function updateAuthUI() {
    const isLoggedIn = window.api.users.isLoggedIn();
    const currentUser = window.api.users.getCurrentUser();
    
    // Update navigation
    const authNav = document.getElementById('auth-nav');
    const userNav = document.getElementById('user-nav');
    
    if (authNav && userNav) {
        if (isLoggedIn && currentUser) {
            authNav.style.display = 'none';
            userNav.style.display = 'flex';
            
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name;
            }
        } else {
            authNav.style.display = 'flex';
            userNav.style.display = 'none';
        }
    }
    
    // Redirect from protected pages if not logged in
    const isCheckoutPage = window.location.pathname.includes('/checkout');
    const isAccountPage = window.location.pathname.includes('/account');
    
    if ((isCheckoutPage || isAccountPage) && !isLoggedIn) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
}

// Handle user registration
async function handleRegister(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    
    // Form validation
    const errorElement = document.getElementById('register-error');
    
    if (!name || !email || !password || !confirmPassword) {
        errorElement.textContent = 'All fields are required';
        errorElement.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        errorElement.style.display = 'block';
        return;
    }
    
    // Clear previous errors
    errorElement.style.display = 'none';
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    try {
        // Register user
        const userData = {
            name,
            email,
            password,
            address: {
                street: formData.get('street'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                country: formData.get('country')
            }
        };
        
        await window.api.users.register(userData);
        
        // Login after successful registration
        await window.api.users.login({ email, password });
        
        // Redirect to homepage after registration
        window.location.href = '/';
    } catch (error) {
        errorElement.textContent = error.message || 'Registration failed. Please try again.';
        errorElement.style.display = 'block';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Form validation
    const errorElement = document.getElementById('login-error');
    
    if (!email || !password) {
        errorElement.textContent = 'Email and password are required';
        errorElement.style.display = 'block';
        return;
    }
    
    // Clear previous errors
    errorElement.style.display = 'none';
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        // Login user
        await window.api.users.login({ email, password });
        
        // Redirect after login
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/';
        window.location.href = redirectUrl;
    } catch (error) {
        errorElement.textContent = error.message || 'Login failed. Please check your credentials.';
        errorElement.style.display = 'block';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// Handle user logout
function handleLogout(event) {
    event.preventDefault();
    
    window.api.users.logout();
    window.location.href = '/';
}