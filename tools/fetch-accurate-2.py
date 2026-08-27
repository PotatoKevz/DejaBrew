import urllib.request, ssl, os, shutil, re
ssl._create_default_https_context = ssl._create_unverified_context

# Dubai accurate
try:
    urllib.request.urlretrieve('https://wearenotmartha.com/wp-content/uploads/dubai-chocolate-mocha-featured.jpg','Dubai-Chocolate-Mocha.jpg')
    shutil.copy('Dubai-Chocolate-Mocha.jpg','public/Dubai-Chocolate-Mocha.jpg')
    print('dubai ok', os.path.getsize('Dubai-Chocolate-Mocha.jpg'))
except Exception as e:
    print('dubai fail',e)

# Salted egg - try Lavazza alternative? Use Oatly page fetch
try:
    data = urllib.request.urlopen('https://www.oatly.com/recipes/look-book-autumn-winter-2025/salted-egg-custard-latte').read().decode('utf-8', errors='ignore')
    m = re.search(r'https://[^\"]+\\.(?:jpg|png|webp)', data)
    print('oatly m', m.group(0)[:120] if m else 'none')
    if m:
        url = m.group(0)
        # clean
        if url.startswith('https://www.oatly.com'):
            # need full
            pass
        urllib.request.urlretrieve(url, 'Salted-Egg-Cream-Latte.jpg')
        shutil.copy('Salted-Egg-Cream-Latte.jpg','public/Salted-Egg-Cream-Latte.jpg')
        print('salted ok', os.path.getsize('Salted-Egg-Cream-Latte.jpg'))
except Exception as e:
    print('salted fail',e)
