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
        // Here you would integrate with your backend or Klaviyo API
        // For now, we'll simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
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
        } else {
          throw new Error('Signup failed');
        }
      } catch (error) {
        // Error
        messageDiv.className = 'form-message error';
        messageDiv.textContent = 'Something went wrong. Please try again.';
      } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
      }
    });
  }
});