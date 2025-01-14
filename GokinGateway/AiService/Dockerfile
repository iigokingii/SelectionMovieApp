# Используем легкий образ Python
FROM python:3.9-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы приложения
COPY . .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Открываем порт для Flask
EXPOSE 8086

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Команда запуска Flask-приложения
CMD ["python", "main.py"]
