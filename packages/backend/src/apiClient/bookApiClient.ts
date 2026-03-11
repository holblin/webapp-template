export type BookRecord = {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  genre: string;
  rating: number;
  authorId: string;
};

const baseBooks: BookRecord[] = [
  {
    id: 'book-1',
    title: 'The Awakening',
    description: 'A novella about personal autonomy, social constraint, and the cost of self-discovery in turn-of-the-century Louisiana.',
    publicationDate: '1899-04-22',
    genre: 'Literary Fiction',
    rating: 4.2,
    authorId: 'author-1',
  },
  {
    id: 'book-2',
    title: 'City of Glass',
    description: 'A metafictional detective story that blurs identity, language, and reality within the streets of New York City.',
    publicationDate: '1985-03-12',
    genre: 'Mystery',
    rating: 4.0,
    authorId: 'author-2',
  },
];

const genrePool = [
  'Literary Fiction',
  'Mystery',
  'Sci-Fi',
  'Fantasy',
  'Historical',
  'Nonfiction',
];

const generatedBooks: BookRecord[] = Array.from({ length: 73 }, (_value, index) => {
  const id = index + 3;
  const authorId = ((index + 2) % 50) + 1;
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String((index % 28) + 1).padStart(2, '0');
  const year = 2000 + (index % 24);

  return {
    id: `book-${id}`,
    title: `Book Title ${String(id).padStart(3, '0')}`,
    description: `Description for Book Title ${String(id).padStart(3, '0')}: an original narrative focused on conflict, character growth, and a decisive final act.`,
    publicationDate: `${year}-${month}-${day}`,
    genre: genrePool[index % genrePool.length],
    rating: Math.round((2.5 + ((index % 26) / 10)) * 10) / 10,
    authorId: `author-${authorId}`,
  };
});

const books: BookRecord[] = [...baseBooks, ...generatedBooks];

export const createBookApiClient = () => ({
  list: () => books,
  getById: (id: string) => books.find((book) => book.id === id) ?? null,
  add: (book: BookRecord) => {
    books.push(book);
    return book;
  },
  update: (updatedBook: BookRecord) => {
    const index = books.findIndex((book) => book.id === updatedBook.id);
    if (index === -1) {
      return null;
    }
    books[index] = updatedBook;
    return books[index];
  },
  removeById: (id: string) => {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      return null;
    }
    const [removedBook] = books.splice(index, 1);
    return removedBook;
  },
});

export type BookApiClient = ReturnType<typeof createBookApiClient>;
