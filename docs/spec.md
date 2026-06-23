# Spec: Site Pousada e Locações — MVP

## Assumptions

1. **Idioma:** conteúdo e interface em português (Brasil)
2. **Reservas:** fluxo de *solicitação* — hóspede envia pedido; admin confirma manualmente (sem pagamento online no MVP)
3. **Notificações:** e-mail (Resend ou SMTP) + link WhatsApp com mensagem pré-preenchida; painel admin como canal principal
4. **Avaliações:** cadastro manual no admin (sem integração Google/Airbnb/Booking no MVP)
5. **Autenticação admin:** login por e-mail/senha (Auth.js v5), single-tenant (um proprietário)
6. **Imagens:** upload local em dev; produção via Vercel Blob ou S3
7. **Mapas:** Google Maps embed (iframe) com coordenadas aproximadas por imóvel
8. **Hospedagem:** Vercel (frontend/API) + PostgreSQL gerenciado (Neon ou Supabase Postgres)
9. **Fora do MVP:** blog, cupons, pacotes promocionais, integrações OTA, pagamento online

## Objective

Site institucional responsivo para divulgar chalés, casa e quarto em 2 cidades, com calendário de disponibilidade por imóvel e solicitação de reservas. Admin simples para o proprietário gerenciar imóveis, calendário, reservas e conteúdo estático.

**Usuários:**
- **Visitante:** navega, filtra imóveis, consulta disponibilidade, solicita reserva, contata via WhatsApp/formulário
- **Administrador:** gerencia imóveis, preços, fotos, bloqueios de calendário, reservas e textos das páginas

**Success criteria (MVP):**
- Visitante consegue filtrar imóveis por cidade, tipo, hóspedes e faixa de preço
- Calendário exibe datas indisponíveis (reservas confirmadas + bloqueios manuais)
- Solicitação de reserva gera registro no admin + e-mail para admin
- Admin confirma/cancela reserva e calendário reflete mudança
- Páginas públicas carregam em mobile com LCP aceitável (< 3s em 4G)
- Sitemap.xml e schema.org `LodgingBusiness` / `Accommodation` gerados
- Formulários protegidos contra spam (honeypot + rate limit)

## Tech Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| ORM / DB | Prisma 6 + PostgreSQL |
| Auth | Auth.js (NextAuth v5) — credentials provider |
| Validação | Zod |
| E-mail | Resend (ou nodemailer + SMTP) |
| Upload | `@vercel/blob` ou S3 presigned URLs |
| Testes | Vitest (unit) + Playwright (e2e críticos) |
| SEO | `next/metadata`, sitemap route, JSON-LD |

## Commands

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Boundaries

**Always:** Validar inputs com Zod, HTTPS em produção, slugs únicos, timestamps em models Prisma

**Ask first:** Mudanças no schema em produção, pagamento/OTA, regra de bloqueio por reserva solicitada

**Never:** Commitar secrets, expor admin sem auth, hardcodar credenciais

## Fora de Escopo (fase 2+)

Ver [roadmap.md](./roadmap.md)
