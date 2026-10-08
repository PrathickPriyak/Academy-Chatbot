# Infozub Digital Academy Premium Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Infozub Digital Academy as a premium, modern, interactive EdTech marketing + discovery platform with a grounded course assistant, without losing published content or inventing facts.

**Architecture:** Next.js 15 App Router marketing site over a Prisma/Postgres catalog; public pages read course data for discovery; an on-site assistant answers only from indexed knowledge and redirects unknowns to Contact; enrollment continues via existing academy/LMS URLs.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Prisma + PostgreSQL (+ pgvector for RAG), Zod, optional Ollama (or compatible) embeddings/LLM server-side only.

## Global Constraints

- Source of truth for facts: live `academy.infozub.com` + `docs/content-archive/infozub-catalog.json` (and foundation branch). Never invent prices, modules, testimonials, or contact details.
- Do not copy Coursera/Udemy branding or exact UI; borrow IA/UX patterns only.
- Secrets stay server-side; only `NEXT_PUBLIC_*` values are public.
- LMS auth/enrollment remains on `courses.infozub.com` / existing enrollment URLs in phase 1–2.
- Preserve content archives under `docs/content-archive/` even when refactoring.
- Wait for explicit phase approval before large UI implementation batches (this document is planning only until the user says proceed).

---

## File map (target)

| Path | Responsibility |
|------|----------------|
| `docs/content-archive/*` | Frozen content snapshots (catalog, logo) |
| `prisma/schema.prisma` + migrations | Courses, knowledge, analytics |
| `prisma/seed.ts` + `prisma/infozub-catalog.json` | Seed from archive (no invented rows) |
| `src/data/` or `content/` | Typed static copy (audiences, testimonials, legal summaries) validated against live site |
| `src/components/ui/*` | Button, Card, Badge, Input, Sheet |
| `src/components/site/*` | Header, Footer, Logo, MobileNav |
| `src/components/courses/*` | CourseCard, CourseGrid, CategoryChips, CourseSearch, CourseDetail |
| `src/components/marketing/*` | Hero, Audiences, Highlights, Testimonials, RefundBand, FounderStory |
| `src/components/assistant/*` | AssistantWidget, ChatPanel |
| `src/lib/courses/*` | Queries, presenters, validation |
| `src/lib/knowledge/*` | Chunk, embed, retrieve, answer, fallback → contact |
| `src/app/(marketing)/page.tsx` | Home |
| `src/app/(marketing)/courses/page.tsx` | Catalog |
| `src/app/(marketing)/courses/[slug]/page.tsx` | Course detail |
| `src/app/(marketing)/about/page.tsx` | About |
| `src/app/(marketing)/contact/page.tsx` | Contact |
| `src/app/(marketing)/{privacy,terms,refund}/page.tsx` | Legal |
| `src/app/chat/page.tsx` | Full assistant |
| `src/app/api/chat/route.ts` | Chat API |
| `src/app/admin/*` | Optional later: catalog/knowledge admin |

---

## Pages

1. **Home** — brand-forward hero, search, categories, featured courses, audiences, highlights, founder, refund, testimonials, CTA, floating assistant.  
2. **Courses** — searchable/filterable catalog (Coursera/Udemy-like discovery).  
3. **Course detail** — modules, outcomes, instructor, price/duration as published, enroll CTA, ask-assistant CTA.  
4. **About** — academy + INFOZUB story, milestones, certifications (from live About).  
5. **Contact** — email/phone/offices + message form (mailto or future form backend).  
6. **Chat** — full-page assistant.  
7. **Privacy / Terms / Refund** — port published policy text (no paraphrasing that changes meaning).  
8. **Admin** (phase later) — restore from foundation when needed.

---

## Components

### Reusable UI
- Button, Input, Textarea, Badge, Card, Container, Section, Skeleton, EmptyState, Dialog/Sheet.

### Marketing
- `MarketingHero`, `AudienceGrid`, `HighlightRow`, `TestimonialCarousel`, `RefundAssurance`, `FounderBlock`, `FinalCta`.

### Courses
- `CourseCard`, `CourseGrid`, `CategoryFilter`, `CatalogSearch`, `ModuleList`, `PriceLabel` (shows published price or “See course page”).

### Assistant
- `AssistantFab`, `AssistantPanel`, `SourceList` (optional), fallback banner linking `/contact?from=assistant`.

### Site
- Sticky header with Courses / About / Chat / Contact; footer with legal + offices + social.

---

## Data structure

```
Category { name, slug, description }
Instructor { name, title, bio, avatarUrl? }
Course {
  slug, title, shortDescription, description, thumbnail,
  level, duration, price, currency, enrollmentUrl, published,
  categoryId, instructorId
}
Module { title, description, position, courseId }
Lesson? { title, summary, duration, position }  // optional; only if published
Faq / Feature / Resource  // only when sourced
KnowledgeChunk { text, embedding, courseId?, customKnowledgeId? }
Conversation / Message / AnalyticsEvent
```

**Static content files** (not DB): audiences, highlights, testimonials, office addresses, social links — copied from live site audit.

---

## Animation system

- Library: Framer Motion.  
- Principles: 2–3 intentional motions per major surface (hero entrance, card stagger on view, assistant open/close).  
- Respect `prefers-reduced-motion`.  
- No decorative noise, no glow-heavy “AI purple” aesthetic.

---

## Responsive strategy

