import {
  ActionButton,
  ActionButtonGroup,
  Cell,
  Menu,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from '@react-spectrum/s2';
import More from '@react-spectrum/s2/icons/More';
import type { ReactNode } from 'react';

type NameActionsCellAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
  isDisabled?: boolean;
};

type NameActionsCellProps = {
  name: ReactNode;
  nameHref?: string;
  nameLinkTarget?: '_self' | '_blank';
  actions?: NameActionsCellAction[];
};

export const NameActionsCell = ({
  name,
  nameHref,
  nameLinkTarget = '_self',
  actions = [],
}: NameActionsCellProps) => {
  const inlineActions = actions.length <= 3 ? actions : actions.slice(0, 2);
  const overflowActions = actions.length <= 3 ? [] : actions.slice(2);

  return (
    <Cell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {nameHref ? (
          <a
            href={nameHref}
            target={nameLinkTarget}
            rel={nameLinkTarget === '_blank' ? 'noreferrer' : undefined}
            style={{ cursor: 'pointer', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: 'none' }}
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            {name}
          </a>
        ) : (
          <span
            style={{ cursor: 'text', WebkitUserSelect: 'text', userSelect: 'text', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            role="none"
          >
            {name}
          </span>
        )}
        <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center' }}>
          {actions.length > 0 ? (
            <ActionButtonGroup density="compact" isQuiet>
              {inlineActions.map((action) => (
                <TooltipTrigger key={action.id}>
                  <ActionButton
                    aria-label={action.label}
                    onPress={action.onPress}
                    isDisabled={action.isDisabled}
                  >
                    {action.icon}
                  </ActionButton>
                  <Tooltip>{action.label}</Tooltip>
                </TooltipTrigger>
              ))}
              {overflowActions.length > 0 ? (
                <MenuTrigger>
                  <TooltipTrigger>
                    <ActionButton aria-label="More actions">
                      <More />
                    </ActionButton>
                    <Tooltip>More actions</Tooltip>
                  </TooltipTrigger>
                  <Menu>
                    {overflowActions.map((action) => (
                      <MenuItem
                        key={action.id}
                        id={action.id}
                        onAction={action.onPress}
                        isDisabled={action.isDisabled}
                      >
                        {action.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </MenuTrigger>
              ) : null}
            </ActionButtonGroup>
          ) : null}
        </div>
      </div>
    </Cell>
  );
};

type NameActionsCellComponent = typeof NameActionsCell & {
  isInventoryTableCell?: boolean;
};

(NameActionsCell as NameActionsCellComponent).isInventoryTableCell = true;
