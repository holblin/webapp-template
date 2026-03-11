import { existsSync, readFileSync } from 'fs';
import { GraphQLError } from 'graphql';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'url';
import type { BookRecord } from '../../../apiClient/bookApiClient.js';
import type { GraphQLContext } from '../../../context.js';
import { BookListSortBy, SortDirection } from '../../../__generated__/gql/resolvers-types.js';
import type {
  AuthorResolvers,
  BookResolvers,
  ResolversParentTypes,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from '../../../__generated__/gql/resolvers-types.js';
import { applyFuzzySearch } from '../shared/fuzzySearch.js';
import { buildConnection } from '../shared/pagination.js';

const bundledSchemaPath = fileURLToPath(new URL('./bookModule.graphql', import.meta.url));
const sourceSchemaPath = fileURLToPath(
  new URL('../../../../src/graphql/modules/book/bookModule.graphql', import.meta.url),
);
const schemaPath = existsSync(bundledSchemaPath) ? bundledSchemaPath : sourceSchemaPath;

const toBookParent = (record: BookRecord): ResolversParentTypes['Book'] => ({
  id: record.id,
  title: record.title,
  description: record.description,
  publicationDate: record.publicationDate,
  author: { id: record.authorId },
});

const queryResolvers: Pick<QueryResolvers, 'bookList' | 'bookById'> = {
  bookById: (_parent, args, context) => {
    const book = context.apiClient.book.getById(args.id);
    return book ? toBookParent(book) : null;
  },
  bookList: (_parent, args, context) => {
    const titleContains = args.filter?.titleContains?.trim().toLowerCase();
    const authorId = args.filter?.authorId;
    const tagId = args.filter?.tagId;
    const search = args.search?.trim().toLowerCase();
    const requestedSortBy = args.sort?.by ?? BookListSortBy.Title;
    const sortDirection = args.sort?.direction ?? SortDirection.Asc;
    const taggedBookIds = tagId ? new Set((context.apiClient.tag.getById(tagId)?.bookIds ?? [])) : null;
    const authorById = new Map(context.apiClient.author.list().map((author) => [author.id, author]));
    const tagNamesByBookId = new Map<string, string[]>();
    for (const tag of context.apiClient.tag.list()) {
      for (const taggedBookId of tag.bookIds) {
        const names = tagNamesByBookId.get(taggedBookId) ?? [];
        names.push(tag.name);
        tagNamesByBookId.set(taggedBookId, names);
      }
    }

    const filteredBooks = context.apiClient.book
      .list()
      .filter((record) => (
        (!authorId || record.authorId === authorId)
        && (!taggedBookIds || taggedBookIds.has(record.id))
        && (!titleContains || record.title.toLowerCase().includes(titleContains))
      ));

    const searchedBooks = applyFuzzySearch({
      items: filteredBooks.map((record) => ({
        record,
        title: record.title,
        description: record.description,
        publicationDate: record.publicationDate,
        authorName: authorById.get(record.authorId)?.name ?? '',
        tagNames: tagNamesByBookId.get(record.id) ?? [],
      })),
      search,
      keys: ['title', 'description', 'publicationDate', 'authorName', 'tagNames'],
    }).map((entry) => entry.record);

    const sortedBooks = searchedBooks
      .sort((left, right) => {
        const leftAuthorName = authorById.get(left.authorId)?.name ?? '';
        const rightAuthorName = authorById.get(right.authorId)?.name ?? '';
        const baseComparison = requestedSortBy === BookListSortBy.Id
          ? left.id.localeCompare(right.id)
          : requestedSortBy === BookListSortBy.AuthorName
            ? leftAuthorName.localeCompare(rightAuthorName)
            : left.title.localeCompare(right.title);

        return sortDirection === SortDirection.Desc ? -baseComparison : baseComparison;
      })
      .map((record) => toBookParent(record));

    return buildConnection({
      items: sortedBooks,
      offset: args.offset,
      limit: args.limit,
      after: args.after,
    });
  },
};

const getOrCreateAuthorId = (authorName: string, context: GraphQLContext): string => {
  let author = context.apiClient.author.getByName(authorName);
  if (!author) {
    author = {
      id: randomUUID(),
      name: authorName,
      bio: `Auto-generated author profile for ${authorName}.`,
      country: 'US',
      isActive: true,
      birthDate: '1970-01-01',
    };
    context.apiClient.author.add(author);
  }
  return author.id;
};

const toStoredPublicationDate = (value: Date | string): string => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new GraphQLError('Publication date is invalid.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    return value.toISOString().slice(0, 10);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new GraphQLError('Publication date must not be empty.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    throw new GraphQLError('Publication date is invalid.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  return parsed.toISOString().slice(0, 10);
};

const mutationResolvers: Pick<MutationResolvers, 'bookCreate' | 'bookUpdate' | 'bookDelete'> = {
  bookCreate: (_parent, args, context) => {
    const title = args.input.title.trim();
    const description = args.input.description.trim();
    const publicationDate = toStoredPublicationDate(args.input.publicationDate);
    const authorName = args.input.author.trim();

    if (!title) {
      throw new GraphQLError('Title must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (!authorName) {
      throw new GraphQLError('Author must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (!description) {
      throw new GraphQLError('Description must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    const newBookRecord = {
      id: randomUUID(),
      title,
      description,
      publicationDate,
      genre: 'Literary Fiction',
      rating: 3.5,
      authorId: getOrCreateAuthorId(authorName, context),
    };

    context.apiClient.book.add(newBookRecord);

    return {
      code: '200',
      success: true,
      message: 'Book added successfully',
      book: toBookParent(newBookRecord),
    };
  },
  bookUpdate: (_parent, args, context) => {
    const currentBook = context.apiClient.book.getById(args.input.id);
    if (!currentBook) {
      throw new GraphQLError(`Book "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const nextTitle = args.input.title === undefined ? currentBook.title : args.input.title.trim();
    const nextDescription = args.input.description === undefined
      ? currentBook.description
      : args.input.description.trim();
    const nextPublicationDate = args.input.publicationDate === undefined
      ? currentBook.publicationDate
      : toStoredPublicationDate(args.input.publicationDate);
    if (!nextTitle) {
      throw new GraphQLError('Title must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (!nextDescription) {
      throw new GraphQLError('Description must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    const nextAuthorId = args.input.author === undefined
      ? currentBook.authorId
      : (() => {
        const nextAuthorName = args.input.author.trim();
        if (!nextAuthorName) {
          throw new GraphQLError('Author must not be empty.', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        return getOrCreateAuthorId(nextAuthorName, context);
      })();

    const updatedBook = context.apiClient.book.update({
      id: currentBook.id,
      title: nextTitle,
      description: nextDescription,
      publicationDate: nextPublicationDate,
      genre: currentBook.genre,
      rating: currentBook.rating,
      authorId: nextAuthorId,
    });

    if (!updatedBook) {
      throw new GraphQLError(`Book "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    return {
      code: '200',
      success: true,
      message: 'Book updated successfully',
      book: toBookParent(updatedBook),
    };
  },
  bookDelete: (_parent, args, context) => {
    const deletedBook = context.apiClient.book.removeById(args.input.id);
    if (!deletedBook) {
      throw new GraphQLError(`Book "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    for (const tag of context.apiClient.tag.list()) {
      if (!tag.bookIds.includes(deletedBook.id)) {
        continue;
      }

      context.apiClient.tag.update({
        id: tag.id,
        name: tag.name,
        bookIds: tag.bookIds.filter((bookId) => bookId !== deletedBook.id),
      });
    }

    return {
      code: '200',
      success: true,
      message: 'Book deleted successfully',
    };
  },
};

const bookResolvers: Pick<BookResolvers, 'author'> = {
  author: async (parent, _args, context) => {
    const author = await context.loaders.authorById.load(parent.author.id);
    if (!author) {
      throw new GraphQLError(`Author not found for book ${parent.id}.`, {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
    return {
      id: author.id,
      name: author.name,
      bio: author.bio,
      country: author.country as ResolversParentTypes['Author']['country'],
      isActive: author.isActive,
      birthDate: author.birthDate,
    };
  },
};

const authorResolvers: Pick<AuthorResolvers, 'books'> = {
  books: async (parent, _args, context) => {
    const records = await context.loaders.booksByAuthorId.load(parent.id);
    return records.map((record) => toBookParent(record));
  },
};

export const typeDefs = readFileSync(schemaPath, { encoding: 'utf-8' });
export const domainResolvers: Pick<Resolvers, 'Query' | 'Mutation' | 'Book' | 'Author'> = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Book: bookResolvers,
  Author: authorResolvers,
};
