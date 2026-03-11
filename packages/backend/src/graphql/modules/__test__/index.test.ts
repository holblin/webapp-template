import { describe, expect, it } from 'vitest';
import { createTestGraphQLContext } from '../../__test__/testContext.js';
import { runResolver } from '../../__test__/resolverTestUtils.js';
import { resolvers, typeDefs } from '../index.js';

describe('graphql modules index', () => {
  it('merges module typeDefs and resolvers', () => {
    expect(Array.isArray(typeDefs)).toBe(true);
    expect(typeDefs.length).toBeGreaterThan(1);

    expect(resolvers.Query).toBeDefined();
    expect(resolvers.Mutation).toBeDefined();
    expect(resolvers.Date).toBeDefined();
  });

  it('exposes merged query resolvers from domain modules', async () => {
    const context = createTestGraphQLContext();
    const query = resolvers.Query as NonNullable<typeof resolvers.Query>;

    const author = await runResolver(
      query.authorById,
      {},
      { id: 'author-1' },
      context,
    );
    const book = await runResolver(
      query.bookById,
      {},
      { id: 'book-1' },
      context,
    );
    const tag = await runResolver(
      query.tagById,
      {},
      { id: 'tag-1' },
      context,
    );

    expect(author).toMatchObject({ id: 'author-1' });
    expect(book).toMatchObject({ id: 'book-1' });
    expect(tag).toMatchObject({ id: 'tag-1' });
  });
});
