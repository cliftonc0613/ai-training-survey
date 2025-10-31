'use client';

import { useState } from 'react';
import {
  Container,
  Stack,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Alert,
  Loader,
  Group,
  List,
  ThemeIcon,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowRight,
  IconKey,
  IconCheck,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';

export default function ResumePage() {
  const router = useRouter();
  const { resumeSession } = useUser();
  const [resumeToken, setResumeToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeToken.trim()) {
      setError('Please enter your resume token');
      return;
    }

    setIsLoading(true);

    try {
      // Validate token and get user data
      const response = await fetch(`/api/resume/${resumeToken.trim()}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid resume token');
      }

      const data = await response.json();

      // Resume user session
      await resumeSession(resumeToken.trim());

      // Check if there's an in-progress quiz (not completed)
      // savedProgress is an array of quiz responses
      const inProgressQuiz = data.savedProgress?.find((qr: any) => !qr.completedAt);

      if (inProgressQuiz) {
        // Redirect to the in-progress quiz page
        router.push(`/quiz/${inProgressQuiz.quizId}`);
      } else if (data.savedProgress && data.savedProgress.length > 0) {
        // All quizzes completed, redirect to thank you page
        router.push('/thank-you');
      } else {
        // No progress found, redirect to quizzes page
        router.push('/quizzes');
      }
    } catch (err: any) {
      console.error('Error resuming session:', err);
      setError(err.message || 'Failed to resume session. Please check your resume token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="md" py={{ base: 40, sm: 60 }} px="md">
      <Stack gap="xl">
        <div>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.push('/')}
            mb="lg"
          >
            Back to Home
          </Button>

          <Title order={1} size="h2" mb="sm">
            Resume Your Survey
          </Title>
          <Text c="dimmed" size="lg">
            Enter your resume token to continue where you left off.
          </Text>
        </div>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        <Paper shadow="md" p="xl" radius="md" withBorder>
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <TextInput
                label="Resume Token"
                placeholder="Enter your resume token"
                leftSection={<IconKey size={16} />}
                value={resumeToken}
                onChange={(e) => setResumeToken(e.currentTarget.value)}
                size="lg"
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="lg"
                leftSection={
                  isLoading ? <Loader size={16} color="white" /> : <IconArrowRight size={20} />
                }
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Resume Survey'}
              </Button>
            </Stack>
          </form>
        </Paper>

        <Paper p="lg" radius="md" bg="blue.0" withBorder>
          <Stack gap="sm">
            <Group gap="xs">
              <ThemeIcon size="sm" radius="xl" variant="light">
                <IconCheck size={12} />
              </ThemeIcon>
              <Text size="sm" fw={600}>
                Where to find your resume token:
              </Text>
            </Group>

            <List size="sm" spacing="xs" withPadding>
              <List.Item>Check your email for your registration confirmation</List.Item>
              <List.Item>Look for the token saved in your browser's local storage</List.Item>
              <List.Item>
                It's a unique code generated when you first registered (e.g., RES-ABC123XYZ)
              </List.Item>
            </List>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Text size="sm" c="dimmed" ta="center">
            Don't have a resume token?{' '}
            <Text
              component="span"
              c="brand"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => router.push('/start')}
            >
              Start a new survey
            </Text>
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
