# PANDUAN INTEGRASI SUPABASE & DEPLOY KE VERCEL (LAPAK TANI)

Repositori ini telah disiapkan untuk langsung terhubung dengan database **Supabase** dan siap di-deploy ke **Vercel**.

---

## 1. Persiapan Database Supabase

1. Buka [Supabase](https://supabase.com/) dan buat proyek baru (contoh nama: `lapak-tani-db`).
2. Masuk ke menu **SQL Editor** di dashboard Supabase Anda.
3. Buka file `supabase/schema.sql` di repositori ini, salin seluruh kodenya, dan klik **Run** di Supabase SQL Editor.
4. (Opsional) Buka file `supabase/seed.sql`, salin isinya, dan klik **Run** untuk mengisi data awal komoditas, petani terverifikasi, dan riwayat transaksi.
5. Dapatkan kredensial Supabase Anda di menu **Project Settings → API**:
   - **Project URL** (contoh: `https://xyzproject.supabase.co`)
   - **Project API Anon Key** (`anon` / `public`)

---

## 2. Hubungkan ke Repositori GitHub

1. Di Google AI Studio, buka menu pengaturan (**ikon gerigi di kanan atas**).
2. Pilih **Export to GitHub**.
3. Pilih akun/organisasi GitHub Anda dan beri nama repositori (contoh: `lapak-tani`).
4. Repositori Anda kini telah berisi seluruh kode frontend, skema SQL Supabase, dan konfigurasi Vercel.

---

## 3. Deploy ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New... → Project**.
2. Pilih repositori GitHub `lapak-tani` yang baru saja Anda ekspor.
3. Konfigurasi build otomatis terdeteksi:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Di bagian **Environment Variables**, tambahkan 2 variabel berikut:
   - `VITE_SUPABASE_URL` = (Project URL dari Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (Anon Key dari Supabase)
5. Klik **Deploy**.
6. Dalam hitungan detik, aplikasi **Lapak Tani** Anda akan aktif dan terhubung langsung ke database cloud Supabase!

---

## 4. File-File Konfigurasi yang Tersedia

- `supabase/schema.sql`: Skema lengkap PostgreSQL (tabel profiles, products, offers, negotiations, transactions, posts, dan RLS security).
- `supabase/seed.sql`: Data awal komoditas cabai, bawang merah, jagung, dan transaksi riil.
- `vercel.json`: Konfigurasi *rewrite* routing SPA agar URL dan navigasi tidak mengalami error 404 saat di-*refresh*.
- `.env.example`: Dokumentasi variabel lingkungan.
- `src/lib/supabase.ts` & `src/services/supabaseService.ts`: Modul klien Supabase dengan *graceful fallback*.
