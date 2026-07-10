"""Fetch high-resolution Facebook photos into staging folder."""
import hashlib
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "facebook-candidates"
OUT.mkdir(parents=True, exist_ok=True)

PHOTO_PAGES = [
    "https://www.facebook.com/photo/?fbid=1343710034496712&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1343675447833504&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1340254101508972&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1327032336164482&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1320874390113610&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1315591597308556&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1312889660912083&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1307590268108689&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=1305286245005758&set=pb.100065731842098.-2207520000",
    "https://www.facebook.com/photo/?fbid=409306641270394&set=a.409306631270395",
]


def is_valid_image(data: bytes) -> bool:
    if data[:3] == b"\xff\xd8\xff":
        return True
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return True
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return True
    return False


def ext_for(data: bytes) -> str:
    if data[:3] == b"\xff\xd8\xff":
        return "jpg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    return "webp"


def file_hash_bytes(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


def file_hash_path(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def load_existing_hashes() -> dict[str, str]:
    existing: dict[str, str] = {}
    for p in ROOT.rglob("*"):
        if p.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        if "facebook-candidates" in str(p):
            continue
        try:
            existing[file_hash_path(p)] = str(p.relative_to(ROOT))
        except OSError:
            pass
    return existing


def score_url(url: str) -> int:
    score = 0
    if "scontent" in url:
        score += 10
    for token in ("2048", "1920", "1500", "1280", "1080", "960"):
        if token in url:
            score += int(token)
    if "stp=" in url:
        score += 50
    return score


def main() -> None:
    existing_hashes = load_existing_hashes()
    best_by_hash: dict[str, tuple[bytes, str, int]] = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1400, "height": 1000},
            ignore_https_errors=True,
        )
        page = context.new_page()

        def handle_response(resp) -> None:
            url = resp.url
            if "scontent" not in url or "emoji" in url:
                return
            ctype = resp.headers.get("content-type", "")
            if "image" not in ctype:
                return
            try:
                data = resp.body()
            except Exception:
                return
            if not is_valid_image(data) or len(data) < 40000:
                return
            h = file_hash_bytes(data)
            score = score_url(url) + len(data) // 1000
            prev = best_by_hash.get(h)
            if not prev or score > prev[2]:
                best_by_hash[h] = (data, url, score)

        page.on("response", handle_response)

        for target in PHOTO_PAGES + ["https://www.facebook.com/heronsinternational/photos"]:
            try:
                page.goto(target, wait_until="domcontentloaded", timeout=90000)
                page.wait_for_timeout(5000)
                dom_urls = page.eval_on_selector_all(
                    "img",
                    "els => els.map(e => e.currentSrc || e.src).filter(u => u && u.includes('scontent'))",
                )
                for url in dom_urls:
                    if score_url(url) < 100:
                        continue
                    try:
                        resp = context.request.get(url, timeout=30000)
                        if resp.ok:
                            data = resp.body()
                            if is_valid_image(data) and len(data) >= 40000:
                                h = file_hash_bytes(data)
                                score = score_url(url) + len(data) // 1000
                                prev = best_by_hash.get(h)
                                if not prev or score > prev[2]:
                                    best_by_hash[h] = (data, url, score)
                    except Exception:
                        pass
            except Exception as exc:
                print(f"WARN: {target} -> {exc}")

        browser.close()

    # Remove invalid files from earlier attempts
    for old in OUT.glob("fb-candidate-*"):
        data = old.read_bytes()
        if not is_valid_image(data):
            old.unlink()

    results = []
    for idx, (data, url, _) in enumerate(best_by_hash.values(), start=1):
        ext = ext_for(data)
        h = file_hash_bytes(data)
        dup = existing_hashes.get(h)
        name = f"fb-candidate-{idx:02d}.{ext}"
        (OUT / name).write_bytes(data)
        results.append((name, len(data) // 1024, "DUPLICATE" if dup else "NEW", dup or url[:95]))

    results.sort(key=lambda r: r[1], reverse=True)
    print(f"Saved {len(results)} valid images")
    print("-" * 100)
    for name, size_kb, status, note in results:
        print(f"{name:22} {size_kb:5} KB  {status:10}  {note}")
    print("-" * 100)
    print("New:", sum(1 for r in results if r[2] == "NEW"), "| Duplicates:", sum(1 for r in results if r[2] == "DUPLICATE"))


if __name__ == "__main__":
    main()
