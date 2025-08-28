
// components/Calculator/ConcentrationCalculator.tsx

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Select, Alert, NumberInput } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const ConcentrationCalculator = () => {
  const [calculationType, setCalculationType] = useState<string | null>('molarity');
  const [soluteMass, setSoluteMass] = useState<number | ''>('');
  const [soluteMW, setSoluteMW] = useState<number | ''>('');
  const [solutionVolume, setSolutionVolume] = useState<number | ''>('');
  const [molarity, setMolarity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateMolarity = () => {
    setError(null);
    setMolarity(null);

    if (soluteMass === '' || soluteMW === '' || solutionVolume === '') {
      setError('請填寫所有必填欄位。');
      return;
    }

    if (soluteMW === 0 || solutionVolume === 0) {
      setError('分子量和溶液體積不能為零。');
      return;
    }

    try {
      const moles = (soluteMass as number) / (soluteMW as number);
      const calculatedMolarity = moles / (solutionVolume as number);
      setMolarity(parseFloat(calculatedMolarity.toFixed(4)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" fw={600} mb="md">濃度計算</Text>
      <Select
        label="計算類型"
        placeholder="選擇計算類型"
        data={[
          { value: 'molarity', label: '摩爾濃度 (M)' },
          { value: 'mass-percentage', label: '質量百分比 (%)' },
          // Add more types as needed
        ]}
        value={calculationType}
        onChange={setCalculationType}
        mb="md"
      />

      {calculationType === 'molarity' && (
        <Box>
          <NumberInput
            label="溶質質量 (g)"
            placeholder="輸入溶質質量"
            value={soluteMass}
            onChange={(value) => setSoluteMass(value as number | '')}
            min={0}
            mb="md"
          />
          <NumberInput
            label="溶質分子量 (g/mol)"
            placeholder="輸入溶質分子量"
            value={soluteMW}
            onChange={(value) => setSoluteMW(value as number | '')}
            min={0}
            mb="md"
          />
          <NumberInput
            label="溶液體積 (L)"
            placeholder="輸入溶液體積"
            value={solutionVolume}
            onChange={(value) => setSolutionVolume(value as number | '')}
            min={0}
            mb="md"
          />
          <Button onClick={calculateMolarity} mb="md">計算摩爾濃度</Button>
          {molarity !== null && (
            <Box mt="md">
              <Text size="md" fw={600}>摩爾濃度: {molarity} M</Text>
            </Box>
          )}
        </Box>
      )}

      {calculationType === 'mass-percentage' && (
        <Box>
          <Text>質量百分比計算功能待開發...</Text>
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

export default ConcentrationCalculator;


