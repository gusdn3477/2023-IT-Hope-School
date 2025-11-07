import json
from json_util.json_io import load_members

def get_fish_info(playerId, fishId):
    """특정 물고기 정보 및 플레이어가 잡은 수량 반환 (키 camelCase)."""
    members = load_members()
    with open("fish.json", "r", encoding="utf-8") as f:
        fish_data = json.load(f)

    player = members.get(playerId)
    fish = fish_data.get(str(fishId))
    if not player or not fish:
        return {"success": False, "message": "플레이어나 물고기 정보가 없습니다."}

    try:
        index = int(fishId) - 1
        count_list = player.get("fishCounts", [])
        count = count_list[index] if 0 <= index < len(count_list) else 0
    except (ValueError, IndexError):
        return {"success": False, "message": "잘못된 물고기 ID"}

    return {"success": True, "fish": fish, "count": count}
