import { describe, expect, it } from 'vitest';
import { createAuthorApiClient } from '../../apiClient/authorApiClient.js';
import { createBookApiClient } from '../../apiClient/bookApiClient.js';
import { createTagApiClient } from '../../apiClient/tagApiClient.js';
import { createGraphQLLoaders } from '../loaders.js';

describe('createGraphQLLoaders', () => {
  const createTestLoaders = () => createGraphQLLoaders({
    author: createAuthorApiClient(),
    book: createBookApiClient(),
    tag: createTagApiClient(),
  });

  it('loads author records by id', async () => {
    const loaders = createTestLoaders();

    await expect(loaders.authorById.load('author-1')).resolves.toMatchObject({
      id: 'author-1',
      name: 'Kate Chopin',
    });
    await expect(loaders.authorById.load('author-missing')).resolves.toBeNull();
  });

  it('loads books by author id', async () => {
    const loaders = createTestLoaders();

    const books = await loaders.booksByAuthorId.load('author-1');
    expect(books.length).toBeGreaterThan(0);
    expect(books.every((book) => book.authorId === 'author-1')).toBe(true);

    await expect(loaders.booksByAuthorId.load('author-missing')).resolves.toEqual([]);
  });

  it('loads books by tag id and tags by book id', async () => {
    const loaders = createTestLoaders();

    const tag = await loaders.tagById.load('tag-1');
    expect(tag).not.toBeNull();

    const books = await loaders.booksByTagId.load('tag-1');
    expect(books.map((book) => book.id)).toEqual(tag?.bookIds ?? []);

    const tags = await loaders.tagsByBookId.load('book-1');
    expect(tags.some((entry) => entry.id === 'tag-1')).toBe(true);

    await expect(loaders.booksByTagId.load('tag-missing')).resolves.toEqual([]);
    await expect(loaders.tagsByBookId.load('book-missing')).resolves.toEqual([]);
  });
});
