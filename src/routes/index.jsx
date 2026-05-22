import { BarChart3, Boxes, LayoutDashboard, ReceiptText, UserPlus } from 'lucide-react';
import Accounts from '../pages/Accounts.jsx';
import Cashier from '../pages/Cashier.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Products from '../pages/Products.jsx';
import Reports from '../pages/Reports.jsx';

export const routes = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    component: Dashboard,
    roles: ['Admin', 'Kasir'],
  },
  {
    id: 'cashier',
    label: 'Kasir',
    icon: ReceiptText,
    component: Cashier,
    roles: ['Admin', 'Kasir'],
  },
  {
    id: 'products',
    label: 'Produk',
    icon: Boxes,
    component: Products,
    roles: ['Admin'],
  },
  {
    id: 'reports',
    label: 'Laporan',
    icon: BarChart3,
    component: Reports,
    roles: ['Admin'],
  },
  {
    id: 'accounts',
    label: 'Tambah Akun',
    icon: UserPlus,
    component: Accounts,
    roles: ['Admin'],
  },
];
