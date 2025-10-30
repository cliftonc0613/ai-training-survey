'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Stack, Loader, Paper } from '@mantine/core';
import ResponsesTable from '@/components/Admin/ResponsesTable';
import ResponseFilters from '@/components/Admin/ResponseFilters';

interface QuizResponse {
  id: string;
  quizId: string;
  userId: string;
  progress: number;
  completedAt: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<QuizResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/admin/responses');
      if (!response.ok) throw new Error('Failed to fetch responses');

      const data = await response.json();
      setResponses(data.responses || []);
      setFilteredResponses(data.responses || []);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError('Failed to load responses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: {
    quizId?: string;
    dateRange?: [Date | null, Date | null];
    status?: string;
  }) => {
    let filtered = [...responses];

    // Filter by quiz
    if (filters.quizId) {
      filtered = filtered.filter((r) => r.quizId === filters.quizId);
    }

    // Filter by status
    if (filters.status) {
      if (filters.status === 'completed') {
        filtered = filtered.filter((r) => r.progress === 100);
      } else if (filters.status === 'in-progress') {
        filtered = filtered.filter((r) => r.progress > 0 && r.progress < 100);
      }
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter((r) => {
        const date = new Date(r.createdAt);
        return date >= start && date <= end;
      });
    }

    setFilteredResponses(filtered);
  };

  if (isLoading) {
    return (
      <Stack align="center" justify="center" style={{ minHeight: 400 }}>
        <Loader size="lg" />
        <Text c="dimmed">Loading responses...</Text>
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
          Survey Responses
        </Title>
        <Text c="dimmed">View and manage all survey submissions</Text>
      </div>

      <ResponseFilters onFilterChange={handleFilterChange} />

      <ResponsesTable responses={filteredResponses} onRefresh={fetchResponses} />
    </Stack>
  );
}
