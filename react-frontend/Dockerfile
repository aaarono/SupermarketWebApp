# Stage 1: Сборка React-приложения
FROM node:14 AS build

# Установите рабочую директорию
WORKDIR /app

# Копируйте только package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Установите зависимости
RUN npm install

# Копируйте остальные файлы проекта
COPY . .

# Соберите приложение
RUN npm run build

# Stage 2: Запуск с помощью Apache
FROM httpd:2.4

# Копируйте собранные файлы из предыдущего этапа
COPY --from=build /app/build/ /usr/local/apache2/htdocs/

# Откройте порт 80
EXPOSE 80

# Запустите Apache
CMD ["httpd-foreground"]
