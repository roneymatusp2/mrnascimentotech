import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Use an existing Playwright installation without adding production dependencies.
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/check-browser.mjs
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(path.resolve(modulePath)).href : 'playwright');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const outputDir = process.env.QA_OUTPUT_DIR || '/tmp/mrnascimento-qa';
const siteRoot = path.resolve(import.meta.dirname, '..');
const publications = JSON.parse(await fs.readFile(path.join(siteRoot, 'content/publications.json'), 'utf8'));
const press = publications.filter(item => item.kind === 'article');
const routes = process.env.QA_ROUTES?.split(',') || ['/', '/writing', '/speaking', '/books', '/about', '/sobre', '/research', '/platforms', '/contact', '/about.html', '/speaking.html'];
const layouts = [{ name: 'desktop', viewport: { width: 1440, height: 1000 } }, { name: 'mobile', viewport: { width: 390, height: 844 } }];
const report = { baseURL, startedAt: new Date().toISOString(), checks: [], localLinks: [], failures: [] };
const localURLs = new Set();
await fs.mkdir(outputDir, { recursive: true });

function check(condition, message, routeReport) {
  if (!condition) {
    routeReport.failures.push(message);
    report.failures.push(`${routeReport.layout} ${routeReport.route}: ${message}`);
  }
}

