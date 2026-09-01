export const environment = {
  production: false,
  apiUrl: '/api',
  // Matches api-rag/.env's local API_KEY. In production this stays empty —
  // nginx injects the real key server-side (see nginx/default.conf.template).
  apiKey: 'dev-local-key',
};
