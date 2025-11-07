from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import json
from json_util.json_io import migrate_member_file

# 기능 모듈들 (폴더명이 "funtion" 으로 되어 있어 오타이지만 그대로 사용)
import funtion.account as account
import funtion.unlock as unlock
import funtion.rod as rod
import funtion.fishing as fishing
import funtion.bait as bait
import funtion.fishSell as fishSell
import funtion.inventory as inventory
import funtion.encyclopedia_all as encyclopedia_all
import funtion.encyclopedia_single as encyclopedia_single


class FishingHandler(BaseHTTPRequestHandler):

    def _send_json(self, data, status=200):
        """JSON 응답 헬퍼 (CORS 포함)"""
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        # 기본 CORS 허용 (필요 시 도메인 제한 가능)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        """Preflight 요청(CORS) 처리"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _get_body(self):
        """요청 body 파싱"""
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        return json.loads(self.rfile.read(content_length).decode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._get_body()

        # 회원가입
        if path == "/signup":
            result = account.signup(body)
            self._send_json(result)

        # 로그인
        elif path == "/login":
            result = account.login(body)
            self._send_json(result)

        # 낚싯대 강화
        elif path == "/rod/upgrade":
            playerId = body.get("playerId") or body.get("player_id")
            result = rod.upgrade_rod_level1to5(playerId)
            self._send_json(result)

        # 낚시 시도
        elif path == "/fishing":
            playerId = body.get("playerId") or body.get("player_id")
            baitId = body.get("baitId") or body.get("bait_id")
            result = fishing.attempt_fishing(playerId, baitId)
            self._send_json(result)

        # 미끼 구매
        elif path == "/bait/buy":
            playerId = body.get("playerId") or body.get("player_id")
            baitId = body.get("baitId") or body.get("bait_id")
            quantity = body.get("quantity", 1)
            result = bait.buy_bait(playerId, baitId, quantity)
            self._send_json(result)

        # 물고기 판매
        elif path == "/fish/sell":
            playerId = body.get("playerId") or body.get("player_id")
            fishId = body.get("fishId") or body.get("fish_id")
            quantity = body.get("quantity", 1)
            result = fishSell.sell_fish(playerId, fishId, quantity)
            self._send_json(result)

        # 인벤토리 조회
        elif path == "/inventory":
            playerId = body.get("playerId") or body.get("player_id")
            result = inventory.get_inventory(playerId)
            self._send_json(result)

        # 낚시터 해금
        elif path == "/unlock":
            playerId = body.get("playerId") or body.get("player_id")
            result = unlock.unlock(playerId)
            self._send_json(result)

        # 도감 전체 조회
        elif path == "/encyclopedia":
            playerId = body.get("playerId") or body.get("player_id")
            result = encyclopedia_all.get_player_fish_data(playerId)
            self._send_json(result)

        # 도감 개별 조회
        elif path == "/encyclopedia/fish":
            playerId = body.get("playerId") or body.get("player_id")
            fishId = body.get("fishId") or body.get("fish_id")
            result = encyclopedia_single.get_fish_info(playerId, fishId)
            self._send_json(result)

        # 유저 정보 단일 조회
        elif path == "/user":
            playerId = body.get("playerId") or body.get("player_id")
            if not playerId:
                self._send_json({"success": False, "message": "playerId is required"}, status=400)
            else:
                result = account.get_user(playerId)
                self._send_json(result)

        # 헬스 체크
        elif path == "/health":
            self._send_json({"success": True, "status": "ok"})

        else:
            self._send_json({"success": False, "error": "Invalid API endpoint", "path": path}, status=404)


def run():
    # 기존 member.json 키를 camelCase 로 마이그레이션 (무해, 1회성)
    try:
        migrate_member_file()
    except Exception as e:
        print("member.json migrate skipped:", e)
    server = HTTPServer(("", 8000), FishingHandler)
    print("서버 시작!")
    server.serve_forever()


if __name__ == "__main__":
    run()
