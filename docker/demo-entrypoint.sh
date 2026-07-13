#!/bin/sh
set -e

echo "[hospedagem-demo] Running migrations…"
./node_modules/.bin/prisma migrate deploy

echo "[hospedagem-demo] Seeding (idempotent)…"
# Evita Corepack baixar pnpm incompatível com Node 20
if [ -x ./node_modules/.bin/tsx ]; then
  ./node_modules/.bin/tsx prisma/seed.ts || echo "[hospedagem-demo] Seed skipped or failed (continuing)"
elif [ -x ./node_modules/.bin/prisma ]; then
  ./node_modules/.bin/prisma db seed || echo "[hospedagem-demo] Seed skipped or failed (continuing)"
else
  echo "[hospedagem-demo] Seed tools missing (continuing)"
fi

echo "[hospedagem-demo] Starting Next.js…"
exec node server.js
