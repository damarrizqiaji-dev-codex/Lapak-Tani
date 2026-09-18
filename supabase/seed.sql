-- ==============================================================================
-- LAPAK TANI - SUPABASE SEED DATA (DATA AWAL TERVERIFIKASI)
-- Jalankan di SQL Editor Supabase setelah schema.sql
-- ==============================================================================

-- 1. SEED PROFILES
INSERT INTO profiles (id, phone, name, role, location, group_name, business_name, reputation, completed_transactions_count)
VALUES
  ('user-petani-1', '081234567890', 'Pak Joko Susilo', 'petani', 'Rembang, Jawa Tengah', 'Kelompok Tani Tani Makmur Rembang', NULL, 4.9, 12),
  ('user-pedagang-1', '081398765432', 'H. Anwar', 'pedagang', 'Kudus, Jawa Tengah', NULL, 'Grosir Sayur Kudus Mandiri', 4.8, 28),
  ('user-petani-2', '081223344556', 'Pak Sudirman', 'petani', 'Brebes, Jawa Tengah', 'Gapoktan Bawang Subur Brebes', NULL, 4.8, 9),
  ('user-petani-3', '081233445566', 'Pak Marzuki', 'petani', 'Grobogan, Jawa Tengah', 'Kelompok Tani Sri Rejeki Grobogan', NULL, 4.7, 15)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED PRODUCTS
INSERT INTO products (id, farmer_id, farmer_name, farmer_group_name, commodity_name, category, photo, quantity, unit, quality, starting_price, location, description, minimum_order, packaging, moisture, harvest_date, status)
VALUES
  ('prod-1', 'user-petani-1', 'Pak Joko Susilo', 'Kelompok Tani Tani Makmur Rembang', 'Cabai Merah Keriting Super', 'cabai', 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80', 500, 'kg', 'Grade A Super', 30000, 'Kec. Sulang, Kab. Rembang, Jawa Tengah', 'Cabai merah keriting hasil panen subuh, kesegaran terjamin, warna merah pekat dan padat. Akses jalan desa muat pick-up & truk engkel.', 50, 'Krat Plastik', '< 12%', 'Hari Ini (Petik Pagi Subuh)', 'tersedia'),
  ('prod-2', 'user-petani-2', 'Pak Sudirman', 'Gapoktan Bawang Subur Brebes', 'Bawang Merah Bima Brebes', 'bawang', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', 1200, 'kg', 'Grade A Askip', 28000, 'Kec. Larangan, Kab. Brebes, Jawa Tengah', 'Bawang merah varietas Bima Brebes siap askip kering simpan. Umbi padat, aroma kuat, sudah diikat rapi.', 100, 'Karung Waring', '< 10% (Kering Askip)', 'Kemarin (Proses Jemur Selesai)', 'tersedia'),
  ('prod-3', 'user-petani-3', 'Pak Marzuki', 'Kelompok Tani Sri Rejeki Grobogan', 'Jagung Pipil Kering Pakan & Industri', 'palawija', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', 3500, 'kg', 'Pipil Kering Super', 5800, 'Kec. Purwodadi, Kab. Grobogan, Jawa Tengah', 'Jagung pipil hibrida kadar air rendah, bersih dari kotoran dan tongkol. Cocok untuk pakan ternak ayam atau pabrik.', 250, 'Sak 50 kg', '13.5% (Teruji Moisture Tester)', '3 Hari Lalu', 'tersedia')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED TRANSACTIONS
INSERT INTO transactions (id, transaction_code, commodity_name, product_quality, farmer_id, farmer_name, farmer_group_name, trader_id, trader_name, trader_business_name, quantity, final_price, total_value, platform_fee, location, pickup_schedule, pickup_vehicle, driver_name, payment_method, status)
VALUES
  ('trx-1', 'TRX-8921', 'Cabai Merah Keriting Super', 'Grade A Super', 'user-petani-1', 'Pak Joko Susilo', 'Poktan Tani Makmur Rembang', 'user-pedagang-1', 'H. Anwar', 'Grosir Sayur Kudus Mandiri', 300, 28000, 8400000, 0, 'Kebun Blok C, Desa Pedak, Kec. Sulang, Kab. Rembang, Jawa Tengah', 'Rabu, 25 Okt 2024 • 07:30 WIB', 'Pick-up L300 (Nopol K 8824 BD)', 'Bpk. Slamet', 'Timbang bersama & transfer lunas di kebun.', 'disepakati'),
  ('trx-2', 'TRX-8840', 'Cabai Merah Keriting', 'Grade A', 'user-petani-1', 'Pak Joko Susilo', 'Poktan Tani Makmur Rembang', 'user-pedagang-1', 'H. Anwar', 'Grosir Sayur Kudus Mandiri', 450, 27500, 12375000, 0, 'Gudang Panen Sulang, Kab. Rembang', 'Senin, 23 Okt 2024 • 08:00 WIB', 'Truk Engkel Canter', 'Bpk. Joko', 'Transfer lunas di tempat.', 'selesai')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED COMMUNITY POSTS
INSERT INTO community_posts (id, community_id, author_id, author_name, author_role, author_location, author_avatar_initials, type, commodity, content, responses_count, comments_count)
VALUES
  ('post-1', 'comm-cabai', 'user-pedagang-1', 'H. Anwar', 'pedagang', 'Kudus', 'HA', 'kebutuhan', 'Cabai Merah Keriting', 'Dibutuhkan segera pasokan 1 ton Cabai Merah Keriting untuk kirim ke Pasar Bintoro akhir minggu ini. Diutamakan petik segar dari kebun Rembang / Pati. Harga bersaing, bayar timbang di kebun.', 3, 2),
  ('post-2', 'comm-bawang', 'user-petani-2', 'Pak Sudirman', 'petani', 'Brebes', 'PS', 'ketersediaan', 'Bawang Merah Bima Brebes', 'Alhamdulillah panen Bawang Merah varietas Bima Brebes sudah mulai jemur. Estimasi kering askip 1,5 ton siap angkut hari Sabtu. Monggo pedagang yang butuh pasokan langsung hubungi.', 1, 1)
ON CONFLICT (id) DO NOTHING;
