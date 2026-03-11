import { describe, expect, it } from 'vitest';
import { toUniqueCsvValues } from '../csv';

describe('toUniqueCsvValues', () => {
  it('returns unique, trimmed, non-empty CSV values', () => {
    expect(toUniqueCsvValues(' fantasy, sci-fi, fantasy, , mystery ')).toEqual([
      'fantasy',
      'sci-fi',
      'mystery',
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(toUniqueCsvValues('')).toEqual([]);
  });
});
