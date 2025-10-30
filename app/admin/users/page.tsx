'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Stack,
  Loader,
  Paper,
  Table,
  Badge,
  Group,
  ScrollArea,
  Pagination,
  Select,
  ActionIcon,
} from '@mantine/core';
import { IconRefresh, IconMail, IconPhone } from '@tabler/icons-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeToken: string;
  createdAt: string;
  updatedAt: string;
  quizResponseCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
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

  const pageSizeNum = parseInt(pageSize);
  const totalPages = Math.ceil(users.length / pageSizeNum);
  const startIndex = (page - 1) * pageSizeNum;
  const endIndex = startIndex + pageSizeNum;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(value);
      setPage(1);
    }
  };

  if (isLoading) {
    return (
      <Stack align="center" justify="center" style={{ minHeight: 400 }}>
        <Loader size="lg" />
        <Text c="dimmed">Loading users...</Text>
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

  const rows = paginatedUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <div>
          <Text fw={600}>{user.name}</Text>
          <Text size="xs" c="dimmed">
            ID: {user.id.substring(0, 8)}...
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <IconMail size={16} />
          <Text size="sm">{user.email}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <IconPhone size={16} />
          <Text size="sm">{user.phone}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue">
          {user.resumeToken.substring(0, 12)}...
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge variant="filled" color={user.quizResponseCount > 0 ? 'teal' : 'gray'}>
          {user.quizResponseCount} {user.quizResponseCount === 1 ? 'Response' : 'Responses'}
        </Badge>
      </Table.Td>
      <Table.Td>{formatDate(user.createdAt)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Registered Users
        </Title>
        <Text c="dimmed">View all users who have registered for surveys</Text>
      </div>

      <Paper
        shadow="lg"
        radius="lg"
        withBorder
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderColor: '#e9ecef',
          overflow: 'hidden',
        }}
      >
        <Group
          justify="space-between"
          p="xl"
          style={{
            borderBottom: '2px solid #dee2e6',
            background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
          }}
        >
          <Group gap="md">
            <Text size="lg" fw={700}>
              All Users
            </Text>
            <div
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #339af0 0%, #228be6 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {users.length}
            </div>
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
            <ActionIcon variant="light" onClick={fetchUsers}>
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Resume Token</Table.Th>
                <Table.Th>Responses</Table.Th>
                <Table.Th>Registered</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                    <Text c="dimmed">No users found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {totalPages > 1 && (
          <Group justify="center" p="md" style={{ borderTop: '1px solid #e9ecef' }}>
            <Pagination value={page} onChange={setPage} total={totalPages} size="sm" />
            <Text size="sm" c="dimmed">
              Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length}
            </Text>
          </Group>
        )}
      </Paper>
    </Stack>
  );
}
