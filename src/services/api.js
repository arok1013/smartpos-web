const PRODUCTS_KEY = 'smartpos_products';
const TRANSACTIONS_KEY = 'smartpos_transactions';
const USER_KEY = 'smartpos_user';
const ACCOUNTS_KEY = 'smartpos_accounts';
const TOKEN_KEY = 'smartpos_token';
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const API_BASE_URL = RAW_API_BASE_URL ? (RAW_API_BASE_URL.endsWith('/api') ? RAW_API_BASE_URL : `${RAW_API_BASE_URL}/api`) : '';

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

const initialAccounts = [
  {
    id: 'USR-ADMIN',
    name: 'Admin Toko',
    email: 'admin@smartpos.test',
    password: 'password',
    role: 'Admin',
  },
  {
    id: 'USR-KASIR',
    name: 'Kasir Toko',
    email: 'kasir@smartpos.test',
    password: 'password',
    role: 'Kasir',
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

  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Gagal mengambil data dari server.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function isApiEnabled() {
  return Boolean(API_BASE_URL);
}

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
  };
}

function normalizeTransaction(transaction) {
  return {
    ...transaction,
    date: transaction.date || transaction.created_at || new Date().toISOString(),
    paymentMethod: transaction.paymentMethod || transaction.payment_method,
    change: Number(transaction.change ?? transaction.change_amount ?? 0),
    paid: Number(transaction.paid ?? 0),
    total: Number(transaction.total ?? 0),
    items: transaction.items ?? [],
  };
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

export async function fetchProducts() {
  if (!isApiEnabled()) {
    return getProducts();
  }

  const products = await fetchApi('/products');
  return products.map(normalizeProduct);
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export async function saveProduct(product) {
  if (!isApiEnabled()) {
    const nextProduct = {
      ...product,
      id: product.id || createProductId(),
    };
    const products = getProducts();
    const exists = products.some((item) => item.id === nextProduct.id);
    const nextProducts = exists ? products.map((item) => (item.id === nextProduct.id ? nextProduct : item)) : [nextProduct, ...products];
    saveProducts(nextProducts);
    return normalizeProduct(nextProduct);
  }

  const payload = {
    name: product.name,
    category: product.category,
    sku: product.sku,
    barcode: product.barcode,
    price: Number(product.price),
    stock: Number(product.stock),
    image: product.image,
  };

  const saved = product.id
    ? await fetchApi(`/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload) })
    : await fetchApi('/products', { method: 'POST', body: JSON.stringify(payload) });
  return normalizeProduct(saved);
}

export async function removeProduct(id) {
  if (!isApiEnabled()) {
    saveProducts(getProducts().filter((product) => product.id !== id));
    return;
  }

  await fetchApi(`/products/${id}`, { method: 'DELETE' });
}

export function getTransactions() {
  const transactions = readStorage(TRANSACTIONS_KEY, null);
  if (transactions) return transactions;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
  return initialTransactions;
}

export async function fetchTransactions() {
  if (!isApiEnabled()) {
    return getTransactions();
  }

  const transactions = await fetchApi('/transactions');
  return transactions.map(normalizeTransaction);
}

export function saveTransaction(transaction) {
  const nextTransactions = [transaction, ...getTransactions()];
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(nextTransactions));
  return nextTransactions;
}

export async function createTransaction(transaction) {
  if (!isApiEnabled()) {
    return saveTransaction(transaction);
  }

  await fetchApi('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
  return fetchTransactions();
}

export function getCurrentUser() {
  return readStorage(USER_KEY, null);
}

export function getAccounts() {
  const accounts = readStorage(ACCOUNTS_KEY, null);
  if (accounts) return accounts;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialAccounts));
  return initialAccounts;
}

export async function registerAccount(account) {
  if (isApiEnabled()) {
    return fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  const accounts = getAccounts();
  const emailExists = accounts.some((item) => item.email.toLowerCase() === account.email.toLowerCase());
  if (emailExists) {
    throw new Error('Email sudah terdaftar.');
  }

  const newAccount = {
    id: `USR-${Date.now().toString().slice(-6)}`,
    name: account.name,
    email: account.email,
    password: account.password,
    role: account.role,
  };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([newAccount, ...accounts]));
  return newAccount;
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.');
  }

  if (isApiEnabled()) {
    const result = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {},
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result.user;
  }

  const account = getAccounts().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!account) {
    throw new Error('Email atau password salah.');
  }

  const user = {
    name: account.name,
    email: account.email,
    role: account.role,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function createProductId() {
  return `PRD-${Date.now().toString().slice(-6)}`;
}

export function createTransactionId() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll('-', '');
  return `TRX-${stamp}-${date.getTime().toString().slice(-4)}`;
}
