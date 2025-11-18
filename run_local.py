import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def spawn(name, args, env):
    print(f"[launcher] starting {name}: {' '.join(args)}")
    return subprocess.Popen(args, cwd=ROOT, env=env)


def main():
    default_backend_port = int(os.environ.get("RUN_LOCAL_BACKEND_PORT", "8080"))
    default_frontend_port = int(os.environ.get("RUN_LOCAL_FRONTEND_PORT", "80"))

    parser = argparse.ArgumentParser(description="Run backend + frontend static server without Docker")
    parser.add_argument("--backend-port", type=int, default=default_backend_port,
                        help=f"Port for backend/main.py (default: {default_backend_port})")
    parser.add_argument("--frontend-port", type=int, default=default_frontend_port,
                        help=f"Port for frontend static server (default: {default_frontend_port})")
    args = parser.parse_args()

    base_env = os.environ.copy()

    backend_env = base_env.copy()
    backend_env["PORT"] = str(args.backend_port)

    frontend_env = base_env.copy()
    frontend_env["FRONTEND_PORT"] = str(args.frontend_port)
    frontend_env["BACKEND_URL"] = f"http://127.0.0.1:{args.backend_port}"

    backend = spawn("backend", [sys.executable, "backend/main.py"], backend_env)
    frontend = spawn("frontend", [sys.executable, "frontend_server.py"], frontend_env)

    processes = [backend, frontend]

    try:
        while True:
            for proc in processes:
                ret = proc.poll()
                if ret is not None:
                    raise SystemExit(f"[launcher] process {' '.join(proc.args)} exited with code {ret}")
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\n[launcher] stopping...")
    finally:
        for proc in processes:
            if proc.poll() is None:
                proc.terminate()
        for proc in processes:
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()


if __name__ == "__main__":
    main()
