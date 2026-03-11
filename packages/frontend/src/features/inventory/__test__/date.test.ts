import { describe, expect, it } from 'vitest';
import { toCalendarDate } from '../date';

describe('toCalendarDate', () => {
  it('parses a valid YYYY-MM-DD value', () => {
    const date = toCalendarDate('2024-07-15');
    expect(date?.toString()).toBe('2024-07-15');
  });

  it('returns null for empty values', () => {
    expect(toCalendarDate('')).toBeNull();
  });

  it('returns null for invalid values', () => {
    expect(toCalendarDate('invalid')).toBeNull();
    expect(toCalendarDate('2024-13-01')).toBeNull();
  });
});
