import { Router } from 'itty-router';
import { Env } from '../index';
import { getAuthUser } from '../utils/auth';
import { corsHeaders } from '../utils/cors';

export const exportRoutes = Router();

// Экспорт в CSV
exportRoutes.get('/api/export/csv', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let whereClause = '';
  const params: any[] = [];

  if (user.role !== 'admin') {
    whereClause = 'WHERE assigned_to = ? OR assigned_to IS NULL';
    params.push(user.userId);
  }

  const requests = await env.DB.prepare(
    `SELECT * FROM requests ${whereClause} ORDER BY created_at DESC`
  ).bind(...params).all();

  // Формируем CSV
  const headers = ['ID', 'Имя', 'Телефон', 'Email', 'Сообщение', 'Статус', 'Источник', 'Создано', 'Обновлено'];
  const rows = (requests.results as any[]).map(req => [
    req.id,
    `"${req.name}"`,
    req.phone,
    req.email || '',
    `"${(req.message || '').replace(/"/g, '""')}"`,
    req.status,
    req.source,
    req.created_at,
    req.updated_at
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return new Response(csv, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="requests-${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
});

// Экспорт в JSON
exportRoutes.get('/api/export/json', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let whereClause = '';
  const params: any[] = [];

  if (user.role !== 'admin') {
    whereClause = 'WHERE assigned_to = ? OR assigned_to IS NULL';
    params.push(user.userId);
  }

  const requests = await env.DB.prepare(
    `SELECT * FROM requests ${whereClause} ORDER BY created_at DESC`
  ).bind(...params).all();

  return new Response(JSON.stringify(requests.results, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="requests-${new Date().toISOString().split('T')[0]}.json"`
    }
  });
});

