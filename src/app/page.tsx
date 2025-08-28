import { Container } from '@mantine/core';
import PeriodicTable from '@/components/PeriodicTable/PeriodicTable';

export default function PeriodicTablePage() {
  return (
    <Container size="xl" py="md">
      <PeriodicTable />
    </Container>
  );
}