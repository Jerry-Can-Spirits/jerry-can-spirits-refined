document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');
  const errorMessage = document.getElementById('error-message');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitButton = form.querySelector('.auth-submit');
      
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Verifying...';
      errorMessage.style.display = 'none';
      
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Success - redirect will happen automatically
          submitButton.textContent = 'Access Granted';
        } else {
          // Show error
          errorMessage.textContent = data.error || 'Authentication failed';
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        errorMessage.textContent = 'Connection error. Please try again.';
        errorMessage.style.display = 'block';
      } finally {
        // Reset button
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Access Site';
        }, 2000);
      }
    });
  }
});