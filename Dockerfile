FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends bash nginx \
    && rm -rf /var/lib/apt/lists/*

COPY . .
COPY nginx/app.conf /etc/nginx/conf.d/app.conf

RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf || true \
    && chmod +x /app/docker-entrypoint.sh

EXPOSE 8080 5173

CMD ["bash", "/app/docker-entrypoint.sh"]
