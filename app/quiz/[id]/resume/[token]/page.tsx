'use client';

import { useEffect, useState } from 'react';
import { Container, Stack, Paper, Title, Text, Button, Alert, Loader } from '@mantine/core';
import { IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { useQuiz } from '@/lib/context/QuizContext';

export default function ResumeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const token = params.token as string;

  const { resumeSession } = useUser();
  const { loadSavedProgress } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (token && quizId) {
      loadProgress();
    }
  }, [token, quizId]);

  const loadProgress = async () => {
    try {
      // Validate token and load saved progress
      const response = await fetch(`/api/resume/${token}`);
      if (!response.ok) {
        throw new Error('Invalid or expired resume token');
      }

      const data = await response.json();

      // Check if this token is for the correct quiz
      const quizResponse = data.quizResponses?.find((r: any) => r.quiz_id === quizId);
      if (!quizResponse) {
        throw new Error('No saved progress found for this quiz');
      }

      setProgress({
        user: data.user,
        quizResponse,
        answers: quizResponse.answers || {},
        currentQuestionIndex: quizResponse.current_question_index || 0,
      });

      // Resume user session
      await resumeSession(token);
    } catch (err: any) {
      console.error('Error loading progress:', err);
      setError(err.message || 'Failed to load saved progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (progress) {
      // Load the saved progress into QuizContext
      loadSavedProgress(progress.quizResponse);

      // Redirect to the quiz page
      router.push(`/quiz/${quizId}`);
    }
  };

  const handleStartOver = () => {
    router.push(`/quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <Container size="md" py={{ base: 40, sm: 60 }} px="md">
        <Stack align="center" gap="md" py={60}>
          <Loader size="lg" type="dots" />
          <Text c="dimmed">Loading your saved progress...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py={{ base: 40, sm: 60 }} px="md">
        <Stack gap="xl">
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>

          <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Stack gap="md">
              <Text size="sm">
                This resume link may be invalid or expired. You can start the quiz from the
                beginning.
              </Text>

              <Button
                leftSection={<IconArrowRight size={16} />}
                onClick={() => router.push('/start')}
              >
                Start New Survey
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="md" py={{ base: 40, sm: 60 }} px="md">
      <Stack gap="xl">
        <div>
          <Title order={1} size="h2" mb="sm">
            Welcome Back!
          </Title>
          <Text c="dimmed" size="lg">
            We found your saved progress. You can continue where you left off.
          </Text>
        </div>

        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Logged in as
              </Text>
              <Text size="lg" fw={600}>
                {progress?.user?.name}
              </Text>
              <Text size="sm" c="dimmed">
                {progress?.user?.email}
              </Text>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Progress
              </Text>
              <Text size="lg" fw={600}>
                Question {(progress?.currentQuestionIndex || 0) + 1}
              </Text>
              <Text size="sm" c="dimmed">
                {Object.keys(progress?.answers || {}).length} questions answered
              </Text>
            </div>

            <Stack gap="sm" mt="md">
              <Button
                size="lg"
                leftSection={<IconArrowRight size={20} />}
                onClick={handleContinue}
                fullWidth
              >
                Continue Survey
              </Button>

              <Button size="md" variant="subtle" onClick={handleStartOver} fullWidth>
                Start Over
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" bg="blue.0" withBorder>
          <Text size="sm" c="dimmed">
            💡 Your progress is automatically saved. You can close this page and return anytime
            using your resume token.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
