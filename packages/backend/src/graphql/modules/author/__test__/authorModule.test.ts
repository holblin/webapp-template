import { GraphQLError } from 'graphql';
import { describe, expect, it } from 'vitest';
import { AuthorCountry, AuthorListSortBy, SortDirection } from '../../../../__generated__/gql/resolvers-types.js';
import { runResolver } from '../../../__test__/resolverTestUtils.js';
import { createTestGraphQLContext } from '../../../__test__/testContext.js';
import { domainResolvers } from '../authorModule.js';

const query = domainResolvers.Query as NonNullable<typeof domainResolvers.Query>;
const mutation = domainResolvers.Mutation as NonNullable<typeof domainResolvers.Mutation>;

describe('authorModule resolvers', () => {
  it('returns authorById and filtered/sorted authorList results', async () => {
    const context = createTestGraphQLContext();

    const byId = await runResolver(query.authorById, {}, { id: 'author-1' }, context);
    expect(byId).toMatchObject({ id: 'author-1', name: 'Kate Chopin' });

    const list = await runResolver(query.authorList, {}, {
      filter: {
        country: AuthorCountry.Us,
        isActive: false,
      },
      search: 'kate',
      sort: {
        by: AuthorListSortBy.Name,
        direction: SortDirection.Asc,
      },
      offset: 0,
      limit: 5,
    }, context);
    const nodes = await Promise.all(list.nodes);

    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.every((author) => author.country === AuthorCountry.Us)).toBe(true);
    expect(nodes.every((author) => author.isActive === false)).toBe(true);
  });

  it('throws on invalid date filters', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(query.authorList, {}, {
      filter: { birthDateFrom: 'not-a-date' },
      offset: 0,
      limit: 20,
    }, context)).toThrowError(GraphQLError);
  });

  it('validates and creates authors', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.authorCreate, {}, {
      input: {
        name: ' ',
        bio: 'Bio',
        country: AuthorCountry.Us,
        isActive: true,
        birthDate: '1990-01-01',
      },
    }, context)).toThrowError('Author name must not be empty.');

    expect(() => runResolver(mutation.authorCreate, {}, {
      input: {
        name: 'Kate Chopin',
        bio: 'Bio',
        country: AuthorCountry.Us,
        isActive: true,
        birthDate: '1990-01-01',
      },
    }, context)).toThrowError('already exists');

    expect(() => runResolver(mutation.authorCreate, {}, {
      input: {
        name: 'Unique Author',
        bio: 'Bio',
        country: AuthorCountry.Us,
        isActive: true,
        birthDate: new Date('bad-date'),
      },
    }, context)).toThrowError('Date value is invalid.');

    const uniqueName = `Author Create ${Date.now()}`;
    const created = runResolver(mutation.authorCreate, {}, {
      input: {
        name: uniqueName,
        bio: 'Created by unit test',
        country: AuthorCountry.Ca,
        isActive: true,
        birthDate: '1991-03-20',
      },
    }, context);

    expect(created).toMatchObject({
      success: true,
      message: 'Author created successfully',
      author: {
        name: uniqueName,
        country: AuthorCountry.Ca,
        birthDate: '1991-03-20',
      },
    });
  });

  it('validates and updates authors', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.authorUpdate, {}, {
      input: {
        id: 'author-missing',
        name: 'Nobody',
        bio: 'Bio',
        country: AuthorCountry.Us,
        isActive: true,
        birthDate: '1990-01-01',
      },
    }, context)).toThrowError('does not exist');

    expect(() => runResolver(mutation.authorUpdate, {}, {
      input: {
        id: 'author-1',
        name: 'Paul Auster',
        bio: 'Bio',
        country: AuthorCountry.Us,
        isActive: true,
        birthDate: '1990-01-01',
      },
    }, context)).toThrowError('already exists');

    const updated = runResolver(mutation.authorUpdate, {}, {
      input: {
        id: 'author-1',
        name: 'Kate Chopin',
        bio: 'Updated bio text for tests',
        country: AuthorCountry.Gb,
        isActive: false,
        birthDate: '1850-02-08',
      },
    }, context);

    expect(updated).toMatchObject({
      success: true,
      message: 'Author updated successfully',
      author: {
        id: 'author-1',
        country: AuthorCountry.Gb,
      },
    });
  });

  it('blocks deletion for linked authors and deletes standalone authors', () => {
    const context = createTestGraphQLContext();

    expect(() => runResolver(mutation.authorDelete, {}, {
      input: { id: 'author-1' },
    }, context)).toThrowError('still has books');

    const authorId = `author-delete-${Date.now()}`;
    context.apiClient.author.add({
      id: authorId,
      name: `Delete ${Date.now()}`,
      bio: 'delete test',
      country: 'US',
      isActive: true,
      birthDate: '1999-01-01',
    });

    const deleted = runResolver(mutation.authorDelete, {}, {
      input: { id: authorId },
    }, context);

    expect(deleted).toEqual({
      code: '200',
      success: true,
      message: 'Author deleted successfully',
    });
  });
});
