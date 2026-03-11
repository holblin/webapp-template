import type { PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  ApolloClientMock: vi.fn(function ApolloClientMock(this: { config: unknown }, config: unknown) {
    this.config = config;
  }),
  HttpLinkMock: vi.fn(function HttpLinkMock(this: { config: unknown }, config: unknown) {
    this.config = config;
  }),
  InMemoryCacheMock: vi.fn(function InMemoryCacheMock(this: { config: unknown }, config: unknown) {
    this.config = config;
  }),
  relayStylePaginationMock: vi.fn((keys: string[]) => ({ keys })),
  providerClient: null as unknown,
}));

vi.mock('@apollo/client', () => ({
  ApolloClient: mocks.ApolloClientMock,
  HttpLink: mocks.HttpLinkMock,
  InMemoryCache: mocks.InMemoryCacheMock,
}));

vi.mock('@apollo/client/react', () => ({
  ApolloProvider: ({ client, children }: PropsWithChildren<{ client: unknown }>) => {
    mocks.providerClient = client;
    return <div>{children}</div>;
  },
}));

vi.mock('@apollo/client/utilities', () => ({
  relayStylePagination: mocks.relayStylePaginationMock,
}));

describe('AppApolloProvider', () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.ApolloClientMock.mockClear();
    mocks.HttpLinkMock.mockClear();
    mocks.InMemoryCacheMock.mockClear();
    mocks.relayStylePaginationMock.mockClear();
    mocks.providerClient = null;
  });

  it('builds an Apollo client with relay pagination and renders children', async () => {
    const module = await import('../Apollo');
    const expectedUri = (import.meta.env.VITE_GRAPHQL_ENDPOINT as string | undefined) ?? '/graphql';

    const html = renderToStaticMarkup(
      <module.AppApolloProvider>
        <span>Apollo child</span>
      </module.AppApolloProvider>,
    );

    expect(html).toContain('Apollo child');
    expect(mocks.HttpLinkMock).toHaveBeenCalledWith({ uri: expectedUri });
    expect(mocks.relayStylePaginationMock).toHaveBeenCalledTimes(3);
    expect(mocks.relayStylePaginationMock).toHaveBeenCalledWith(['search', 'sort', 'filter']);

    const queryFields = (
      mocks.InMemoryCacheMock.mock.calls[0]?.[0] as {
        typePolicies: { Query: { fields: Record<string, unknown> } };
      }
    ).typePolicies.Query.fields;

    expect(queryFields.authorList).toEqual({ keys: ['search', 'sort', 'filter'] });
    expect(queryFields.bookList).toEqual({ keys: ['search', 'sort', 'filter'] });
    expect(queryFields.tagList).toEqual({ keys: ['search', 'sort', 'filter'] });
    expect(mocks.providerClient).toBe(mocks.ApolloClientMock.mock.instances[0]);
  });
});
