import { Router } from 'itty-router';
import { Env, JWTPayload } from '../index';
import { createToken, hashPassword, verifyPassword, getAuthUser } from '../utils/auth';
import { corsHeaders } from '../utils/cors';

export const authRoutes = Router();

// Регистрация
authRoutes.post('/api/auth/register', async (request, env: Env) => {
  try {
    const { email, password, name, role = 'manager' } = await request.json();

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, пароль и имя обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Проверка существующего пользователя
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Пользователь с таким email уже существует' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await env.DB.prepare(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
    )
      .bind(email, passwordHash, name, role)
      .run();

    const token = await createToken(
      { userId: result.meta.last_row_id as number, email, role },
      env.JWT_SECRET
    );

    return new Response(
      JSON.stringify({ token, user: { id: result.meta.last_row_id, email, name, role } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при регистрации' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Вход
authRoutes.post('/api/auth/login', async (request, env: Env) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email и пароль обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = await env.DB.prepare(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = ?'
    ).bind(email).first<{
      id: number;
      email: string;
      password_hash: string;
      name: string;
      role: string;
    }>();

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return new Response(
        JSON.stringify({ error: 'Неверный email или пароль' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = await createToken(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET
    );

    return new Response(
      JSON.stringify({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при входе' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Получение текущего пользователя
authRoutes.get('/api/auth/me', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const userData = await env.DB.prepare(
    'SELECT id, email, name, role, created_at FROM users WHERE id = ?'
  ).bind(user.userId).first();

  return new Response(
    JSON.stringify({ user: userData }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

