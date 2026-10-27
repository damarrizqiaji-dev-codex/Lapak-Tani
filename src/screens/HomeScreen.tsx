import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { getOffersForUser, getTransactions, getPriceInfo, acceptOffer, getProducts } from '../services/storage';
import { formatRupiah, formatRupiahShort } from '../utils/formatters';
import { 
  MapPin, 
  Sprout, 
  PlusCircle, 
  Gavel, 
  Handshake, 
  Receipt, 
  Store, 
  ArrowRight, 
  Check, 
  MessageSquare, 
  Info, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingDown,
  ShoppingBag,
  Calculator,
  Repeat,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  Truck,
  CheckCircle2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { 
  getStoredRealtimePrices, 
  syncRealtimeMarketPrices, 
  RealtimeCommodityPrice 
} from '../services/marketPriceService';

export const HomeScreen: React.FC = () => {
  const { 
    currentUser, 
    openAddHarvest, 
    openRuangNegosiasi, 
    goToTab, 
    viewTransaction,
    openCalculator,
    openGuide,
    switchUserRole,
    showToast,
    refreshAll 
  } = useApp();

  const [isWorkflowExpanded, setIsWorkflowExpanded] = useState<boolean>(true);
  const [isEduExpanded, setIsEduExpanded] = useState<boolean>(false);

  const userOffers = getOffersForUser(currentUser.id, currentUser.role);
  const activeOffers = userOffers.filter(o => o.status === 'menunggu' || o.status === 'dinegosiasi');
  const transactions = getTransactions().filter(t => 
    currentUser.role === 'petani' ? t.farmerId === currentUser.id : t.traderId === currentUser.id
  );
  const completedTransactions = transactions.filter(t => t.status === 'selesai' || t.status === 'disepakati');
  const totalCompletedValue = completedTransactions.reduce((acc, curr) => acc + curr.totalValue, 0);

  // Perhitungan dinamis komoditas dan panen aktif dari database
  const allProducts = getProducts();
  const farmerProducts = allProducts.filter(p => p.farmerId === currentUser.id);
  const activeFarmerProducts = farmerProducts.filter(p => p.status === 'tersedia');
  
  const myCommodityNames = Array.from(new Set(activeFarmerProducts.map(p => p.commodityName)));
  const commoditySummaryLabel = myCommodityNames.length > 0
    ? myCommodityNames.slice(0, 3).join(', ')
    : 'Belum ada panen dipasang';

  // Price tickers from actual platform calculations & real-time internet service
  const [realtimePrices, setRealtimePrices] = useState<RealtimeCommodityPrice[]>(() => getStoredRealtimePrices());
  const [priceTier, setPriceTier] = useState<'produsen' | 'grosir' | 'eceran'>('produsen');
  const [isSyncingPrices, setIsSyncingPrices] = useState(false);
  const [lastSyncStr, setLastSyncStr] = useState<string>('Hari ini • BAPANAS Live');

  const handleSyncPrices = async () => {
    setIsSyncingPrices(true);
    try {
      const res = await syncRealtimeMarketPrices();
      setRealtimePrices(res.prices);
      setLastSyncStr('Baru saja disinkronkan');
      showToast('Data harga komoditas pangan berhasil diperbarui dari internet!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal menyinkronkan data harga dari internet.', 'warning');
    } finally {
      setIsSyncingPrices(false);
    }
  };

  const handleQuickAccept = (offerId: string) => {
    try {
      const newTrx = acceptOffer(offerId);
      refreshAll();
      showToast('Penawaran berhasil disetujui! Transaksi telah dibuat.', 'success');
      viewTransaction(newTrx.id);
    } catch (e) {
      console.error(e);
      showToast('Gagal menyetujui penawaran.', 'warning');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. User Greeting & Context Banner with Role Switcher */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] flex flex-col gap-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[#a44a04] text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                Pasar Pangan Mandiri
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1e5128]"></span>
              <span className="text-[10.5px] sm:text-[11px] text-[#64748b] font-medium">Musim Panen Raya</span>
            </div>
            <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#0f2316] leading-tight tracking-tight">
              Halo, {currentUser.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[#52525b] text-[12.5px] sm:text-[13px]">
              <MapPin className="w-3.5 h-3.5 text-[#1e5128] shrink-0" />
              <span className="truncate">{currentUser.location}</span>
              {currentUser.groupName && (
                <span className="bg-[#f1f5f2] text-[#1e5128] font-semibold text-[10.5px] sm:text-[11px] px-2 py-0.5 rounded-md shrink-0 truncate max-w-[140px]">
                  {currentUser.groupName}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Role Switcher Pill */}
          <button
            onClick={() => switchUserRole(currentUser.role === 'petani' ? 'pedagang' : 'petani')}
            title="Klik untuk beralih mode"
            className={`px-3 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-2 shrink-0 border transition-all cursor-pointer active:scale-95 shadow-xs ${
              currentUser.role === 'petani' 
                ? 'bg-[#edf7ed] text-[#0f3d1e] border-[#c4e1c5] hover:bg-[#e2f2e3]' 
                : 'bg-[#fff5eb] text-[#8a3800] border-[#fed7aa] hover:bg-[#ffedd5]'
            }`}
          >
            <div className="flex items-center gap-2">
              {currentUser.role === 'petani' ? (
                <Sprout className="w-4.5 h-4.5 text-[#1e5128] shrink-0" />
              ) : (
                <Store className="w-4.5 h-4.5 text-[#a44a04] shrink-0" />
              )}
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider font-bold opacity-75">Peran Aktif</div>
                <div className="text-[12px] font-bold capitalize leading-none">
                  {currentUser.role === 'petani' ? 'Petani (Produsen)' : 'Pedagang (Grosir)'}
                </div>
              </div>
            </div>
            <Repeat className="w-4 h-4 opacity-70 ml-2 shrink-0" />
          </button>
        </div>

        {/* Quick Context Hint */}
        <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e2e8f0]/60 flex items-center justify-between gap-2 text-[12px] text-[#52525b]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1e5128] shrink-0" />
            <span>
              {currentUser.role === 'petani'
                ? 'Mode Petani: Anda dapat memajang hasil panen & menanggapi tawaran harga.'
                : 'Mode Pedagang: Anda dapat menawar komoditas grosir langsung di lahan.'}
            </span>
          </div>
        </div>
      </motion.section>

      {/* 2. Interactive Quick Action Ribbon */}
      <div className="grid grid-cols-2 gap-2.5">
        {currentUser.role === 'petani' ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={openAddHarvest}
            className="p-3.5 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white flex items-center justify-between gap-2 shadow-xs transition-colors cursor-pointer text-left"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-[#b8f1b9] block">Aksi Utama</span>
              <span className="text-[14px] font-bold block leading-tight">+ Pasang Panen</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => goToTab('pasar')}
            className="p-3.5 rounded-xl bg-[#a44a04] hover:bg-[#853c03] text-white flex items-center justify-between gap-2 shadow-xs transition-colors cursor-pointer text-left"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-[#ffdcc3] block">Jelajah Pasar</span>
              <span className="text-[14px] font-bold block leading-tight">Cari Komoditas</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        )}

        {/* Interactive Calculator Quick Launch */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={openCalculator}
          className="p-3.5 rounded-xl bg-white hover:bg-[#f8faf9] border border-[#e2e8f0] text-[#0f2316] flex items-center justify-between gap-2 shadow-xs transition-colors cursor-pointer text-left"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-[#1e5128] block">Alat Bantu</span>
            <span className="text-[14px] font-bold block leading-tight">Simulasi Margin</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#edf7ed] flex items-center justify-center shrink-0 text-[#1e5128]">
            <Calculator className="w-4.5 h-4.5" />
          </div>
        </motion.button>
      </div>

      {/* 2.5 Visual Interactive Workflow Stepper (Alur Mudah 4 Langkah) */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#edf7ed] text-[#1e5128] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[13.5px] font-extrabold text-[#0f2316] leading-tight">
                Alur Praktis Transaksi Lapak Tani
              </h3>
              <p className="text-[11px] text-[#64748b]">
                Jual-beli langsung produsen &amp; pedagang tanpa calo
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}
            className="text-[11.5px] font-bold text-[#1e5128] flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>{isWorkflowExpanded ? 'Ringkas' : 'Rincian'}</span>
            {isWorkflowExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 4 Mini Stepper Steps */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <div className="bg-[#f8faf9] p-2 sm:p-2.5 rounded-xl border border-[#e2e8f0]/70 text-center space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#1e5128] text-white text-[10px] font-extrabold mx-auto flex items-center justify-center">
              1
            </div>
            <span className="text-[11px] font-bold text-[#0f2316] block leading-tight">
              Pajang Panen
            </span>
            <span className="text-[9.5px] text-[#64748b] hidden sm:block">Foto &amp; tonase lahan</span>
          </div>

          <div className="bg-[#f8faf9] p-2 sm:p-2.5 rounded-xl border border-[#e2e8f0]/70 text-center space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#a44a04] text-white text-[10px] font-extrabold mx-auto flex items-center justify-center">
              2
            </div>
            <span className="text-[11px] font-bold text-[#0f2316] block leading-tight">
              Tawar Terbuka
            </span>
            <span className="text-[9.5px] text-[#64748b] hidden sm:block">Negosiasi langsung</span>
          </div>

          <div className="bg-[#f8faf9] p-2 sm:p-2.5 rounded-xl border border-[#e2e8f0]/70 text-center space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#1e5128] text-white text-[10px] font-extrabold mx-auto flex items-center justify-center">
              3
            </div>
            <span className="text-[11px] font-bold text-[#0f2316] block leading-tight">
              Akad Digital
            </span>
            <span className="text-[9.5px] text-[#64748b] hidden sm:block">Nota &amp; Surat Jalan</span>
          </div>

          <div className="bg-[#f8faf9] p-2 sm:p-2.5 rounded-xl border border-[#e2e8f0]/70 text-center space-y-1">
            <div className="w-6 h-6 rounded-full bg-[#0f2316] text-white text-[10px] font-extrabold mx-auto flex items-center justify-center">
              4
            </div>
            <span className="text-[11px] font-bold text-[#0f2316] block leading-tight">
              Timbang Kebun
            </span>
            <span className="text-[9.5px] text-[#64748b] hidden sm:block">Bebas potongan calo</span>
          </div>
        </div>

        <AnimatePresence>
          {isWorkflowExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-1 overflow-hidden"
            >
              <div className="bg-[#edf7ed] p-2.5 rounded-xl border border-[#c4e1c5] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11.5px] text-[#0f3d1e]">
                  <CheckCircle2 className="w-4 h-4 text-[#1e5128] shrink-0" />
                  <span>
                    Semua transaksi tercatat rapi, timbangan transparan, dan tidak ada biaya komisi makelar.
                  </span>
                </div>
                <button
                  onClick={openGuide}
                  className="px-2.5 py-1 rounded-lg bg-[#1e5128] text-white text-[11px] font-bold shrink-0 hover:bg-[#163f1f] cursor-pointer"
                >
                  Buka Panduan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Summary Metrics Grid (2x2) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-[15px] font-extrabold text-[#0f2316]">
            {currentUser.role === 'petani' ? 'Ringkasan Aktivitas Kebun' : 'Ringkasan Aktivitas Pedagang'}
          </h3>
          <span className="text-[11px] text-[#64748b] font-medium">Bulan Berjalan</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1 */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#52525b] font-medium">
                {currentUser.role === 'petani' ? 'Panen Aktif' : 'Tawaran Saya'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#edf7ed] flex items-center justify-center text-[#1e5128]">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-[22px] text-[#0f2316] font-extrabold">
                {currentUser.role === 'petani' ? activeFarmerProducts.length : activeOffers.length}
              </span>
              <span className="text-[13px] text-[#64748b] ml-1">
                {currentUser.role === 'petani' ? 'Komoditas' : 'Pengajuan'}
              </span>
            </div>
            <div className="bg-[#f8faf9] px-2 py-1 rounded-md">
              <p className="text-[11px] text-[#52525b] font-semibold truncate">
                {currentUser.role === 'petani' 
                  ? commoditySummaryLabel 
                  : (activeOffers.length > 0 ? `${activeOffers.length} Sedang Berjalan` : 'Belum ada tawaran')}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#52525b] font-medium">
                {currentUser.role === 'petani' ? 'Tawaran Masuk' : 'Dalam Negosiasi'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#fff5eb] flex items-center justify-center text-[#a44a04]">
                <Gavel className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-[22px] text-[#a44a04] font-extrabold">
                {activeOffers.length}
              </span>
              <span className="text-[13px] text-[#64748b] ml-1">Permintaan</span>
            </div>
            <div className={`px-2 py-1 rounded-md flex items-center gap-1 ${
              activeOffers.length > 0 
                ? 'bg-[#fff5eb] text-[#8a3800]' 
                : 'bg-[#f8faf9] text-[#71717a]'
            }`}>
              {activeOffers.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#a44a04]"></span>}
              <span className="text-[11px] font-bold truncate">
                {activeOffers.length > 0 ? 'Menunggu Respons' : 'Tidak Ada Antrean'}
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#52525b] font-medium">Disepakati</span>
              <div className="w-7 h-7 rounded-lg bg-[#edf7ed] flex items-center justify-center text-[#1e5128]">
                <Handshake className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-[22px] text-[#0f2316] font-extrabold">
                {completedTransactions.length}
              </span>
              <span className="text-[13px] text-[#64748b] ml-1">Selesai</span>
            </div>
            <div className="bg-[#f8faf9] px-2 py-1 rounded-md">
              <p className="text-[11px] text-[#1e5128] font-semibold">
                {completedTransactions.length > 0 ? 'Timbang Valid' : 'Belum Ada Transaksi'}
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e2e8f0] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#52525b] font-medium">Nilai Transaksi</span>
              <div className="w-7 h-7 rounded-lg bg-[#edf7ed] flex items-center justify-center text-[#1e5128]">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] text-[#64748b] block">Total Akad</span>
              <div className="text-[18px] text-[#1e5128] leading-tight font-extrabold">
                {totalCompletedValue > 0 ? formatRupiahShort(totalCompletedValue) : 'Rp 0'}
              </div>
            </div>
            <div className="bg-[#f8faf9] px-2 py-1 rounded-md">
              <p className="text-[11px] text-[#52525b] truncate font-medium">
                {completedTransactions.length > 0 ? `${completedTransactions.length} Nota Penjualan` : '0 Nota Penjualan'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Penawaran Masuk / Aktif Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[15px] font-extrabold text-[#0f2316]">
              {currentUser.role === 'petani' ? 'Penawaran Masuk' : 'Tawaran Aktif Saya'}
            </h3>
            {activeOffers.length > 0 && (
              <span className="bg-[#fe932c] text-[#663500] text-[11px] px-2 py-0.5 rounded-full font-bold">
                {activeOffers.length} Baru
              </span>
            )}
          </div>
          <button
            onClick={() => goToTab('transaksi')}
            className="text-[12px] font-bold text-[#1e5128] hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        {activeOffers.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] text-center space-y-1">
            <p className="text-[14px] font-semibold text-[#0f2316]">
              {currentUser.role === 'petani' 
                ? 'Belum ada penawaran harga masuk dari pedagang.' 
                : 'Belum ada negosiasi harga yang sedang aktif.'}
            </p>
            <p className="text-[12px] text-[#64748b]">
              {currentUser.role === 'petani'
                ? 'Penawaran dari pedagang akan muncul di sini saat komoditas panen Anda ditawar.'
                : 'Kunjungi Pasar Grosir dan ajukan harga beli pertama Anda ke petani.'}
            </p>
            {currentUser.role === 'pedagang' && (
              <button
                onClick={() => goToTab('pasar')}
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#a44a04] hover:underline"
              >
                <span>Buka Katalog Pasar Panen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          activeOffers.map((offer) => {
            const isCabai = offer.commodityName.toLowerCase().includes('cabai') || offer.commodityName.toLowerCase().includes('rawit');
            const isBawang = offer.commodityName.toLowerCase().includes('bawang');
            const isJagung = offer.commodityName.toLowerCase().includes('jagung');
            const diff = offer.farmerStartingPrice > 0 
              ? Math.round(((offer.offeredPrice - offer.farmerStartingPrice) / offer.farmerStartingPrice) * 100)
              : 0;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] space-y-3 hover:border-[#1e5128]/30 transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isCabai ? 'bg-[#fee2e2] text-[#dc2626]' :
                      isBawang ? 'bg-[#fff5eb] text-[#a44a04]' :
                      isJagung ? 'bg-[#fef9c3] text-[#854d0e]' :
                      'bg-[#edf7ed] text-[#1e5128]'
                    }`}>
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[15px] font-bold text-[#0f2316] leading-snug truncate">
                          {offer.commodityName}
                        </h4>
                        {offer.productQuality && (
                          <span className="text-[10px] bg-[#f1f5f2] text-[#1e5128] font-extrabold px-1.5 py-0.5 rounded">
                            {offer.productQuality}
                          </span>
                        )}
                      </div>
                      <p className="text-[12.5px] text-[#52525b]">
                        Volume Panen: <strong className="text-[#0f2316] font-semibold">{offer.quantity.toLocaleString('id-ID')} kg</strong>
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#fff5eb] text-[#8a3800] border border-[#fed7aa] px-2 py-1 rounded-md text-[11px] font-bold shrink-0">
                    {offer.status === 'menunggu' ? 'Menunggu Tanggapan' : 'Negosiasi'}
                  </span>
                </div>

                {/* Trader Snippet */}
                <div className="bg-[#f8faf9] p-3 rounded-xl space-y-2 border border-[#e2e8f0]/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-[#52525b]" />
                      <span className="text-[13px] font-bold text-[#0f2316]">
                        {currentUser.role === 'petani' ? offer.traderName : `Petani: ${offer.farmerName}`}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-[#64748b]">{offer.traderLocation}</span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-[#e2e8f0]/40">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-[#64748b] block">Harga Pembuka Petani</span>
                      <span className="text-[13px] text-[#71717a] line-through">
                        {formatRupiah(offer.farmerStartingPrice)} /kg
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[11px] text-[#a44a04] font-bold block">
                          Tawaran Masuk:
                        </span>
                        {diff !== 0 && (
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                            diff > 0 
                              ? 'bg-[#edf7ed] text-[#1e5128]' 
                              : 'bg-[#fff5eb] text-[#a44a04]'
                          }`}>
                            {diff > 0 ? `+${diff}%` : `${diff}%`}
                          </span>
                        )}
                      </div>
                      <span className="text-[18px] font-extrabold text-[#1e5128]">
                        {formatRupiah(offer.offeredPrice)}{' '}
                        <span className="text-[12px] font-normal text-[#64748b]">/kg</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {currentUser.role === 'petani' ? (
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      onClick={() => openRuangNegosiasi(offer.id)}
                      className="min-h-[44px] bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#0f2316] font-semibold text-[13px] rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#1e5128]" />
                      <span>Ruang Tawar</span>
                    </button>
                    <button
                      onClick={() => handleQuickAccept(offer.id)}
                      className="min-h-[44px] bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Setujui Harga</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openRuangNegosiasi(offer.id)}
                    className="w-full min-h-[44px] bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Lihat Rincian Negosiasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })
        )}
      </section>

      {/* 5. Market Price Info Widget with Realtime Internet Integration */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#1e5128]" />
              <h3 className="text-[15px] font-extrabold text-[#0f2316]">Harga Pasar Real-time</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1e5128] bg-[#edf7ed] px-2 py-0.5 rounded-md border border-[#c4e1c5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e5128] animate-pulse"></span>
                <span>Internet Live</span>
              </span>
              <button
                onClick={handleSyncPrices}
                disabled={isSyncingPrices}
                title="Sinkronisasi harga internet terkini"
                className="p-1 rounded-md text-[#1e5128] hover:bg-[#edf7ed] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingPrices ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Source Attribution Note */}
          <div className="bg-[#f8faf9] p-2.5 rounded-lg flex items-start gap-1.5 border border-[#e2e8f0]/80">
            <Info className="w-4 h-4 text-[#a44a04] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-[#52525b] leading-snug">
              Data terintegrasi <strong>Panel Harga Badan Pangan Nasional (BAPANAS)</strong> &amp; <strong>SP2KP Kemendag</strong> ({lastSyncStr}).
            </p>
          </div>

          {/* Tier Selector: Petani / Grosir / Eceran */}
          <div className="flex items-center p-1 bg-[#f1f5f2] rounded-xl border border-[#e2e8f0] text-[11px] font-bold">
            <button
              onClick={() => setPriceTier('produsen')}
              className={`flex-1 min-h-[34px] py-1 px-1 rounded-lg transition-all cursor-pointer text-center ${
                priceTier === 'produsen'
                  ? 'bg-white text-[#1e5128] shadow-2xs font-extrabold'
                  : 'text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              <span className="hidden xs:inline">Tingkat </span>Petani
            </button>
            <button
              onClick={() => setPriceTier('grosir')}
              className={`flex-1 min-h-[34px] py-1 px-1 rounded-lg transition-all cursor-pointer text-center ${
                priceTier === 'grosir'
                  ? 'bg-white text-[#1e5128] shadow-2xs font-extrabold'
                  : 'text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              Pasar Grosir
            </button>
            <button
              onClick={() => setPriceTier('eceran')}
              className={`flex-1 min-h-[34px] py-1 px-1 rounded-lg transition-all cursor-pointer text-center ${
                priceTier === 'eceran'
                  ? 'bg-white text-[#1e5128] shadow-2xs font-extrabold'
                  : 'text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              Eceran<span className="hidden xs:inline"> Konsumen</span>
            </button>
          </div>
        </div>

        {/* Realtime Price Ticker Rows */}
        <div className="space-y-1.5 divide-y divide-[#e2e8f0]/60">
          {realtimePrices.slice(0, 5).map((commodity) => {
            const currentPrice = priceTier === 'produsen' 
              ? commodity.producerPrice 
              : priceTier === 'grosir' 
                ? commodity.wholesalePrice 
                : commodity.consumerPrice;

            const isUp = commodity.trend === 'up';
            const isDown = commodity.trend === 'down';

            const dotColor = commodity.category === 'cabai' 
              ? 'bg-[#dc2626]' 
              : commodity.category === 'bawang' 
                ? 'bg-[#ea580c]' 
                : commodity.category === 'palawija' 
                  ? 'bg-[#eab308]' 
                  : 'bg-[#16a34a]';

            return (
              <div key={commodity.id} className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`}></span>
                  <div className="min-w-0">
                    <span className="text-[13px] font-bold text-[#0f2316] block truncate">
                      {commodity.name}
                    </span>
                    <span className="text-[11px] text-[#64748b] block truncate">
                      {commodity.primaryLocation} • {commodity.qualityStandard}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#0f2316] leading-tight">
                      {formatRupiah(currentPrice)}
                      <span className="text-[11px] font-normal text-[#64748b]"> /{commodity.unit}</span>
                    </div>
                    <div className="flex items-center justify-end gap-0.5 text-[10.5px] font-bold">
                      {isUp && (
                        <span className="text-[#1e5128] flex items-center">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>+{commodity.changePercent}%</span>
                        </span>
                      )}
                      {isDown && (
                        <span className="text-[#a44a04] flex items-center">
                          <ArrowDownRight className="w-3 h-3" />
                          <span>{commodity.changePercent}%</span>
                        </span>
                      )}
                      {!isUp && !isDown && (
                        <span className="text-[#71717a] flex items-center">
                          <Minus className="w-3 h-3" />
                          <span>Stabil (0%)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={openCalculator}
                    title={`Hitung simulasi ${commodity.name}`}
                    className="p-1.5 rounded-lg bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#1e5128] text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Simulasi</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to Full Price Center */}
        <button
          onClick={() => goToTab('harga')}
          className="w-full min-h-[44px] bg-[#f8faf9] hover:bg-[#edf7ed] text-[#1e5128] font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 border border-[#e2e8f0] transition-colors cursor-pointer mt-1"
        >
          <span>Buka Pusat Informasi Harga Komprehensif</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 6. Edukasi & Jaminan Transaksi Adil (Accordion) */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#fff5eb] text-[#a44a04] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[14px] font-extrabold text-[#0f2316]">
                Kenapa Lapak Tani Bebas Potongan Calo?
              </h3>
              <p className="text-[11.5px] text-[#64748b]">
                Standar timbang kebun &amp; komitmen transaksi transparan
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEduExpanded(!isEduExpanded)}
            className="text-[11.5px] font-bold text-[#1e5128] flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>{isEduExpanded ? 'Tutup' : 'Pelajari'}</span>
            {isEduExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {isEduExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-1 border-t border-[#e2e8f0]/60 overflow-hidden text-[12px] text-[#52525b]"
            >
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-[#e2e8f0]/60 space-y-1">
                <span className="font-bold text-[#0f2316] block">1. Timbang Bersama di Lahan</span>
                <p>
                  Kedua belah pihak wajib menyaksikan langsung proses penimbangan tonase menggunakan timbangan bersertifikasi atau terkalibrasi.
                </p>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-[#e2e8f0]/60 space-y-1">
                <span className="font-bold text-[#0f2316] block">2. Nota Digital &amp; Batas Toleransi Susut</span>
                <p>
                  Seluruh angka tonase riil tercatat dalam Nota Digital, dilengkapi tanda tangan basah/digital sehingga tidak ada pemotongan sepihak setelah truk jalan.
                </p>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-[#e2e8f0]/60 space-y-1">
                <span className="font-bold text-[#0f2316] block">3. 100% Bebas Biaya Makelar</span>
                <p>
                  Platform tidak memungut komisi persentase apa pun. Pendapatan murni masuk ke petani, dan pedagang memperoleh harga tangan pertama.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

