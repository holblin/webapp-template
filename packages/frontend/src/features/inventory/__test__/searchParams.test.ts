import { describe, expect, it } from 'vitest';
import { parseBoolean, parseEnum, parseNumber, parsePositiveInt, parseString } from '../searchParams';

describe('searchParams parsers', () => {
  it('parseString returns fallback for non-string values', () => {
    expect(parseString('ok')).toBe('ok');
    expect(parseString(42, 'fallback')).toBe('fallback');
  });

  it('parsePositiveInt parses non-negative integers and applies fallback', () => {
    expect(parsePositiveInt('12', 0)).toBe(12);
    expect(parsePositiveInt(3, 0)).toBe(3);
    expect(parsePositiveInt('-1', 9)).toBe(9);
    expect(parsePositiveInt('abc', 9)).toBe(9);
    expect(parsePositiveInt({}, 9)).toBe(9);
  });

  it('parseNumber parses floats and applies fallback', () => {
    expect(parseNumber('12.5', 0)).toBe(12.5);
    expect(parseNumber(3.14, 0)).toBe(3.14);
    expect(parseNumber('abc', 9)).toBe(9);
    expect(parseNumber(null, 9)).toBe(9);
  });

  it('parseEnum returns only allowed values', () => {
    const allowed = ['asc', 'desc'] as const;
    expect(parseEnum('asc', allowed, 'desc')).toBe('asc');
    expect(parseEnum('nope', allowed, 'desc')).toBe('desc');
    expect(parseEnum(42, allowed, 'desc')).toBe('desc');
  });

  it('parseBoolean supports boolean and "true"/"false" strings', () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('other', true)).toBe(true);
  });
});
