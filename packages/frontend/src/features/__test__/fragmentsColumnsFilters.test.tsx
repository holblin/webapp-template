/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useFragmentMock: vi.fn(),
}));

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
  iconStyle: () => '',
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const renderProp = children as unknown;
      if (typeof renderProp === 'function') {
        return React.createElement(tag, props, (renderProp as (args: { id: string }) => React.ReactNode)({ id: 'row-1' }));
      }
      return React.createElement(tag, props, children);
    };
  };

  return {
    ActionButton: component('button'),
    DateRangePicker: component('div'),
    NumberField: component('div'),
    Picker: component('div'),
    PickerItem: component('option'),
    TextField: component('input'),
    TextArea: component('textarea'),
  };
});

vi.mock('@apollo/client/react', () => ({
  useFragment: mocks.useFragmentMock,
}));

import { createAuthorInventoryColumns } from 'src/features/authors/columns/authorInventoryColumns';
import { AuthorFiltersPanel } from 'src/features/authors/filters/AuthorFiltersPanel';
import { AuthorActionsCell } from 'src/features/authors/fragments/AuthorActionsCell/AuthorActionsCell';
import { AuthorBioCell } from 'src/features/authors/fragments/AuthorBioCell/AuthorBioCell';
import { AuthorBirthDateCell } from 'src/features/authors/fragments/AuthorBirthDateCell/AuthorBirthDateCell';
import { AuthorBooksCountCell } from 'src/features/authors/fragments/AuthorBooksCountCell/AuthorBooksCountCell';
import { AuthorCountryCell } from 'src/features/authors/fragments/AuthorCountryCell/AuthorCountryCell';
import { AuthorIdCell } from 'src/features/authors/fragments/AuthorIdCell/AuthorIdCell';
import { AuthorIsActiveCell } from 'src/features/authors/fragments/AuthorIsActiveCell/AuthorIsActiveCell';
import { AuthorNameCell } from 'src/features/authors/fragments/AuthorNameCell/AuthorNameCell';
import { createBookInventoryColumns } from 'src/features/books/columns/bookInventoryColumns';
import { BookFiltersPanel } from 'src/features/books/filters/BookFiltersPanel';
import { BookActionsCell } from 'src/features/books/fragments/BookActionsCell/BookActionsCell';
import { BookAuthorCell } from 'src/features/books/fragments/BookAuthorCell/BookAuthorCell';
import { BookDescriptionCell } from 'src/features/books/fragments/BookDescriptionCell/BookDescriptionCell';
import { BookIdCell } from 'src/features/books/fragments/BookIdCell/BookIdCell';
import { BookPublicationDateCell } from 'src/features/books/fragments/BookPublicationDateCell/BookPublicationDateCell';
import { BookTagsCell } from 'src/features/books/fragments/BookTagsCell/BookTagsCell';
import { BookTitleCell } from 'src/features/books/fragments/BookTitleCell/BookTitleCell';
import { createTagInventoryColumns } from 'src/features/tags/columns/tagInventoryColumns';
import { TagFiltersPanel } from 'src/features/tags/filters/TagFiltersPanel';
import { TagActionsCell } from 'src/features/tags/fragments/TagActionsCell/TagActionsCell';
import { TagBooksCell } from 'src/features/tags/fragments/TagBooksCell/TagBooksCell';
import { TagBooksCountCell } from 'src/features/tags/fragments/TagBooksCountCell/TagBooksCountCell';
import { TagIdCell } from 'src/features/tags/fragments/TagIdCell/TagIdCell';
import { TagNameCell } from 'src/features/tags/fragments/TagNameCell/TagNameCell';

