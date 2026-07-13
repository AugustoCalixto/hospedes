# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml ./
# ignore-scripts: hospedagem tem postinstall "prisma generate" antes do schema existir
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

ARG NEXT_PUBLIC_DEMO_MODE=true
ARG AUTH_URL=https://hospedagem.natcore.com.br

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE
ENV AUTH_URL=$AUTH_URL
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospedagem

RUN pnpm rebuild && pnpm run db:generate
RUN pnpm build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache wget openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY docker/demo-entrypoint.sh ./demo-entrypoint.sh

RUN chmod +x ./demo-entrypoint.sh \
  && mkdir -p public/uploads \
  && chown -R nextjs:nodejs /app

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=90s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["./demo-entrypoint.sh"]
