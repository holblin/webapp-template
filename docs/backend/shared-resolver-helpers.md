# Shared Resolver Helpers

## `pagination.ts`

Path:

- `packages/backend/src/graphql/modules/shared/pagination.ts`

Purpose:

- normalize `offset`/`limit`
- decode/encode cursors
- build connection response (`edges`, `nodes`, `pageInfo`, `totalCount`)

## `fuzzySearch.ts`

Path:

- `packages/backend/src/graphql/modules/shared/fuzzySearch.ts`

Purpose:

- apply optional Fuse.js fuzzy search
- centralize Fuse configuration used across domain list resolvers

## Why Shared Helpers

- keeps module resolvers focused on domain rules
- keeps pagination and search behavior consistent across modules
- reduces repeated logic and future drift