- Mobile-first.  
- Home: single composition hero (brand, one headline, one sentence, one CTA group, one visual plane).  
- Catalog: 1 → 2 → 3 column cards.  
- Filters: horizontal scroll chips on mobile.  
- Assistant: FAB → bottom sheet on mobile; docked panel on desktop; `/chat` full page for deep sessions.  
- Touch targets ≥ 44px; sticky CTAs on course detail.

---

## Chatbot architecture

```
User question
  → normalize + rate limit
  → direct-answer table for common catalog Qs (fast path)
  → else embed → retrieve KnowledgeChunks (pgvector)
  → if reliableScore < threshold → polite fallback + /contact
  → else grounded generation with citations to published chunks only
```

- Provider: server-only (`AI_PROVIDER`, Ollama or future hosted).  
- Never answer off-catalog facts.  
- Log analytics events (question, fallback, course mentioned).  
- Widget on marketing pages; full page at `/chat`.

---

## Course architecture

- Marketing catalog in Postgres (seeded from archive + verified vs live).  
- Enrollment deep-links to existing `enrollmentUrl` (academy course pages / LMS).  
- Detail pages generated from DB; if a field is unknown, omit or link out — do not guess.  
- Categories power chips and filters.  
- Optional later: sync job from WordPress; not required for MVP rebuild.

---

## Search architecture

1. **Catalog search (client + server):** title, short description, category, instructor (ILIKE / trigram or simple filter).  
2. **Assistant search:** semantic retrieval over chunks.  
3. **Unified UX:** home search bar — if looks like navigation/filter query, filter catalog; if question-like, route to `/chat?q=`.  
4. Future: Algolia/Meilisearch only if catalog grows past local search comfort.

---

## Future backend / database requirements

| Need | Recommendation |
|------|----------------|
| Catalog + RAG | Postgres + pgvector (restore foundation schema) |
| Hosting | Vercel (or similar) for Next app |
| AI | Ollama in private network or hosted embeddings/LLM with server keys |
| Forms | Start mailto; later Resend/Form backend + CRM |
| Auth | Admin cookie auth only initially; learner auth stays on LMS |
| Media | Next/Image remote patterns for academy CDN; later Blob/R2 |
| Analytics | Keep lightweight first-party events; optional Plausible later |
| CMS | Optional Sanity/WordPress headless sync after MVP |

---

## Phased delivery

### Phase 0 — Content restore (no visual redesign yet)
- [ ] Copy `docs/content-archive/infozub-catalog.json` → `prisma/infozub-catalog.json`
- [ ] Restore logo to `public/`
- [ ] Restore Prisma schema/migrations from foundation (or equivalent minimal schema)
- [ ] Add static content modules for audiences, testimonials, contact, legal (sourced text)
- [ ] Commit: “Restore preserved Infozub content for rebuild”

### Phase 1 — Design system + chrome
- [ ] Define CSS variables (unique Infozub direction; avoid Coursera purple / cream-terracotta clichés)
- [ ] Implement UI primitives + SiteHeader/Footer
- [ ] Wire fonts (expressive, non-default stack)
- [ ] Smoke: blank layout with nav only

### Phase 2 — Catalog foundation
- [ ] Seed DB / fallback JSON reader for local/demo without DB
- [ ] `/courses` with cards, categories, search
- [ ] `/courses/[slug]` detail with modules + enroll CTA
- [ ] Verify every course against archive + live URL

### Phase 3 — Marketing home + about + legal
- [ ] Home sections matching live content order (premium composition)
- [ ] About page from live About facts
- [ ] Privacy, Terms, Refund pages from published policies
- [ ] Contact page with offices + form

### Phase 4 — Assistant
- [ ] Restore knowledge pipeline (chunk → embed → answer)
- [ ] Widget + `/chat` + contact fallback
- [ ] Direct answers for common questions
- [ ] Rate limiting + analytics events

### Phase 5 — Polish + deploy
- [ ] Motion pass + reduced-motion
- [ ] Lighthouse/accessibility pass
- [ ] Production env: `DATABASE_URL`, admin secrets, AI provider, `NEXT_PUBLIC_SITE_URL`
- [ ] Migrate/seed/index on hosted Postgres
- [ ] Deploy production alias; verify against content checklist

---

## Content checklist (must pass before launch)

- [ ] All 11 courses listed with correct titles/slugs  
- [ ] Prices only when published (else “See course page”)  
- [ ] Enrollment URLs open live academy pages  
- [ ] Testimonials attributed correctly  
- [ ] Refund: 7 days + ≤20% rule as published  
- [ ] Contact email/phone/offices correct  
- [ ] Legal pages present  
- [ ] Assistant refuses off-catalog questions via Contact  

---

## Explicit non-goals (until requested)

- Replacing `courses.infozub.com` LMS player  
- Taking payments inside this Next app  
- Student accounts / progress tracking  
- Cloning Coursera certificates marketplace  
- Inventing new courses or reviews  

---

## Open decisions for the next phase (user input)

1. Visual direction: cool tech-teal brand evolution vs warmer education palette (must stay unique).  
2. Domain strategy: replace WordPress on `academy.infozub.com` vs parallel deploy first.  
3. AI hosting for production (Ollama endpoint vs cloud provider).  
4. Whether admin CMS is in MVP or later.  

---

## Immediate next step after approval

Begin **Phase 0 — Content restore** only, then pause for review before Phase 1 UI work.
