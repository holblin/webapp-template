---
name: react-fast-refresh-exports
description: Keep React Fast Refresh safe by ensuring component files only export components and moving GraphQL/constants to sibling non-component files.
license: MIT
---

# React Fast Refresh Exports

## Rule

- In `*.tsx` files that export React components, only export components.
- Move non-component exports (GraphQL docs, constants, utilities) into sibling files such as `*.graphql.ts` or `*.constants.ts`.

## Preferred Structure

- `FeatureX/FeatureX.tsx` for the component.
- `FeatureX/FeatureX.graphql.ts` for GraphQL documents.
- Import the GraphQL document into the component file.

## Migration Steps

1. Find violations:
   - `npx eslint packages/frontend/src`
2. For each violation:
   - Create a sibling non-component file.
   - Move GraphQL/constants there.
   - Keep only component exports in the `*.tsx` file.
3. Update imports to direct file paths (no barrel `index.ts` files).
4. Run:
   - `npm run codegen`
   - `npm run typecheck --workspace postgres-backup-frontend`
   - `npx eslint packages/frontend/src`
