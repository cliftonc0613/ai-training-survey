'use client';

import { Slider, Stack, Group, Text } from '@mantine/core';

interface SliderInputProps {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: Array<{ value: number; label: string }>;
  labels?: { min?: string; max?: string };
  required?: boolean;
  error?: string;
  showValue?: boolean;
}

export default function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks,
  labels,
  required = false,
  error,
  showValue = true,
}: SliderInputProps) {
  const defaultMarks = marks || [
    { value: min, label: String(min) },
    { value: Math.floor((min + max) / 2), label: String(Math.floor((min + max) / 2)) },
    { value: max, label: String(max) },
  ];

  return (
    <Stack gap="md" pt="sm">
      <Slider
        value={value || min}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        marks={defaultMarks}
        size="lg"
        label={(val) => val}
        styles={{
          markLabel: {
            marginTop: 8,
          },
          thumb: {
            width: 20,
            height: 20,
          },
        }}
      />

      {labels && (
        <Group justify="space-between" mt="xs">
          {labels.min && (
            <Text size="sm" c="dimmed">
              {labels.min}
            </Text>
          )}
          {labels.max && (
            <Text size="sm" c="dimmed">
              {labels.max}
            </Text>
          )}
        </Group>
      )}

      {showValue && value !== null && (
        <Text size="sm" ta="center" fw={600} c="brand">
          Selected value: {value}
        </Text>
      )}

      {error && (
        <Text size="sm" c="red" ta="center">
          {error}
        </Text>
      )}
    </Stack>
  );
}
