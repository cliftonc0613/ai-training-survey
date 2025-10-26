'use client';

import { Container, Stack, Loader, Text } from '@mantine/core';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <Container size="md" py={{ base: 40, sm: 60 }} px="md">
      <Stack align="center" gap="md" py={60}>
        <Loader size="lg" type="dots" />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Container>
  );
}
