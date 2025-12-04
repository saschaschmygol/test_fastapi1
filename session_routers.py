from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid


app = APIRouter(prefix="/session")

sessions = {} # sessions = {"6c99d6ab": {"client": <WebSocket>,"phone": <WebSocket>}}


@app.get("/create_session")
async def create_session():
    """
    Клиент №1 вызывает этот endpoint,
    сервер генерирует sessionId,
    клиент вставляет его в QR код.
    """
    session_id = str(uuid.uuid4())
    sessions[session_id] = {}
    return JSONResponse({"sessionId": session_id})


# ---------- WEBSOCKET ENDPOINT ----------

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Подключения для client и phone.
    URL формат:
      ws://localhost:8000/ws?session=<id>&type=client
      ws://localhost:8000/ws?session=<id>&type=phone
    """
    session_id = websocket.query_params.get("session")
    role = websocket.query_params.get("type")  # "client" или "phone"

    if not session_id or not role:
        await websocket.close(code=1008)
        return

    await websocket.accept() # регистрируем вебсокет (подтвердить WebSocket рукопожатие и активировать двунаправленный канал поверх TCP.)

    # регистрируем соединение в памяти
    if session_id not in sessions:
        sessions[session_id] = {}

    sessions[session_id][role] = websocket

    print(f"[{session_id}] {role} connected")

    # если оба подключены — уведомляем
    if "client" in sessions[session_id] and "phone" in sessions[session_id]:
        await safe_send(sessions[session_id]["client"], {"event": "paired"})
        await safe_send(sessions[session_id]["phone"], {"event": "paired"})
        print(f"[{session_id}] PAIRED")

    # начинаем relaying
    try:
        while True:
            data = await websocket.receive_text() # получение сообщения/данных

            # кому пересылаем
            if role == "client":
                target = sessions[session_id].get("phone") # получаем объект - сокет
            else:
                target = sessions[session_id].get("client")

            if target:
                await target.send_text(data) # перекидывание сообщения
    except WebSocketDisconnect:
        print(f"[{session_id}] {role} disconnected")

        # удаляем соединение
        if session_id in sessions:
            if role in sessions[session_id]:
                del sessions[session_id][role]

            # если оба вышли — удаляем сессию
            if not sessions[session_id]:
                del sessions[session_id]


# безопасная отправка JSON
async def safe_send(ws: WebSocket, obj):
    try:
        import json
        await ws.send_text(json.dumps(obj))
    except:
        pass