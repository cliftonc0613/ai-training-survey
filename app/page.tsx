'use client';

import { Container, Title, Text, Button, Stack, Paper, Group } from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container size="lg" py={80}>
      <Stack gap={40} align="center">
        {/* Hero Section */}
        <Paper shadow="md" p={60} radius="lg" withBorder w="100%">
          <Stack gap={30} align="center">
            <IconClipboardCheck size={80} color="var(--mantine-color-brand-6)" />

            <Title order={1} ta="center" size={48} fw={700}>
              AI Training Course Survey
            </Title>

            <Text size="xl" ta="center" c="dimmed" maw={600}>
              Help us improve our AI training courses by sharing your experience.
              Your feedback is valuable and takes only a few minutes.
            </Text>

            <Group gap="md" mt="lg">
              <Button
                size="xl"
                onClick={() => router.push('/start')}
                leftSection={<IconClipboardCheck size={24} />}
              >
                Start Survey
              </Button>

              <Button
                size="xl"
                variant="outline"
                onClick={() => router.push('/resume')}
              >
                Resume Survey
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Features Section */}
        <Group gap="xl" mt="xl" align="flex-start" w="100%">
          <Paper shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
            <Stack gap="sm">
              <Title order={3} size="h4">Quick & Easy</Title>
              <Text size="sm" c="dimmed">
                Takes only 5-10 minutes to complete. Progress is saved automatically.
              </Text>
            </Stack>
          </Paper>

          <Paper shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
            <Stack gap="sm">
              <Title order={3} size="h4">Works Offline</Title>
              <Text size="sm" c="dimmed">
                Start the survey anywhere. Your responses sync when you're back online.
              </Text>
            </Stack>
          </Paper>

          <Paper shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
            <Stack gap="sm">
              <Title order={3} size="h4">Resume Anytime</Title>
              <Text size="sm" c="dimmed">
                Get a resume token to continue where you left off on any device.
              </Text>
            </Stack>
          </Paper>
        </Group>
      </Stack>
    </Container>
  );
}
