'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Text, Group, Badge, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMantineTheme } from '@mantine/core';

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

const PeriodicTable = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const response = await fetch('/api/mocks/periodic-table.json');
        const data: PeriodicTableData = await response.json();
        setElements(data.elements);
      } catch (error) {
        console.error('Error fetching periodic table data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
  }, []);

  const handleElementClick = (element: Element) => {
    router.push(`/periodic-table/${element.number}`);
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'diatomic nonmetal': theme.colors[theme.primaryColor][3],
      'noble gas': theme.colors[theme.primaryColor][4],
      'alkali metal': theme.colors[theme.primaryColor][5],
      'alkaline earth metal': theme.colors[theme.primaryColor][6],
      'metalloid': theme.colors[theme.primaryColor][7],
      'polyatomic nonmetal': theme.colors[theme.primaryColor][8],
      'post-transition metal': theme.colors[theme.primaryColor][9],
      'transition metal': theme.colors.blue[5],
      'lanthanide': theme.colors.green[5],
      'actinide': theme.colors.red[5],
    };
    return categoryColors[category] || theme.colors.gray[5];
  };

  if (loading) {
    return (
      <Box p="md">
        <Text>Loading periodic table...</Text>
      </Box>
    );
  }

  // Create a grid layout for the periodic table
  const createPeriodicTableGrid = () => {
    const grid: (Element | null)[][] = Array(7).fill(null).map(() => Array(18).fill(null));
    const lanthanides: Element[] = [];
    const actinides: Element[] = [];

    elements.forEach(element => {
      if (element.period >= 1 && element.period <= 7 && element.xpos >= 1 && element.xpos <= 18) {
        if (element.number >= 57 && element.number <= 71) { // Lanthanides
          lanthanides.push(element);
        } else if (element.number >= 89 && element.number <= 103) { // Actinides
          actinides.push(element);
        } else {
          grid[element.ypos - 1][element.xpos - 1] = element;
        }
      }
    });

    return { grid, lanthanides, actinides };
  };

  const { grid, lanthanides, actinides } = createPeriodicTableGrid();

  return (
    <Box 
      p="md" 
      style={{
        background: 'linear-gradient(135deg, #f3e7ff 0%, #e6d7ff 25%, #dcc7ff 50%, #d2b7ff 75%, #c8a7ff 100%)',
        minHeight: '100vh',
        borderRadius: '12px'
      }}
    >
      <Text size="xl" fw={700} mb="md" ta="center" style={{ color: '#4a1a5c', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        元素週期表
      </Text>
      
      <Box style={{ overflowX: 'auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(18, 1fr)', 
          gap: '2px',
          minWidth: '1200px'
        }}>
          {grid.map((row, rowIndex) =>
            row.map((element, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} style={{ aspectRatio: '1' }}>
                {element ? (
                  <Tooltip
                    label={
                      <div>
                        <Text size="sm" fw={600}>{element.name}</Text>
                        <Text size="xs">原子量: {element.atomic_mass}</Text>
                        <Text size="xs">分類: {element.category}</Text>
                        <Text size="xs">狀態: {element.phase}</Text>
                      </div>
                    }
                    position="top"
                    withArrow
                  >
                    <Paper
                      p="xs"
                      style={{
                        backgroundColor: getCategoryColor(element.category),
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        border: `2px solid rgba(255,255,255,0.3)`,
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)',
                        transform: 'perspective(100px) rotateX(5deg)',
                        backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
                      }}
                      onClick={() => handleElementClick(element)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'perspective(100px) rotateX(0deg) scale(1.08)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'perspective(100px) rotateX(5deg) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)';
                      }}
                    >
                      <Text size="xs" fw={700} c="white" ta="center">
                        {element.number}
                      </Text>
                      <Text size="lg" fw={900} c="white" ta="center">
                        {element.symbol}
                      </Text>
                      <Text size="xs" c="white" ta="center" style={{ fontSize: '10px' }}>
                        {element.atomic_mass.toFixed(2)}
                      </Text>
                    </Paper>
                  </Tooltip>
                ) : (
                  <div style={{ height: '100%' }} />
                )}
              </div>
            ))
          )}
        </div>

        <Box mt="xl">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(15, 1fr)', 
            gap: '2px',
            minWidth: '1000px',
            marginTop: '20px'
          }}>
            {lanthanides.map((element) => (
              <div key={element.number} style={{ aspectRatio: '1' }}>
                <Tooltip
                  label={
                    <div>
                      <Text size="sm" fw={600}>{element.name}</Text>
                      <Text size="xs">原子量: {element.atomic_mass}</Text>
                      <Text size="xs">分類: {element.category}</Text>
                      <Text size="xs">狀態: {element.phase}</Text>
                    </div>
                  }
                  position="top"
                  withArrow
                >
                  <Paper
                    p="xs"
                    style={{
                      backgroundColor: getCategoryColor(element.category),
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      border: `2px solid rgba(255,255,255,0.3)`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)',
                      transform: 'perspective(100px) rotateX(5deg)',
                      backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
                    }}
                    onClick={() => handleElementClick(element)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'perspective(100px) rotateX(0deg) scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(100px) rotateX(5deg) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)';
                    }}
                  >
                    <Text size="xs" fw={700} c="white" ta="center">
                      {element.number}
                    </Text>
                    <Text size="lg" fw={900} c="white" ta="center">
                      {element.symbol}
                    </Text>
                    <Text size="xs" c="white" ta="center" style={{ fontSize: '10px' }}>
                      {element.atomic_mass.toFixed(2)}
                    </Text>
                  </Paper>
                </Tooltip>
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(15, 1fr)', 
            gap: '2px',
            minWidth: '1000px',
            marginTop: '2px'
          }}>
            {actinides.map((element) => (
              <div key={element.number} style={{ aspectRatio: '1' }}>
                <Tooltip
                  label={
                    <div>
                      <Text size="sm" fw={600}>{element.name}</Text>
                      <Text size="xs">原子量: {element.atomic_mass}</Text>
                      <Text size="xs">分類: {element.category}</Text>
                      <Text size="xs">狀態: {element.phase}</Text>
                    </div>
                  }
                  position="top"
                  withArrow
                >
                  <Paper
                    p="xs"
                    style={{
                      backgroundColor: getCategoryColor(element.category),
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      border: `2px solid rgba(255,255,255,0.3)`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)',
                      transform: 'perspective(100px) rotateX(5deg)',
                      backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
                    }}
                    onClick={() => handleElementClick(element)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'perspective(100px) rotateX(0deg) scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(100px) rotateX(5deg) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)';
                    }}
                  >
                    <Text size="xs" fw={700} c="white" ta="center">
                      {element.number}
                    </Text>
                    <Text size="lg" fw={900} c="white" ta="center">
                      {element.symbol}
                    </Text>
                    <Text size="xs" c="white" ta="center" style={{ fontSize: '10px' }}>
                      {element.atomic_mass.toFixed(2)}
                    </Text>
                  </Paper>
                </Tooltip>
              </div>
            ))}
          </div>
        </Box>
      </Box>

      <Box mt="xl" p="md" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
        <Text size="lg" fw={600} mb="md" style={{ color: '#4a1a5c', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>圖例</Text>
        <Group gap="md" style={{ flexWrap: 'wrap' }}>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('diatomic nonmetal'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>非金屬</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('noble gas'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>惰性氣體</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('alkali metal'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>鹼金屬</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('alkaline earth metal'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>鹼土金屬</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('transition metal'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>過渡金屬</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('post-transition metal'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>後過渡金屬</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('metalloid'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>類金屬</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('lanthanide'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>鑭系元素</Text>
          </Group>
          <Group gap="xs">
            <Box
              w={20}
              h={20}
              style={{
                backgroundColor: getCategoryColor('actinide'),
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Text size="sm" style={{ color: '#4a1a5c', fontWeight: 500 }}>錒系元素</Text>
          </Group>
        </Group>
      </Box>
    </Box>
  );
};

export default PeriodicTable;

