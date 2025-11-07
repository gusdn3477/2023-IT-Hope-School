from json_util.json_io import load_members, save_members

def signup(data):
    player_id = data.get("playerId") or data.get("player_id")
    password = data.get("password")
    if not player_id or not password:
        return {"success": False, "message": "ID와 비밀번호를 입력하세요."}

    members = load_members()
    if player_id in members:
        return {"success": False, "message": "이미 존재하는 사용자입니다."}

    members[player_id] = {
        "password": password,
        "nickname": data.get("nickname", "New Player"),
        "email": data.get("email", ""),
        "money": 5000,
        "level": 1,
        "rodLevel": 1,
        "baitInventory": {"1": 5},
        "unlockedSites": [1],
        "fishCounts": [0] * 25,
        "fishList": [0] * 25
    }
    save_members(members)
    return {"success": True, "playerId": player_id, "message": "회원가입 성공"}

def login(data):
    player_id = data.get("playerId") or data.get("player_id")
    password = data.get("password")
    members = load_members()

    player = members.get(player_id)
    if not player or player.get("password") != password:
        return {"success": False, "message": "로그인 실패"}

    return {"success": True, "playerId": player_id, "data": player}

def get_user(player_id: str):
    """단일 유저 정보 조회 (비밀번호 제외)"""
    members = load_members()
    player = members.get(player_id)
    if not player:
        return {"success": False, "message": "사용자를 찾을 수 없습니다."}
    safe_player = {k: v for k, v in player.items() if k != "password"}
    return {"success": True, "playerId": player_id, "data": safe_player}
