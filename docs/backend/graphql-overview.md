# Backend GraphQL Overview

This project uses a schema-first GraphQL backend with domain modules under:

- `packages/backend/src/graphql/modules/author`
- `packages/backend/src/graphql/modules/book`
- `packages/backend/src/graphql/modules/tag`
- shared schema/helpers in `packages/backend/src/graphql/modules/shared`

## Module Structure

Each domain module follows:

- `<domain>Module.graphql` for SDL source of truth
- `<domain>Module.ts` for typed resolvers and schema loading
- apiClient access through `context.apiClient.<domain>`
- relationship field resolution through request-scoped DataLoaders

## List Query Contract

All list queries return a connection object and support default listing args:

- `offset` (default `0`)
- `limit` (default `20`)
- `after` (cursor)
- `search`
- `sort` (`by` + `direction`)
- `filter` (optional per-module `WhereInput`)

## Mutation Contract

All modules expose CRUD mutations:

- `authorCreate`, `authorUpdate`, `authorDelete`
- `bookCreate`, `bookUpdate`, `bookDelete`
- `tagCreate`, `tagUpdate`, `tagDelete`

Mutation responses use `{ code, success, message }` with entity payload where relevant.
