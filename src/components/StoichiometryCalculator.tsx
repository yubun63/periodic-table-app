
// components/Calculator/StoichiometryCalculator.tsx

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert, NumberInput } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const StoichiometryCalculator = () => {
  const [equation, setEquation] = useState<string>('');
  const [givenMass, setGivenMass] = useState<number | ''>('');
  const [givenElement, setGivenElement] = useState<string>('');
  const [targetElement, setTargetElement] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateStoichiometry = () => {
    setError(null);
    setResult(null);

    if (!equation || givenMass === '' || !givenElement || !targetElement) {
      setError('請填寫所有必填欄位。');
      return;
    }

    // This is a placeholder for a complex stoichiometry calculation.
    // A full implementation would require:
    // 1. Parsing and balancing the chemical equation.
    // 2. Looking up atomic masses for all elements involved.
    // 3. Performing mole-to-mole, mass-to-mass conversions based on the balanced equation.

    try {
      // Simulate a simple calculation for demonstration
      if (equation.toLowerCase().includes('h2 + o2 -> h2o') && givenElement.toLowerCase() === 'h2' && targetElement.toLowerCase() === 'h2o') {
        const calculatedResult = (givenMass as number) * 9; // Example: if 1g H2, produces 9g H2O (approx)
        setResult(`從 ${givenMass} g ${givenElement} 可產生約 ${calculatedResult.toFixed(2)} g ${targetElement}`);
      } else {
        setError('目前無法處理此化學計量學計算。請嘗試其他範例或等待功能更新。');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" fw={600} mb="md">化學計量學計算</Text>
      <TextInput
        label="平衡化學方程式"
        placeholder="例如: 2H2 + O2 -> 2H2O"
        value={equation}
        onChange={(event) => setEquation(event.currentTarget.value)}
        mb="md"
      />
      <NumberInput
        label="已知物質質量 (g)"
        placeholder="輸入質量"
        value={givenMass}
        onChange={(value) => setGivenMass(value as number | '')}
        min={0}
        mb="md"
      />
      <TextInput
        label="已知物質化學式"
        placeholder="例如: H2"
        value={givenElement}
        onChange={(event) => setGivenElement(event.currentTarget.value)}
        mb="md"
      />
      <TextInput
        label="目標物質化學式"
        placeholder="例如: H2O"
        value={targetElement}
        onChange={(event) => setTargetElement(event.currentTarget.value)}
        mb="md"
      />
      <Button onClick={calculateStoichiometry} mb="md">計算</Button>

      {result && (
        <Box mt="md">
          <Text size="md" fw={600}>計算結果: {result}</Text>
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

export default StoichiometryCalculator;


