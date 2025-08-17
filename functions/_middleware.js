// functions/_middleware.js

// 1. UPDATE THE FUNCTION SIGNATURE to include 'env'
export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  const PREVIEW_SECRET = 'JerryCanJoySept25';

  if (url.searchParams.get('preview') === PREVIEW_SECRET) {
    // This part is correct and stays the same.
    return next();
  }

  // 2. UPDATE THE FETCH METHOD to use Cloudflare's direct asset fetcher
  // This fetches the splash page without re-triggering the middleware.
  const splashPageUrl = new URL('/splash.html', url.origin);
  return env.ASSETS.fetch(splashPageUrl);
}