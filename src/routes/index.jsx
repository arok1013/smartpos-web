import { BarChart3, Boxes, LayoutDashboard, ReceiptText } from 'lucide-react';
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
  },
  {
    id: 'cashier',
    label: 'Kasir',
    icon: ReceiptText,
    component: Cashier,
  },
  {
    id: 'products',
    label: 'Produk',
    icon: Boxes,
    component: Products,
  },
  {
    id: 'reports',
    label: 'Laporan',
    icon: BarChart3,
    component: Reports,
  },
];
