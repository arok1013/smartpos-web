import { Edit, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import Table from '../components/Table.jsx';
import { createProductId, currency } from '../services/api.js';

const emptyForm = {
  name: '',
  category: '',
  sku: '',
  barcode: '',
  price: '',
  stock: '',
  image: '',
};

export default function Products({ products, setProducts }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const keyword = query.toLowerCase();
    return products.filter((product) => [product.name, product.category, product.sku, product.barcode].some((value) => value.toLowerCase().includes(keyword)));
  }, [products, query]);

  const submit = (event) => {
    event.preventDefault();
    const product = {
      ...form,
      id: editingId ?? createProductId(),
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || 'https://images.unsplash.com/photo-1601599963565-b7ba29c8e095?auto=format&fit=crop&w=400&q=80',
    };
    setProducts(editingId ? products.map((item) => (item.id === editingId ? product : item)) : [product, ...products]);
    setForm(emptyForm);
    setEditingId(null);
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({ ...product, price: String(product.price), stock: String(product.stock) });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Manajemen Produk</h1>
        <p className="page-subtitle">Tambah, edit, hapus, dan pantau stok produk toko.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" onSubmit={submit}>
          <h2 className="section-title mb-4">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h2>
          {[
            ['name', 'Nama Barang'],
            ['category', 'Kategori'],
            ['sku', 'SKU'],
            ['barcode', 'Barcode'],
            ['price', 'Harga'],
            ['stock', 'Stok'],
            ['image', 'URL Gambar'],
          ].map(([key, label]) => (
            <div className="mb-3" key={key}>
              <label className="field-label" htmlFor={key}>
                {label}
              </label>
              <input
                className="field-input"
                id={key}
                min={key === 'price' || key === 'stock' ? '0' : undefined}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                required={key !== 'image'}
                type={key === 'price' || key === 'stock' ? 'number' : 'text'}
                value={form[key]}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button className="primary-button flex-1 gap-2" type="submit">
              <Plus size={18} />
              Simpan
            </button>
            {editingId && (
              <button
                className="secondary-button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                type="button"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          <input className="field-input" onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk, kategori, SKU, atau barcode" type="search" value={query} />
          <Table
            columns={[
              {
                key: 'name',
                label: 'Produk',
                render: (product) => (
                  <div className="flex items-center gap-3">
                    <img alt={product.name} className="h-10 w-10 rounded-lg object-cover" src={product.image} />
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.barcode}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'category', label: 'Kategori' },
              { key: 'price', label: 'Harga', render: (product) => currency(product.price) },
              { key: 'stock', label: 'Stok' },
              { key: 'sku', label: 'SKU' },
              {
                key: 'action',
                label: 'Aksi',
                render: (product) => (
                  <div className="flex gap-2">
                    <button className="icon-button" onClick={() => editProduct(product)} title="Edit produk" type="button">
                      <Edit size={16} />
                    </button>
                    <button className="icon-button text-red-600 dark:text-red-400" onClick={() => deleteProduct(product.id)} title="Hapus produk" type="button">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredProducts}
          />
        </div>
      </section>
    </div>
  );
}
