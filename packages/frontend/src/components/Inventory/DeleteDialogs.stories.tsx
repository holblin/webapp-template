import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, DialogTrigger } from '@react-spectrum/s2';
import {
  BlockedDeleteDialog,
  ConfirmDeleteDialog,
} from 'src/components/Inventory/DeleteDialogs';
import type { ReactElement } from 'react';

const meta = {
  title: 'Components/DeleteDialogs',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type StoryDialogProps = {
  triggerLabel: string;
  children: ReactElement;
};

const StoryDialog = ({ triggerLabel, children }: StoryDialogProps) => (
  <DialogTrigger defaultOpen>
    <Button variant="secondary">{triggerLabel}</Button>
    {children}
  </DialogTrigger>
);

export const Confirm: Story = {
  render: () => (
    <StoryDialog triggerLabel="Open confirm dialog">
      <ConfirmDeleteDialog
        nounName="author"
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />
    </StoryDialog>
  ),
};

export const ConfirmPending: Story = {
  render: () => (
    <StoryDialog triggerLabel="Open pending dialog">
      <ConfirmDeleteDialog
        nounName="book"
        onCancel={() => undefined}
        onConfirm={() => undefined}
        isPending
      />
    </StoryDialog>
  ),
};

export const Blocked: Story = {
  render: () => (
    <StoryDialog triggerLabel="Open blocked dialog">
      <BlockedDeleteDialog
        nounName="tag"
        references={['Book: Dune', 'Book: Hyperion']}
        onClose={() => undefined}
      />
    </StoryDialog>
  ),
};
