---
name: no-barrel-index
description: Enforce direct imports and ban barrel-only `index.ts`/`index.tsx` re-export files.
license: MIT
---

# No Barrel Index Skill

## Rule

- Never create `index.ts`/`index.tsx` files that only re-export from other files.
- Always import from the concrete module path.

## Migration Steps

1. Find barrel files:
   - `rg -n "export .* from './|export \\* from './" --glob '**/index.ts' --glob '**/index.tsx'`
2. Update imports to direct file paths.
3. Delete the barrel files.
4. Run typecheck.

## Notes

- This rule does not ban entry-point files named `index.ts` that contain real logic.
