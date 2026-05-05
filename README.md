# 📖 Dokumentasi Teknis & Arsitektur Proyek IMPAL

Proyek ini adalah aplikasi *Full-Stack* yang memisahkan antara antarmuka pengguna (Frontend) dan logika server/API (Backend). Aplikasi ini dibangun dengan arsitektur berbasis *Client-Server* melalui komunikasi RESTful API.

---

## 🏗️ 1. Arsitektur Sistem (High-Level)

Sistem menggunakan arsitektur **Client-Server** standar:
*   **Frontend (Client):** Single Page Application (SPA) berbasis React.js yang bertugas merender UI dan mengatur *state* pengguna di browser.
*   **Backend (Server):** RESTful API berbasis Node.js & Express.js yang menangani logika bisnis, autentikasi, dan operasi database.
*   **Database:** Relational Database (SQL) yang dikelola skema dan migrasinya menggunakan **Prisma ORM**.

---

## ⚙️ 2. Backend (Node.js + Express + Prisma)

### 🛠️ Tech Stack
*   **Runtime/Framework:** Node.js, Express.js
*   **Language:** TypeScript
*   **Database ORM:** Prisma
*   **Testing:** Vitest
*   **Documentation:** Swagger / OpenAPI
*   **Tooling:** Nodemon, ESLint

### 📂 Struktur Direktori & Konsep (Domain-Driven / Modular)
Backend menggunakan **Layered Architecture (N-Tier)** dengan pengelompokan berdasarkan *Domain/Module* (Consultations, Doctors, Pharmacy, Users).

```text
Backend/src/
├── docs/         # Konfigurasi Swagger & definisi komponen API (OpenAPI)
├── dtos/         # Data Transfer Objects (Interface/Type untuk data yang dikirim/diterima)
├── generated/    # Hasil generate dari Prisma Client
├── helpers/      # Fungsi utilitas (Error Handler, Wrapper Response, HTTP Status CLI)
├── interfaces/   # Definisi TypeScript Interfaces (Kontrak tipe data global)
├── middlewares/  # Express Middlewares (Otorisasi: jwt.ts, authorization.ts)
├── modules/      # Core Business Logic (Dikelompokkan per domain)
│   ├── Consultations/
│   ├── Doctors/
│   ├── Pharmacy/
│   └── Users/
│       ├── controllers/  # Menangani Request/Response HTTP
│       ├── services/     # Menangani Logika Bisnis (Aturan aplikasi)
│       └── repositories/ # Menangani akses Database via Prisma
├── routes/       # Definisi Endpoint API (URL mapper ke Controller)
├── schemas/      # Skema validasi data masuk (biasanya menggunakan Zod/Joi)
└── types/        # Custom TypeScript definitions (Global types declaration)
```

### 🔄 Alur Data (Request Lifecycle) di Backend
1.  **Route (`routes/`):** Menerima HTTP Request (GET, POST, dll).
2.  **Middleware (`middlewares/`):** Request melewati *guard* (cek JWT Token, hak akses otorisasi). Jika bernilai salah, request ditolak.
3.  **Controller (`modules/*/controllers/`):** Mengambil data masukan (`req.body`, `req.params`). Tidak mengeksekusi logika berat, langsung memanggil *Service*.
4.  **Service (`modules/*/services/`):** Melakukan *Business Logic* (Validasi aturan, perhitungan, kompilasi data). Memanggil *Repository* jika butuh data persisten.
5.  **Repository (`modules/*/repositories/`):** Berinteraksi langsung dengan *Prisma Client* untuk query (Create, Read, Update, Delete) ke Database.
6.  **Response:** Data dikembalikan dari Repo ➡️ Service ➡️ Controller. Controller menggunakan `helpers/wrapper` untuk merapikan JSON response agar formatnya konsisten ke Frontend.

---

## 💻 3. Frontend (React.js + Vite)

### 🛠️ Tech Stack
*   **Framework/Bundler:** React.js, Vite
*   **Styling:** CSS / TailwindCSS (berdasarkan standar ekosistem vite)
*   **Data Fetching & State:** Axios, TanStack React Query (`useApiQuery`)
*   **Routing:** React Router DOM (Pola `Pages/` & `Layout/`)

### 📂 Struktur Direktori UI
```text
Frontend/src/
├── assets/       # Gambar, Icon, Font statis
├── components/   # UI Component yang dapat dipakai ulang (Navbar, Footer, Cards)
├── context/      # React Context API (AuthContext untuk state login global)
├── data/         # Mock data / Data dummy statis
├── hooks/        # Custom React Hooks (Logika pemanggilan API: useApiQuery, useApiMutation)
├── layout/       # Skeleton layout halaman (PublicLayout, PrivateLayout)
├── lib/          # Konfigurasi library eksternal (axios.js, queryClient.js)
├── Pages/        # Komponen rute level halaman utama (Auth, Home, NotFound)
└── main.jsx/App  # Root/Entry point dari React App & Provider setup
```

### 🔄 Alur Data & State Management Frontend
1.  **Pemanggilan API (Hooks & Lib):** Frontend jarang melakukan fetch langsung di dalam komponen. Pemanggilan API diabstraksi ke dalam `hooks/` (seperti `useApiQuery.js` atau `useApiMutation.js`) yang berjalan di atas konfigurasi `lib/axios.js` dan dikelola *cache*-nya oleh React Query (`lib/queryClient.js`).
2.  **State Global:** Status otentikasi user dan token disimpan/dikelola secara terpusat di `context/AuthContext.jsx`.
3.  **UI Layouting:** Halaman-halaman (`Pages/`) dirender di dalam kerangka `layout/PublicLayout.jsx` untuk menjamin konsistensi tata letak (seperti posisi Navbar dan Footer).

---

## 🗄️ 4. Skema Database (Kilas Balik Prisma)

Manajemen basis data sepenuhnya dikontrol melalui file tunggal: `Backend/prisma/schema.prisma`.
*   **Migrations:** Perubahan struktur tabel dikelola menggunakan sistem migrasi Prisma (`prisma/migrations/`).
*   **Tabel Tersirat (Berdasarkan Modul):**
    *   `Users` (Pasien/Dokter/Admin)
    *   `Doctors` (Profil Dokter, Spesialisasi)
    *   `Consultations` (Data sesi chat/konsultasi, ID Dokter, ID Pasien, Status, Biaya)
    *   `Messages` (Riwayat chat konsultasi)
    *   `Prescriptions & PrescriptionItems` (Resep obat dari dokter)
    *   `Products` (Daftar obat di Farmasi)

---

## 🧪 5. Testing & Quality Assurance

*   **Backend Unit Testing** menggunakan **Vitest** (tepat di folder `Backend/tests/unit/`).
*   Pengujian difokuskan pada unit/bagian kecil (Helpers, Middlewares, dan Services/Modules) untuk memastikan fungsi internal berjalan sesuai dengan ekspektasi tanpa harus menjalankan server.
