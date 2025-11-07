import json
import random
import uuid
import time
from json_util.json_io import load_members, save_members

# 간단한 인메모리 조우 세션 저장 (서버 재시작 시 사라짐)
ENCOUNTERS: dict[str, dict] = {}
ENCOUNTER_TTL = 60  # seconds

def _cleanup_encounters():
    now = time.time()
    expired = [k for k, v in ENCOUNTERS.items() if now - v.get("ts", 0) > ENCOUNTER_TTL]
    for k in expired:
        ENCOUNTERS.pop(k, None)

def _choose_level_weights(rodLevel: int, bait_bonus: float, score: float) -> int:
    # 기본 가중치 (낮을수록 흔함)
    base_weights = {1: 60.0, 2: 25.0, 3: 10.0, 4: 4.0, 5: 1.0}
    for lvl in range(1, 6):
        if lvl <= rodLevel:
            base_weights[lvl] *= 1.0 + (rodLevel - lvl + 1) * 0.05
    high_levels = [min(5, rodLevel), min(5, rodLevel + 1)]
    for lvl in set(high_levels):
        base_weights[lvl] *= (1.0 + bait_bonus)
    s = max(0.0, min(1.0, score))
    for lvl in [3, 4, 5]:
        base_weights[lvl] *= (1.0 + s * (0.8 if lvl >= 4 else 0.5))
    levels = list(base_weights.keys())
    weights = [max(w, 0.0) for w in base_weights.values()]
    total_w = sum(weights)
    if total_w <= 0:
        levels = [1, 2, 3, 4, 5]
        weights = [60, 25, 10, 4, 1]
    return random.choices(levels, weights=weights, k=1)[0]

def start_encounter(playerId: str, baitId: str | None):
    members = load_members()
    fish_data = json.load(open("fish.json", "r", encoding="utf-8"))
    bait_data = json.load(open("bait.json", "r", encoding="utf-8"))
    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}
    rodLevel = player.get("rodLevel", 1)
    baitInventory = player.get("baitInventory", {})

    bait_bonus = 0.0
    bait_name = "미끼 없음"
    if baitId:
        bait = bait_data.get(str(baitId))
        if not bait:
            return {"success": False, "message": "잘못된 미끼입니다."}
        if baitInventory.get(str(baitId), 0) <= 0:
            return {"success": False, "message": f"{bait['name']}이(가) 없습니다."}
        # encounter 시점에 미끼 1개 소모
        baitInventory[str(baitId)] -= 1
        player["baitInventory"] = baitInventory
        bait_bonus = bait["catch_rate_bonus"]
        bait_name = bait["name"]

    # 점수 없이(0) 기본 가중으로 레벨 결정 후 동일 레벨에서 랜덤 픽
    lvl = _choose_level_weights(rodLevel, bait_bonus, 0.0)
    fishes_at_level = [fid for fid, f in fish_data.items() if f["level"] == lvl]
    caught_id = random.choice(fishes_at_level)
    caught_fish = fish_data[caught_id]

    # 세션 기록
    token = uuid.uuid4().hex
    ENCOUNTERS[token] = {"playerId": playerId, "fishId": caught_id, "ts": time.time()}
    _cleanup_encounters()

    members[playerId] = player
    save_members(members)
    return {"success": True, "encounterId": token, "fish": caught_fish, "bait": bait_name}

def resolve_encounter(playerId: str, encounterId: str | None, score: float | None):
    members = load_members()
    fish_data = json.load(open("fish.json", "r", encoding="utf-8"))
    if not encounterId:
        return {"success": False, "message": "encounterId 필요"}
    enc = ENCOUNTERS.get(encounterId)
    if not enc or enc.get("playerId") != playerId:
        return {"success": False, "message": "만료되었거나 잘못된 조우입니다."}
    # 현재 구현: 조우된 물고기를 그대로 잡는다 (score는 보상/희귀도에 더 반영 가능)
    # 향후: score에 따라 상향 등급 교체 로직 추가 가능
    fish_id = enc.get("fishId")
    fish = fish_data.get(fish_id)
    if not fish:
        ENCOUNTERS.pop(encounterId, None)
        return {"success": False, "message": "조우 데이터 오류"}

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}

    if fish_id is None:
        return {"success": False, "message": "물고기 ID 누락"}
    try:
        fish_index = int(str(fish_id)) - 1
    except Exception:
        return {"success": False, "message": "물고기 ID 오류"}
    counts = player.get("fishCounts", [0] * len(fish_data))
    seen = player.get("fishList", [0] * len(fish_data))
    counts[fish_index] += 1
    seen[fish_index] = 1
    player["fishCounts"] = counts
    player["fishList"] = seen

    members[playerId] = player
    save_members(members)
    ENCOUNTERS.pop(encounterId, None)
    return {"success": True, "message": f"{fish['name']}을(를) 잡았습니다!", "fish": fish, "fishCounts": counts, "fishList": seen}