const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
try {
  for (const layout of layouts) {
    const context = await browser.newContext({ viewport: layout.viewport, reducedMotion: 'reduce' });
    for (const route of routes) {
      const page = await context.newPage();
      const item = { layout: layout.name, route, pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], failures: [] };
      report.checks.push(item);
      page.on('pageerror', error => item.pageErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') item.consoleErrors.push(message.text()); });
      page.on('requestfailed', request => item.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) item.httpErrors.push({ url: response.url(), status: response.status() }); });
      try {
        const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'networkidle', timeout: 30000 });
        item.status = response?.status();
        check(response?.ok(), `HTTP ${response?.status()}`, item);
        await page.locator('h1').first().waitFor({ state: 'visible', timeout: 10000 });
        await page.evaluate(async () => {
          await document.fonts.ready;
          // Trigger reveal animations and lazy images before inspecting the whole page.
          for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
            window.scrollTo(0, y);
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(250);
        item.title = await page.title();
        item.h1 = await page.locator('h1').first().innerText();
        const body = await page.locator('body').innerText();
        check(!/Global Digital Citizenship|Bloomsbury/i.test(body), 'Confidential future publication details remain visible', item);
        check(!/\b(?:NaN|undefined)\b/.test(body), 'Invalid data is visible', item);

        item.layoutMetrics = await page.evaluate(() => ({
          viewport: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          overflowElements: [...document.querySelectorAll('body *')].filter(element => {
            const box = element.getBoundingClientRect();
            return box.width > 0 && (box.right > innerWidth + 2 || box.left < -2) && getComputedStyle(element).position !== 'fixed';
          }).slice(0, 12).map(element => ({ tag: element.tagName, className: element.className?.baseVal ?? element.className, text: element.textContent?.trim().slice(0, 100) }))
        }));
        check(item.layoutMetrics.documentWidth <= item.layoutMetrics.viewport + 2, `Horizontal overflow: ${item.layoutMetrics.documentWidth}px / ${item.layoutMetrics.viewport}px`, item);

        item.futureLabels = await page.locator('body').evaluate(bodyElement => [...bodyElement.querySelectorAll('*')]
          .filter(element => /^(upcoming|coming soon|em breve|forthcoming)$/i.test(element.textContent.trim()))
          .filter(element => ![...element.children].some(child => /^(upcoming|coming soon|em breve|forthcoming)$/i.test(child.textContent.trim())))
          .map(element => ({ label: element.textContent.trim(), context: element.parentElement?.parentElement?.textContent.trim().slice(0, 650) })));
        if (route === '/speaking') {
          const calendar = await page.locator('#calendar').innerText();
          check(!/\bUpcoming\b|\bEm breve\b/i.test(calendar), 'A past calendar event is still marked upcoming', item);
          check(/ICAILY/.test(calendar) && /Online/i.test(calendar), 'ICAILY online participation missing', item);
          check(/four|4|quatro/i.test(body) && /São Luís/.test(body), 'Four teacher training sessions missing', item);
        }
        if (route === '/books') {
          check(/Livraria da Vila/.test(body) && /9 October 2026/.test(body), 'Completed book launch missing', item);
        }
        if (route === '/about') {
          check(/18 original articles/.test(body), 'Updated article count missing', item);
          check(/Four AI training sessions/.test(body), 'Completed training sessions missing', item);
          check(/Online keynote, ICAILY 2026/.test(body), 'ICAILY online participation missing', item);
        }
        if (route === '/sobre') {
          check(/18 artigos originais/.test(body), 'Updated article count missing', item);
          check(/Quatro formações/.test(body), 'Completed training sessions missing', item);
          check(/9 de outubro/.test(body) && /Livraria da Vila/.test(body), 'Completed book launch missing', item);
        }
        if (route === '/writing') {
          check(press.length === 18, `Source has ${press.length} original articles, expected 18`, item);
          const pressButton = page.getByRole('group', { name: 'Filter by kind' }).getByRole('button', { name: /^Press/ });
          item.pressButton = await pressButton.innerText();
          check(/18/.test(item.pressButton), 'Press filter count is not 18', item);
          await pressButton.click();
          await page.waitForTimeout(200);
          item.pressStatus = await page.getByRole('status').innerText();
          check(/^18(?: of \d+)? items$/i.test(item.pressStatus.trim()), `Unexpected Press result count: ${item.pressStatus}`, item);
          const hrefs = new Set(await page.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => anchor.href)));
          item.pressLinks = [];
          for (const article of press) {
            for (const link of article.links || []) {
              const visible = hrefs.has(link.href);
              item.pressLinks.push({ title: article.title, label: link.label, href: link.href, rendered: visible });
              check(visible, `Article/version link missing: ${link.label} — ${article.title}`, item);
            }
          }
          // A multilingual article must remain discoverable under each of its languages.
          const multilingual = press.filter(article => (article.languages?.length || 0) > 1 || article.language.includes('/'));
          const languageFilters = page.getByRole('group', { name: 'Filter by language' });
          for (const language of ['English', 'Portuguese', 'Spanish']) {
            const button = languageFilters.getByRole('button', { name: language });
            await button.click();
            await page.waitForTimeout(150);
            for (const article of multilingual) {
              check(await page.getByText(article.title, { exact: true }).count() > 0, `${article.title} missing under ${language} filter`, item);
            }
            await button.click();
            await page.waitForTimeout(150);
          }
        }

        const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => ({ text: anchor.textContent.trim().slice(0, 90), href: anchor.href })));
        item.linkCount = links.length;
        for (const link of links) {
          check(!/^(?:javascript:|undefined$)/i.test(link.href), `Invalid link: ${link.text}`, item);
          const url = new URL(link.href, baseURL);
          if (url.origin === new URL(baseURL).origin) {
            url.hash = '';
            localURLs.add(url.href);
          }
        }
        item.screenshot = path.join(outputDir, `${layout.name}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}.png`);
        await page.screenshot({ path: item.screenshot, fullPage: true, animations: 'disabled' });
        check(item.pageErrors.length === 0, `Browser exceptions: ${item.pageErrors.join('; ')}`, item);
        check(item.consoleErrors.length === 0, `Console errors: ${item.consoleErrors.join('; ')}`, item);
        const localFailures = item.failedRequests.filter(request => request.url.startsWith(baseURL));
        check(localFailures.length === 0, `Failed local requests: ${JSON.stringify(localFailures)}`, item);
        const localHTTPErrors = item.httpErrors.filter(response => response.url.startsWith(baseURL));
        check(localHTTPErrors.length === 0, `Local HTTP errors: ${JSON.stringify(localHTTPErrors)}`, item);
        console.log(`${layout.name} ${route}: ${item.failures.length ? `FAIL (${item.failures.length})` : 'PASS'}`);
      } catch (error) {
        check(false, error.message, item);
        console.log(`${layout.name} ${route}: ERROR ${error.message}`);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
  const context = await browser.newContext();
  for (const url of localURLs) {
    const response = await context.request.get(url);
    const result = { url, status: response.status(), ok: response.ok() };
    report.localLinks.push(result);
    if (!result.ok) report.failures.push(`Local link returns ${result.status}: ${url}`);
  }
  await context.close();
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  await fs.writeFile(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
}

console.log(`${report.checks.length} route/viewport checks; ${report.localLinks.length} local links; ${report.failures.length} failures.`);
console.log(`Report and screenshots: ${outputDir}`);
if (report.failures.length) {
  console.error(report.failures.join('\n'));
  process.exitCode = 1;
}
