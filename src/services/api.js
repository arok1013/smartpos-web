const PRODUCTS_KEY = 'smartpos_products';
const TRANSACTIONS_KEY = 'smartpos_transactions';
const USER_KEY = 'smartpos_user';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialProducts = [
  {
    id: 'PRD-001',
    name: 'Beras Premium 5kg',
    category: 'Sembako',
    sku: 'SMB-BRS-5KG',
    barcode: '899100000001',
    price: 72000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'PRD-002',
    name: 'Minyak Goreng 2L',
    category: 'Sembako',
    sku: 'SMB-MNY-2L',
    barcode: '899100000002',
    price: 38500,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'PRD-003',
    name: 'Kopi Susu Botol',
    category: 'Minuman',
    sku: 'MNM-KOP-BTL',
    barcode: '899100000003',
    price: 12000,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'PRD-004',
    name: 'Sabun Mandi',
    category: 'Perawatan',
    sku: 'PRW-SBN-001',
    barcode: '899100000004',
    price: 6500,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'PRD-005',
    name: 'Mi Instan Goreng',
    category: 'Makanan',
    sku: 'MKN-MIG-001',
    barcode: '899100000005',
    price: 3500,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
  },
];

const initialTransactions = [
  {
    id: 'TRX-20260522-001',
    date: new Date().toISOString(),
    paymentMethod: 'Cash',
    paid: 150000,
    total: 123500,
    change: 26500,
    items: [
      { id: 'PRD-001', name: 'Beras Premium 5kg', qty: 1, price: 72000 },
      { id: 'PRD-002', name: 'Minyak Goreng 2L', qty: 1, price: 38500 },
      { id: 'PRD-003', name: 'Kopi Susu Botol', qty: 1, price: 12000 },
      { id: 'PRD-005', name: 'Mi Instan Goreng', qty: 1, price: 3500 },
    ],
  },
];

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchApi(path, options = {}) {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data dari server.');
  }

  return response.json();
}

export function currency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProducts() {
  const products = readStorage(PRODUCTS_KEY, null);
  if (products) return products;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getTransactions() {
  const transactions = readStorage(TRANSACTIONS_KEY, null);
  if (transactions) return transactions;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
  return initialTransactions;
}

export function saveTransaction(transaction) {
  const nextTransactions = [transaction, ...getTransactions()];
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(nextTransactions));
  return nextTransactions;
}

export function getCurrentUser() {
  return readStorage(USER_KEY, null);
}

export function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.');
  }

  const user = {
    name: email.includes('kasir') ? 'Kasir Toko' : 'Admin Toko',
    email,
    role: email.includes('kasir') ? 'Kasir' : 'Admin',
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function createProductId() {
  return `PRD-${Date.now().toString().slice(-6)}`;
}

export function createTransactionId() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll('-', '');
  return `TRX-${stamp}-${date.getTime().toString().slice(-4)}`;
}
