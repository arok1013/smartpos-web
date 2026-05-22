import { Download, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import Table from '../components/Table.jsx';
import { currency } from '../services/api.js';

const ranges = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
};

export default function Reports({ transactions }) {
  const [range, setRange] = useState('daily');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      if (range === 'daily') return date.toDateString() === now.toDateString();
      if (range === 'weekly') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return date >= sevenDaysAgo;
      }
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }, [range, transactions]);

  const totalIncome = filteredTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const totalItems = filteredTransactions.reduce((sum, transaction) => sum + transaction.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0);
  const paymentSummary = filteredTransactions.reduce((summary, transaction) => {
    summary[transaction.paymentMethod] = (summary[transaction.paymentMethod] ?? 0) + transaction.total;
    return summary;
  }, {});

  const exportCsv = () => {
    const header = ['ID Transaksi', 'Tanggal', 'Metode', 'Total', 'Dibayar', 'Kembalian'];
    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      new Date(transaction.date).toLocaleString('id-ID'),
      transaction.paymentMethod,
      transaction.total,
      transaction.paid,
      transaction.change,
    ]);
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-${range}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Laporan</h1>
          <p className="page-subtitle">Pantau transaksi dan pendapatan toko.</p>
        </div>
        <button className="primary-button gap-2" onClick={exportCsv} type="button">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {Object.entries(ranges).map(([key, label]) => (
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              range === key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            key={key}
            onClick={() => setRange(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Pendapatan</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{currency(totalIncome)}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Transaksi</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{filteredTransactions.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Item Terjual</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{totalItems}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'date', label: 'Tanggal', render: (transaction) => new Date(transaction.date).toLocaleString('id-ID') },
            { key: 'paymentMethod', label: 'Metode' },
            { key: 'total', label: 'Total', render: (transaction) => currency(transaction.total) },
            { key: 'change', label: 'Kembalian', render: (transaction) => currency(transaction.change) },
          ]}
          data={filteredTransactions}
        />

        <aside className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-brand-600 dark:text-brand-100" size={20} />
            <h2 className="section-title">Metode Pembayaran</h2>
          </div>
          <div className="space-y-3">
            {['Cash', 'QRIS', 'Transfer'].map((method) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-950" key={method}>
                <span className="text-sm font-medium">{method}</span>
                <span className="text-sm font-bold">{currency(paymentSummary[method] ?? 0)}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
