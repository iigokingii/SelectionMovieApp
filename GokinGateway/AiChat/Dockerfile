# Используем базовый образ Python
FROM python:3.9-slim

# Устанавливаем переменную рабочей директории
WORKDIR /app

# Копируем файлы проекта
COPY . .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Открываем порт Flask
EXPOSE 8086

# Команда запуска Flask-приложения
CMD ["python", "app.py"]
