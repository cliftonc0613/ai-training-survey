'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Stack, Loader, Grid, Paper } from '@mantine/core';
import AnalyticsChart from '@/components/Admin/AnalyticsChart';
import UserStats from '@/components/Admin/UserStats';

interface AnalyticsData {
  responsesByQuiz: Array<{
    quizId: string;
    quizTitle: string;
    total: number;
    completed: number;
    inProgress: number;
  }>;
  responsesByDay: Array<{
    date: string;
    count: number;
  }>;
  completionRate: number;
  averageCompletionTime: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Stack align="center" justify="center" style={{ minHeight: 400 }}>
        <Loader size="lg" />
        <Text c="dimmed">Loading analytics...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Text c="red">{error}</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Analytics
        </Title>
        <Text c="dimmed">Visualize survey data and track user engagement</Text>
      </div>

      <Grid>
        <Grid.Col span={12}>
          <AnalyticsChart
            data={data?.responsesByDay || []}
            title="Responses Over Time"
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <UserStats data={data?.responsesByQuiz || []} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
