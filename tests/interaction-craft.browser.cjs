const { chromium, webkit } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const assert = require('node:assert/strict');
const paths=['/','/iphone/','/iphone/trade-in-guide/','/mac/','/mac/mac-mini/','/mac/macbook-pro/','/mac/storage/','/osprey/','/osprey/series/','/watch/'];
const base=process.env.SITE_ORIGIN || 'http://127.0.0.1:4191';
(async()=>{
  for(const [engine,type] of (process.env.RUN_WEBKIT === '1' ? [['chromium',chromium],['webkit',webkit]] : [['chromium',chromium]])){
    const browser=await type.launch({headless:true});
    try{
      for(const width of [1280,440]){
        const context=await browser.newContext({viewport:{width,height:956},colorScheme:'light'});
        for(const route of paths){
          const page=await context.newPage();
          const errors=[];
          page.on('pageerror',e=>errors.push(e.message));
          const response=await page.goto(base+route,{waitUntil:'load'});
          assert.equal(response.status(),200,engine+route+' HTTP');
          const link=await page.locator('link[href="/interaction-craft.css"]').count();
          assert.equal(link,1,engine+route+' stylesheet linked');
          const style=await page.evaluate(()=>{const rules=[...document.styleSheets];return rules.some(s=>s.href?.endsWith('/interaction-craft.css'))});
          assert.ok(style,engine+route+' stylesheet loaded');
          const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
          assert.ok(overflow<=2,engine+route+' '+width+' overflow '+overflow);
          const first=page.locator('a:visible').first();
          if(await first.count()){
            await page.keyboard.press('Tab');
            await first.focus();
            const outline=await first.evaluate(el=>({isFocus:el.matches(':focus-visible'),size:parseFloat(getComputedStyle(el).outlineWidth)}));
            assert.ok(outline.size>=2,engine+route+' '+width+' focus outline '+JSON.stringify(outline));
          }
          if(width===1280 && (await page.locator('header nav a').count())>0){
            const nav=page.locator('header nav a').first();
            const before=await nav.evaluate(el=>({r:el.getBoundingClientRect().toJSON(),bg:getComputedStyle(el).backgroundColor}));
            await nav.hover();await page.waitForTimeout(280);
            const after=await nav.evaluate(el=>({r:el.getBoundingClientRect().toJSON(),bg:getComputedStyle(el).backgroundColor}));
            assert.equal(before.r.width,after.r.width,engine+' nav no width shift');
            assert.equal(before.r.height,after.r.height,engine+' nav no height shift');
            assert.notEqual(before.bg,after.bg,engine+' nav hover feedback '+route);
          }
          if(route==='/' && width===1280){
             const card=page.locator('a.card').first();
             const arrow=card.locator('.go-arrow');
             assert.equal(await arrow.count(),1);
             let before=await arrow.evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,bg:getComputedStyle(el).backgroundColor}));
             await card.hover();await page.waitForTimeout(280);
             let after=await arrow.evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,bg:getComputedStyle(el).backgroundColor}));
             assert.deepEqual([before.w,before.h],[after.w,after.h]);
             assert.notEqual(before.bg,after.bg,engine+' card arrow hover');
             await page.screenshot({path:process.env.SCREENSHOT_DESKTOP || '/tmp/product-selection-after-1280.png',animations:'disabled',fullPage:false});
          }
          if(route==='/' && width===440){
             await page.screenshot({path:process.env.SCREENSHOT_MOBILE || '/tmp/product-selection-after-440.png',animations:'disabled',fullPage:false});
          }
          assert.deepEqual(errors,[],engine+route+' runtime exceptions');
          console.log('PASS',engine,width,route);
          await page.close();
        }
        await context.close();
      }
      const context=await browser.newContext({viewport:{width:1280,height:956},reducedMotion:'reduce'});
      const page=await context.newPage();
      await page.goto(base+'/');
      const arrow=page.locator('.go-arrow').first();
      assert.equal(await arrow.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
      console.log('PASS',engine,'reduced-motion');
      await context.close();
    }finally{await browser.close();}
  }
})().catch(e=>{console.error(e.stack);process.exit(1)});
