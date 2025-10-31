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
  useMantineTheme,
  useMantineColorScheme,
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
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
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

  const getCardColors = (color: string) => {
    const colors: Record<string, { start: string; end: string }> = {
      blue: {
        start: colorScheme === 'dark' ? theme.colors.blue[6] : theme.colors.blue[5],
        end: colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[7],
      },
      green: {
        start: colorScheme === 'dark' ? theme.colors.green[6] : theme.colors.green[5],
        end: colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[7],
      },
      teal: {
        start: colorScheme === 'dark' ? theme.colors.teal[6] : theme.colors.teal[5],
        end: colorScheme === 'dark' ? theme.colors.teal[8] : theme.colors.teal[7],
      },
      orange: {
        start: colorScheme === 'dark' ? theme.colors.orange[6] : theme.colors.orange[5],
        end: colorScheme === 'dark' ? theme.colors.orange[8] : theme.colors.orange[7],
      },
    };
    return colors[color];
  };

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
            <Paper
              shadow="md"
              p="xl"
              radius="lg"
              withBorder
              style={{
                background:
                  colorScheme === 'dark'
                    ? `linear-gradient(135deg, ${theme.colors.dark[6]} 0%, ${theme.colors.dark[7]} 100%)`
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderColor:
                  colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  colorScheme === 'dark'
                    ? '0 12px 24px rgba(0, 0, 0, 0.4)'
                    : '0 12px 24px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  colorScheme === 'dark'
                    ? '0 1px 3px rgba(0, 0, 0, 0.3)'
                    : '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="sm">
                    {card.title}
                  </Text>
                  <Text size="32px" fw={700} style={{ lineHeight: 1 }}>
                    {card.value.toLocaleString()}
                  </Text>
                </div>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${getCardColors(card.color).start} 0%, ${getCardColors(card.color).end} 100%)`,
                    boxShadow:
                      colorScheme === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                        : '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <card.icon size={32} color="white" stroke={2} />
                </div>
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Paper
        shadow="lg"
        p="xl"
        radius="lg"
        withBorder
        style={{
          background:
            colorScheme === 'dark'
              ? `linear-gradient(135deg, ${theme.colors.dark[6]} 0%, ${theme.colors.dark[7]} 100%)`
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderColor:
            colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
        }}
      >
        <Group align="center" gap="xl">
          <RingProgress
            size={200}
            thickness={20}
            sections={[
              {
                value: stats?.completionRate || 0,
                color: 'teal',
              },
            ]}
            label={
              <div style={{ textAlign: 'center' }}>
                <Text size="42px" fw={700} style={{ lineHeight: 1 }}>
                  {stats?.completionRate.toFixed(1) || 0}%
                </Text>
                <Text size="sm" c="dimmed" mt="xs" fw={600}>
                  Completion
                </Text>
              </div>
            }
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(32, 201, 151, 0.3))',
            }}
          />
          <Stack gap="md" style={{ flex: 1 }}>
            <Title order={2}>Survey Completion</Title>
            <Text size="lg" c="dimmed">
              <Text component="span" fw={700} c="teal">
                {stats?.completedResponses || 0}
              </Text>{' '}
              out of{' '}
              <Text component="span" fw={700} c="blue">
                {stats?.totalResponses || 0}
              </Text>{' '}
              surveys have been completed
            </Text>
            <Text size="md" c="dimmed">
              <Text component="span" fw={600} c="orange">
                {stats?.inProgressResponses || 0}
              </Text>{' '}
              surveys are currently in progress
            </Text>
          </Stack>
        </Group>
      </Paper>
    </Stack>
  );
}
