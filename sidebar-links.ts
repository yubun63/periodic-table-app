import { IconChartBar, IconTable, IconAtom } from '@tabler/icons-react';

// import { PATH_DASHBOARD } from '@/routes';

// Define dashboard paths directly
const PATH_DASHBOARD = {
  root: '/',
  default: '/',
  periodicTable: '/periodic-table',
};

// Sidebar will only show the dashboard.
export const SIDEBAR_LINKS = [
  {
    title: '化學工具',
    links: [
      { label: '週期表', icon: IconAtom, link: '/periodic-table' },
      { label: '化學計算器', icon: IconChartBar, link: '/calculator' },
    ],
  }
];
