#!/bin/bash

while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  echo "connect..."
  sleep 0.1
done

alembic upgrade head

echo "Starting uvicorn..."
exec uvicorn server:app --host 0.0.0.0 --port 8000