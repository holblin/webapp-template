import http from 'http';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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

const backendDir = fileURLToPath(new URL('.', import.meta.url));
const candidateFrontendDistPaths = [
  // Runtime in Docker (cwd /app, backend from /app/packages/backend/dist)
  resolve(backendDir, '../../frontend/dist'),
  // Runtime after local compile from workspace root
  resolve(backendDir, '../../../frontend/dist'),
];
const frontendDistPath = candidateFrontendDistPaths.find((candidatePath) => existsSync(candidatePath));
const allowMissingFrontendDist = process.env.ALLOW_MISSING_FRONTEND_DIST === 'true';
if (!frontendDistPath && !allowMissingFrontendDist) {
  throw new Error('Frontend dist directory not found. Build the frontend before starting the backend.');
}

if (frontendDistPath) {
  app.use(express.static(frontendDistPath));
  app.use((request, response, next) => {
    if (request.path.startsWith('/graphql')) {
      next();
      return;
    }

    response.sendFile(join(frontendDistPath, 'index.html'));
  });
}

const port = Number.parseInt(process.env.PORT ?? '4000', 10);
await new Promise<void>((resolve) =>
  httpServer.listen({ port }, resolve),
);
console.log(`Server ready at http://localhost:${port}/`);
