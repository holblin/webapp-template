import type { Resolvers } from '../../__generated__/gql/resolvers-types.js';
import { DateResolver } from 'graphql-scalars';
import * as authorModule from './author/authorModule.js';
import * as bookModule from './book/bookModule.js';
import * as tagModule from './tag/tagModule.js';
import { typeDefs as sharedTypeDefs } from './shared/sharedModule.js';

type GraphModule = {
  typeDefs: string;
  domainResolvers?: Resolvers;
};

const graphModules: GraphModule[] = [bookModule, authorModule, tagModule];

const mergeResolvers = (modules: GraphModule[]): Resolvers => {
  const merged: Resolvers = {};

  for (const graphModule of modules) {
    if (!graphModule.domainResolvers) {
      continue;
    }

    for (const [typeName, fields] of Object.entries(graphModule.domainResolvers)) {
      const resolverType = typeName as keyof Resolvers;
      const previous = (merged[resolverType] ?? {}) as Record<string, unknown>;

      merged[resolverType] = {
        ...previous,
        ...(fields as Record<string, unknown>),
      } as Resolvers[typeof resolverType];
    }
  }

  return merged;
};

export const typeDefs = [sharedTypeDefs, ...graphModules.map((graphModule) => graphModule.typeDefs)];
export const resolvers: Resolvers = {
  ...mergeResolvers(graphModules),
  Date: DateResolver as Resolvers['Date'],
};
