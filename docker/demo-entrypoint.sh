#!/bin/sh
set -e

echo "[hospedagem-demo] Running migrations…"
./node_modules/.bin/prisma migrate deploy

echo "[hospedagem-demo] Seeding (idempotent)…"
pnpm run db:seed || echo "[hospedagem-demo] Seed skipped or already applied"

echo "[hospedagem-demo] Starting Next.js…"
exec node server.js
