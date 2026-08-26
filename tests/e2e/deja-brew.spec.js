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
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(10);
    // pills
    await expect(page.locator('.price-pill').first()).toContainText('₱');
    const hasU = await page.evaluate(() => document.querySelectorAll('u').length);
    expect(hasU).toBe(0);
    // tabs
    await page.click('button[data-filter="coffee"]');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(5);
    await page.click('button[data-filter="pastry"]');
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(5);
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
    await expect(page.locator('#menu-grid .menu-item')).toHaveCount(10);

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
