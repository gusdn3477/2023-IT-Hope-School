import json
from json_util.json_io import load_members, save_members

def unlock(playerId):
    members = load_members()
    with open("fishing_sites.json", "r", encoding="utf-8") as f:
        fishing_sites = json.load(f)

    player = members.get(playerId)
    if not player:
        return {"success": False, "message": "플레이어가 존재하지 않습니다."}

    level = player.get("level", 0)
    unlocked = player.get("unlockedSites", [])

    target_site_id = None
    for site_id, site in fishing_sites.items():
        if level == site.get("required_level"):
            target_site_id = int(site_id)
            break

    if target_site_id is None:
        return {"success": False, "message": "레벨에 맞는 낚시터가 없습니다."}

    if target_site_id not in unlocked:
        unlocked.append(target_site_id)
        player["unlockedSites"] = unlocked
        members[playerId] = player
        save_members(members)
        site = fishing_sites[str(target_site_id)]
        return {
            "success": True,
            "message": f"{site['name']}가 해금되었습니다!",
            "playerMoney": player.get("money", 0),
            "unlockedSite": {
                "siteId": target_site_id,
                "name": site["name"]
            }
        }
    else:
        return {"success": False, "message": "아직 해금할 수 없습니다."}
