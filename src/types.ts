export type UserRole = 'petani' | 'pedagang';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  profilePhoto?: string;
  groupName?: string;
  verified: boolean;
  completedTransactionsCount: number;
  reputation: number;
  createdAt: string;
}

export type ProductStatus = 'tersedia' | 'dalam_negosiasi' | 'terjual' | 'tidak_tersedia';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerGroupName?: string;
  farmerAvatar?: string;
  commodityName: string;
  category: 'cabai' | 'bawang' | 'beras' | 'sayuran' | 'palawija' | 'buah';
  photo: string;
  quantity: number; // in unit (e.g. kg)
  unit: string; // e.g. 'kg', 'ton', 'sak'
  quality: string; // e.g. 'Grade A Super', 'Grade A', 'Kering Panen'
  startingPrice: number; // in IDR
  location: string;
  locationDetail?: string;
  description: string;
  status: ProductStatus;
  createdAt: string;
  harvestDate?: string;
  minimumOrder?: number;
  packaging?: string;
  moisture?: string;
}

export type OfferStatus = 'menunggu' | 'dinegosiasi' | 'diterima' | 'ditolak' | 'dibatalkan';

export interface Offer {
  id: string;
  productId: string;
  commodityName: string;
  productPhoto?: string;
  productQuality?: string;
  farmerId: string;
  farmerName: string;
  traderId: string;
  traderName: string;
  traderLocation: string;
  quantity: number;
  offeredPrice: number;
  farmerStartingPrice: number;
  message?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Negotiation {
  id: string;
  offerId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  price: number;
  quantity: number;
  message?: string;
  createdAt: string;
}

export type TransactionStatus = 'disepakati' | 'diproses' | 'selesai' | 'dibatalkan';

export interface Transaction {
  id: string;
  transactionCode: string;
  productId: string;
  commodityName: string;
  productQuality: string;
  farmerId: string;
  farmerName: string;
  farmerGroupName?: string;
  traderId: string;
  traderName: string;
  traderBusinessName?: string;
  offerId: string;
  quantity: number;
  finalPrice: number;
  totalValue: number;
  transactionDate: string;
  status: TransactionStatus;
  location: string;
  pickupSchedule?: string;
  pickupVehicle?: string;
  driverName?: string;
  paymentMethod?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  commodity: string;
  location: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
}

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorLocation: string;
  authorAvatarInitials: string;
  type: 'ketersediaan' | 'kebutuhan';
  commodity: string;
  content: string;
  createdAt: string;
  commentsCount: number;
  responsesCount: number;
  specifications?: {
    label: string;
    value: string;
  }[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface PriceSummary {
  commodityName: string;
  averagePrice: number;
  startingPriceAverage: number;
  traderOfferMin: number;
  traderOfferMax: number;
  lastTransactionPrice: number;
  lastTransactionTime: string;
  totalVolume: number;
  totalValue: number;
  transactionCount: number;
  hasEnoughData: boolean;
  transactions: {
    id: string;
    date: string;
    location: string;
    volume: number;
    parties: string;
    price: number;
  }[];
}
