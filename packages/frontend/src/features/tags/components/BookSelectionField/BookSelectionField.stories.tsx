import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BookSelectionField } from './BookSelectionField';
import type { SelectionOption } from './BookSelectionField.types';

const defaultBooks: SelectionOption[] = [
  { id: 'book-1', label: 'Dune' },
  { id: 'book-2', label: 'The Hobbit' },
  { id: 'book-3', label: 'The Name of the Wind' },
  { id: 'book-4', label: 'Hyperion' },
];

type BookSelectionFieldStoryProps = {
  books: SelectionOption[];
  initialSelectedBooks: SelectionOption[];
  isDisabled?: boolean;
};

const BookSelectionFieldStory = ({
  books,
  initialSelectedBooks,
  isDisabled,
}: BookSelectionFieldStoryProps) => {
  const [selectedBooks, setSelectedBooks] = useState<SelectionOption[]>(initialSelectedBooks);

  return (
    <BookSelectionField
      options={books}
      selectedOptions={selectedBooks}
      onSelectedOptionsChange={setSelectedBooks}
      isDisabled={isDisabled}
    />
  );
};

const meta = {
  title: 'Tags/BookSelectionField',
  render: (args) => <BookSelectionFieldStory {...args} />,
  args: {
    books: defaultBooks,
    initialSelectedBooks: [defaultBooks[0]],
    isDisabled: false,
  },
} satisfies Meta<BookSelectionFieldStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptySelection: Story = {
  args: {
    initialSelectedBooks: [],
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
