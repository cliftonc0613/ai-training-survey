'use client';

import { Text, UnstyledButton, Group } from '@mantine/core';
import {
  IconHome,
  IconFileText,
  IconChartBar,
  IconUsers,
  IconLogout,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import classes from './Sidebar.module.css';

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

  const links = navItems.map((item) => (
    <UnstyledButton
      key={item.label}
      className={classes.link}
      data-active={pathname === item.href || undefined}
      onClick={() => router.push(item.href)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </UnstyledButton>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text size="xl" fw={700}>
            Admin Panel
          </Text>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <UnstyledButton className={classes.link} onClick={logout}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </UnstyledButton>
      </div>
    </nav>
  );
}
