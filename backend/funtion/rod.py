import random
from json_util.json_io import load_members, save_members

def upgrade_rod_level1to5(playerId):
    members = load_members()
    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어를 찾을 수 없습니다."}

    current_level = int(player.get("rodLevel", 1))
    if current_level >= 5:
        return {
            "success": False,
            "playerId": playerId,
            "previousRodLevel": current_level,
            "newRodLevel": current_level,
            "remainingMoney": player.get("money", 0),
            "message": "최대 강화 레벨입니다."
        }

    rod_level_data = {
        1: {"success_rate": 0.9, "cost_money": 10000},
        2: {"success_rate": 0.7, "cost_money": 20000},
        3: {"success_rate": 0.5, "cost_money": 30000},
        4: {"success_rate": 0.3, "cost_money": 40000},
        5: {"success_rate": 0.1, "cost_money": 50000}
    }

    data = rod_level_data[current_level]
    success_rate = data["success_rate"]
    cost_money = data["cost_money"]

    if player["money"] < cost_money:
        return {
            "success": False,
            "playerId": playerId,
            "previousRodLevel": current_level,
            "newRodLevel": current_level,
            "remainingMoney": player["money"],
            "message": "돈이 부족합니다."
        }

    player["money"] -= cost_money

    if random.random() < success_rate:
        player["rodLevel"] = current_level + 1
        message = f" 낚싯대 강화 성공! 현재 레벨: {player['rodLevel']}"
        success = True
    else:
        message = "강화 실패. 돈만 차감되었습니다."
        success = False

    members[playerId] = player
    save_members(members)

    return {
        "success": success,
        "playerId": playerId,
        "previousRodLevel": current_level,
        "newRodLevel": player["rodLevel"],
        "remainingMoney": player["money"],
        "message": message
    }
