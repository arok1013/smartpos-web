import { LogOut, Menu, Moon, Search, Sun } from 'lucide-react';

export default function Navbar({ darkMode, onLogout, onToggleMenu, onToggleTheme, user }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button className="icon-button lg:hidden" onClick={onToggleMenu} title="Buka menu" type="button">
          <Menu size={20} />
        </button>

        <div className="hidden min-w-0 flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <Search className="text-slate-400" size={18} />
          <input
            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Cari transaksi, produk, atau SKU"
            type="search"
          />
        </div>

        <button className="icon-button ml-auto" onClick={onToggleTheme} title="Ganti tema" type="button">
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
        </div>

        <button className="icon-button text-red-600 dark:text-red-400" onClick={onLogout} title="Logout" type="button">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
