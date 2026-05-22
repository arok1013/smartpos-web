import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function MainLayout({ activePage, children, darkMode, onLogout, onNavigate, onToggleTheme, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {mobileOpen && <button aria-label="Tutup menu" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} type="button" />}
      <div className="flex min-h-screen">
        <Sidebar activePage={activePage} mobileOpen={mobileOpen} onNavigate={navigate} />
        <div className="min-w-0 flex-1">
          <Navbar
            darkMode={darkMode}
            onLogout={onLogout}
            onToggleMenu={() => setMobileOpen(true)}
            onToggleTheme={onToggleTheme}
            user={user}
          />
          <main className="mx-auto w-full max-w-7xl p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
