'use client';

import { Container, Title, Text, Button, Stack, Paper, Grid } from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container size="lg" py={80} px="md">
      <Stack gap={40} align="center">
        {/* Hero Section */}
        <Paper
          shadow="md"
          p={{ base: 'lg', sm: 'xl', md: 60 }}
          radius="lg"
          withBorder
          w="100%"
          style={{ maxWidth: '100%' }}
        >
          <Stack gap={30} align="center">
            <IconClipboardCheck size={80} style={{ width: 'min(80px, 20vw)', height: 'auto' }} color="var(--mantine-color-brand-6)" />

            <Title
              order={1}
              ta="center"
              fw={700}
              style={{
                fontSize: 'clamp(28px, 6vw, 48px)',
              }}
            >
              AI Training Course Survey
            </Title>

            <Text size="lg" ta="center" c="dimmed" maw={600} px="md">
              Help us improve our AI training courses by sharing your experience.
              Your feedback is valuable and takes only a few minutes.
            </Text>

            <Stack gap="md" mt="lg" w="100%" maw={400}>
              <Button
                size="lg"
                onClick={() => router.push('/start')}
                leftSection={<IconClipboardCheck size={20} />}
                fullWidth
              >
                Start Survey
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/resume')}
                fullWidth
              >
                Resume Survey
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Features Section */}
        <Grid gutter="lg" mt="xl" w="100%">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Title order={3} size="h4">Quick & Easy</Title>
                <Text size="sm" c="dimmed">
                  Takes only 5-10 minutes to complete. Progress is saved automatically.
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Title order={3} size="h4">Works Offline</Title>
                <Text size="sm" c="dimmed">
                  Start the survey anywhere. Your responses sync when you're back online.
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Title order={3} size="h4">Resume Anytime</Title>
                <Text size="sm" c="dimmed">
                  Get a resume token to continue where you left off on any device.
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
