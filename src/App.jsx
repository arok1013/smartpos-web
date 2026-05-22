import { useEffect, useMemo, useState } from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/Login.jsx';
import { routes } from './routes/index.jsx';
import {
  getCurrentUser,
  getProducts,
  getTransactions,
  login,
  logout,
  registerAccount,
  saveProducts,
  saveTransaction,
} from './services/api.js';

export default function App() {
  const [user, setUser] = useState(getCurrentUser);
  const [activePage, setActivePage] = useState('dashboard');
  const [products, setProducts] = useState(getProducts);
  const [transactions, setTransactions] = useState(getTransactions);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('smartpos_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('smartpos_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const appState = useMemo(
    () => ({
      products,
      transactions,
      setProducts: (nextProducts) => {
        setProducts(nextProducts);
        saveProducts(nextProducts);
      },
      addTransaction: (transaction) => {
        const nextProducts = products.map((product) => {
          const sold = transaction.items.find((item) => item.id === product.id);
          return sold ? { ...product, stock: Math.max(product.stock - sold.qty, 0) } : product;
        });
        const nextTransactions = saveTransaction(transaction);
        saveProducts(nextProducts);
        setProducts(nextProducts);
        setTransactions(nextTransactions);
      },
    }),
    [products, transactions],
  );

  if (!user) {
    return <Login onLogin={(credentials) => setUser(login(credentials))} onRegister={registerAccount} />;
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
      <Page {...appState} />
    </MainLayout>
  );
}
