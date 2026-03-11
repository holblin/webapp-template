# Frontend Workspace

Frontend app for the monorepo, built with React + Vite + Apollo Client.

## Related Project Docs

Use the central docs index for architecture and backend GraphQL contracts:

- [../../docs/README.md](../../docs/README.md)

Most relevant docs for frontend GraphQL integration:

- [../../docs/backend/listing-and-pagination.md](../../docs/backend/listing-and-pagination.md)
- [../../docs/backend/search-and-filtering.md](../../docs/backend/search-and-filtering.md)
- [../../docs/backend/mutation-conventions.md](../../docs/backend/mutation-conventions.md)
- [../../docs/frontend/dry-and-inventory-patterns.md](../../docs/frontend/dry-and-inventory-patterns.md)
- [../../docs/frontend/e2e-testing.md](../../docs/frontend/e2e-testing.md)

## Notes

- Backend list queries use connection-style pagination with `after` cursors.
- Backend list queries support `offset`, `limit`, `search`, `sort`, and `filter`.
- Search behavior is fuzzy (Fuse.js), not plain substring matching.

## Storybook

- Start Storybook:
  `npm run storybook --workspace webapp-template-frontend`
- Build static Storybook:
  `npm run build-storybook --workspace webapp-template-frontend`

Story files are colocated under `packages/frontend/src/**` next to their related modules.
