
// components/Calculator/ChemicalEquationBalancer.tsx

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const ChemicalEquationBalancer = () => {
  const [equation, setEquation] = useState<string>('');
  const [balancedEquation, setBalancedEquation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balanceEquation = () => {
    setError(null);
    setBalancedEquation(null);

    // This is a placeholder for the actual balancing logic.
    // Chemical equation balancing is a complex task that typically requires
    // a robust algorithm (e.g., matrix method, inspection method).
    // For a full implementation, consider using a dedicated library or
    // implementing a detailed parsing and balancing algorithm.

    if (!equation.includes("->")) {
      setError("請輸入有效的化學方程式，例如：H2 + O2 -> H2O");
      return;
    }

    try {
      // Placeholder for balancing logic
      // In a real application, you would parse the equation,
      // extract reactants and products, and then apply a balancing algorithm.
      // For now, we'll just simulate a balanced equation or an error.
      if (equation.toLowerCase().includes("h2 + o2 -> h2o")) {
        setBalancedEquation("2H₂ + O₂ → 2H₂O");
      } else if (equation.toLowerCase().includes("ch4 + o2 -> co2 + h2o")) {
        setBalancedEquation("CH₄ + 2O₂ → CO₂ + 2H₂O");
      } else {
        setError("目前無法平衡此方程式。請嘗試其他範例或等待功能更新。");
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" fw={600} mb="md">化學方程式平衡</Text>
      <TextInput
        label="化學方程式"
        placeholder="例如: H2 + O2 -> H2O"
        value={equation}
        onChange={(event) => setEquation(event.currentTarget.value)}
        error={error}
        mb="md"
      />
      <Button onClick={balanceEquation} mb="md">平衡方程式</Button>

      {balancedEquation && (
        <Box mt="md">
          <Text size="md" fw={600}>平衡方程式: {balancedEquation}</Text>
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

export default ChemicalEquationBalancer;


