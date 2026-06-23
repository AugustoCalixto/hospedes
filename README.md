# Pousada & Locações

Site institucional com sistema de reservas para pousada e locações de temporada.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + Radix UI
- Prisma + PostgreSQL
- Auth.js (NextAuth v5)

## Setup

```bash
pnpm install
cp .env.example .env

# Start PostgreSQL
docker compose up -d

# Run migrations and seed
pnpm db:migrate
pnpm db:seed

# Dev server
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Prisma Studio |

## Admin

- URL: `/admin/login`
- Default credentials (from seed): `admin@example.com` / `changeme123`

## Deploy

1. Provision PostgreSQL (Neon, Supabase, etc.)
2. Set environment variables from `.env.example`
3. Run `pnpm prisma migrate deploy`
4. Deploy to Vercel

See [docs/spec.md](docs/spec.md) for full specification.
