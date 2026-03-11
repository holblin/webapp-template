import { describe, expect, it } from 'vitest';
import { getRequiredFieldError } from '../validation';

describe('getRequiredFieldError', () => {
  it('returns null when all fields are present', () => {
    expect(getRequiredFieldError([
      { value: 'Author Name', message: 'name is required' },
      { value: 'Biography', message: 'bio is required' },
    ])).toBeNull();
  });

  it('returns the first missing field error', () => {
    expect(getRequiredFieldError([
      { value: '   ', message: 'name is required' },
      { value: '', message: 'bio is required' },
    ])).toBe('name is required');
  });
});
