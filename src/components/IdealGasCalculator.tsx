'use client';

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert, NumberInput, Group, Stack, Select } from '@mantine/core';
import { IconAlertCircle, IconAtom2 } from '@tabler/icons-react';

const IdealGasCalculator = () => {
  const [pressure, setPressure] = useState<number | ''>('');
  const [volume, setVolume] = useState<number | ''>('');
  const [moles, setMoles] = useState<number | ''>('');
  const [temperature, setTemperature] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<string>('pressure');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const R = 0.08206; // 理想氣體常數 L·atm/(mol·K)

  const calculateIdealGas = () => {
    setError(null);
    setResult(null);

    // 使用理想氣體定律：PV = nRT
    try {
      switch (calculationType) {
        case 'pressure':
          if (volume === '' || moles === '' || temperature === '') {
            setError('請填寫體積、莫耳數和溫度。');
            return;
          }
          if (Number(temperature) <= 0) {
            setError('溫度必須大於0 K。');
            return;
          }
          const calcPressure = (Number(moles) * R * Number(temperature)) / Number(volume);
          setResult(calcPressure);
          break;

        case 'volume':
          if (pressure === '' || moles === '' || temperature === '') {
            setError('請填寫壓力、莫耳數和溫度。');
            return;
          }
          if (Number(temperature) <= 0) {
            setError('溫度必須大於0 K。');
            return;
          }
          const calcVolume = (Number(moles) * R * Number(temperature)) / Number(pressure);
          setResult(calcVolume);
          break;

        case 'moles':
          if (pressure === '' || volume === '' || temperature === '') {
            setError('請填寫壓力、體積和溫度。');
            return;
          }
          if (Number(temperature) <= 0) {
            setError('溫度必須大於0 K。');
            return;
          }
          const calcMoles = (Number(pressure) * Number(volume)) / (R * Number(temperature));
          setResult(calcMoles);
          break;

        case 'temperature':
          if (pressure === '' || volume === '' || moles === '') {
            setError('請填寫壓力、體積和莫耳數。');
            return;
          }
          const calcTemperature = (Number(pressure) * Number(volume)) / (Number(moles) * R);
          setResult(calcTemperature);
          break;

        default:
          setError('請選擇計算類型。');
          return;
      }
    } catch (e: any) {
      setError('計算過程中發生錯誤。');
    }
  };

  const getResultLabel = (): string => {
    switch (calculationType) {
      case 'pressure': return '壓力 (P)';
      case 'volume': return '體積 (V)';
      case 'moles': return '莫耳數 (n)';
      case 'temperature': return '溫度 (T)';
      default: return '結果';
    }
  };

  const getResultUnit = (): string => {
    switch (calculationType) {
      case 'pressure': return 'atm';
      case 'volume': return 'L';
      case 'moles': return 'mol';
      case 'temperature': return 'K';
      default: return '';
    }
  };

  const convertTemperature = (kelvin: number): string => {
    const celsius = kelvin - 273.15;
    return `${celsius.toFixed(2)}°C`;
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconAtom2 size={24} />
        <Text size="lg" fw={600}>理想氣體定律計算器</Text>
      </Group>
      
      <Stack gap="md">
        <Select
          label="計算類型"
          placeholder="選擇要計算的參數"
          data={[
            { value: 'pressure', label: '計算壓力 (P)' },
            { value: 'volume', label: '計算體積 (V)' },
            { value: 'moles', label: '計算莫耳數 (n)' },
            { value: 'temperature', label: '計算溫度 (T)' }
          ]}
          value={calculationType}
          onChange={(value) => {
            setCalculationType(value || 'pressure');
            setResult(null);
            setError(null);
          }}
        />

        <Group grow>
          <NumberInput
            label="壓力 (P)"
            placeholder="atm"
            value={pressure}
            onChange={(value) => setPressure(value as number | '')}
            min={0}
            step={0.1}
            disabled={calculationType === 'pressure'}
          />
          <NumberInput
            label="體積 (V)"
            placeholder="L"
            value={volume}
            onChange={(value) => setVolume(value as number | '')}
            min={0}
            step={0.1}
            disabled={calculationType === 'volume'}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="莫耳數 (n)"
            placeholder="mol"
            value={moles}
            onChange={(value) => setMoles(value as number | '')}
            min={0}
            step={0.1}
            disabled={calculationType === 'moles'}
          />
          <NumberInput
            label="溫度 (T)"
            placeholder="K"
            value={temperature}
            onChange={(value) => setTemperature(value as number | '')}
            min={0}
            step={1}
            disabled={calculationType === 'temperature'}
          />
        </Group>

        <Button onClick={calculateIdealGas}>
          計算理想氣體
        </Button>

        {result !== null && (
          <Box>
            <Text size="md" fw={600} mb="sm">計算結果：</Text>
            <Stack gap="xs">
              <Text size="sm">
                <strong>{getResultLabel()}：</strong> {result.toFixed(4)} {getResultUnit()}
              </Text>
              {calculationType === 'temperature' && (
                <Text size="sm" c="blue">
                  <strong>攝氏溫度：</strong> {convertTemperature(result)}
                </Text>
              )}
              <Text size="xs" c="dimmed">
                理想氣體定律：PV = nRT (R = {R} L·atm/(mol·K))
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

export default IdealGasCalculator;