FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# ---- Install dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/broker-api/package.json ./apps/broker-api/package.json
RUN --mount=type=cache,id=pnpm-api,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# ---- Build ----
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app ./
COPY apps/broker-api ./apps/broker-api
RUN pnpm --filter=broker-api build

# ---- Prune to a standalone, production-only package ----
FROM builder AS pruner
RUN pnpm --filter=broker-api deploy --prod --legacy /app/deploy

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nestjs -u 1001 -G nodejs

COPY --from=pruner --chown=nestjs:nodejs /app/deploy/node_modules ./node_modules
COPY --from=pruner --chown=nestjs:nodejs /app/deploy/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/broker-api/dist ./dist

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]
