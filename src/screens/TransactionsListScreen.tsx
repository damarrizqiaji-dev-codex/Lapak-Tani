import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { getTransactions, getOffersForUser } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { 
  Receipt, 
  Handshake, 
  Gavel, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sprout, 
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const TransactionsListScreen: React.FC = () => {
  const { currentUser, viewTransaction, openRuangNegosiasi } = useApp();
  const [activeSegment, setActiveSegment] = useState<'transaksi' | 'penawaran'>('transaksi');

  const allTransactions = getTransactions().filter(t => 
    currentUser.role === 'petani' ? t.farmerId === currentUser.id : t.traderId === currentUser.id
  );
  const myOffers = getOffersForUser(currentUser.id, currentUser.role);

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. Header Banner */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold text-[#a44a04] bg-[#fff5eb] px-2 py-0.5 rounded-md border border-[#fed7aa] uppercase tracking-wider">
            Akad &amp; Surat Jalan
          </span>
        </div>
        <h1 className="text-[20px] font-extrabold text-[#0f2316] leading-snug">
          Buku Transaksi &amp; Penawaran
        </h1>
        <p className="text-[13px] text-[#52525b] leading-relaxed">
          Catatan resmi seluruh akad jual beli hasil panen, status penimbangan kebun, dan riwayat negosiasi harga.
        </p>
      </section>

      {/* 2. Segment Switcher Tabs */}
      <div className="flex items-center p-1 bg-[#f1f5f2] rounded-2xl border border-[#e2e8f0]">
        <button
          onClick={() => setActiveSegment('transaksi')}
          className={`flex-1 h-10 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'transaksi'
              ? 'bg-white text-[#1e5128] shadow-xs'
              : 'text-[#71717a] hover:text-[#0f2316]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Transaksi Selesai &amp; Akad ({allTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSegment('penawaran')}
          className={`flex-1 h-10 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'penawaran'
              ? 'bg-white text-[#1e5128] shadow-xs'
              : 'text-[#71717a] hover:text-[#0f2316]'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Tawar-Menawar ({myOffers.length})</span>
        </button>
      </div>

      {/* 3. Segment Content */}
      <AnimatePresence mode="wait">
        {activeSegment === 'transaksi' ? (
          <motion.div 
            key="transaksi-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-3"
          >
            {allTransactions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#edf7ed] text-[#1e5128] flex items-center justify-center mx-auto mb-2">
                  <Receipt className="w-6 h-6" />
                </div>
                <p className="text-[14.5px] font-extrabold text-[#0f2316]">Belum ada transaksi final</p>
                <p className="text-[12.5px] text-[#71717a] max-w-sm mx-auto">
                  Transaksi resmi dan surat jalan otomatis tercatat sesaat setelah penawaran di Ruang Negosiasi disepakati kedua belah pihak.
                </p>
              </div>
            ) : (
              allTransactions.map((trx) => {
                const isCompleted = trx.status === 'selesai';
                return (
                  <motion.div
                    key={trx.id}
                    onClick={() => viewTransaction(trx.id)}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] hover:border-[#1e5128]/60 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-mono font-bold text-[#1e5128] bg-[#edf7ed] px-2.5 py-0.5 rounded-md border border-[#c4e1c5]">
                        {trx.transactionCode}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                        isCompleted 
                          ? 'bg-[#edf7ed] text-[#0f3d1e] border-[#c4e1c5]' 
                          : 'bg-[#fff5eb] text-[#8a3800] border-[#fed7aa]'
                      }`}>
                        {isCompleted ? '✓ Selesai & Lunas' : '⏱ Menunggu Timbang'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[16px] font-extrabold text-[#0f2316] leading-snug">
                        {trx.commodityName}
                      </h3>
                      <p className="text-[12.5px] text-[#52525b]">
                        Volume: <strong className="text-[#0f2316]">{trx.quantity.toLocaleString('id-ID')} kg</strong> • {formatRupiah(trx.finalPrice)}/kg
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#e2e8f0] flex items-center justify-between">
                      <div>
                        <span className="text-[10.5px] text-[#71717a] block uppercase font-bold tracking-wider">Total Nilai Akad</span>
                        <span className="text-[17px] font-extrabold text-[#1e5128]">
                          {formatRupiah(trx.totalValue)}
                        </span>
                      </div>

                      <span className="text-[12px] text-[#1e5128] font-extrabold flex items-center gap-1 bg-[#edf7ed] px-3 py-1.5 rounded-xl border border-[#c4e1c5]/60 hover:bg-[#e4ece5]">
                        <span>Buka Surat Jalan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="penawaran-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-3"
          >
            {myOffers.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#fff5eb] text-[#8a3800] flex items-center justify-center mx-auto mb-2">
                  <Gavel className="w-6 h-6" />
                </div>
                <p className="text-[14.5px] font-extrabold text-[#0f2316]">Belum ada penawaran aktif</p>
                <p className="text-[12.5px] text-[#71717a] max-w-sm mx-auto">
                  Tawaran harga dari pedagang atau yang Anda ajukan di etalase pasar akan muncul di sini untuk dinegosiasikan.
                </p>
              </div>
            ) : (
              myOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  onClick={() => openRuangNegosiasi(offer.id)}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] hover:border-[#1e5128]/60 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-extrabold text-[#0f2316] truncate">
                      {offer.commodityName}
                    </span>
                    <span className="bg-[#fff5eb] text-[#8a3800] border border-[#fed7aa] text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0">
                      {offer.status === 'menunggu' ? 'Menunggu Respons' : 'Sesi Negosiasi'}
                    </span>
                  </div>

                  <div className="bg-[#f8faf9] p-3 rounded-xl border border-[#e2e8f0] text-[12.5px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#52525b]">
                        Mitra: <strong className="text-[#0f2316]">{currentUser.role === 'petani' ? offer.traderName : offer.farmerName}</strong>
                      </span>
                      <span className="font-bold text-[#0f2316]">{offer.quantity.toLocaleString('id-ID')} kg</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[#71717a]">Harga Tawaran:</span>
                      <span className="text-[15px] font-extrabold text-[#1e5128]">
                        {formatRupiah(offer.offeredPrice)} /kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#1e5128] font-extrabold pt-0.5">
                    <span>Buka Ruang Negosiasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
