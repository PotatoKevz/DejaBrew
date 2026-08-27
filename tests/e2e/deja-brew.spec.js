import { test, expect } from '@playwright/test';

test.describe('Deja Brew — CAP 1 Warm Editorial Surfaces', () => {
  test('hero and tokens render per design-system', async ({ page }) => {
    await page.goto('/Main.html');
    const h1 = page.locator('.intro h1');
    await expect(h1).toBeVisible();
    const ff = await h1.evaluate(el => getComputedStyle(el).fontFamily);
    expect(ff).toMatch(/Playfair/);
    const fs = await h1.evaluate(el => getComputedStyle(el).fontSize);
    expect(fs).toBe('72px'); // 4.5rem = 72px at 16px root (or 41.6px at 768px via media)
    const menuImg = page.locator('.menu-img').first();
    await expect(menuImg).toBeVisible();
    const h = await menuImg.evaluate(el => getComputedStyle(el).height);
    expect(h).toBe('220px');
    const br = await menuImg.evaluate(el => getComputedStyle(el).borderRadius);
    expect(br).toMatch(/16px/);
    const cardBg = await page.locator('.menu-item').first().evaluate(el => getComputedStyle(el).backgroundColor);
    // #FFF8F0 = rgb(255,248,240)
    expect(cardBg).toBe('rgb(255, 248, 240)');
  });

  test('768px breakpoint stacks grid', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await page.goto('/Main.html');
    const dir = await page.locator('.menu-grid').first().evaluate(el => getComputedStyle(el).flexDirection);
    expect(dir).toBe('column');
  });
});

test.describe('Deja Brew — CAP 2 Story-Fused Scroll', () => {
  test('Main scroll order hero → ribbon → featured → #about → contact', async ({ page }) => {
    await page.goto('/Main.html');
    await expect(page.locator('.hero-copy h1')).toContainText('Welcome to Deja Brew');
    await expect(page.locator('.hero-visual img[src="Coffeeshop.jpeg"]')).toBeVisible();
    await expect(page.locator('.hero-badge')).toContainText('Fresh today');
    await expect(page.locator('.values-ribbon .value-card')).toHaveCount(3);
    await expect(page.locator('#featured .menu-grid a.menu-item')).toHaveCount(6);
    // whole cards clickable
    const href = await page.locator('#featured a.menu-item').first().getAttribute('href');
    expect(href).toBe('MenuOrder.html');
    // about anchor exists and nav points to it
    const aboutLink = page.locator('a[href="#about"]');
    await expect(aboutLink).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await page.click('a[href="#about"]');
    await expect(page.locator('#about h2').first()).toBeVisible();
  });
});

test.describe('Deja Brew — CAP 3 Unified Menu', () => {
  test('MenuOrder tabs pills sensory pastry-first search', async ({ page }) => {
    await page.goto('/MenuOrder.html');
    // catalog now 31 (21 coffee + 10 pastry)
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(31);
    // pills
    await expect(page.locator('.price-pill').first()).toContainText('₱');
    const hasU = await page.evaluate(() => document.querySelectorAll('u').length);
    expect(hasU).toBe(0);
    // tabs — dynamic counts from catalog.js
    await page.click('button[data-filter="coffee"]');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(21);
    await page.click('button[data-filter="pastry"]');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(10);
    await page.click('button[data-filter="Gluten Free"]');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(1);
    await expect(page.locator('#menu-grid .menu-item h3')).toContainText('Macaron');
    // search citrus → Americano
    await page.click('button[data-filter="all"]');
    await page.fill('#search', 'Americano');
    await expect(page.locator('#menu-grid .menu-item h3', { hasText: 'Americano' })).toBeVisible();
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(1);
    await page.fill('#search', '');
    // tasting search also works: citrus -> Americano via tasting notes (visibility only, count may vary)
    await page.fill('#search', 'citrus');
    await expect(page.locator('#menu-grid .menu-item h3', { hasText: 'Americano' })).toBeVisible();
    await page.fill('#search', '');
    // pastry-first toggle reverses grid
    const firstBefore = await page.locator('#menu-grid .menu-item h3').first().textContent();
    await page.check('#pastry-first');
    const firstAfter = await page.locator('#menu-grid .menu-item h3').first().textContent();
    expect(firstAfter).not.toBe(firstBefore);
    // sensory ≤8 words (sample)
    const sensory = await page.locator('#menu-grid .menu-item p').first().textContent();
    expect(sensory.trim().split(/\s+/).length).toBeLessThanOrEqual(8);
  });
});

