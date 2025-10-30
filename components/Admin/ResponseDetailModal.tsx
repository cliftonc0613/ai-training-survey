'use client';

import { Modal, Stack, Text, Paper, Group, Badge, Divider, Loader, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  required?: boolean;
}

interface Answer {
  questionId: string;
  answer: string | string[] | number;
}

interface ResponseDetail {
  id: string;
  quizId: string;
  userId: string;
  progress: number;
  responses: Answer[];
  startedAt: string;
  completedAt: string | null;
  user?: {
    name: string;
    email: string;
  };
  quiz?: {
    title: string;
    description: string;
    questions: Question[];
  };
}

interface ResponseDetailModalProps {
  opened: boolean;
  onClose: () => void;
  responseId: string | null;
}

export default function ResponseDetailModal({
  opened,
  onClose,
  responseId,
}: ResponseDetailModalProps) {
  const [responseDetail, setResponseDetail] = useState<ResponseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (opened && responseId) {
      fetchResponseDetail();
    }
  }, [opened, responseId]);

  const fetchResponseDetail = async () => {
    if (!responseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/responses/${responseId}`);
      if (!response.ok) throw new Error('Failed to fetch response details');

      const data = await response.json();
      setResponseDetail(data);
    } catch (err) {
      console.error('Error fetching response details:', err);
      setError('Failed to load response details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAnswer = (answer: string | string[] | number) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return String(answer);
  };

  const findQuestion = (questionId: string): Question | undefined => {
    return responseDetail?.quiz?.questions.find((q) => q.id === questionId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={700}>
          Response Details
        </Text>
      }
      size="lg"
      padding="xl"
    >
      {isLoading && (
        <Stack align="center" justify="center" style={{ minHeight: 200 }}>
          <Loader size="lg" />
          <Text c="dimmed">Loading response details...</Text>
        </Stack>
      )}

      {error && (
        <Paper p="lg" bg="red.0" style={{ border: '1px solid var(--mantine-color-red-3)' }}>
          <Text c="red">{error}</Text>
        </Paper>
      )}

      {!isLoading && !error && responseDetail && (
        <Stack gap="lg">
          {/* User Info */}
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={600} size="sm" c="dimmed">
                  Respondent
                </Text>
                <Badge color="teal" variant="light">
                  {responseDetail.progress === 100 ? 'Completed' : `${responseDetail.progress}% Complete`}
                </Badge>
              </Group>
              <Text fw={700}>{responseDetail.user?.name || 'N/A'}</Text>
              <Text size="sm" c="dimmed">
                {responseDetail.user?.email || 'N/A'}
              </Text>
            </Stack>
          </Paper>

          {/* Quiz Info */}
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Text fw={600} size="sm" c="dimmed">
                Quiz
              </Text>
              <Text fw={700}>{responseDetail.quiz?.title || 'Unknown Quiz'}</Text>
              <Text size="sm">{responseDetail.quiz?.description}</Text>
              <Divider my="xs" />
              <Group gap="xl">
                <div>
                  <Text size="xs" c="dimmed">
                    Started
                  </Text>
                  <Text size="sm">{formatDate(responseDetail.startedAt)}</Text>
                </div>
                {responseDetail.completedAt && (
                  <div>
                    <Text size="xs" c="dimmed">
                      Completed
                    </Text>
                    <Text size="sm">{formatDate(responseDetail.completedAt)}</Text>
                  </div>
                )}
              </Group>
            </Stack>
          </Paper>

          {/* Responses */}
          <Stack gap="md">
            <Text fw={700} size="lg">
              Answers ({responseDetail.responses.length} questions)
            </Text>

            <ScrollArea h={400}>
              <Stack gap="md">
                {responseDetail.responses.map((response, index) => {
                  const question = findQuestion(response.questionId);
                  return (
                    <Paper key={response.questionId} p="md" withBorder>
                      <Stack gap="xs">
                        <Group gap="xs">
                          <Badge size="sm" color="blue" variant="light">
                            Q{index + 1}
                          </Badge>
                          {question?.required && (
                            <Badge size="xs" color="red" variant="light">
                              Required
                            </Badge>
                          )}
                          {question?.type && (
                            <Badge size="xs" color="gray" variant="light">
                              {question.type}
                            </Badge>
                          )}
                        </Group>
                        <Text fw={600}>{question?.question || 'Question not found'}</Text>
                        <Paper p="sm" bg="blue.0" style={{ border: '1px solid var(--mantine-color-blue-2)' }}>
                          <Text fw={500}>{formatAnswer(response.answer)}</Text>
                        </Paper>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </ScrollArea>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
}
