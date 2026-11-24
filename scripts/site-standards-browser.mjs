/** Opt-in, exact-candidate browser acceptance for the built Astro site.
 * PLAYWRIGHT_MODULE points to the pinned package installed by the formal job.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { formatCalendarDate, formatCalendarText } = require('../assets/calendar-date.js');
const playwright = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const output = join(root, 'reports/site-standards');
await mkdir(output, { recursive: true });
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
if (process.env.EXPECTED_SHA) assert.equal(sha, process.env.EXPECTED_SHA, 'browser artifact must belong to the reviewed candidate');
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'reports', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}
const servingRoot = join(root, 'dist');
const routes = (await htmlFiles(servingRoot)).sort().map(file => '/' + relative(servingRoot, file).replaceAll(sep, '/').replace(/index\.html$/, ''));
assert.equal(routes.length, 12, 'register every new served route in the price/route validator and browser contract');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(servingRoot, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(servingRoot + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' }).end(body);
  } catch { response.writeHead(404).end('Not found'); }
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const baseURL = `http://127.0.0.1:${server.address().port}`;
const receipts = [], failures = [];

/** Serialized into the browser. All probes target real visible main content.
 * Two animation frames after both mutation and restoration avoid stale CSSOM
 * samples. The width probes additionally require the rendered box to change.
 */
