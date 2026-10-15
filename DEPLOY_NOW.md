# 🚀 Инструкция для деплоя ПРЯМО СЕЙЧАС

## ✅ Что уже готово:
- ✅ Код скомпилирован и проверен
- ✅ База данных создана локально
- ✅ API работает локально (проверено)
- ✅ Фронтенд готов к сборке

## 📋 Шаги для деплоя:

### 1. Авторизация в Cloudflare (ОБЯЗАТЕЛЬНО)

```bash
npx wrangler login
```

Откроется браузер - войдите в свой аккаунт Cloudflare.

### 2. Создание базы данных в Cloudflare

```bash
npm run db:create
```

**ВАЖНО:** Скопируйте `database_id` из вывода команды!

### 3. Обновление wrangler.toml

Откройте `wrangler.toml` и замените:
```toml
database_id = "your-database-id-here"
```
на реальный ID из шага 2.

### 4. Применение миграций

```bash
npm run db:migrate
```

### 5. Настройка секретов в Cloudflare Dashboard

1. Откройте https://dash.cloudflare.com
2. Workers & Pages → ваш worker (будет создан при деплое)
3. Settings → Variables
4. Добавьте секреты:
   - `TELEGRAM_BOT_TOKEN` (если нужен Telegram)
   - `TELEGRAM_CHAT_ID` (если нужен Telegram)  
   - `JWT_SECRET` (любая случайная строка 32+ символов)

### 6. Деплой Workers

```bash
npm run deploy
```

После деплоя вы получите ссылку вида:
```
https://crm-website.YOUR_SUBDOMAIN.workers.dev
```

### 7. Деплой фронтенда

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=crm-frontend
```

Или через Cloudflare Dashboard:
1. Pages → Create a project
2. Upload `frontend/dist` folder
3. Получите ссылку вида: `https://crm-frontend.pages.dev`

### 8. Настройка переменной для фронтенда

В Cloudflare Pages → Settings → Environment variables добавьте:
```
VITE_API_BASE=https://crm-website.YOUR_SUBDOMAIN.workers.dev/api
```

Или если фронтенд и API на одном домене, используйте относительный путь:
```
VITE_API_BASE=/api
```

### 9. Создание первого администратора

```bash
curl -X POST https://YOUR_WORKER_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_password",
    "name": "Администратор",
    "role": "admin"
  }'
```

## 🎯 Быстрый деплой одной командой:

Если вы уже авторизованы и настроили wrangler.toml:

```bash
npm run db:migrate && npm run deploy && cd frontend && npm run build && npx wrangler pages deploy dist
```

## 📱 Ваши ссылки после деплоя:

- **API/Workers:** `https://crm-website.YOUR_SUBDOMAIN.workers.dev`
- **Frontend:** `https://crm-frontend.pages.dev` (или ваш домен)
- **Вход:** `https://YOUR_FRONTEND_URL/login`

## ⚠️ Если что-то не работает:

1. Проверьте логи: `npx wrangler tail`
2. Проверьте переменные окружения в Dashboard
3. Убедитесь, что база данных создана и миграции применены
4. Проверьте CORS настройки (должны быть настроены автоматически)

## 🔧 Локальный запуск (для тестирования):

```bash
# Терминал 1: Workers
npm run dev

# Терминал 2: Frontend  
cd frontend && npm run dev
```

- Workers: http://localhost:8787
- Frontend: http://localhost:5173

