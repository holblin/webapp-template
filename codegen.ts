
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  schema: 'packages/backend/src/graphql/modules/**/*.graphql',
  documents: "packages/frontend/src/**/*.{ts,tsx}",
  generates: {
    "packages/frontend/src/__generated__/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true
      }
    },
    "packages/backend/src/__generated__/gql/resolvers-types.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers"
      ],
      config: {
        useIndexSignature: true,
        contextType: '../../context#GraphQLContext',
        mappers: {
          Author: "../../graphql/types/resolverParentShape#ResolverParentShape<Author, 'books'>",
          Book: "../../graphql/types/resolverParentShape#ResolverParentShape<Book, 'tags', 'author'>",
          Tag: "../../graphql/types/resolverParentShape#ResolverParentShape<Tag, 'books'>",
        },
      }
    }
  }
};

export default config;
