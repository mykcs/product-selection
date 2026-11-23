// Optional browser regression: PLAYWRIGHT_PACKAGE=/path/to/playwright node tests/agent-reader.browser.cjs
const assert=require('node:assert/strict');
const {createServer}=require('node:http');
const {readFile}=require('node:fs/promises');
const {resolve}=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const root=resolve(__dirname,'..');
const allowed=new Map([['/','index.html'],['/agent/','agent/index.html'],['/llms.txt','llms.txt'],['/agent/site.json','agent/site.json'],['/agent/SKILL.md','agent/SKILL.md'],['/agent/reader.js','agent/reader.js']]);
const server=createServer(async(req,res)=>{
  try{
    const file=allowed.get(new URL(req.url,'http://localhost').pathname);
    if(!file){res.writeHead(404).end();return;}
    const mime=file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':'text/plain; charset=utf-8';
    res.writeHead(200,{'Content-Type':mime}).end(await readFile(resolve(root,file)));
  }catch{res.writeHead(404).end();}
});
(async()=>{
  await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
  const base='http://127.0.0.1:'+server.address().port;
  let browser;
  try{
    browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
    const index=JSON.parse(await readFile(resolve(root,'agent/site.json'),'utf8'));
    for(const [name,viewport,phone,colorScheme] of [
      ['desktop',{width:1440,height:900},false,'light'],
      ['phone',{width:440,height:956},true,'light'],
      ['phone-dark',{width:440,height:956},true,'dark']
    ]){
      const c=await browser.newContext({viewport,deviceScaleFactor:phone?3:1,isMobile:phone,hasTouch:phone,colorScheme,permissions:['clipboard-read','clipboard-write']});
      await c.route('**/*',route=>route.request().url().startsWith(base+'/')?route.continue():route.abort());
      const page=await c.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
      assert.equal((await page.goto(base+'/')).status(),200);
      await page.getByRole('link',{name:'给 Agent 读 →'}).click();await page.waitForURL(base+'/agent/');
      assert.equal(await page.locator('h1').innerText(),'给 Agent 读');
      const value=await page.locator('#context').inputValue();
      for(const item of index.categories) assert(value.includes(item.url));
      assert(!value.includes('PRIVATE_SYNTHETIC_SENTINEL'));
      const button=page.getByRole('button',{name:'复制给 Agent'});
      assert(await button.evaluate(el=>el.getBoundingClientRect().bottom<=window.innerHeight));
      await button.click();await page.getByText('已复制通用阅读上下文。',{exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),value);
      for(const file of ['/llms.txt','/agent/site.json','/agent/SKILL.md'])assert.equal((await page.request.get(base+file)).status(),200);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
      assert.deepEqual(errors,[]);
      if(process.env.READER_SCREENSHOT_DIR)await page.screenshot({path:resolve(process.env.READER_SCREENSHOT_DIR,name+'.png'),fullPage:true});
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}));
      await button.click();await page.getByText('自动复制不可用；已选中文本，请手动复制。',{exact:true}).waitFor();
      assert(await page.locator('#context').evaluate(el=>el.selectionStart===0&&el.selectionEnd===el.value.length));
      await c.close();
      console.log('PASS '+name+': discovery, first-viewport copy, clipboard equality, fallback, machine files, no overflow/errors');
    }
    const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:440,height:956}});
    const p=await c.newPage();await p.goto(base+'/agent/');
    assert(await p.locator('#context').isVisible());assert((await p.locator('#context').inputValue()).includes(index.categories[0].url));
    assert(!(await p.locator('#copy').isVisible()));await c.close();
    console.log('PASS no-JS manual copy');
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
