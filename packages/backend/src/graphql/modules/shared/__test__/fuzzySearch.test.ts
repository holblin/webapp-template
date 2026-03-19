import { describe, expect, it } from 'vitest';
import { applyFuzzySearch } from '../fuzzySearch.js';

type LibraryItem = {
  id: string;
  title: string;
  genre: string;
};

describe('applyFuzzySearch', () => {
  const items: LibraryItem[] = [
    { id: '1', title: 'The Awakening', genre: 'Literary Fiction' },
    { id: '2', title: 'City of Glass', genre: 'Mystery' },
    { id: '3', title: 'Dune', genre: 'Sci-Fi' },
  ];

  it('returns original items when search is empty', () => {
    const result = applyFuzzySearch({
      items,
      search: '   ',
      keys: ['title'],
    });

    expect(result).toBe(items);
  });

  it('finds results by title with fuzzy matching', () => {
    const result = applyFuzzySearch({
      items,
      search: 'Awaken',
      keys: ['title'],
    });

    expect(result.map((item) => item.id)).toEqual(['1']);
  });

  it('supports searching across other configured keys', () => {
    const result = applyFuzzySearch({
      items,
      search: 'Myst',
      keys: ['genre'],
    });

    expect(result.map((item) => item.id)).toEqual(['2']);
  });

  it('does not match on single-character queries', () => {
    const result = applyFuzzySearch({
      items,
      search: 'a',
      keys: ['title'],
    });

    expect(result).toEqual([]);
  });

  it('supports negated text segments', () => {
    const result = applyFuzzySearch({
      items,
      search: 'city -glass',
      keys: ['title'],
    });

    expect(result).toEqual([]);
  });
});
