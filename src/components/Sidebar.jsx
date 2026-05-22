import { Store } from 'lucide-react';
import { STORE_NAME } from '../services/store.js';

export default function Sidebar({ activePage, mobileOpen, onNavigate, routes }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-white">
          <Store size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">{STORE_NAME}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sembako mart</p>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {routes.map((route) => {
          const Icon = route.icon;
          const active = activePage === route.id;
          return (
            <button
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                active
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
              key={route.id}
              onClick={() => onNavigate(route.id)}
              type="button"
            >
              <Icon size={19} />
              {route.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
