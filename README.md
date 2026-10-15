# CRM система для управления заявками

Лёгкая система для приёма заявок, управления клиентами и автоматизации базовых бизнес-процессов с интеграцией Telegram.

## 🚀 Технологии

- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: React + TypeScript + Vite
- **Deployment**: Cloudflare Pages + Workers
- **Telegram**: Bot API для уведомлений

## 📋 Возможности

- ✅ Приём заявок с публичного сайта
- ✅ Личный кабинет с авторизацией
- ✅ Управление заявками (статусы, комментарии, история)
- ✅ Система ролей (админ, менеджер)
- ✅ Аналитика и статистика
- ✅ Интеграция с Telegram для уведомлений
- ✅ Фильтрация и поиск заявок

## 🛠️ Установка и настройка

### 1. Установка зависимостей

```bash
# Установка зависимостей для Workers
npm install

# Установка зависимостей для фронтенда
cd frontend
npm install
```

### 2. Создание базы данных D1

```bash
# Создание базы данных
npm run db:create

# Применение миграций
npm run db:migrate
```

После создания базы данных, обновите `database_id` в `wrangler.toml`.

### 3. Настройка переменных окружения

Отредактируйте `wrangler.toml`:

```toml
[vars]
TELEGRAM_BOT_TOKEN = "ваш_токен_бота"
TELEGRAM_CHAT_ID = "ваш_chat_id"
JWT_SECRET = "случайная_строка_для_безопасности"
```

**Как получить Telegram токен:**
1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и получите токен

**Как получить Chat ID:**
1. Найдите [@userinfobot](https://t.me/userinfobot) в Telegram
2. Отправьте любое сообщение
3. Бот вернёт ваш Chat ID

### 4. Создание первого администратора

После применения миграций, создайте первого пользователя через API:

```bash
curl -X POST https://your-worker.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Администратор",
    "role": "admin"
  }'
```

Или используйте SQL напрямую (пароль: admin123, хеш SHA-256):

```sql
INSERT INTO users (email, password_hash, name, role) 
VALUES (
  'admin@example.com',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Администратор',
  'admin'
);
```

## 🚀 Разработка

### Запуск Workers в режиме разработки

```bash
npm run dev
```

### Запуск фронтенда в режиме разработки

```bash
cd frontend
npm run dev
```

Настройте `VITE_API_BASE` в `.env` для подключения к локальному Workers:

```env
VITE_API_BASE=http://localhost:8787/api
```

## 📦 Деплой

### 1. Деплой Workers

```bash
npm run deploy
```

### 2. Деплой фронтенда на Cloudflare Pages

```bash
cd frontend
npm run build
```

Затем загрузите папку `frontend/dist` в Cloudflare Pages через веб-интерфейс или используйте Wrangler:

```bash
wrangler pages deploy frontend/dist
```

### 3. Настройка переменных окружения в Cloudflare

В панели Cloudflare Workers настройте:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `JWT_SECRET`

## 📱 Использование Telegram бота

После настройки webhook, бот будет отвечать на команды:

- `/start` - приветствие и список команд
- `/requests` - список последних 10 заявок
- `/stats` - статистика по заявкам
- `/status ID STATUS` - изменение статуса заявки (например: `/status 1 in_progress`)

Для настройки webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker.workers.dev/api/telegram/webhook"}'
```

## 📁 Структура проекта

```
crm-website/
├── src/worker/          # Cloudflare Workers код
│   ├── routes/          # API маршруты
│   ├── utils/           # Утилиты (auth, cors)
│   └── index.ts         # Главный файл Workers
├── frontend/            # React приложение
│   ├── src/
│   │   ├── pages/       # Страницы
│   │   ├── components/   # Компоненты
│   │   └── contexts/    # React контексты
│   └── package.json
├── migrations/          # SQL миграции для D1
├── wrangler.toml        # Конфигурация Workers
└── package.json
```

## 🔐 Безопасность

⚠️ **Важно:**
- Используйте сильные пароли для JWT_SECRET
- Не коммитьте секреты в репозиторий
- В продакшене используйте переменные окружения Cloudflare
- Регулярно обновляйте зависимости

## 📝 API Endpoints

### Публичные
- `POST /api/public/request` - создание заявки

### Авторизация
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `GET /api/auth/me` - текущий пользователь

### Заявки
- `GET /api/requests` - список заявок
- `GET /api/requests/:id` - детали заявки
- `PUT /api/requests/:id/status` - изменение статуса
- `PUT /api/requests/:id/assign` - назначение ответственного
- `POST /api/requests/:id/comments` - добавление комментария

### Аналитика
- `GET /api/analytics/stats` - статистика

### Telegram
- `POST /api/telegram/webhook` - webhook для бота

## 🎯 Роли пользователей

- **admin** - полный доступ ко всем заявкам и функциям
- **manager** - доступ только к назначенным заявкам

## 📄 Лицензия

MIT

## 🤝 Поддержка

Для вопросов и предложений создавайте issues в репозитории.