describe('feature fragments, columns and filter panels', () => {
  it('renders author/book/tag fragment cells with mocked fragment data', () => {
    mocks.useFragmentMock.mockImplementation(({ from }: { from: { __typename: string } }) => {
      if (from.__typename === 'Author') {
        return {
          data: {
            id: 'author-1',
            name: 'Author Name',
            bio: 'Author Bio',
            country: 'US',
            isActive: true,
            birthDate: '1990-01-01',
            books: [{ id: 'book-1' }, { id: 'book-2' }],
          },
        };
      }

      if (from.__typename === 'Book') {
        return {
          data: {
            id: 'book-1',
            title: 'Book Title',
            description: 'Book Description',
            publicationDate: '2020-01-01',
            author: { name: 'Author Name' },
            tags: [{ name: 'Tag 1' }, { name: 'Tag 2' }],
          },
        };
      }

      return {
        data: {
          id: 'tag-1',
          name: 'Tag Name',
          books: [{ id: 'book-1', title: 'Book 1' }, { id: 'book-2', title: 'Book 2' }],
        },
      };
    });

    const html = renderToStaticMarkup(
      <div>
        <AuthorIdCell authorId="author-1" />
        <AuthorNameCell authorId="author-1" />
        <AuthorBioCell authorId="author-1" />
        <AuthorCountryCell authorId="author-1" />
        <AuthorBirthDateCell authorId="author-1" />
        <AuthorBooksCountCell authorId="author-1" />
        <AuthorIsActiveCell authorId="author-1" />
        <AuthorActionsCell authorId="author-1" onEditPress={() => {}} onDeletePress={() => {}} />

        <BookIdCell bookId="book-1" />
        <BookTitleCell bookId="book-1" />
        <BookDescriptionCell bookId="book-1" />
        <BookPublicationDateCell bookId="book-1" />
        <BookAuthorCell bookId="book-1" />
        <BookTagsCell bookId="book-1" />
        <BookActionsCell bookId="book-1" onEditPress={() => {}} onDeletePress={() => {}} />

        <TagIdCell tagId="tag-1" />
        <TagNameCell tagId="tag-1" />
        <TagBooksCountCell tagId="tag-1" />
        <TagBooksCell tagId="tag-1" />
        <TagActionsCell tagId="tag-1" onEditPress={() => {}} onDeletePress={() => {}} />
      </div>,
    );

    expect(html).toContain('Author Name');
    expect(html).toContain('Book Title');
    expect(html).toContain('Tag Name');
  });

  it('creates and renders inventory columns for all nouns', () => {
    mocks.useFragmentMock.mockImplementation(() => ({ data: { id: 'id-1' } }));
    const onEditPress = vi.fn();
    const onDeletePress = vi.fn();

    const authorColumns = createAuthorInventoryColumns({ onEditPress, onDeletePress });
    const bookColumns = createBookInventoryColumns({ onEditPress, onDeletePress });
    const tagColumns = createTagInventoryColumns({ onEditPress, onDeletePress });

    const authorRow = { cursor: 'c-author', node: { id: 'author-1' } } as never;
    const bookRow = { cursor: 'c-book', node: { id: 'book-1' } } as never;
    const tagRow = { cursor: 'c-tag', node: { id: 'tag-1' } } as never;

    renderToStaticMarkup(
      <div>
        {authorColumns.map((column) => (
          <div key={`author-${column.id}`}>{column.renderCell(authorRow)}</div>
        ))}
        {bookColumns.map((column) => (
          <div key={`book-${column.id}`}>{column.renderCell(bookRow)}</div>
        ))}
        {tagColumns.map((column) => (
          <div key={`tag-${column.id}`}>{column.renderCell(tagRow)}</div>
        ))}
      </div>,
    );

    expect(authorColumns).toHaveLength(8);
    expect(bookColumns).toHaveLength(7);
    expect(tagColumns).toHaveLength(5);
  });

  it('renders all filter panels', () => {
    const onFiltersChange = vi.fn();
    const html = renderToStaticMarkup(
      <div>
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
        />

        <BookFiltersPanel
          filters={{ filterTitleContains: '', filterAuthorId: '', filterTagId: '' }}
          authors={[{ id: 'author-1', name: 'Author 1' }]}
          tags={[{ id: 'tag-1', name: 'Tag 1' }]}
          onFiltersChange={onFiltersChange}
        />

        <TagFiltersPanel
          filters={{ filterNameContains: '', filterBookId: '' }}
          books={[{ id: 'book-1', title: 'Book 1' }]}
          onFiltersChange={onFiltersChange}
        />
      </div>,
    );

    expect(html).toBeTruthy();
  });
});
