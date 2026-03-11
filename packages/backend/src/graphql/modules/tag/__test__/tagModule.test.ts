import { GraphQLError } from 'graphql';
import { describe, expect, it } from 'vitest';
import { SortDirection, TagListSortBy } from '../../../../__generated__/gql/resolvers-types.js';
import { runResolver } from '../../../__test__/resolverTestUtils.js';
import { createTestGraphQLContext } from '../../../__test__/testContext.js';
import { domainResolvers } from '../tagModule.js';

const query = domainResolvers.Query as NonNullable<typeof domainResolvers.Query>;
const mutation = domainResolvers.Mutation as NonNullable<typeof domainResolvers.Mutation>;
const tagResolvers = domainResolvers.Tag as NonNullable<typeof domainResolvers.Tag>;
const bookResolvers = domainResolvers.Book as NonNullable<typeof domainResolvers.Book>;

describe('tagModule resolvers', () => {
  it('returns tagById and filtered/sorted tagList results', async () => {
    const context = createTestGraphQLContext();

    const byId = await runResolver(query.tagById, {}, { id: 'tag-1' }, context);
    expect(byId).toMatchObject({ id: 'tag-1', name: 'Classic' });

    const list = await runResolver(query.tagList, {}, {
      filter: {
        nameContains: 'classic',
        bookId: 'book-1',
      },
      search: 'classic',
      sort: {
        by: TagListSortBy.BookCount,
        direction: SortDirection.Desc,
      },
      offset: 0,
      limit: 10,
    }, context);
    const nodes = await Promise.all(list.nodes);

    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.some((tag) => tag.id === 'tag-1')).toBe(true);
  });

  it('validates and creates tags', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.tagCreate, {}, {
      input: { name: ' ', bookIds: [] },
    }, context)).toThrowError('Tag name must not be empty.');

    expect(() => runResolver(mutation.tagCreate, {}, {
      input: { name: 'Classic', bookIds: [] },
    }, context)).toThrowError('already exists');

    expect(() => runResolver(mutation.tagCreate, {}, {
      input: { name: 'Invalid refs', bookIds: ['book-missing'] },
    }, context)).toThrowError('does not exist');

    const uniqueName = `Tag Create ${Date.now()}`;
    const created = runResolver(mutation.tagCreate, {}, {
      input: { name: uniqueName, bookIds: ['book-1', 'book-1', 'book-2'] },
    }, context);

    expect(created).toMatchObject({
      success: true,
      message: 'Tag created successfully',
      tag: {
        name: uniqueName,
      },
    });
    expect(context.apiClient.tag.getByName(uniqueName)?.bookIds).toEqual(['book-1', 'book-2']);
  });

  it('validates and updates tags', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.tagUpdate, {}, {
      input: { id: 'tag-missing', name: 'Nope' },
    }, context)).toThrowError('does not exist');

    expect(() => runResolver(mutation.tagUpdate, {}, {
      input: { id: 'tag-1', name: ' ' },
    }, context)).toThrowError('Tag name must not be empty.');

    expect(() => runResolver(mutation.tagUpdate, {}, {
      input: { id: 'tag-1', name: 'Mystery' },
    }, context)).toThrowError('already exists');

    expect(() => runResolver(mutation.tagUpdate, {}, {
      input: { id: 'tag-1', name: 'Classic', bookIds: ['book-missing'] },
    }, context)).toThrowError('does not exist');

    const updated = runResolver(mutation.tagUpdate, {}, {
      input: { id: 'tag-1', name: 'Classic Updated', bookIds: ['book-1'] },
    }, context);

    expect(updated).toMatchObject({
      success: true,
      message: 'Tag updated successfully',
      tag: {
        id: 'tag-1',
        name: 'Classic Updated',
      },
    });
  });

  it('deletes tags and resolves relations', async () => {
    const context = createTestGraphQLContext();

    await expect(runResolver(tagResolvers.books, {
      id: 'tag-1',
      name: 'Classic',
    }, {}, context)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'book-1' }),
      ]),
    );

    await expect(runResolver(bookResolvers.tags, {
      id: 'book-1',
      title: 'The Awakening',
      description: 'A novella about personal autonomy, social constraint, and the cost of self-discovery in turn-of-the-century Louisiana.',
      publicationDate: '1899-04-22',
      author: {
        id: 'author-1',
      },
    }, {}, context)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'tag-1' }),
      ]),
    );

    const created = context.apiClient.tag.add({
      id: `tag-delete-${Date.now()}`,
      name: `Tag Delete ${Date.now()}`,
      bookIds: [],
    });

    const deleted = runResolver(mutation.tagDelete, {}, {
      input: { id: created.id },
    }, context);

    expect(deleted).toEqual({
      code: '200',
      success: true,
      message: 'Tag deleted successfully',
    });

    expect(() => runResolver(mutation.tagDelete, {}, {
      input: { id: 'tag-missing' },
    }, context)).toThrowError(GraphQLError);
  });
});
