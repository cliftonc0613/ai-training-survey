'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(username, password);

    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper shadow="md" p={40} radius="md" withBorder>
        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <IconLock size={48} color="#339af0" style={{ marginBottom: 16 }} />
            <Title order={2} mb="xs">
              Admin Login
            </Title>
            <Text c="dimmed" size="sm">
              Enter your credentials to access the admin dashboard
            </Text>
          </div>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button type="submit" fullWidth loading={isLoading}>
                Sign In
              </Button>
            </Stack>
          </form>

          <Text size="xs" c="dimmed" ta="center">
            Default credentials: admin / admin123
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
