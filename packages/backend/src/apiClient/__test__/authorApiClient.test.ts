import { describe, expect, it } from 'vitest';
import { createAuthorApiClient } from '../authorApiClient.js';

describe('authorApiClient', () => {
  it('supports getById/getByName/add/update/removeById flows', () => {
    const client = createAuthorApiClient();

    expect(client.getById('author-1')?.name).toBe('Kate Chopin');
    expect(client.getByName('Kate Chopin')?.id).toBe('author-1');
    expect(client.getById('author-missing')).toBeNull();

    const created = client.add({
      id: 'author-test-unit',
      name: 'Author Unit',
      bio: 'Unit test bio',
      country: 'US',
      isActive: true,
      birthDate: '1980-01-01',
    });

    expect(client.getById(created.id)?.name).toBe('Author Unit');

    const updated = client.update({
      ...created,
      name: 'Author Unit Updated',
      bio: 'Updated bio',
    });
    expect(updated?.name).toBe('Author Unit Updated');
    expect(updated?.bio).toBe('Updated bio');

    expect(client.update({
      ...created,
      id: 'author-does-not-exist',
    })).toBeNull();

    expect(client.removeById(created.id)?.id).toBe(created.id);
    expect(client.removeById('author-does-not-exist')).toBeNull();
  });
});
