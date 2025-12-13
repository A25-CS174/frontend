Frontend (LearnFlow)

## Ringkasan

Ini adalah frontend single-page application (Vanilla JS + Vite + Tailwind) untuk project LearnFlow. Aplikasi menyediakan UI untuk login/register, melihat modul, subchapter, profil pengguna, dashboard progress, dan learning paths.

## Persyaratan

- Node.js (direkomendasikan v18+ atau sesuai environment)
- npm

## Instalasi & Menjalankan (development)

1. Masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependensi:

```bash
npm install
```

3. Jalankan dev server (Vite):

```bash
npm run dev
```

4. Buka browser ke alamat yang ditampilkan (biasanya http://localhost:5173).

## Build produksi

```bash
npm run build
npm run preview    # untuk preview hasil build
```

## Struktur singkat folder

- `index.html` — entry HTML
- `main.js` — bootstrap SPA dan router
- `src/` — kode sumber UI
  - `api/api.js` — wrapper semua panggilan HTTP ke backend
  - `pages/` — kumpulan halaman (login, register, dashboard, module, profile, dll)
  - `components/` — komponen UI (navbar, dll)
  - `style.css` — global styles

## Halaman (Pages) dan Penjelasan

- Landing (`/#/`) — Halaman beranda/marketing singkat.
- Login (`/#/login`) — Form login. Setelah login backend mengembalikan token JWT yang disimpan di `localStorage.token`.
- Register (`/#/register`) — Form pendaftaran pengguna.
- Dashboard / Runtutan (`/#/runtutan`) — Dashboard aktivitas belajar. Menampilkan:
  - Chart aktivitas harian/mingguan (data diambil dari `/api/progress/chart`).
  - Daftar Learning Paths dan progress tiap LP.
  - Area kanan menampilkan modul tergantung pilihan: jika user memilih Learning Path, area kanan menampilkan modul di LP tersebut; jika tidak, area kanan menampilkan modul yang tidak termasuk di LP manapun.
- Progress (`/#/progress`) — Rincian progress user (overview per modul, milestones).
- Module List (`/#/module/:id`) — Rincian modul, daftar chapters dan subchapters.
- Subchapter (`/#/subchapter/:id`) — Halaman konten pembelajaran. Fitur penting:
  - Memuat konten HTML/CSS subchapter.
  - Mencatat durasi user membuka halaman (dikirim ke backend sebagai menit) saat user navigasi/menutup halaman.
  - Tombol 'Selanjutnya' menandai subchapter complete dan memicu perhitungan ulang progress.
- Profile (`/#/profile`) — Menampilkan info user (nama, email, kota, foto). Jika frontend hanya mendapatkan token saat login, profil mengambil daftar user dari `/api/users` dan mencocokkan id/email dari token.

## Interaksi Frontend ↔ Backend

Semua panggilan API berada di `src/api/api.js`. Endpoint utama:

- Auth
  - `POST /api/auth/login` — login, mengembalikan `{ token }`.
  - `POST /api/auth/register` — register.
- Users
  - `GET /api/users` — daftar user (digunakan frontend untuk menemukan data profil jika frontend tidak menyimpan user saat login).
- Modules & Subchapters
  - `GET /api/modules` — daftar modul.
  - `GET /api/modules/:id/chapters` — daftar chapters.
  - `GET /api/modules/:m/chapter/:c/subchapters` — daftar subchapters (helper `modulesAPI.getSubchapterFull` memudahkan mencari subchapter dari id tunggal).
- Progress
  - `GET /api/progress/overview` — ringkasan progress user (persentase, module list).
  - `POST /api/progress/module/:moduleId/update` — update progress modul.
  - `POST /api/progress/subchapter/:subchapterId/time` — (baru) rekam menit yang dihabiskan user pada subchapter.
  - `POST /api/progress/subchapter/:subchapterId/complete` — (baru) tandai subchapter complete dan recalc progress.
  - `GET /api/progress/chart` — data time-series untuk chart (menit per hari) — Runtutan menampilkan data ini.

## Autentikasi

Semua request ke endpoint terlindungi menyertakan header `Authorization: Bearer <token>` yang diambil dari `localStorage.token`. Middleware backend memverifikasi JWT dan mengisi `req.user`.

## Catatan pengembangan & saran

- Saat login, saat ini frontend menyimpan `token` tetapi tidak selalu menyimpan objek `user`. Untuk menghindari fetching `GET /api/users` seluruhnya, sebaiknya backend menyediakan endpoint `GET /api/auth/me` yang mengembalikan data user dari token.
- Durasi subchapter dikirim dalam satuan menit (dibulatkan ke atas, minimal 1 menit) setiap kali user meninggalkan halaman atau menavigasi; backend menyimpan di tabel `user_subchapter_time` dan chart membaca agregasi menit per tanggal.
- Untuk produksi, pastikan CORS, rate-limiting, dan validasi input telah diatur di backend.

## Debugging cepat

- Jika halaman profil kosong: buka DevTools → Application → Local Storage, lihat `token`. Jika token ada tapi profil kosong, cek Network -> apakah request ke `/api/users` gagal atau return empty.
- Jika chart tidak menampilkan data: cek Network -> `/api/progress/chart` respons; cek tabel `user_subchapter_time` di DB untuk melihat data menit.

## Kontak

Jika butuh pembaruan API (contoh: endpoint `/auth/me`), beri tahu saya dan saya akan menambahkan endpoint backend dan menyesuaikan frontend.

---

File ini diupdate otomatis oleh tim pengembang pada repository lokal.
