import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import type { PropsWithChildren } from 'react';
import { ApolloProvider } from "@apollo/client/react";
import { relayStylePagination } from '@apollo/client/utilities';


const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT ?? '/graphql',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          authorList: relayStylePagination(['search', 'sort', 'filter']),
          bookList: relayStylePagination(['search', 'sort', 'filter']),
          tagList: relayStylePagination(['search', 'sort', 'filter']),
        },
      },
    },
  }),
});

export const AppApolloProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
