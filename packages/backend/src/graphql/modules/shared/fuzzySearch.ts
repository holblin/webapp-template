import SearchString from 'search-string';

type ApplyFuzzySearchInput<TItem> = {
  items: TItem[];
  search?: string | null;
  keys: ReadonlyArray<keyof TItem>;
};

const normalize = (value: string): string => value.trim().toLowerCase();

const toNormalizedStrings = (value: unknown): string[] => {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => toNormalizedStrings(entry));
  }

  if (typeof value === 'string') {
    const normalized = normalize(value);
    return normalized ? [normalized] : [];
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return [String(value).toLowerCase()];
  }

  return [];
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

  const parsed = SearchString.parse(query);
  const positiveTerms = [
    ...parsed.getTextSegments()
      .filter((segment) => !segment.negated)
      .map((segment) => normalize(segment.text))
      .filter((term) => term.length >= 2),
    ...parsed.getConditionArray()
      .filter((condition) => !condition.negated)
      .map((condition) => normalize(condition.value))
      .filter((term) => term.length >= 2),
  ];
  const negativeTerms = [
    ...parsed.getTextSegments()
      .filter((segment) => segment.negated)
      .map((segment) => normalize(segment.text))
      .filter((term) => term.length >= 2),
    ...parsed.getConditionArray()
      .filter((condition) => condition.negated)
      .map((condition) => normalize(condition.value))
      .filter((term) => term.length >= 2),
  ];

  if (positiveTerms.length === 0 && negativeTerms.length === 0) {
    return [];
  }

  return items.filter((item) => {
    const searchableValues = keys.flatMap((key) => (
      toNormalizedStrings((item as Record<string, unknown>)[key as string])
    ));
    const includesTerm = (term: string) => searchableValues.some((value) => value.includes(term));

    return positiveTerms.every(includesTerm) && negativeTerms.every((term) => !includesTerm(term));
  });
};
