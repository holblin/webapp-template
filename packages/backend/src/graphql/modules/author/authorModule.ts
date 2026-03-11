import { existsSync, readFileSync } from 'fs';
import { GraphQLError } from 'graphql';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'url';
import {
  AuthorListSortBy,
  SortDirection,
  type MutationResolvers,
  type QueryResolvers,
  type Resolvers,
  type ResolversParentTypes,
} from '../../../__generated__/gql/resolvers-types.js';
import { applyFuzzySearch } from '../shared/fuzzySearch.js';
import { buildConnection } from '../shared/pagination.js';

const bundledSchemaPath = fileURLToPath(new URL('./authorModule.graphql', import.meta.url));
const sourceSchemaPath = fileURLToPath(
  new URL('../../../../src/graphql/modules/author/authorModule.graphql', import.meta.url),
);
const schemaPath = existsSync(bundledSchemaPath) ? bundledSchemaPath : sourceSchemaPath;

const toAuthorCountry = (country: string): ResolversParentTypes['Author']['country'] => {
  return country as ResolversParentTypes['Author']['country'];
};

const toAuthorParent = (
  author: {
    id: string;
    name: string;
    bio: string;
    country: string;
    isActive: boolean;
    birthDate: string;
  },
): ResolversParentTypes['Author'] => ({
  id: author.id,
  name: author.name,
  bio: author.bio,
  country: toAuthorCountry(author.country),
  isActive: author.isActive,
  birthDate: author.birthDate,
});

