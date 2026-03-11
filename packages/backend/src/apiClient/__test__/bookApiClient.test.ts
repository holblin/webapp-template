import { describe, expect, it } from 'vitest';
import { createBookApiClient } from '../bookApiClient.js';

describe('bookApiClient', () => {
  it('supports get/add/update/remove operations', () => {
    const client = createBookApiClient();

    expect(client.getById('book-1')?.title).toBe('The Awakening');
    expect(client.getById('book-missing')).toBeNull();

    const created = client.add({
      id: 'book-test-unit',
      title: 'Book Unit',
      description: 'A unit test book',
      publicationDate: '2024-01-01',
      genre: 'Literary Fiction',
      rating: 4.1,
      authorId: 'author-1',
    });

    expect(client.getById(created.id)?.title).toBe('Book Unit');

    const updated = client.update({
      ...created,
      title: 'Book Unit Updated',
      description: 'Updated book description',
    });
    expect(updated?.title).toBe('Book Unit Updated');
    expect(updated?.description).toBe('Updated book description');

    expect(client.update({
      ...created,
      id: 'book-does-not-exist',
    })).toBeNull();

    expect(client.removeById(created.id)?.id).toBe(created.id);
    expect(client.removeById('book-does-not-exist')).toBeNull();
  });
});
