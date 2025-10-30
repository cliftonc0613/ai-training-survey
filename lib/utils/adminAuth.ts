import { NextRequest } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return false;
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export function createAuthResponse() {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  });
}
