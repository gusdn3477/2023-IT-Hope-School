from json_util.json_io import load_members, save_members
import json

def _validate_positive_int(val, name: str):
    try:
        iv = int(val)
    except Exception:
        return False, f"{name} 숫자를 입력하세요"
    if iv <= 0:
        return False, f"{name}는 1 이상이어야 합니다"
    return True, iv

def transfer(data: dict):
    """플레이어 간 송금: money 또는 fish.
    요청 형식:
    {
      "fromPlayerId": "A",
      "toPlayerId": "B",
      "type": "money" | "fish",
      "amount": 1000,           # money 전송 시 필수
      "fishId": 3,              # fish 전송 시 필수
      "quantity": 2             # fish 전송 시 필수
    }
    """
    members = load_members()
    from_pid = data.get("fromPlayerId") or data.get("from_player_id")
    to_pid = data.get("toPlayerId") or data.get("to_player_id")
    t_type = data.get("type")

    if not from_pid or not to_pid or from_pid == to_pid:
        return {"success": False, "message": "유효한 보내는/받는 플레이어 ID를 입력하세요"}
    if from_pid not in members or to_pid not in members:
        return {"success": False, "message": "플레이어를 찾을 수 없습니다"}
    if t_type not in ("money", "fish"):
        return {"success": False, "message": "type은 money 또는 fish 이어야 합니다"}

    sender = members[from_pid]
    receiver = members[to_pid]

    if t_type == "money":
        ok, amt = _validate_positive_int(data.get("amount"), "금액")
        if not ok:
            return {"success": False, "message": amt}
        if sender.get("money", 0) < amt:
            return {"success": False, "message": "보유 금액이 부족합니다"}
        sender["money"] -= amt
        receiver["money"] = receiver.get("money", 0) + amt
        save_members(members)
        return {"success": True, "message": f"{amt}원 송금 완료", "amount": amt}

    # fish transfer
    fish_id = data.get("fishId") or data.get("fish_id")
    quantity = data.get("quantity")
    ok_q, quantity_int = _validate_positive_int(quantity, "물고기 수량")
    if not ok_q:
        return {"success": False, "message": quantity_int}
    try:
        fish_idx = int(str(fish_id)) - 1
    except Exception:
        return {"success": False, "message": "fishId 오류"}
    try:
        fish_data = json.load(open("fish.json", "r", encoding="utf-8"))
        fish_entry = fish_data.get(str(fish_id))
        fish_name = fish_entry.get("name") if fish_entry else f"#{fish_id}"
    except Exception:
        fish_name = f"#{fish_id}"
    counts_sender = sender.get("fishCounts", [])
    counts_receiver = receiver.get("fishCounts", [])
    # 길이 보정
    max_len = max(len(counts_sender), len(counts_receiver))
    if len(counts_sender) < max_len:
        counts_sender += [0] * (max_len - len(counts_sender))
    if len(counts_receiver) < max_len:
        counts_receiver += [0] * (max_len - len(counts_receiver))
    if fish_idx < 0 or fish_idx >= len(counts_sender):
        return {"success": False, "message": "fishId 범위 오류"}
    if counts_sender[fish_idx] < quantity_int:
        return {"success": False, "message": "보내는 물고기 수량이 부족합니다"}
    counts_sender[fish_idx] -= quantity_int
    counts_receiver[fish_idx] += quantity_int
    sender["fishCounts"] = counts_sender
    receiver["fishCounts"] = counts_receiver

    # fishList(발견 여부) 동기화: 받는 사람도 발견 처리
    seen_sender = sender.get("fishList", [0] * len(counts_sender))
    seen_receiver = receiver.get("fishList", [0] * len(counts_receiver))
    if fish_idx < len(seen_receiver):
        seen_receiver[fish_idx] = 1
    sender["fishList"] = seen_sender
    receiver["fishList"] = seen_receiver

    save_members(members)
    return {
        "success": True,
        "message": f"물고기 {fish_name} {quantity_int}개 송금 완료",
        "fishId": fish_id,
        "fishName": fish_name,
        "quantity": quantity_int
    }
