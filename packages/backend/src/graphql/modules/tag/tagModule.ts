import { existsSync, readFileSync } from 'fs';
import { GraphQLError } from 'graphql';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'url';
import type { BookApiClient } from '../../../apiClient/bookApiClient.js';
import type { TagRecord } from '../../../apiClient/tagApiClient.js';
import { SortDirection, TagListSortBy } from '../../../__generated__/gql/resolvers-types.js';
import type {
  BookResolvers,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ResolversParentTypes,
  TagResolvers,
} from '../../../__generated__/gql/resolvers-types.js';
import { applyFuzzySearch } from '../shared/fuzzySearch.js';
import { buildConnection } from '../shared/pagination.js';

const bundledSchemaPath = fileURLToPath(new URL('./tagModule.graphql', import.meta.url));
const sourceSchemaPath = fileURLToPath(
  new URL('../../../../src/graphql/modules/tag/tagModule.graphql', import.meta.url),
);
const schemaPath = existsSync(bundledSchemaPath) ? bundledSchemaPath : sourceSchemaPath;

const toTagParent = (record: TagRecord): ResolversParentTypes['Tag'] => ({
  id: record.id,
  name: record.name,
});

const normalizeBookIds = (bookIds: readonly string[]): string[] => [...new Set(bookIds)];

const assertBooksExist = (bookIds: readonly string[], getBookById: BookApiClient['getById']) => {
  for (const bookId of bookIds) {
    if (!getBookById(bookId)) {
      throw new GraphQLError(`Book "${bookId}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }
};

const queryResolvers: Pick<QueryResolvers, 'tagList' | 'tagById'> = {
  tagById: (_parent, args, context) => {
    const tag = context.apiClient.tag.getById(args.id);
    return tag ? toTagParent(tag) : null;
  },
  tagList: (_parent, args, context) => {
    const nameContains = args.filter?.nameContains?.trim().toLowerCase();
    const bookId = args.filter?.bookId;
    const search = args.search?.trim().toLowerCase();
    const requestedSortBy = args.sort?.by ?? TagListSortBy.Name;
    const sortDirection = args.sort?.direction ?? SortDirection.Asc;
    const bookById = new Map(context.apiClient.book.list().map((book) => [book.id, book]));

    const filteredTags = context.apiClient.tag
      .list()
      .filter((tag) => (
        (!nameContains || tag.name.toLowerCase().includes(nameContains))
        && (!bookId || tag.bookIds.includes(bookId))
      ));

    const searchedTags = applyFuzzySearch({
      items: filteredTags.map((tag) => ({
        tag,
        name: tag.name,
        bookTitles: tag.bookIds
          .map((linkedBookId) => bookById.get(linkedBookId)?.title)
          .filter((title): title is string => Boolean(title)),
      })),
      search,
      keys: ['name', 'bookTitles'],
    }).map((entry) => entry.tag);

    const sortedTags = searchedTags
      .sort((left, right) => {
        const baseComparison = requestedSortBy === TagListSortBy.Id
          ? left.id.localeCompare(right.id)
          : requestedSortBy === TagListSortBy.BookCount
            ? left.bookIds.length - right.bookIds.length
            : left.name.localeCompare(right.name);

        return sortDirection === SortDirection.Desc ? -baseComparison : baseComparison;
      })
      .map((tag) => toTagParent(tag));

    return buildConnection({
      items: sortedTags,
      offset: args.offset,
      limit: args.limit,
      after: args.after,
    });
  },
};

const mutationResolvers: Pick<MutationResolvers, 'tagCreate' | 'tagUpdate' | 'tagDelete'> = {
  tagCreate: (_parent, args, context) => {
    const name = args.input.name.trim();
    if (!name) {
      throw new GraphQLError('Tag name must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (context.apiClient.tag.getByName(name)) {
      throw new GraphQLError(`Tag "${name}" already exists.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const requestedBookIds = normalizeBookIds(args.input.bookIds ?? []);
    assertBooksExist(requestedBookIds, context.apiClient.book.getById);

    const newTag = context.apiClient.tag.add({
      id: randomUUID(),
      name,
      bookIds: requestedBookIds,
    });

    return {
      code: '200',
      success: true,
      message: 'Tag created successfully',
      tag: toTagParent(newTag),
    };
  },
  tagUpdate: (_parent, args, context) => {
    const currentTag = context.apiClient.tag.getById(args.input.id);
    if (!currentTag) {
      throw new GraphQLError(`Tag "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const nextName = args.input.name === undefined ? currentTag.name : args.input.name.trim();
    if (!nextName) {
      throw new GraphQLError('Tag name must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const existingByName = context.apiClient.tag.getByName(nextName);
    if (existingByName && existingByName.id !== currentTag.id) {
      throw new GraphQLError(`Tag "${nextName}" already exists.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const nextBookIds = args.input.bookIds === undefined
      ? currentTag.bookIds
      : normalizeBookIds(args.input.bookIds);

    assertBooksExist(nextBookIds, context.apiClient.book.getById);

    const updatedTag = context.apiClient.tag.update({
      id: currentTag.id,
      name: nextName,
      bookIds: nextBookIds,
    });

    if (!updatedTag) {
      throw new GraphQLError(`Tag "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    return {
      code: '200',
      success: true,
      message: 'Tag updated successfully',
      tag: toTagParent(updatedTag),
    };
  },
  tagDelete: (_parent, args, context) => {
    const deletedTag = context.apiClient.tag.removeById(args.input.id);
    if (!deletedTag) {
      throw new GraphQLError(`Tag "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    return {
      code: '200',
      success: true,
      message: 'Tag deleted successfully',
    };
  },
};

const tagResolvers: Pick<TagResolvers, 'books'> = {
  books: async (parent, _args, context) => {
    const books = await context.loaders.booksByTagId.load(parent.id);
    return books.map((book) => ({
      id: book.id,
      title: book.title,
      description: book.description,
      publicationDate: book.publicationDate,
      author: { id: book.authorId },
    }));
  },
};

const bookResolvers: Pick<BookResolvers, 'tags'> = {
  tags: async (parent, _args, context) => {
    const tags = await context.loaders.tagsByBookId.load(parent.id);
    return tags.map((tag) => toTagParent(tag));
  },
};

export const typeDefs = readFileSync(schemaPath, { encoding: 'utf-8' });
export const domainResolvers: Pick<Resolvers, 'Query' | 'Mutation' | 'Tag' | 'Book'> = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Tag: tagResolvers,
  Book: bookResolvers,
};
