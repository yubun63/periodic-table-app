'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Container, Card, Text, Group, Badge, Grid, Stack, Button, Box } from '@mantine/core';
import Link from 'next/link';

interface Element {
  name: string;
  symbol: string;
  number: number;
  atomic_mass: number;
  category: string;
  period: number;
  group: number;
  xpos: number;
  ypos: number;
  'cpk-hex': string;
  phase: string;
}

interface PeriodicTableData {
  elements: Element[];
}

export default function ElementDetailPage() {
  const params = useParams();
  const [element, setElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElement = async () => {
      try {
        const response = await fetch('/api/mocks/periodic-table.json');
        const data: PeriodicTableData = await response.json();
        const elementId = parseInt(params.id as string);
        const foundElement = data.elements.find(el => el.number === elementId);
        setElement(foundElement || null);
      } catch (error) {
        console.error('Error fetching element data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchElement();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Text ta="center">載入中...</Text>
      </Container>
    );
  }

  if (!element) {
    return (
      <Container size="md" py="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text ta="center" size="lg" fw={500}>
            找不到元素資訊
          </Text>
          <Group justify="center" mt="md">
            <Button component={Link} href="/" variant="light">
              返回週期表
            </Button>
          </Group>
        </Card>
      </Container>
    );
  }

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'diatomic nonmetal': '#228be6',
      'noble gas': '#15aabf',
      'alkali metal': '#9c88ff',
      'alkaline earth metal': '#40c057',
      'metalloid': '#fab005',
      'polyatomic nonmetal': '#fd7e14',
      'post-transition metal': '#e64980',
      'transition metal': '#4c6ef5',
      'lanthanide': '#12b886',
      'actinide': '#fa5252',
    };
    return categoryColors[category] || '#868e96';
  };

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group justify="space-between" mb="lg">
          <Button component={Link} href="/" variant="light" size="sm">
            ← 返回週期表
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box
              style={{
                backgroundColor: `#${element['cpk-hex']}`,
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              <Text size="sm" fw={700}>
                {element.number}
              </Text>
              <Text size="4rem" fw={900} lh={1}>
                {element.symbol}
              </Text>
              <Text size="sm">
                {element.atomic_mass.toFixed(3)}
              </Text>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <div>
                <Text size="2rem" fw={700} mb="xs">
                  {element.name}
                </Text>
                <Badge 
                  color={getCategoryColor(element.category)} 
                  size="lg"
                  variant="light"
                >
                  {element.category}
                </Badge>
              </div>

              <Group gap="xl">
                <div>
                  <Text size="sm" c="dimmed">原子序數</Text>
                  <Text size="lg" fw={600}>{element.number}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">原子量</Text>
                  <Text size="lg" fw={600}>{element.atomic_mass}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">狀態</Text>
                  <Text size="lg" fw={600}>{element.phase}</Text>
                </div>
              </Group>

              <Group gap="xl">
                <div>
                  <Text size="sm" c="dimmed">週期</Text>
                  <Text size="lg" fw={600}>{element.period}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">族</Text>
                  <Text size="lg" fw={600}>{element.group}</Text>
                </div>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Card.Section mt="xl" p="md" bg="gray.0">
          <Text size="sm" c="dimmed">
            分類：{element.category} | 
            週期：{element.period} | 
            族：{element.group} | 
            狀態：{element.phase}
          </Text>
        </Card.Section>
      </Card>
    </Container>
  );
}