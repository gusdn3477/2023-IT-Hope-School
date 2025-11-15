#!/usr/bin/env bash
set -euo pipefail

python backend/main.py &
BACK_PID=$!

nginx -g "daemon off;" &
NGINX_PID=$!

terminate() {
  kill -TERM "$BACK_PID" "$NGINX_PID" 2>/dev/null || true
}

trap terminate INT TERM

wait -n "$BACK_PID" "$NGINX_PID"
STATUS=$?
terminate
wait "$BACK_PID" "$NGINX_PID" 2>/dev/null || true
exit "$STATUS"
