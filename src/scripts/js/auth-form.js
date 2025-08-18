document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('authForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const passwordInput = document.getElementById('password');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    const error = urlParams.get('error');

    // Show error if present from a redirect
    if (error === 'invalid') {
        errorMessage.textContent = 'Invalid credentials. Please try again.';
        errorMessage.classList.add('show');
    }
    
    // Auto-focus password field on load
    if(passwordInput) {
        passwordInput.focus();
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');

        submitBtn.disabled = true;
        btnText.textContent = 'Authenticating';
        loadingSpinner.style.display = 'inline-block';

        try {
            const formData = new FormData(form);
            if (redirectPath) {
                formData.append('redirect', redirectPath);
            }

            const response = await fetch('/api/auth', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                successMessage.textContent = 'Authentication successful! Redirecting...';
                successMessage.classList.add('show');
                btnText.textContent = 'Success';
                setTimeout(() => {
                    window.location.href = data.redirect || redirectPath || '/';
                }, 1000);
            } else {
                if (response.status === 429) {
                    errorMessage.textContent = data.error || 'Too many attempts. Please try again later.';
                } else {
                    errorMessage.textContent = data.error || 'Invalid credentials. Please try again.';
                    if (data.attemptsRemaining !== undefined) {
                        errorMessage.textContent += ` (${data.attemptsRemaining} attempts remaining)`;
                    }
                }
                errorMessage.classList.add('show');
                submitBtn.disabled = false;
                btnText.textContent = 'Authenticate';
            }
        } catch (err) {
            errorMessage.textContent = 'Connection error. Please check your internet and try again.';
            errorMessage.classList.add('show');
            submitBtn.disabled = false;
            btnText.textContent = 'Authenticate';
        } finally {
            loadingSpinner.style.display = 'none';
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    });
});