import { Router } from 'itty-router';
import { Env } from '../index';
import { getAuthUser } from '../utils/auth';
import { corsHeaders } from '../utils/cors';

export const requestsRoutes = Router();

// Получение списка заявок
requestsRoutes.get('/api/requests', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = 'SELECT * FROM requests WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  // Менеджеры видят только свои заявки, админы - все
  if (user.role !== 'admin') {
    query += ' AND (assigned_to = ? OR assigned_to IS NULL)';
    params.push(user.userId);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const requests = await env.DB.prepare(query).bind(...params).all();

  // Получаем общее количество
  let countQuery = 'SELECT COUNT(*) as total FROM requests WHERE 1=1';
  const countParams: any[] = [];
  
  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }
  
  if (user.role !== 'admin') {
    countQuery += ' AND (assigned_to = ? OR assigned_to IS NULL)';
    countParams.push(user.userId);
  }

  const countResult = await env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return new Response(
    JSON.stringify({
      requests: requests.results,
      total: countResult?.total || 0,
      limit,
      offset
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

// Получение одной заявки
requestsRoutes.get('/api/requests/:id', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const id = parseInt(request.params?.id || '0');
  const requestData = await env.DB.prepare(
    'SELECT * FROM requests WHERE id = ?'
  ).bind(id).first();

  if (!requestData) {
    return new Response(
      JSON.stringify({ error: 'Заявка не найдена' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Получаем историю
  const history = await env.DB.prepare(
    `SELECT h.*, u.name as user_name 
     FROM request_history h 
     LEFT JOIN users u ON h.user_id = u.id 
     WHERE h.request_id = ? 
     ORDER BY h.created_at DESC`
  ).bind(id).all();

  // Получаем комментарии
  const comments = await env.DB.prepare(
    `SELECT c.*, u.name as user_name 
     FROM request_comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.request_id = ? 
     ORDER BY c.created_at ASC`
  ).bind(id).all();

  return new Response(
    JSON.stringify({
      request: requestData,
      history: history.results,
      comments: comments.results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

// Обновление статуса заявки
requestsRoutes.put('/api/requests/:id/status', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const id = parseInt(request.params?.id || '0');
  const { status } = await request.json();

  if (!['new', 'in_progress', 'closed'].includes(status)) {
    return new Response(
      JSON.stringify({ error: 'Неверный статус' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Получаем старый статус
  const oldRequest = await env.DB.prepare(
    'SELECT status FROM requests WHERE id = ?'
  ).bind(id).first<{ status: string }>();

  if (!oldRequest) {
    return new Response(
      JSON.stringify({ error: 'Заявка не найдена' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Обновляем статус
  await env.DB.prepare(
    'UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(status, id).run();

  // Записываем в историю
  await env.DB.prepare(
    `INSERT INTO request_history (request_id, user_id, action, old_value, new_value)
     VALUES (?, ?, 'status_changed', ?, ?)`
  )
    .bind(id, user.userId, oldRequest.status, status)
    .run();

  // Уведомление в Telegram
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    try {
      const statusNames: Record<string, string> = {
        new: 'Новая',
        in_progress: 'В работе',
        closed: 'Закрыта'
      };
      
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: `📝 Заявка #${id}: статус изменён на "${statusNames[status]}"`
        })
      });
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

// Назначение заявки
requestsRoutes.put('/api/requests/:id/assign', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const id = parseInt(request.params?.id || '0');
  const { userId } = await request.json();

  await env.DB.prepare(
    'UPDATE requests SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(userId || null, id).run();

  // Записываем в историю
  await env.DB.prepare(
    `INSERT INTO request_history (request_id, user_id, action, new_value)
     VALUES (?, ?, 'assigned', ?)`
  )
    .bind(id, user.userId, userId ? userId.toString() : 'unassigned')
    .run();

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

// Добавление комментария
requestsRoutes.post('/api/requests/:id/comments', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const id = parseInt(request.params?.id || '0');
  const { comment } = await request.json();

  if (!comment) {
    return new Response(
      JSON.stringify({ error: 'Комментарий обязателен' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const result = await env.DB.prepare(
    'INSERT INTO request_comments (request_id, user_id, comment) VALUES (?, ?, ?)'
  ).bind(id, user.userId, comment).run();

  // Записываем в историю
  await env.DB.prepare(
    `INSERT INTO request_history (request_id, user_id, action, comment)
     VALUES (?, ?, 'comment_added', ?)`
  )
    .bind(id, user.userId, comment)
    .run();

  return new Response(
    JSON.stringify({ success: true, id: result.meta.last_row_id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