async function inspectPage({ probe = false } = {}) {
  await document.fonts.ready;
  const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await settle();
  const root = document.documentElement, main = document.querySelector('main');
  const visible = element => {
    const closed = element.closest('details:not([open])');
    if (closed && !element.closest('summary')) return false; // Open states are checked after real clicks.
    const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && !element.closest('svg,math,[aria-hidden="true"]');
  };
  const name = element => element.tagName.toLowerCase() + (element.id ? '#' + element.id : '.' + [...element.classList].join('.'));
  const textViolations = [], textRoles = [];
  for (const element of main.querySelectorAll('h1,h2,h3,h4,h5,p,li,small,td,th,button,label,a,span,strong,b,dt,dd,blockquote')) {
    if (!visible(element) || !element.textContent.trim()) continue;
    const style = getComputedStyle(element), size = parseFloat(style.fontSize), leading = parseFloat(style.lineHeight) / size;
    if (size < 12.99 || ![1.15, 1.3, 1.4, 1.65, 1.75].some(value => Math.abs(value - leading) < .02) || ![400,500,600,700].includes(Number(style.fontWeight))) {
      textViolations.push({ element: name(element), size, leading, weight: style.fontWeight });
    }
    textRoles.push({ element: name(element), size, leading, weight: style.fontWeight });
  }
  const visibleTexts = [], times = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const element = walker.currentNode.parentElement;
    if (element && visible(element) && !element.closest('script,style,pre,code,kbd,samp,svg,math') && walker.currentNode.textContent.trim()) visibleTexts.push(walker.currentNode.textContent);
  }
  for (const element of main.querySelectorAll('time[datetime]')) if (visible(element)) times.push({ iso: element.dateTime, text: element.textContent.trim() });
  const offscreen = [];
  for (const element of main.querySelectorAll('p,h1,h2,h3,h4,h5,button,blockquote')) {
    if (!visible(element)) continue;
    let ancestor = element, scrollRegion = false;
    while (ancestor && ancestor !== main) {
      if (/^(auto|scroll)$/.test(getComputedStyle(ancestor).overflowX)) scrollRegion = true;
      ancestor = ancestor.parentElement;
    }
    if (scrollRegion) continue;
    const rect = element.getBoundingClientRect();
    if (rect.left < -2 || rect.right > root.clientWidth + 2 || element.scrollWidth > element.clientWidth + 2) offscreen.push({ element: name(element), left: rect.left, right: rect.right, scrollWidth: element.scrollWidth, width: element.clientWidth });
  }
  const baseline = { overflow: root.scrollWidth - root.clientWidth, rootOverflowX: getComputedStyle(root).overflowX, textViolations, offscreen, textRoles, visibleTexts, times };
  if (!probe) return baseline;
  const probes = {}, restoreErrors = [];
  async function change(token, value, measure) {
    const previous = root.style.getPropertyValue(token), priority = root.style.getPropertyPriority(token), before = measure();
    root.style.setProperty(token, value);
    let after;
    try { await settle(); after = measure(); }
    finally { if (previous) root.style.setProperty(token, previous, priority); else root.style.removeProperty(token); await settle(); }
    const restored = measure();
    if (JSON.stringify(before) !== JSON.stringify(restored)) restoreErrors.push({ token, before, restored });
    return { token, before, after, restored };
  }
  const rules = [];
  function collect(list) {
    for (const rule of list) {
      if (rule instanceof CSSMediaRule && !matchMedia(rule.conditionText).matches) continue;
      if (rule instanceof CSSSupportsRule && !CSS.supports(rule.conditionText)) continue;
      if (rule instanceof CSSStyleRule) rules.push(rule);
      if ('cssRules' in rule) collect(rule.cssRules);
    }
  }
  for (const sheet of document.styleSheets) collect(sheet.cssRules);
  async function winning(element, property, prefix, value) {
    const ancestors = [];
    for (let current = element; current; current = current.parentElement) ancestors.push(current);
    const tokens = new Set();
    for (const current of ancestors) {
      const declarations = [current.style, ...rules.filter(rule => { try { return current.matches(rule.selectorText); } catch { return false; } }).reverse().map(rule => rule.style)];
      for (const style of declarations) for (const match of style.getPropertyValue(property).matchAll(/var\((--[\w-]+)\)/g)) if (match[1].startsWith(prefix)) tokens.add(match[1]);
    }
    for (const token of tokens) {
      const result = await change(token, value, () => getComputedStyle(element).getPropertyValue(property));
      if (result.before !== result.after) return { element: name(element), property, ...result };
    }
    return null;
  }
  const h1 = main.querySelector('.hero h1'), h2 = [...main.querySelectorAll('h2')].find(visible);
  const prose = [...main.querySelectorAll('p')].find(element => visible(element) && !element.closest('.hero')) || [...main.querySelectorAll('p')].find(visible);
  probes.font = await change('--font-body', 'monospace', () => [h1, prose].map(element => getComputedStyle(element).fontFamily));
  probes.heroSize = await winning(h1, 'font-size', '--text-', '47px');
  probes.heroLeading = await winning(h1, 'line-height', '--leading-', '2.05');
  probes.heroWeight = await winning(h1, 'font-weight', '--weight-', '500');
  probes.proseSize = await winning(prose, 'font-size', '--text-', '19px');
  probes.proseLeading = await winning(prose, 'line-height', '--leading-', '2.125');
  probes.sectionSize = h2 ? await winning(h2, 'font-size', '--text-', '29px') : null;
  const panel = [...main.querySelectorAll('.panel,.card,.detail,.game,.actual-route')].find(visible);
  probes.panel = panel ? await change('--space-panel', '37px', () => getComputedStyle(panel).paddingLeft) : null;
  const section = main.querySelector(':scope > section:not(.hero)');
  probes.section = section ? await change('--space-section', '73px', () => getComputedStyle(section).marginBottom) : null;
  probes.gutter = await change('--page-gutter', '23px', () => getComputedStyle(main).paddingLeft);
  const widthToken = document.body.dataset.pageRole === 'tool' ? '--width-tool' : '--width-content';
  probes.shellWidth = await change(widthToken, '320px', () => main.getBoundingClientRect().width);
  const reading = [...main.querySelectorAll('p')].find(element => visible(element) && element.getBoundingClientRect().width > 160);
  probes.readingWidth = reading ? await change('--width-reading', '120px', () => reading.getBoundingClientRect().width) : null;
  const gapCandidates = [...main.querySelectorAll('*')].filter(element => visible(element) && parseFloat(getComputedStyle(element).gap) > 0).slice(0, 8);
  probes.gap = null;
  for (const element of gapCandidates) {
    probes.gap = await winning(element, 'gap', '--space-', '31px');
    if (probes.gap) break;
  }
  return { ...baseline, probes, restoreErrors };
}

