# Инструкция по деплою

## Подготовка

### 1. Установка Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Авторизация в Cloudflare

```bash
wrangler login
```

## Создание базы данных D1

### 1. Создание базы данных

```bash
npm run db:create
```

Команда вернёт `database_id`. Скопируйте его и вставьте в `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "crm-db"
database_id = "ВАШ_DATABASE_ID"
```

### 2. Применение миграций

```bash
npm run db:migrate
```

## Настройка переменных окружения

### 1. В локальном файле (для разработки)

Отредактируйте `wrangler.toml`:

```toml
[vars]
TELEGRAM_BOT_TOKEN = "ваш_токен"
TELEGRAM_CHAT_ID = "ваш_chat_id"
JWT_SECRET = "случайная_строка_минимум_32_символа"
```

### 2. В Cloudflare Dashboard (для продакшена)

1. Перейдите в Workers & Pages → ваш worker → Settings → Variables
2. Добавьте секреты:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `JWT_SECRET`

## Создание первого администратора

### Вариант 1: Через API (после деплоя)

```bash
curl -X POST https://your-worker.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password",
    "name": "Администратор",
    "role": "admin"
  }'
```

### Вариант 2: Через SQL (локально)

```bash
# Подключитесь к локальной БД
wrangler d1 execute crm-db --local --command "INSERT INTO users (email, password_hash, name, role) VALUES ('admin@example.com', 'хеш_пароля', 'Администратор', 'admin')"
```

Для получения хеша пароля используйте скрипт:

```bash
npx tsx scripts/create-admin.ts
```

## Деплой Workers

### 1. Деплой в продакшен

```bash
npm run deploy
```

### 2. Проверка деплоя

```bash
curl https://your-worker.workers.dev/api/public/request \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "phone": "+79991234567"}'
```

## Деплой фронтенда

### Вариант 1: Cloudflare Pages (рекомендуется)

1. Соберите проект:

```bash
cd frontend
npm run build
```

2. В Cloudflare Dashboard:
   - Перейдите в Pages
   - Создайте новый проект
   - Загрузите папку `frontend/dist`
   - Настройте домен

### Вариант 2: Через Wrangler

```bash
cd frontend
npm run build
wrangler pages deploy dist
```

### Настройка переменных для фронтенда

В Cloudflare Pages настройте переменную окружения:

```
VITE_API_BASE=https://your-worker.workers.dev/api
```

Или используйте относительные пути (если фронтенд и API на одном домене).

## Настройка Telegram бота

### 1. Создание бота

1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Сохраните токен

### 2. Получение Chat ID

1. Найдите [@userinfobot](https://t.me/userinfobot)
2. Отправьте сообщение
3. Скопируйте Chat ID

### 3. Настройка Webhook

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker.workers.dev/api/telegram/webhook"}'
```

### 4. Проверка работы

Отправьте боту `/start` - он должен ответить.

## Проверка работоспособности

### 1. Публичный API

```bash
# Создание заявки
curl -X POST https://your-worker.workers.dev/api/public/request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "phone": "+79991234567",
    "email": "ivan@example.com",
    "message": "Тестовая заявка"
  }'
```

### 2. Авторизация

```bash
# Вход
curl -X POST https://your-worker.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

### 3. Получение заявок

```bash
# С токеном из предыдущего запроса
curl https://your-worker.workers.dev/api/requests \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Проблема: База данных не найдена

**Решение:** Убедитесь, что `database_id` правильно указан в `wrangler.toml` и миграции применены.

### Проблема: CORS ошибки

**Решение:** Проверьте, что CORS заголовки правильно настроены в `src/worker/utils/cors.ts`.

### Проблема: Telegram бот не отвечает

**Решение:** 
1. Проверьте токен и Chat ID
2. Убедитесь, что webhook настроен
3. Проверьте логи в Cloudflare Dashboard

### Проблема: JWT не работает

**Решение:** Убедитесь, что `JWT_SECRET` установлен и одинаковый на всех окружениях.

## Мониторинг

### Просмотр логов

```bash
wrangler tail
```

### Метрики в Cloudflare Dashboard

- Workers → ваш worker → Metrics
- Pages → ваш проект → Analytics

## Обновление

### Обновление Workers

```bash
npm run deploy
```

### Обновление фронтенда

```bash
cd frontend
npm run build
wrangler pages deploy dist
```

### Применение новых миграций

```bash
npm run db:migrate
```

