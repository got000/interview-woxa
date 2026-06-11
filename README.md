# Interview WOXA — Broker Directory

Monorepo project for the WOXA interview assignment: a broker directory web application with multi-language support (Thai / English), authentication, and an admin form for creating brokers.

```text
.
├── apps
│   ├── broker-api   # NestJS REST API
│   └── broker-web   # Next.js frontend (App Router)
├── docker-compose-local.yml
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

---

## Tech Stack

### Frontend (`apps/broker-web`)

- **Next.js 16** (App Router, Server Components, SSR)
- **TypeScript**
- **TailwindCSS 4**
- **NextAuth (Auth.js v5)** — session-based authentication (JWT in httpOnly cookies)
- **Axios** — API client (`lib/api.ts`)
- Custom i18n (`/us`, `/th` locales)

### Backend (`apps/broker-api`)

- **NestJS 11**
- **TypeScript**
- **MongoDB + Mongoose** (`@nestjs/mongoose`)
- **JWT Authentication** (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`)
- **class-validator / class-transformer** — DTO validation
- **Swagger** — API documentation
- **Rate limiting** (`@nestjs/throttler`) — global limit of 60 requests/min per IP, with stricter limits (5/min) on `/login`, `/register`, and `/auth/refresh-token` (10/min) to mitigate brute-force/spam

### Infrastructure

- **PNPM Workspace** (monorepo)
- **Docker / Docker Compose**
- **MongoDB 7** (containerized for local dev, MongoDB Atlas for production)

---

## Frontend Features

- **i18n** — full Thai (`/th`) / English (`/us`) translations via [`lib/i18n/translations.ts`](apps/broker-web/lib/i18n/translations.ts)
- **Authentication** — login / register backed by NextAuth credentials provider
- **Broker directory** — searchable, filterable, paginated broker list with detail pages
- **Broker submission form** — multi-section form with live slug-availability check and field validation
- **Toast notifications** — global toast system ([`lib/toast/toast-context.tsx`](apps/broker-web/lib/toast/toast-context.tsx) + [`components/toast-container.tsx`](apps/broker-web/components/toast-container.tsx)) surfaces success/error feedback for login, register, and broker submission
- **Loading / error / empty states** — route-level `loading.tsx` skeletons, `error.tsx` error boundaries with retry, `not-found.tsx` for missing brokers, and an empty-state message + CTA when no brokers match a search

---

## Database Setup

The database is **MongoDB**.

### Option A — Docker (recommended, no manual setup needed)

`docker-compose-local.yml` includes a `mongo` service (MongoDB 7) with a persistent volume. On the **first run** (empty volume), it automatically seeds the `broker_db.broker` collection with 20 sample brokers via [`apps/broker-api/docker/mongo-init/seed.js`](apps/broker-api/docker/mongo-init/seed.js).

