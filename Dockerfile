# syntax=docker/dockerfile:1.22

FROM node:24.11-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
COPY . .
RUN npm run codegen \
  && npm run compile --workspace webapp-template-backend \
  && npm run build --workspace webapp-template-frontend \
  && npm run build-storybook --workspace webapp-template-frontend

FROM deps AS prod-deps
RUN npm prune --omit=dev

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/packages/backend/dist ./packages/backend/dist
COPY --from=build /app/packages/backend/src/graphql ./packages/backend/src/graphql
COPY --from=build /app/packages/frontend/dist ./packages/frontend/dist
COPY --from=build /app/packages/frontend/dist-storybook ./packages/frontend/dist-storybook
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json

EXPOSE 4000
CMD ["node", "packages/backend/dist/index.js"]
