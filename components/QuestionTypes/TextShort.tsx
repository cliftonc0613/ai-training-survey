'use client';

import { TextInput, Text, Stack } from '@mantine/core';

interface TextShortProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  minLength?: number;
  maxLength?: number;
}

export default function TextShort({
  value,
  onChange,
  placeholder = 'Enter your answer',
  required = false,
  error,
  minLength,
  maxLength,
}: TextShortProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return; // Don't update if exceeds max length
    }
    onChange(newValue);
  };

  return (
    <Stack gap="xs">
      <TextInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        size="md"
        required={required}
      />
      {(minLength || maxLength) && (
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {minLength
              ? `Minimum ${minLength} character${minLength > 1 ? 's' : ''}`
              : ''}
          </Text>
          {maxLength && (
            <Text size="xs" c={value.length > maxLength ? 'red' : 'dimmed'}>
              {value.length} / {maxLength}
            </Text>
          )}
        </Group>
      )}
    </Stack>
  );
}
