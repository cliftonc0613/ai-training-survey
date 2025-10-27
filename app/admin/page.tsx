'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Grid,
  Paper,
  Stack,
  Group,
  Loader,
  RingProgress,
} from '@mantine/core';
import {
  IconFileText,
  IconUsers,
  IconCheckbox,
  IconClock,
} from '@tabler/icons-react';

interface Stats {
  totalResponses: number;
  totalUsers: number;
  completedResponses: number;
  inProgressResponses: number;
  completionRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Stack align="center" justify="center" style={{ minHeight: 400 }}>
        <Loader size="lg" />
        <Text c="dimmed">Loading dashboard...</Text>
      </Stack>
    );
  }

  const statCards = [
    {
      title: 'Total Responses',
      value: stats?.totalResponses || 0,
      icon: IconFileText,
      color: 'blue',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: IconUsers,
      color: 'green',
    },
    {
      title: 'Completed',
      value: stats?.completedResponses || 0,
      icon: IconCheckbox,
      color: 'teal',
    },
    {
      title: 'In Progress',
      value: stats?.inProgressResponses || 0,
      icon: IconClock,
      color: 'orange',
    },
  ];

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Dashboard
        </Title>
        <Text c="dimmed">Overview of survey responses and user activity</Text>
      </div>

      <Grid>
        {statCards.map((card) => (
          <Grid.Col key={card.title} span={{ base: 12, sm: 6, md: 3 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {card.title}
                  </Text>
                  <Text size="xl" fw={700} mt="xs">
                    {card.value.toLocaleString()}
                  </Text>
                </div>
                <card.icon size={40} color={card.color} style={{ opacity: 0.6 }} />
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Group align="center" gap="xl">
          <RingProgress
            size={180}
            thickness={16}
            sections={[
              {
                value: stats?.completionRate || 0,
                color: 'teal',
              },
            ]}
            label={
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700}>
                  {stats?.completionRate.toFixed(1) || 0}%
                </Text>
                <Text size="xs" c="dimmed">
                  Completion Rate
                </Text>
              </div>
            }
          />
          <Stack gap="xs">
            <Title order={3}>Survey Completion</Title>
            <Text c="dimmed">
              {stats?.completedResponses || 0} out of {stats?.totalResponses || 0}{' '}
              surveys have been completed
            </Text>
            <Text size="sm" c="dimmed">
              {stats?.inProgressResponses || 0} surveys are currently in progress
            </Text>
          </Stack>
        </Group>
      </Paper>
    </Stack>
  );
}
