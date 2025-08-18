// src/scripts/cookie-consent.js
class CookieConsent {
  constructor() {
    this.consentKey = 'jcs_cookie_consent';
    this.consent = this.getConsent();
  }

  getConsent() {
    const stored = localStorage.getItem(this.consentKey);
    return stored ? JSON.parse(stored) : null;
  }

  setConsent(categories) {
    const consent = {
      necessary: true, // Always true
      analytics: categories.analytics || false,
      marketing: categories.marketing || false,
      preferences: categories.preferences || false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
    this.consent = consent;
    this.applyConsent();
  }

  applyConsent() {
    // Enable/disable tracking scripts based on consent
    if (this.consent.analytics) {
      // Initialize analytics
      this.loadGoogleAnalytics();
    }
    
    if (this.consent.marketing) {
      // Initialize marketing pixels
      this.loadKlaviyo();
    }
  }

  loadGoogleAnalytics() {
    // Only load if consented
    if (!window.gtag) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  loadKlaviyo() {
    // Klaviyo initialization with consent
    window.klaviyo = window.klaviyo || [];
    window.klaviyo.push(['consent', true]);
  }
}