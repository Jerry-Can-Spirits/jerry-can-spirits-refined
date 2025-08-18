// Check if Klaviyo form loads, otherwise show fallback
document.addEventListener('DOMContentLoaded', () => {
  const klaviyoForm = document.querySelector('.klaviyo-form-QZ76XT');
  const fallbackForm = document.getElementById('signup-form');

  // Check if Klaviyo loaded after a delay
  setTimeout(() => {
    if (klaviyoForm && klaviyoForm.children.length === 0) {
      // Klaviyo didn't load, show fallback
      if (fallbackForm) {
        fallbackForm.style.display = 'flex';
      }
    }
  }, 3000);

  // Handle fallback form submission
  if (fallbackForm) {
    fallbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(fallbackForm);
      const email = formData.get('email');
      const consent = formData.get('consent');
      const submitButton = fallbackForm.querySelector('.submit-button');
      const messageDiv = fallbackForm.querySelector('.form-message');

      // Clear previous messages
      messageDiv.className = 'form-message';
      messageDiv.textContent = '';

      // Add loading state
      submitButton.classList.add('loading');
      submitButton.disabled = true;

      try {
        // Simulate success (replace with actual API call)
        const response = await fetch('/api/newsletter-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            consent,
            source: 'signup-component',
            timestamp: new Date().toISOString()
          })
        }).catch(() => {
          // Fallback for demo
          return { ok: true };
        });

        if (response.ok) {
          // Success
          messageDiv.className = 'form-message success';
          messageDiv.textContent = 'Welcome to the expedition! Check your email for confirmation.';
          fallbackForm.reset();

          // Track event - check if klaviyo exists
          if (typeof window !== 'undefined' && window.klaviyo) {
            window.klaviyo.push(['identify', {
              '$email': email
            }]);
            window.klaviyo.push(['track', 'Newsletter Signup', {
              'Source': 'Signup Component'
            }]);
          }

          // Dispatch custom event for analytics
          window.dispatchEvent(new CustomEvent('newsletter-signup', {
            detail: { email, source: 'signup-component' }
          }));
        } else {
          throw new Error('Signup failed');
        }
      } catch (error) {
        // Error
        messageDiv.className = 'form-message error';
        messageDiv.textContent = 'Something went wrong. Please try again later.';
        console.error('Signup error:', error);
      } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
      }
    });
  }

  // Enhance Klaviyo form if it loads
  const observeKlaviyo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        // Klaviyo form loaded, enhance it
        const klaviyoSubmit = klaviyoForm?.querySelector('button[type="submit"]');
        if (klaviyoSubmit) {
          // Add our styling classes
          klaviyoSubmit.classList.add('submit-button');

          // Add animation on submit
          klaviyoSubmit.addEventListener('click', () => {
            klaviyoSubmit.classList.add('loading');
          });
        }

        // Stop observing once form is loaded
        observeKlaviyo.disconnect();
      }
    });
  });

  if (klaviyoForm) {
    observeKlaviyo.observe(klaviyoForm, {
      childList: true,
      subtree: true
    });
  }

  // Add entrance animation
  const signupSection = document.querySelector('.signup-section');
  if (signupSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(signupSection);
  }
});

// Expose signup function for other components to trigger
window.triggerSignupFocus = () => {
  const signupSection = document.getElementById('signup');
  const emailInput = document.querySelector('#signup-email');

  if (signupSection) {
    signupSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      if (emailInput) {
        emailInput.focus();
      }
    }, 500);
  }
};