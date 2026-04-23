#!/bin/bash

# 1. Запуск Google Chrome на Android через ADB
echo "🚀 Запуск Google Chrome..."
adb shell am start -n com.android.chrome/com.google.android.apps.chrome.Main

echo "✅ Chrome запущен."
echo "🛑 Чтобы остановить скрипт, нажмите CTRL+C"

# 2. Цикл, удерживающий скрипт активным
# Используем бесконечный цикл с ожиданием
trap "echo -e '\n👋 Завершение работы...'; exit" SIGINT

while true; do
    sleep 1
done
