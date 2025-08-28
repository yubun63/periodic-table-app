'use client';

import React, { useEffect, useRef } from 'react';
import { Paper, Text, Box, Group, Badge } from '@mantine/core';
import * as d3 from 'd3';

interface ElectronConfigurationChartProps {
  element: {
    number: number;
    symbol: string;
    electron_configuration: string;
    electron_shells: number[];
    orbitals: { [key: string]: number };
  };
}

export default function ElectronConfigurationChart({ element }: ElectronConfigurationChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const energyDiagramRef = useRef<SVGSVGElement>(null);

  // 軌道能級順序
  const orbitalOrder = [
    '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'
  ];

  // 軌道顏色映射
  const orbitalColors = {
    's': '#ff6b6b',
    'p': '#4dabf7', 
    'd': '#69db7c',
    'f': '#ffd43b'
  };

  // 繪製電子殼層圖
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;

    // 繪製原子核
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 15)
      .attr('fill', '#ff6b6b')
      .attr('stroke', '#c92a2a')
      .attr('stroke-width', 2);

    // 添加質子數標籤
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(element.number);

    // 繪製電子殼層
    element.electron_shells.forEach((electronCount, shellIndex) => {
      const radius = 30 + shellIndex * 40;
      
      // 繪製軌道環
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', '#4dabf7')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.6);

      // 繪製電子
      for (let i = 0; i < electronCount; i++) {
        const angle = (i / electronCount) * 2 * Math.PI;
        const electronX = centerX + Math.cos(angle) * radius;
        const electronY = centerY + Math.sin(angle) * radius;

        svg.append('circle')
          .attr('cx', electronX)
          .attr('cy', electronY)
          .attr('r', 4)
          .attr('fill', '#74c0fc')
          .attr('stroke', '#1c7ed6')
          .attr('stroke-width', 1);
      }

      // 添加殼層標籤
      svg.append('text')
        .attr('x', centerX + radius + 10)
        .attr('y', centerY)
        .attr('text-anchor', 'start')
        .attr('fill', '#4dabf7')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`K${shellIndex + 1}: ${electronCount}e⁻`);
    });

  }, [element]);

  // 繪製能級圖
  useEffect(() => {
    if (!energyDiagramRef.current) return;

    const svg = d3.select(energyDiagramRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 300;
    const marginLeft = 50;
    const marginBottom = 30;

    // 過濾出存在的軌道
    const existingOrbitals = orbitalOrder.filter(orbital => element.orbitals[orbital]);
    
    if (existingOrbitals.length === 0) return;

    // Y軸比例尺（能級）
    const yScale = d3.scaleLinear()
      .domain([0, existingOrbitals.length - 1])
      .range([height - marginBottom, 20]);

    // 繪製能級線和電子
    existingOrbitals.forEach((orbital, index) => {
      const electronCount = element.orbitals[orbital];
      const y = yScale(index);
      const orbitalType = orbital.slice(-1) as keyof typeof orbitalColors;
      const color = orbitalColors[orbitalType] || '#868e96';

      // 繪製能級線
      svg.append('line')
        .attr('x1', marginLeft)
        .attr('x2', marginLeft + 100)
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', color)
        .attr('stroke-width', 3);

      // 添加軌道標籤
      svg.append('text')
        .attr('x', marginLeft - 10)
        .attr('y', y + 5)
        .attr('text-anchor', 'end')
        .attr('fill', color)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(orbital);

      // 繪製電子箭頭
      const maxElectrons = orbital.includes('s') ? 2 : orbital.includes('p') ? 6 : orbital.includes('d') ? 10 : 14;
      const electronBoxes = orbital.includes('s') ? 1 : orbital.includes('p') ? 3 : orbital.includes('d') ? 5 : 7;
      
      for (let box = 0; box < electronBoxes; box++) {
        const boxX = marginLeft + 10 + box * 15;
        const electronsInBox = Math.min(2, Math.max(0, electronCount - box * 2));
        
        // 繪製軌道方框
        svg.append('rect')
          .attr('x', boxX - 5)
          .attr('y', y - 8)
          .attr('width', 10)
          .attr('height', 16)
          .attr('fill', 'none')
          .attr('stroke', '#dee2e6')
          .attr('stroke-width', 1);

        // 繪製電子箭頭
        if (electronsInBox >= 1) {
          // 上箭頭
          svg.append('path')
            .attr('d', `M ${boxX} ${y - 6} L ${boxX - 2} ${y - 2} L ${boxX + 2} ${y - 2} Z`)
            .attr('fill', '#1c7ed6');
        }
        if (electronsInBox >= 2) {
          // 下箭頭
          svg.append('path')
            .attr('d', `M ${boxX} ${y + 6} L ${boxX - 2} ${y + 2} L ${boxX + 2} ${y + 2} Z`)
            .attr('fill', '#1c7ed6');
        }
      }

      // 添加電子數標籤
      svg.append('text')
        .attr('x', marginLeft + 120)
        .attr('y', y + 5)
        .attr('text-anchor', 'start')
        .attr('fill', '#495057')
        .attr('font-size', '10px')
        .text(`${electronCount}e⁻`);
    });

    // 添加標題
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#495057')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('電子能級圖');

  }, [element]);

  return (
    <Box>
      <Group grow>
        <Paper withBorder p="md">
          <Text size="lg" fw={600} mb="sm">電子殼層模型</Text>
          <svg ref={svgRef} width={400} height={300} style={{ border: '1px solid #dee2e6', borderRadius: '8px' }} />
        </Paper>

        <Paper withBorder p="md">
          <Text size="lg" fw={600} mb="sm">軌道能級圖</Text>
          <svg ref={energyDiagramRef} width={400} height={300} style={{ border: '1px solid #dee2e6', borderRadius: '8px' }} />
        </Paper>
      </Group>

      <Paper withBorder p="md" mt="md">
        <Text size="lg" fw={600} mb="sm">電子排布</Text>
        <Group mb="md">
          <Badge color="blue" variant="light">配置: {element.electron_configuration}</Badge>
          <Badge color="green" variant="light">總電子數: {element.number}</Badge>
        </Group>
        
        <Text size="sm" c="dimmed" mb="xs">各殼層電子數:</Text>
        <Group gap="xs">
          {element.electron_shells.map((count, index) => (
            <Badge key={index} color="gray" variant="outline">
              殼層 {index + 1}: {count}e⁻
            </Badge>
          ))}
        </Group>

        <Text size="sm" c="dimmed" mb="xs" mt="md">軌道詳細分布:</Text>
        <Group gap="xs">
          {Object.entries(element.orbitals).map(([orbital, count]) => {
            if (orbital === 'simplified') return null;
            const orbitalType = orbital.slice(-1) as keyof typeof orbitalColors;
            const color = orbitalColors[orbitalType] || 'gray';
            return (
              <Badge key={orbital} color={color} variant="light">
                {orbital}: {count}e⁻
              </Badge>
            );
          })}
        </Group>
      </Paper>
    </Box>
  );
}