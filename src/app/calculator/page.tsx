'use client';

import { Container, Title, Tabs, rem } from '@mantine/core';
import { IconCalculator, IconAtom, IconScale, IconMath } from '@tabler/icons-react';
import MolecularWeightCalculator from '@/components/MolecularWeightCalculator';
import StoichiometryCalculator from '@/components/StoichiometryCalculator';
import ChemicalEquationBalancer from '@/components/ChemicalEquationBalancer';
import AtomicStructureViewer from '@/components/AtomicStructureViewer';

export default function CalculatorPage() {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        化學計算器工具
      </Title>
      
      <Tabs defaultValue="molecular-weight" variant="outline">
        <Tabs.List grow>
          <Tabs.Tab 
            value="molecular-weight" 
            leftSection={<IconCalculator style={iconStyle} />}
          >
            分子量計算
          </Tabs.Tab>
          <Tabs.Tab 
            value="stoichiometry" 
            leftSection={<IconScale style={iconStyle} />}
          >
            化學計量學
          </Tabs.Tab>
          <Tabs.Tab 
            value="equation-balancer" 
            leftSection={<IconMath style={iconStyle} />}
          >
            方程式平衡
          </Tabs.Tab>
          <Tabs.Tab 
            value="atomic-structure" 
            leftSection={<IconAtom style={iconStyle} />}
          >
            原子結構
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="molecular-weight" pt="md">
          <MolecularWeightCalculator />
        </Tabs.Panel>

        <Tabs.Panel value="stoichiometry" pt="md">
          <StoichiometryCalculator />
        </Tabs.Panel>

        <Tabs.Panel value="equation-balancer" pt="md">
          <ChemicalEquationBalancer />
        </Tabs.Panel>

        <Tabs.Panel value="atomic-structure" pt="md">
          <AtomicStructureViewer />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}