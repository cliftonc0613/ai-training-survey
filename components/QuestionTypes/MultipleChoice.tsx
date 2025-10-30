'use client';

import { Radio, Stack, Paper, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';

export type MultipleChoiceVariant = 'list' | 'cards';

interface MultipleChoiceProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  variant?: MultipleChoiceVariant;
  required?: boolean;
  error?: string;
}

export default function MultipleChoice({
  options,
  value,
  onChange,
  variant = 'list',
  required: _required = false,
  error,
}: MultipleChoiceProps) {
  if (variant === 'cards') {
    return (
      <Stack gap="sm">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <Paper
              key={option}
              p="md"
              radius="md"
              withBorder
              style={{
                cursor: 'pointer',
                borderColor: isSelected
                  ? 'var(--mantine-color-brand-6)'
                  : 'var(--mantine-color-gray-3)',
                borderWidth: isSelected ? 2 : 1,
                backgroundColor: isSelected
                  ? 'var(--mantine-color-brand-0)'
                  : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onChange(option)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--mantine-color-gray-4)';
                  e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--mantine-color-gray-3)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Stack gap="xs">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${
                        isSelected
                          ? 'var(--mantine-color-brand-6)'
                          : 'var(--mantine-color-gray-4)'
                      }`,
                      backgroundColor: isSelected
                        ? 'var(--mantine-color-brand-6)'
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected && <IconCircleCheck size={12} color="white" />}
                  </div>
                  <Text
                    fw={isSelected ? 600 : 400}
                    c={isSelected ? 'brand.6' : 'dark'}
                    style={{ flex: 1 }}
                  >
                    {option}
                  </Text>
                </div>
              </Stack>
            </Paper>
          );
        })}
        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}
      </Stack>
    );
  }

  // List variant (default)
  return (
    <Stack gap="xs">
      <Radio.Group value={value || ''} onChange={onChange} error={error}>
        <Stack gap="sm">
          {options.map((option) => (
            <Radio
              key={option}
              value={option}
              label={option}
              size="md"
              styles={{
                label: {
                  paddingLeft: '8px',
                  cursor: 'pointer',
                },
              }}
            />
          ))}
        </Stack>
      </Radio.Group>
    </Stack>
  );
}
