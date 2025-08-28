
// components/Calculator/OtherCalculators.tsx

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert, NumberInput, Select } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const OtherCalculators = () => {
  const [calculationType, setCalculationType] = useState<string | null>('ideal-gas');
  const [pressure, setPressure] = useState<number | ''>('');
  const [volume, setVolume] = useState<number | ''>('');
  const [moles, setMoles] = useState<number | ''>('');
  const [temperature, setTemperature] = useState<number | ''>('');
  const [gasResult, setGasResult] = useState<number | null>(null);
  const [phValue, setPhValue] = useState<number | ''>('');
  const [hPlusConcentration, setHPlusConcentration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const R = 0.08206; // Ideal gas constant in L·atm/(mol·K)

  const calculateIdealGas = () => {
    setError(null);
    setGasResult(null);

    if (pressure === '' || volume === '' || moles === '' || temperature === '') {
      setError('請填寫所有理想氣體定律的欄位。');
      return;
    }

    try {
      // Assuming we are solving for one unknown, for simplicity, let's say P
      // This needs to be expanded to solve for any unknown based on user input
      const calculatedPressure = ((moles as number) * R * (temperature as number)) / (volume as number);
      setGasResult(parseFloat(calculatedPressure.toFixed(4)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const calculatePH = () => {
    setError(null);
    setHPlusConcentration(null);

    if (phValue === '') {
      setError('請輸入 pH 值。');
      return;
    }

    try {
      const concentration = Math.pow(10, -(phValue as number));
      setHPlusConcentration(parseFloat(concentration.toExponential(2)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Text size="lg" fw={600} mb="md">其他化學計算</Text>
      <Select
        label="計算類型"
        placeholder="選擇計算類型"
        data={[
          { value: 'ideal-gas', label: '理想氣體定律 (PV=nRT)' },
          { value: 'ph-calculation', label: 'pH 值計算' },
        ]}
        value={calculationType}
        onChange={setCalculationType}
        mb="md"
      />

      {calculationType === 'ideal-gas' && (
        <Box>
          <NumberInput
            label="壓力 (atm)"
            placeholder="輸入壓力"
            value={pressure}
            onChange={(value) => setPressure(value as number | '')}
            min={0}
            mb="md"
          />
          <NumberInput
            label="體積 (L)"
            placeholder="輸入體積"
            value={volume}
            onChange={(value) => setVolume(value as number | '')}
            min={0}
            mb="md"
          />
          <NumberInput
            label="摩爾數 (mol)"
            placeholder="輸入摩爾數"
            value={moles}
            onChange={(value) => setMoles(value as number | '')}
            min={0}
            mb="md"
          />
          <NumberInput
            label="溫度 (K)"
            placeholder="輸入溫度"
            value={temperature}
            onChange={(value) => setTemperature(value as number | '')}
            min={0}
            mb="md"
          />
          <Button onClick={calculateIdealGas} mb="md">計算壓力 (示例)</Button>
          {gasResult !== null && (
            <Box mt="md">
              <Text size="md" fw={600}>計算壓力: {gasResult} atm</Text>
            </Box>
          )}
        </Box>
      )}

      {calculationType === 'ph-calculation' && (
        <Box>
          <NumberInput
            label="pH 值"
            placeholder="輸入 pH 值"
            value={phValue}
            onChange={(value) => setPhValue(value as number | '')}
            min={0}
            max={14}
            step={0.01}
            mb="md"
          />
          <Button onClick={calculatePH} mb="md">計算 [H+] 濃度</Button>
          {hPlusConcentration !== null && (
            <Box mt="md">
              <Text size="md" fw={600}>[H+] 濃度: {hPlusConcentration} M</Text>
            </Box>
          )}
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

export default OtherCalculators;


