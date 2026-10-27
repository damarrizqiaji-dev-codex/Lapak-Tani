import {
  User,
  Product,
  Offer,
  Negotiation,
  Transaction,
  Community,
  Post,
  Comment,
  PriceSummary,
  OfferStatus,
  ProductStatus,
  TransactionStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_OFFERS,
  INITIAL_NEGOTIATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMUNITIES,
  INITIAL_POSTS
} from './mockData';
import { supabaseService } from './supabaseService';

const STORAGE_KEYS = {
  USERS: 'lapaktani_users_v2',
  CURRENT_USER_ID: 'lapaktani_current_user_id_v2',
  PRODUCTS: 'lapaktani_products_v2',
  OFFERS: 'lapaktani_offers_v2',
  NEGOTIATIONS: 'lapaktani_negotiations_v2',
  TRANSACTIONS: 'lapaktani_transactions_v2',
  COMMUNITIES: 'lapaktani_communities_v2',
  POSTS: 'lapaktani_posts_v2',
  COMMENTS: 'lapaktani_comments_v2',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initialize default storage if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    setStored(STORAGE_KEYS.CURRENT_USER_ID, 'user-petani-utama');
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    setStored(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEGOTIATIONS)) {
    setStored(STORAGE_KEYS.NEGOTIATIONS, INITIAL_NEGOTIATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    setStored(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) {
    setStored(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    setStored(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    setStored(STORAGE_KEYS.COMMENTS, []);
  }
}

export function resetStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.OFFERS);
  localStorage.removeItem(STORAGE_KEYS.NEGOTIATIONS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.COMMUNITIES);
  localStorage.removeItem(STORAGE_KEYS.POSTS);
  localStorage.removeItem(STORAGE_KEYS.COMMENTS);
  initStorage();
}

// Asynchronously pull latest from Supabase into cache
export async function syncFromSupabase(): Promise<void> {
  if (!supabaseService.isReady()) return;

  try {
    const [cloudProducts, cloudOffers, cloudTransactions, cloudPosts] = await Promise.all([
      supabaseService.getProducts(),
      supabaseService.getOffers(),
      supabaseService.getTransactions(),
      supabaseService.getCommunityPosts(),
    ]);

    if (cloudProducts !== null) {
      setStored(STORAGE_KEYS.PRODUCTS, cloudProducts);
    }
    if (cloudOffers !== null) {
      setStored(STORAGE_KEYS.OFFERS, cloudOffers);
    }
    if (cloudTransactions !== null) {
      setStored(STORAGE_KEYS.TRANSACTIONS, cloudTransactions);
    }
    if (cloudPosts !== null) {
      setStored(STORAGE_KEYS.POSTS, cloudPosts);
    }
  } catch (err) {
    console.warn('Sync from Supabase failed, falling back to local storage cache:', err);
  }
}

// User methods
export function getCurrentUser(): User {
  initStorage();
  const currentId = getStored<string>(STORAGE_KEYS.CURRENT_USER_ID, 'user-petani-utama');
  const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const found = users.find(u => u.id === currentId);
  return found || users[0];
}

export function setCurrentUserId(userId: string): void {
  setStored(STORAGE_KEYS.CURRENT_USER_ID, userId);
}

export function getAllUsers(): User[] {
  initStorage();
  return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function registerOrLoginUser(phone: string, role: 'petani' | 'pedagang', name?: string): User {
  initStorage();
  const users = getAllUsers();
  let user = users.find(u => u.phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, ''));
  if (!user) {
    const newId = 'user-' + Date.now();
    user = {
      id: newId,
      name: name || (role === 'petani' ? 'Petani Terdaftar' : 'Pedagang Terdaftar'),
      email: `${newId}@lapaktani.id`,
      role,
      phone,
      location: 'Rembang, Jawa Tengah',
      groupName: role === 'petani' ? 'Kelompok Tani Mandiri' : 'Grosir Mandiri',
      verified: true,
      completedTransactionsCount: 0,
      reputation: 5.0,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    setStored(STORAGE_KEYS.USERS, users);
  } else {
    user.role = role;
    if (name) user.name = name;
    setStored(STORAGE_KEYS.USERS, users);
  }
  setCurrentUserId(user.id);

  // Sync profile to Supabase in background
  if (supabaseService.isReady()) {
    supabaseService.upsertProfile(user).catch(console.error);
  }

  return user;
}

// Products
export function getProducts(): Product[] {
  initStorage();
  return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'status'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...productData,
    id: 'prod-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'tersedia',
  };
  products.unshift(newProduct);
  setStored(STORAGE_KEYS.PRODUCTS, products);

  // Sync to Supabase cloud
  if (supabaseService.isReady()) {
    supabaseService.insertProduct(newProduct).catch(console.error);
  }

  return newProduct;
}

export function updateProductStatus(id: string, status: ProductStatus): void {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx].status = status;
    setStored(STORAGE_KEYS.PRODUCTS, products);

    // Sync to Supabase
    if (supabaseService.isReady()) {
      const allowedStatus = status === 'tersedia' ? 'tersedia' : status === 'terjual' ? 'terjual' : 'dipesan';
      supabaseService.updateProductStatus(id, allowedStatus).catch(console.error);
    }
  }
}

