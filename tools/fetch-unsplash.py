import urllib.request, ssl, os, shutil, time
ssl._create_default_https_context = ssl._create_unverified_context

# product filename -> (unsplash id, photographer)
mapping = {
    "Benguet-Starburst.jpg": ("1509042239860-f550ce710b93", "Nathan Dumlao"),
    "Mt-Apo-Natural.jpg": ("1447933601403-0c6688de566e", "Karl Fredrickson"),
    "Batangas-Barako.jpg": ("1511920170033-f8396924c348", "Nathan Dumlao"),
    "Cavite-Excelsa.jpg": ("1445116572660-236099ec97a0", "Lavi Perchik"),
    "Atok-Honey.jpg": ("1521017432531-fbd92d768814", "Nathan Dumlao"),
    "Ube-Coconut-Macchiato.jpg": ("1745725247846-12a3e3109bbf", "Esra Afşar"),
    "Hojicha-Vanilla-Latte.jpg": ("1576092768241-dec231879fc3", "Moksha Jain"),
    "Pandan-Cream-Cold-Brew.jpg": ("1558160075038-a282aa742c47", "Mae Mu"),
    "Salted-Egg-Cream-Latte.jpg": ("1461024121970-a9f50ff320b1", "Alfredo Rocha"),
    "Lavender-Honey-Latte.jpg": ("1464375117522-1311d34925f4", "Annie Spratt"),
    "Pistachio-Oat-Latte.jpg": ("1504630083234-14187a9df0f5", "Brenda Godinez"),
    "Dubai-Chocolate-Mocha.jpg": ("1473093295047-e8a673251918", "Charisse Kenion"),
    "Yuzu-Espresso-Tonic.jpg": ("1513558161293-cdaf765ed2fd", "Jennifer Burk"),
    "Pineapple-Dole-Whip-Brew.jpg": ("1551024506-0bccd828d307", "Pineapple"),
    "Mango-Milkwash.jpg": ("1551024709-0f23e4698e94", "Mango"),
    "Banana-Gin-Fizz.jpg": ("1523677011781-c91a2468a984", "Banana"),
    "Ube-Cheese-Pandesal.jpg": ("1509440159596-0249088772ff", "Bread"),
    "Pandan-Basque-Cheesecake.jpg": ("1578985545062-69928b1d9587", "Cheesecake"),
    "Calamansi-Tart.jpg": ("1464349095431-22c57d03679b", "Tart"),
    "Adlai-Oat-Cookie.jpg": ("1499636136210-6f4ee915583e", "Cookie"),
    "Bibingka-Cheesecake.jpg": ("1486427944299-d1955d23e34d", "Bibingka"),
}

for fname, (pid, photographer) in mapping.items():
    url = f"https://images.unsplash.com/photo-{pid}?w=600&h=400&fit=crop&auto=format&q=80"
    dest = fname
    dest_pub = os.path.join("public", fname)
    try:
        print(f"fetch {fname} {pid} ({photographer})")
        urllib.request.urlretrieve(url, dest)
        sz = os.path.getsize(dest)
        print(f"  -> {sz} bytes")
        if sz < 8000:
            print("  too small, fallback")
            raise Exception("small")
        shutil.copy(dest, dest_pub)
    except Exception as e:
        print(f"  FAIL {fname}: {e}")
        # fallback to picsum seed
        try:
            urllib.request.urlretrieve(f"https://picsum.photos/seed/{fname}/600/400", dest)
            shutil.copy(dest, dest_pub)
            print(f"  fallback picsum {os.path.getsize(dest)}")
        except Exception as e2:
            print(f"  fallback fail {e2}")
    time.sleep(0.5)

print("done unsplash")
