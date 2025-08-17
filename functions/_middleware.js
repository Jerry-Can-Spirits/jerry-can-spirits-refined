// functions/_middleware.js

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  const PREVIEW_SECRET = 'JerryCanJoySept25';

  if (url.searchParams.get('preview') === PREVIEW_SECRET) {
    // If the password is correct, show the real website.
    return next();
  }

  // For everyone else, show the splash page directly from your assets.
  const splashPageUrl = new URL('/splash.html', url.origin);
  return env.ASSETS.fetch(splashPageUrl);
}