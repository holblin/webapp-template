# ADR-0003: Fuse.js Fuzzy Search

## Status

Accepted

## Decision

Implement `search` behavior with `fuse.js` through a shared helper:

- `packages/backend/src/graphql/modules/shared/fuzzySearch.ts`

Each domain defines its searchable fields and passes candidates to helper.

## Rationale

- better matching quality than strict substring checks
- consistent behavior across all list resolvers
- easy future tuning in one place
