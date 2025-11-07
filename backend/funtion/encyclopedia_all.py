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
    for fish_id, fish_info in fish_list.items():
        caught = False
        idx = int(fish_id) - 1
        if 0 <= idx < len(counts) and counts[idx] > 0:
            caught = True
        fish_data.append({
            "id": fish_id,
            "name": fish_info["name"],
            "level": fish_info["level"],
            "price": fish_info["price"],
            "rate": fish_info["rate"],
            "caught": caught
        })

    return {"success": True, "fish_data": fish_data}
