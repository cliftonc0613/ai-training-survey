'use client';

import { useState } from 'react';
import { Table, Paper, Badge, ActionIcon, Group, Text, ScrollArea, Pagination, Select, Stack } from '@mantine/core';
import { IconEye, IconDownload, IconRefresh } from '@tabler/icons-react';
import ExportButton from './ExportButton';

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

interface ResponsesTableProps {
  responses: QuizResponse[];
  onRefresh: () => void;
}

export default function ResponsesTable({ responses, onRefresh }: ResponsesTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const pageSizeNum = parseInt(pageSize);
  const totalPages = Math.ceil(responses.length / pageSizeNum);
  const startIndex = (page - 1) * pageSizeNum;
  const endIndex = startIndex + pageSizeNum;
  const paginatedResponses = responses.slice(startIndex, endIndex);
  const getQuizTitle = (quizId: string) => {
    const titles: Record<string, string> = {
      'survey-30days': '30-Day Follow-Up',
      'survey-90days': '90-Day Check-In',
      'survey-180days': '6-Month Assessment',
      'survey-12months-final': '12-Month Final',
    };
    return titles[quizId] || quizId;
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return (
        <Badge color="teal" variant="filled">
          Completed
        </Badge>
      );
    } else if (progress > 0) {
      return (
        <Badge color="orange" variant="filled">
          In Progress ({progress}%)
        </Badge>
      );
    } else {
      return (
        <Badge color="gray" variant="filled">
          Not Started
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rows = paginatedResponses.map((response) => (
    <Table.Tr key={response.id}>
      <Table.Td>{response.user?.name || 'N/A'}</Table.Td>
      <Table.Td>{response.user?.email || 'N/A'}</Table.Td>
      <Table.Td>{getQuizTitle(response.quizId)}</Table.Td>
      <Table.Td>{getStatusBadge(response.progress)}</Table.Td>
      <Table.Td>{formatDate(response.createdAt)}</Table.Td>
      <Table.Td>
        {response.completedAt ? formatDate(response.completedAt) : 'N/A'}
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="light" color="blue" size="sm">
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="green" size="sm">
            <IconDownload size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(value);
      setPage(1); // Reset to first page when changing page size
    }
  };

  return (
    <Paper shadow="sm" radius="md" withBorder>
      <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
        <Group gap="md">
          <Text fw={600}>All Responses ({responses.length})</Text>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Show
            </Text>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              data={['10', '25', '50', '100']}
              w={70}
              size="xs"
            />
            <Text size="sm" c="dimmed">
              per page
            </Text>
          </Group>
        </Group>
        <Group gap="xs">
          <ActionIcon variant="light" onClick={onRefresh}>
            <IconRefresh size={18} />
          </ActionIcon>
          <ExportButton responses={responses} />
        </Group>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Quiz</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Started</Table.Th>
              <Table.Th>Completed</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                  <Text c="dimmed">No responses found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <Group justify="center" p="md" style={{ borderTop: '1px solid #e9ecef' }}>
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            size="sm"
          />
          <Text size="sm" c="dimmed">
            Showing {startIndex + 1}-{Math.min(endIndex, responses.length)} of {responses.length}
          </Text>
        </Group>
      )}
    </Paper>
  );
}
