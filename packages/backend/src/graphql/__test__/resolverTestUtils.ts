import type { GraphQLResolveInfo } from 'graphql';
import type { Resolver, ResolverFn } from '../../__generated__/gql/resolvers-types.js';

const infoStub = {} as GraphQLResolveInfo;

const toResolverFn = <TResult, TParent, TContext, TArgs>(
  resolver: Resolver<TResult, TParent, TContext, TArgs> | undefined,
): ResolverFn<TResult, TParent, TContext, TArgs> => {
  if (!resolver) {
    throw new Error('Expected resolver to be defined in test.');
  }

  return typeof resolver === 'function' ? resolver : resolver.resolve;
};

export const runResolver = <TResult, TParent, TContext, TArgs>(
  resolver: Resolver<TResult, TParent, TContext, TArgs> | undefined,
  parent: TParent,
  args: TArgs,
  context: TContext,
) => toResolverFn(resolver)(parent, args, context, infoStub);
