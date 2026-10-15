# 🚀 Быстрый старт

## Локальный запуск

### 1. Запуск Workers (API)

```bash
npm run dev
```

Workers будет доступен на `http://localhost:8787`

### 2. Запуск фронтенда

В новом терминале:

```bash
cd frontend
npm run dev
```

Фронтенд будет доступен на `http://localhost:5173`

## Деплой в Cloudflare

### Вариант 1: Автоматический деплой

```bash
./deploy.sh
```

### Вариант 2: Ручной деплой

#### Шаг 1: Авторизация

```bash
npx wrangler login
```

#### Шаг 2: Создание базы данных

```bash
npm run db:create
```

Скопируйте `database_id` из вывода и вставьте в `wrangler.toml`

#### Шаг 3: Применение миграций

```bash
npm run db:migrate
```

#### Шаг 4: Настройка переменных

В Cloudflare Dashboard → Workers → Settings → Variables добавьте:
- `TELEGRAM_BOT_TOKEN` (если используете Telegram)
- `TELEGRAM_CHAT_ID` (если используете Telegram)
- `JWT_SECRET` (случайная строка минимум 32 символа)

#### Шаг 5: Деплой Workers

```bash
npm run deploy
```

#### Шаг 6: Деплой фронтенда

```bash
cd frontend
npm run build
npx wrangler pages deploy dist
```

## Создание первого администратора

После деплоя создайте администратора:

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

## Проверка работы

1. Откройте фронтенд
2. Перейдите на страницу "Контакты"
3. Заполните форму заявки
4. Войдите в личный кабинет
5. Проверьте заявку в разделе "Заявки"

## Полезные команды

```bash
# Локальная разработка Workers
npm run dev

# Логи Workers
npx wrangler tail

# Локальная база данных
npx wrangler d1 execute crm-db --local --command "SELECT * FROM users"

# Удалённая база данных
npx wrangler d1 execute crm-db --remote --command "SELECT * FROM users"
```

