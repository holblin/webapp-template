# Listing And Pagination

## Current Contract

All domain list queries return connection objects with:

- `edges { cursor, node }`
- `nodes`
- `pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }`
- `totalCount`

## Default Arguments

Every list query accepts:

- `offset: Int = 0`
- `limit: Int = 20`
- `after: String`
- `search: String`
- `sort: <Domain>ListSortInput`
- `filter: <Domain>ListWhereInput`

## Pagination Strategy

Pagination is implemented by shared helper:

- `packages/backend/src/graphql/modules/shared/pagination.ts`

Behavior:

- `after` cursor takes precedence when present.
- Cursor encodes an absolute item offset.
- `offset` is used as initial page start when `after` is absent.
- `limit` is normalized to safe bounds in shared helper.
