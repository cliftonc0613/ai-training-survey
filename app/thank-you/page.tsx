'use client';

import { Container, Title, Text, Button, Stack, Paper, Group, Code, Alert } from '@mantine/core';
import { IconCheck, IconClipboard, IconHome, IconClipboardCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { useEffect, useState } from 'react';

export default function ThankYouPage() {
  const router = useRouter();
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Redirect to start if no user session
    if (!user) {
      router.push('/start');
    }
  }, [user, router]);

  const handleCopyToken = () => {
    if (user?.resumeToken) {
      navigator.clipboard.writeText(user.resumeToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Container size="md" py={{ base: 40, sm: 60, md: 80 }} px="md">
      <Stack gap={40} align="center">
        {/* Success Message */}
        <Paper shadow="md" p={{ base: 'lg', sm: 'xl', md: 60 }} radius="lg" withBorder w="100%">
          <Stack gap={30} align="center">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'var(--mantine-color-green-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck size={48} color="var(--mantine-color-green-6)" />
            </div>

            <Title
              order={1}
              ta="center"
              fw={700}
              style={{
                fontSize: 'clamp(28px, 5vw, 42px)',
              }}
            >
              Thank You!
            </Title>

            <Text size="lg" ta="center" c="dimmed" maw={500} px="md">
              Your survey responses have been submitted successfully. We appreciate your feedback!
            </Text>
          </Stack>
        </Paper>

        {/* Resume Token Section */}
        {user.resumeToken && (
          <Paper shadow="sm" p="lg" radius="md" withBorder w="100%">
            <Stack gap="md">
              <Group gap="xs">
                <IconClipboard size={20} />
                <Text fw={600}>Your Resume Token</Text>
              </Group>

              <Text size="sm" c="dimmed">
                Save this token to resume your progress on any device or review your responses later.
              </Text>

              <Group gap="xs" align="flex-start" style={{ flexWrap: 'wrap' }}>
                <Code
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    wordBreak: 'break-all',
                  }}
                >
                  {user.resumeToken}
                </Code>
                <Button
                  variant="light"
                  leftSection={<IconClipboard size={18} />}
                  onClick={handleCopyToken}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Group>

              {copied && (
                <Alert color="green" variant="light" title="Copied to clipboard!">
                  Your resume token has been copied. Store it somewhere safe.
                </Alert>
              )}
            </Stack>
          </Paper>
        )}

        {/* Navigation Options */}
        <Paper shadow="sm" p="lg" radius="md" withBorder w="100%">
          <Stack gap="md">
            <Text fw={600}>What would you like to do next?</Text>

            <Stack gap="sm">
              <Button
                size="lg"
                leftSection={<IconClipboardCheck size={20} />}
                onClick={() => router.push('/quizzes')}
                fullWidth
              >
                Take Another Survey
              </Button>

              <Button
                size="lg"
                variant="light"
                leftSection={<IconHome size={20} />}
                onClick={() => router.push('/')}
                fullWidth
              >
                Return to Home
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Additional Info */}
        <Text size="sm" c="dimmed" ta="center" maw={500} px="md">
          Your responses have been saved {user.resumeToken ? 'and synced with your resume token' : 'locally'}.
          You can close this page or continue exploring.
        </Text>
      </Stack>
    </Container>
  );
}
