# PRD — Aplikasi Web Sistem Kasir (POS)

## 1. Overview

### Nama Produk
**SmartPOS Web**

### Deskripsi Singkat
Aplikasi web sistem kasir (Point of Sale / POS) untuk membantu toko melakukan transaksi penjualan, memantau stok barang, mencetak struk, dan melihat laporan penjualan secara real-time.

Target utama aplikasi ini adalah:
- Toko kelontong
- Minimarket kecil
- UMKM
- Toko fashion
- Warung modern
- Toko elektronik kecil

---

# 2. Problem Statement

Banyak toko masih menggunakan:
- pencatatan manual,
- kalkulator,
- nota tulis tangan,
- dan pengecekan stok secara manual.

Masalah yang sering terjadi:
- Salah hitung total belanja
- Sulit mengetahui stok habis
- Laporan penjualan tidak rapi
- Kehilangan data transaksi
- Proses kasir lambat

Aplikasi ini dibuat untuk:
- mempercepat transaksi,
- mempermudah pengecekan stok,
- dan membuat laporan penjualan otomatis.

---

# 3. Goal Produk

## Tujuan Utama
Membantu pemilik toko menjalankan sistem kasir modern berbasis web dengan lebih cepat, mudah, dan rapi.

## Success Metrics
- Transaksi selesai < 1 menit
- Pengurangan kesalahan hitung manual
- Pemilik toko dapat melihat laporan harian otomatis
- Stok barang dapat dipantau real-time

---

# 4. Target User

## Primary User
### Pemilik Toko
Kebutuhan:
- melihat laporan,
- memantau stok,
- mengetahui keuntungan.

## Secondary User
### Kasir
Kebutuhan:
- proses transaksi cepat,
- hitung kembalian otomatis,
- cetak struk.

---

# 5. User Story

## Pemilik Toko
- Sebagai pemilik toko, saya ingin melihat stok barang agar tahu barang yang hampir habis.
- Sebagai pemilik toko, saya ingin melihat laporan penjualan harian agar mudah mengecek pemasukan.
- Sebagai pemilik toko, saya ingin data tersimpan otomatis agar tidak hilang.

## Kasir
- Sebagai kasir, saya ingin mencari barang dengan cepat agar transaksi lebih cepat.
- Sebagai kasir, saya ingin sistem menghitung total dan kembalian otomatis agar tidak salah hitung.
- Sebagai kasir, saya ingin mencetak struk agar pembeli mendapatkan bukti transaksi.

---

# 6. Fitur Utama

## 6.1 Login System
### Deskripsi
User login menggunakan email dan password.

### Role
- Admin
- Kasir

### Acceptance Criteria
- User dapat login
- User dapat logout
- Session tersimpan aman

---

## 6.2 Dashboard
### Deskripsi
Menampilkan ringkasan:
- total penjualan hari ini,
- jumlah transaksi,
- stok menipis,
- produk terlaris.

### Acceptance Criteria
- Data tampil real-time
- Grafik penjualan tampil dengan benar

---

## 6.3 Manajemen Produk
### Fitur
- Tambah barang
- Edit barang
- Hapus barang
- Upload gambar produk
- Kategori produk
- Barcode

### Data Produk
- Nama barang
- Harga
- Stok
- SKU
- Barcode
- Kategori

### Acceptance Criteria
- Produk dapat CRUD
- Stok otomatis berkurang saat transaksi

---

## 6.4 Sistem Kasir
### Fitur
- Cari produk
- Scan barcode
- Tambah ke keranjang
- Hitung total otomatis
- Hitung kembalian otomatis
- Pilih metode pembayaran

### Metode Pembayaran
- Cash
- QRIS
- Transfer

### Acceptance Criteria
- Total transaksi akurat
- Kembalian otomatis muncul
- Transaksi tersimpan ke database

---

## 6.5 Cetak Struk
### Isi Struk
- Nama toko
- Daftar barang
- Total
- Pembayaran
- Kembalian
- Tanggal transaksi

### Acceptance Criteria
- Struk dapat diprint
- Struk dapat download PDF

---

## 6.6 Manajemen Stok
### Fitur
- Update stok
- Notifikasi stok habis
- Riwayat stok masuk/keluar

### Acceptance Criteria
- Sistem memberi peringatan stok menipis
- Riwayat stok tercatat

---

## 6.7 Laporan Penjualan
### Jenis Laporan
- Harian
- Mingguan
- Bulanan

### Isi Laporan
- Total transaksi
- Total pendapatan
- Produk terlaris
- Metode pembayaran

### Acceptance Criteria
- Laporan dapat diexport Excel/PDF
- Data sesuai transaksi

---

# 7. Flow Aplikasi

## Flow Kasir
1. Login
2. Cari barang / scan barcode
3. Tambahkan ke keranjang
4. Input pembayaran
5. Sistem hitung kembalian
6. Cetak struk
7. Selesai

---

# 8. Non Functional Requirements

## Performance
- Loading < 3 detik
- Support minimal 100 transaksi/hari

## Security
- Password di-hash
- Session authentication
- Role permission

## Compatibility
- Responsive desktop & mobile
- Support Chrome & Edge

---

# 9. Tech Stack Recommendation

## Frontend
- React.js / Vite
- Tailwind CSS

## Backend
- Node.js + Express

## Database
- MySQL / PostgreSQL

## Authentication
- JWT Auth

---

# 10. Deployment & Hosting

## Tahap Awal (Gratis / Development)

### Frontend Hosting
- GitHub Pages

### Source Code Repository
- GitHub

### Backend Hosting (Opsional)
- Render
- Railway

### Database Gratis
- Supabase
- PlanetScale

---

# 11. Arsitektur Awal yang Disarankan

## Versi Pertama (Simple)
Frontend only:
- React / Vite
- Data dummy / localStorage
- Hosting GitHub Pages

Cocok untuk:
- Prototype
- Skripsi
- Demo aplikasi
- Testing UI

---

# 12. Upgrade Tahap Berikutnya

Jika aplikasi mulai berkembang:
- Tambahkan backend Express.js
- Gunakan database online
- Deploy fullstack
- Tambahkan authentication database
- Tambahkan realtime stock

---

# 13. Struktur Repository

```bash
smartpos-web/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   └── utils/
│
├── package.json
├── README.md
└── vite.config.js
```

---

# 14. MVP Scope

## Fitur MVP
- Login
- Dashboard
- CRUD Produk
- Sistem Kasir
- Hitung kembalian otomatis
- Cetak struk
- Laporan harian
- Notifikasi stok habis

---

# 15. Future Features

- Multi cabang
- Integrasi printer thermal
- Integrasi WhatsApp
- AI prediksi stok
- Scan barcode via kamera
- PWA offline mode
- Membership pelanggan
- Diskon & voucher

---

# 16. UI/UX Notes

## Style
- Modern
- Simple
- Dark/light mode
- Fokus ke transaksi cepat

## Warna
- Primary: Biru
- Success: Hijau
- Danger: Merah

---

# 17. Kesimpulan

Aplikasi web sistem kasir ini dirancang untuk membantu toko melakukan transaksi lebih cepat, memantau stok secara real-time, dan menghasilkan laporan penjualan otomatis secara rapi dan modern.
