import json
from json_util.json_io import load_members, save_members

def sell_fish(playerId, fishId, quantity):
    members = load_members()
    fish_data = json.load(open("fish.json", "r", encoding="utf-8"))

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}

    fish = fish_data.get(str(fishId))
    if not fish:
        return {"success": False, "message": "잘못된 물고기 ID"}

    idx = int(fishId) - 1
    owned = player["fishCounts"][idx]

    if owned <= 0:
        return {"success": False, "message": "판매할 물고기가 없습니다."}
    if quantity > owned:
        return {"success": False, "message": f"보유 수량({owned}마리)보다 많이 팔 수 없습니다."}

    price = fish["price"]
    total = price * quantity
    player["fishCounts"][idx] -= quantity
    player["money"] += total

    members[playerId] = player
    save_members(members)

    return {
        "success": True,
        "message": f"{fish['name']} {quantity}마리 판매 완료! (+{total}원)",
        "earnedMoney": total,
        "remainingMoney": player["money"],
        "remainingFishCount": player["fishCounts"][idx]
    }