const toStoredDate = (value: Date | string): string => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new GraphQLError('Date value is invalid.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    return value.toISOString().slice(0, 10);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new GraphQLError('Date value must not be empty.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    throw new GraphQLError('Date value is invalid.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  return parsed.toISOString().slice(0, 10);
};

const queryResolvers: Pick<QueryResolvers, 'authorList' | 'authorById'> = {
  authorById: (_parent, args, context) => {
    const author = context.apiClient.author.getById(args.id);
    return author ? toAuthorParent(author) : null;
  },
  authorList: (_parent, args, context) => {
    const filterNameContains = args.filter?.nameContains?.trim().toLowerCase();
    const filterCountry = args.filter?.country;
    const filterIsActive = args.filter?.isActive;
    const filterBirthDateFrom = args.filter?.birthDateFrom ? toStoredDate(args.filter.birthDateFrom) : null;
    const filterBirthDateTo = args.filter?.birthDateTo ? toStoredDate(args.filter.birthDateTo) : null;
    const filterHasBookTagId = args.filter?.hasBookTagId;
    const filterHasBookGenre = args.filter?.hasBookGenre?.trim().toLowerCase();
    const filterMinBookCount = args.filter?.minBookCount;
    const filterPublishedAfterYear = args.filter?.publishedAfterYear;
    const filterMinAverageBookRating = args.filter?.minAverageBookRating;
    const search = args.search?.trim().toLowerCase();
    const requestedSortBy = args.sort?.by ?? AuthorListSortBy.Name;
    const sortDirection = args.sort?.direction ?? SortDirection.Asc;

    const taggedBookIds = new Set(
      filterHasBookTagId ? (context.apiClient.tag.getById(filterHasBookTagId)?.bookIds ?? []) : [],
    );
    const booksByAuthorId = new Map<string, ReturnType<typeof context.apiClient.book.list>>();
    const bookTitlesByAuthorId = new Map<string, string[]>();
    for (const book of context.apiClient.book.list()) {
      const books = booksByAuthorId.get(book.authorId) ?? [];
      books.push(book);
      booksByAuthorId.set(book.authorId, books);

      const titles = bookTitlesByAuthorId.get(book.authorId) ?? [];
      titles.push(book.title);
      bookTitlesByAuthorId.set(book.authorId, titles);
    }

    const filteredAuthors = context.apiClient.author
      .list()
      .filter((author) => {
        const authorBooks = booksByAuthorId.get(author.id) ?? [];
        const bookCount = authorBooks.length;
        const averageRating = bookCount === 0
          ? 0
          : authorBooks.reduce((sum, book) => sum + book.rating, 0) / bookCount;

        return (!filterNameContains || author.name.toLowerCase().includes(filterNameContains))
          && (!filterCountry || author.country === filterCountry)
          && (filterIsActive === null || filterIsActive === undefined || author.isActive === filterIsActive)
          && (!filterBirthDateFrom || author.birthDate >= filterBirthDateFrom)
          && (!filterBirthDateTo || author.birthDate <= filterBirthDateTo)
          && (filterMinBookCount === null || filterMinBookCount === undefined || bookCount > filterMinBookCount)
          && (!filterHasBookGenre || authorBooks.some((book) => book.genre.toLowerCase() === filterHasBookGenre))
          && (!filterPublishedAfterYear || authorBooks.some((book) => Number.parseInt(book.publicationDate.slice(0, 4), 10) > filterPublishedAfterYear))
          && (filterMinAverageBookRating === null || filterMinAverageBookRating === undefined || averageRating > filterMinAverageBookRating)
          && (!filterHasBookTagId || authorBooks.some((book) => taggedBookIds.has(book.id)));
      });

    const searchedAuthors = applyFuzzySearch({
      items: filteredAuthors.map((author) => ({
        author,
        name: author.name,
        bio: author.bio,
        country: author.country,
        bookTitles: bookTitlesByAuthorId.get(author.id) ?? [],
      })),
      search,
      keys: ['name', 'bio', 'country', 'bookTitles'],
    }).map((entry) => entry.author);

    const sortedAuthors = searchedAuthors
      .sort((left, right) => {
        const baseComparison = requestedSortBy === AuthorListSortBy.Id
          ? left.id.localeCompare(right.id)
          : left.name.localeCompare(right.name);

        return sortDirection === SortDirection.Desc ? -baseComparison : baseComparison;
      })
      .map((author) => toAuthorParent(author));

    return buildConnection({
      items: sortedAuthors,
      offset: args.offset,
      limit: args.limit,
      after: args.after,
    });
  },
};

const mutationResolvers: Pick<MutationResolvers, 'authorCreate' | 'authorUpdate' | 'authorDelete'> = {
  authorCreate: (_parent, args, context) => {
    const name = args.input.name.trim();
    const bio = args.input.bio.trim();
    const country = args.input.country;
    const birthDate = toStoredDate(args.input.birthDate);
    if (!name) {
      throw new GraphQLError('Author name must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (!bio) {
      throw new GraphQLError('Author bio must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (context.apiClient.author.getByName(name)) {
      throw new GraphQLError(`Author "${name}" already exists.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const createdAuthor = context.apiClient.author.add({
      id: randomUUID(),
      name,
      bio,
      country,
      isActive: args.input.isActive,
      birthDate,
    });

    return {
      code: '200',
      success: true,
      message: 'Author created successfully',
      author: toAuthorParent(createdAuthor),
    };
  },
  authorUpdate: (_parent, args, context) => {
    const currentAuthor = context.apiClient.author.getById(args.input.id);
    if (!currentAuthor) {
      throw new GraphQLError(`Author "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const name = args.input.name.trim();
    const country = args.input.country;
    const birthDate = toStoredDate(args.input.birthDate);
    if (!name) {
      throw new GraphQLError('Author name must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const existingByName = context.apiClient.author.getByName(name);
    if (existingByName && existingByName.id !== currentAuthor.id) {
      throw new GraphQLError(`Author "${name}" already exists.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const bio = args.input.bio.trim();
    if (!bio) {
      throw new GraphQLError('Author bio must not be empty.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    const updatedAuthor = context.apiClient.author.update({
      id: currentAuthor.id,
      name,
      bio,
      country,
      isActive: args.input.isActive,
      birthDate,
    });

    if (!updatedAuthor) {
      throw new GraphQLError(`Author "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    return {
      code: '200',
      success: true,
      message: 'Author updated successfully',
      author: toAuthorParent(updatedAuthor),
    };
  },
  authorDelete: (_parent, args, context) => {
    const booksByAuthor = context.apiClient.book.list().some((book) => book.authorId === args.input.id);
    if (booksByAuthor) {
      throw new GraphQLError('Cannot delete an author that still has books.', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const deletedAuthor = context.apiClient.author.removeById(args.input.id);
    if (!deletedAuthor) {
      throw new GraphQLError(`Author "${args.input.id}" does not exist.`, {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    return {
      code: '200',
      success: true,
      message: 'Author deleted successfully',
    };
  },
};

export const typeDefs = readFileSync(schemaPath, { encoding: 'utf-8' });
export const domainResolvers: Pick<Resolvers, 'Query' | 'Mutation'> = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
