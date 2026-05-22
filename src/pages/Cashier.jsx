import { Minus, Plus, Printer, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { createTransactionId, currency } from '../services/api.js';

export default function Cashier({ addTransaction, products }) {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paid, setPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const filteredProducts = products.filter((product) => {
    const keyword = query.toLowerCase();
    return [product.name, product.sku, product.barcode, product.category].some((value) => value.toLowerCase().includes(keyword));
  });

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.qty * item.price, 0), [cart]);
  const numericPaid = Number(paid || 0);
  const change = Math.max(numericPaid - subtotal, 0);

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) => (item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stock) } : item));
      }
      return [...items, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    const product = products.find((item) => item.id === id);
    setCart((items) => items.map((item) => (item.id === id ? { ...item, qty: Math.max(1, Math.min(qty, product.stock)) } : item)));
  };

  const removeItem = (id) => {
    setCart((items) => items.filter((item) => item.id !== id));
  };

  const checkout = () => {
    if (cart.length === 0 || numericPaid < subtotal) return;
    const transaction = {
      id: createTransactionId(),
      date: new Date().toISOString(),
      paymentMethod,
      paid: numericPaid,
      total: subtotal,
      change,
      items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
    };
    addTransaction(transaction);
    setCart([]);
    setPaid('');
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Halaman Kasir</h1>
        <p className="page-subtitle">Cari produk, tambah ke keranjang, dan hitung kembalian otomatis.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <input
            className="field-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama produk, SKU, kategori, atau scan barcode"
            type="search"
            value={query}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} onAdd={addToCart} product={product} />
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="section-title">Keranjang</h2>
          <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                Keranjang masih kosong.
              </p>
            ) : (
              cart.map((item) => (
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800" key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{currency(item.price)}</p>
                    </div>
                    <button className="icon-button text-red-600 dark:text-red-400" onClick={() => removeItem(item.id)} title="Hapus item" type="button">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="icon-button h-8 w-8" onClick={() => updateQty(item.id, item.qty - 1)} title="Kurangi" type="button">
                        <Minus size={15} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button className="icon-button h-8 w-8" onClick={() => updateQty(item.id, item.qty + 1)} title="Tambah" type="button">
                        <Plus size={15} />
                      </button>
                    </div>
                    <p className="font-bold text-slate-950 dark:text-white">{currency(item.price * item.qty)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Total</span>
              <strong className="text-xl text-slate-950 dark:text-white">{currency(subtotal)}</strong>
            </div>

            <label className="field-label" htmlFor="paymentMethod">
              Metode Pembayaran
            </label>
            <select className="field-input" id="paymentMethod" onChange={(event) => setPaymentMethod(event.target.value)} value={paymentMethod}>
              <option>Cash</option>
              <option>QRIS</option>
              <option>Transfer</option>
            </select>

            <label className="field-label" htmlFor="paid">
              Uang Dibayar
            </label>
            <input className="field-input" id="paid" min="0" onChange={(event) => setPaid(event.target.value)} type="number" value={paid} />

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100">
              <p className="text-xs font-medium uppercase">Kembalian</p>
              <p className="text-2xl font-bold">{currency(change)}</p>
            </div>

            <button className="primary-button w-full gap-2 disabled:cursor-not-allowed disabled:bg-slate-300" disabled={cart.length === 0 || numericPaid < subtotal} onClick={checkout} type="button">
              <Printer size={18} />
              Cetak Struk
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
