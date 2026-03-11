export type TagRecord = {
  id: string;
  name: string;
  bookIds: string[];
};

const baseTags: TagRecord[] = [
  { id: 'tag-1', name: 'Classic', bookIds: ['book-1', 'book-3', 'book-5', 'book-7', 'book-9'] },
  { id: 'tag-2', name: 'Mystery', bookIds: ['book-2', 'book-4', 'book-6', 'book-8', 'book-10'] },
];

const generatedTags: TagRecord[] = Array.from({ length: 10 }, (_value, index) => {
  const id = index + 3;
  const startBookId = 11 + (index * 5);
  return {
    id: `tag-${id}`,
    name: `Tag ${String(id).padStart(2, '0')}`,
    bookIds: Array.from({ length: 5 }, (_bookValue, bookOffset) => `book-${startBookId + bookOffset}`),
  };
});

const tags: TagRecord[] = [...baseTags, ...generatedTags];

export const createTagApiClient = () => ({
  list: () => tags,
  getById: (id: string) => tags.find((tag) => tag.id === id) ?? null,
  getByName: (name: string) => tags.find((tag) => tag.name === name) ?? null,
  add: (tag: TagRecord) => {
    tags.push(tag);
    return tag;
  },
  update: (updatedTag: TagRecord) => {
    const index = tags.findIndex((tag) => tag.id === updatedTag.id);
    if (index === -1) {
      return null;
    }
    tags[index] = updatedTag;
    return tags[index];
  },
  removeById: (id: string) => {
    const index = tags.findIndex((tag) => tag.id === id);
    if (index === -1) {
      return null;
    }
    const [removedTag] = tags.splice(index, 1);
    return removedTag;
  },
});

export type TagApiClient = ReturnType<typeof createTagApiClient>;
