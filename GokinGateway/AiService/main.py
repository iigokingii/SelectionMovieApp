from flask import Flask, jsonify, request, Response
from flasgger import Swagger
import g4f
import asyncio
import threading
import atexit
from py_eureka_client.eureka_client import EurekaClient
import json

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
eureka_client = EurekaClient(
    eureka_server="http://localhost:8081/eureka/",
    app_name="AiService",
    instance_port=8086,
    instance_ip="localhost",
    health_check_url="http://localhost:8086/health",
    instance_id="localhost:AiService:8086"
)
# eureka_client = EurekaClient(
#     eureka_server="http://eurekaservice:8081/eureka/",
#     app_name="AiService",
#     instance_port=8086,
#     instance_ip="aiservice",
#     health_check_url="http://aiservice:8086/health",
#     instance_id="aiservice:AiService:8086"
# )


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

@app.route('/api/suggest-movies', methods=['POST'])
def suggest_movies():
    data = request.get_json()
    dialog_history_suggestions = []

    prompt = ("Какие фильмы посоветуешь на основе следующих ответов (только названия):\n")

    for item in data:
        question = item.get('question', '')
        selected_answers = item.get('selectedAnswers', '')
        prompt += f"\nВопрос: {question}\nОтвет: {selected_answers}"

    prompt += ("\nПожалуйста, предложи 20 фильмов в порядке наибольшего соответствия. "
               "Для каждого фильма укажи следующую информацию:\n"
               "Название RU (Название EN, год выхода). Рейтинг: KP: [рейтинг], IMDB: [рейтинг]. Жанры: [жанры] Описание: [такое описание сюжета, которое должно заинтересовать пользователя, должно быть развёрнутым]. "
               "Без специальных символов в виде звёзд, и с нумерацией только рядом с названием, фильмы между собой разделяются симвовлом '\n'.")

    dialog_history_suggestions.append({"role": "system", "content": prompt})

    response_content = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4,
        messages=dialog_history_suggestions,
    )
    dialog_history_suggestions.clear()
    response_data = {
        "response": "На основе ваших ответов, вот 20 фильмов, которые могут вам подойти в порядке наибольшего соответствия:",
        "movies": response_content
    }
    return Response(
        response=json.dumps(response_data, ensure_ascii=False),
        content_type='application/json; charset=utf-8'
    )


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
