import Fuse, { type FuseOptionKey } from 'fuse.js';

type ApplyFuzzySearchInput<TItem> = {
  items: TItem[];
  search?: string | null;
  keys: ReadonlyArray<FuseOptionKey<TItem>>;
};

export const applyFuzzySearch = <TItem>({
  items,
  search,
  keys,
}: ApplyFuzzySearchInput<TItem>): TItem[] => {
  const query = search?.trim();
  if (!query) {
    return items;
  }

  const fuse = new Fuse(items, {
    keys: [...keys],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 1,
  });

  return fuse.search(query).map((result) => result.item);
};
