(function() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  const body = document.body;
  const header = document.getElementById('site-header');
  
  // Store scroll position
  let scrollPosition = 0;
  
  // Toggle menu function
  function toggleMenu(forceClose = false) {
    if (!toggleBtn || !mobileMenuOverlay) return;
    
    const isOpen = mobileMenuOverlay.classList.contains('is-open');
    
    if (isOpen || forceClose) {
      // Close menu
      mobileMenuOverlay.classList.remove('is-open');
      body.classList.remove('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      
      // Restore scroll position
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, scrollPosition);
    } else {
      // Open menu
      scrollPosition = window.pageYOffset;
      body.style.position = 'fixed';
      body.style.top = `-${scrollPosition}px`;
      
      mobileMenuOverlay.classList.add('is-open');
      body.classList.add('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }
  
  // Event listeners
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleMenu());
  }
  
  // Close menu when clicking nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });
  
  // Close menu when clicking overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        toggleMenu(true);
      }
    });
  }
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(true);
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggleMenu(true);
    }
  });
})();