import DataLoader from 'dataloader';
import type { AuthorApiClient, AuthorRecord } from '../apiClient/authorApiClient.js';
import type { BookApiClient, BookRecord } from '../apiClient/bookApiClient.js';
import type { TagApiClient, TagRecord } from '../apiClient/tagApiClient.js';

export interface GraphQLLoaders {
  authorById: DataLoader<string, AuthorRecord | null>;
  booksByAuthorId: DataLoader<string, BookRecord[]>;
  tagById: DataLoader<string, TagRecord | null>;
  booksByTagId: DataLoader<string, BookRecord[]>;
  tagsByBookId: DataLoader<string, TagRecord[]>;
}

export const createGraphQLLoaders = (apiClient: {
  author: AuthorApiClient;
  book: BookApiClient;
  tag: TagApiClient;
}): GraphQLLoaders => ({
  authorById: new DataLoader<string, AuthorRecord | null>(async (authorIds) => {
    return authorIds.map((authorId) => apiClient.author.getById(authorId));
  }),
  booksByAuthorId: new DataLoader<string, BookRecord[]>(async (authorIds) => {
    const byAuthorId = new Map<string, BookRecord[]>();
    for (const book of apiClient.book.list()) {
      const books = byAuthorId.get(book.authorId) ?? [];
      books.push(book);
      byAuthorId.set(book.authorId, books);
    }

    return authorIds.map((authorId) => byAuthorId.get(authorId) ?? []);
  }),
  tagById: new DataLoader<string, TagRecord | null>(async (tagIds) => {
    return tagIds.map((tagId) => apiClient.tag.getById(tagId));
  }),
  booksByTagId: new DataLoader<string, BookRecord[]>(async (tagIds) => {
    const booksById = new Map(apiClient.book.list().map((book) => [book.id, book]));
    return tagIds.map((tagId) => {
      const tag = apiClient.tag.getById(tagId);
      if (!tag) {
        return [];
      }

      return tag.bookIds
        .map((bookId) => booksById.get(bookId))
        .filter((book): book is BookRecord => !!book);
    });
  }),
  tagsByBookId: new DataLoader<string, TagRecord[]>(async (bookIds) => {
    const byBookId = new Map<string, TagRecord[]>();

    for (const tag of apiClient.tag.list()) {
      for (const bookId of tag.bookIds) {
        const tags = byBookId.get(bookId) ?? [];
        tags.push(tag);
        byBookId.set(bookId, tags);
      }
    }

    return bookIds.map((bookId) => byBookId.get(bookId) ?? []);
  }),
});
