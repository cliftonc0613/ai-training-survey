'use client';

import { Textarea, Text, Stack, Group } from '@mantine/core';

interface TextLongProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  minLength?: number;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
}

export default function TextLong({
  value,
  onChange,
  placeholder = 'Enter your detailed answer',
  required = false,
  error,
  minLength,
  maxLength = 1000,
  minRows = 4,
  maxRows = 10,
}: TextLongProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return; // Don't update if exceeds max length
    }
    onChange(newValue);
  };

  const characterCount = value.length;
  const isOverLimit = maxLength && characterCount > maxLength;
  const isUnderMin = minLength && characterCount < minLength && characterCount > 0;

  return (
    <Stack gap="xs">
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        size="md"
        minRows={minRows}
        maxRows={maxRows}
        autosize
        required={required}
      />
      <Group justify="space-between">
        <Text size="xs" c={isUnderMin ? 'orange' : 'dimmed'}>
          {minLength
            ? `Minimum ${minLength} character${minLength > 1 ? 's' : ''}`
            : 'No minimum length'}
        </Text>
        <Text size="xs" c={isOverLimit ? 'red' : characterCount > maxLength * 0.9 ? 'orange' : 'dimmed'}>
          {characterCount} / {maxLength}
        </Text>
      </Group>
      {isUnderMin && (
        <Text size="xs" c="orange">
          {minLength - characterCount} more character{minLength - characterCount > 1 ? 's' : ''} needed
        </Text>
      )}
    </Stack>
  );
}
