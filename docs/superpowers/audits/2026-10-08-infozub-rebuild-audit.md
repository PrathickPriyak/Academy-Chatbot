# Infozub Digital Academy — Rebuild Audit

**Date:** 2026-10-08  
**Live marketing site:** https://academy.infozub.com/  
**LMS / learning platform:** https://courses.infozub.com/  
**Reference UX (patterns only, not branding):** Coursera, Udemy  
**Repo status at audit:** branch `cursor/clean-slate-8580` is a blank Next.js shell; prior product code and data remain recoverable from `origin/cursor/phase-1-foundation-8580` and are archived under `docs/content-archive/`.

---

## 0. Critical content-preservation note

A prior cleanup wiped application code from the working tree. **Content is not lost:**

| Source | Status |
|--------|--------|
| Live WordPress site `academy.infozub.com` | Intact — source of truth for public facts |
| LMS `courses.infozub.com` | Intact — learner login / course access |
| Git branch `cursor/phase-1-foundation-8580` | Intact — full Next.js + Prisma + catalog |
| `docs/content-archive/infozub-catalog.json` | Restored snapshot of 11 courses + modules |
| `docs/content-archive/infozub-logo.jpg` | Restored Infozub wordmark |

**Rule for rebuild:** never invent prices, modules, durations, testimonials, or contact details. Prefer live site + archived catalog. If a fact is missing, leave it empty or link to the live page.

---

## 1. Existing project structure (current working tree)

```
src/app/
  globals.css      # minimal reset
  layout.tsx       # blank shell
  page.tsx         # "Ready for a new prompt."
  robots.ts
  sitemap.ts
public/.gitkeep
package.json       # next, react, react-dom + eslint/prettier/tailwind
```

No Prisma, no components, no APIs, no middleware on the clean-slate branch.

### Recoverable structure (foundation branch)

```
src/app/           # home, courses, chat, contact, admin, api
src/components/    # landing, courses, chat, assistant, site, ui, admin
src/lib/           # courses, knowledge/RAG, ai, analytics, admin, db
prisma/            # schema, migrations, seed, infozub-catalog.json
public/            # infozub-logo.jpg
scripts/           # reindex, knowledge/analytics tests, production audit
```

---

## 2. Existing pages

### Live WordPress (`academy.infozub.com`)

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Hero, course grid, audiences, highlights, about author, refund CTA, testimonials, final CTA |
| About | `/about/` | Company story, milestones, founder journey, certifications, stats |
| Courses index | `/course/` | All courses + demo-class CTA + refund + testimonials |
| Course detail (×11 Tamil tracks) | `/course/tamil/{slug}/` | Modules, outcomes, CTAs, join/enroll |
| Contact | `/contact/` | Email, phone, registered + corporate offices |
| Privacy | `/privacy/` | Policy (effective 17 June 2024) |
| Terms | `/terms/` | Terms for academy / buy / learn domains |
| Refund | `/refund/` | 7-day refund, ≤20% completion rule |

### Prior Next.js app (foundation branch)

| Route | Notes |
|-------|-------|
| `/` | Catalog-style home + assistant widget |
| `/courses` | Searchable/filterable course explorer |
| `/chat` | Full assistant workspace |
| `/contact` | Mailto form → `academy@infozub.com` |
| `/admin/*` | Cookie-auth admin (courses, knowledge) |
| `/api/chat` | RAG chat |
| `/api/analytics` | Event ingest |
| `/api/admin/knowledge/reindex` | Knowledge reindex |

**Gap vs live site:** no About, Privacy, Terms, Refund, or per-course detail routes (`/courses/[slug]`) in the prior Next app.

---

## 3. Existing components (foundation branch)

| Area | Components |
|------|------------|
| Site chrome | `SiteHeader`, `SiteFooter`, `BrandLogo` |
| Layout | `Container`, `Section` |
| UI primitives | `Button`, `Card`, `Badge`, `Input` |
| Landing | `HomePage`, `ChatPreview` |
| Courses | `CourseExplorer` |
| Chat | `ChatWorkspace`, `AssistantWidget` |
| Admin | course form, knowledge search/reindex, analytics charts |
| Providers | theme provider/toggle, loading screen |

---

## 4. Existing assets

