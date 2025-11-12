
# varta-web

Next.js + React frontend for **Varta** (AI news site). Mock-first, switchable to live Core API and Agent API via env flags.

## Quick start

```bash
pnpm install
pnpm dev
```

This runs the app at http://localhost:3000 using **mock data** by default.

## Env toggle

Copy `.env.example` to `.env.local` and adjust:

```
NEXT_PUBLIC_API_BASE=http://localhost:8080/api/v1
NEXT_PUBLIC_AGENT_BASE=http://localhost:8090/agent/v1
NEXT_PUBLIC_USE_MOCKS=true
```

- `NEXT_PUBLIC_USE_MOCKS=true`: read local fixtures and mock SSE.
- `NEXT_PUBLIC_USE_MOCKS=false`: call live APIs: `GET /feed`, `GET /items/{slug}`, `GET /posts`, `GET /posts/{slug}`, `GET /search`; chat streams from `${NEXT_PUBLIC_AGENT_BASE}/chat/stream` (SSE).

## Scripts

- `pnpm dev` - start Next.js (port 3000)
- `pnpm build && pnpm start` - production build & run
- `pnpm test` - vitest + @testing-library/react smoke tests
- `pnpm lint` - eslint
- `pnpm typecheck` - tsc
- `pnpm fixtures:regen` - copy seed fixtures again

## Tech

- Next.js 14 (App Router, RSC)
- TypeScript
- Tailwind CSS + `@tailwindcss/typography`
- shadcn/ui (locally vendored minimal components in `components/ui/*` for now)
- MDX for posts
- SSR/ISR: `revalidate = 300` on feed/topic/item routes
- Mock SSE client switchable to real agent SSE

## Build and Deploy
### Build
```
NEW_TAG=v0.1.0-amd64-$(date +%s)                                         

docker buildx build \           
  --no-cache \
  --platform linux/amd64 \
  -f deployment/Dockerfile \
  -t 704892510569.dkr.ecr.us-east-1.amazonaws.com/varta-web:${NEW_TAG} \
  --push .

```

### Deploy
```
helm upgrade --install varta-web ./deployment/charts/varta-web -n varta \
  --set image.repository=704892510569.dkr.ecr.us-east-1.amazonaws.com/varta-web \
  --set image.tag=${NEW_TAG} \
  --set image.pullPolicy=Always

```

### Validate
```
kubectl -n varta get ingress

kubectl -n varta get pods

kubectl -n varta get svc

kubectl logs deployment.apps/varta-web -n varta

```
---

MIT © 2025 Varta
