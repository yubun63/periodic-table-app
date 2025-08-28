'use client';

import { useState } from 'react';
import { Box, TextInput, Button, Text, Paper, Alert, NumberInput, Group, Stack, Select } from '@mantine/core';
import { IconAlertCircle, IconFlask } from '@tabler/icons-react';

const DilutionCalculator = () => {
  const [initialConcentration, setInitialConcentration] = useState<number | ''>('');
  const [initialVolume, setInitialVolume] = useState<number | ''>('');
  const [finalConcentration, setFinalConcentration] = useState<number | ''>('');
  const [finalVolume, setFinalVolume] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<string>('finalVolume');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateDilution = () => {
    setError(null);
    setResult(null);

    // 使用稀釋公式：C1V1 = C2V2
    try {
      switch (calculationType) {
        case 'finalVolume':
          if (initialConcentration === '' || initialVolume === '' || finalConcentration === '') {
            setError('請填寫初始濃度、初始體積和最終濃度。');
            return;
          }
          if (Number(finalConcentration) >= Number(initialConcentration)) {
            setError('最終濃度必須小於初始濃度（稀釋）。');
            return;
          }
          const calcFinalVolume = (Number(initialConcentration) * Number(initialVolume)) / Number(finalConcentration);
          setResult(calcFinalVolume);
          break;

        case 'finalConcentration':
          if (initialConcentration === '' || initialVolume === '' || finalVolume === '') {
            setError('請填寫初始濃度、初始體積和最終體積。');
            return;
          }
          if (Number(finalVolume) <= Number(initialVolume)) {
            setError('最終體積必須大於初始體積（稀釋）。');
            return;
          }
          const calcFinalConcentration = (Number(initialConcentration) * Number(initialVolume)) / Number(finalVolume);
          setResult(calcFinalConcentration);
          break;

        case 'initialConcentration':
          if (initialVolume === '' || finalConcentration === '' || finalVolume === '') {
            setError('請填寫初始體積、最終濃度和最終體積。');
            return;
          }
          const calcInitialConcentration = (Number(finalConcentration) * Number(finalVolume)) / Number(initialVolume);
          setResult(calcInitialConcentration);
          break;

        case 'initialVolume':
          if (initialConcentration === '' || finalConcentration === '' || finalVolume === '') {
            setError('請填寫初始濃度、最終濃度和最終體積。');
            return;
          }
          const calcInitialVolume = (Number(finalConcentration) * Number(finalVolume)) / Number(initialConcentration);
          setResult(calcInitialVolume);
          break;

        default:
          setError('請選擇計算類型。');
          return;
      }
    } catch (e: any) {
      setError('計算過程中發生錯誤。');
    }
  };

  const getRequiredWaterVolume = (): number | null => {
    if (calculationType === 'finalVolume' && result !== null && initialVolume !== '') {
      return result - Number(initialVolume);
    }
    return null;
  };

  const getResultLabel = (): string => {
    switch (calculationType) {
      case 'finalVolume': return '最終體積';
      case 'finalConcentration': return '最終濃度';
      case 'initialConcentration': return '初始濃度';
      case 'initialVolume': return '初始體積';
      default: return '結果';
    }
  };

  const getResultUnit = (): string => {
    switch (calculationType) {
      case 'finalVolume':
      case 'initialVolume': 
        return 'mL';
      case 'finalConcentration':
      case 'initialConcentration': 
        return 'M';
      default: 
        return '';
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconFlask size={24} />
        <Text size="lg" fw={600}>濃度稀釋計算器</Text>
      </Group>
      
      <Stack gap="md">
        <Select
          label="計算類型"
          placeholder="選擇要計算的參數"
          data={[
            { value: 'finalVolume', label: '計算最終體積 (V₂)' },
            { value: 'finalConcentration', label: '計算最終濃度 (C₂)' },
            { value: 'initialConcentration', label: '計算初始濃度 (C₁)' },
            { value: 'initialVolume', label: '計算初始體積 (V₁)' }
          ]}
          value={calculationType}
          onChange={(value) => {
            setCalculationType(value || 'finalVolume');
            setResult(null);
            setError(null);
          }}
        />

        <Group grow>
          <NumberInput
            label="初始濃度 (C₁)"
            placeholder="M"
            value={initialConcentration}
            onChange={setInitialConcentration}
            min={0}
            step={0.1}
            precision={3}
            disabled={calculationType === 'initialConcentration'}
          />
          <NumberInput
            label="初始體積 (V₁)"
            placeholder="mL"
            value={initialVolume}
            onChange={setInitialVolume}
            min={0}
            step={1}
            precision={1}
            disabled={calculationType === 'initialVolume'}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="最終濃度 (C₂)"
            placeholder="M"
            value={finalConcentration}
            onChange={setFinalConcentration}
            min={0}
            step={0.1}
            precision={3}
            disabled={calculationType === 'finalConcentration'}
          />
          <NumberInput
            label="最終體積 (V₂)"
            placeholder="mL"
            value={finalVolume}
            onChange={setFinalVolume}
            min={0}
            step={1}
            precision={1}
            disabled={calculationType === 'finalVolume'}
          />
        </Group>

        <Button onClick={calculateDilution}>
          計算稀釋
        </Button>

        {result !== null && (
          <Box>
            <Text size="md" fw={600} mb="sm">計算結果：</Text>
            <Stack gap="xs">
              <Text size="sm">
                <strong>{getResultLabel()}：</strong> {result.toFixed(3)} {getResultUnit()}
              </Text>
              {getRequiredWaterVolume() !== null && (
                <Text size="sm" c="blue">
                  <strong>需要添加的水量：</strong> {getRequiredWaterVolume()!.toFixed(1)} mL
                </Text>
              )}
              <Text size="xs" c="dimmed">
                稀釋公式：C₁V₁ = C₂V₂
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

export default DilutionCalculator;