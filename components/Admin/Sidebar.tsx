'use client';

import { Stack, NavLink, Text, Box, Button, Divider } from '@mantine/core';
import {
  IconHome,
  IconFileText,
  IconChartBar,
  IconUsers,
  IconLogout,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const navItems = [
    {
      icon: IconHome,
      label: 'Dashboard',
      href: '/admin',
    },
    {
      icon: IconFileText,
      label: 'Responses',
      href: '/admin/responses',
    },
    {
      icon: IconChartBar,
      label: 'Analytics',
      href: '/admin/analytics',
    },
    {
      icon: IconUsers,
      label: 'Users',
      href: '/admin/users',
    },
  ];

  return (
    <Box
      style={{
        width: 280,
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid #dee2e6',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
      }}
      p="lg"
    >
      <Stack gap="xs" justify="space-between" style={{ height: '100%' }}>
        <div>
          <Box mb="xl" p="md" style={{
            background: 'linear-gradient(135deg, #339af0 0%, #228be6 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(51, 154, 240, 0.2)',
          }}>
            <Text size="xl" fw={700} c="white" ta="center">
              Admin Panel
            </Text>
          </Box>

          <Stack gap="xs">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={pathname === item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
                variant="filled"
                style={{
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: '15px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  ...(pathname === item.href ? {
                    background: 'linear-gradient(135deg, #339af0 0%, #228be6 100%)',
                    boxShadow: '0 4px 12px rgba(51, 154, 240, 0.3)',
                  } : {
                    background: 'transparent',
                  }),
                }}
              />
            ))}
          </Stack>
        </div>

        <div>
          <Divider my="md" />
          <Button
            variant="gradient"
            gradient={{ from: 'red', to: 'pink', deg: 135 }}
            fullWidth
            leftSection={<IconLogout size={18} />}
            onClick={logout}
            style={{
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)',
            }}
          >
            Logout
          </Button>
        </div>
      </Stack>
    </Box>
  );
}
