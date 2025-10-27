import { Paper, Stack, Group, Title, Text, Badge, Button } from '@mantine/core';
import { IconClock, IconArrowRight } from '@tabler/icons-react';
import type { Quiz } from '@/lib/types';

interface QuizCardProps {
  quiz: Quiz;
  onClick: () => void;
}

export default function QuizCard({ quiz, onClick }: QuizCardProps) {
  return (
    <Paper
      shadow="md"
      p="lg"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
      }}
      onClick={onClick}
      data-testid="quiz-card"
    >
      <Stack gap="md" h="100%">
        <div>
          <Group justify="space-between" mb="xs">
            <Title order={3} size="h4">
              {quiz.title}
            </Title>
            <Badge color="blue" variant="light">
              {quiz.questions.length} questions
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={3}>
            {quiz.description}
          </Text>
        </div>

        <Group justify="space-between" mt="auto">
          <Group gap="xs">
            <IconClock size={16} />
            <Text size="sm" c="dimmed">
              ~{quiz.estimatedTime} min
            </Text>
          </Group>

          <Button
            variant="light"
            rightSection={<IconArrowRight size={16} />}
            size="sm"
          >
            Start
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
