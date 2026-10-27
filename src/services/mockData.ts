import { User, Product, Offer, Negotiation, Transaction, Community, Post } from '../types';

// Akun default dasar bagi pengguna baru saat pertama kali membuka aplikasi jika belum login
export const INITIAL_USERS: User[] = [
  {
    id: 'user-petani-utama',
    name: 'Petani Terdaftar',
    email: 'petani@lapaktani.id',
    role: 'petani',
    phone: '0812-3456-7890',
    location: 'Rembang, Jawa Tengah',
    groupName: 'Kelompok Tani Makmur',
    verified: true,
    completedTransactionsCount: 0,
    reputation: 5.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-pedagang-utama',
    name: 'Pedagang Grosir',
    email: 'pedagang@lapaktani.id',
    role: 'pedagang',
    phone: '0813-9876-5432',
    location: 'Kudus, Jawa Tengah',
    groupName: 'Grosir Sayur Mandiri',
    verified: true,
    completedTransactionsCount: 0,
    reputation: 5.0,
    createdAt: new Date().toISOString(),
  }
];

// ZERO DUMMY: Seluruh katalog panen dimulai dari kosong (0 produk)
export const INITIAL_PRODUCTS: Product[] = [];

// ZERO DUMMY: Seluruh penawaran harga dimulai dari kosong
export const INITIAL_OFFERS: Offer[] = [];

// ZERO DUMMY: Seluruh riwayat negosiasi dimulai dari kosong
export const INITIAL_NEGOTIATIONS: Negotiation[] = [];

// ZERO DUMMY: Seluruh buku transaksi & nota dimulai dari kosong
export const INITIAL_TRANSACTIONS: Transaction[] = [];

// Komunitas saluran komunikasi umum
export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-umum',
    name: 'Pusat Pasokan & Kebutuhan Komoditas',
    commodity: 'Semua Komoditas',
    description: 'Forum koordinasi langsung petani dan pedagang untuk mencari dan menawarkan pasokan pangan tangan pertama tanpa calo.',
    location: 'Jawa Tengah & Sekitarnya',
    memberCount: 1,
    postCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'comm-cabai',
    name: 'Jejaring Cabai Nasional',
    commodity: 'Cabai Rawit Merah & Keriting',
    description: 'Informasi panen cabai segar dari Brebes, Temanggung, Blitar, Kediri, dan Rembang.',
    location: 'Sentra Cabai',
    memberCount: 1,
    postCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'comm-bawang',
    name: 'Sentra Bawang Merah Nusantara',
    commodity: 'Bawang Merah',
    description: 'Koordinasi pasokan bawang merah Super Brebes dan Nganjuk dengan kadar air terstandar.',
    location: 'Brebes & Nganjuk',
    memberCount: 1,
    postCount: 0,
    createdAt: new Date().toISOString(),
  }
];

// ZERO DUMMY: Forum postingan dimulai bersih
export const INITIAL_POSTS: Post[] = [];