| Asset | Location |
|-------|----------|
| Infozub wordmark | `public/infozub-logo.jpg` (archived to `docs/content-archive/`) |
| Favicon / app icon | `src/app/favicon.ico`, `src/app/icon.jpg` (recoverable from git) |
| Course thumbnails | Remote URLs on `academy.infozub.com` / WP uploads (referenced in catalog) |
| LMS logo | `https://courses.infozub.com/logo.png` |

Local image library is thin; most visuals live on WordPress. Rebuild should download/cache approved course imagery or use remote URLs with Next image config — without inventing creative assets.

---

## 5. Existing course information (preserved)

**11 published courses** (from archived catalog + live URLs):

1. Adobe Photoshop Master Course — ₹1,999 — 8 modules  
2. Adobe Premiere Pro Master Course — price on course page — 9 modules  
3. AI Website Builder Mastery — price on course page — 4 modules  
4. Business Success Formula — price on course page — 11 modules  
5. Canva Master Course — price on course page — 6 modules  
6. Google Ads Course — price on course page — 11 modules  
7. Interview Success Formula — price on course page — 17 modules  
8. Mobile App Video Editing Master Course — ₹999 — 10 modules  
9. SEO Master Course — 12 months access, 15+ hours — 6 modules  
10. Social Media Marketing Master Course — ₹999 — 12 modules  
11. WordPress Webdesign Master Course — ₹999 — 12 modules  

**Categories:** Design, Video, Web, Marketing, Business, Career  

**Instructor:** Logesh Kumar, Founder of INFOZUB  

**Delivery language emphasis:** Tamil (“in தமிழ்”) on course pages; self-paced / lifetime access common.

**Enrollment:** live pages + LMS (`courses.infozub.com`). Marketing site CTAs: “View Course”, “Join Course”, “Get Details”.

---

## 6. Existing images

- Brand wordmark (local JPG).  
- Course cards/heroes: WordPress media (e.g. `academy.infozub.com/wp-content/uploads/...`).  
- Social/OG imagery on LMS.  
- No local illustration system or photo library in the Next repo.

---

## 7. Existing content to preserve

Must carry forward (facts only, from live site / catalog):

- Tagline: “Quality Education for Everyone”  
- Six audiences (digital marketers, traditional marketers, students/freshers, business owners, freelancers, anyone)  
- Course highlights (updated strategies, certificate, hands-on, community, step-by-step, any device)  
- Founder story + agency stats (10+ years, 200+ projects, 170k+ leads, 47M+ ad impressions — as published)  
- Testimonials: Menaga, Vignesh, Sathish, Subash  
- 7-day refund promise (with published eligibility: ≤20% completion)  
- Privacy / Terms effective 17 June 2024  
- Contact: `academy@infozub.com`, `+91 93 22 33 88 22`  
- Offices: Palladam (registered), Tiruppur (corporate)  
- Social: Facebook, Instagram, X/Twitter, LinkedIn, YouTube  

---

## 8. Existing navigation

**Live site primary nav:** Home · About · Courses · Contact  

**Footer quick links:** About, Courses, Contact, Privacy, Terms, Refund  

**Social:** Facebook, X, Instagram (+ LinkedIn/YouTube on contact)  

**Prior Next nav:** Courses · Chat · Contact · Admin · Start Chatting  

Rebuild should keep marketing IA close to live site and add Chat as an Infozub differentiator without burying Courses/About/Contact.

---

## 9. Existing contact information

| Channel | Value |
|---------|--------|
| Email | academy@infozub.com |
| Phone | +91 93 22 33 88 22 |
| Registered office | INFOZUB Private Limited, 271 A3, Chinnaiyah Garden, Kosavampalayam Road, Palladam – 641664 |
| Corporate office | INFOZUB Private Limited, 2nd Floor, Alagendira Towers, Bungalow Stop, Tiruppur – 641602 |

---

## 10. Existing forms

| Form | Platform | Behavior |
|------|----------|----------|
| Contact | WordPress (live) | Sales support contact |
| Contact | Prior Next app | Client-side mailto to `academy@infozub.com` (name, email, message) |
| Enrollment / purchase | Live course pages + LMS | External to marketing rebuild |
| Admin login | Prior Next | Email/password cookie session |

No server-side lead CRM in the Next app yet.

---

