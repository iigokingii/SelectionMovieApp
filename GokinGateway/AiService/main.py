from flask import Flask, jsonify, request
from flasgger import Swagger
import g4f
import asyncio
import threading
import atexit
from py_eureka_client.eureka_client import EurekaClient

# Параметры приложения
Port = 8086
app = Flask(__name__)

# Конфигурация Swagger
app.config['SWAGGER'] = {
    'title': 'AI Chat Service',
    'uiversion': 3
}
swagger = Swagger(app)

# Создаем глобальную переменную для клиента Eureka
# eureka_client = EurekaClient(
#     eureka_server="http://localhost:8081/eureka/",
#     app_name="AiService",
#     instance_port=8086,
#     instance_ip="localhost",
#     health_check_url="http://localhost:8086/health",
#     instance_id="localhost:AiService:8086"
# )
eureka_client = EurekaClient(
    eureka_server="http://eurekaservice:8081/eureka/",
    app_name="AiService",
    instance_port=8086,
    instance_ip="aiservice",
    health_check_url="http://aiservice:8086/health",
    instance_id="aiservice:AiService:8086"
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

@app.route('/api/ai-chat/new-dialog', methods=['POST'])
def newDialog():
    dialog_history.clear()
    return jsonify(response='Открыт новый диалог')

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

# Новый эндпоинт для получения спецификации OpenAPI
@app.route('/v3/api-docs', methods=['GET'])
def api_docs():
    spec = {
        "openapi": "3.0.1",
        "info": {
            "title": "AI Chat Service",
            "description": "API для чата с искусственным интеллектом",
            "version": "0.0.1"
        },
        "servers": [
            {
                "url": "http://127.0.0.1:8086",
                "description": "Сервер AI Chat Service"
            }
        ],
        "tags": [
            {
                "name": "Чат с AI",
                "description": "Контроллер, отвечающий за обработку сообщений с AI"
            }
        ],
        "paths": {
            "/api/ai-chat": {
                "post": {
                    "tags": ["Чат с AI"],
                    "summary": "Обработка чата с AI",
                    "description": "Получение ответа от AI на сообщение пользователя.",
                    "operationId": "chatWithAI",
                    "requestBody": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "description": "Сообщение пользователя"
                                        }
                                    },
                                    "required": ["message"]
                                }
                            }
                        },
                        "required": "true"
                    },
                    "responses": {
                        "200": {
                            "description": "Ответ AI",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "response": {
                                                "type": "string",
                                                "description": "Ответ от искусственного интеллекта"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/health": {
                "get": {
                    "tags": ["Чат с AI"],
                    "summary": "Проверка здоровья сервиса",
                    "description": "Проверяет, работает ли сервис.",
                    "operationId": "checkHealth",
                    "responses": {
                        "200": {
                            "description": "Сервис работает"
                        }
                    }
                }
            },
            "/v3/api-docs": {
                "get": {
                    "tags": ["Чат с AI"],
                    "summary": "Возвращает спецификацию OpenAPI",
                    "description": "Получение спецификации API в формате OpenAPI.",
                    "operationId": "getApiDocs",
                    "responses": {
                        "200": {
                            "description": "OpenAPI спецификация",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "components": {}
    }
    return jsonify(spec)


# Запуск клиента Eureka в отдельном потоке
def run_eureka():
    asyncio.run(start_eureka())

threading.Thread(target=run_eureka, daemon=True).start()

# Функция для удаления из Eureka при завершении приложения
def stop_eureka():
    asyncio.run(eureka_client.stop())  # Завершаем регистрацию корректно

# Регистрируем `stop_eureka` для вызова при завершении приложения
atexit.register(stop_eureka)

# Запускаем приложение
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Port)  # Запускаем Flask на порту 8086
