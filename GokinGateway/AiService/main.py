from flask import Flask, jsonify, request
import g4f
import asyncio
import threading
import atexit
from py_eureka_client.eureka_client import EurekaClient

Port = 8086
app = Flask(__name__)

# Создаем глобальную переменную для клиента Eureka
eureka_client = EurekaClient(
    eureka_server="http://localhost:8081/eureka/",
    app_name="AiService",
    instance_port=8086,  # Установили порт на 8087
    instance_ip="localhost",
    health_check_url="http://localhost:8086/health",
    instance_id="localhost:AiService:8086"
)

# Асинхронная функция для запуска регистрации в Eureka
async def start_eureka():
    await eureka_client.start()

# Проверка здоровья сервиса
@app.route('/health', methods=['GET'])
def health():
    return "OK", 200

# Основной endpoint микросервиса
dialog_history = []

@app.route('/api/ai-chat', methods=['POST'])
def chat():
    # Получаем данные из тела запроса
    data = request.get_json()
    user_message = data.get('message', 'Hello')

    # Добавляем сообщение пользователя в историю диалога
    dialog_history.append({"role": "user", "content": user_message})

    # Добавляем системное сообщение, если это первый запрос
    if len(dialog_history) == 1:
        dialog_history.insert(0, {"role": "system", "content": "Пожалуйста, отвечайте на русском языке."})

    # Получаем ответ от AI
    response_content = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4,
        messages=dialog_history,
    )

    # Добавляем ответ AI в историю диалога
    dialog_history.append({"role": "assistant", "content": response_content})

    # Возвращаем ответ в формате JSON
    return jsonify(response=response_content)


# Запуск клиента Eureka в отдельном потоке
def run_eureka():
    asyncio.run(start_eureka())

threading.Thread(target=run_eureka, daemon=True).start()

# Функция для удаления из Eureka при завершении приложения
def stop_eureka():
    asyncio.run(eureka_client.stop())  # Завершаем регистрацию корректно

# Регистрируем `stop_eureka` для вызова при завершении приложения
atexit.register(stop_eureka)

app.run(host='0.0.0.0', port=Port)  # Запускаем Flask на порту 8087
