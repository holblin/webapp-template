type AuthorCountryCode = 'US' | 'GB' | 'FR' | 'DE' | 'JP' | 'CA';

export type AuthorRecord = {
  id: string;
  name: string;
  bio: string;
  country: AuthorCountryCode;
  isActive: boolean;
  birthDate: string;
};

const baseAuthors: AuthorRecord[] = [
  {
    id: 'author-1',
    name: 'Kate Chopin',
    bio: 'American author known for exploring identity, freedom, and social expectations in late-19th-century fiction.',
    country: 'US',
    isActive: false,
    birthDate: '1850-02-08',
  },
  {
    id: 'author-2',
    name: 'Paul Auster',
    bio: 'American novelist and filmmaker whose work blends postmodern structure with themes of chance and authorship.',
    country: 'US',
    isActive: false,
    birthDate: '1947-02-03',
  },
];

const countryPool: AuthorCountryCode[] = ['US', 'GB', 'FR', 'DE', 'JP', 'CA'];

const generatedAuthors: AuthorRecord[] = Array.from({ length: 58 }, (_value, index) => {
  const id = index + 3;
  return {
    id: `author-${id}`,
    name: `Author ${String(id).padStart(2, '0')}`,
    bio: `Bio for Author ${String(id).padStart(2, '0')}: writes contemporary literary fiction with recurring themes of memory, place, and transformation.`,
    country: countryPool[index % countryPool.length],
    isActive: index % 3 !== 0,
    birthDate: `${1940 + (index % 55)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
  };
});

const authors: AuthorRecord[] = [...baseAuthors, ...generatedAuthors];

export const createAuthorApiClient = () => ({
  list: () => authors,
  getById: (id: string) => authors.find((author) => author.id === id) ?? null,
  getByName: (name: string) => authors.find((author) => author.name === name) ?? null,
  add: (author: AuthorRecord) => {
    authors.push(author);
    return author;
  },
  update: (updatedAuthor: AuthorRecord) => {
    const index = authors.findIndex((author) => author.id === updatedAuthor.id);
    if (index === -1) {
      return null;
    }
    authors[index] = updatedAuthor;
    return authors[index];
  },
  removeById: (id: string) => {
    const index = authors.findIndex((author) => author.id === id);
    if (index === -1) {
      return null;
    }
    const [removedAuthor] = authors.splice(index, 1);
    return removedAuthor;
  },
});

export type AuthorApiClient = ReturnType<typeof createAuthorApiClient>;
