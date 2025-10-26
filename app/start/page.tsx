'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  TextInput,
  Button,
  Group,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUser, IconMail, IconPhone } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { validateName, validateEmail, validatePhone } from '@/lib/utils/validation';
import { useUser } from '@/lib/context/UserContext';

export default function StartPage() {
  const router = useRouter();
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },

    validate: {
      name: (value) => {
        const result = validateName(value);
        return result.isValid ? null : result.error;
      },
      email: (value) => {
        const result = validateEmail(value);
        return result.isValid ? null : result.error;
      },
      phone: (value) => {
        const result = validatePhone(value);
        return result.isValid ? null : result.error;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    try {
      // Register user
      await login({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });

      // Redirect to quiz selection
      router.push('/quizzes');
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="sm" py={{ base: 40, sm: 60 }} px="md">
      <Stack gap="xl">
        <div>
          <Title order={1} size="h2" mb="sm">
            Before We Begin
          </Title>
          <Text c="dimmed" size="lg">
            Please provide your contact information. We'll use this to save your progress and
            send you a resume token.
          </Text>
        </div>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        <Paper shadow="md" p="xl" radius="md" withBorder>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                leftSection={<IconUser size={16} />}
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                leftSection={<IconMail size={16} />}
                required
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Phone Number"
                placeholder="(555) 123-4567"
                leftSection={<IconPhone size={16} />}
                required
                {...form.getInputProps('phone')}
              />

              <Text size="xs" c="dimmed">
                Your information is stored securely and will only be used to save your survey
                progress and send you a resume token.
              </Text>

              <Group justify="space-between" mt="xl">
                <Button variant="subtle" onClick={() => router.push('/')}>
                  Cancel
                </Button>

                <Button type="submit" loading={isLoading} size="md">
                  Continue to Survey
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        <Paper p="md" radius="md" bg="blue.0" withBorder>
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              💡 Already started?
            </Text>
            <Text size="sm" c="dimmed">
              If you have a resume token, you can{' '}
              <Text
                component="a"
                onClick={() => router.push('/resume')}
                c="blue"
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                resume your survey here
              </Text>
              .
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
