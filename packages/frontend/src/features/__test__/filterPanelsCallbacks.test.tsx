/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AuthorCountry } from 'src/__generated__/gql/graphql';
import { AuthorFiltersPanel } from 'src/features/authors/filters/AuthorFiltersPanel';
import { BookFiltersPanel } from 'src/features/books/filters/BookFiltersPanel';
import { TagFiltersPanel } from 'src/features/tags/filters/TagFiltersPanel';

type ControlProps = Record<string, unknown>;

const mocks = vi.hoisted(() => ({
  textFieldProps: [] as ControlProps[],
  pickerProps: [] as ControlProps[],
  dateRangePickerProps: [] as ControlProps[],
  numberFieldProps: [] as ControlProps[],
}));

vi.mock('@react-spectrum/s2', () => {
  const passthrough = (tag: string) => (
    { children, ...props }: React.PropsWithChildren<ControlProps>,
  ) => React.createElement(tag, props, children);

  return {
    PickerItem: passthrough('option'),
    TextArea: passthrough('textarea'),
    TextField: ({ children, ...props }: React.PropsWithChildren<ControlProps>) => {
      mocks.textFieldProps.push(props);
      return React.createElement('input', props, children);
    },
    Picker: ({ children, ...props }: React.PropsWithChildren<ControlProps>) => {
      mocks.pickerProps.push(props);
      return React.createElement('div', props, children);
    },
    DateRangePicker: ({ children, ...props }: React.PropsWithChildren<ControlProps>) => {
      mocks.dateRangePickerProps.push(props);
      return React.createElement('div', props, children);
    },
    NumberField: ({ children, ...props }: React.PropsWithChildren<ControlProps>) => {
      mocks.numberFieldProps.push(props);
      return React.createElement('div', props, children);
    },
  };
});

describe('filter panel callbacks', () => {
  it('applies author filter callbacks', () => {
    mocks.textFieldProps.length = 0;
    mocks.pickerProps.length = 0;
    mocks.dateRangePickerProps.length = 0;
    mocks.numberFieldProps.length = 0;

    const onFiltersChange = vi.fn();

    renderToStaticMarkup(
      <AuthorFiltersPanel
        filters={{
          filterNameContains: '',
          filterCountry: '',
          filterIsActive: 'all',
          filterBirthDateFrom: '',
          filterBirthDateTo: '',
          filterHasBookTagId: '',
          filterHasBookGenre: '',
          filterMinBookCount: 0,
          filterPublishedAfterYear: 0,
          filterMinAverageBookRating: 0,
        }}
        tags={[{ id: 'tag-1', name: 'Tag 1' }]}
        onFiltersChange={onFiltersChange}
      />,
    );

    (mocks.textFieldProps[0].onChange as (value: string) => void)('alice');
    (mocks.pickerProps[0].onChange as (value: string) => void)(AuthorCountry.Fr);
    (mocks.pickerProps[1].onChange as (value: string) => void)('inactive');
    (mocks.dateRangePickerProps[0].onChange as (value: { start: { toString: () => string }; end: { toString: () => string } } | null) => void)({
      start: { toString: () => '1980-01-01' },
      end: { toString: () => '2000-12-31' },
    });
    (mocks.pickerProps[2].onChange as (value: string) => void)('tag-1');
    (mocks.pickerProps[3].onChange as (value: string) => void)('science-fiction');
    (mocks.numberFieldProps[0].onChange as (value: number | null) => void)(-5);
    (mocks.numberFieldProps[1].onChange as (value: number | null) => void)(1999.9);
    (mocks.numberFieldProps[2].onChange as (value: number | null) => void)(6);

    expect(onFiltersChange).toHaveBeenCalledWith({ filterNameContains: 'alice' });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterCountry: AuthorCountry.Fr });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterIsActive: 'inactive' });
    expect(onFiltersChange).toHaveBeenCalledWith({
      filterBirthDateFrom: '1980-01-01',
      filterBirthDateTo: '2000-12-31',
    });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterHasBookTagId: 'tag-1' });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterHasBookGenre: 'science-fiction' });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterMinBookCount: 0 });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterPublishedAfterYear: 1999 });
    expect(onFiltersChange).toHaveBeenCalledWith({ filterMinAverageBookRating: 5 });
  });

  it('applies book and tag filter callbacks', () => {
    mocks.textFieldProps.length = 0;
    mocks.pickerProps.length = 0;

    const onBookFiltersChange = vi.fn();
    const onTagFiltersChange = vi.fn();

    renderToStaticMarkup(
      <div>
        <BookFiltersPanel
          filters={{ filterTitleContains: '', filterAuthorId: '', filterTagId: '' }}
          authors={[{ id: 'author-1', name: 'Author 1' }]}
          tags={[{ id: 'tag-1', name: 'Tag 1' }]}
          onFiltersChange={onBookFiltersChange}
        />
        <TagFiltersPanel
          filters={{ filterNameContains: '', filterBookId: '' }}
          books={[{ id: 'book-1', title: 'Book 1' }]}
          onFiltersChange={onTagFiltersChange}
        />
      </div>,
    );

    (mocks.textFieldProps[0].onChange as (value: string) => void)('dune');
    (mocks.pickerProps[0].onChange as (value: string) => void)('author-1');
    (mocks.pickerProps[1].onChange as (value: string) => void)('tag-1');

    (mocks.textFieldProps[1].onChange as (value: string) => void)('history');
    (mocks.pickerProps[2].onChange as (value: string) => void)('book-1');

    expect(onBookFiltersChange).toHaveBeenCalledWith({ filterTitleContains: 'dune' });
    expect(onBookFiltersChange).toHaveBeenCalledWith({ filterAuthorId: 'author-1' });
    expect(onBookFiltersChange).toHaveBeenCalledWith({ filterTagId: 'tag-1' });
    expect(onTagFiltersChange).toHaveBeenCalledWith({ filterNameContains: 'history' });
    expect(onTagFiltersChange).toHaveBeenCalledWith({ filterBookId: 'book-1' });
  });
});
