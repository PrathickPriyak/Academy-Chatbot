import { chromium } from "playwright-core";
import fs from "fs";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const out = "/opt/cursor/artifacts/visual-review";
fs.mkdirSync(out, { recursive: true });

const pages = [
  ["home", "/"],
  ["courses", "/courses"],
  ["course-detail", "/courses/adobe-photoshop"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["chat", "/chat"],
];

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const [name, path] of pages) {
  for (const [vp, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      isMobile: vp === "mobile",
      hasTouch: vp === "mobile",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(400);
    // above-the-fold
    await page.screenshot({ path: `${out}/${name}-${vp}-fold.png`, fullPage: false });
    // full page for structure review
    await page.screenshot({ path: `${out}/${name}-${vp}-full.png`, fullPage: true });
    await ctx.close();
    console.log("ok", name, vp);
  }
}

// open chat widget on home desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const fab = page.getByRole("button", { name: /Ask Infozub|Open chat/i });
  if (await fab.count()) {
    await fab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/home-desktop-chat-open.png`, fullPage: false });
  }
  await ctx.close();
}

// empty courses state
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/courses?q=zzzznonexistent`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${out}/courses-desktop-empty.png`, fullPage: false });
  await ctx.close();
}

// mobile menu open
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Open menu/i }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/home-mobile-menu.png`, fullPage: false });
  await ctx.close();
}

await browser.close();
console.log("done");
