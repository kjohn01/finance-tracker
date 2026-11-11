// Captures the prototype screens. Run from the repository root: node design/screenshots/capture.js [filter]
// Uses the pre-installed Playwright; no network access is needed.
const { chromium } = require('playwright');
const path = require('path');
const file = 'file://' + path.resolve(__dirname, '../prototype/index.html');
const out = __dirname;
const shots = [
  // name, route, query, full page
  ['landing', 'landing', '', true],
  ['signup-1-invite', 'invite', '', true],
  ['signup-4-gmail', 'gmail', '', true],
  ['signup-5-scan', 'scan', 'scan=100', true],
  ['overview', 'overview', '', true],
  ['insights', 'insights', '', true],
  ['transactions', 'transactions', '', false],
  ['transaction-edit', 'transactions', 'sheet=tx', false],
  ['import-statements', 'import', 'stage=1', true],
  ['import-gmail', 'import', 'tab=gmail', true],
  ['recurring', 'recurring', '', true],
  ['dashboard-edit', 'dashboards', 'edit=1', true],
  ['chart-config', 'dashboards', 'edit=1&sheet=chart', false],
  ['ask', 'ask', 'ask=japan', true],
  ['ask-allowance-used', 'ask', 'ask=japan&ai=0', false],
  ['review', 'review', 'card=1', false],
  ['settings', 'settings', '', true],
  ['empty-overview', 'overview', 'empty=1', true],
  ['overview-zh-jpy', 'overview', 'lang=zh&cur=JPY', true],
  ['overview-amounts-hidden', 'overview', 'priv=1', false],
];
const variants = [
  ['375-light', 375, 760, 'light'], ['375-dark', 375, 760, 'dark'],
  ['1280-light', 1280, 860, 'light'], ['1280-dark', 1280, 860, 'dark'],
];
(async () => {
  const filter = process.argv[2], vfilter = process.argv[3];
  const browser = await chromium.launch();
  for (const [vn, w, h, theme] of variants) {
    if (vfilter && !vn.includes(vfilter)) continue;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log('PAGE ERROR', vn, e.message));
    page.on('console', m => m.type() === 'error' && console.log('CONSOLE', vn, m.text()));
    for (const [name, route, q, full] of shots) {
      if (filter && filter !== 'all' && !name.includes(filter)) continue;
      await page.goto(`${file}?theme=${theme}${q ? '&' + q : ''}#/${route}`);
      await page.waitForTimeout(250);
      if (full && w < 600) await page.addStyleTag({ content: '.tabbar{position:static!important}.page{padding-bottom:24px!important}' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) console.log('OVERFLOW', vn, name, overflow + 'px');
      await page.screenshot({ path: path.join(out, `${name}-${vn}.png`), fullPage: full });
    }
    await ctx.close();
  }
  await browser.close();
})();
