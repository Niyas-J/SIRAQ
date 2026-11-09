import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@siraq.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SiraqAdmin2026!';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'siraq-secret-key-token-389274';

// Simple signed token generator
export function createAdminToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestampStr, signature] = decoded.split(':');
    if (!username || !timestampStr || !signature) return false;

    // Verify age (7 days session validity)
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedHmac = crypto
      .createHmac('sha256', ADMIN_SESSION_SECRET)
      .update(`${username}:${timestampStr}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

export function validateAdminCredentials(username: string, pass: string): boolean {
  const cleanUser = username.trim().toLowerCase();
  const validUser = ADMIN_USERNAME.toLowerCase();

  return (
    (cleanUser === validUser || cleanUser === 'admin') &&
    pass.trim() === ADMIN_PASSWORD.trim()
  );
}

// Server-side check for Next.js App Router API routes / Server Components
export function isRequestAdminAuthorized(authHeader?: string | null): boolean {
  // Check header Authorization: Bearer <token>
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (verifyAdminToken(token)) return true;
  }

  // Check custom agent or admin header
  if (authHeader === process.env.SIRAQ_AGENT_KEY || authHeader === 'siraq-local-agent-key-2026') {
    return true;
  }

  return false;
}

