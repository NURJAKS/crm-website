#!/bin/bash
echo "🚀 Запуск локального окружения"
echo ""
echo "Workers будет на http://localhost:8787"
echo "Frontend будет на http://localhost:5173"
echo ""
echo "Нажмите Ctrl+C для остановки"
echo ""

# Запуск Workers в фоне
npm run dev &
WORKER_PID=$!

# Ждём немного
sleep 3

# Запуск фронтенда
cd frontend
npm run dev &
FRONTEND_PID=$!

# Ожидание
wait $WORKER_PID $FRONTEND_PID
