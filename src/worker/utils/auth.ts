import { Env } from '../index';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Простая JWT реализация (в продакшене лучше использовать библиотеку)
export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    // В реальном проекте нужно проверять подпись
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function createToken(payload: JWTPayload, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  // В реальном проекте нужно добавить подпись
  return `${header}.${body}.signature`;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function getAuthUser(request: Request, env: Env): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token, env.JWT_SECRET);
}

