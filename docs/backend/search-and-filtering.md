# Search And Filtering

## Search Engine

Search is implemented with `fuse.js` and applied in all list resolvers:

- `authorList`
- `bookList`
- `tagList`

Shared helper:

- `packages/backend/src/graphql/modules/shared/fuzzySearch.ts`

## Search Execution Order

Resolver flow is:

1. Apply strict `filter` constraints.
2. Apply fuzzy `search` over configured fields.
3. Apply deterministic `sort`.
4. Build paginated connection response.

## Search Fields

- `authorList`: author name, related book titles
- `bookList`: title, author name, tag names
- `tagList`: tag name, related book titles

## Notes

- Empty or missing `search` skips Fuse and returns filtered items directly.
- Filtering and sorting remain domain-specific; Fuse handles only candidate matching and ranking.
