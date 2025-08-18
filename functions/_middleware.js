// functions/_middleware.js - Enhanced Version with Rate Limiting & Analytics

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  
  // --- CONFIGURATION FROM ENVIRONMENT ---
  const AUTH_SECRET = env.PREVIEW_PASSWORD || 'CHANGE_THIS_IN_ENV';
  const TOKEN_SECRET = env.TOKEN_SECRET || 'CHANGE_THIS_IN_ENV_TOO';
  const ALLOWED_EMAILS = env.ALLOWED_EMAILS ? env.ALLOWED_EMAILS.split(',') : [];
  const ALLOWED_IPS = env.ALLOWED_IPS ? env.ALLOWED_IPS.split(',') : [];
  const ENABLE_ANALYTICS = env.ENABLE_ANALYTICS === 'true';
  const WEBHOOK_URL = env.SLACK_WEBHOOK_URL || env.DISCORD_WEBHOOK_URL || null;
  
  // --- RATE LIMITING CONFIGURATION ---
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const MAX_ATTEMPTS = 5; // Maximum login attempts per IP
  
  // --- HELPER FUNCTIONS ---
  
  // Add security headers function
  function addSecurityHeaders(response) {
    const newResponse = new Response(response.body, response);
    
    // Content Security Policy - strict but functional
    const csp = [
      "default-src 'none'",
      "script-src 'self' https://static.klaviyo.com https://cdnjs.cloudflare.com",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://a.klaviyo.com https://static.klaviyo.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://manage.kmail-lists.com",
      "manifest-src 'self'",
      "worker-src 'none'",
      "object-src 'none'",
      "media-src 'self'",
      "child-src 'none'",
      "frame-src 'none'"
    ].join('; ');
    
    newResponse.headers.set('Content-Security-Policy', csp);
    
    // Additional security headers
    newResponse.headers.set('X-Frame-Options', 'DENY');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return newResponse;
  }
  
  // Get client IP
  function getClientIP(request) {
    return request.headers.get('CF-Connecting-IP') || 
           request.headers.get('X-Forwarded-For')?.split(',')[0] || 
           'unknown';
  }
  
  // Get client info for logging
  function getClientInfo(request) {
    return {
      ip: getClientIP(request),
      userAgent: request.headers.get('User-Agent') || 'unknown',
      country: request.headers.get('CF-IPCountry') || 'unknown',
      timestamp: new Date().toISOString()
    };
  }
  
  // Send webhook notification
  async function sendWebhook(message, type = 'info') {
    if (!WEBHOOK_URL) return;
    
    const color = type === 'error' ? 0xff0000 : 
                  type === 'success' ? 0x00ff00 : 
                  0x0080ff;
    
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: 'Jerry Can Spirits - Preview Site',
            description: message,
            color: color,
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (e) {
      console.error('Webhook failed:', e);
    }
  }
  
  // Log access attempt
  async function logAccess(env, event, details) {
    if (!ENABLE_ANALYTICS) return;
    
    const log = {
      event,
      ...details,
      timestamp: Date.now()
    };
    
    // Store in KV if available
    if (env.ACCESS_LOGS) {
      const key = `log:${Date.now()}:${Math.random()}`;
      await env.ACCESS_LOGS.put(key, JSON.stringify(log), {
        expirationTtl: 30 * 24 * 60 * 60 // 30 days
      });
    }
    
    // Send critical events to webhook
    if (event === 'auth_failed' || event === 'auth_success' || event === 'rate_limited') {
      await sendWebhook(
        `**${event}**\nIP: ${details.ip}\nEmail: ${details.email || 'N/A'}\nCountry: ${details.country}`,
        event === 'auth_success' ? 'success' : 'error'
      );
    }
  }
  
  // Rate limiting functions
  async function checkRateLimit(env, ip) {
    if (!env.RATE_LIMITS) return { allowed: true, remaining: MAX_ATTEMPTS, resetIn: 0 };
    
    const key = `ratelimit:${ip}`;
    const data = await env.RATE_LIMITS.get(key);
    
    if (!data) {
      return { allowed: true, remaining: MAX_ATTEMPTS, resetIn: 0 };
    }
    
    const { count, firstAttempt } = JSON.parse(data);
    const now = Date.now();
    const timeElapsed = now - firstAttempt;
    
    if (timeElapsed > RATE_LIMIT_WINDOW) {
      // Window expired, reset
      await env.RATE_LIMITS.delete(key);
      return { allowed: true, remaining: MAX_ATTEMPTS, resetIn: 0 };
    }
    
    if (count >= MAX_ATTEMPTS) {
      const resetIn = Math.ceil((RATE_LIMIT_WINDOW - timeElapsed) / 60000);
      return { allowed: false, remaining: 0, resetIn };
    }
    
    return { allowed: true, remaining: MAX_ATTEMPTS - count, resetIn: 0 };
  }
  
  async function incrementRateLimit(env, ip) {
    if (!env.RATE_LIMITS) return;
    
    const key = `ratelimit:${ip}`;
    const data = await env.RATE_LIMITS.get(key);
    const now = Date.now();
    
    if (!data) {
      await env.RATE_LIMITS.put(key, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: Math.ceil(RATE_LIMIT_WINDOW / 1000) });
    } else {
      const { count, firstAttempt } = JSON.parse(data);
      await env.RATE_LIMITS.put(key, JSON.stringify({
        count: count + 1,
        firstAttempt
      }), { expirationTtl: Math.ceil(RATE_LIMIT_WINDOW / 1000) });
    }
  }
  
  // Token generation and verification
  async function generateToken(payload, secret) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Date.now();
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const headerB64 = btoa(JSON.stringify(header));
    const payloadB64 = btoa(JSON.stringify(tokenPayload));
    const data = `${headerB64}.${payloadB64}`;
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    return `${payloadB64}.${signatureB64}`;
  }
  
  // Verify a token
  async function verifyToken(token, secret) {
    if (!token) return false;
    
    try {
      const [payloadB64, signatureB64] = token.split('.');
      if (!payloadB64 || !signatureB64) return false;
      
      const payload = JSON.parse(atob(payloadB64));
      
      // Check expiration
      if (payload.exp && payload.exp < Date.now()) return false;
      
      // Verify signature
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const expectedSignature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(atob(payloadB64))
      );
      
      const expectedSignatureB64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)));
      
      if (signatureB64 !== expectedSignatureB64) return false;
      
      return payload;
    } catch (e) {
      return false;
    }
  }
  
  // Parse cookies
  function parseCookies(cookieString) {
    const cookies = {};
    if (cookieString) {
      cookieString.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
      });
    }
    return cookies;
  }
  
  // --- IP ALLOWLIST CHECK ---
  const clientIP = getClientIP(request);
  if (ALLOWED_IPS.length > 0 && ALLOWED_IPS.includes(clientIP)) {
    // Trusted IP, bypass authentication
    await logAccess(env, 'trusted_ip_access', { ip: clientIP });
    const response = await next();
    return addSecurityHeaders(response);
  }
  
  // --- STATIC ASSET CHECKS ---
  const isAstroAsset = url.pathname.startsWith('/_astro/');
  const staticExtensions = /\.(png|jpe?g|svg|gif|ico|woff2?|css|js|webp|avif|mp4|webm)$/i;
  const isStaticAsset = staticExtensions.test(url.pathname);
  const isSplashPage = url.pathname === '/splash' || url.pathname === '/splash.html';
  const isAuthPage = url.pathname === '/auth' || url.pathname === '/auth.html';
  
  if (isAstroAsset || isStaticAsset || isSplashPage || isAuthPage) {
    const response = await next();
    return addSecurityHeaders(response);
  }
  
  // --- CHECK EXISTING AUTHENTICATION ---
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const authToken = cookies.preview_token;
  
  if (authToken) {
    const tokenData = await verifyToken(authToken, TOKEN_SECRET);
    if (tokenData && tokenData.authenticated) {
      // Valid token, allow access
      const response = await next();
      return addSecurityHeaders(response);
    }
  }
  
  // --- HANDLE DIRECT LINK AUTHENTICATION ---
  const password = url.searchParams.get('preview');
  const email = url.searchParams.get('email');
  
  if (password === AUTH_SECRET) {
    const clientInfo = getClientInfo(request);
    await logAccess(env, 'auth_success', { ...clientInfo, email: email || 'direct-link' });
    
    const token = await generateToken(
      { 
        authenticated: true, 
        email: email || 'direct-link',
        ip: clientIP
      }, 
      TOKEN_SECRET
    );
    
    url.searchParams.delete('preview');
    url.searchParams.delete('email');
    
    const response = await fetch(new URL(url.pathname + url.search, url.origin));
    const modifiedResponse = new Response(response.body, response);
    
    modifiedResponse.headers.append('Set-Cookie', 
      `preview_token=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`
    );
    
    return addSecurityHeaders(modifiedResponse);
  }
  
  // --- HANDLE AUTHENTICATION FORM SUBMISSION ---
  if (request.method === 'POST' && url.pathname === '/api/auth') {
    const clientInfo = getClientInfo(request);
    
    // Check rate limit
    const rateLimit = await checkRateLimit(env, clientIP);
    if (!rateLimit.allowed) {
      await logAccess(env, 'rate_limited', clientInfo);
      return new Response(JSON.stringify({
        error: `Too many attempts. Please try again in ${rateLimit.resetIn} minutes.`
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    try {
      const formData = await request.formData();
      const submittedPassword = formData.get('password');
      const submittedEmail = formData.get('email');
      const redirectPath = formData.get('redirect');
      
      // Increment rate limit counter
      await incrementRateLimit(env, clientIP);
      
      // Verify password
      if (submittedPassword === AUTH_SECRET) {
        // Check email allowlist if configured
        if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(submittedEmail)) {
          await logAccess(env, 'auth_failed', { 
            ...clientInfo, 
            email: submittedEmail,
            reason: 'email_not_allowed' 
          });
          
          return new Response(JSON.stringify({
            error: 'This email is not authorized for access.'
          }), { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Success - clear rate limit
        if (env.RATE_LIMITS) {
          await env.RATE_LIMITS.delete(`ratelimit:${clientIP}`);
        }
        
        await logAccess(env, 'auth_success', { 
          ...clientInfo, 
          email: submittedEmail || 'unknown' 
        });
        
        const token = await generateToken(
          { 
            authenticated: true, 
            email: submittedEmail || 'unknown',
            ip: clientIP
          }, 
          TOKEN_SECRET
        );

        const response = new Response(JSON.stringify({
            success: true,
            redirect: redirectPath || '/'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

response.headers.append('Set-Cookie', `preview_token=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`);

return response;
        
      } else {
        // Invalid password
        await logAccess(env, 'auth_failed', { 
          ...clientInfo, 
          email: submittedEmail,
          reason: 'invalid_password' 
        });
        
        return new Response(JSON.stringify({
          error: 'Invalid password. Please try again.',
          attemptsRemaining: rateLimit.remaining - 1
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (e) {
      console.error('Auth error:', e);
      return new Response(JSON.stringify({
        error: 'Authentication error. Please try again.'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // --- REDIRECT TO AUTH PAGE ---
  const attemptedPath = url.pathname !== '/' ? url.pathname : '';
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `/auth.html${attemptedPath ? '?redirect=' + encodeURIComponent(attemptedPath) : ''}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}