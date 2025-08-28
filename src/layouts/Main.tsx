'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppShell, Container, Group, Title, NavLink, Text, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTable, IconCalculator, IconAtom } from '@tabler/icons-react';

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    label: '元素週期表',
    href: '/',
    icon: IconTable,
  },
  {
    label: '化學計算器',
    href: '/calculator',
    icon: IconCalculator,
  },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Group>
              <IconAtom size={24} color="var(--mantine-color-blue-6)" />
              <Title order={3} c="blue">化學元素探索</Title>
            </Group>
          </Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="sm" fw={500} mb="sm" c="dimmed">
          導航
        </Text>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={<Icon size={16} />}
              active={pathname === item.href}
              mb="xs"
            />
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}