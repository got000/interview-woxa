FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/broker-web/package.json ./apps/broker-web/package.json

RUN pnpm install

COPY apps/broker-web ./apps/broker-web

WORKDIR /app/apps/broker-web

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]