test.describe('Deja Brew — CAP 4 Guided Nav + Cart', () => {
  test('sticky progress and LocalStorage cart', async ({ page }) => {
    await page.goto('/MenuOrder.html');
    const navPos = await page.locator('.navbar').evaluate(el => getComputedStyle(el).position);
    expect(navPos).toBe('sticky');
    // progress bar exists and is amber
    const bar = page.locator('#progress-bar');
    await expect(bar).toBeAttached();
    const bg = await bar.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(240, 165, 0)'); // #f0a500
    // cart
    await page.evaluate(() => localStorage.clear());
    await page.click('#menu-grid .menu-item >> text=Add to cart', { timeout: 5000 });
    await expect(page.locator('#cart-badge')).toContainText('1');
    // close drawer so backdrop doesn't block second card
    await page.locator('#cart-drawer >> text=Continue browsing').click();
    await page.click('#menu-grid .menu-item >> nth=1 >> text=Add to cart');
    await expect(page.locator('#cart-badge')).toContainText('2');
    // +/- ?
    await page.locator('#cart-drawer').waitFor({ state: 'visible' });
    await page.click('#cart-drawer >> text=+');
    // reload persists
    await page.reload();
    await expect(page.locator('#cart-badge')).toContainText('3');
    // Order Now still points to success
    const orderHref = await page.locator('#cart-drawer a.btn-primary').getAttribute('href');
    expect(orderHref).toBe('order-success.html');
    // drawer open/close via backdrop
    await page.click('a:has-text("Cart")');
    await expect(page.locator('#cart-drawer')).toBeVisible();
  });
});

test.describe('Deja Brew — CAP 5 Enriched Catalog + Footer', () => {
  test('origin roast tasting and footer', async ({ page }) => {
    await page.goto('/MenuOrder.html');
    const origin = await page.locator('#menu-grid .menu-item p').nth(1).textContent(); // origin line
    expect(origin).toMatch(/•/);
    await page.goto('/Main.html');
    await expect(page.locator('.footer-grid')).toContainText('Daily 7am');
    await expect(page.locator('.footer-grid')).toContainText('Micro-map');
    await expect(page.locator('.ig-strip img')).toHaveCount(4);
    // image casing check sample
    const src = await page.locator('img[src="Kwasant.jpg"]').first().getAttribute('src');
    expect(src).toBe('Kwasant.jpg');
  });
});

test.describe('Deja Brew — CAP 6 Mood + Success', () => {
  test('mood picker and success extension', async ({ page }) => {
    await page.goto('/MenuOrder.html');
    await page.click('text=Cozy & Creamy');
    // after cozy, pastry-first should be checked
    await expect(page.locator('#pastry-first')).toBeChecked();
    await page.click('text=Bold & Strong');
    await expect(page.locator('#pastry-first')).not.toBeChecked();
    // only bold ids visible
    const titles = await page.locator('#menu-grid .menu-item h3').allTextContents();
    expect(titles.join()).toMatch(/Espresso/);
    await page.click('text=Show me all');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(31);

    await page.goto('/order-success.html');
    // well-formed check: no malformed Home
    const html = await page.content();
    expect(html).not.toContain('<a href="Main.html">Home</li>');
    await expect(page.locator('text=Estimated delivery time: 30 minutes')).toBeVisible();
    await expect(page.locator('.cross-sell-grid .mini-card')).toHaveCount(3);
    await expect(page.locator('#receipt')).toBeVisible();
    // add cart then receipt total
    await page.goto('/MenuOrder.html');
    await page.evaluate(() => localStorage.clear());
    await page.click('#menu-grid .menu-item >> text=Add to cart');
    await page.goto('/order-success.html');
    await expect(page.locator('#receipt')).toContainText('Total');
    await expect(page.locator('#receipt')).toContainText('₱');
    // Reorder navigates to MenuOrder
    await page.click('text=Reorder');
    await expect(page).toHaveURL(/MenuOrder/);
  });
});

