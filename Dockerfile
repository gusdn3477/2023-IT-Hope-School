FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*

COPY backend ./backend
COPY account.json bait.json fish.json fishing_sites.json market.json member.json ./
COPY nginx/app.conf /etc/nginx/conf.d/app.conf
COPY dist ./dist

RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf || true

EXPOSE 8080 80

CMD ["sh", "-c", "python backend/main.py & exec nginx -g 'daemon off;'"]
