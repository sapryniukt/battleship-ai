import { type H3Event } from 'h3';

// Module-scoped in-memory rate limit store
const rateLimitMap = new Map<string, { count: number; start: number }>();
export default defineEventHandler((event: H3Event) => {
  const { req, res } = event.node;

  // Simple in-memory rate limiter
  // Use module-scoped rate limit map
  const rateMap = rateLimitMap;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  const now = Date.now();
  const WINDOW_MS = 60 * 1000; // 1 minute window

  // Remove entries older than the window to prevent memory leaks
  for (const [key, entry] of rateMap) {
    if (now - entry.start > WINDOW_MS) {
      rateMap.delete(key);
    }
  }
  const MAX_REQUESTS = 100;

  let entry = rateMap.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    entry = { count: 1, start: now };
  } else {
    entry.count++;
  }
  rateMap.set(ip, entry);

  if (entry.count > MAX_REQUESTS) {
    res.statusCode = 429;
    res.end('Too Many Requests');
    return;
  }
});
