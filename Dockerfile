FROM node:18 AS frontend-builder

WORKDIR /frontend

COPY package.json yarn.lock ./

# Yarn 설치 (Node 18에는 corepack이 포함되어 있으므로 활성화해서 Yarn 1을 준비)
RUN corepack enable && corepack prepare yarn@1.22.21 --activate
RUN yarn install --frozen-lockfile

COPY tsconfig*.json vite.config.ts ./
COPY index.html ./index.html
COPY public ./public
COPY src ./src

RUN yarn build

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends bash nginx \
    && rm -rf /var/lib/apt/lists/*

COPY . .
COPY --from=frontend-builder /frontend/dist /app/dist
COPY nginx/app.conf /etc/nginx/conf.d/app.conf

RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf || true \
    && chmod +x /app/docker-entrypoint.sh

EXPOSE 8080 5173

CMD ["bash", "/app/docker-entrypoint.sh"]
