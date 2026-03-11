# Frontend DRY and Inventory Patterns

This project uses shared frontend helpers to avoid copy/paste between inventory pages and CRUD dialogs.

## Shared Helpers

- Inventory page wiring:
  `packages/frontend/src/features/inventory/hooks/useInventoryPageQuery.ts`
- Inventory page shell (table + dialogs + create button):
  `packages/frontend/src/components/Inventory/InventoryCrudLayout.tsx`
- Create/Edit/Delete dialog state:
  `packages/frontend/src/features/inventory/hooks/useCrudDialogState.ts`
- Deduped error toasts:
  `packages/frontend/src/features/inventory/hooks/useErrorToast.ts`
- Table sorting glue between UI and GraphQL enums:
  `packages/frontend/src/features/inventory/sorting.ts`
- Common text/date parsing:
  `packages/frontend/src/features/inventory/csv.ts`
  `packages/frontend/src/features/inventory/date.ts`
- Required field validation:
  `packages/frontend/src/features/inventory/validation.ts`

## Rules

When creating a new inventory noun (for example `Publishers`):

1. Reuse `useInventoryPageQuery` and `useCrudDialogState` in the page.
2. Reuse `buildTableSortDescriptor` and `applyInventorySortPatch` for sorting.
3. Reuse `getRequiredFieldError` in create/update dialogs instead of repeated `if` chains.
4. Keep noun-specific mapping/config in the page (columns, filter options, labels), not shared hooks.

## Duplicate Scan Command

Run this before merging major frontend refactors:

```bash
npx --yes jscpd --min-lines 8 --min-tokens 70 --reporters console --pattern "packages/frontend/src/**/*.{ts,tsx}" --ignore "**/__generated__/**"
```

Aim to keep duplication in `packages/frontend/src` as low as practical and extract shared helpers when the same pattern appears in 2+ places.
