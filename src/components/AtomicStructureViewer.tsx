
// components/Calculator/AtomicStructureViewer.tsx

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, TextInput, Button, Text, Paper, Alert, Select, Tabs, rem } from '@mantine/core';
import { IconAlertCircle, IconAtom, IconChartDots3, IconChartLine } from '@tabler/icons-react';

// 動態導入以避免服務端渲染問題
const AtomicOrbitalsVisualization = dynamic(() => import('./AtomicOrbitalsVisualization'), { 
  ssr: false,
  loading: () => <Text>載入3D模型中...</Text>
});
const ElectronConfigurationChart = dynamic(() => import('./ElectronConfigurationChart'), { 
  ssr: false,
  loading: () => <Text>載入圖表中...</Text>
});

interface ElementData {
  name: string;
  symbol: string;
  number: number;
  atomic_mass: number;
  category: string;
  period: number;
  group: number;
  phase: string;
  'cpk-hex': string;
  image: string;
  electron_configuration: string;
  electron_shells: number[];
  orbitals: { [key: string]: number };
}

interface PeriodicTableData {
  elements: ElementData[];
}

const AtomicStructureViewer = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [elementInfo, setElementInfo] = useState<ElementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elementsOptions, setElementsOptions] = useState<{ value: string; label: string; }[]>([]);
  const [elementsMap, setElementsMap] = useState<{[key: string]: ElementData} | null>(null);

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const response = await fetch("/api/mocks/periodic-table.json");
        const data: PeriodicTableData = await response.json();
        const options = data.elements.map(el => ({ value: String(el.number), label: `${el.name} (${el.symbol})` }));
        const map: {[key: string]: ElementData} = {};
        data.elements.forEach(el => { map[String(el.number)] = el; });
        setElementsOptions(options);
        setElementsMap(map);
      } catch (err) {
        console.error("Failed to load periodic table data:", err);
        setError("無法載入元素週期表數據。");
      }
    };
    fetchElements();
  }, []);

  const handleElementSelect = (value: string | null) => {
    setSelectedElement(value);
    setError(null);
    if (value && elementsMap) {
      setElementInfo(elementsMap[value]);
    } else {
      setElementInfo(null);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" fw={600} mb="md">原子結構可視化</Text>
      <Select
        label="選擇元素"
        placeholder="選擇一個元素"
        data={elementsOptions}
        value={selectedElement}
        onChange={handleElementSelect}
        mb="md"
      />

      {elementInfo && (
        <Tabs defaultValue="basic" variant="outline">
          <Tabs.List>
            <Tabs.Tab 
              value="basic" 
              leftSection={<IconAtom style={{ width: rem(12), height: rem(12) }} />}
            >
              基本信息
            </Tabs.Tab>
            <Tabs.Tab 
              value="3d-model" 
              leftSection={<IconChartDots3 style={{ width: rem(12), height: rem(12) }} />}
            >
              3D軌道模型
            </Tabs.Tab>
            <Tabs.Tab 
              value="electron-config" 
              leftSection={<IconChartLine style={{ width: rem(12), height: rem(12) }} />}
            >
              電子排布圖
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic" pt="md">
            <Box>
              <Text size="md" fw={600}>元素名稱: {elementInfo.name}</Text>
              <Text size="sm">元素符號: {elementInfo.symbol}</Text>
              <Text size="sm">原子序: {elementInfo.number}</Text>
              <Text size="sm">原子質量: {elementInfo.atomic_mass} u</Text>
              <Text size="sm">分類: {elementInfo.category}</Text>
              <Text size="sm">週期: {elementInfo.period}</Text>
              <Text size="sm">族: {elementInfo.group}</Text>
              <Text size="sm">相態: {elementInfo.phase}</Text>
              <Text size="sm">電子排布: {elementInfo.electron_configuration}</Text>
              <Box 
                mt="sm" 
                p="xs" 
                style={{ 
                  backgroundColor: `#${elementInfo['cpk-hex']}`, 
                  width: '50px', 
                  height: '30px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Text size="xs" c="dimmed">CPK 顏色代碼</Text>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="3d-model" pt="md">
            <AtomicOrbitalsVisualization element={elementInfo} />
          </Tabs.Panel>

          <Tabs.Panel value="electron-config" pt="md">
            <ElectronConfigurationChart element={elementInfo} />
          </Tabs.Panel>
        </Tabs>
      )}

      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="錯誤" color="red" mt="md">
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default AtomicStructureViewer;


