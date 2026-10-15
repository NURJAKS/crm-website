#!/bin/bash

echo "🚀 Деплой CRM системы в Cloudflare"
echo ""

# Проверка авторизации
if ! npx wrangler whoami &>/dev/null; then
    echo "❌ Не авторизован в Cloudflare"
    echo "Выполните: npx wrangler login"
    echo "Или установите CLOUDFLARE_API_TOKEN"
    exit 1
fi

echo "✅ Авторизация проверена"
echo ""

# Создание базы данных (если не существует)
echo "📦 Создание базы данных D1..."
DB_OUTPUT=$(npx wrangler d1 create crm-db 2>&1)
if echo "$DB_OUTPUT" | grep -q "database_id"; then
    DB_ID=$(echo "$DB_OUTPUT" | grep -oP 'database_id = "\K[^"]+')
    echo "✅ База данных создана: $DB_ID"
    echo "Обновите database_id в wrangler.toml"
    read -p "Нажмите Enter после обновления wrangler.toml..."
else
    echo "ℹ️  База данных уже существует или ошибка создания"
fi

# Применение миграций
echo ""
echo "📝 Применение миграций..."
npx wrangler d1 migrations apply crm-db --remote

# Деплой Workers
echo ""
echo "☁️  Деплой Workers..."
npx wrangler deploy

# Сборка фронтенда
echo ""
echo "🏗️  Сборка фронтенда..."
cd frontend
npm run build

# Деплой фронтенда
echo ""
echo "📄 Деплой фронтенда на Cloudflare Pages..."
npx wrangler pages deploy dist

echo ""
echo "✅ Деплой завершён!"
echo "Проверьте ваш Worker и Pages в Cloudflare Dashboard"

