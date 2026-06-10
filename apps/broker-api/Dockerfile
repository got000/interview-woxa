FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/broker-api/package.json ./apps/broker-api/package.json

RUN pnpm install

COPY apps/broker-api ./apps/broker-api

WORKDIR /app/apps/broker-api

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/main.js"]