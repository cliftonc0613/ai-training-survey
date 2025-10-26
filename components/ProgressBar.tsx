'use client';

import { Progress, Group, Text, Stack } from '@mantine/core';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  percentage: number;
  showPercentage?: boolean;
  showQuestionCount?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ProgressBar({
  currentQuestion,
  totalQuestions,
  percentage,
  showPercentage = true,
  showQuestionCount = true,
  size = 'lg',
}: ProgressBarProps) {
  return (
    <Stack gap="xs">
      {(showQuestionCount || showPercentage) && (
        <Group justify="space-between">
          {showQuestionCount && (
            <Text size="sm" fw={500}>
              Question {currentQuestion} of {totalQuestions}
            </Text>
          )}
          {showPercentage && (
            <Text size="sm" c="dimmed">
              {Math.round(percentage)}% Complete
            </Text>
          )}
        </Group>
      )}
      <Progress
        value={percentage}
        size={size}
        radius="xl"
        color="brand"
        animated
        styles={{
          root: {
            backgroundColor: 'var(--mantine-color-gray-2)',
          },
        }}
      />
    </Stack>
  );
}
