#!/usr/bin/env python3
"""Yaxest Games -> Bluesky otomatik paylaşım (ücretsiz, sadece standart kütüphane).
social/sonraki.txt değişince GitHub Actions bunu çalıştırır. Dosyanın ilk satırları paylaşım metnidir.
Gizli bilgiler: BSKY_HANDLE ve BSKY_APP_PASSWORD (GitHub > Settings > Secrets). Kodda şifre YOKTUR.
Deneme: python3 social/bluesky_post.py --dry
"""
import json, os, re, sys, urllib.request, datetime

PDS = "https://bsky.social"
URL_RE = re.compile(r"https?://[^\s]+")

def call(path, body, token=None):
    req = urllib.request.Request(PDS + path, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    if token:
        req.add_header("Authorization", "Bearer " + token)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def facets(text):
    out = []
    raw = text.encode("utf-8")
    for m in URL_RE.finditer(text):
        s = len(text[:m.start()].encode("utf-8")); e = s + len(m.group(0).encode("utf-8"))
        out.append({"index": {"byteStart": s, "byteEnd": e},
                    "features": [{"$type": "app.bsky.richtext.facet#link", "uri": m.group(0)}]})
    for m in re.finditer(r"#(\w+)", text):
        s = len(text[:m.start()].encode("utf-8")); e = s + len(m.group(0).encode("utf-8"))
        out.append({"index": {"byteStart": s, "byteEnd": e},
                    "features": [{"$type": "app.bsky.richtext.facet#tag", "tag": m.group(1)}]})
    return out

def main():
    text = open(os.path.join(os.path.dirname(__file__), "sonraki.txt"), encoding="utf-8").read().strip()
    if not text:
        print("sonraki.txt boş, paylaşım yok"); return
    if len(text) > 300:
        sys.exit("Metin 300 karakterden uzun (%d)" % len(text))
    rec = {"$type": "app.bsky.feed.post", "text": text, "langs": ["tr"],
           "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
           "facets": facets(text)}
    if "--dry" in sys.argv:
        print(json.dumps(rec, ensure_ascii=False, indent=1)); return
    handle, pw = os.environ.get("BSKY_HANDLE"), os.environ.get("BSKY_APP_PASSWORD")
    if not handle or not pw:
        sys.exit("BSKY_HANDLE / BSKY_APP_PASSWORD gizli değerleri tanımlı değil")
    s = call("/xrpc/com.atproto.server.createSession", {"identifier": handle, "password": pw})
    r = call("/xrpc/com.atproto.repo.createRecord", {"repo": s["did"], "collection": "app.bsky.feed.post", "record": rec}, s["accessJwt"])
    print("Paylaşıldı:", r["uri"])

main()
