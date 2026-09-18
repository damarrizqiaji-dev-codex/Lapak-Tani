import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, Offer, Transaction, User, Post } from '../types';

export const supabaseService = {
  isReady: isSupabaseConfigured,

  // Products
  async getProducts(): Promise<Product[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
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
      unit: item.unit,
      quality: item.quality,
      startingPrice: Number(item.starting_price),
      location: item.location,
      description: item.description,
      minimumOrder: Number(item.minimum_order),
      packaging: item.packaging,
      moisture: item.moisture,
      harvestDate: item.harvest_date,
      status: item.status,
      createdAt: item.created_at,
    }));
  },

  async insertProduct(product: Product): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('products').insert({
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

    return !error;
  },

  // Transactions
  async getTransactions(): Promise<Transaction[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
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
      platformFee: Number(t.platform_fee),
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
  },

  // Offers
  async getOffers(): Promise<Offer[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
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
      traderLocation: o.trader_location || 'Kudus, Jawa Tengah',
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
  },
};
