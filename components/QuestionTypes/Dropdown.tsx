'use client';

import { Select, Text, Stack } from '@mantine/core';

interface DropdownProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  searchable?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error,
  searchable,
}: DropdownProps) {
  // Auto-enable searchable for 20+ items
  const isSearchable = searchable !== undefined ? searchable : options.length >= 20;

  return (
    <Stack gap="xs">
      <Select
        data={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        searchable={isSearchable}
        clearable={!required}
        error={error}
        size="md"
        maxDropdownHeight={300}
        styles={{
          dropdown: {
            maxHeight: 300,
          },
        }}
      />
      {isSearchable && options.length >= 20 && (
        <Text size="xs" c="dimmed">
          Type to search through {options.length} options
        </Text>
      )}
    </Stack>
  );
}
