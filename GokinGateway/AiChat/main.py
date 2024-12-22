from flask import Flask, jsonify, request
from flasgger import Swagger
import g4f
import asyncio
import threading
import atexit
from py_eureka_client.eureka_client import EurekaClient

Port = 8086
app = Flask(__name__)
swagger = Swagger(app)

# Настройки Swagger
app.config['SWAGGER'] = {
    'title': 'AI Chat Service',
    'uiversion': 3  # Указываем версию UI
}

# Создаем глобальную переменную для клиента Eureka
eureka_client = EurekaClient(
    eureka_server="http://localhost:8081/eureka/",
    app_name="AiService",
    instance_port=8086,
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
    """Проверка здоровья сервиса
    ---
    responses:
      200:
        description: Сервис работает
    """
    return "OK", 200

# Основной endpoint микросервиса
dialog_history = []

@app.route('/api/ai-chat', methods=['POST'])
def chat():
    """Обработка чата с AI
    ---
    parameters:
      - name: message
        in: body
        type: string
        required: true
        description: Сообщение пользователя
    responses:
      200:
        description: Ответ AI
        schema:
          type: object
          properties:
            response:
              type: string
    """
    data = request.get_json()
    user_message = data.get('message', 'Hello')

    dialog_history.append({"role": "user", "content": user_message})

    if len(dialog_history) == 1:
        dialog_history.insert(0, {"role": "system", "content": "Пожалуйста, отвечайте на русском языке."})

    response_content = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4,
        messages=dialog_history,
    )

    dialog_history.append({"role": "assistant", "content": response_content})

    return jsonify(response=response_content)

# Запуск клиента Eureka в отдельном потоке
def run_eureka():
    asyncio.run(start_eureka())

threading.Thread(target=run_eureka, daemon=True).start()

# Функция для удаления из Eureka при завершении приложения
def stop_eureka():
    asyncio.run(eureka_client.stop())

atexit.register(stop_eureka)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=Port)
