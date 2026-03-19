/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
  useMutationMock: vi.fn(),
  useFragmentMock: vi.fn(),
  mutationExec: vi.fn().mockResolvedValue({}),
  toastPositive: vi.fn(),
  toastNegative: vi.fn(),
  buttonProps: [] as Array<{ label: string; onPress?: () => unknown }>,
  tableViewProps: [] as Array<Record<string, unknown>>,
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const renderProp = children as unknown;
      if (typeof renderProp === 'function') {
        return React.createElement(tag, props, (renderProp as (args: { close: () => void }) => React.ReactNode)({ close: () => {} }));
      }
      return React.createElement(tag, props, children);
    };
  };

  const button = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
    const label = typeof children === 'string' ? children : '';
    mocks.buttonProps.push({
      label,
      onPress: props.onPress as (() => unknown) | undefined,
    });
    return React.createElement('button', props, children);
  };

  const tableView = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
    mocks.tableViewProps.push(props);
    return React.createElement('table', props, children);
  };

  return {
    Button: button,
    ButtonGroup: component('div'),
    Column: component('th'),
    Content: component('div'),
    DatePicker: component('div'),
    Dialog: component('div'),
    Form: component('form'),
    Heading: component('h2'),
    Picker: component('div'),
    PickerItem: component('option'),
    Row: component('tr'),
    Cell: component('td'),
    TableBody: component('tbody'),
    TableHeader: component('thead'),
    TableView: tableView,
    TextArea: component('textarea'),
    TextField: component('input'),
    ActionButton: component('button'),
    ToastQueue: {
      positive: mocks.toastPositive,
      negative: mocks.toastNegative,
    },
  };
});

vi.mock('@apollo/client/react', () => ({
  useQuery: mocks.useQueryMock,
  useMutation: mocks.useMutationMock,
  useFragment: mocks.useFragmentMock,
}));

import { CreateAuthorDialog } from '../Authors/dialogs/CreateAuthorDialog';
import { DeleteAuthorDialog } from '../Authors/dialogs/DeleteAuthorDialog';
import { UpdateAuthorDialog } from '../Authors/dialogs/UpdateAuthorDialog';
import { CreateBookDialog } from '../Books/dialogs/CreateBookDialog';
import { DeleteBookDialog } from '../Books/dialogs/DeleteBookDialog';
import { UpdateBookDialog } from '../Books/dialogs/UpdateBookDialog';
import { CreateTagDialog } from '../Tags/dialogs/CreateTagDialog';
import { DeleteTagDialog } from '../Tags/dialogs/DeleteTagDialog';
import { UpdateTagDialog } from '../Tags/dialogs/UpdateTagDialog';

const defaultQueryResult = {
  data: {
    authorById: {
      id: 'author-1',
      name: 'Author Name',
      bio: 'Author Bio',
      country: 'US',
      isActive: true,
      birthDate: '1990-01-01',
    },
    bookById: {
      id: 'book-1',
      title: 'Book Title',
      description: 'Book Description',
      publicationDate: '2020-01-01',
      author: { id: 'author-1', name: 'Author Name' },
      tags: [{ id: 'tag-1', name: 'Tag 1' }],
    },
    tagById: {
      id: 'tag-1',
      name: 'Tag Name',
      books: [{ id: 'book-1', title: 'Book Title' }],
    },
    bookList: {
      totalCount: 0,
      edges: [],
    },
  },
  loading: false,
  error: undefined,
  refetch: vi.fn(),
};

const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const triggerButtonsByLabel = async (label: string) => {
  for (const button of mocks.buttonProps.filter((entry) => entry.label === label)) {
    await button.onPress?.();
  }
};

