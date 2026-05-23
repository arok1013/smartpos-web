import { Minus, Plus, Printer, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { createTransactionId, currency } from '../services/api.js';
import { STORE_ADDRESS, STORE_NAME } from '../services/store.js';

export default function Cashier({ addTransaction, products }) {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paid, setPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [error, setError] = useState('');

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

  const printReceipt = (transaction) => {
    const receiptWindow = window.open('', 'smartpos-receipt', 'width=380,height=640');
    if (!receiptWindow) return;

    const rows = transaction.items
      .map(
        (item) => `
          <tr>
            <td>
              <strong>${item.name}</strong>
              <span>${item.qty} x ${currency(item.price)}</span>
            </td>
            <td>${currency(item.qty * item.price)}</td>
          </tr>
        `,
      )
      .join('');

    receiptWindow.document.write(`
      <!doctype html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Struk ${transaction.id}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #f8fafc;
              color: #111827;
              font-family: "Courier New", monospace;
              font-size: 12px;
            }
            .receipt {
              width: 80mm;
              margin: 0 auto;
              background: #fff;
              padding: 14px;
            }
            h1 {
              margin: 0;
              text-align: center;
              font-size: 18px;
              letter-spacing: 0;
            }
            .center {
              text-align: center;
            }
            .muted {
              color: #4b5563;
              font-size: 11px;
            }
            .divider {
              border-top: 1px dashed #111827;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 4px 0;
              vertical-align: top;
            }
            td:last-child {
              text-align: right;
              white-space: nowrap;
            }
            td span {
              display: block;
              margin-top: 2px;
              color: #4b5563;
              font-size: 11px;
            }
            .summary {
              display: grid;
              gap: 4px;
            }
            .summary div {
              display: flex;
              justify-content: space-between;
              gap: 12px;
            }
            .total {
              font-size: 14px;
              font-weight: 700;
            }
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                background: #fff;
              }
              .receipt {
                width: 80mm;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <main class="receipt">
            <h1>${STORE_NAME}</h1>
            <p class="center muted">${STORE_ADDRESS}</p>
            <div class="divider"></div>
            <p>
              No: ${transaction.id}<br />
              Tanggal: ${new Date(transaction.date).toLocaleString('id-ID')}<br />
              Bayar: ${transaction.paymentMethod}
            </p>
            <div class="divider"></div>
            <table>
              <tbody>${rows}</tbody>
            </table>
            <div class="divider"></div>
            <section class="summary">
              <div class="total"><span>Total</span><span>${currency(transaction.total)}</span></div>
              <div><span>Dibayar</span><span>${currency(transaction.paid)}</span></div>
              <div><span>Kembalian</span><span>${currency(transaction.change)}</span></div>
            </section>
            <div class="divider"></div>
            <p class="center">Terima kasih</p>
          </main>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  const checkout = async () => {
    if (cart.length === 0 || numericPaid < subtotal) return;
    setError('');
    const transaction = {
      id: createTransactionId(),
      date: new Date().toISOString(),
      paymentMethod,
      paid: numericPaid,
      total: subtotal,
      change,
      items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
    };
    try {
      await addTransaction(transaction);
      setCart([]);
      setPaid('');
      printReceipt(transaction);
    } catch (checkoutError) {
      setError(checkoutError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Halaman Kasir</h1>
        <p className="page-subtitle">Cari produk, tambah ke keranjang, dan hitung kembalian otomatis.</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</div>}

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
