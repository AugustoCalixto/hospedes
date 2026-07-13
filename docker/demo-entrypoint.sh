#!/bin/sh
set -e

echo "[hospedagem-demo] Running migrations…"
pnpm exec prisma migrate deploy

echo "[hospedagem-demo] Seeding (idempotent)…"
pnpm db:seed || echo "[hospedagem-demo] Seed skipped or already applied"

echo "[hospedagem-demo] Starting Next.js…"
exec node server.js
