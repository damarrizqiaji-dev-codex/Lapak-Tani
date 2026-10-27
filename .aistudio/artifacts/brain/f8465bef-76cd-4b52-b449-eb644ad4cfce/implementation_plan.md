# Rencana Implementasi: Lapak Tani Siap Produksi (Real Database & Zero Dummy)

## Ringkasan Eksekutif
Aplikasi akan ditransformasikan dari mode mock/prototipe menjadi **platform produksi nyata** yang siap digunakan oleh petani dan pedagang di lapangan, dengan:
1. **0 Data Tiruan (Zero Dummy State)**: Tidak ada lagi produk palsu, riwayat transaksi fiktif, atau penawaran palsu. Tampilan awal bersih dan siap menerima data asli panen dari petani.
2. **Koneksi Supabase Langsung di Antarmuka (In-App Database Config & Test)**: Pengguna/admin dapat memasukkan atau memperbarui `SUPABASE_URL` dan `SUPABASE_ANON_KEY` langsung melalui formulir pengaturan di aplikasi, tersimpan aman di browser/env, lengkap dengan tombol uji coba koneksi langsung (*Ping / Connection Test*).
3. **Penyimpanan Nyata (Real CRUD to Supabase PostgreSQL)**:
   - **Pendaftaran & Akun**: Pendaftaran petani & pedagang nyata (nama, kontak HP/WA, nama kelompok tani / kios, lokasi daerah).
   - **Posting Panen Nyata**: Formulir tambah panen langsung melakukan `INSERT` ke tabel `products` Supabase.
   - **Tawar Menawar Nyata**: Pengajuan penawaran dari pedagang masuk ke tabel `offers`, ruang tawar-menawar tersimpan di `negotiations`.
   - **Akad & Surat Jalan Digital**: Pembuatan nota timbang dan akad langsung tercatat di `transactions`.
   - **Forum Pasokan Nyata**: Diskusi kebutuhan & ketersediaan komoditas di tabel `community_posts`.
4. **Empty State & Edukasi yang Menarik**: Saat belum ada postingan panen, tampilkan panduan cara memasang panen pertama bagi petani dan cara mencari pasokan bagi pedagang.

---

## Rincian Tahapan Eksekusi

### Tahap 1: In-App Supabase Connector & State Service
- Buat komponen `DatabaseConfigModal.tsx` yang memungkinkan input URL Supabase dan Public/Anon Key langsung dari halaman profil/header, dengan status indikator hijau (*Terhubung ke Cloud Supabase*) atau kuning (*Perlu Kunci Supabase*).
- Sediakan utilitas tes koneksi langsung (`supabaseService.testConnection()`) untuk memvalidasi apakah kredensial valid dan tabel-tabel PostgreSQL dapat diakses.

### Tahap 2: Pembersihan Data Dummy (Zero Dummy Data)
- Perbarui `src/services/storage.ts` dan `src/services/mockData.ts` agar data awal `INITIAL_PRODUCTS`, `INITIAL_OFFERS`, `INITIAL_TRANSACTIONS`, dan `INITIAL_POSTS` bernilai kosong `[]` (atau flag *clean database*).
- Tambahkan tampilan *Empty State* yang ramah bagi petani/pedagang: tombol "Pasang Panen Perdana" saat katalog kosong, dan panduan jelas.

### Tahap 3: Integrasi Penuh Antarmuka ke Supabase Service
- Hubungkan `AppContext.tsx` agar memprioritaskan pemanggilan data dari Supabase saat `isSupabaseConfigured() === true`:
  - `getProducts()`, `insertProduct()`, `updateProductStatus()`
  - `getOffers()`, `createOffer()`, `sendNegotiationMessage()`, `acceptOffer()`
  - `getTransactions()`, `createTransaction()`, `updateTransactionStatus()`
  - `getPosts()`, `createPost()`
- Jika Supabase belum diisi kuncinya, data tersimpan di LocalStorage pengguna sebagai fallback aman tanpa crash.

### Tahap 4: Verifikasi & Uji Kompilasi
- Jalankan linter dan build `compile_applet` untuk memastikan semua types, skema, dan alur kerja berfungsi mulus 100%.
