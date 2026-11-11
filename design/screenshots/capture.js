// Captures the prototype. Run from the repository root with the pre-installed Playwright; no network needed.
//   node design/screenshots/capture.js            the committed set (about a dozen PNGs, scale factor 2)
//   node design/screenshots/capture.js review DIR  every screen at 375 px light and dark and 1280 px light,
//                                                  scale factor 1, into DIR (for review; do not commit)
const { chromium } = require('playwright');
const path = require('path');
const file = 'file://' + path.resolve(__dirname, '../prototype/index.html');
// name, route, query, full page
const screens = [
  ['landing', 'landing', '', true],
  ['signup-invite', 'invite', '', true],
  ['signup-google', 'signin', '', true],
  ['signup-choices', 'onboard', '', true],
  ['signup-gmail', 'gmail', '', true],
  ['signup-scan', 'scan', 'scan=100', true],
  ['signup-full', 'full', '', true],
  ['overview', 'overview', '', true],
  ['overview-categories', 'overview', 'sec=2&cat=dining', true],
  ['overview-calendar', 'overview', 'sec=3', true],
  ['overview-months', 'overview', 'sec=5', true],
  ['overview-edit', 'overview', 'edit=1', true],
  ['overview-travel-tab', 'overview', 'dash=1', true],
  ['overview-chart-settings', 'overview', 'edit=1&sheet=chart', false],
  ['overview-review-on-the-1st', 'overview', 'sheet=story&card=1', false],
  ['overview-zh-eur', 'overview', 'lang=zh&cur=EUR', true],
  ['overview-cny-hidden', 'overview', 'cur=CNY&sec=7', true],
  ['overview-empty', 'overview', 'empty=1', true],
  ['insights', 'insights', '', true],
  ['transactions', 'transactions', '', false],
  ['transaction-edit', 'transactions', 'sheet=tx', false],
  ['import-statements', 'import', 'stage=1', true],
  ['import-gmail', 'import', 'tab=gmail', true],
  ['recurring', 'recurring', '', true],
  ['ask', 'ask', 'ask=japan', true],
  ['ask-allowance-used', 'ask', 'ask=japan&ai=0', true],
  ['review', 'review', 'card=1', false],
  ['settings', 'settings', '', true],
];
// the committed set: name, width, theme
const committed = [
  ['overview', 1280, 'light'], ['overview', 1280, 'dark'], ['overview', 375, 'light'], ['overview-categories', 375, 'dark'],
  ['overview-edit', 1280, 'light'], ['overview-edit', 375, 'light'], ['landing', 1280, 'light'], ['signup-gmail', 375, 'light'],
  ['insights', 375, 'dark'], ['transaction-edit', 375, 'light'], ['import-gmail', 1280, 'light'], ['import-statements', 375, 'light'],
  ['ask', 375, 'light'], ['review', 375, 'dark'], ['overview-zh-eur', 375, 'light'],
];
(async () => {
  const review = process.argv[2] === 'review', out = review ? path.resolve(process.argv[3]) : __dirname;
  const jobs = review
    ? screens.flatMap(s => [[s[0], 375, 'light'], [s[0], 375, 'dark'], [s[0], 1280, 'light']])
    : committed;
  const browser = await chromium.launch();
  for (const [name, w, theme] of jobs) {
    const [, route, q, full] = screens.find(s => s[0] === name);
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 760 : 860 }, deviceScaleFactor: review ? 1 : 2, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.log('PAGE ERROR', name, w, theme, e.message));
    page.on('console', m => m.type() === 'error' && console.log('CONSOLE', name, w, theme, m.text()));
    await page.goto(`${file}?theme=${theme}${q ? '&' + q : ''}#/${route}`);
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.log('OVERFLOW', name, w, theme, overflow + 'px');
    if (full && w < 600) await page.addStyleTag({ content: '.tabbar{position:static!important}.page{padding-bottom:24px!important}' });
    await page.screenshot({ path: path.join(out, `${name}-${w}-${theme}.png`), fullPage: full });
    await ctx.close();
  }
  await browser.close();
})();