// Offers
export function getOffers(): Offer[] {
  initStorage();
  return getStored<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
}

export function getOfferById(id: string): Offer | undefined {
  return getOffers().find(o => o.id === id);
}

export function getOffersForUser(userId: string, role: 'petani' | 'pedagang'): Offer[] {
  const offers = getOffers();
  if (role === 'petani') {
    return offers.filter(o => o.farmerId === userId);
  } else {
    return offers.filter(o => o.traderId === userId);
  }
}

export function createOffer(
  productId: string,
  traderId: string,
  quantity: number,
  offeredPrice: number,
  message?: string
): Offer {
  const product = getProductById(productId);
  if (!product) throw new Error('Produk tidak ditemukan');

  const users = getAllUsers();
  const trader = users.find(u => u.id === traderId) || {
    id: traderId,
    name: 'Pedagang Terdaftar',
    location: 'Jawa Tengah'
  };

  const offers = getOffers();
  const newOffer: Offer = {
    id: 'offer-' + Date.now(),
    productId,
    commodityName: product.commodityName,
    productPhoto: product.photo,
    productQuality: product.quality,
    farmerId: product.farmerId,
    farmerName: product.farmerName,
    traderId,
    traderName: trader.name,
    traderLocation: trader.location,
    quantity,
    offeredPrice,
    farmerStartingPrice: product.startingPrice,
    message: message || undefined,
    status: 'menunggu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  offers.unshift(newOffer);
  setStored(STORAGE_KEYS.OFFERS, offers);

  // Add initial negotiation step
  addNegotiation({
    offerId: newOffer.id,
    senderId: traderId,
    senderName: trader.name,
    senderRole: 'pedagang',
    price: offeredPrice,
    quantity,
    message: message || 'Mengajukan penawaran harga.',
  });

  // Sync to Supabase
  if (supabaseService.isReady()) {
    supabaseService.insertOffer(newOffer).catch(console.error);
  }

  return newOffer;
}

// Negotiations
export function getNegotiations(offerId: string): Negotiation[] {
  initStorage();
  const all = getStored<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, INITIAL_NEGOTIATIONS);
  return all.filter(n => n.offerId === offerId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addNegotiation(data: Omit<Negotiation, 'id' | 'createdAt'>): Negotiation {
  const all = getStored<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, INITIAL_NEGOTIATIONS);
  const newEntry: Negotiation = {
    ...data,
    id: 'neg-' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  all.push(newEntry);
  setStored(STORAGE_KEYS.NEGOTIATIONS, all);

  // Update offer status and last price
  const offers = getOffers();
  const offerIdx = offers.findIndex(o => o.id === data.offerId);
  if (offerIdx !== -1) {
    offers[offerIdx].offeredPrice = data.price;
    offers[offerIdx].quantity = data.quantity;
    if (data.message) {
      offers[offerIdx].message = data.message;
    }
    offers[offerIdx].status = 'dinegosiasi';
    offers[offerIdx].updatedAt = newEntry.createdAt;
    setStored(STORAGE_KEYS.OFFERS, offers);

    // Sync to Supabase
    if (supabaseService.isReady()) {
      supabaseService.updateOfferStatus(data.offerId, 'dinegosiasi').catch(console.error);
    }
  }

  return newEntry;
}

export function acceptOffer(offerId: string): Transaction {
  const offer = getOfferById(offerId);
  if (!offer) throw new Error('Penawaran tidak ditemukan');

  // Update offer status
  const offers = getOffers();
  const offerIdx = offers.findIndex(o => o.id === offerId);
  if (offerIdx !== -1) {
    offers[offerIdx].status = 'diterima';
    offers[offerIdx].updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.OFFERS, offers);

    if (supabaseService.isReady()) {
      supabaseService.updateOfferStatus(offerId, 'diterima').catch(console.error);
    }
  }

  // Update product status
  updateProductStatus(offer.productId, 'dalam_negosiasi');

  // Create Transaction
  const transactions = getTransactions();
  const now = new Date();
  const dateFormatted = `${now.getDate()} Okt ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
  const nextCodeNum = 8900 + transactions.length + 1;
  const newTrx: Transaction = {
    id: 'trx-' + Date.now(),
    transactionCode: `TRX-${nextCodeNum}`,
    productId: offer.productId,
    commodityName: offer.commodityName,
    productQuality: offer.productQuality || 'Grade A',
    farmerId: offer.farmerId,
    farmerName: offer.farmerName,
    traderId: offer.traderId,
    traderName: offer.traderName,
    offerId: offer.id,
    quantity: offer.quantity,
    finalPrice: offer.offeredPrice,
    totalValue: offer.quantity * offer.offeredPrice,
    transactionDate: dateFormatted,
    status: 'disepakati',
    location: 'Kebun Mitra Petani, Jawa Tengah',
    pickupSchedule: 'Esok Hari • 08:00 WIB',
    pickupVehicle: 'Armada Angkut Pick-up / Truk',
    driverName: 'Sopir Ekspedisi Mitra',
    paymentMethod: 'Timbang bersama di lokasi & pembayaran tunai / transfer langsung sesaat setelah muatan terisi.',
  };

  transactions.unshift(newTrx);
  setStored(STORAGE_KEYS.TRANSACTIONS, transactions);

  // Sync to Supabase
  if (supabaseService.isReady()) {
    supabaseService.insertTransaction(newTrx).catch(console.error);
  }

  return newTrx;
}

export function rejectOffer(offerId: string): void {
  const offers = getOffers();
  const offerIdx = offers.findIndex(o => o.id === offerId);
  if (offerIdx !== -1) {
    offers[offerIdx].status = 'ditolak';
    offers[offerIdx].updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.OFFERS, offers);

    if (supabaseService.isReady()) {
      supabaseService.updateOfferStatus(offerId, 'ditolak').catch(console.error);
    }
  }
}

// Transactions
export function getTransactions(): Transaction[] {
  initStorage();
  return getStored<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
}

export function getTransactionById(id: string): Transaction | undefined {
  return getTransactions().find(t => t.id === id || t.transactionCode === id);
}

export function updateTransactionStatus(transactionId: string, status: TransactionStatus): void {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === transactionId || t.transactionCode === transactionId);
  if (idx !== -1) {
    transactions[idx].status = status;
    setStored(STORAGE_KEYS.TRANSACTIONS, transactions);

    if (supabaseService.isReady()) {
      const allowedStatus = status === 'selesai' ? 'selesai' : status === 'diproses' ? 'proses_timbang' : 'disepakati';
      supabaseService.updateTransactionStatus(transactionId, allowedStatus).catch(console.error);
    }
  }
}

// Communities
export function getCommunities(): Community[] {
  initStorage();
  return getStored<Community[]>(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
}

export function getCommunityById(id: string): Community | undefined {
  return getCommunities().find(c => c.id === id);
}

// Posts
export function getPosts(communityId?: string): Post[] {
  initStorage();
  const all = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  if (communityId) {
    return all.filter(p => p.communityId === communityId);
  }
  return all;
}

export function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'responsesCount' | 'commentsCount'>): Post {
  const posts = getPosts();
  const now = new Date();
  const newPost: Post = {
    ...postData,
    id: 'post-' + Date.now(),
    createdAt: now.toISOString(),
    responsesCount: 0,
    commentsCount: 0,
  };
  posts.unshift(newPost);
  setStored(STORAGE_KEYS.POSTS, posts);

  if (supabaseService.isReady()) {
    supabaseService.insertCommunityPost(newPost).catch(console.error);
  }

  return newPost;
}

// Comments
export function getComments(postId: string): Comment[] {
  initStorage();
  const all = getStored<Comment[]>(STORAGE_KEYS.COMMENTS, []);
  return all.filter(c => c.postId === postId);
}

export function addComment(
  postId: string, 
  author: User | string, 
  contentOrName: string, 
  authorRole?: 'petani' | 'pedagang', 
  contentStr?: string
): Comment {
  const comments = getStored<Comment[]>(STORAGE_KEYS.COMMENTS, []);
  const now = new Date();
  
  let authorId = '';
  let authorName = '';
  let role: 'petani' | 'pedagang' = 'petani';
  let content = '';

  if (typeof author === 'object') {
    authorId = author.id;
    authorName = author.name;
    role = author.role;
    content = contentOrName;
  } else {
    authorId = author;
    authorName = contentOrName;
    role = authorRole || 'petani';
    content = contentStr || '';
  }

  const newComment: Comment = {
    id: 'comment-' + Date.now(),
    postId,
    authorId,
    authorName,
    authorRole: role,
    content,
    createdAt: now.toISOString(),
  };
  comments.push(newComment);
  setStored(STORAGE_KEYS.COMMENTS, comments);

  // Increment comments count on post
  const posts = getPosts();
  const pIdx = posts.findIndex(p => p.id === postId);
  if (pIdx !== -1) {
    posts[pIdx].commentsCount = (posts[pIdx].commentsCount || 0) + 1;
    setStored(STORAGE_KEYS.POSTS, posts);
  }

  return newComment;
}

// Price Summary calculation
export function getPriceSummary(commodity: string): PriceSummary {
  const transactions = getTransactions();
  const matched = transactions.filter(t => 
    t.commodityName.toLowerCase().includes(commodity.toLowerCase()) && 
    (t.status === 'selesai' || t.status === 'disepakati')
  );

  if (matched.length === 0) {
    return {
      commodityName: commodity,
      averagePrice: 0,
      startingPriceAverage: 0,
      traderOfferMin: 0,
      traderOfferMax: 0,
      lastTransactionPrice: 0,
      lastTransactionTime: 'Belum ada transaksi',
      totalVolume: 0,
      totalValue: 0,
      transactionCount: 0,
      hasEnoughData: false,
      transactions: [],
    };
  }

  const prices = matched.map(m => m.finalPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const sum = prices.reduce((a, b) => a + b, 0);
  const avgPrice = Math.round(sum / prices.length);
  const totalVolume = matched.reduce((a, b) => a + b.quantity, 0);
  const totalValue = matched.reduce((a, b) => a + b.totalValue, 0);

  return {
    commodityName: commodity,
    averagePrice: avgPrice,
    startingPriceAverage: avgPrice,
    traderOfferMin: minPrice,
    traderOfferMax: maxPrice,
    lastTransactionPrice: matched[0].finalPrice,
    lastTransactionTime: matched[0].transactionDate,
    totalVolume,
    totalValue,
    transactionCount: matched.length,
    hasEnoughData: true,
    transactions: matched.map(m => ({
      id: m.id,
      date: m.transactionDate,
      location: m.location,
      volume: m.quantity,
      parties: `${m.farmerName} → ${m.traderName}`,
      price: m.finalPrice,
    })),
  };
}

// Export alias for backward compatibility
export const getPriceInfo = getPriceSummary;
