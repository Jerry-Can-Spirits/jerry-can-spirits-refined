// functions/_middleware.js - Enhanced Version with Rate Limiting & Analytics

import crypto from 'crypto';

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
  
  // Rate limiting using KV store
  async function checkRateLimit(env, ip) {
    if (!env.RATE_LIMITS) return { allowed: true, remaining: MAX_ATTEMPTS };
    
    const key = `ratelimit:${ip}`;
    const data = await env.RATE_LIMITS.get(key);
    
    if (!data) {
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }
    
    const { attempts, firstAttempt } = JSON.parse(data);
    const now = Date.now();
    
    // Reset if outside window
    if (now - firstAttempt > RATE_LIMIT_WINDOW) {
      await env.RATE_LIMITS.delete(key);
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }
    
    // Check if exceeded
    if (attempts >= MAX_ATTEMPTS) {
      const resetIn = Math.ceil((firstAttempt + RATE_LIMIT_WINDOW - now) / 1000 / 60);
      return { 
        allowed: false, 
        remaining: 0,
        resetIn: resetIn
      };
    }
    
    return { 
      allowed: true, 
      remaining: MAX_ATTEMPTS - attempts 
    };
  }
  
  // Increment rate limit counter
  async function incrementRateLimit(env, ip) {
    if (!env.RATE_LIMITS) return;
    
    const key = `ratelimit:${ip}`;
    const data = await env.RATE_LIMITS.get(key);
    const now = Date.now();
    
    if (!data) {
      await env.RATE_LIMITS.put(key, JSON.stringify({
        attempts: 1,
        firstAttempt: now
      }), {
        expirationTtl: Math.ceil(RATE_LIMIT_WINDOW / 1000)
      });
    } else {
      const parsed = JSON.parse(data);
      parsed.attempts++;
      await env.RATE_LIMITS.put(key, JSON.stringify(parsed), {
        expirationTtl: Math.ceil(RATE_LIMIT_WINDOW / 1000)
      });
    }
  }
  
  // Generate a secure token
  async function generateToken(data, secret) {
    const payload = JSON.stringify({ 
      ...data, 
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000),
      iat: Date.now()
    });
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );
    
    const token = btoa(payload) + '.' + btoa(String.fromCharCode(...new Uint8Array(signature)));
    return token;
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
    return next();
  }
  
  // --- STATIC ASSET CHECKS ---
  const isAstroAsset = url.pathname.startsWith('/_astro/');
  const staticExtensions = /\.(png|jpe?g|svg|gif|ico|woff2?|css|js|webp|avif|mp4|webm)$/i;
  const isStaticAsset = staticExtensions.test(url.pathname);
  const isSplashPage = url.pathname === '/splash' || url.pathname === '/splash.html';
  const isAuthPage = url.pathname === '/auth' || url.pathname === '/auth.html';
  
  if (isAstroAsset || isStaticAsset || isSplashPage || isAuthPage) {
    return next();
  }
  
  // --- CHECK EXISTING AUTHENTICATION ---
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const authToken = cookies.preview_token;
  
  if (authToken) {
    const tokenData = await verifyToken(authToken, TOKEN_SECRET);
    if (tokenData && tokenData.authenticated) {
      // Valid token, allow access
      return next();
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
    
    return modifiedResponse;
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
        
        return new Response(JSON.stringify({ 
          success: true,
          redirect: redirectPath || '/'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `preview_token=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`
          }
        });
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