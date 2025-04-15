# 📡 Sistem Absensi RFID — Kolaborasi RPL x EI

Sistem Absensi Berbasis RFID ini merupakan proyek kolaborasi antara **mahasiswa AM UM 2025** dan **SMK Negeri 1 Jenangan Ponorogo**. Tujuan dari proyek ini adalah menciptakan sistem absensi otomatis yang efisien menggunakan teknologi RFID.

- 🔧 Jurusan **EI (Elektronika Industri)**: Bertanggung jawab merancang dan merakit alat RFID.
- 💻 Jurusan **RPL (Rekayasa Perangkat Lunak)**: Bertanggung jawab mengembangkan backend (Express.js), frontend (Next.js), dan database (PostgreSQL).

---

## 🧠 Fitur Utama

- 🚀 Deteksi kehadiran siswa melalui kartu RFID
- 💾 Penyimpanan otomatis data absensi ke database
- 📊 Dashboard rekapitulasi kehadiran siswa
- 📅 Riwayat absensi berdasarkan tanggal

---

## ⚙️ Teknologi yang Digunakan

- **Backend**: Node.js + Express.js
- **Frontend**: React + Next.js + Tailwind CSS
- **Database**: PostgreSQL
- **Hardware**: RFID Reader + Kartu RFID

---

## Prasyarat

Sebelum menginstal dan menjalankan proyek ini, pastikan Anda telah menginstal:

- Node.js (versi 16.x atau lebih tinggi)
- npm atau yarn
- MySQL (untuk database)
- Perangkat pembaca RFID yang kompatibel

## Instalasi

### 1. Kloning Repositori

```bash
git clone https://github.com/username/sistem-absensi-rfid.git
cd sistem-absensi-rfid
```

### 2. Instalasi Backend

```bash
cd backend

# Menginstal dependensi
npm install

# Menyiapkan database
# Buat database di MySQL terlebih dahulu
# Sesuaikan konfigurasi database di file .env

# Contoh file .env:
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=password
# DB_NAME=absensi_rfid
# PORT=5000

# Mengisi database dengan data awal
npm run seed

# Menjalankan server backend
npm run dev
```

Server backend akan berjalan pada `http://localhost:5000`

### 3. Instalasi Frontend

```bash
cd frontend

# Menginstal dependensi
npm install

# Sesuaikan konfigurasi di file .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Menjalankan server frontend
npm run dev
```

Frontend akan berjalan pada `http://localhost:3000`

## Cara Penggunaan

### 1. Login Admin

- Buka aplikasi frontend di browser (`http://localhost:3000`)
- Login dengan kredensial admin default:
  - Username: admin
  - Password: admin123

### 2. Manajemen Pengguna

- Masuk ke menu "Manajemen Pengguna"
- Tambahkan data siswa, guru, atau staff
- Kaitkan ID kartu RFID dengan pengguna yang telah ditambahkan

### 3. Registrasi Kartu RFID

- Hubungkan perangkat pembaca RFID ke sistem
- Pada menu "Registrasi Kartu", tap kartu RFID pada perangkat pembaca
- Pilih pengguna yang akan dikaitkan dengan ID kartu tersebut
- Simpan perubahan

### 4. Proses Absensi

- Tempatkan perangkat pembaca RFID di lokasi yang ditentukan
- Pengguna cukup men-tap kartu RFID mereka pada perangkat pembaca
- Sistem akan secara otomatis mencatat waktu kehadiran
- Notifikasi akan muncul pada layar utama untuk konfirmasi

### 5. Monitoring dan Laporan

- Admin dapat memantau kehadiran secara real-time melalui dashboard
- Laporan kehadiran dapat diakses melalui menu "Laporan"
- Pilih filter berdasarkan kelas, tanggal, atau individu
- Ekspor laporan dalam format PDF, Excel, atau CSV

## Struktur Proyek

```
sistem-absensi-rfid/
├── backend/                 # Server Express.js
│   ├── config/              # Konfigurasi database dan aplikasi
│   ├── controllers/         # Controller untuk bisnis logic
│   ├── middleware/          # Middleware aplikasi
│   ├── models/              # Model database
│   ├── routes/              # Definisi routing API
│   ├── utils/               # Utilitas dan fungsi helper
│   ├── app.js               # Aplikasi Express
│   └── server.js            # Entry point backend
├── frontend/                # Aplikasi Next.js
│   ├── components/          # Komponen React
│   ├── pages/               # Halaman Next.js
│   ├── public/              # Asset statis
│   ├── styles/              # File CSS/SCSS
│   └── utils/               # Utilitas frontend
└── docs/                    # Dokumentasi tambahan
```

## Kontribusi

Kami sangat menghargai kontribusi untuk proyek ini. Berikut adalah cara untuk berkontribusi:

### 1. Fork dan Clone Repositori

```bash
# Fork repositori ini terlebih dahulu melalui GitHub
git clone https://github.com/username-anda/sistem-absensi-rfid.git
cd sistem-absensi-rfid
```

### 2. Buat Branch Baru

```bash
git checkout -b fitur-baru
```

### 3. Lakukan Perubahan

Lakukan perubahan yang diperlukan pada kode. Pastikan untuk mengikuti panduan gaya kode yang ada.

### 4. Jalankan Pengujian

```bash
# Pada folder backend
cd backend
npm run test

# Pada folder frontend
cd frontend
npm run test
```

### 5. Commit dan Push

```bash
git add .
git commit -m "Menambahkan fitur baru: deskripsi singkat"
git push origin fitur-baru
```

### 6. Buat Pull Request

- Kunjungi repositori GitHub Anda
- Klik tombol "Compare & pull request"
- Tuliskan deskripsi perubahan yang Anda lakukan
- Klik "Create pull request"

## Panduan Kontribusi Kode

- Gunakan linter untuk memastikan konsistensi kode
- Tambahkan komentar pada kode yang kompleks
- Tulis unit test untuk fitur baru
- Ikuti prinsip DRY (Don't Repeat Yourself)
- Gunakan nama variabel dan fungsi yang deskriptif

## Lisensi

Proyek ini dilisensikan dibawah [MIT License](LICENSE).

## Tim Pengembang

- Mahasiswa Angkatan Muda Universitas Negeri Malang 2025
- Guru dan Siswa SMK Negeri 1 Jenangan Ponorogo

## Kontak

Untuk pertanyaan atau informasi lebih lanjut, silakan hubungi:
- Email: admin@amumponorogo.ac.id
- Website: https://absensi-rfid.amumponorogo.ac.id

---

© 2025 AM UM & SMKN 1 Jenangan Ponorogo. Hak Cipta Dilindungi.
