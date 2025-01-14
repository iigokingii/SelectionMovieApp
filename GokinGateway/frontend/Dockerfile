# Используем легковесный базовый образ nginx
FROM nginx:stable-alpine

# Указываем рабочую директорию в контейнере
WORKDIR /usr/share/nginx/html

# Удаляем стандартные файлы NGINX
RUN rm -rf ./*

# Копируем файлы из папки build в рабочую директорию
COPY build/ .

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Стартуем NGINX
CMD ["nginx", "-g", "daemon off;"]
