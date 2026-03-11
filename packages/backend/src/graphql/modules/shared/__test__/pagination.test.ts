import { describe, expect, it } from 'vitest';
import { buildConnection } from '../pagination.js';

describe('buildConnection', () => {
  it('builds a connection with default pagination values', () => {
    const items = Array.from({ length: 25 }, (_value, index) => index + 1);
    const result = buildConnection({ items });

    expect(result.nodes).toEqual(items.slice(0, 20));
    expect(result.edges).toHaveLength(20);
    expect(result.totalCount).toBe(25);
    expect(result.pageInfo.hasNextPage).toBe(true);
    expect(result.pageInfo.hasPreviousPage).toBe(false);
    expect(result.pageInfo.startCursor).not.toBeNull();
    expect(result.pageInfo.endCursor).not.toBeNull();
  });

  it('uses cursor pagination when after is provided', () => {
    const items = [1, 2, 3, 4, 5];
    const firstPage = buildConnection({ items, limit: 2 });
    const secondPage = buildConnection({
      items,
      limit: 2,
      after: firstPage.pageInfo.endCursor,
    });
    const thirdPage = buildConnection({
      items,
      limit: 2,
      after: secondPage.pageInfo.endCursor,
    });

    expect(firstPage.nodes).toEqual([1, 2]);
    expect(secondPage.nodes).toEqual([3, 4]);
    expect(secondPage.pageInfo.hasPreviousPage).toBe(true);
    expect(secondPage.pageInfo.hasNextPage).toBe(true);
    expect(thirdPage.nodes).toEqual([5]);
    expect(thirdPage.pageInfo.hasNextPage).toBe(false);
  });

  it('normalizes negative offsets, fractional numbers, and large limits', () => {
    const items = [1, 2, 3, 4];

    expect(buildConnection({ items, offset: -10, limit: 1000 }).nodes).toEqual([1, 2, 3, 4]);
    expect(buildConnection({ items, offset: 1.9, limit: 1.9 }).nodes).toEqual([2]);
    expect(buildConnection({ items, offset: 1, limit: 2, after: 'not-a-valid-cursor' }).nodes).toEqual([2, 3]);
  });

  it('ignores cursors with non-numeric or negative offsets', () => {
    const items = [1, 2, 3, 4, 5];
    const nanCursor = Buffer.from('offset:not-a-number', 'utf8').toString('base64');
    const negativeCursor = Buffer.from('offset:-2', 'utf8').toString('base64');

    expect(buildConnection({ items, limit: 2, after: nanCursor }).nodes).toEqual([1, 2]);
    expect(buildConnection({ items, limit: 2, after: negativeCursor }).nodes).toEqual([1, 2]);
  });

  it('falls back safely when cursor decoding throws', () => {
    const items = [1, 2, 3];
    const invalidRuntimeCursor = Symbol('cursor') as unknown as string;

    expect(buildConnection({ items, limit: 2, after: invalidRuntimeCursor }).nodes).toEqual([1, 2]);
  });

  it('returns null cursors when the page slice is empty', () => {
    const result = buildConnection({
      items: [1, 2, 3],
      offset: 999,
      limit: 10,
    });

    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
    expect(result.pageInfo.startCursor).toBeNull();
    expect(result.pageInfo.endCursor).toBeNull();
  });
});
