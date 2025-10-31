'use client';

import { useEffect, useState } from 'react';
import { ActionIcon, Group, Text, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="filled"
      size="xl"
      aria-label="Toggle color scheme"
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        width: 'auto',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      <Group gap="xs" wrap="nowrap">
        {colorScheme === 'dark' ? (
          <IconSun size={20} stroke={1.5} />
        ) : (
          <IconMoon size={20} stroke={1.5} />
        )}
        <Text size="sm" fw={500} style={{ userSelect: 'none' }}>
          {colorScheme === 'dark' ? 'Light' : 'Dark'}
        </Text>
      </Group>
    </ActionIcon>
  );
}
