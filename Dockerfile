# syntax=docker/dockerfile:1

FROM node:24.11-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run codegen \
  && npm run compile --workspace postgres-backup-backend \
  && npm run build --workspace postgres-backup-frontend

FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json
RUN npm ci --omit=dev

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/packages/backend/dist ./packages/backend/dist
COPY --from=build /app/packages/backend/src/graphql ./packages/backend/src/graphql
COPY --from=build /app/packages/frontend/dist ./packages/frontend/dist
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json

EXPOSE 4000
CMD ["node", "packages/backend/dist/index.js"]