## 11. Existing APIs (foundation branch)

| Endpoint | Role |
|----------|------|
| `POST /api/chat` | Knowledge-grounded assistant answers |
| `POST /api/analytics` | Chat/analytics events |
| `POST /api/admin/knowledge/reindex` | Rebuild embeddings (admin) |

External systems: Ollama (`OLLAMA_URL` / `OLLAMA_MODEL`), PostgreSQL + pgvector, enrollment URLs on `academy.infozub.com` / LMS.

---

## 12. Existing database / data sources

**Foundation Prisma models:** Category, Instructor, Course, Module, Lesson, Faq, CourseFeature, CourseResource, CustomKnowledge, KnowledgeChunk (vector), Conversation, ConversationMessage, AnalyticsEvent, KnowledgeIndexRun.

**Seed source:** `prisma/infozub-catalog.json` (now archived).

**Live CMS:** WordPress on `academy.infozub.com` (still canonical for published copy).

**LMS:** `courses.infozub.com` (OpenResty session login — separate product surface).

---

## 13. Existing dependencies

**Clean slate now:** Next 15.5, React 19, Tailwind 4, ESLint, Prettier, TypeScript.

**Foundation (to restore selectively):** Prisma 6, Framer Motion, next-themes, Radix slot, CVA, clsx, tailwind-merge, lucide-react, zod, tsx.

---

## 14. Existing authentication

| Surface | Auth |
|---------|------|
| Marketing site (WP) | None for browsing |
| LMS | Session login (`SESSIONID`) |
| Prior Next admin | HMAC-signed cookie (`infozub_admin`); middleware guards `/admin` + `/api/admin` |
| Prior Next chat | Public (rate-limited); not end-user accounts |

Learner accounts stay on LMS; rebuild should not replace LMS auth in phase 1.

---

## 15. Existing responsive behavior

- Live WP site: classic responsive theme; mobile “Select Page” nav pattern.  
- Prior Next app: Tailwind breakpoints (`sm`/`lg`/`xl`), flexible grids for course cards, sticky/floating assistant CTA.  
- Rebuild target: mobile-first marketing + discovery; course detail readable on small screens; chat usable as bottom sheet / full page.

---

## Live website major sections (home)

1. Brand + primary nav  
2. Hero (“Quality Education For Everyone”) + View All Courses  
3. Our Courses grid  
4. Passion / digital landscape copy  
5. Who should enroll (6 audiences)  
6. Course highlights  
7. About author / founder story + stats  
8. Refund assurance (7 days)  
9. Testimonials  
10. Ready to get started CTA  
11. Footer contact + legal + social  

---

## Coursera / Udemy pattern takeaways (do not copy branding)

| Pattern | Apply to Infozub as… |
|---------|----------------------|
| Strong discovery hero + search | Hero search that filters catalog / opens assistant |
| Category chips / topics | Design, Video, Web, Marketing, Business, Career |
| Dense but scannable course cards | Title, category, price/duration, instructor, CTA |
| Dedicated course detail | Modules, outcomes, instructor, refund, enroll |
| Social proof near CTAs | Existing testimonials + highlights |
| Persistent “learn more / enroll” CTA | Enroll + Ask assistant dual CTA |
| Trust/legal in footer | Privacy, Terms, Refund, offices |

Unique Infozub angles: Tamil-first digital skills, founder-led academy, agency-backed curriculum, on-site assistant grounded only in published facts, dual offices in Palladam / Tiruppur.

---

## Gaps to close in the rebuild

1. Restore preserved content into the clean-slate repo before UI work.  
2. Add course detail pages (`/courses/[slug]`).  
3. Add About + legal pages.  
4. Premium visual system (unique, not Coursera purple / Udemy clone).  
5. Search architecture spanning catalog + assistant.  
6. Production Postgres + seed + knowledge index for chat.  
7. Clear separation: marketing site vs LMS enrollment.  

---

## Audit conclusion

The live WordPress academy remains the content source of truth. The foundation Next.js branch proves a viable App Router + Prisma + RAG assistant stack. The current clean-slate branch is an empty shell. The rebuild should **restore data first**, then layer a premium EdTech UX inspired by Coursera/Udemy patterns while keeping Infozub’s voice, Tamil-course focus, and published facts intact.
