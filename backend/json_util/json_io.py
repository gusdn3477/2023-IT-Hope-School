import json
from pathlib import Path
from tempfile import NamedTemporaryFile
import os

MEMBER_FILE = "member.json"

# 구(旧) 키 -> 신(新) 키 매핑 (백엔드/프론트 통일용)
KEY_MAP = {
    "rod_level": "rodLevel",
    "bait_inventory": "baitInventory",
    "unlocked_sites": "unlockedSites",
    "Fish_cnt": "fishCounts",
    "Fish_list": "fishList",
}

def _camel_case_key(k: str) -> str:
    if k in KEY_MAP:
        return KEY_MAP[k]
    # snake_case 일반 변환 (player_id -> playerId)
    if "_" in k:
        parts = k.split("_")
        return parts[0] + "".join(p.capitalize() for p in parts[1:])
    return k

def _normalize_player(player: dict) -> dict:
    normalized = {}
    for k, v in player.items():
        new_k = _camel_case_key(k)
        normalized[new_k] = v
    # 기본 필드 보강
    normalized.setdefault("baitInventory", {})
    normalized.setdefault("unlockedSites", [1])
    normalized.setdefault("fishCounts", [0] * 25)
    normalized.setdefault("fishList", [0] * 25)
    return normalized

def load_members(filename: str = MEMBER_FILE) -> dict:
    path = Path(filename)
    if not path.exists():
        return {}
    try:
        with open(filename, "r", encoding="utf-8") as f:
            raw = json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}
    # 플레이어별 키 정규화
    return {pid: _normalize_player(data) for pid, data in raw.items()}

def save_members(data: dict, filename: str = MEMBER_FILE):
    """멤버 데이터를 원자적(atomic) 저장. 이미 camelCase 로 된 키를 그대로 저장."""
    # 역매핑 (저장 시에도 camelCase 유지하기 때문에 단순 pass)
    tmp_dir = Path(filename).parent
    tmp_dir.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile("w", delete=False, dir=str(tmp_dir), encoding="utf-8") as tmp:
        json.dump(data, tmp, ensure_ascii=False, indent=4)
        tmp_path = tmp.name
    os.replace(tmp_path, filename)

def migrate_member_file(filename: str = MEMBER_FILE):
    """member.json 을 camelCase 스키마로 일괄 변환 (1회성)."""
    members = load_members(filename)
    save_members(members, filename)
    return True

