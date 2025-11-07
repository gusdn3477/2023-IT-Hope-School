import json
from json_util.json_io import load_members, save_members

def buy_bait(playerId, baitId, quantity):
    """미끼 구매 처리 (유효성 검사 + 키 통일)"""
    if quantity <= 0:
        return {"success": False, "message": "구매 수량은 1 이상이어야 합니다."}

    members = load_members()
    with open("bait.json", "r", encoding="utf-8") as f:
        bait_data = json.load(f)

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}

    bait = bait_data.get(str(baitId))
    if not bait:
        return {"success": False, "message": "잘못된 미끼 ID"}

    cost = bait["price"] * quantity
    if player.get("money", 0) < cost:
        return {"success": False, "message": "돈이 부족합니다."}

    player["money"] -= cost
    inventory = player.setdefault("baitInventory", {})
    inventory[str(baitId)] = inventory.get(str(baitId), 0) + quantity
    members[playerId] = player
    save_members(members)

    return {"success": True, "message": f"{bait['name']} {quantity}개 구매 완료", "remainingMoney": player["money"], "baitInventory": inventory}
