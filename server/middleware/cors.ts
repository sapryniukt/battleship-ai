import { type H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  const { req, res } = event.node;
  const origin = req.headers.origin;
  const host = req.headers.host;

  // Only echo back the Origin if it exactly matches our own host
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
      }
    } catch (err: unknown) {
      // invalid URL in Origin → don't set CORS header
      console.error(err);
    }
  }

  // Allow only the methods your API actually uses
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Allow whichever headers you need
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Cache pre-flight response
  res.setHeader('Access-Control-Max-Age', '0');

  // Handle pre-flight and terminate early
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
  }
});