No extra steps required — just run `docker compose up` (see [Run with Docker](#run-with-docker) below).

### Option B — Local / external MongoDB (e.g. MongoDB Atlas)

If you run the apps directly with `pnpm` (without Docker), point `MONGO_URL` in `apps/broker-api/.env` to your own MongoDB instance (local `mongod` or an Atlas connection string):

```env
MONGO_URL=mongodb://localhost:27017/broker_db
# or
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/broker_db?authSource=admin
```

The API connects via `MongooseModule.forRootAsync` ([`common/database/database.module.ts`](apps/broker-api/src/common/database/database.module.ts)) and collections/indexes are created automatically on first connection — no migrations needed. To populate sample data, run the seed script against your own database:

```bash
mongosh "<your MONGO_URL>" apps/broker-api/docker/mongo-init/seed.js
```

---

## Environment Variables

Copy the example files and adjust as needed:

```bash
cp apps/broker-api/.env.example apps/broker-api/.env
cp apps/broker-web/.env.example apps/broker-web/.env.local
```

### `apps/broker-api/.env`

| Variable | Description | Example |
| --- | --- | --- |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/broker_db` |
| `JWT_SECRET` | Secret used to sign access tokens | `change-me` |
| `JWT_EXPIRES_IN` | Access token TTL | `1d` |
| `JWT_EXPIRATION` | Access token TTL (ms) | `86400000` |
| `API_PORT` | Port the API listens on | `3001` |
| `APP_PREFIX` | Global route prefix | `api/v1` |
| `APP_NODE_ENV` | Environment name | `development` |
| `APP_FRONTEND_URL` | Frontend origin (used for CORS) | `http://localhost:3000` |

### `apps/broker-web/.env.local`

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PORT` | Port the web app listens on | `3000` |
| `AUTH_SECRET` | NextAuth session encryption secret | (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Public URL of the web app | `http://localhost:3000` |
| `AUTH_TRUST_HOST` | Required for NextAuth behind a proxy | `true` |
| `API_URL` | Base URL of the broker-api | `http://localhost:3001/api/v1` |

---

## Install Dependencies

This is a PNPM workspace — install once from the repo root, it covers both apps:

```bash
pnpm install
```

---

## Run with PNPM (without Docker)

Make sure MongoDB is reachable (see [Database Setup](#database-setup), Option B) and `.env` files are in place.

```bash
# Terminal 1 — API (http://localhost:3001/api/v1, Swagger at /swagger)
pnpm --filter broker-api start:dev

# Terminal 2 — Web (http://localhost:3000)
pnpm --filter broker-web dev
```

---

## Run with Docker

> **Recommended** — runs MongoDB, the API, and the web app together with one command, and seeds sample data automatically.

### Start everything (build + run, with logs)

```bash
docker compose -f docker-compose-local.yml up --build
```

This will:
1. Build the `broker-api` and `broker-web` images
2. Start a `mongo` container (MongoDB 7) and seed 20 sample brokers on first run
3. Start `broker-api` on `http://localhost:3001` (Swagger: `http://localhost:3001/swagger`)
4. Start `broker-web` on `http://localhost:3000`

Example output:

```text
$ docker compose -f docker-compose-local.yml up --build
[+] Building 12.4s (38/38) FINISHED
 => [api] exporting to image                                        1.7s
 => [web] exporting to image                                        2.0s
[+] Running 4/4
 ✔ Network interview-woxa_default        Created
 ✔ Volume "interview-woxa_mongo_data"     Created
 ✔ Container broker-mongo-local           Created
 ✔ Container broker-api-local             Created
 ✔ Container broker-web-local             Created
Attaching to broker-api-local, broker-mongo-local, broker-web-local
broker-mongo-local  | {"t":{"$date":"...."},"s":"I","c":"NETWORK","msg":"Waiting for connections","attr":{"port":27017}}
broker-mongo-local  | Seeded 20 brokers into broker_db.broker
broker-api-local    | [Nest] LOG [NestApplication] Nest application successfully started
broker-api-local    | [Nest] LOG [Bootstrap] Running Service on URL http://localhost:3001/api/v1
broker-web-local    |   ▲ Next.js 16.2.7
broker-web-local    |   - Local:        http://localhost:3000
broker-web-local    |  ✓ Ready in 320ms
```

### Run in the background (detached)

```bash
docker compose -f docker-compose-local.yml up -d --build
```

### View logs

```bash
# all services
docker compose -f docker-compose-local.yml logs -f

# a single service
docker compose -f docker-compose-local.yml logs -f api
docker compose -f docker-compose-local.yml logs -f web
docker compose -f docker-compose-local.yml logs -f mongo
```

### Check running containers

```bash
docker compose -f docker-compose-local.yml ps
```

### Stop / remove

```bash
# stop containers (keep DB data)
docker compose -f docker-compose-local.yml down

# stop and wipe the database volume (fresh re-seed on next `up`)
docker compose -f docker-compose-local.yml down -v
```

---

## Application URLs

| Service | URL |
| --- | --- |
| Web | http://localhost:3000 |
| API | http://localhost:3001/api/v1 |
| Swagger | http://localhost:3001/swagger |
| MongoDB | mongodb://localhost:27017/broker_db |

---

## Testing

### API (`apps/broker-api`)

```bash
# unit tests
pnpm --filter broker-api test

# unit tests with coverage
pnpm --filter broker-api test:cov

# e2e tests
pnpm --filter broker-api test:e2e
```

Unit tests (58 tests across 10 suites) cover:

- **`AppController` / `AppService`** — login/register delegation, hello endpoint
- **`BrokerService` / `BrokerController`** — slug uniqueness checks, create/update/delete/restore broker, paginated listing, controller-to-service delegation
- **`UsersService` / `UsersController`** — get/create/update/delete user, email uniqueness, change password (incl. same-password and not-found cases)
- **`AuthService` / `AuthController`** — sign-in, credential validation, refresh token (active/inactive/deleted user cases)
- **`CryptorService`** — password hashing and verification (bcrypt)
- **`HelperService`** — search regex helper

All Mongoose models, JWT, and cross-service dependencies are mocked.

### Reading the coverage report (`test:cov`)

`test:cov` runs the same 58 tests as `test`, but instruments the code (via Istanbul) to report how much of it actually executes during the test run. The summary table has these columns:

| Column | Meaning |
| --- | --- |
| `% Stmts` | % of statements (lines of executable code) that ran |
| `% Branch` | % of conditional branches (`if`/`else`, ternaries, `&&`/`\|\|`, `switch`) where **both** outcomes were exercised |
| `% Funcs` | % of functions/methods called at least once |
| `% Lines` | % of source lines executed (similar to `% Stmts`) |
| `Uncovered Line #s` | Specific line numbers never hit by any test |

A full HTML report is generated at `apps/broker-api/coverage/lcov-report/index.html` — open it in a browser for a file-by-file, line-by-line view (covered lines highlighted green, uncovered red).

Notes on the current results:

- Core business logic (`broker.service.ts`, `users.service.ts`, `auth.service.ts`) is well covered.
- `*.module.ts` and `main.ts` show 0% — these are dependency-injection wiring/bootstrap files with no logic to test.
- `auth.guard.ts`, `local.guard.ts`, `local.strategy.ts` show low/no coverage — these are passport guards/strategies tied to the HTTP request lifecycle, normally exercised by e2e tests rather than unit tests.
- `broker.service.ts` is missing coverage for `updateSlug()` (lines 219-243) — a good candidate for an additional unit test.

Coverage is a tool for spotting untested code paths, not a hard pass/fail gate.

---

## Production Deployment

Production builds use `docker-compose.yml` and are deployed automatically via GitHub Actions (build → push to GHCR → deploy to VPS) when `main` is updated. Production uses an external MongoDB Atlas cluster configured via `apps/broker-api/.env.prod`.
