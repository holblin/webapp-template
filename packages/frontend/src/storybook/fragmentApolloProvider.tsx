import { ApolloClient, HttpLink, InMemoryCache, type NormalizedCacheObject } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

type FragmentApolloProviderProps = PropsWithChildren<{
  cacheData: NormalizedCacheObject;
}>;

export const FragmentApolloProvider = ({ children, cacheData }: FragmentApolloProviderProps) => {
  const client = useMemo(() => new ApolloClient({
    link: new HttpLink({ uri: '/graphql' }),
    cache: new InMemoryCache().restore(cacheData),
  }), [cacheData]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
