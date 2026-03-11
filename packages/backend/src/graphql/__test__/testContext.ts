import { createAuthorApiClient } from '../../apiClient/authorApiClient.js';
import { createBookApiClient } from '../../apiClient/bookApiClient.js';
import { createTagApiClient } from '../../apiClient/tagApiClient.js';
import type { GraphQLContext } from '../../context.js';
import { createGraphQLLoaders } from '../loaders.js';

export const createTestGraphQLContext = (): GraphQLContext => {
  const apiClient = {
    author: createAuthorApiClient(),
    book: createBookApiClient(),
    tag: createTagApiClient(),
  };

  return {
    requestId: 'test-request-id',
    apiClient,
    loaders: createGraphQLLoaders(apiClient),
  };
};
