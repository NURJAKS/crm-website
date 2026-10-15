import { Router } from 'itty-router';
import { Env } from '../index';
import { getAuthUser } from '../utils/auth';
import { corsHeaders } from '../utils/cors';

export const analyticsRoutes = Router();

// Получение статистики
analyticsRoutes.get('/api/analytics/stats', async (request, env: Env) => {
  const user = await getAuthUser(request, env);
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Не авторизован' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let whereClause = '';
  const params: any[] = [];

  // Менеджеры видят только свои заявки
  if (user.role !== 'admin') {
    whereClause = 'WHERE assigned_to = ? OR assigned_to IS NULL';
    params.push(user.userId);
  }

  // Общее количество заявок
  const totalResult = await env.DB.prepare(
    `SELECT COUNT(*) as total FROM requests ${whereClause}`
  ).bind(...params).first<{ total: number }>();

  // По статусам
  const statusQuery = `SELECT status, COUNT(*) as count 
                       FROM requests ${whereClause} 
                       GROUP BY status`;
  const statusResult = await env.DB.prepare(statusQuery).bind(...params).all();

  // Заявки за последние 7 дней
  const last7DaysQuery = `SELECT DATE(created_at) as date, COUNT(*) as count 
                          FROM requests 
                          ${whereClause ? whereClause + ' AND' : 'WHERE'} 
                          created_at >= datetime('now', '-7 days')
                          GROUP BY DATE(created_at)
                          ORDER BY date ASC`;
  const last7DaysResult = await env.DB.prepare(last7DaysQuery).bind(...params).all();

  // Заявки по источникам
  const sourceQuery = `SELECT source, COUNT(*) as count 
                       FROM requests ${whereClause} 
                       GROUP BY source`;
  const sourceResult = await env.DB.prepare(sourceQuery).bind(...params).all();

  return new Response(
    JSON.stringify({
      total: totalResult?.total || 0,
      byStatus: statusResult.results,
      last7Days: last7DaysResult.results,
      bySource: sourceResult.results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

