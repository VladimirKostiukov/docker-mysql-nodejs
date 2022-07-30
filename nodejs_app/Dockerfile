# Базовый образ
FROM node:7

# Устанавливаем пакет для работы с MySQL
RUN npm install --save mysql2

# Копируем все файлы проекта в папку контейнера
COPY . /my_app

# Устанавливаем рабочий каталог
WORKDIR /my_app

# Подключаемся к порту 8080
EXPOSE 8080

# При старте контейнера выполнить скрипт main.js
ENTRYPOINT ["node", "main.js"]