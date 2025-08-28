
// components/Calculator/AtomicStructureViewer.tsx

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert, Select } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ElementData {
  name: string;
  symbol: string;
  number: number;
  shells: number[];
  electron_configuration: string;
  electron_configuration_semantic: string;
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

  useState(() => {
    const fetchElements = async () => {
      try {
        const response = await fetch("/mocks/periodic-table.json");
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
  });

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
      <Text size="lg" fw={600} mb="md">原子結構查看器</Text>
      <Select
        label="選擇元素"
        placeholder="選擇一個元素"
        data={elementsOptions}
        value={selectedElement}
        onChange={handleElementSelect}
        mb="md"
      />

      {elementInfo && (
        <Box mt="md">
          <Text size="md" fw={600}>元素名稱: {elementInfo.name}</Text>
          <Text size="sm">原子序: {elementInfo.number}</Text>
          <Text size="sm">電子層數: {elementInfo.shells.length}</Text>
          <Text size="sm">電子排布: {elementInfo.electron_configuration}</Text>
          <Text size="sm">簡化電子排布: {elementInfo.electron_configuration_semantic}</Text>
          {/* 可以添加更多原子結構的可視化，例如軌道圖，但這會需要更複雜的圖形庫 */}
          <Text size="sm" mt="sm" c="dimmed">
            更詳細的原子結構可視化（如軌道圖）需要複雜的圖形庫支持，目前僅提供基本信息。
          </Text>
        </Box>
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


