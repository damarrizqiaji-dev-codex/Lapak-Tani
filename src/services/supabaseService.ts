import { getSupabaseClient, isSupabaseConfigured, getCustomSupabaseConfig } from '../lib/supabase';
import { Product, Offer, Transaction, User, Post, Negotiation } from '../types';

export const supabaseService = {
  isReady: isSupabaseConfigured,

  async testConnection(): Promise<{ success: boolean; message: string; tablesCount?: number }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'URL atau Public Anon Key Supabase belum diisi atau tidak valid.' };
    }

    try {
      // Test querying profiles or products
      const { data, error } = await client.from('products').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          return {
            success: false,
            message: 'Terkoneksi ke Supabase, namun tabel belum dibuat. Harap jalankan script "supabase/schema.sql" di SQL Editor Supabase Anda.',
          };
        }
        return {
          success: false,
          message: `Koneksi ditolak Supabase: ${error.message} (Periksa Anon Key dan izin RLS).`,
        };
      }
      return {
        success: true,
        message: 'Koneksi ke Supabase Cloud berhasil! Database siap digunakan secara realtime.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal terhubung ke host: ${err?.message || 'Network error'}`,
      };
    }
  },

  // -------------------------------------------------------------
  // PRODUCTS (Hasil Panen)
  // -------------------------------------------------------------
  async getProducts(): Promise<Product[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase getProducts error:', error);
        return null;
      }

      return data.map((item: any) => ({
        id: item.id,
        farmerId: item.farmer_id,
        farmerName: item.farmer_name,
        farmerGroupName: item.farmer_group_name,
        commodityName: item.commodity_name,
        category: item.category,
        photo: item.photo,
        quantity: Number(item.quantity),
        unit: item.unit || 'kg',
        quality: item.quality,
        startingPrice: Number(item.starting_price),
        location: item.location,
        description: item.description,
        minimumOrder: Number(item.minimum_order || 50),
        packaging: item.packaging || 'Krat Plastik',
        moisture: item.moisture || '< 12%',
        harvestDate: item.harvest_date,
        status: item.status,
        createdAt: item.created_at,
      }));
    } catch (e) {
      console.error('getProducts exception:', e);
      return null;
    }
  },

  async insertProduct(product: Product): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('products').insert({
        id: product.id,
        farmer_id: product.farmerId,
        farmer_name: product.farmerName,
        farmer_group_name: product.farmerGroupName,
        commodity_name: product.commodityName,
        category: product.category,
        photo: product.photo,
        quantity: product.quantity,
        unit: product.unit,
        quality: product.quality,
        starting_price: product.startingPrice,
        location: product.location,
        description: product.description,
        minimum_order: product.minimumOrder,
        packaging: product.packaging,
        moisture: product.moisture,
        harvest_date: product.harvestDate,
        status: product.status,
      });

      if (error) {
        console.error('Supabase insertProduct error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('insertProduct exception:', e);
      return false;
    }
  },

  async updateProductStatus(productId: string, status: 'tersedia' | 'dipesan' | 'terjual'): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('products')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', productId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // -------------------------------------------------------------
  // TRANSACTIONS (Akad Kesepakatan)
  // -------------------------------------------------------------
  async getTransactions(): Promise<Transaction[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map((t: any) => ({
        id: t.id,
        offerId: t.offer_id,
        productId: t.product_id,
        transactionCode: t.transaction_code,
        commodityName: t.commodity_name,
        productQuality: t.product_quality,
        farmerId: t.farmer_id,
        farmerName: t.farmer_name,
        farmerGroupName: t.farmer_group_name,
        traderId: t.trader_id,
        traderName: t.trader_name,
        traderBusinessName: t.trader_business_name,
        quantity: Number(t.quantity),
        finalPrice: Number(t.final_price),
        totalValue: Number(t.total_value),
        platformFee: Number(t.platform_fee || 0),
        location: t.location,
        pickupSchedule: t.pickup_schedule,
        pickupVehicle: t.pickup_vehicle,
        driverName: t.driver_name,
        paymentMethod: t.payment_method,
        status: t.status,
        transactionDate: new Date(t.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      }));
    } catch (e) {
      return null;
    }
  },

  async insertTransaction(t: Transaction): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('transactions').insert({
        id: t.id,
        offer_id: t.offerId,
        product_id: t.productId,
        transaction_code: t.transactionCode,
        commodity_name: t.commodityName,
        product_quality: t.productQuality,
        farmer_id: t.farmerId,
        farmer_name: t.farmerName,
        farmer_group_name: t.farmerGroupName,
        trader_id: t.traderId,
        trader_name: t.traderName,
        trader_business_name: t.traderBusinessName,
        quantity: t.quantity,
        final_price: t.finalPrice,
        total_value: t.totalValue,
        location: t.location,
        pickup_schedule: t.pickupSchedule,
        pickup_vehicle: t.pickupVehicle,
        driver_name: t.driverName,
        payment_method: t.paymentMethod,
        status: t.status,
      });

      return !error;
    } catch (e) {
      console.error('insertTransaction error:', e);
      return false;
    }
  },

  async updateTransactionStatus(transactionId: string, status: 'disepakati' | 'proses_timbang' | 'selesai'): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('transactions')
        .update({ status })
        .eq('id', transactionId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // -------------------------------------------------------------
  // OFFERS (Penawaran Harga Masuk)
  // -------------------------------------------------------------
  async getOffers(): Promise<Offer[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map((o: any) => ({
        id: o.id,
        productId: o.product_id,
        commodityName: o.commodity_name,
        productPhoto: o.product_photo,
        traderId: o.trader_id,
        traderName: o.trader_name,
        traderLocation: o.trader_location || 'Pedagang Terverifikasi',
        farmerId: o.farmer_id,
        farmerName: o.farmer_name,
        farmerStartingPrice: Number(o.farmer_starting_price),
        quantity: Number(o.quantity),
        offeredPrice: Number(o.offered_price),
        message: o.message,
        status: o.status,
        createdAt: new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        updatedAt: new Date(o.updated_at || o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }));
    } catch (e) {
      return null;
    }
  },

  async insertOffer(offer: Offer): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('offers').insert({
        id: offer.id,
        product_id: offer.productId,
        commodity_name: offer.commodityName,
        product_photo: offer.productPhoto,
        trader_id: offer.traderId,
        trader_name: offer.traderName,
        farmer_id: offer.farmerId,
        farmer_name: offer.farmerName,
        farmer_starting_price: offer.farmerStartingPrice,
        quantity: offer.quantity,
        offered_price: offer.offeredPrice,
        message: offer.message,
        status: offer.status,
      });
      return !error;
    } catch (e) {
      return false;
    }
  },

  async updateOfferStatus(offerId: string, status: 'menunggu' | 'dinegosiasi' | 'diterima' | 'ditolak'): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('offers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', offerId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // -------------------------------------------------------------
  // PROFILES (Pengguna Petani & Pedagang)
  // -------------------------------------------------------------
  async getProfiles(): Promise<User[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('profiles').select('*');
      if (error || !data) return null;
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email || `${p.id}@lapaktani.id`,
        role: p.role,
        phone: p.phone,
        location: p.location,
        groupName: p.group_name || p.business_name,
        verified: true,
        completedTransactionsCount: p.completed_transactions_count || 0,
        reputation: Number(p.reputation || 5.0),
        createdAt: p.created_at,
      }));
    } catch (e) {
      return null;
    }
  },

  async upsertProfile(user: User): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('profiles').upsert({
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        location: user.location,
        group_name: user.groupName,
        business_name: user.role === 'pedagang' ? user.groupName : null,
        reputation: user.reputation || 5.0,
        completed_transactions_count: user.completedTransactionsCount || 0,
      });
      return !error;
    } catch (e) {
      return false;
    }
  },

  // -------------------------------------------------------------
  // COMMUNITY POSTS
  // -------------------------------------------------------------
  async getCommunityPosts(): Promise<Post[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map((cp: any) => ({
        id: cp.id,
        communityId: cp.community_id,
        authorId: cp.author_id,
        authorName: cp.author_name,
        authorRole: cp.author_role,
        authorLocation: cp.author_location,
        authorAvatarInitials: cp.author_avatar_initials || cp.author_name?.slice(0, 2)?.toUpperCase() || 'LT',
        type: cp.type,
        commodity: cp.commodity,
        content: cp.content,
        createdAt: cp.created_at || new Date().toISOString(),
        responsesCount: cp.responses_count || 0,
        commentsCount: cp.comments_count || 0,
      }));
    } catch (e) {
      return null;
    }
  },

  async insertCommunityPost(post: Post): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('community_posts').insert({
        id: post.id,
        community_id: post.communityId,
        author_id: post.authorId,
        author_name: post.authorName,
        author_role: post.authorRole,
        author_location: post.authorLocation,
        author_avatar_initials: post.authorAvatarInitials,
        type: post.type,
        commodity: post.commodity,
        content: post.content,
        responses_count: post.responsesCount,
        comments_count: post.commentsCount,
      });
      return !error;
    } catch (e) {
      return false;
    }
  },
};
