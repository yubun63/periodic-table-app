'use client';

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert, NumberInput, Group, Stack } from '@mantine/core';
import { IconAlertCircle, IconTestPipe } from '@tabler/icons-react';

const PhCalculator = () => {
  const [phValue, setPhValue] = useState<number | ''>('');
  const [hPlusConcentration, setHPlusConcentration] = useState<number | null>(null);
  const [ohMinusConcentration, setOhMinusConcentration] = useState<number | null>(null);
  const [pohValue, setPohValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateFromPh = () => {
    setError(null);
    
    if (phValue === '' || phValue < 0 || phValue > 14) {
      setError('pH值必須在0到14之間。');
      return;
    }

    try {
      const hPlus = Math.pow(10, -phValue);
      const ohMinus = Math.pow(10, -(14 - phValue));
      const poh = 14 - phValue;

      setHPlusConcentration(hPlus);
      setOhMinusConcentration(ohMinus);
      setPohValue(poh);
    } catch (e: any) {
      setError('計算過程中發生錯誤。');
    }
  };

  const formatScientific = (value: number): string => {
    if (value === 0) return '0';
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    return `${mantissa.toFixed(2)} × 10^${exponent}`;
  };

  const getSolutionType = (ph: number): string => {
    if (ph < 7) return '酸性';
    if (ph > 7) return '鹼性';
    return '中性';
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconTestPipe size={24} />
        <Text size="lg" fw={600}>pH計算器</Text>
      </Group>
      
      <Stack gap="md">
        <NumberInput
          label="pH值"
          placeholder="輸入pH值 (0-14)"
          value={phValue}
          onChange={setPhValue}
          min={0}
          max={14}
          step={0.01}
          precision={2}
          error={error}
        />

        <Button onClick={calculateFromPh} disabled={phValue === ''}>
          計算濃度
        </Button>

        {hPlusConcentration !== null && (
          <Box>
            <Text size="md" fw={600} mb="sm">計算結果：</Text>
            <Stack gap="xs">
              <Text size="sm">
                <strong>溶液類型：</strong> {getSolutionType(Number(phValue))}
              </Text>
              <Text size="sm">
                <strong>H⁺ 濃度：</strong> {formatScientific(hPlusConcentration)} M
              </Text>
              <Text size="sm">
                <strong>OH⁻ 濃度：</strong> {formatScientific(ohMinusConcentration!)} M
              </Text>
              <Text size="sm">
                <strong>pOH值：</strong> {pohValue!.toFixed(2)}
              </Text>
            </Stack>
          </Box>
        )}

        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="錯誤" color="red">
            {error}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default PhCalculator;