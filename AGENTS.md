# Repository Agent Rules

## No Barrel Re-Exports

- Do not create `index.ts` or `index.tsx` files whose only purpose is re-exporting symbols from sibling files.
- Import directly from concrete module files (for example: `src/features/foo/Bar.tsx`), not from directory barrels.
- If a barrel-only `index.ts`/`index.tsx` is found, remove it and update imports to direct file paths.

## React Fast Refresh Exports

- In `*.tsx` files that export React components, only export components.
- Move GraphQL documents, constants, and helper values out of component files into sibling `*.graphql.ts` or `*.constants.ts` files.
- Prefer feature subfolders like `FeatureName/FeatureName.tsx` and `FeatureName/FeatureName.graphql.ts` to keep component files refresh-safe.

## DRY Reuse

- Reuse existing helpers under `packages/frontend/src/features/inventory/` before adding new page-level logic.
- For inventory pages, prefer `InventoryCrudLayout`, `useInventoryPageQuery`, and `sorting.ts` helpers over copy/paste.
- For dialog required-field checks, prefer `getRequiredFieldError` over repeated `if (!value.trim())` chains.

## Node/NPM Commands

- Before running `node`, `npm`, `npx`, or workspace scripts, initialize Node with `nvm` for this repo.
- Use this command pattern in shell calls:
  - `source ~/.zprofile && nvm use && <command>`
- Repo Node version is defined in `.nvmrc` (`v24.11.0`).
