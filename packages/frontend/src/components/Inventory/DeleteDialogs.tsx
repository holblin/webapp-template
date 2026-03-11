import { Button, ButtonGroup, Content, Dialog, Heading } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

type ConfirmDeleteDialogProps = {
  nounName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isPending?: boolean;
};

export const ConfirmDeleteDialog = ({
  nounName,
  onCancel,
  onConfirm,
  isPending = false,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog>
      <Heading slot="title">Delete {nounName}</Heading>
      <Content>
        <p className={style({ marginY: 0 })}>
          This action cannot be undone.
        </p>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={onCancel}>
          Cancel
        </Button>
        <Button variant="negative" onPress={onConfirm} isPending={isPending}>
          Delete
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

type BlockedDeleteDialogProps = {
  nounName: string;
  references: string[];
  onClose: () => void;
};

export const BlockedDeleteDialog = ({
  nounName,
  references,
  onClose,
}: BlockedDeleteDialogProps) => {
  return (
    <Dialog>
      <Heading slot="title">Cannot delete {nounName}</Heading>
      <Content>
        <p className={style({ marginTop: 0 })}>
          This item is still referenced. Cleanup references first.
        </p>
        <ul className={style({ marginY: 0 })}>
          {references.map((reference) => (
            <li key={reference}>{reference}</li>
          ))}
        </ul>
      </Content>
      <ButtonGroup>
        <Button variant="accent" onPress={onClose}>
          Close
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};
