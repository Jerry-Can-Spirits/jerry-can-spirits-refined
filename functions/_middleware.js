// functions/_middleware.js

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // 1. CHOOSE YOUR SECRET PASSWORD
  // This can be any string you want.
  const PREVIEW_SECRET = 'your_secret_password_here';

  // 2. CHECK IF THE VISITOR HAS THE PASSWORD IN THE URL
  // e.g., https://jerrycanspirits.co.uk?preview=your_secret_password_here
  if (url.searchParams.get('preview') === PREVIEW_SECRET) {
    // If the password is correct, let them see the real website.
    return next();
  }

  // 3. FOR EVERYONE ELSE, SHOW THE SPLASH PAGE
  // This fetches the splash.html file we created and shows it to the user.
  const splashPageUrl = new URL('/splash.html', url.origin);
  return fetch(splashPageUrl);
}