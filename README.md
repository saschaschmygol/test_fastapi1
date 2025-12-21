# Серверная часть для мобильного приложения **Healify**

## 🧱 Стек технологий

### Backend
- **FastAPI**
- **SQLAlchemy (ORM)**
- **PostgreSQL**

### Frontend
- **React**
- **JavaScript / TypeScript**

### Infrastructure
- **Docker**
- **Docker Compose**
- **Nginx**

---

## ⚙️ Переменные окружения

Для запуска проекта необходимо создать файл `.env` в корне проекта  
(можно скопировать из `.env.example`).

### Пример `.env`

```env
# ======================
# PostgreSQL
# ======================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

# ======================
# Backend
# ======================
BACKEND_HOST=backend
BACKEND_PORT=8000

# ======================
# Nginx
# ======================
NGINX_HTTP_PORT=80
NGINX_SERVER_NAME=localhost

Все сервисы запускаются одной командой:
docker-compose up --build

Запускаемые сервисы:
- db — PostgreSQL
- backend — FastAPI приложение
- frontend — Vite frontend
- nginx — reverse proxy

