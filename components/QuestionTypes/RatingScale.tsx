'use client';

import { Rating, Slider, Stack, Group, Button, Text } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

export type RatingVariant = 'stars' | 'numbers' | 'slider';

interface RatingScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  variant?: RatingVariant;
  min?: number;
  max?: number;
  required?: boolean;
  error?: string;
  labels?: { min?: string; max?: string };
}

export default function RatingScale({
  value,
  onChange,
  variant = 'stars',
  min = 1,
  max = 5,
  required = false,
  error,
  labels,
}: RatingScaleProps) {
  if (variant === 'stars') {
    return (
      <Stack gap="md" align="center">
        <Rating
          value={value || 0}
          onChange={onChange}
          size="xl"
          count={max}
          emptySymbol={<IconStar size={32} />}
          fullSymbol={<IconStar size={32} fill="var(--mantine-color-yellow-5)" />}
        />
        <Text size="sm" c="dimmed">
          {value ? `${value} / ${max}` : 'Select a rating'}
        </Text>
        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}
      </Stack>
    );
  }

  if (variant === 'numbers') {
    return (
      <Stack gap="md">
        <Group justify="center" gap="xs">
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
            <Button
              key={num}
              variant={value === num ? 'filled' : 'outline'}
              size="lg"
              onClick={() => onChange(num)}
              style={{
                minWidth: 50,
                height: 50,
                fontWeight: 600,
              }}
            >
              {num}
            </Button>
          ))}
        </Group>
        {labels && (
          <Group justify="space-between">
            {labels.min && (
              <Text size="xs" c="dimmed">
                {labels.min}
              </Text>
            )}
            {labels.max && (
              <Text size="xs" c="dimmed">
                {labels.max}
              </Text>
            )}
          </Group>
        )}
        {error && (
          <Text size="sm" c="red" ta="center">
            {error}
          </Text>
        )}
      </Stack>
    );
  }

  // Slider variant
  return (
    <Stack gap="md">
      <Slider
        value={value || min}
        onChange={onChange}
        min={min}
        max={max}
        step={1}
        marks={Array.from({ length: max - min + 1 }, (_, i) => ({
          value: min + i,
          label: String(min + i),
        }))}
        size="lg"
        styles={{
          markLabel: {
            marginTop: 8,
          },
        }}
      />
      <Group justify="space-between" mt="md">
        {labels?.min && (
          <Text size="sm" c="dimmed">
            {labels.min}
          </Text>
        )}
        {labels?.max && (
          <Text size="sm" c="dimmed">
            {labels.max}
          </Text>
        )}
      </Group>
      {value !== null && (
        <Text size="sm" ta="center" fw={600} c="brand">
          Selected: {value}
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
