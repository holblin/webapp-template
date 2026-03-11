import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const bundledSchemaPath = fileURLToPath(new URL('./sharedModule.graphql', import.meta.url));
const sourceSchemaPath = join(process.cwd(), 'src', 'graphql', 'modules', 'shared', 'sharedModule.graphql');
const schemaPath = existsSync(bundledSchemaPath) ? bundledSchemaPath : sourceSchemaPath;

export const typeDefs = readFileSync(schemaPath, { encoding: 'utf-8' });
