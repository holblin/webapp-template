import express from 'express';
import { join } from 'node:path';

type RegisterStaticAssetsInput = {
  app: express.Express;
  frontendDistPath: string;
  storybookDistPath?: string;
};

export const registerStaticAssets = ({
  app,
  frontendDistPath,
  storybookDistPath,
}: RegisterStaticAssetsInput) => {
  app.use(express.static(frontendDistPath));

  if (storybookDistPath) {
    app.get('/storybook', (_request, response) => {
      response.sendFile(join(storybookDistPath, 'index.html'));
    });
    app.use('/storybook', express.static(storybookDistPath, { redirect: false }));
  }

  app.use((request, response, next) => {
    if (request.path.startsWith('/graphql') || request.path.startsWith('/storybook')) {
      next();
      return;
    }

    response.sendFile(join(frontendDistPath, 'index.html'));
  });
};
