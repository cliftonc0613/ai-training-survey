'use client';

import { Group, Button, Stack } from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconDeviceFloppy,
  IconCheck,
} from '@tabler/icons-react';

interface QuizNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onSubmit?: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswered: boolean;
  isSaving?: boolean;
  isSubmitting?: boolean;
  showSaveButton?: boolean;
}

export default function QuizNavigation({
  onPrevious,
  onNext,
  onSave,
  onSubmit,
  canGoBack,
  canGoForward,
  isFirstQuestion,
  isLastQuestion,
  isAnswered,
  isSaving = false,
  isSubmitting = false,
  showSaveButton = true,
}: QuizNavigationProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" w="100%">
        {/* Previous Button */}
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onPrevious}
          disabled={isFirstQuestion || !canGoBack}
          style={{ flex: 1, maxWidth: '150px' }}
        >
          Previous
        </Button>

        {/* Next or Submit Button */}
        {isLastQuestion ? (
          <Button
            size="md"
            leftSection={<IconCheck size={18} />}
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={!isAnswered}
            style={{ flex: 2 }}
            color="green"
          >
            Submit Survey
          </Button>
        ) : (
          <Button
            size="md"
            rightSection={<IconArrowRight size={16} />}
            onClick={onNext}
            disabled={!isAnswered || !canGoForward}
            style={{ flex: 2 }}
          >
            Next Question
          </Button>
        )}
      </Group>

      {/* Save & Continue Later Button */}
      {showSaveButton && onSave && (
        <Button
          variant="light"
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={onSave}
          loading={isSaving}
          fullWidth
          color="gray"
        >
          Save & Continue Later
        </Button>
      )}
    </Stack>
  );
}
