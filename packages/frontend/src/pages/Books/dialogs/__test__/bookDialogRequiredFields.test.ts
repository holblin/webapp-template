import { describe, expect, it } from 'vitest';
import { getBookDialogRequiredFieldError } from '../bookDialogRequiredFields';

describe('getBookDialogRequiredFieldError', () => {
  it('returns null when all required fields are present', () => {
    expect(
      getBookDialogRequiredFieldError({
        title: 'Dune',
        description: 'Sci-fi classic',
        authorName: 'Frank Herbert',
        publicationDate: '1965-08-01',
      }),
    ).toBeNull();
  });

  it('returns the first missing-field error message', () => {
    expect(
      getBookDialogRequiredFieldError({
        title: '',
        description: 'Sci-fi classic',
        authorName: 'Frank Herbert',
        publicationDate: '1965-08-01',
      }),
    ).toBe('Book title is required.');

    expect(
      getBookDialogRequiredFieldError({
        title: 'Dune',
        description: '',
        authorName: 'Frank Herbert',
        publicationDate: '1965-08-01',
      }),
    ).toBe('Book description is required.');

    expect(
      getBookDialogRequiredFieldError({
        title: 'Dune',
        description: 'Sci-fi classic',
        authorName: '',
        publicationDate: '1965-08-01',
      }),
    ).toBe('Author name is required.');

    expect(
      getBookDialogRequiredFieldError({
        title: 'Dune',
        description: 'Sci-fi classic',
        authorName: 'Frank Herbert',
        publicationDate: '',
      }),
    ).toBe('Publication date is required.');
  });
});
