import { LockKeyhole, Store } from 'lucide-react';
import { useState } from 'react';
import { STORE_NAME } from '../services/store.js';

export default function Login({ onLogin, onRegister }) {
  const [form, setForm] = useState({ email: 'admin@smartpos.test', password: 'password' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'Kasir' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState('login');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    try {
      onLogin(form);
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  const submitRegister = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      onRegister(registerForm);
      setSuccess('Akun berhasil dibuat. Silakan login.');
      setForm({ email: registerForm.email, password: registerForm.password });
      setRegisterForm({ name: '', email: '', password: '', role: 'Kasir' });
      setMode('login');
    } catch (registerError) {
      setError(registerError.message);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <img
          alt="Toko modern"
          className="h-full w-full object-cover opacity-55"
          src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-600">
            <Store size={30} />
          </div>
          <h1 className="max-w-xl text-5xl font-bold leading-tight">{STORE_NAME}</h1>
          <p className="mt-4 max-w-lg text-lg text-slate-200">
            Sistem kasir untuk transaksi, stok, dan laporan toko sembako.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-soft">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Login</h2>
              <p className="text-sm text-slate-400">Masuk ke dashboard kasir</p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-950 p-1">
            <button
              className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-brand-600 text-white' : 'text-slate-300'}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Masuk
            </button>
            <button
              className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-brand-600 text-white' : 'text-slate-300'}`}
              onClick={() => setMode('register')}
              type="button"
            >
              Tambah Akun
            </button>
          </div>

          {error && <div className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
          {success && <div className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{success}</div>}

          {mode === 'login' ? (
            <form onSubmit={submit}>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                className="field-input mb-4 bg-slate-950 text-white"
                id="email"
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                type="email"
                value={form.email}
              />

              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                className="field-input mb-6 bg-slate-950 text-white"
                id="password"
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                type="password"
                value={form.password}
              />

              <button className="primary-button w-full" type="submit">
                Masuk
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegister}>
              <label className="field-label" htmlFor="registerName">
                Nama
              </label>
              <input
                className="field-input mb-4 bg-slate-950 text-white"
                id="registerName"
                onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                required
                type="text"
                value={registerForm.name}
              />

              <label className="field-label" htmlFor="registerEmail">
                Email
              </label>
              <input
                className="field-input mb-4 bg-slate-950 text-white"
                id="registerEmail"
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                required
                type="email"
                value={registerForm.email}
              />

              <label className="field-label" htmlFor="registerPassword">
                Password
              </label>
              <input
                className="field-input mb-4 bg-slate-950 text-white"
                id="registerPassword"
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                required
                type="password"
                value={registerForm.password}
              />

              <label className="field-label" htmlFor="registerRole">
                Role
              </label>
              <select
                className="field-input mb-6 bg-slate-950 text-white"
                id="registerRole"
                onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
                value={registerForm.role}
              >
                <option>Kasir</option>
                <option>Admin</option>
              </select>

              <button className="primary-button w-full" type="submit">
                Buat Akun
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