def attempt_fishing(playerId, baitId=None, score: float | None = None):
    members = load_members()
    fish_data = json.load(open("fish.json", "r", encoding="utf-8"))
    bait_data = json.load(open("bait.json", "r", encoding="utf-8"))

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어 없음"}

    rodLevel = player.get("rodLevel", 1)
    baitInventory = player.get("baitInventory", {})

    bait = None
    bait_bonus = 0.0
    bait_name = "미끼 없음"

    if baitId:  # baitId가 전달된 경우만 처리
        bait = bait_data.get(str(baitId))
        if not bait:
            return {"success": False, "message": "잘못된 미끼입니다."}

        if baitInventory.get(str(baitId), 0) <= 0:
            return {"success": False, "message": f"{bait['name']}이(가) 없습니다."}

        # 미끼 차감
        baitInventory[str(baitId)] -= 1
        player["baitInventory"] = baitInventory
        bait_bonus = bait["catch_rate_bonus"]
        bait_name = bait["name"]

    # 미니게임 점수(0~1)에 따라 상위 레벨 확률 가중치 적용, 실패는 제거하고 항상 한 마리 획득
    # 기본 가중치 (낮을수록 흔함)
    base_weights = {1: 60.0, 2: 25.0, 3: 10.0, 4: 4.0, 5: 1.0}
    # 낚싯대 보너스: rodLevel 이하 레벨에 가중치 약간 상승
    for lvl in range(1, 6):
        if lvl <= rodLevel:
            base_weights[lvl] *= 1.0 + (rodLevel - lvl + 1) * 0.05
        else:
            # 막 레벨은 기본 유지
            base_weights[lvl] *= 1.0
    # 미끼 보너스: catch_rate_bonus(0~?)를 상위 레벨(rodLevel 및 rodLevel+1)에 분배
    # bait_bonus는 확률(0~?)이므로 0~0.3 정도로 가정하고 가중치에 곱셈계수로 반영
    high_levels = [min(5, rodLevel), min(5, rodLevel + 1)]
    for lvl in set(high_levels):
        base_weights[lvl] *= (1.0 + bait_bonus)
    # 스코어 보너스 (0~1): 상위 레벨 3,4,5에 추가 가중
    s = max(0.0, min(1.0, score if isinstance(score, (int, float)) else 0.0))
    for lvl in [3, 4, 5]:
        base_weights[lvl] *= (1.0 + s * (0.8 if lvl >= 4 else 0.5))
    # 정규화 후 선택
    levels = list(base_weights.keys())
    weights = [max(w, 0.0) for w in base_weights.values()]
    total_w = sum(weights)
    if total_w <= 0:
        # 폴백
        levels = [1, 2, 3, 4, 5]
        weights = [60, 25, 10, 4, 1]
        total_w = sum(weights)
    probs = [w / total_w for w in weights]
    caught_level = random.choices(levels, weights=probs, k=1)[0]

    fishes_at_level = [fid for fid, f in fish_data.items() if f["level"] == caught_level]
    caught_id = random.choice(fishes_at_level)
    caught_fish = fish_data[caught_id]

    fish_index = int(caught_id) - 1
    fish_counts = player.get("fishCounts", [0] * len(fish_data))
    fish_list = player.get("fishList", [0] * len(fish_data))

    fish_counts[fish_index] += 1
    fish_list[fish_index] = 1

    player["fishCounts"] = fish_counts
    player["fishList"] = fish_list

    members[playerId] = player
    save_members(members)

    return {
        "success": True,
        "message": f"{caught_fish['name']}을(를) 잡았습니다! (레벨 {caught_level}, 미끼: {bait_name})",
        "fish": caught_fish,
        "remainingBait": player["baitInventory"],
        "fishCounts": player["fishCounts"],
        "fishList": player["fishList"]
    }
