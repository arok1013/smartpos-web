import { UserPlus } from 'lucide-react';
import { useState } from 'react';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'Kasir',
};

export default function Accounts({ onRegister }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await onRegister(form);
      setSuccess(`Akun ${form.name} berhasil dibuat.`);
      setForm(emptyForm);
    } catch (registerError) {
      setError(registerError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Tambah Akun</h1>
        <p className="page-subtitle">Buat akun admin atau kasir baru untuk toko.</p>
      </div>

      <form className="max-w-xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" onSubmit={submit}>
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600 text-white">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="section-title">Data Akun</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Role kasir hanya bisa membuka Dashboard dan Kasir.</p>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{success}</div>}

        <label className="field-label" htmlFor="accountName">
          Nama
        </label>
        <input className="field-input mb-4" id="accountName" onChange={(event) => setForm({ ...form, name: event.target.value })} required type="text" value={form.name} />

        <label className="field-label" htmlFor="accountEmail">
          Email
        </label>
        <input className="field-input mb-4" id="accountEmail" onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} />

        <label className="field-label" htmlFor="accountPassword">
          Password
        </label>
        <input className="field-input mb-4" id="accountPassword" onChange={(event) => setForm({ ...form, password: event.target.value })} required type="password" value={form.password} />

        <label className="field-label" htmlFor="accountRole">
          Role
        </label>
        <select className="field-input mb-6" id="accountRole" onChange={(event) => setForm({ ...form, role: event.target.value })} value={form.role}>
          <option>Kasir</option>
          <option>Admin</option>
        </select>

        <button className="primary-button gap-2" type="submit">
          <UserPlus size={18} />
          Buat Akun
        </button>
      </form>
    </div>
  );
}