function accept(receipt, label, probe = false) {
  assert.ok(receipt.overflow <= 2, label + ' document overflow: ' + receipt.overflow);
  assert.ok(!/hidden|clip/.test(receipt.rootOverflowX), label + ' overflow must remain observable');
  assert.deepEqual(receipt.textViolations, [], label + ' type/leading/weight roles');
  assert.deepEqual(receipt.offscreen, [], label + ' visible text geometry');
  for (const text of receipt.visibleTexts) assert.equal(formatCalendarText(text, 'zh'), text, label + ' displayed date');
  for (const time of receipt.times) assert.equal(formatCalendarDate(time.iso, 'zh'), time.text, label + ' time value/display agreement');
  if (!probe) return;
  assert.deepEqual(receipt.restoreErrors, [], label + ' probes restore original values');
  for (const role of ['heroSize','heroLeading','heroWeight','proseSize','proseLeading','sectionSize','panel','section','gutter','shellWidth','readingWidth','gap']) {
    assert.ok(receipt.probes[role], label + ' real main consumer: ' + role);
    assert.notDeepEqual(receipt.probes[role].before, receipt.probes[role].after, label + ' winning consumer: ' + role);
  }
  assert.deepEqual(receipt.probes.font.after, ['monospace','monospace'], label + ' actual heading/prose font owner');
  assert.ok(receipt.probes.shellWidth.after < receipt.probes.shellWidth.before - 1, label + ' real shell width');
  assert.ok(receipt.probes.readingWidth.after < receipt.probes.readingWidth.before - 1, label + ' real reading width');
}

async function openDetails(page) {
  for (let index = 0; index < await page.locator('details').count(); index++) {
    const details = page.locator('details').nth(index);
    if (await details.isVisible() && !await details.evaluate(element => element.open)) await details.locator(':scope > summary').click();
  }
}
async function interactions(page, route, record) {
  const capture = async state => {
    const receipt = await page.evaluate(inspectPage, { probe: false });
    accept(receipt, route + ' ' + state);
    record.states.push({ state, ...receipt });
  };
  await openDetails(page);
  await capture('expanded-disclosures');
  if (route === '/osprey/') {
    for (const choice of ['daily','hike','travel','trek']) {
      await page.locator(`[data-choice="${choice}"]`).click();
      await capture('use-case-' + choice);
    }
  } else if (route === '/osprey/hong-kong/') {
    assert.equal(await page.locator('.shop').count(), 8);
    for (const [region,count] of [['island',3],['kowloon',5],['all',8]]) {
      await page.locator('button[data-region="'+region+'"]').click();
      assert.equal(await page.locator('.shop:visible').count(), count);
      await capture('dealer-region-'+region);
    }
    await page.locator('button[data-station="油麻地"]').click();
    assert.equal(await page.locator('.shop:visible').count(), 2);
    await capture('dealer-station');
  } else if (route === '/osprey/series/') {
    const families = await page.locator('[data-family]').evaluateAll(elements => elements.map(element => element.dataset.family));
    assert.equal(families.length, 18);
    for (const family of families) {
      await page.locator(`[data-family="${family}"]`).click();
      assert.equal(await page.locator('#family-detail .product').count(), 2);
      await capture('catalog-' + family);
    }
    await page.locator('#series-search').fill('no-such-series-standards-fixture');
    assert.equal(await page.locator('[data-family]').count(), 0);
    await capture('empty-search');
    await page.locator('#series-search').fill('');
  } else if (route === '/iphone/') {
    for (const active of ['A','B']) for (const care of ['later','today']) {
      await page.locator(`[data-route="${active}"]`).click();
      await page.locator('#tf2-care-when').selectOption(care);
      await capture('trade-route-' + active + '-' + care);
    }
    for (const channel of ['store','online']) {
      await page.locator('#chill-channel').selectOption(channel);
      await capture('payment-' + channel);
    }
  } else if (route === '/iphone/trade-in-guide/') {
    for (const route of ['pass','lower','repair','mail','reject']) {
      await page.locator('#reset-game').click();
      await page.locator(`[data-key="route"][data-value="${route}"]`).click();
      await openDetails(page);
      await capture('dialogue-' + route);
    }
    await page.locator('#reset-game').click();
    await page.locator('[data-key="route"][data-value="pass"]').click();
    await page.locator('[data-radio="storePay"][value="offset"]').check();
    await page.locator('[data-radio="shopBuy"][value="yes"]').check();
    await capture('dialogue-purchase-result');
    await page.locator('#reset-game').click();
    await page.locator('[data-key="route"][data-value="mail"]').click();
    await page.locator('[data-radio="mailRefund"][value="cash"]').check();
    await page.locator('[data-key="courier"][data-value="dropoff"]').click();
    await page.locator('[data-key="returnAllowed"][data-value="yes"]').click();
    await page.locator('[data-radio="mailBuy"][value="yes"]').check();
    await capture('dialogue-mail-result');
  } else if (route === '/mac/macbook-pro/') {
    for (const size of ['14','16']) {
      await page.locator(`[data-size="${size}"]`).click();
      for (const selector of ['#chipA','#chipB']) {
        const values = await page.locator(selector + ' option').evaluateAll(elements => elements.map(element => element.value));
        await page.locator(selector).selectOption(values.at(-1));
      }
      await capture('macbook-' + size);
    }
  } else if (route === '/mac/mac-mini/') {
    await page.locator('#m6mem').selectOption('170');
    for (const selector of ['#a','#b']) {
      const values = await page.locator(selector + ' option').evaluateAll(elements => elements.map(element => element.value));
      await page.locator(selector).selectOption(values.at(-1));
    }
    await capture('mini-alternate-comparison');
  }
}

