import json
from json_util.json_io import load_members

def get_inventory(playerId):
    members = load_members()
    fish_data = json.load(open("fish.json", "r", encoding="utf-8"))

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}

    caught = []
    fish_counts = player.get("fishCounts", [])

    for idx, count in enumerate(fish_counts, start=1):
        if count > 0 and str(idx) in fish_data:
            fish_info = fish_data[str(idx)]
            caught.append({
                "fishId": idx,
                "name": fish_info["name"],
                "count": count,
                "price": fish_info["price"],
                "totalValue": fish_info["price"] * count
            })

    return {
        "success": True,
        "inventory": {
            "money": player["money"],
            "rodLevel": player["rodLevel"],
            "baitInventory": player.get("baitInventory", {}),
            "unlockedSites": player.get("unlockedSites", []),
            "caughtFish": caught
        }
    }
