# Infozub Digital Academy

Phase 1 foundation for Infozub Digital Academy.

## Stack

- Next.js 15 App Router, React, TypeScript
- Tailwind CSS 4 and Shadcn-style UI
- Framer Motion
- Prisma, configured for PostgreSQL

## Scripts

```bash
npm run dev
npm run lint
npm run format
npm run typecheck
npm run build
npm run db:validate
```

Copy `.env.example` to `.env` and set `DATABASE_URL` before connecting to Postgres.

## Production

Deploy the Next.js app to Vercel or another Node host. Use PostgreSQL with the pgvector extension and a database role that is not a superuser. Run `npx prisma migrate deploy`, then `npm run knowledge:index`.

Set these server-only variables: `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AI_PROVIDER`, `OLLAMA_URL`, and `OLLAMA_MODEL`. The AI provider talks to Ollama or another server configured through `AI_PROVIDER`. Only `NEXT_PUBLIC_CONTACT_URL` and `NEXT_PUBLIC_SITE_URL` are visible to the browser.

```bash
npm run build
npm run start
```
