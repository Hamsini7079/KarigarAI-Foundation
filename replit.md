# KarigarAI

KarigarAI is a mobile-first business manager that helps Indian artisans prepare their work for buyer discovery.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — preconfigured PostgreSQL connection string
- Copy `.env.example` when configuring external Supabase Auth/Storage and AI adapters

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, Wouter, Tailwind CSS, Lucide icons

## Where things live

- `artifacts/karigarai` — runnable web app and shared visual language
- `artifacts/api-server` — Express API routes and deterministic demo seed
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/api-client-react` — generated React Query client
- `lib/api-zod` — generated server validation schemas
- `lib/db/src/schema/karigarai.ts` — Phase 1 PostgreSQL schema

## Architecture decisions

- Phase 1 uses a real PostgreSQL-backed foundation with deterministic demo data; external AI capabilities are mock-ready.
- API contracts are OpenAPI-first; generated clients and Zod schemas are never hand-edited.
- The seeded artisan is fictional Savitri Devi, and the six demo products are clearly demonstration data.
- Supabase Auth/Storage names and environment variables are configuration-ready but are not silently replaced with local authentication.

## Product

- Public welcome and mission surfaces
- Deterministic demo entry for an artisan foundation dashboard
- Buyer marketplace foundation with search and category filtering
- Foundation status showing roles, supported languages, storage areas, and provider mode

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After editing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen`.
- Start/restart managed API and web workflows rather than root-level dev commands.
- Do not begin the photo/voice/catalog/pricing golden flow until Phase 2 is explicitly requested.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
