import { describe, expect, it } from 'vitest';
import { createTagApiClient } from '../tagApiClient.js';

describe('tagApiClient', () => {
  it('supports getById/getByName/add/update/removeById flows', () => {
    const client = createTagApiClient();

    expect(client.getById('tag-1')?.name).toBe('Classic');
    expect(client.getByName('Classic')?.id).toBe('tag-1');
    expect(client.getById('tag-missing')).toBeNull();

    const created = client.add({
      id: 'tag-test-unit',
      name: 'Tag Unit',
      bookIds: ['book-1'],
    });
    expect(client.getByName('Tag Unit')?.id).toBe(created.id);

    const updated = client.update({
      ...created,
      name: 'Tag Unit Updated',
      bookIds: ['book-1', 'book-2'],
    });
    expect(updated?.name).toBe('Tag Unit Updated');
    expect(updated?.bookIds).toEqual(['book-1', 'book-2']);

    expect(client.update({
      ...created,
      id: 'tag-does-not-exist',
    })).toBeNull();

    expect(client.removeById(created.id)?.id).toBe(created.id);
    expect(client.removeById('tag-does-not-exist')).toBeNull();
  });
});