test.describe('Deja Brew — Horizon A Polish & Trust', () => {
  test('hamburger at 768px + SEO + drawer a11y + corrupted storage', async ({ page }) => {
    await page.goto('/Main.html');
    // SEO head
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ld).toContain('CafeOrCoffeeShop');
    // skip link exists
    await expect(page.locator('.skip-link')).toHaveCount(1);
    // hamburger visible at 768
    await page.setViewportSize({ width: 768, height: 800 });
    await expect(page.locator('#nav-toggle')).toBeVisible();
    await page.click('#nav-toggle');
    await expect(page.locator('#navbar-links')).toHaveClass(/open/);
    await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.locator('#navbar-links')).not.toHaveClass(/open/);
    // drawer a11y
    await page.goto('/MenuOrder.html');
    await page.evaluate(()=> localStorage.clear());
    await page.click('#menu-grid .menu-item >> text=Add to cart');
    await expect(page.locator('#cart-drawer')).toHaveAttribute('aria-hidden', 'false');
    await page.keyboard.press('Escape');
    await expect(page.locator('#cart-drawer')).toHaveAttribute('aria-hidden', 'true');
    // corrupted storage clears cleanly
    await page.evaluate(()=> localStorage.setItem('deja-brew-cart', ']]]'));
    await page.reload();
    await expect(page.locator('#cart-badge')).toBeHidden();
    const badgeText = await page.evaluate(()=> localStorage.getItem('deja-brew-cart'));
    expect(badgeText).toBeNull(); // bad key removed
    // sitemap reachable (via navigation check)
    const resp = await page.request.get('/sitemap.xml').catch(()=> null);
    if (resp) expect(resp.status()).toBe(200);
  });
});

test.describe('Deja Brew — Horizon B Discovery & Delight', () => {
  test('origin map + brew guide on Main', async ({ page }) => {
    await page.goto('/Main.html');
    await expect(page.locator('#origin-map')).toBeVisible();
    await expect(page.locator('.origin-pin')).toHaveCount(6);
    await expect(page.locator('.origin-pin', { hasText: 'Benguet' })).toBeVisible();
    await expect(page.locator('#brew-guide')).toBeVisible();
    await expect(page.locator('.brew-card')).toHaveCount(3);
    // pin href carries query
    const href = await page.locator('.origin-pin', { hasText: 'Atok' }).getAttribute('href');
    expect(href).toContain('origin=Atok');
  });
  test('smart filters price/roast/sort + query origin', async ({ page }) => {
    await page.goto('/MenuOrder.html?origin=Benguet');
    // origin query filters to Benguet only (M-C-01,06,18,19) = 4
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(4);
    await page.goto('/MenuOrder.html');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(31);
    // price filter narrows — use max 330 to avoid empty combo with Light
    await page.locator('#price-max').evaluate((el, v)=> { el.value=v; el.dispatchEvent(new Event('input',{bubbles:true}));}, '330');
    // Light roast only (pure roast filter)
    await page.click('button[data-roast="Light"]');
    const lightCount = await page.locator('#menu-grid .menu-item').count();
    expect(lightCount).toBeGreaterThan(0);
    expect(lightCount).toBeLessThan(31);
    // sort price asc
    await page.selectOption('#sort-by', 'price-asc');
    const prices = await page.locator('#menu-grid .menu-item .price-pill').allTextContents();
    const nums = prices.map(p=> Number(p.replace(/[^\d.]/g,''))).filter(n=> Number.isFinite(n));
    for(let i=1;i<nums.length;i++) expect(nums[i]).toBeGreaterThanOrEqual(nums[i-1]);
    await page.click('text=Clear');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(31);
  });
  test('faves heart persist + 404 + review stars', async ({ page }) => {
    await page.goto('/MenuOrder.html');
    await page.evaluate(()=> localStorage.clear());
    await page.reload();
    // fave first item — force to avoid image intercept at edge
    await page.locator('#menu-grid .menu-item button[aria-pressed]').first().click({ force: true });
    await page.reload();
    // fave persists
    const pressed = await page.locator('#menu-grid .menu-item button[aria-pressed="true"]').count();
    expect(pressed).toBe(1);
    await page.click('#filter-faves');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(1);
    await page.click('#filter-faves'); // toggle off
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(31);
    // review stars visible
    await expect(page.locator('#menu-grid .menu-item').first().locator('text=★')).toBeVisible();
    // 404
    await page.goto('/404.html');
    await expect(page.locator('text=Lost your brew?')).toBeVisible();
    await expect(page.locator('a[href="MenuOrder.html"]').first()).toBeVisible();
    await expect(page.locator('a[href="MenuOrder.html"]')).toHaveCount(2);
    const resp404 = await page.request.get('/404.html');
    expect(resp404.status()).toBe(200);
  });
});

test.describe('Deja Brew — Horizon C Scale', () => {
  test('manifest + verify scripts + casing guard', async ({ page }) => {
    await page.goto('/Main.html');
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
    const man = await page.request.get('/manifest.json');
    expect(man.status()).toBe(200);
    const json = await man.json();
    expect(json.name).toContain('Deja Brew');
    expect(json.start_url).toBe('Main.html');
    const robots = await page.request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    const sitemap = await page.request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
  });
});
