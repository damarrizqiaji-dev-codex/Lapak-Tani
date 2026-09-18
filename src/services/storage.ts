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

const STORAGE_KEYS = {
  USERS: 'lapaktani_users_v1',
  CURRENT_USER_ID: 'lapaktani_current_user_id_v1',
  PRODUCTS: 'lapaktani_products_v1',
  OFFERS: 'lapaktani_offers_v1',
  NEGOTIATIONS: 'lapaktani_negotiations_v1',
  TRANSACTIONS: 'lapaktani_transactions_v1',
  COMMUNITIES: 'lapaktani_communities_v1',
  POSTS: 'lapaktani_posts_v1',
  COMMENTS: 'lapaktani_comments_v1',
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
    setStored(STORAGE_KEYS.CURRENT_USER_ID, 'user-joko'); // default to Pak Joko Susilo (Petani)
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

// User methods
export function getCurrentUser(): User {
  initStorage();
  const currentId = getStored<string>(STORAGE_KEYS.CURRENT_USER_ID, 'user-joko');
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
      name: name || (role === 'petani' ? 'Petani Baru' : 'Pedagang Baru'),
      email: `${newId}@lapaktani.id`,
      role,
      phone,
      location: 'Rembang, Jawa Tengah',
      groupName: role === 'petani' ? 'Kelompok Tani Mitra' : 'Grosir Mandiri',
      verified: true,
      completedTransactionsCount: 0,
      reputation: 5.0,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    setStored(STORAGE_KEYS.USERS, users);
  } else {
    // If logging in, optionally update role if user explicitly switched
    user.role = role;
    setStored(STORAGE_KEYS.USERS, users);
  }
  setCurrentUserId(user.id);
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
  return newProduct;
}

export function updateProductStatus(id: string, status: ProductStatus): void {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx].status = status;
    setStored(STORAGE_KEYS.PRODUCTS, products);
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
    name: 'Pedagang',
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
    location: 'Kebun Blok C, Desa Pedak, Rembang, Jawa Tengah',
    pickupSchedule: 'Esok Hari • 08:00 WIB',
    pickupVehicle: 'Armada Pick-up L300',
    driverName: 'Sopir Ekspedisi Mitra',
    paymentMethod: 'Timbang bersama di lokasi & pembayaran tunai / transfer langsung sesaat setelah muatan terisi.',
  };

  transactions.unshift(newTrx);
  setStored(STORAGE_KEYS.TRANSACTIONS, transactions);

  return newTrx;
}

export function rejectOffer(offerId: string): void {
  const offers = getOffers();
  const offerIdx = offers.findIndex(o => o.id === offerId);
  if (offerIdx !== -1) {
    offers[offerIdx].status = 'ditolak';
    offers[offerIdx].updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.OFFERS, offers);
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

    // If marked as selesai, update product status to 'terjual'
    if (status === 'selesai') {
      updateProductStatus(transactions[idx].productId, 'terjual');

      // Increment farmer completed transaction count
      const users = getAllUsers();
      const farmerIdx = users.findIndex(u => u.id === transactions[idx].farmerId);
      if (farmerIdx !== -1) {
        users[farmerIdx].completedTransactionsCount += 1;
        setStored(STORAGE_KEYS.USERS, users);
      }
    }
  }
}

