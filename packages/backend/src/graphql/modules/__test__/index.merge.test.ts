import { afterEach, describe, expect, it, vi } from 'vitest';

describe('graphql modules index merge', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unmock('../author/authorModule.js');
    vi.unmock('../book/bookModule.js');
    vi.unmock('../tag/tagModule.js');
    vi.unmock('../shared/sharedModule.js');
  });

  it('skips modules without domainResolvers and still merges valid modules', async () => {
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

    expect(module.typeDefs).toEqual(expect.arrayContaining([
      'scalar Date',
      'type Query { mockedBookById: ID }',
      'type Author { id: ID! }',
      'type Mutation { mockedDeleteTag: Boolean! }',
    ]));

    const query = module.resolvers.Query as Record<string, unknown> | undefined;
    const mutation = module.resolvers.Mutation as Record<string, unknown> | undefined;
    expect(query?.mockedBookById).toBeDefined();
    expect(mutation?.mockedDeleteTag).toBeDefined();
    expect(module.resolvers.Date).toBeDefined();
  });
});
