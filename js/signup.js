// Signup Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');
    const submitBtn = signupForm.querySelector('.submit-btn');

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function validateFullName(name) {
        return name.trim().length >= 2;
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
    fullnameInput.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            clearValidation(this);
        } else if (!validateFullName(this.value)) {
            showError(this, 'Name must be at least 2 characters');
        } else {
            showSuccess(this);
        }
    });

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
            showError(this, 'Password must be at least 8 characters');
        } else {
            showSuccess(this);
        }
    });

    // Clear validation on input
    fullnameInput.addEventListener('input', function () {
        if (this.classList.contains('error')) {
            clearValidation(this);
        }
    });

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
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        // Validate full name
        if (fullname === '') {
            showError(fullnameInput, 'Full name is required');
            isValid = false;
        } else if (!validateFullName(fullname)) {
            showError(fullnameInput, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess(fullnameInput);
        }

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
            showError(passwordInput, 'Password must be at least 8 characters');
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

        // Validate terms
        if (!termsCheckbox.checked) {
            alert('Please accept the Terms of Service and Privacy Policy');
            isValid = false;
        }

        if (isValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Store user data (in a real app, this would be sent to the server)
                const userData = {
                    fullname: fullname,
                    email: email,
                    createdAt: new Date().toISOString()
                };

                // Store user session
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userName', fullname);
                localStorage.setItem('userData', JSON.stringify(userData));

                // Show success message
                alert('Account created successfully! Redirecting...');

                // Redirect to home page
                window.location.href = 'index.html';
            }, 1500);
        }
    });

    // Social signup handlers
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');

    googleBtn.addEventListener('click', function () {
        console.log('Google signup clicked');
        // In a real app, this would trigger OAuth flow
        alert('Google signup would be triggered here. This is a demo.');
    });

    facebookBtn.addEventListener('click', function () {
        console.log('Facebook signup clicked');
        // In a real app, this would trigger OAuth flow
        alert('Facebook signup would be triggered here. This is a demo.');
    });

    // Password strength indicator (optional enhancement)
    function addPasswordStrengthIndicator() {
        const passwordGroup = passwordInput.closest('.form-group');
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
            <span class="strength-text"></span>
        `;
        passwordGroup.appendChild(strengthIndicator);

        passwordInput.addEventListener('input', function () {
            const password = this.value;
            const strengthFill = strengthIndicator.querySelector('.strength-fill');
            const strengthText = strengthIndicator.querySelector('.strength-text');

            if (password.length === 0) {
                strengthFill.style.width = '0%';
                strengthText.textContent = '';
                return;
            }

            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;

            const strengthLevels = ['Weak', 'Fair', 'Good', 'Strong'];
            const strengthColors = ['#DC2626', '#F59E0B', '#10B981', '#059669'];
            const strengthWidths = ['25%', '50%', '75%', '100%'];

            strengthFill.style.width = strengthWidths[strength - 1] || '0%';
            strengthFill.style.backgroundColor = strengthColors[strength - 1] || '#DC2626';
            strengthText.textContent = strengthLevels[strength - 1] || '';
            strengthText.style.color = strengthColors[strength - 1] || '#DC2626';
        });
    }

    // Uncomment to enable password strength indicator
    // addPasswordStrengthIndicator();
});
