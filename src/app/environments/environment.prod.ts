export const environment = {
  production: true,
  apiUrl: '/api',
  // Left empty on purpose: shipping a real key here would leak it in the
  // client bundle. nginx injects X-API-Key server-side in production.
  apiKey: '',
};
