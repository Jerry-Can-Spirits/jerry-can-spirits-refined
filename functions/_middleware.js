// functions/_middleware.js  (Temporary Debugging Version)

export async function onRequest({ request }) {
  const url = new URL(request.url);
  
  // Get the value of the 'preview' parameter from the URL
  const paramValue = url.searchParams.get('preview');
  
  // This is the secret we are expecting
  const secretValue = 'JerryCanJoySept25';

  // Create a simple HTML page to show our findings
  const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Middleware Debugger</title>
      <style>
        body { font-family: sans-serif; padding: 2rem; background: #f0f0f0; }
        p { font-size: 1.2rem; }
        strong { background: #fff; padding: 0.2rem 0.4rem; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>Gatekeeper Debugger</h1>
      <p>URL Parameter Searched: <strong>?preview=...</strong></p>
      <p>Value Found in URL: <strong>${paramValue || 'Not Found'}</strong></p>
      <hr>
      <p>Expected Secret Value: <strong>${secretValue}</strong></p>
      <p>Do they match? <strong>${paramValue === secretValue}</strong></p>
    </body>
    </html>
  `;

  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  });
}