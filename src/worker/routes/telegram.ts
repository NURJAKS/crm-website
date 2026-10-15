import { Router } from 'itty-router';
import { Env } from '../index';
import { corsHeaders } from '../utils/cors';

export const telegramRoutes = Router();

// Webhook для Telegram бота
telegramRoutes.post('/api/telegram/webhook', async (request, env: Env) => {
  try {
    const update = await request.json();

    // Обработка callback от кнопок
  if (update.callback_query) {
    const { data, message, from } = update.callback_query;
    const chatId = message?.chat.id;

    if (data === 'list_requests') {
      const requests = await env.DB.prepare(
        'SELECT * FROM requests ORDER BY created_at DESC LIMIT 10'
      ).all();

      if (requests.results.length === 0) {
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId!, 'Заявок пока нет');
      } else {
        let message = '📋 Последние заявки:\n\n';
        for (const req of requests.results as any[]) {
          const statusEmoji: Record<string, string> = {
            new: '🆕',
            in_progress: '🔄',
            closed: '✅'
          };
          message += `${statusEmoji[req.status] || '📝'} #${req.id} - ${req.name}\n`;
          message += `📞 ${req.phone}\n\n`;
        }
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId!, message);
      }

      // Отвечаем на callback
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: update.callback_query.id
        })
      });
      return new Response('OK', { headers: corsHeaders });
    }

    if (data === 'stats') {
      const stats = await env.DB.prepare(
        'SELECT status, COUNT(*) as count FROM requests GROUP BY status'
      ).all();

      let message = '📊 Статистика:\n\n';
      for (const stat of stats.results as any[]) {
        message += `${stat.status}: ${stat.count}\n`;
      }

      const total = await env.DB.prepare('SELECT COUNT(*) as total FROM requests')
        .first<{ total: number }>();
      message += `\nВсего: ${total?.total || 0}`;

      await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId!, message);

      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: update.callback_query.id
        })
      });
      return new Response('OK', { headers: corsHeaders });
    }

    if (data === 'new_requests' || data === 'in_progress') {
      const status = data === 'new_requests' ? 'new' : 'in_progress';
      const requests = await env.DB.prepare(
        `SELECT * FROM requests WHERE status = ? ORDER BY created_at DESC LIMIT 10`
      ).bind(status).all();

      if (requests.results.length === 0) {
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId!, `Заявок со статусом "${status}" нет`);
      } else {
        let message = `📋 Заявки (${status}):\n\n`;
        for (const req of requests.results as any[]) {
          message += `#${req.id} - ${req.name}\n📞 ${req.phone}\n\n`;
        }
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId!, message);
      }

      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: update.callback_query.id
        })
      });
      return new Response('OK', { headers: corsHeaders });
    }
  }

  if (update.message) {
      const { text, chat } = update.message;

      // Команда /start
      if (text === '/start') {
        await sendTelegramMessageWithKeyboard(
          env.TELEGRAM_BOT_TOKEN,
          chat.id,
          '👋 Добро пожаловать в CRM систему!\n\n' +
          'Выберите действие:',
          {
            inline_keyboard: [
              [
                { text: '📋 Список заявок', callback_data: 'list_requests' },
                { text: '📊 Статистика', callback_data: 'stats' }
              ],
              [
                { text: '🆕 Новые заявки', callback_data: 'new_requests' },
                { text: '🔄 В работе', callback_data: 'in_progress' }
              ]
            ]
          }
        );
      }
      // Команда /requests
      else if (text === '/requests') {
        const requests = await env.DB.prepare(
          'SELECT * FROM requests ORDER BY created_at DESC LIMIT 10'
        ).all();

        if (requests.results.length === 0) {
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chat.id, 'Заявок пока нет');
        } else {
          let message = '📋 Последние заявки:\n\n';
          for (const req of requests.results as any[]) {
            const statusEmoji: Record<string, string> = {
              new: '🆕',
              in_progress: '🔄',
              closed: '✅'
            };
            message += `${statusEmoji[req.status] || '📝'} #${req.id} - ${req.name}\n`;
            message += `📞 ${req.phone}\n`;
            message += `Статус: ${req.status}\n\n`;
          }
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chat.id, message);
        }
      }
      // Команда /stats
      else if (text === '/stats') {
        const stats = await env.DB.prepare(
          'SELECT status, COUNT(*) as count FROM requests GROUP BY status'
        ).all();

        let message = '📊 Статистика:\n\n';
        for (const stat of stats.results as any[]) {
          message += `${stat.status}: ${stat.count}\n`;
        }

        const total = await env.DB.prepare('SELECT COUNT(*) as total FROM requests')
          .first<{ total: number }>();
        message += `\nВсего: ${total?.total || 0}`;

        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chat.id, message);
      }
      // Изменение статуса через команду /status ID STATUS
      else if (text?.startsWith('/status ')) {
        const parts = text.split(' ');
        if (parts.length === 3) {
          const id = parseInt(parts[1]);
          const status = parts[2];

          if (['new', 'in_progress', 'closed'].includes(status)) {
            const oldRequest = await env.DB.prepare(
              'SELECT status FROM requests WHERE id = ?'
            ).bind(id).first<{ status: string }>();

            if (oldRequest) {
              await env.DB.prepare(
                'UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
              ).bind(status, id).run();

              await sendTelegramMessage(
                env.TELEGRAM_BOT_TOKEN,
                chat.id,
                `✅ Статус заявки #${id} изменён на "${status}"`
              );
            } else {
              await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chat.id, 'Заявка не найдена');
            }
          }
        }
      }
    }

    return new Response('OK', { headers: corsHeaders });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});

async function sendTelegramMessage(botToken: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    })
  });
}

async function sendTelegramMessageWithKeyboard(
  botToken: string,
  chatId: number,
  text: string,
  replyMarkup: any
) {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    })
  });
}

