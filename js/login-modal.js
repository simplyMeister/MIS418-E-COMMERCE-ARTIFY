// Login Modal JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');

    // Open modal when Login link is clicked
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (loginModal) {
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    }

    // Close modal when X button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            if (loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Close modal when clicking outside the modal content
    if (loginModal) {
        loginModal.addEventListener('click', function (e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
});
