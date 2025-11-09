import json
from json_util.json_io import load_members, save_members

def unlock(playerId):
    """낚싯대(rodLevel) 조건 기반 낚시터 해금.
    규칙:
      - fishing_sites.json 의 각 site 는 requiredRodLevel 필드 보유
      - 아직 unlockedSites 에 없고, 플레이어 rodLevel >= requiredRodLevel 인 가장 낮은 siteId 하나 해금
    """
    members = load_members()
    try:
        with open("fishing_sites.json", "r", encoding="utf-8") as f:
            fishing_sites = json.load(f)
    except Exception:
        return {"success": False, "message": "낚시터 데이터 오류"}

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어가 존재하지 않습니다."}

    rod_level = int(player.get("rodLevel", 1) or 1)
    unlocked = player.get("unlockedSites", []) or []

    # 후보 사이트 수집 (아직 미해금 & 조건 충족)
    candidates = []
    for site_id, site in fishing_sites.items():
        try:
            sid = int(site_id)
        except ValueError:
            continue
        req = site.get("requiredRodLevel") or site.get("required_level")  # backward compat
        if req is None:
            continue
        if sid in unlocked:
            continue
        try:
            req_val = int(req)
        except Exception:
            continue
        if rod_level >= req_val:
            candidates.append(sid)

    if not candidates:
        return {"success": False, "message": "해금 가능한 낚시터가 없습니다. (낚싯대 레벨 부족 또는 모두 해금)"}

    target_site_id = min(candidates)
    unlocked.append(target_site_id)
    player["unlockedSites"] = sorted(set(unlocked))
    members[playerId] = player
    save_members(members)
    site = fishing_sites.get(str(target_site_id), {})
    return {
        "success": True,
        "message": f"{site.get('name','새 낚시터')} 해금! (요구 낚싯대 ≥ {site.get('requiredRodLevel') or site.get('required_level')})",
        "unlockedSite": {
            "siteId": target_site_id,
            "name": site.get("name", "Unknown")
        },
        "unlockedSites": player["unlockedSites"],
        "rodLevel": rod_level
    }
