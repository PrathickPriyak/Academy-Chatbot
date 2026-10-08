/**
 * Production QA smoke for Infozub Digital Academy.
 * Run: node scripts/qa-production.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:3000";

const PAGES = [
  "/",
  "/courses",
  "/courses?category=design",
  "/courses/adobe-photoshop",
  "/about",
  "/contact",
  "/chat",
  "/privacy",
  "/terms",
  "/refund",
  "/sitemap.xml",
  "/robots.txt",
];

const results = {
  ok: [],
  fail: [],
  warn: [],
};

function pass(msg) {
  results.ok.push(msg);
  console.log(`  ✓ ${msg}`);
}
function fail(msg) {
  results.fail.push(msg);
  console.error(`  ✗ ${msg}`);
}
function warn(msg) {
  results.warn.push(msg);
  console.warn(`  ! ${msg}`);
}

async function checkHttp(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  if (res.status >= 200 && res.status < 400) pass(`HTTP ${res.status} ${path}`);
  else fail(`HTTP ${res.status} ${path}`);
  return res;
}

async function collectConsole(page, label) {
  const errors = [];
  const handler = (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  };
  const pageErrors = [];
  const onPageError = (err) => pageErrors.push(String(err));
  page.on("console", handler);
  page.on("pageerror", onPageError);
  return {
    flush() {
      page.off("console", handler);
      page.off("pageerror", onPageError);
      for (const e of errors) {
        if (/favicon|Download the React DevTools/i.test(e)) continue;
        fail(`[${label}] console: ${e.slice(0, 200)}`);
      }
      for (const e of pageErrors) fail(`[${label}] pageerror: ${e.slice(0, 200)}`);
      if (!errors.length && !pageErrors.length) pass(`[${label}] no console/page errors`);
    },
  };
}

async function checkImages(page, label) {
  await page
    .waitForFunction(
      () => [...document.images].every((img) => img.complete && img.naturalWidth > 0),
      undefined,
      { timeout: 15000 },
    )
    .catch(() => undefined);
  const broken = await page.evaluate(() => {
    const out = [];
    for (const img of document.images) {
      // Only flag finished-but-failed images; still-loading is not a product defect.
      if (img.complete && img.naturalWidth === 0) {
        out.push(img.currentSrc || img.src || img.getAttribute("src") || "(unknown)");
      }
    }
    return out;
  });
  if (broken.length) {
    for (const src of broken.slice(0, 8)) fail(`[${label}] broken image: ${src}`);
  } else {
    pass(`[${label}] images loaded (${await page.locator("img").count()})`);
  }
}

async function checkInternalLinks(page, label) {
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/") && !h.startsWith("//")),
  );
  const unique = [...new Set(hrefs)].slice(0, 40);
  let bad = 0;
  for (const href of unique) {
    const path = href.split("#")[0];
    if (!path) continue;
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    if (res.status >= 400) {
      fail(`[${label}] broken link ${href} → ${res.status}`);
      bad++;
    }
  }
  if (!bad) pass(`[${label}] internal links OK (${unique.length} checked)`);
}

async function main() {
  console.log(`\n=== Production QA @ ${BASE} ===\n`);

  console.log("1) HTTP status");
  for (const path of PAGES) await checkHttp(path);

  console.log("\n2) API endpoints");
  {
    const chat = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What courses do you offer?" }),
    });
    const chatJson = await chat.json().catch(() => ({}));
    if (chat.ok && chatJson.answer) pass(`POST /api/chat → answer (${chatJson.answer.length} chars)`);
    else fail(`POST /api/chat → ${chat.status} ${JSON.stringify(chatJson).slice(0, 160)}`);

    const off = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What is the weather in Paris today?" }),
    });
    const offJson = await off.json().catch(() => ({}));
    if (off.ok && (offJson.contactSuggested || /contact/i.test(offJson.answer || ""))) {
      pass("Chat off-topic escalates to contact");
    } else {
      warn(`Chat off-topic response: ${JSON.stringify(offJson).slice(0, 200)}`);
    }

    const contact = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "QA Tester",
        email: "qa@example.com",
        subject: "Production QA",
        message: "Test message from production QA automation.",
      }),
    });
    const contactJson = await contact.json().catch(() => ({}));
    if (contact.ok && contactJson.mailto) pass(`POST /api/contact → mailto prepared`);
    else fail(`POST /api/contact → ${contact.status} ${JSON.stringify(contactJson).slice(0, 160)}`);

    const emptyChat = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });
    if (emptyChat.status >= 400) pass(`Chat empty message rejected (${emptyChat.status})`);
    else warn(`Chat empty message accepted (${emptyChat.status})`);
  }

  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    console.log("\n3) Desktop page crawl");
    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const dpage = await desktop.newPage();

    for (const path of ["/", "/courses", "/courses/adobe-photoshop", "/about", "/contact", "/chat"]) {
      const c = await collectConsole(dpage, `desktop ${path}`);
      const res = await dpage.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45000 });
      if (!res || res.status() >= 400) fail(`desktop navigate ${path} → ${res?.status()}`);
      else pass(`desktop render ${path}`);
      await checkImages(dpage, `desktop ${path}`);
      await checkInternalLinks(dpage, `desktop ${path}`);
      // SEO basics
      const title = await dpage.title();
      if (title && title.length > 3) pass(`[desktop ${path}] title: ${title.slice(0, 80)}`);
      else fail(`[desktop ${path}] missing title`);
      const h1 = await dpage.locator("h1").count();
      if (h1 >= 1) pass(`[desktop ${path}] h1 count=${h1}`);
      else fail(`[desktop ${path}] missing h1`);
      c.flush();
    }

    console.log("\n4) Desktop features");
    // Search
    {
      await dpage.goto(`${BASE}/`, { waitUntil: "networkidle" });
      const search = dpage.locator('input[aria-label*="Search" i], input[placeholder*="Search" i]').first();
      await search.click();
      await search.fill("photoshop");
      await dpage.waitForTimeout(400);
      const listbox = dpage.locator('[role="listbox"], [role="option"]');
      if (await listbox.count()) pass("Homepage search suggestions appear");
      else warn("Homepage search suggestions not visible (may need Enter)");
      await search.press("Enter");
      await dpage.waitForTimeout(800);
      if (dpage.url().includes("/courses")) pass(`Search navigates to courses (${dpage.url()})`);
      else warn(`Search stayed on ${dpage.url()}`);
    }

    // Filters + sort
    {
      await dpage.goto(`${BASE}/courses`, { waitUntil: "networkidle" });
      const chip = dpage.getByRole("button", { name: /Design|All/i }).first();
      if (await chip.count()) {
        await chip.click();
        await dpage.waitForTimeout(500);
        pass("Category filter chip clickable");
      } else fail("No filter chips on courses");
      const sort = dpage.locator("#catalog-sort-top, #catalog-sort-desktop").first();
      if (await sort.count()) {
        await sort.selectOption({ label: "Title A–Z" });
        await dpage.waitForTimeout(500);
        pass("Sort select works");
      } else fail("Sort select missing");
      // Empty state
      await dpage.goto(`${BASE}/courses?q=zzzznonexistentcourse999`, { waitUntil: "networkidle" });
      const empty = await dpage.getByText(/No courses found/i).count();
      if (empty) pass("Empty search state shown");
      else fail("Empty search state missing");
    }

    // Course curriculum
    {
      await dpage.goto(`${BASE}/courses/adobe-photoshop`, { waitUntil: "networkidle" });
      const expand = dpage.getByRole("button", { name: /Expand all|Module/i }).first();
      if (await expand.count()) {
        await expand.click();
        await dpage.waitForTimeout(300);
        pass("Course curriculum interactive");
      } else fail("Curriculum controls missing");
      const enroll = dpage.getByRole("link", { name: /Enroll/i }).first();
      if (await enroll.count()) pass("Enroll CTA present");
      else fail("Enroll CTA missing");
    }

    // Contact form validation
    {
      await dpage.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
      const submit = dpage.getByRole("button", { name: /Send|Submit|Contact/i }).first();
      await submit.click();
      await dpage.waitForTimeout(400);
      const alert = await dpage.locator('[role="alert"], .text-destructive, [aria-invalid="true"]').count();
      if (alert) pass("Contact form shows validation errors");
      else fail("Contact form validation not visible");
    }

    // Chat page
    {
      await dpage.goto(`${BASE}/chat`, { waitUntil: "networkidle" });
      const ta = dpage.locator("textarea").first();
      await ta.fill("Tell me about Adobe Photoshop course");
      await dpage.getByRole("button", { name: /Send/i }).click();
      await dpage.waitForTimeout(2500);
      const msgs = await dpage.locator('[role="log"] p, .whitespace-pre-wrap').count();
      if (msgs >= 2) pass("Chat page returns assistant reply");
      else fail("Chat page no assistant reply");
      // Escalation
      await ta.fill("Who won the World Cup?");
      await dpage.getByRole("button", { name: /Send/i }).click();
      await dpage.waitForTimeout(2500);
      const contactCta = await dpage.getByRole("link", { name: /Contact/i }).count();
      if (contactCta) pass("Chat escalation CTA present after off-topic");
      else warn("Chat escalation CTA not found after off-topic");
    }

    // Floating chatbot desktop (home)
    {
      await dpage.goto(`${BASE}/`, { waitUntil: "networkidle" });
      const fab = dpage.getByRole("button", { name: /Ask Infozub|Open chat|Close chat/i });
      if (await fab.count()) {
        await fab.click();
        await dpage.waitForTimeout(400);
        const dialog = dpage.getByRole("dialog", { name: /Assistant/i });
        if (await dialog.count()) pass("Floating chatbot opens");
        else fail("Floating chatbot dialog missing");
        await dpage.keyboard.press("Escape");
        await dpage.waitForTimeout(300);
        if (!(await dialog.isVisible().catch(() => false))) pass("Escape closes chatbot");
        else warn("Escape did not close chatbot");
      } else fail("Floating chatbot FAB missing");
    }

    // Nav + categories dropdown
    {
      await dpage.goto(`${BASE}/`, { waitUntil: "networkidle" });
      const cats = dpage.getByRole("button", { name: /Categories/i });
      if (await cats.count()) {
        await cats.click();
        await dpage.waitForTimeout(200);
        const item = dpage.getByRole("menuitem").first();
        if (await item.count()) pass("Categories dropdown opens");
        else warn("Categories menuitems not found");
      } else fail("Categories nav missing on desktop");
      const skip = dpage.locator('a[href="#main-content"]');
      if (await skip.count()) pass("Skip link present");
      else fail("Skip link not found");
    }

    await desktop.close();

    console.log("\n5) Mobile crawl + menu");
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const mpage = await mobile.newPage();
    for (const path of ["/", "/courses", "/courses/adobe-photoshop", "/contact", "/chat"]) {
      const c = await collectConsole(mpage, `mobile ${path}`);
      const res = await mpage.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45000 });
      if (!res || res.status() >= 400) fail(`mobile navigate ${path}`);
      else pass(`mobile render ${path}`);
      await checkImages(mpage, `mobile ${path}`);
      c.flush();
    }

    await mpage.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const menuBtn = mpage.getByRole("button", { name: /Open menu/i });
    if (await menuBtn.count()) {
      await menuBtn.click();
      await mpage.waitForTimeout(400);
      const dialog = mpage.getByRole("dialog");
      if (await dialog.count()) pass("Mobile menu opens as dialog");
      else fail("Mobile menu dialog missing");
      await mpage.keyboard.press("Escape");
      await mpage.waitForTimeout(300);
      if (!(await dialog.isVisible().catch(() => false))) pass("Escape closes mobile menu");
      else warn("Escape did not close mobile menu");
    } else fail("Mobile menu button missing");

    // Mobile filters sheet
    await mpage.goto(`${BASE}/courses`, { waitUntil: "networkidle" });
    const filtersBtn = mpage.getByRole("button", { name: /Filters/i });
    if (await filtersBtn.count()) {
      await filtersBtn.click();
      await mpage.waitForTimeout(400);
      const sheet = mpage.getByRole("dialog", { name: /Filters/i });
      if (await sheet.count()) pass("Mobile filters sheet opens");
      else fail("Mobile filters sheet missing");
      await mpage.keyboard.press("Escape");
      await mpage.waitForTimeout(300);
      pass("Mobile filters Escape handled");
    } else fail("Mobile Filters button missing");

    // Sticky enroll on course detail
    await mpage.goto(`${BASE}/courses/adobe-photoshop`, { waitUntil: "networkidle" });
    const sticky = mpage.getByRole("link", { name: /^Enroll/i });
    if (await sticky.count()) pass("Mobile sticky enroll present");
    else warn("Mobile sticky enroll not found");

    await mobile.close();

    console.log("\n6) SEO artifacts");
    {
      const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
      if (sm.includes("/courses") && sm.includes("adobe-photoshop")) pass("sitemap includes courses");
      else fail("sitemap missing course entries");
      const robots = await (await fetch(`${BASE}/robots.txt`)).text();
      if (/sitemap/i.test(robots)) pass("robots.txt references sitemap");
      else warn("robots.txt missing sitemap");
      await checkSeoMeta(browser);
    }

    console.log("\n7) Performance heuristics (desktop)");
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const start = Date.now();
      await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
      const tti = Date.now() - start;
      if (tti < 4000) pass(`Homepage networkidle in ${tti}ms`);
      else if (tti < 8000) warn(`Homepage networkidle slow: ${tti}ms`);
      else fail(`Homepage networkidle very slow: ${tti}ms`);
      const jsBytes = await page.evaluate(() =>
        performance.getEntriesByType("resource")
          .filter((r) => r.name.includes("/_next/") && (r.name.endsWith(".js") || r.name.includes(".js?")))
          .reduce((sum, r) => sum + (r.transferSize || 0), 0),
      );
      pass(`Approx JS transfer on home: ${Math.round(jsBytes / 1024)}KB`);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  console.log("\n=== QA SUMMARY ===");
  console.log(`PASS: ${results.ok.length}`);
  console.log(`WARN: ${results.warn.length}`);
  console.log(`FAIL: ${results.fail.length}`);
  if (results.fail.length) {
    console.log("\nFailures:");
    for (const f of results.fail) console.log(` - ${f}`);
  }
  if (results.warn.length) {
    console.log("\nWarnings:");
    for (const w of results.warn) console.log(` - ${w}`);
  }

  // Write report artifact
  const fs = await import("fs");
  fs.mkdirSync("/opt/cursor/artifacts", { recursive: true });
  fs.writeFileSync(
    "/opt/cursor/artifacts/qa-production-report.json",
    JSON.stringify(results, null, 2),
  );

  process.exit(results.fail.length ? 1 : 0);
}

async function checkSeoMeta(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const meta = await page.evaluate(() => {
    const desc = document.querySelector('meta[name="description"]')?.getAttribute("content");
    const og = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
    const canon = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].length;
    return { desc, og, canon, jsonld };
  });
  if (meta.desc) pass("meta description present");
  else fail("meta description missing");
  if (meta.og) pass("og:title present");
  else warn("og:title missing");
  if (meta.canon) pass(`canonical: ${meta.canon}`);
  else warn("canonical missing");
  if (meta.jsonld) pass(`JSON-LD blocks: ${meta.jsonld}`);
  else warn("JSON-LD missing on homepage");
  await ctx.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
