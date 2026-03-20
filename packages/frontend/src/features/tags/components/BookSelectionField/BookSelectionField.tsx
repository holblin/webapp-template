import {
  ComboBox,
  ComboBoxItem,
  Tag,
  TagGroup,
  type Key,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { useMemo, useState } from 'react';
import type { SelectionOption } from './BookSelectionField.types';

type BookSelectionFieldProps = {
  options: SelectionOption[];
  selectedOptions: SelectionOption[];
  onSelectedOptionsChange: (options: SelectionOption[]) => void;
  fieldLabel?: string;
  selectedLabel?: string;
  placeholder?: string;
  emptyStateMessage?: string;
  isDisabled?: boolean;
};

export const BookSelectionField = ({
  options,
  selectedOptions,
  onSelectedOptionsChange,
  fieldLabel = 'Books',
  selectedLabel = 'Selected books',
  placeholder = 'Search and add an option',
  emptyStateMessage = 'No options selected.',
  isDisabled,
}: BookSelectionFieldProps) => {
  const [inputValue, setInputValue] = useState('');

  const selectedOptionIds = useMemo(
    () => new Set(selectedOptions.map((option) => option.id)),
    [selectedOptions],
  );

  const availableOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();

    return options.filter((option) => {
      if (selectedOptionIds.has(option.id)) {
        return false;
      }

      if (!query) {
        return true;
      }

      return option.label.toLowerCase().includes(query);
    });
  }, [options, inputValue, selectedOptionIds]);

  const onSelectionChange = (key: Key | null) => {
    if (key == null) {
      return;
    }

    const selectedId = String(key);
    const selectedOption = options.find((option) => option.id === selectedId);

    if (!selectedOption || selectedOptionIds.has(selectedOption.id)) {
      setInputValue('');
      return;
    }

    onSelectedOptionsChange([...selectedOptions, selectedOption]);
    setInputValue('');
  };

  const onRemove = (keys: 'all' | Set<Key>) => {
    if (keys === 'all') {
      onSelectedOptionsChange([]);
      return;
    }

    const keysToRemove = new Set(Array.from(keys, (key) => String(key)));
    onSelectedOptionsChange(
      selectedOptions.filter((option) => !keysToRemove.has(option.id)),
    );
  };

  return (
    <div className={style({ display: 'flex', flexDirection: 'column', gap: 8 })}>
      <ComboBox
        label={fieldLabel}
        placeholder={placeholder}
        items={availableOptions}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={onSelectionChange}
        isDisabled={isDisabled}
      >
        {(item) => (
          <ComboBoxItem id={item.id} textValue={item.label}>
            {item.label}
          </ComboBoxItem>
        )}
      </ComboBox>
      <TagGroup
        label={selectedLabel}
        items={selectedOptions}
        onRemove={isDisabled ? undefined : onRemove}
        renderEmptyState={() => emptyStateMessage}
      >
        {(item) => (
          <Tag id={item.id} textValue={item.label}>
            {item.label}
          </Tag>
        )}
      </TagGroup>
    </div>
  );
};
