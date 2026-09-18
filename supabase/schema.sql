-- ==============================================================================
-- LAPAK TANI - SUPABASE DATABASE SCHEMA (POSTGRESQL)
-- Siap untuk hosting Vercel & Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES (Petani & Pedagang)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('petani', 'pedagang')),
  location TEXT NOT NULL,
  group_name TEXT,
  business_name TEXT,
  reputation NUMERIC(3, 2) DEFAULT 5.0,
  completed_transactions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS (Hasil Panen Petani)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_group_name TEXT,
  commodity_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cabai', 'bawang', 'sayuran', 'palawija', 'beras')),
  photo TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality TEXT NOT NULL,
  starting_price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  minimum_order NUMERIC NOT NULL DEFAULT 50,
  packaging TEXT NOT NULL DEFAULT 'Krat Plastik',
  moisture TEXT DEFAULT '< 12%',
  harvest_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'dipesan', 'terjual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OFFERS (Pengajuan Penawaran Harga)
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  commodity_name TEXT NOT NULL,
  product_photo TEXT,
  trader_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trader_name TEXT NOT NULL,
  farmer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_starting_price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  offered_price NUMERIC NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'dinegosiasi', 'diterima', 'ditolak')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NEGOTIATIONS (Kronologi Tawar Menawar)
CREATE TABLE IF NOT EXISTS negotiations (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('petani', 'pedagang')),
  price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRANSACTIONS (Akad Kesepakatan & Serah Terima)
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  offer_id TEXT REFERENCES offers(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  transaction_code TEXT UNIQUE NOT NULL,
  commodity_name TEXT NOT NULL,
  product_quality TEXT NOT NULL,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farmer_group_name TEXT,
  trader_id TEXT NOT NULL,
  trader_name TEXT NOT NULL,
  trader_business_name TEXT,
  quantity NUMERIC NOT NULL,
  final_price NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  platform_fee NUMERIC DEFAULT 0,
  location TEXT NOT NULL,
  pickup_schedule TEXT,
  pickup_vehicle TEXT,
  driver_name TEXT,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'disepakati' CHECK (status IN ('disepakati', 'proses_timbang', 'selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMUNITY POSTS & COMMENTS (Forum Pasokan)
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL DEFAULT 'comm-umum',
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_location TEXT NOT NULL,
  author_avatar_initials TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('kebutuhan', 'ketersediaan')),
  commodity TEXT NOT NULL,
  content TEXT NOT NULL,
  responses_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR HIGH QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_offer_id ON negotiations(offer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for transparency
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON products FOR UPDATE USING (true);

CREATE POLICY "Allow public read offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Allow public insert offers" ON offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update offers" ON offers FOR UPDATE USING (true);

CREATE POLICY "Allow public read negotiations" ON negotiations FOR SELECT USING (true);
CREATE POLICY "Allow public insert negotiations" ON negotiations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON transactions FOR UPDATE USING (true);

CREATE POLICY "Allow public read posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON community_posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON community_comments FOR INSERT WITH CHECK (true);
