// functions/_middleware.js

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  const PREVIEW_SECRET = 'JerryCanJoySept25';

  // --- NEW, MORE ROBUST CHECK ---

  // 1. Check for the secret password in the URL
  const hasSecret = url.searchParams.get('preview') === PREVIEW_SECRET;

  // 2. Check if the request is for an Astro-processed asset (like CSS or JS)
  const isAstroAsset = url.pathname.startsWith('/_astro/');

  // 3. Check if it's for a static file in your /public folder (like an image)
  const isPublicAsset = /\.(png|jpe?g|svg|gif|ico|woff2?)$/.test(url.pathname);

  // --- FINAL LOGIC ---
  // If the request has the secret, OR is for an Astro asset, OR is for a public asset,
  // then let it pass through to the actual site.
  if (hasSecret || isAstroAsset || isPublicAsset) {
    return next();
  }

  // For all other page requests without a password, show the splash page.
  const splashPageUrl = new URL('/splash.html', url.origin);
  return env.ASSETS.fetch(splashPageUrl);
}