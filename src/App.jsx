import { useEffect, useMemo, useState } from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/Login.jsx';
import { routes } from './routes/index.jsx';
import {
  getCurrentUser,
  fetchProducts,
  fetchTransactions,
  getProducts,
  getTransactions,
  isApiEnabled,
  login,
  logout,
  createTransaction,
  registerAccount,
  removeProduct,
  saveProduct,
  saveProducts,
} from './services/api.js';

export default function App() {
  const [user, setUser] = useState(getCurrentUser);
  const [activePage, setActivePage] = useState('dashboard');
  const [products, setProducts] = useState(getProducts);
  const [transactions, setTransactions] = useState(getTransactions);
  const [loading, setLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('smartpos_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('smartpos_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const loadRemoteData = async () => {
    if (!isApiEnabled() || !user) return;
    setLoading(true);
    setAppError('');
    try {
      const [nextProducts, nextTransactions] = await Promise.all([fetchProducts(), fetchTransactions()]);
      setProducts(nextProducts);
      setTransactions(nextTransactions);
    } catch (error) {
      setAppError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemoteData();
  }, [user]);

  const appState = useMemo(
    () => ({
      products,
      transactions,
      loading,
      appError,
      saveProduct: async (product) => {
        const saved = await saveProduct(product);
        if (isApiEnabled()) {
          setProducts(await fetchProducts());
        } else {
          const exists = products.some((item) => item.id === saved.id);
          const nextProducts = exists ? products.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...products];
          setProducts(nextProducts);
          saveProducts(nextProducts);
        }
        return saved;
      },
      deleteProduct: async (id) => {
        await removeProduct(id);
        const nextProducts = products.filter((product) => product.id !== id);
        setProducts(isApiEnabled() ? await fetchProducts() : nextProducts);
        if (!isApiEnabled()) {
          saveProducts(nextProducts);
        }
      },
      onRegister: registerAccount,
      addTransaction: async (transaction) => {
        if (isApiEnabled()) {
          const nextTransactions = await createTransaction(transaction);
          const nextProducts = await fetchProducts();
          setTransactions(nextTransactions);
          setProducts(nextProducts);
          return;
        }

        const nextProducts = products.map((product) => {
          const sold = transaction.items.find((item) => item.id === product.id);
          return sold ? { ...product, stock: Math.max(product.stock - sold.qty, 0) } : product;
        });
        const nextTransactions = await createTransaction(transaction);
        saveProducts(nextProducts);
        setProducts(nextProducts);
        setTransactions(nextTransactions);
      },
    }),
    [appError, loading, products, transactions],
  );

  if (!user) {
    return <Login onLogin={async (credentials) => setUser(await login(credentials))} />;
  }

  const availableRoutes = routes.filter((route) => route.roles.includes(user.role));
  const currentRoute = availableRoutes.find((route) => route.id === activePage) ?? availableRoutes[0];
  const Page = currentRoute.component;

  return (
    <MainLayout
      activePage={activePage}
      darkMode={darkMode}
      onNavigate={setActivePage}
      routes={availableRoutes}
      onToggleTheme={() => setDarkMode((value) => !value)}
      onLogout={() => {
        logout();
        setUser(null);
      }}
      user={user}
    >
      {appError && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{appError}</div>}
      <Page {...appState} />
    </MainLayout>
  );
}