try {
  for (const engine of ['chromium','webkit']) {
    const browser = await playwright[engine].launch();
    try {
      for (const width of [1440,440]) for (const colorScheme of ['light','dark']) {
        const context = await browser.newContext({ viewport: { width, height: width === 440 ? 956 : 1000 }, deviceScaleFactor: width === 440 ? 3 : 1, isMobile: width === 440, hasTouch: width === 440, colorScheme, reducedMotion: 'reduce' });
        await context.route('**/*', request => request.request().url().startsWith(baseURL + '/') ? request.continue() : request.abort());
        try {
          for (const route of routes) {
            const page = await context.newPage(), errors = [];
            page.setDefaultTimeout(10_000);
            page.on('pageerror', error => errors.push(error.message));
            const label = `${engine}-${width}-${colorScheme}-${route === '/' ? 'home' : route.replaceAll('/','_')}`;
            const record = { route, engine, width, colorScheme, sha, states: [] };
            try {
              const response = await page.goto(baseURL + route, { waitUntil: 'networkidle' });
              assert.equal(response.status(), 200, label + ' HTTP');
              if (route === '/osprey/series/') await page.waitForSelector('[data-family]');
              if (route === '/iphone/trade-in-guide/') await page.waitForSelector('[data-key="route"]');
              record.initial = await page.evaluate(inspectPage, { probe: true });
              accept(record.initial, label, true);
              await page.screenshot({ path: join(output, label + '.png'), fullPage: true, scale: 'css', animations: 'disabled' });
              await interactions(page, route, record);
              await page.screenshot({ path: join(output, label + '-expanded.png'), fullPage: true, scale: 'css', animations: 'disabled' });
              assert.deepEqual(errors, [], label + ' runtime errors');
              console.log('PASS ' + label);
            } catch (error) {
              failures.push({ label, reason: error.stack || String(error) });
              console.error("FAIL " + label + ": " + error.message);
              await page.screenshot({ path: join(output, label + '-failed.png'), fullPage: true, scale: 'css', animations: 'disabled' }).catch(() => {});
            } finally { receipts.push(record); await page.close(); }
          }
          // Negative: an attached owner and correct chrome cannot hide a main
          // paragraph whose independent CSS wins. Use the same acceptance.
          const fixture = await context.newPage();
          await fixture.goto(baseURL);
          await fixture.setContent('<link rel="stylesheet" href="/assets/site.css"><style>main p{font-size:17px!important;line-height:1.61!important;max-width:70ch!important}.bad{padding:19px!important}</style><main class="wrap"><section class="hero"><h1>标题</h1><p>正文坏例必须失败</p></section><section class="card bad"><h2>内容</h2><p>这段正文没有引用共享规范。</p><div style="display:flex;gap:var(--space-5)"><span>一</span><span>二</span></div></section></main>');
          const bad = await fixture.evaluate(inspectPage, { probe: true });
          assert.throws(() => accept(bad, 'intentional-unconnected-main', true));
          assert.equal(bad.probes.proseSize, null, 'bad main typography must not borrow a header witness');
          assert.equal(bad.probes.readingWidth.after, bad.probes.readingWidth.before, 'bad main width is detected');
          await fixture.close();
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ sha, routes, viewports: ['1440x1000','440x956@3x'], engines: ['chromium','webkit'], receipts, failures }, null, 2) + '\n');
  await new Promise(resolve => server.close(resolve));
}
assert.deepEqual(failures, [], 'Every actual route, theme, viewport and interaction must pass');
console.log(`PASS: ${receipts.length} route/theme/viewport/engine renders plus interactive states and negative fixtures at ${sha}`);
