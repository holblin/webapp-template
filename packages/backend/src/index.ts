import http from 'http';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { randomUUID } from 'node:crypto';
import { createAuthorApiClient } from './apiClient/authorApiClient.js';
import { createBookApiClient } from './apiClient/bookApiClient.js';
import { createTagApiClient } from './apiClient/tagApiClient.js';
import type { GraphQLContext } from './context.js';
import { resolvers, typeDefs } from './graphql/modules/index.js';
import { createGraphQLLoaders } from './graphql/loaders.js';

const app = express();

const httpServer = http.createServer(app);
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async () => {
      const apiClient = {
        author: createAuthorApiClient(),
        book: createBookApiClient(),
        tag: createTagApiClient(),
      };

      return {
        requestId: randomUUID(),
        apiClient,
        loaders: createGraphQLLoaders(apiClient),
      };
    },
  }),
);

app.use(express.static('../frontend/dist'));

// Modified server startup
await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log('Server ready at http://localhost:4000/');
