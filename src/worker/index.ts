import { Router } from 'itty-router';
import { authRoutes } from './routes/auth';
import { requestsRoutes } from './routes/requests';
import { analyticsRoutes } from './routes/analytics';
import { telegramRoutes } from './routes/telegram';
import { exportRoutes } from './routes/export';
import { corsHeaders } from './utils/cors';

export interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  JWT_SECRET: string;
}

const router = Router();

// CORS preflight
router.options('*', () => {
  return new Response(null, { headers: corsHeaders });
});

// API routes - подключаем подроутеры
router.all('/api/auth/*', (request, env, ctx) => authRoutes.handle(request, env, ctx));
router.all('/api/requests/*', (request, env, ctx) => requestsRoutes.handle(request, env, ctx));
router.all('/api/analytics/*', (request, env, ctx) => analyticsRoutes.handle(request, env, ctx));
router.all('/api/telegram/*', (request, env, ctx) => telegramRoutes.handle(request, env, ctx));
router.all('/api/export/*', (request, env, ctx) => exportRoutes.handle(request, env, ctx));

// Public endpoint для приёма заявок
router.post('/api/public/request', async (request, env: Env) => {
  try {
    const data = await request.json();
    const { name, phone, email, message } = data;

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Имя и телефон обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Сохранение заявки
    const result = await env.DB.prepare(
      `INSERT INTO requests (name, phone, email, message, status, source)
       VALUES (?, ?, ?, ?, 'new', 'website')`
    )
      .bind(name, phone, email || null, message || null)
      .run();

    const requestId = result.meta.last_row_id;

    // Запись в историю
    await env.DB.prepare(
      `INSERT INTO request_history (request_id, action, new_value)
       VALUES (?, 'created', ?)`
    )
      .bind(requestId, JSON.stringify({ name, phone, email }))
      .run();

    // Отправка уведомления в Telegram
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      try {
        const telegramMessage = `🆕 Новая заявка #${requestId}\n\n` +
          `Имя: ${name}\n` +
          `Телефон: ${phone}\n` +
          (email ? `Email: ${email}\n` : '') +
          (message ? `Сообщение: ${message}` : '');
        
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'HTML'
          })
        });
      } catch (error) {
        console.error('Telegram notification error:', error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: requestId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating request:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при создании заявки' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// 404 handler
router.all('*', () => {
  return new Response('Not Found', { status: 404, headers: corsHeaders });
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, ctx).then((response) => {
      // Добавляем CORS заголовки ко всем ответам
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    });
  }
};

