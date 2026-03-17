import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AuthorActionsCell } from 'src/features/authors/fragments/AuthorActionsCell/AuthorActionsCell';
import { BookActionsCell } from 'src/features/books/fragments/BookActionsCell/BookActionsCell';
import { TagActionsCell } from 'src/features/tags/fragments/TagActionsCell/TagActionsCell';

const mocks = vi.hoisted(() => ({
  useFragmentMock: vi.fn(),
  actionButtons: [] as Array<{ label: string; onPress?: () => void }>,
}));

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
  iconStyle: () => '',
}));

vi.mock('@apollo/client/react', () => ({
  useFragment: mocks.useFragmentMock,
}));

vi.mock('@react-spectrum/s2/icons/Edit', () => ({ default: () => <span>EditIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Delete', () => ({ default: () => <span>DeleteIcon</span> }));

vi.mock('@react-spectrum/s2', () => ({
  ActionButton: ({ onPress, children, 'aria-label': ariaLabel }: React.PropsWithChildren<{ onPress?: () => void; 'aria-label'?: string }>) => {
    mocks.actionButtons.push({
      label: ariaLabel ?? (typeof children === 'string' ? children : ''),
      onPress,
    });
    return <button>{children}</button>;
  },
  TooltipTrigger: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Tooltip: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

describe('action cell callbacks', () => {
  it('forwards resolved ids through edit/delete handlers', () => {
    mocks.actionButtons.length = 0;
    mocks.useFragmentMock
      .mockReturnValueOnce({ data: { id: 'author-fragment-id' } })
      .mockReturnValueOnce({ data: { id: 'book-fragment-id' } })
      .mockReturnValueOnce({ data: { id: 'tag-fragment-id' } });

    const onAuthorEdit = vi.fn();
    const onAuthorDelete = vi.fn();
    const onBookEdit = vi.fn();
    const onBookDelete = vi.fn();
    const onTagEdit = vi.fn();
    const onTagDelete = vi.fn();

    renderToStaticMarkup(
      <div>
        <AuthorActionsCell
          authorId="author-prop-id"
          onEditPress={onAuthorEdit}
          onDeletePress={onAuthorDelete}
        />
        <BookActionsCell
          bookId="book-prop-id"
          onEditPress={onBookEdit}
          onDeletePress={onBookDelete}
        />
        <TagActionsCell
          tagId="tag-prop-id"
          onEditPress={onTagEdit}
          onDeletePress={onTagDelete}
        />
      </div>,
    );

    expect(mocks.actionButtons).toHaveLength(6);
    for (const button of mocks.actionButtons) {
      button.onPress?.();
    }

    expect(onAuthorEdit).toHaveBeenCalledWith('author-fragment-id');
    expect(onAuthorDelete).toHaveBeenCalledWith('author-fragment-id');
    expect(onBookEdit).toHaveBeenCalledWith('book-fragment-id');
    expect(onBookDelete).toHaveBeenCalledWith('book-fragment-id');
    expect(onTagEdit).toHaveBeenCalledWith('tag-fragment-id');
    expect(onTagDelete).toHaveBeenCalledWith('tag-fragment-id');
  });
});
