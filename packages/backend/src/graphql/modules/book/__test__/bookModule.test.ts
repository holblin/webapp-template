import { GraphQLError } from 'graphql';
import { describe, expect, it } from 'vitest';
import { AuthorCountry, BookListSortBy, SortDirection } from '../../../../__generated__/gql/resolvers-types.js';
import { runResolver } from '../../../__test__/resolverTestUtils.js';
import { createTestGraphQLContext } from '../../../__test__/testContext.js';
import { domainResolvers } from '../bookModule.js';

const query = domainResolvers.Query as NonNullable<typeof domainResolvers.Query>;
const mutation = domainResolvers.Mutation as NonNullable<typeof domainResolvers.Mutation>;
const bookResolvers = domainResolvers.Book as NonNullable<typeof domainResolvers.Book>;
const authorResolvers = domainResolvers.Author as NonNullable<typeof domainResolvers.Author>;

describe('bookModule resolvers', () => {
  it('returns bookById and supports filtered/sorted bookList', async () => {
    const context = createTestGraphQLContext();

    const byId = await runResolver(query.bookById, {}, { id: 'book-1' }, context);
    expect(byId).toMatchObject({
      id: 'book-1',
      title: 'The Awakening',
      author: { id: 'author-1' },
    });

    const list = await runResolver(query.bookList, {}, {
      filter: {
        titleContains: 'city',
        authorId: 'author-2',
      },
      search: 'glass',
      sort: {
        by: BookListSortBy.AuthorName,
        direction: SortDirection.Desc,
      },
      offset: 0,
      limit: 10,
    }, context);
    const nodes = await Promise.all(list.nodes);

    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.every((book) => book.author.id === 'author-2')).toBe(true);
  });

  it('validates and creates books (including date validation and author auto-create)', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.bookCreate, {}, {
      input: {
        title: ' ',
        description: 'desc',
        publicationDate: '2020-01-01',
        author: 'Someone',
      },
    }, context)).toThrowError('Title must not be empty.');

    expect(() => runResolver(mutation.bookCreate, {}, {
      input: {
        title: 'Valid',
        description: ' ',
        publicationDate: '2020-01-01',
        author: 'Someone',
      },
    }, context)).toThrowError('Description must not be empty.');

    expect(() => runResolver(mutation.bookCreate, {}, {
      input: {
        title: 'Valid',
        description: 'Desc',
        publicationDate: new Date('bad-date'),
        author: 'Someone',
      },
    }, context)).toThrowError('Publication date is invalid.');

    const uniqueAuthor = `Book Author ${Date.now()}`;
    const created = runResolver(mutation.bookCreate, {}, {
      input: {
        title: `Book ${Date.now()}`,
        description: 'Created book',
        publicationDate: '2020-01-01',
        author: uniqueAuthor,
      },
    }, context);

    expect(created).toMatchObject({
      success: true,
      message: 'Book added successfully',
      book: {
        title: expect.any(String),
      },
    });
    expect(context.apiClient.author.getByName(uniqueAuthor)).not.toBeNull();
  });

  it('validates and updates books', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.bookUpdate, {}, {
      input: {
        id: 'book-missing',
        title: 'Any',
      },
    }, context)).toThrowError('does not exist');

    expect(() => runResolver(mutation.bookUpdate, {}, {
      input: {
        id: 'book-1',
        title: ' ',
      },
    }, context)).toThrowError('Title must not be empty.');

    expect(() => runResolver(mutation.bookUpdate, {}, {
      input: {
        id: 'book-1',
        title: 'New title',
        description: 'New desc',
        author: ' ',
      },
    }, context)).toThrowError('Author must not be empty.');

    const updated = runResolver(mutation.bookUpdate, {}, {
      input: {
        id: 'book-1',
        title: 'The Awakening Updated',
        description: 'Updated description',
        publicationDate: '1899-04-22',
      },
    }, context);

    expect(updated).toMatchObject({
      success: true,
      message: 'Book updated successfully',
      book: {
        id: 'book-1',
        title: 'The Awakening Updated',
      },
    });
  });

  it('deletes books and removes references from tags', () => {
    const context = createTestGraphQLContext();
    const createdBook = context.apiClient.book.add({
      id: `book-delete-${Date.now()}`,
      title: 'Delete me',
      description: 'Delete me',
      publicationDate: '2020-02-01',
      genre: 'Literary Fiction',
      rating: 3.5,
      authorId: 'author-1',
    });

    const tagId = `tag-delete-${Date.now()}`;
    context.apiClient.tag.add({
      id: tagId,
      name: `Tag ${Date.now()}`,
      bookIds: [createdBook.id],
    });

    const deleted = runResolver(mutation.bookDelete, {}, {
      input: { id: createdBook.id },
    }, context);

    expect(deleted).toEqual({
      code: '200',
      success: true,
      message: 'Book deleted successfully',
    });
    expect(context.apiClient.tag.getById(tagId)?.bookIds).toEqual([]);

    expect(() => runResolver(mutation.bookDelete, {}, {
      input: { id: 'book-missing' },
    }, context)).toThrowError('does not exist');
  });

  it('resolves Book.author and Author.books relations', async () => {
    const context = createTestGraphQLContext();

    await expect(runResolver(bookResolvers.author, {
      id: 'book-1',
      title: 'The Awakening',
      description: 'A novella about personal autonomy, social constraint, and the cost of self-discovery in turn-of-the-century Louisiana.',
      publicationDate: '1899-04-22',
      author: { id: 'author-1' },
    }, {}, context)).resolves.toMatchObject({
      id: 'author-1',
      name: expect.any(String),
    });

    await expect(runResolver(authorResolvers.books, {
      id: 'author-1',
      name: 'Kate Chopin',
      bio: 'Bio',
      country: AuthorCountry.Us,
      isActive: false,
      birthDate: '1850-02-08',
    }, {}, context)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: { id: 'author-1' },
        }),
      ]),
    );

    await expect(runResolver(bookResolvers.author, {
      id: 'book-missing-author',
      title: 'Missing author book',
      description: 'Missing author',
      publicationDate: '2020-01-01',
      author: { id: 'author-missing' },
    }, {}, context)).rejects.toThrowError(GraphQLError);
  });
});
