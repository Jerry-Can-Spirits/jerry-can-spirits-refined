// Splash page signup form handler
// src/scripts/js/splash-signup.js

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('emailInput');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value;
            const submitBtn = this.querySelector('.submit-btn');
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            
            try {
                // If you have Klaviyo set up, you can use their API
                if (typeof window.klaviyo !== 'undefined') {
                    window.klaviyo.push(['identify', {
                        '$email': email
                    }]);
                    window.klaviyo.push(['track', 'Newsletter Signup', {
                        'Source': 'Splash Page'
                    }]);
                }
                
                // For now, show success message
                // In production, you'd send to your API endpoint
                /*
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                if (!response.ok) {
                    throw new Error('Subscription failed');
                }
                */
                
                // Show success
                submitBtn.textContent = 'Success!';
                submitBtn.style.background = 'linear-gradient(135deg, #228B22 0%, #006400 100%)';
                
                // Clear form
                emailInput.value = '';
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Subscription error:', error);
                
                // Show error
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)';
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});