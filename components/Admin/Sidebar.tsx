'use client';

import { Stack, NavLink, Text, Box } from '@mantine/core';
import {
  IconHome,
  IconFileText,
  IconChartBar,
  IconUsers,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
        width: 250,
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
      }}
      p="md"
    >
      <Stack gap="xs">
        <Text size="xl" fw={700} mb="md" c="blue">
          Admin Panel
        </Text>

        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            leftSection={<item.icon size={20} />}
            active={pathname === item.href}
            onClick={(e) => {
              e.preventDefault();
              router.push(item.href);
            }}
            variant="filled"
            style={{
              borderRadius: 8,
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
