// Artisan Admin Login JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const submitBtn = loginForm.querySelector('.submit-btn');

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-error');
        input.classList.add('error');
        input.classList.remove('success');

        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
        input.classList.remove('error');
        input.classList.add('success');

        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    function clearValidation(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
        input.classList.remove('error', 'success');
    }

    // Real-time validation
    emailInput.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            clearValidation(this);
        } else if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            showSuccess(this);
        }
    });

    passwordInput.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            clearValidation(this);
        } else if (!validatePassword(this.value)) {
            showError(this, 'Password must be at least 6 characters');
        } else {
            showSuccess(this);
        }
    });

    // Clear validation on input
    emailInput.addEventListener('input', function () {
        if (this.classList.contains('error')) {
            clearValidation(this);
        }
    });

    passwordInput.addEventListener('input', function () {
        if (this.classList.contains('error')) {
            clearValidation(this);
        }
    });

    // Form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        // Validate email
        if (email === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }

        // Validate password
        if (password === '') {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

        if (isValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Store admin session
                if (rememberCheckbox.checked) {
                    localStorage.setItem('adminRememberMe', 'true');
                    localStorage.setItem('adminEmail', email);
                }

                sessionStorage.setItem('isAdminLoggedIn', 'true');
                sessionStorage.setItem('adminEmail', email);
                sessionStorage.setItem('adminName', 'Sarah Anderson');
                sessionStorage.setItem('adminRole', 'Ceramic Artist');

                // Redirect to dashboard
                window.location.href = 'artisan-dashboard.html';
            }, 1500);
        }
    });

    // Check if admin wants to be remembered
    if (localStorage.getItem('adminRememberMe') === 'true') {
        const savedEmail = localStorage.getItem('adminEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberCheckbox.checked = true;
        }
    }
});
