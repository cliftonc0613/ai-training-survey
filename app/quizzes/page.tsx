'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Stack,
  Group,
  Badge,
  Button,
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconClock,
  IconAlertCircle,
  IconArrowRight,
  IconClipboardCheck,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import type { Quiz } from '@/lib/types';

export default function QuizzesPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if no user
    if (!userLoading && !user) {
      router.push('/start');
      return;
    }

    // Fetch available quizzes
    fetchQuizzes();
  }, [user, userLoading, router]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz');
      if (!response.ok) throw new Error('Failed to fetch quizzes');

      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <Container size="lg" py={{ base: 40, sm: 60 }} px="md">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading quizzes...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 40, sm: 60 }} px="md">
      <Stack gap="xl">
        <div>
          <Title order={1} size="h2" mb="sm">
            Choose a Survey
          </Title>
          <Text c="dimmed" size="lg">
            Select a survey to begin. Your progress will be saved automatically.
          </Text>
        </div>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {quizzes.length === 0 ? (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack align="center" gap="md">
              <IconClipboardCheck size={48} color="var(--mantine-color-dimmed)" />
              <Text size="lg" c="dimmed" ta="center">
                No surveys available at the moment.
              </Text>
              <Button variant="outline" onClick={() => router.push('/')}>
                Back to Home
              </Button>
            </Stack>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {quizzes.map((quiz) => (
              <Paper
                key={quiz.id}
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
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                <Stack gap="md" h="100%">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Title order={3} size="h4">
                        {quiz.title}
                      </Title>
                      <Badge color="blue" variant="light">
                        {(quiz as any).questionCount || (quiz.questions?.length ?? 0)} questions
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
                        ~{(quiz as any).estimatedTime || (quiz as any).estimated_time}
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
            ))}
          </SimpleGrid>
        )}

        {user && (
          <Paper p="md" radius="md" bg="gray.0" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={600} c="brand.7">
                  Logged in as: {user.name}
                </Text>
                <Text size="xs" c="brand.7">
                  Resume Token: {user.resumeToken}
                </Text>
              </div>
              <Button variant="subtle" size="sm" onClick={() => router.push('/')}>
                Cancel
              </Button>
            </Group>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
