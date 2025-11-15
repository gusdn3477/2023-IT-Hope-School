from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
from http.client import HTTPConnection, HTTPSConnection
from pathlib import Path
import os
import re


def run():
    dist_dir = Path(os.environ.get("FRONTEND_DIST", Path(__file__).resolve().parent / "dist")).resolve()
    if not dist_dir.exists():
        raise SystemExit(f"Frontend dist directory not found: {dist_dir}")

    port = int(os.environ.get("FRONTEND_PORT", "5173"))
    api_prefix = os.environ.get("FRONTEND_API_PREFIX", "/api")
    backend_url = os.environ.get("BACKEND_URL", "http://127.0.0.1:8080")
    backend = urlsplit(backend_url)
    backend_host = backend.hostname or "127.0.0.1"
    backend_port = backend.port or (443 if backend.scheme == "https" else 80)
    backend_path_prefix = (backend.path or "").rstrip("/")
    backend_conn_cls = HTTPSConnection if backend.scheme == "https" else HTTPConnection

    class SPARequestHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(dist_dir), **kwargs)

        def _should_proxy(self):
            return self.path.startswith(api_prefix)

        def _proxy_request(self):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else None

            upstream_path = re.sub(f"^{re.escape(api_prefix)}", "", self.path, count=1) or "/"
            target_path = f"{backend_path_prefix}{upstream_path}"

            try:
                conn = backend_conn_cls(backend_host, backend_port, timeout=10)
                headers = {k: v for k, v in self.headers.items() if k.lower() != "host"}
                conn.request(self.command, target_path, body=body, headers=headers)
                resp = conn.getresponse()

                self.send_response(resp.status, resp.reason)
                for key, value in resp.getheaders():
                    if key.lower() == "transfer-encoding" and value.lower() == "chunked":
                        continue
                    self.send_header(key, value)
                self.end_headers()

                data = resp.read()
                if data:
                    self.wfile.write(data)
            except OSError as exc:
                self.send_error(502, f"Backend connection failed: {exc}")

        def do_GET(self):
            if self._should_proxy():
                self._proxy_request()
            else:
                super().do_GET()

        def do_POST(self):
            if self._should_proxy():
                self._proxy_request()
            else:
                super().do_POST()

        def do_PUT(self):
            if self._should_proxy():
                self._proxy_request()
            else:
                super().do_PUT()

        def do_DELETE(self):
            if self._should_proxy():
                self._proxy_request()
            else:
                super().do_DELETE()

        def do_OPTIONS(self):
            if self._should_proxy():
                self._proxy_request()
            else:
                super().do_OPTIONS()

        def send_head(self):
            requested_path = Path(self.translate_path(self.path))
            if not requested_path.exists() or requested_path.is_dir():
                self.path = "index.html"
            return super().send_head()

    server = ThreadingHTTPServer(("", port), SPARequestHandler)
    print(f"프론트엔드 정적 파일 서버 시작! (포트: {port}, 경로: {dist_dir}, API 프록시: {backend_url})")
    server.serve_forever()


if __name__ == "__main__":
    run()
