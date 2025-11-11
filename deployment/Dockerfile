# syntax=docker/dockerfile:1
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm/store \
    corepack pnpm install --frozen-lockfile --prod

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# needs next.config.{js,ts,mjs} with:  output: 'standalone'
RUN --mount=type=cache,target=/pnpm/store \
    corepack pnpm install --frozen-lockfile && \
    corepack pnpm build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodegrp && adduser -S nodeusr -G nodegrp
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./public/.next/static
USER nodeusr
EXPOSE 3000
CMD ["node","server.js"]
