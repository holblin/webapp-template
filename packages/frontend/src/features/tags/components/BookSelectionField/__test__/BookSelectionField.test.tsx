import React, { act, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BookSelectionField } from '../BookSelectionField';
import type { SelectionOption } from '../BookSelectionField.types';

const mocks = vi.hoisted(() => ({
  comboBoxProps: null as null | Record<string, unknown>,
  tagGroupProps: null as null | Record<string, unknown>,
}));

vi.mock('@react-spectrum/s2', () => {
  const ComboBox = ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => {
    mocks.comboBoxProps = props;
    const renderFn = typeof children === 'function' ? children as (item: unknown) => React.ReactNode : null;
    const items = (props.items as unknown[] | undefined) ?? [];
    return React.createElement(
      'div',
      null,
      renderFn ? items.map((item) => renderFn(item)) : children,
    );
  };

  const ComboBoxItem = ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => {
    const rest = { ...props };
    delete (rest as { textValue?: string }).textValue;
    return React.createElement('option', rest, children);
  };

  const TagGroup = ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => {
    mocks.tagGroupProps = props;
    const renderFn = typeof children === 'function' ? children as (item: unknown) => React.ReactNode : null;
    const items = (props.items as unknown[] | undefined) ?? [];
    return React.createElement(
      'div',
      null,
      renderFn ? items.map((item) => renderFn(item)) : children,
    );
  };

  const Tag = ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => {
    const rest = { ...props };
    delete (rest as { textValue?: string }).textValue;
    return React.createElement('span', rest, children);
  };

  return {
    ComboBox,
    ComboBoxItem,
    TagGroup,
    Tag,
  };
});

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
}));

const allBooks: SelectionOption[] = [
  { id: 'book-1', label: 'Dune' },
  { id: 'book-2', label: 'Hyperion' },
  { id: 'book-3', label: 'The Hobbit' },
];

let root: Root | null = null;
let container: HTMLDivElement | null = null;
let latestSelectedBooks: SelectionOption[] = [];

const TestHarness = () => {
  const [selectedBooks, setSelectedBooks] = useState<SelectionOption[]>([allBooks[0]]);

  useEffect(() => {
    latestSelectedBooks = selectedBooks;
  }, [selectedBooks]);

  return (
    <BookSelectionField
      options={allBooks}
      selectedOptions={selectedBooks}
      onSelectedOptionsChange={setSelectedBooks}
    />
  );
};

const renderHarness = () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    if (!root) {
      throw new Error('Root is not initialized.');
    }
    root.render(<TestHarness />);
  });
};

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  root = null;
  container = null;
  latestSelectedBooks = [];
  mocks.comboBoxProps = null;
  mocks.tagGroupProps = null;
});

describe('BookSelectionField', () => {
  it('adds a selected book and removes selected books through tag actions', () => {
    renderHarness();

    const comboBoxProps = mocks.comboBoxProps;
    const tagGroupProps = mocks.tagGroupProps;

    if (!comboBoxProps || !tagGroupProps) {
      throw new Error('Component props were not captured.');
    }

    expect((comboBoxProps.items as SelectionOption[]).map((book) => book.id)).toEqual(['book-2', 'book-3']);

    act(() => {
      const onSelectionChange = comboBoxProps.onSelectionChange as ((key: string | null) => void) | undefined;
      onSelectionChange?.('book-2');
    });

    expect(latestSelectedBooks.map((book) => book.id)).toEqual(['book-1', 'book-2']);

    act(() => {
      const latestTagGroupProps = mocks.tagGroupProps;
      const onRemove = latestTagGroupProps?.onRemove as ((keys: Set<string>) => void) | undefined;
      onRemove?.(new Set(['book-1']));
    });

    expect(latestSelectedBooks.map((book) => book.id)).toEqual(['book-2']);
  });

  it('filters combobox options by input text', () => {
    renderHarness();

    const comboBoxProps = mocks.comboBoxProps;
    if (!comboBoxProps) {
      throw new Error('Combobox props were not captured.');
    }

    act(() => {
      const onInputChange = comboBoxProps.onInputChange as ((value: string) => void) | undefined;
      onInputChange?.('hob');
    });

    const nextComboBoxProps = mocks.comboBoxProps;
    if (!nextComboBoxProps) {
      throw new Error('Combobox props were not captured after input change.');
    }

    expect((nextComboBoxProps.items as SelectionOption[]).map((book) => book.id)).toEqual(['book-3']);
  });
});
