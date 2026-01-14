// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
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
                // Store login state if remember me is checked
                if (rememberCheckbox.checked) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('userEmail', email);
                }

                // Store user session (in a real app, this would come from the server)
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);

                // Show success message
                alert('Login successful! Redirecting...');

                // Redirect to home page
                window.location.href = 'index.html';
            }, 1500);
        }
    });

    // Social login handlers
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');

    googleBtn.addEventListener('click', function () {
        console.log('Google login clicked');
        // In a real app, this would trigger OAuth flow
        alert('Google login would be triggered here. This is a demo.');
    });

    facebookBtn.addEventListener('click', function () {
        console.log('Facebook login clicked');
        // In a real app, this would trigger OAuth flow
        alert('Facebook login would be triggered here. This is a demo.');
    });

    // Check if user wants to be remembered
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberCheckbox.checked = true;
        }
    }

    // Password visibility toggle (optional enhancement)
    function addPasswordToggle() {
        const passwordWrapper = passwordInput.closest('.input-wrapper');
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = `
            <svg class="eye-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.66667 10C1.66667 10 4.16667 4.16667 10 4.16667C15.8333 4.16667 18.3333 10 18.3333 10C18.3333 10 15.8333 15.8333 10 15.8333C4.16667 15.8333 1.66667 10 1.66667 10Z" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        toggleBtn.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleBtn.classList.toggle('active');
        });

        passwordWrapper.appendChild(toggleBtn);
    }

    // Uncomment to enable password visibility toggle
    // addPasswordToggle();
});
