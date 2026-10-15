# 🚀 Финальная инструкция по деплою для портфолио

## ✅ Что уже готово:

- ✅ **10+ публичных страниц** (главная, услуги, тарифы, блог, о нас, контакты)
- ✅ **Тёмная/светлая тема** с переключением
- ✅ **Личный кабинет** с полным функционалом
- ✅ **Поиск и фильтры** в заявках
- ✅ **Экспорт данных** (CSV, JSON)
- ✅ **Telegram бот** с интерактивными кнопками
- ✅ **Настройки профиля**
- ✅ **Адаптивный дизайн**

## 📋 Пошаговая инструкция деплоя:

### 1. Авторизация в Cloudflare

```bash
npx wrangler login
```

Откроется браузер - войдите в аккаунт Cloudflare.

### 2. Создание базы данных D1

```bash
npm run db:create
```

**ВАЖНО:** Скопируйте `database_id` из вывода!

Пример вывода:
```
✅ Successfully created DB 'crm-db'!

[[d1_databases]]
binding = "DB"
database_name = "crm-db"
database_id = "a1b2c3d4e5f6g7h8i9j0"  ← ЭТО НУЖНО СКОПИРОВАТЬ
```

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

### 5. Настройка переменных окружения

В Cloudflare Dashboard:
1. Перейдите в **Workers & Pages** → ваш worker
2. **Settings** → **Variables**
3. Добавьте секреты:
   - `TELEGRAM_BOT_TOKEN` (если используете Telegram)
   - `TELEGRAM_CHAT_ID` (если используете Telegram)
   - `JWT_SECRET` (любая случайная строка 32+ символов)

**Или** отредактируйте `wrangler.toml`:
```toml
[vars]
TELEGRAM_BOT_TOKEN = "ваш_токен"
TELEGRAM_CHAT_ID = "ваш_chat_id"
JWT_SECRET = "случайная_строка_минимум_32_символа"
```

### 6. Деплой Workers

```bash
npm run deploy
```

После деплоя вы получите ссылку:
```
https://crm-website.YOUR_SUBDOMAIN.workers.dev
```

### 7. Сборка фронтенда

```bash
cd frontend
npm run build
```

### 8. Деплой фронтенда на Cloudflare Pages

**Вариант A: Через Wrangler**
```bash
npx wrangler pages deploy dist --project-name=crm-frontend
```

**Вариант B: Через Dashboard**
1. Откройте Cloudflare Dashboard
2. **Pages** → **Create a project**
3. **Upload assets**
4. Загрузите папку `frontend/dist`
5. Назовите проект (например: `crm-frontend`)

### 9. Настройка переменных для фронтенда

В Cloudflare Pages → Settings → Environment variables:

**Для Production:**
```
VITE_API_BASE=https://crm-website.YOUR_SUBDOMAIN.workers.dev/api
```

Замените `YOUR_SUBDOMAIN` на ваш реальный subdomain.

### 10. Создание первого администратора

```bash
curl -X POST https://YOUR_WORKER_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password_123",
    "name": "Администратор",
    "role": "admin"
  }'
```

### 11. Настройка Telegram бота (опционально)

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен
3. Получите Chat ID через [@userinfobot](https://t.me/userinfobot)
4. Настройте webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_WORKER_URL/api/telegram/webhook"}'
```

## 🎯 Проверка работы

1. Откройте фронтенд: `https://crm-frontend.pages.dev`
2. Проверьте публичные страницы
3. Войдите в систему
4. Создайте тестовую заявку
5. Проверьте личный кабинет
6. Проверьте экспорт данных
7. Проверьте Telegram бота (если настроен)

## 📊 Что получилось:

### Публичные страницы (10+):
- ✅ Главная
- ✅ Услуги
- ✅ Тарифы
- ✅ Как это работает
- ✅ О нас
- ✅ Блог
- ✅ Контакты
- ✅ Вход

### Личный кабинет:
- ✅ Панель управления
- ✅ Управление заявками (с поиском и фильтрами)
- ✅ Детальная страница заявки
- ✅ Аналитика
- ✅ Настройки

### Функции:
- ✅ Тёмная/светлая тема
- ✅ Поиск по заявкам
- ✅ Фильтрация по статусам
- ✅ Экспорт CSV/JSON
- ✅ Telegram интеграция
- ✅ Адаптивный дизайн

## 🔗 Ваши ссылки после деплоя:

- **API/Workers:** `https://crm-website.YOUR_SUB.workers.dev`
- **Frontend:** `https://crm-frontend.pages.dev`
- **Вход:** `https://crm-frontend.pages.dev/login`

## 📝 Для портфолио:

1. Сделайте скриншоты всех страниц
2. Запишите демо-видео
3. Опишите технологии в README
4. Добавьте ссылки на деплой
5. Укажите особенности проекта

## ⚠️ Важные замечания:

- Не коммитьте секреты в репозиторий
- Используйте сильные пароли для JWT_SECRET
- Регулярно обновляйте зависимости
- Мониторьте использование ресурсов Cloudflare

## 🎉 Готово!

Проект полностью готов для демонстрации в портфолио!

