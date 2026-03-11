import type { AuthorApiClient } from './apiClient/authorApiClient.js';
import type { BookApiClient } from './apiClient/bookApiClient.js';
import type { TagApiClient } from './apiClient/tagApiClient.js';
import type { GraphQLLoaders } from './graphql/loaders.js';

export interface GraphQLContext {
  requestId: string;
  apiClient: {
    author: AuthorApiClient;
    book: BookApiClient;
    tag: TagApiClient;
  };
  loaders: GraphQLLoaders;
}
