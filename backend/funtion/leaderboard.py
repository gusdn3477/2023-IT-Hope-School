from json_util.json_io import load_members


def _dex_count(fish_list: list[int] | None) -> int:
    if not isinstance(fish_list, list):
        return 0
    return sum(1 for v in fish_list if v)


def get_leaderboard(limit: int | None = 100, mode: str = "all"):
    members = load_members()
    entries = []
    mode = (mode or "all").lower()
    for pid, data in members.items():
        if not isinstance(data, dict):
            continue
        nickname = data.get("nickname") or pid
        rod_level = int(data.get("rodLevel", 1) or 1)
        dex = _dex_count(data.get("fishList"))
        money = int(data.get("money", 0) or 0)
        w = data.get("weekly")
        weekly = w if isinstance(w, dict) else {}
        weekly_fish = int((weekly.get("fishCaught") or 0))
        weekly_money = int((weekly.get("moneyEarned") or 0))

        entry = {
            "playerId": pid,
            "nickname": nickname,
            "rodLevel": rod_level,
            "dexCount": dex,
            "money": money,
            "weeklyFishCaught": weekly_fish,
            "weeklyMoneyEarned": weekly_money,
        }
        entries.append(entry)

    if mode == "weekly":
        # 주간 랭킹: 주간 어획 → 주간 수익 → rodLevel → dexCount
        entries.sort(key=lambda e: (e["weeklyFishCaught"], e["weeklyMoneyEarned"], e["rodLevel"], e["dexCount"]), reverse=True)
    else:
        # 전체 랭킹: rodLevel → dexCount → money
        entries.sort(key=lambda e: (e["rodLevel"], e["dexCount"], e["money"]), reverse=True)

    if isinstance(limit, int) and limit > 0:
        entries = entries[:limit]

    for idx, e in enumerate(entries, start=1):
        e["rank"] = idx

    return {"success": True, "entries": entries, "count": len(entries), "mode": mode}
