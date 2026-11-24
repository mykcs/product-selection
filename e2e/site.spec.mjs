import {test,expect} from '@playwright/test';
import {pages} from '../src/lib/legacy-pages.mjs';
for(const route of pages())test('rendered /'+route.route,async({page},info)=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Only exercise locally served content; no purchases or real personal inputs.
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const url='/'+(route.route?route.route+'/':'');
  expect((await page.goto(url)).status()).toBe(200);
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('main')).toBeVisible();
  const measure=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  expect(measure.scrollWidth).toBeLessThanOrEqual(measure.width+1);
  const skip=page.locator('.site-skip');
  expect(await skip.evaluate(el=>getComputedStyle(el).position)).toBe('absolute');
  await skip.focus();
  expect(await skip.evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp('#'+route.mainId+'$'));
  expect(errors).toEqual([]);
  await info.attach('viewport',{body:JSON.stringify(measure),contentType:'application/json'});
  await info.attach('screenshot',{body:await page.screenshot({fullPage:false}),contentType:'image/png'});
});
test('Osprey chooser and local series data',async({page})=>{
  await page.goto('/osprey/');
  const option=page.locator('[data-choice="hike"]');
  await option.click();
  await expect(option).toHaveAttribute('aria-pressed','true');
  await page.goto('/osprey/series/');
  await expect(page.locator('#family-list')).not.toBeEmpty();
  await page.locator('#series-search').fill('Talon');
  await expect(page.locator('#family-list')).toContainText(/Talon/i);
});

test('Hong Kong dealer map and wishlist preserve independent filters',async({page})=>{
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto('/osprey/');
  await expect(page.locator('#my-wishes')).toBeVisible();
  await page.locator('a[href="/osprey/hong-kong/"]').click();
  await expect(page.locator('.shop')).toHaveCount(8);
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(8);
  await page.locator('button[data-region="island"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(3);
  await page.locator('button[data-station="油麻地"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(2);
  await expect(page.locator('.shop:visible a').first()).toBeVisible();
  await expect(page.locator('.shop:visible a[href*="travelmode=transit"]').first()).toBeVisible();
});
