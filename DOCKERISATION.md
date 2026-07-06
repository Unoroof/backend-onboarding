# Dockerisation Guide

## Service

| Field | Value |
|-------|-------|
| Service name | `backend-onboarding` |
| Path | `Desktop/Workshop/backend-onboarding` |
| Stack/framework | Node.js / Express / Sequelize |
| Runtime port | `3000` |
| Dockerfile status | **Done** — multi-stage (`deps` + `runtime`) on `node:22.22.2-alpine3.22` |
| Dockerignore status | **Done** — `.dockerignore` excludes secrets, docs, deployment files, and local tooling |
| Notes | Entrypoint is `yarn start` (`node server.js`). Sequelize migrations via `yarn migrate`. `GET /health` is the unauthenticated probe; `GET /liveness` is also public (legacy). Docker `HEALTHCHECK` uses `/health`. |

## Base Reference

`Desktop/Workshop/backend-rates` and `Desktop/Workshop/backend-payment` were used as reference patterns for multi-stage Alpine builds, production-only dependency installs, and non-root runtime. This repo was adjusted for its own yarn scripts, Sequelize setup, port `3000`, and env var names.

## Current Status

**Before**

- Single-stage `node:16-slim` image with `apt-get` packages (`postgresql-client`, `libpq-dev`) in the final layer.
- Full `yarn` install (including devDependencies) with no cache cleanup.
- Ran as root; no `NODE_ENV=production`; minimal `.dockerignore`.

**Changed**

- Multi-stage build on `node:22.22.2-alpine3.22` with production-only `yarn install --frozen-lockfile --production`.
- Build tools (`python3`, `make`, `g++`, `postgresql-dev`) confined to the deps stage.
- Runtime runs as non-root `node` user with `NODE_ENV=production`.
- Expanded `.dockerignore` for secrets, docs, kube manifests, and local files.
- `postgresql-client` removed from runtime (Sequelize migrations use Node `pg`, not `psql`).

**Remaining gaps**

- Dependency vulnerability remediation is manual (run Trivy after build).
- No `.env.docker` template in repo — copy from `env.list` or your local `.env` and set `DB_HOST=wiredup-postgres` for Docker network use.

## Required Environment Variables

Variable names only (no secrets):

- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_HOST`
- `DB_PORT`
- `DB_SEQUELIZE_DIALECT`
- `DB_SSL`
- `PORT`
- `APP_NAME`
- `DEBUG`
- `SENTRY_DSN`
- `SENTRY_ENV`
- `AUTH_ENDPOINT`
- `ADDRESSBOOK_ENDPOINT`
- `FILES_ENDPOINT`
- `PINCODE_CHECK_API_ENDPOINT`
- `VIDEO_CONSULTATION_HOST`
- `VIDEO_CONSULTATION_SECRET`
- `VIDEO_CONSULTATION_ACCESS_KEY`
- `VIDEO_CONSULTATION_TEMPLATE_ID`
- `NEPTUNE_ENV`
- `NEPTUNE_ENDPOINT`
- `NEPTUNE_TOKEN`

For local Docker network usage, set the DB host to the shared PostgreSQL container name:

```env
DB_HOST=wiredup-postgres
```

- Do not use `localhost` inside the container for DB connections.
- Use Docker container/service names for container-to-container communication.

## Local Docker Network Notes

- Existing Docker network: `wiredup-local`
- Existing PostgreSQL container: `wiredup-postgres`
- Other local services may already use ports `8080`, `3000`, and `3001` — map this service to a non-conflicting host port (e.g. `3002`).

## Build Command

```bash
docker build -t backend-onboarding:local -f Dockerfile .
```

## Run Command Template

```bash
docker run -d \
  --name backend-onboarding-test \
  --network wiredup-local \
  -p 3002:3000 \
  --env-file .env.docker \
  backend-onboarding:local
```

## Migration Command

```bash
docker exec -it backend-onboarding-test yarn migrate
```

## Health Check

`GET /health` returns `200` with `{ "status": "ok" }` and does not require authentication. Use this for Docker/Kubernetes probes:

```bash
curl -i http://localhost:3002/health
```

`GET /liveness` is also public (same response) for backward compatibility.

## Image Size Inspection

```bash
docker images backend-onboarding:local
docker history backend-onboarding:local
docker run --rm backend-onboarding:local sh -c "du -sh /app/* | sort -h"
```

## Trivy Scan Commands

```bash
trivy image backend-onboarding:local
```

```bash
trivy image --severity HIGH,CRITICAL --exit-code 1 backend-onboarding:local
```

## Final Manual Validation Checklist

- [ ] Image builds successfully
- [ ] Image size reviewed
- [ ] Container starts successfully
- [ ] DB connection works on `wiredup-local`
- [ ] Migrations run successfully (`yarn migrate`)
- [ ] Health endpoint responds (`curl http://localhost:3002/health`)
- [ ] One main/protected API endpoint smoke-tested
- [ ] Trivy scan completed
- [ ] Critical/high vulnerabilities fixed or documented
