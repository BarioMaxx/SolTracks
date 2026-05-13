import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createJWT(payload: Record<string, any>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyJWT(
  token: string
): Promise<Record<string, any> | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as Record<string, any>;
  } catch (err) {
    return null;
  }
}

export function getTokenFromCookie(cookies: string): string | null {
  const token = cookies
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  return token || null;
}
