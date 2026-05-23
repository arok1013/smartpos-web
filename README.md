# Griya Sembako Mart

Aplikasi web kasir berbasis React, Vite, dan Tailwind CSS untuk demo POS UMKM.

## Fitur

- Login role admin/kasir
- Dashboard ringkasan penjualan
- Halaman kasir dengan keranjang, total, pembayaran, kembalian, dan cetak struk
- Manajemen produk dengan CRUD berbasis localStorage
- Laporan penjualan harian, mingguan, bulanan
- Dark mode dan layout responsive

## Menjalankan Project

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:5173`.

## Akun Demo

- Email: `admin@smartpos.test`
- Password: `password`

## Backend API

Backend tersedia di folder `server` menggunakan Node.js, Express, MySQL, dan JWT.

### Setup Database

1. Buat database dan tabel:

```bash
mysql -u root -p < server/database/schema.sql
```

2. Isi data awal:

```bash
mysql -u root -p < server/database/seed.sql
```

### Jalankan API

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

API berjalan di `http://localhost:5000`.

### Sambungkan Frontend ke API

Buat file `.env` di root project:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Lalu jalankan frontend:

```bash
npm run dev
```

Jika `VITE_API_BASE_URL` belum diset, frontend otomatis memakai mode demo `localStorage`.

Endpoint utama:

- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products`
- `POST /api/users`
- `POST /api/transactions`
- `GET /api/reports/sales`

Header untuk endpoint yang butuh login:

```text
Authorization: Bearer <token>
```
