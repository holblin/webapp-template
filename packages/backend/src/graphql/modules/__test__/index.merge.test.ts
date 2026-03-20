import { afterEach, describe, expect, it, vi } from 'vitest';

describe('graphql modules index merge', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('skips modules without domainResolvers and still merges valid modules', async () => {
    vi.resetModules();

    vi.doMock('../author/authorModule.js', () => ({
      typeDefs: 'type Author { id: ID! }',
      domainResolvers: undefined,
    }));

    vi.doMock('../book/bookModule.js', () => ({
      typeDefs: 'type Query { mockedBookById: ID }',
      domainResolvers: {
        Query: {
          mockedBookById: () => ({ id: 'book-1' }),
        },
      },
    }));

    vi.doMock('../tag/tagModule.js', () => ({
      typeDefs: 'type Mutation { mockedDeleteTag: Boolean! }',
      domainResolvers: {
        Mutation: {
          mockedDeleteTag: () => true,
        },
      },
    }));

    vi.doMock('../shared/sharedModule.js', () => ({
      typeDefs: 'scalar Date',
    }));

    const module = await import('../index.js');
    const mergedTypeDefs = module.typeDefs.join('\n');

    expect(mergedTypeDefs).toContain('scalar Date');
    expect(mergedTypeDefs).toContain('type Query { mockedBookById: ID }');
    expect(mergedTypeDefs).toContain('type Author { id: ID! }');
    expect(mergedTypeDefs).toContain('type Mutation { mockedDeleteTag: Boolean! }');

    const query = module.resolvers.Query as Record<string, unknown> | undefined;
    const mutation = module.resolvers.Mutation as Record<string, unknown> | undefined;
    expect(query?.mockedBookById).toBeDefined();
    expect(mutation?.mockedDeleteTag).toBeDefined();
    expect(module.resolvers.Date).toBeDefined();
  });
});
