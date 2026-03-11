---
name: graphql-module-starter
description: Create a new backend GraphQL domain module in this repo with schema-first SDL, typed resolvers, apiClient integration through GraphQL context, DataLoader-based relations, and module registration in src/graphql/modules/index.ts.
---

# GraphQL Module Starter

Use this skill when adding a new GraphQL domain module to `packages/backend` in this repository.

## Goal

Implement new modules consistently with the existing `author`, `book`, and `tag` domains:
- schema-first SDL in `src/graphql/modules/<domain>/<domain>Module.graphql`
- typed resolvers in `src/graphql/modules/<domain>/<domain>Module.ts`
- request-scoped data access through `context.apiClient`
- relation resolution through `context.loaders` (DataLoader)
- composition through `src/graphql/modules/index.ts`

## Workflow

1. Create domain storage and API client.
- Add `packages/backend/src/apiClient/<domain>ApiClient.ts`.
- Export `<Domain>Record`, `create<Domain>ApiClient`, and `<Domain>ApiClient` type.
- Keep persistence in module-local arrays for now (matching existing project style).

2. Add schema module files.
- Create `packages/backend/src/graphql/modules/<domain>/<domain>Module.graphql`.
- Define:
  - `type <Domain>`
  - `<Domain>Edge` and `<Domain>Connection`
  - domain list query (`<domain>List`) with default list args:
    - `offset: Int = 0`
    - `limit: Int = 20`
    - `after: String`
    - `search: String`
    - `sort: <Domain>ListSortInput`
    - `filter: <Domain>ListWhereInput`
  - domain mutations (`<domain>Create`, `<domain>Update`, `<domain>Delete`) for full CRUD
  - mutation input and response types
- Use operation naming style `<domain><verb>` and `<Domain>ListWhereInput` for list filters.

3. Implement resolvers in `<domain>Module.ts`.
- Load SDL file with the same bundled/source fallback pattern as existing modules.
- Use generated resolver contracts from:
  - `packages/backend/src/__generated__/gql/resolvers-types.ts`
- Split resolvers into `queryResolvers`, `mutationResolvers`, and per-type resolvers when needed.
- Access all data through `context.apiClient.<domain>` and loaders.
- Use shared helpers for common behavior:
  - pagination: `src/graphql/modules/shared/pagination.ts`
  - search: `src/graphql/modules/shared/fuzzySearch.ts` (Fuse.js)
- Return normalized resolver parent shapes (`id` references for relations) instead of nested direct records.
- Resolver order for list queries should be:
  1. strict `filter`
  2. Fuse.js `search`
  3. deterministic `sort`
  4. `buildConnection(...)`

4. Wire context and loaders.
- Extend `packages/backend/src/context.ts` with new `apiClient` entry.
- Update `packages/backend/src/index.ts` to create and pass the new api client in request context.
- Extend `packages/backend/src/graphql/loaders.ts` with loaders for new relationships.
- Keep loaders request-scoped through `createGraphQLLoaders(apiClient)`.

5. Register module composition.
- Import module in `packages/backend/src/graphql/modules/index.ts`.
- Add it to `graphModules` composition list.

6. Update codegen mapper config if new type parent-shape customization is needed.
- Edit `codegen.ts` `mappers` for new schema type relationships.
- Use `ResolverParentShape<...>` with `TOmit` and `TIdOnly` to avoid over-materializing relations in parents.

7. Document architecture choices.
- Update `docs/README.md` index if new docs are added.
- Add or amend ADRs under `docs/architecture/decisions/` when introducing new cross-cutting patterns.

## Validation checklist

Run and fix issues in this order:
1. `npm run codegen`
2. `npm run compile --workspace postgres-backup-backend`
3. `npm run lint -- packages/backend/src/index.ts packages/backend/src/context.ts packages/backend/src/graphql packages/backend/src/apiClient`