describe('dialog smoke tests', () => {
  it('renders create/update/delete dialogs for all nouns', () => {
    mocks.buttonProps.length = 0;
    mocks.tableViewProps.length = 0;
    mocks.mutationExec.mockClear();
    mocks.toastPositive.mockClear();
    mocks.toastNegative.mockClear();
    mocks.useMutationMock.mockReturnValue([mocks.mutationExec, { loading: false }]);
    mocks.useQueryMock.mockReturnValue(defaultQueryResult);
    mocks.useFragmentMock.mockImplementation(({ from }: { from: { __typename: string; id: string } }) => {
      if (from.__typename === 'Author') {
        return { complete: true, data: defaultQueryResult.data.authorById };
      }
      if (from.__typename === 'Book') {
        return { complete: true, data: defaultQueryResult.data.bookById };
      }
      return { complete: true, data: defaultQueryResult.data.tagById };
    });

    const html = renderToStaticMarkup(
      <div>
        <CreateAuthorDialog onCompleted={() => {}} openCycle={1} />
        <UpdateAuthorDialog authorId="author-1" onCompleted={() => {}} />
        <DeleteAuthorDialog authorId="author-1" onCompleted={() => {}} />

        <CreateBookDialog onCompleted={() => {}} />
        <UpdateBookDialog bookId="book-1" onCompleted={() => {}} />
        <DeleteBookDialog bookId="book-1" onCompleted={() => {}} />

        <CreateTagDialog onCompleted={() => {}} />
        <UpdateTagDialog tagId="tag-1" onCompleted={() => {}} />
        <DeleteTagDialog tagId="tag-1" onCompleted={() => {}} />
      </div>,
    );

    expect(html).toContain('Create author');
    expect(html).toContain('Update author');
    expect(html).toContain('Delete Author Name');
    expect(html).toContain('Create book');
    expect(html).toContain('Update book');
    expect(html).toContain('Delete Book Title');
    expect(html).toContain('Create tag');
    expect(html).toContain('Update tag');
    expect(html).toContain('Delete Tag Name');
  });

  it('renders author delete references block when dependencies exist', () => {
    mocks.buttonProps.length = 0;
    mocks.tableViewProps.length = 0;
    mocks.useMutationMock.mockReturnValue([mocks.mutationExec, { loading: false }]);
    mocks.useFragmentMock.mockReturnValue({
      complete: true,
      data: defaultQueryResult.data.authorById,
    });

    mocks.useQueryMock
      .mockReturnValueOnce(defaultQueryResult)
      .mockReturnValueOnce({
        ...defaultQueryResult,
        data: {
          ...defaultQueryResult.data,
          bookList: {
            totalCount: 2,
            edges: [{ node: { id: 'book-1', title: 'Book 1' } }, { node: { id: 'book-2', title: 'Book 2' } }],
          },
        },
      });

    const html = renderToStaticMarkup(
      <DeleteAuthorDialog authorId="author-1" onCompleted={() => {}} />,
    );

    expect(html).toContain('Cannot delete Author Name');
    expect(html).toContain('book(s)');

    const onSortChange = mocks.tableViewProps[0]?.onSortChange as
      | ((descriptor: { column: string; direction: 'ascending' | 'descending' }) => void)
      | undefined;

    onSortChange?.({ column: 'id', direction: 'ascending' });
    onSortChange?.({ column: 'title', direction: 'descending' });
  });

  it('triggers create/save/delete actions and mutation side effects', async () => {
    mocks.buttonProps.length = 0;
    mocks.tableViewProps.length = 0;
    mocks.mutationExec.mockClear();
    mocks.toastPositive.mockClear();
    mocks.toastNegative.mockClear();
    mocks.useMutationMock.mockReturnValue([mocks.mutationExec, { loading: false }]);
    mocks.useQueryMock.mockReturnValue(defaultQueryResult);
    mocks.useFragmentMock.mockImplementation(({ from }: { from: { __typename: string; id: string } }) => {
      if (from.__typename === 'Author') {
        return { complete: true, data: defaultQueryResult.data.authorById };
      }
      if (from.__typename === 'Book') {
        return { complete: true, data: defaultQueryResult.data.bookById };
      }
      return { complete: true, data: defaultQueryResult.data.tagById };
    });

    const onCompleted = vi.fn();
    renderToStaticMarkup(
      <div>
        <CreateAuthorDialog onCompleted={onCompleted} openCycle={1} />
        <UpdateAuthorDialog authorId="author-1" onCompleted={onCompleted} />
        <DeleteAuthorDialog authorId="author-1" onCompleted={onCompleted} />
        <CreateBookDialog onCompleted={onCompleted} />
        <UpdateBookDialog bookId="book-1" onCompleted={onCompleted} />
        <DeleteBookDialog bookId="book-1" onCompleted={onCompleted} />
        <CreateTagDialog onCompleted={onCompleted} />
        <UpdateTagDialog tagId="tag-1" onCompleted={onCompleted} />
        <DeleteTagDialog tagId="tag-1" onCompleted={onCompleted} />
      </div>,
    );

    await triggerButtonsByLabel('Create');
    await triggerButtonsByLabel('Save');
    await triggerButtonsByLabel('Delete');
    await flushMicrotasks();

    expect(mocks.mutationExec).toHaveBeenCalledTimes(6);
    expect(mocks.toastNegative).toHaveBeenCalledTimes(3);
    expect(mocks.toastPositive).toHaveBeenCalledTimes(6);
    expect(onCompleted).toHaveBeenCalledTimes(6);
  });

  it('renders delete-author retry flow when reference query fails', async () => {
    mocks.buttonProps.length = 0;
    mocks.tableViewProps.length = 0;
    const refetch = vi.fn();
    mocks.useMutationMock.mockReturnValue([mocks.mutationExec, { loading: false }]);
    mocks.useFragmentMock.mockReturnValue({
      complete: true,
      data: defaultQueryResult.data.authorById,
    });
    mocks.useQueryMock
      .mockReturnValueOnce(defaultQueryResult)
      .mockReturnValueOnce({
        ...defaultQueryResult,
        error: new Error('network down'),
        refetch,
      });

    const html = renderToStaticMarkup(<DeleteAuthorDialog authorId="author-1" onCompleted={() => {}} />);
    expect(html).toContain('Reference check failed');

    const retryButton = mocks.buttonProps.find((button) => button.label === 'Retry');
    await retryButton?.onPress?.();
    expect(refetch).toHaveBeenCalled();
  });
});
