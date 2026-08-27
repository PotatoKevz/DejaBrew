import urllib.request, urllib.error, ssl, os, time, random
ssl._create_default_https_context = ssl._create_unverified_context

# mapping of filename -> unsplash query
mapping = {
    "Benguet-Starburst.jpg": "coffee beans mountain philippines",
    "Mt-Apo-Natural.jpg": "coffee cherries philippines",
    "Batangas-Barako.jpg": "barako coffee philippines liberica",
    "Cavite-Excelsa.jpg": "excelsa coffee beans",
    "Atok-Honey.jpg": "honey coffee process",
    "Ube-Coconut-Macchiato.jpg": "ube latte purple yam coconut",
    "Hojicha-Vanilla-Latte.jpg": "hojicha latte roasted green tea",
    "Pandan-Cream-Cold-Brew.jpg": "pandan cold brew",
    "Salted-Egg-Cream-Latte.jpg": "salted egg latte cream foam",
    "Lavender-Honey-Latte.jpg": "lavender honey latte",
    "Pistachio-Oat-Latte.jpg": "pistachio oat latte",
    "Dubai-Chocolate-Mocha.jpg": "dubai chocolate pistachio kataifi",
    "Yuzu-Espresso-Tonic.jpg": "yuzu espresso tonic",
    "Pineapple-Dole-Whip-Brew.jpg": "pineapple dole whip coffee",
    "Mango-Milkwash.jpg": "mango coffee cold brew",
    "Ube-Cheese-Pandesal.jpg": "ube cheese pandesal",
    "Pandan-Basque-Cheesecake.jpg": "pandan basque cheesecake",
    "Calamansi-Tart.jpg": "calamansi tart philippines",
    "Adlai-Oat-Cookie.jpg": "adlai cookie oat",
    "Bibingka-Cheesecake.jpg": "bibingka cheesecake",
}

def fetch(query, out):
    # try unsplash source, fallback to picsum seed
    urls = [
        f"https://source.unsplash.com/600x400/?{query.replace(' ', ',')}",
        f"https://loremflickr.com/600/400/{query.replace(' ', ',')}",
        f"https://picsum.photos/seed/{out.replace('.','-')}/600/400",
    ]
    for url in urls:
        try:
            print(f"fetch {out} <- {url}")
            urllib.request.urlretrieve(url, out)
            if os.path.getsize(out) > 5000:
                print(f" ok {out} {os.path.getsize(out)}")
                return True
            else:
                print(f" too small {out}")
        except Exception as e:
            print(f" fail {url}: {e}")
        time.sleep(0.6)
    return False

os.makedirs("public", exist_ok=True)
for fname, query in mapping.items():
    dest_root = fname
    dest_public = os.path.join("public", fname)
    ok = fetch(query, dest_root)
    if ok:
        # copy to public
        try:
            import shutil
            shutil.copy(dest_root, dest_public)
        except: pass
    else:
        print(f"FAILED {fname}")
    time.sleep(0.8)

print("done")
# list
print("\n".join(sorted([f for f in os.listdir('.') if f.endswith('.jpg')] )[:30]))
