'use client';

import { Paper, Title, Table, Progress, Badge, Text } from '@mantine/core';

interface QuizStats {
  quizId: string;
  quizTitle: string;
  total: number;
  completed: number;
  inProgress: number;
}

interface UserStatsProps {
  data: QuizStats[];
}

export default function UserStats({ data }: UserStatsProps) {
  const getQuizTitle = (quizId: string) => {
    const titles: Record<string, string> = {
      'survey-30days': '30-Day Follow-Up Survey',
      'survey-90days': '90-Day Progress Check-In',
      'survey-180days': '6-Month Impact Assessment',
      'survey-12months-final': '12-Month Final Assessment',
    };
    return titles[quizId] || quizId;
  };

  const calculateCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const rows = data.map((quiz) => {
    const completionRate = calculateCompletionRate(quiz.completed, quiz.total);

    return (
      <Table.Tr key={quiz.quizId}>
        <Table.Td>
          <Text fw={500}>{getQuizTitle(quiz.quizId)}</Text>
        </Table.Td>
        <Table.Td>
          <Badge color="blue" variant="light">
            {quiz.total}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Badge color="teal" variant="light">
            {quiz.completed}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Badge color="orange" variant="light">
            {quiz.inProgress}
          </Badge>
        </Table.Td>
        <Table.Td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Progress
              value={completionRate}
              size="lg"
              style={{ flex: 1 }}
              color={completionRate >= 75 ? 'teal' : completionRate >= 50 ? 'blue' : 'orange'}
            />
            <Text size="sm" fw={600} style={{ minWidth: '45px' }}>
              {completionRate}%
            </Text>
          </div>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Title order={3} mb="lg">
        Quiz Completion Rates
      </Title>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Quiz</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Completed</Table.Th>
            <Table.Th>In Progress</Table.Th>
            <Table.Th>Completion Rate</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                <Text c="dimmed">No quiz data available</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
