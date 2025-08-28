
// components/Calculator/MolecularWeightCalculator.tsx

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ElementData {
  symbol: string;
  atomic_mass: number;
}

interface PeriodicTableData {
  elements: ElementData[];
}

const MolecularWeightCalculator = () => {
  const [formula, setFormula] = useState<string>('');
  const [molecularWeight, setMolecularWeight] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elementsData, setElementsData] = useState<{
    [key: string]: ElementData;
  } | null>(null);

  // Load periodic table data once
  useState(() => {
    const fetchElements = async () => {
      try {
        const response = await fetch('/api/mocks/periodic-table.json');
        const data: PeriodicTableData = await response.json();
        const elementsMap: { [key: string]: ElementData } = {};
        data.elements.forEach((el: any) => {
          elementsMap[el.symbol] = el;
        });
        setElementsData(elementsMap);
      } catch (err) {
        console.error('Failed to load periodic table data:', err);
        setError('無法載入元素週期表數據。');
      }
    };
    fetchElements();
  });

  const calculateMolecularWeight = () => {
    if (!elementsData) {
      setError('元素週期表數據尚未載入。');
      return;
    }

    setError(null);
    setMolecularWeight(null);

    // Regex to parse chemical formula (e.g., H2O, C6H12O6, (NH4)2SO4)
    const elementRegex = /([A-Z][a-z]*)(\d*)|\(([^)]+)\)(\d*)/g;
    let totalWeight = 0;
    let match;

    const parseFormula = (subFormula: string, multiplier: number) => {
      let subTotalWeight = 0;
      let subMatch;
      const subElementRegex = /([A-Z][a-z]*)(\d*)/g;

      while ((subMatch = subElementRegex.exec(subFormula)) !== null) {
        const symbol = subMatch[1];
        const count = subMatch[2] ? parseInt(subMatch[2], 10) : 1;

        if (elementsData[symbol]) {
          subTotalWeight += elementsData[symbol].atomic_mass * count;
        } else {
          throw new Error(`未知元素符號: ${symbol}`);
        }
      }
      return subTotalWeight * multiplier;
    };

    try {
      let remainingFormula = formula;
      while ((match = elementRegex.exec(remainingFormula)) !== null) {
        if (match[3]) { // Group in parentheses
          const subFormula = match[3];
          const subMultiplier = match[4] ? parseInt(match[4], 10) : 1;
          totalWeight += parseFormula(subFormula, subMultiplier);
        } else { // Single element
          const symbol = match[1];
          const count = match[2] ? parseInt(match[2], 10) : 1;

          if (elementsData[symbol]) {
            totalWeight += elementsData[symbol].atomic_mass * count;
          } else {
            throw new Error(`未知元素符號: ${symbol}`);
          }
        }
      }
      setMolecularWeight(parseFloat(totalWeight.toFixed(2)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" fw={600} mb="md">分子量計算</Text>
      <TextInput
        label="化學式"
        placeholder="例如: H2O, C6H12O6, (NH4)2SO4"
        value={formula}
        onChange={(event) => setFormula(event.currentTarget.value)}
        error={error}
        mb="md"
      />
      <Button onClick={calculateMolecularWeight} mb="md">計算分子量</Button>

      {molecularWeight !== null && (
        <Box mt="md">
          <Text size="md" fw={600}>分子量: {molecularWeight} g/mol</Text>
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

export default MolecularWeightCalculator;


