import { AlertTriangle, PackageCheck, ReceiptText, TrendingUp } from 'lucide-react';
import Table from '../components/Table.jsx';
import { currency } from '../services/api.js';

export default function Dashboard({ products, transactions }) {
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter((transaction) => new Date(transaction.date).toDateString() === today);
  const todaySales = todayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const lowStock = products.filter((product) => product.stock <= 10);
  const totalStockValue = products.reduce((sum, product) => sum + product.stock * product.price, 0);
  const bestSeller = products
    .map((product) => ({
      ...product,
      sold: transactions.reduce((sum, transaction) => {
        const item = transaction.items.find((cartItem) => cartItem.id === product.id);
        return sum + (item?.qty ?? 0);
      }, 0),
    }))
    .sort((a, b) => b.sold - a.sold)[0];

  const stats = [
    { label: 'Penjualan Hari Ini', value: currency(todaySales), icon: TrendingUp, tone: 'text-brand-700 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-100' },
    { label: 'Transaksi Hari Ini', value: todayTransactions.length, icon: ReceiptText, tone: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-100' },
    { label: 'Stok Menipis', value: lowStock.length, icon: AlertTriangle, tone: 'text-red-700 bg-red-50 dark:bg-red-500/15 dark:text-red-100' },
    { label: 'Nilai Stok', value: currency(totalStockValue), icon: PackageCheck, tone: 'text-amber-700 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Ringkasan performa toko dan stok barang.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={stat.label}>
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-lg ${stat.tone}`}>
                <Icon size={22} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="section-title">Grafik Penjualan</h2>
          <div className="mt-5 flex h-64 items-end gap-3">
            {[42, 58, 36, 74, 66, 88, 52].map((height, index) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={index}>
                <div className="w-full rounded-t-lg bg-brand-600" style={{ height: `${height}%` }} />
                <span className="text-xs text-slate-500">H{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="section-title">Produk Terlaris</h2>
          {bestSeller ? (
            <div className="mt-5 flex items-center gap-4">
              <img alt={bestSeller.name} className="h-20 w-20 rounded-lg object-cover" src={bestSeller.image} />
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{bestSeller.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{bestSeller.sold} item terjual</p>
                <p className="mt-1 font-bold text-brand-700 dark:text-brand-100">{currency(bestSeller.price)}</p>
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-lg bg-slate-50 px-4 py-8 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              Belum ada produk.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title mb-3">Stok Menipis</h2>
        <Table
          columns={[
            { key: 'name', label: 'Produk' },
            { key: 'category', label: 'Kategori' },
            { key: 'stock', label: 'Stok' },
            { key: 'sku', label: 'SKU' },
          ]}
          data={lowStock}
          emptyText="Semua stok masih aman."
        />
      </section>
    </div>
  );
}
