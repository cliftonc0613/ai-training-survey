'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Container, Loader, Stack, Text } from '@mantine/core';
import Sidebar from '@/components/Admin/Sidebar';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to login page without auth
    if (pathname === '/admin/login') {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show login page without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loader while checking auth
  if (isLoading) {
    return (
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Checking authentication...</Text>
        </Stack>
      </Box>
    );
  }

  // Don't render admin content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render normal admin layout
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