// Price Information derived strictly from actual transaction data
export function getPriceInfo(commodityKeyword?: string): PriceSummary {
  const transactions = getTransactions();
  const products = getProducts();
  const offers = getOffers();

  // Filter transactions matching commodity
  const targetCommodity = commodityKeyword || 'Cabai Merah Keriting';
  const matchingTrx = transactions.filter(t => 
    t.commodityName.toLowerCase().includes(targetCommodity.toLowerCase()) &&
    (t.status === 'disepakati' || t.status === 'selesai')
  );

  if (matchingTrx.length === 0) {
    return {
      commodityName: targetCommodity,
      averagePrice: 0,
      startingPriceAverage: 0,
      traderOfferMin: 0,
      traderOfferMax: 0,
      lastTransactionPrice: 0,
      lastTransactionTime: '',
      totalVolume: 0,
      totalValue: 0,
      transactionCount: 0,
      hasEnoughData: false,
      transactions: []
    };
  }

  // Calculate actual numbers
  const totalVolume = matchingTrx.reduce((sum, t) => sum + t.quantity, 0);
  const totalValue = matchingTrx.reduce((sum, t) => sum + t.totalValue, 0);
  const averagePrice = Math.round(totalValue / totalVolume);

  // Farmer starting price from relevant active products
  const matchingProds = products.filter(p => p.commodityName.toLowerCase().includes(targetCommodity.toLowerCase()));
  const startingPriceAverage = matchingProds.length > 0 
    ? Math.round(matchingProds.reduce((sum, p) => sum + p.startingPrice, 0) / matchingProds.length)
    : 30000;

  // Trader offers range
  const matchingOffers = offers.filter(o => o.commodityName.toLowerCase().includes(targetCommodity.toLowerCase()));
  const offerPrices = matchingOffers.map(o => o.offeredPrice);
  const traderOfferMin = offerPrices.length > 0 ? Math.min(...offerPrices) : 27000;
  const traderOfferMax = offerPrices.length > 0 ? Math.max(...offerPrices) : 28500;

  const latestTrx = matchingTrx[0];

  return {
    commodityName: targetCommodity,
    averagePrice,
    startingPriceAverage,
    traderOfferMin,
    traderOfferMax,
    lastTransactionPrice: latestTrx.finalPrice,
    lastTransactionTime: latestTrx.transactionDate,
    totalVolume,
    totalValue,
    transactionCount: matchingTrx.length,
    hasEnoughData: matchingTrx.length >= 1,
    transactions: matchingTrx.map(t => ({
      id: t.id,
      date: t.transactionDate.split(',')[0],
      location: t.location,
      volume: t.quantity,
      parties: `${t.farmerName} ↔ ${t.traderName}`,
      price: t.finalPrice
    }))
  };
}

// Community & Posts
export function getCommunities(): Community[] {
  initStorage();
  return getStored<Community[]>(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
}

export function getPosts(communityId?: string): Post[] {
  initStorage();
  const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  if (!communityId || communityId === 'all') return posts;
  return posts.filter(p => p.communityId === communityId);
}

export function createPost(data: Omit<Post, 'id' | 'createdAt' | 'commentsCount' | 'responsesCount'>): Post {
  const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const newPost: Post = {
    ...data,
    id: 'post-' + Date.now(),
    createdAt: 'Baru saja',
    commentsCount: 0,
    responsesCount: 0,
  };
  posts.unshift(newPost);
  setStored(STORAGE_KEYS.POSTS, posts);
  return newPost;
}

export function getComments(postId: string): Comment[] {
  initStorage();
  const comments = getStored<Comment[]>(STORAGE_KEYS.COMMENTS, []);
  return comments.filter(c => c.postId === postId);
}

export function addComment(postId: string, author: User, content: string): Comment {
  const comments = getStored<Comment[]>(STORAGE_KEYS.COMMENTS, []);
  const newComment: Comment = {
    id: 'cmt-' + Date.now(),
    postId,
    authorId: author.id,
    authorName: author.name,
    authorRole: author.role,
    content,
    createdAt: 'Baru saja',
  };
  comments.push(newComment);
  setStored(STORAGE_KEYS.COMMENTS, comments);

  // Increment post comment count
  const posts = getPosts();
  const pIdx = posts.findIndex(p => p.id === postId);
  if (pIdx !== -1) {
    posts[pIdx].commentsCount += 1;
    setStored(STORAGE_KEYS.POSTS, posts);
  }

  return newComment;
}
