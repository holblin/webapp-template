import { getRequiredFieldError } from 'src/features/inventory/validation';

type BookDialogRequiredFields = {
  title: string;
  description: string;
  authorName: string;
  publicationDate: string;
};

export const getBookDialogRequiredFieldError = ({
  title,
  description,
  authorName,
  publicationDate,
}: BookDialogRequiredFields): string | null => (
  getRequiredFieldError([
    { value: title, message: 'Book title is required.' },
    { value: description, message: 'Book description is required.' },
    { value: authorName, message: 'Author name is required.' },
    { value: publicationDate, message: 'Publication date is required.' },
  ])
);
