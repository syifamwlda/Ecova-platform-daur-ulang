# 🌿 ECOVA Backend API (Laravel 10)

Layanan RESTful API untuk platform **ECOVA (Eco Value & Recycling)** dibangun dengan **Laravel 10** dan **Laravel Sanctum**.

---

## 🚀 Panduan Setup Backend

### 1. Prasyarat
- PHP >= 8.1
- Composer
- Ekstensi PHP yang dibutuhkan: `pdo`, `pdo_mysql` (atau `pdo_sqlite`), `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`.

### 2. Instalasi Dependensi
```bash
composer install
```

### 3. Konfigurasi Environment
Salin file konfigurasi:
```bash
cp .env.example .env
# Windows CMD: copy .env.example .env
```

Generate application key:
```bash
php artisan key:generate
```

Sesuaikan koneksi database di file `.env`:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecova_db
DB_USERNAME=root
DB_PASSWORD=
```
*(Atau gunakan `DB_CONNECTION=sqlite` dan buat file `database/database.sqlite`)*

### 4. Migrasi & Seeding Data Awal
Jalankan migrasi tabel beserta seeder akun demo dan data statistik:
```bash
php artisan migrate --seed
```

> **Akun Demo Bawaan:**
> - Email: `demo@ecoruk.id`
> - Password: `password123`

### 5. Jalankan Local Server
```bash
php artisan serve
```
Server API akan aktif di `http://localhost:8000/api`.

---

## 📡 Daftar Endpoint API

### 1. Autentikasi (`/api`)
- `POST /api/register` – Registrasi user baru
- `POST /api/login` – Login & mendapatkan Bearer Token
- `POST /api/logout` – Logout & revoke token (Sanctum)

### 2. Dashboard (`/api/dashboard`)
- `GET /api/dashboard` – Agregasi statistik dampak lingkungan, histori sampah, dan target bulanan (Sanctum)

### 3. Manajemen Sampah / Pertukaran (`/api/wastes`)
- `POST /api/wastes/scan` – Input / scan sampah baru (Sanctum)
- `GET /api/wastes/current` – Ambil daftar sampah pending/verified milik user (Sanctum)
- `POST /api/wastes/exchange` – Tukar sampah aktif menjadi saldo (Sanctum)
- `GET /api/wastes/history` – Riwayat seluruh sampah user (Sanctum)

### 4. Marketplace & Produk (`/api/products`)
- `GET /api/products` – Daftar produk daur ulang (Mendukung filter category, search, pagination)
- `GET /api/products/{id}` – Detail produk berdasarkan ID

### 5. Pesanan / Checkout (`/api/orders`)
- `POST /api/orders` – Membuat pesanan produk daur ulang + opsi donasi pohon (Sanctum)

### 6. Pembayaran / Penarikan Saldo (`/api/payments`)
- `POST /api/payments` – Pengajuan penarikan saldo reward (DANA, Transfer Bank, dll.) (Sanctum)
- `GET /api/payments` – Riwayat transaksi penarikan saldo (Sanctum)
