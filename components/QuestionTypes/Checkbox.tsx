'use client';

import { Checkbox as MantineCheckbox, Stack, Text } from '@mantine/core';

interface CheckboxProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
  minSelection?: number;
  maxSelection?: number;
}

export default function Checkbox({
  options,
  value,
  onChange,
  required: _required = false,
  error,
  minSelection,
  maxSelection,
}: CheckboxProps) {
  const handleChange = (option: string, checked: boolean) => {
    let newValue: string[];

    if (checked) {
      // Add option if not already selected and under max limit
      if (maxSelection && value.length >= maxSelection) {
        return; // Don't add if at max selection
      }
      newValue = [...value, option];
    } else {
      // Remove option
      newValue = value.filter((v) => v !== option);
    }

    onChange(newValue);
  };

  const isDisabled = (option: string) => {
    // Disable if max selection reached and option not already selected
    return maxSelection ? value.length >= maxSelection && !value.includes(option) : false;
  };

  return (
    <Stack gap="xs">
      <MantineCheckbox.Group value={value}>
        <Stack gap="sm">
          {options.map((option) => (
            <MantineCheckbox
              key={option}
              value={option}
              label={option}
              size="md"
              checked={value.includes(option)}
              onChange={(e) => handleChange(option, e.currentTarget.checked)}
              disabled={isDisabled(option)}
              styles={{
                label: {
                  paddingLeft: '8px',
                  cursor: isDisabled(option) ? 'not-allowed' : 'pointer',
                },
              }}
            />
          ))}
        </Stack>
      </MantineCheckbox.Group>

      {(minSelection || maxSelection) && (
        <Text size="xs" c="dimmed">
          {minSelection && maxSelection
            ? `Select ${minSelection}-${maxSelection} options`
            : minSelection
            ? `Select at least ${minSelection} option${minSelection > 1 ? 's' : ''}`
            : maxSelection
            ? `Select up to ${maxSelection} option${maxSelection > 1 ? 's' : ''}`
            : ''}
        </Text>
      )}

      {error && (
        <Text size="sm" c="red">
          {error}
        </Text>
      )}
    </Stack>
  );
}
