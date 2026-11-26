import {test,expect} from '@playwright/test';
import {pages} from '../src/lib/site-files.mjs';
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
  await expect(page.locator('.shop')).toHaveCount(13);
  await expect(page.locator('.stock-overview')).toContainText('官网参考 HK$1,190');
  await expect(page.locator('.stock-overview')).toContainText('官网参考 HK$1,490');
  await page.locator('#other-channels summary').click();
  await expect(page.locator('#other-channels')).toContainText('Mountain Services 名峰行');
  await expect(page.locator('#other-channels')).toContainText('不计入目标款最低价');
  await page.locator('#other-channels summary').click();
  await expect(page.locator('#rc-mk .stock-row[data-size="28"]')).toHaveAttribute('data-status','unknown');
  await expect(page.locator('#overlander-mk .stock-row[data-size="26"]')).toHaveAttribute('data-status','unknown');

  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(11);
  await expect(page.locator('#map-message')).toContainText('底图暂不可用');
  await page.locator('button[data-region="island"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(3);
  await page.locator('button[data-station="油麻地"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(4);
  await expect(page.locator('.shop:visible a').first()).toBeVisible();
  await expect(page.locator('.shop:visible a[href*="travelmode=transit"]').first()).toBeVisible();
  await page.locator('button[data-region="kwun-tong"]').click();
  await page.locator('button[data-size-filter="26"]').click();
  await page.locator('button[data-stock-filter="in"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(1);
  await expect(page.locator('#hillmalaya .stock-row[data-size="26"]')).toContainText('5 件');
  await page.locator('button[data-size-filter="28"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(2);
  await expect(page.locator('#hillmalaya .stock-row[data-size="28"]')).toContainText('3 件');
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
  await page.locator('button[data-region="kowloon"]').click();
  await expect(page.locator('#stock-empty')).toBeVisible();
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(0);
  await page.locator('button[data-stock-filter="all"]').click();
  await page.locator('button[data-size-filter="all"]').click();
  await expect(page.locator('.shop:visible')).toHaveCount(8);
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(6);
  await page.locator('.leaflet-marker-icon').filter({hasText:'02/09/10'}).click();
  await expect(page.locator('.leaflet-popup-content')).toContainText('Funshop');
  await expect(page.locator('.leaflet-popup-content')).toContainText('Ho Wa');
  await expect(page.locator('.leaflet-popup-content')).toContainText('BackNature');

});
