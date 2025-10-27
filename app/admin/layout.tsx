'use client';

import { Box, Container } from '@mantine/core';
import Sidebar from '@/components/Admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box style={{ flex: 1, overflow: 'auto' }}>
        <Container size="xl" py="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
