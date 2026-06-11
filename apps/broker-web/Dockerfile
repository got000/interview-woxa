FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# ---- Install dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/broker-web/package.json ./apps/broker-web/package.json
RUN --mount=type=cache,id=pnpm-web,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# ---- Build ----
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app ./
COPY apps/broker-web ./apps/broker-web
WORKDIR /app/apps/broker-web
RUN pnpm build

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app/apps/broker-web
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/apps/broker-web/.next/standalone /app/
COPY --from=builder --chown=nextjs:nodejs /app/apps/broker-web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/broker-web/public ./public

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "PORT=${NEXT_PORT:-3000} node server.js"]
