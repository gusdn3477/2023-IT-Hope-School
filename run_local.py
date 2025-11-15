import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def spawn(name, args):
    print(f"[launcher] starting {name}: {' '.join(args)}")
    return subprocess.Popen(args, cwd=ROOT)


def main():
    backend = spawn("backend", [sys.executable, "backend/main.py"])
    frontend = spawn("frontend", [sys.executable, "frontend_server.py"])

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
