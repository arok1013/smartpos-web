import { Plus } from 'lucide-react';
import { currency } from '../services/api.js';

export default function ProductCard({ onAdd, product }) {
  const lowStock = product.stock <= 10;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <img alt={product.name} className="h-28 w-full object-cover" src={product.image} />
      <div className="space-y-3 p-3">
        <div>
          <p className="line-clamp-1 text-sm font-semibold text-slate-950 dark:text-white">{product.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-brand-700 dark:text-brand-100">{currency(product.price)}</p>
            <p className={`text-xs ${lowStock ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
              Stok {product.stock}
            </p>
          </div>
          <button
            className="icon-button bg-brand-600 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={product.stock <= 0}
            onClick={() => onAdd(product)}
            title="Tambah ke keranjang"
            type="button"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
