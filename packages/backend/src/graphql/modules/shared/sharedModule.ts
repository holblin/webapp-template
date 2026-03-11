import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const bundledSchemaPath = fileURLToPath(new URL('./sharedModule.graphql', import.meta.url));
const sourceSchemaPath = fileURLToPath(
  new URL('../../../../src/graphql/modules/shared/sharedModule.graphql', import.meta.url),
);
const schemaPath = existsSync(bundledSchemaPath) ? bundledSchemaPath : sourceSchemaPath;

export const typeDefs = readFileSync(schemaPath, { encoding: 'utf-8' });
