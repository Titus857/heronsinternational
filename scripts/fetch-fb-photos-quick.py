import hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "facebook-candidates"
OUT.mkdir(parents=True, exist_ok=True)


def valid(data: bytes) -> bool:
    return (
        data[:3] == b"\xff\xd8\xff"
        or data[:8] == b"\x89PNG\r\n\x1a\n"
        or (data[:4] == b"RIFF" and data[8:12] == b"WEBP")
    )


def ext_for(data: bytes) -> str:
    if data[:3] == b"\xff\xd8\xff":
        return "jpg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    return "webp"


existing = {}
for p in ROOT.rglob("*"):
    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"} and "facebook-candidates" not in str(p):
        existing[hashlib.md5(p.read_bytes()).hexdigest()] = str(p.relative_to(ROOT))

captured: dict[str, tuple[int, bytes, str]] = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        ignore_https_errors=True,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        viewport={"width": 1400, "height": 900},
    )
    page = context.new_page()

    def on_resp(resp) -> None:
        url = resp.url
        if "scontent" not in url:
            return
        ctype = resp.headers.get("content-type", "")
        if "image" not in ctype:
            return
        try:
            data = resp.body()
        except Exception:
            return
        if not valid(data) or len(data) < 12000:
            return
        h = hashlib.md5(data).hexdigest()
        score = len(data) + (500 if any(x in url for x in ("2048", "1500", "1130")) else 0)
        prev = captured.get(h)
        if not prev or score > prev[0]:
            captured[h] = (score, data, url)

    page.on("response", on_resp)
    for target in [
        "https://www.facebook.com/heronsinternational",
        "https://m.facebook.com/heronsinternational",
        "https://www.facebook.com/heronsinternational/photos",
    ]:
        try:
            page.goto(target, wait_until="domcontentloaded", timeout=90000)
            page.wait_for_timeout(5000)
            for _ in range(6):
                page.mouse.wheel(0, 2000)
                page.wait_for_timeout(1200)
        except Exception as exc:
            print("warn", target, exc)

    browser.close()

# Clear old candidates
for old in OUT.glob("fb-candidate-*"):
    old.unlink()

items = sorted(captured.values(), key=lambda item: item[0], reverse=True)
print("valid captures:", len(items))
for i, (_, data, url) in enumerate(items, 1):
    h = hashlib.md5(data).hexdigest()
    dup = existing.get(h)
    name = f"fb-candidate-{i:02d}.{ext_for(data)}"
    (OUT / name).write_bytes(data)
    status = "DUPLICATE" if dup else "NEW"
    print(f"{name:22} {len(data) // 1024:4}KB  {status:10}  {url[:90]}")
