import json
from json_util.json_io import load_members

def get_player_fish_data(playerId):
    members = load_members()
    fish_list = json.load(open("fish.json", "r", encoding="utf-8"))
    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}

    fish_data = []
    counts = player.get("fishCounts", [])
    seen_list = player.get("fishList", [])
    for fish_id, fish_info in fish_list.items():
        caught = False
        idx = int(fish_id) - 1
        # 우선순위: fishList의 1 여부로 판정 (도감 '발견' 기준), 없으면 fishCounts>0로 폴백
        if 0 <= idx < len(seen_list):
            caught = bool(seen_list[idx] == 1)
        elif 0 <= idx < len(counts):
            caught = bool(counts[idx] > 0)
        fish_data.append({
            "id": fish_id,
            "name": fish_info["name"],
            "level": fish_info["level"],
            "price": fish_info["price"],
            "rate": fish_info["rate"],
            "caught": caught
        })

    return {"success": True, "fish_data": fish_data}
