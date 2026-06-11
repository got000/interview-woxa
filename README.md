# Interview WOXA

Monorepo project for the WOXA interview assignment.

## Tech Stack

### Frontend

- Next.js
- TypeScript
- TailwindCSS
- Axios
- React Hook Form
- Zod

### Backend

- NestJS
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Swagger

### Infrastructure

- PNPM Workspace
- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)
- Infisical
- Nginx
- Cloudflare
- Let's Encrypt SSL

---

# Project Structure

```text
.
├── apps
│   ├── broker-api
│   └── broker-web
├── docker-compose.yml
├── docker-compose.local.yml
├── package.json
├── pnpm-workspace.yaml
└── .github
    └── workflows
        └── deploy.yml
```

---

# Installation

## Install workspace dependencies

```bash
pnpm install
```

---

# Backend (Broker API)

## Install Dependencies

### Core Packages

```bash
pnpm --filter broker-api add \
@nestjs/config \
@nestjs/swagger \
swagger-ui-express \
@nestjs/mongoose \
mongoose \
class-validator \
class-transformer
```

### JWT Authentication

```bash
pnpm --filter broker-api add \
@nestjs/jwt \
@nestjs/passport \
passport \
passport-jwt
```

### Development Dependencies

```bash
pnpm --filter broker-api add -D \
@types/passport-jwt
```

## Generate NestJS Resources

```bash
cd apps/broker-api

nest g resource auth
nest g resource users
nest g resource brokers
```

## Run API

```bash
pnpm --filter broker-api start:dev
```

Swagger UI:

```text
http://localhost:3001/docs
```

---

# Frontend (Broker Web)

## Install Dependencies

```bash
pnpm --filter broker-web add \
axios \
zod \
react-hook-form \
@hookform/resolvers \
@tanstack/react-table \
clsx \
tailwind-merge
```

## Run Web

```bash
pnpm --filter broker-web dev
```

Open:

```text
http://localhost:3000
```

---

# Environment Variables

## API

Create file:

```text
apps/broker-api/.env
```

Example:

```env
API_PORT=3001
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
```

## Web

Create file:

```text
apps/broker-web/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

# Docker (Local Development)

## Build and Start

```bash
docker compose -f docker-compose.local.yml up --build
```

Run in background:

```bash
docker compose -f docker-compose.local.yml up -d --build
```

## Stop Containers

```bash
docker compose -f docker-compose.local.yml down
```

## Rebuild Without Cache

```bash
docker compose -f docker-compose.local.yml build --no-cache
docker compose -f docker-compose.local.yml up -d
```

## View Logs

All services:

```bash
docker compose -f docker-compose.local.yml logs -f
```

API:

```bash
docker compose -f docker-compose.local.yml logs -f api
```

Web:

```bash
docker compose -f docker-compose.local.yml logs -f web
```

## Check Running Containers

```bash
docker ps
```

---

# Git Workflow

This project follows a feature branch workflow.

## Branch Strategy

| Branch      | Purpose               |
| ----------- | --------------------- |
| `feature/*` | Feature development   |
| `develop`   | Integration / Testing |
| `main`      | Production            |

## Development Flow

```text
feature/*
     │
     ├── Pull Request
     ▼
develop
     │
     ├── Pull Request
     ▼
main
     │
     └── GitHub Actions → Production Deploy
```

## Example Workflow

Update local branch:

```bash
git checkout develop
git pull origin develop
```

Create feature branch:

```bash
git checkout -b feature/auth-api
```

After development:

```bash
git add .
git commit -m "feat: implement auth api"
git push origin feature/auth-api
```

Create Pull Request:

```text
feature/auth-api → develop
```

After QA or review, create another Pull Request:

```text
develop → main
```

Once the code is merged into `main`, GitHub Actions will automatically deploy the latest version to the production server.

---

# Production Deployment

Deployment is fully automated through GitHub Actions.

Pipeline flow:

```text
Push / Merge → main
        │
        ▼
GitHub Actions
        │
        ├── Build Docker Images
        ├── Push Images to GHCR
        ├── Export Secrets from Infisical
        ├── Copy docker-compose.yml and .env.prod to VPS
        └── SSH → docker compose pull && docker compose up -d
        │
        ▼
Production Server
```

---

# Infrastructure

## Production URLs

| Service | URL                                       |
| ------- | ----------------------------------------- |
| Web     | https://chaiwat-interview.online          |
| API     | https://api.chaiwat-interview.online      |
| Swagger | https://api.chaiwat-interview.online/docs |

---

# Useful Commands

## Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```

## Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

## Check Running Containers

```bash
docker ps
```

## API Logs

```bash
docker logs -f broker-api
```

## Web Logs

```bash
docker logs -f broker-web
```

## Restart Services

```bash
docker compose down
docker compose up -d
```

## Pull Latest Images

```bash
docker compose pull
docker compose up -d
```

## Remove Unused Docker Images

```bash
docker image prune -a -f
```

---

# Development Workflow Summary

## Local Development

```text
Code
  ↓
pnpm --filter broker-api start:dev
pnpm --filter broker-web dev
  ↓
Test
```

## Docker Local

```text
Code
  ↓
docker compose -f docker-compose.local.yml up --build
  ↓
Test in containerized environment
```

## Production

```text
feature/*
   ↓
Pull Request
   ↓
develop
   ↓
Pull Request
   ↓
main
   ↓
GitHub Actions
   ↓
Automatic Deployment
   ↓
Production Server
```
