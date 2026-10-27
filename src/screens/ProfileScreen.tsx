import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { getProducts, getTransactions, getOffersForUser } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  User, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ArrowLeftRight, 
  PlusCircle, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  Sprout,
  Store,
  ExternalLink,
  Award,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Truck,
  Database
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole, 
    openAddHarvest, 
    viewProduct, 
    logout,
    openRuangNegosiasi,
    goToTab,
    openCalculator,
    showToast,
    openDatabaseModal,
    isSupabaseLive
  } = useApp();

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const isPetani = currentUser.role === 'petani';
  const products = getProducts().filter(p => p.farmerId === currentUser.id);
  const myOffers = getOffersForUser(currentUser.id, currentUser.role);

  const handleRoleToggle = () => {
    const nextRole = isPetani ? 'pedagang' : 'petani';
    switchUserRole(nextRole);
    showToast(`Beralih ke mode ${nextRole === 'petani' ? 'Petani (Produsen)' : 'Pedagang (Pengepul)'}`, 'info');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. Profile Header Card with distinct role badge & color */}
      <section className={`p-4.5 rounded-2xl shadow-xs border space-y-3.5 ${
        isPetani ? 'bg-white border-[#e2e8f0]' : 'bg-white border-[#fed7aa]/70'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-[18px] shrink-0 shadow-2xs ${
            isPetani 
              ? 'bg-[#edf7ed] text-[#0f3d1e] border border-[#c4e1c5]' 
              : 'bg-[#fff5eb] text-[#8a3800] border border-[#fed7aa]'
          }`}>
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[18px] font-extrabold text-[#0f2316] truncate">
                {currentUser.name}
              </h1>
              <ShieldCheck className={`w-4 h-4 ${isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]'} shrink-0`} />
            </div>
            <div className="flex items-center gap-1 text-[12px] text-[#52525b]">
              <MapPin className={`w-3.5 h-3.5 ${isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]'} shrink-0`} />
              <span className="truncate">{currentUser.location}</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border inline-block ${
                isPetani 
                  ? 'text-[#1e5128] bg-[#edf7ed] border-[#c4e1c5]/70' 
                  : 'text-[#8a3800] bg-[#fff5eb] border-[#fed7aa]'
              }`}>
                {isPetani ? 'Poktan / Petani Kebun' : 'Pedagang / Pengepul Pasar'}
              </span>
              {currentUser.groupName && (
                <span className="text-[11px] font-medium text-[#52525b] bg-[#f8faf9] px-2 py-0.5 rounded-md border border-[#e2e8f0] truncate max-w-[150px]">
                  {currentUser.groupName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Phone & Mode Switcher */}
        <div className="pt-3 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-1.5 text-[#52525b]">
            <Phone className={`w-3.5 h-3.5 ${isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]'}`} />
            <span className="font-semibold text-[#0f2316]">{currentUser.phone}</span>
          </div>

          <button
            onClick={handleRoleToggle}
            className={`flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl border font-bold text-[12px] cursor-pointer transition-all active:scale-95 shadow-2xs ${
              isPetani 
                ? 'bg-[#fff5eb] text-[#8a3800] border-[#fed7aa] hover:bg-[#ffedd5]' 
                : 'bg-[#edf7ed] text-[#0f3d1e] border-[#c4e1c5] hover:bg-[#e2f2e3]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Ganti ke Mode {isPetani ? 'Pedagang' : 'Petani'}</span>
          </button>
        </div>
      </section>

      {/* 2. Rekapitulasi 4 Cards Differentiated */}
      <section className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-1">
          <span className="text-[11px] text-[#71717a] font-medium">Transaksi Selesai</span>
          <div className="text-[20px] font-extrabold text-[#0f2316]">
            {currentUser.completedTransactionsCount}x
          </div>
          <span className="text-[10px] text-[#1e5128] font-bold bg-[#edf7ed] px-2 py-0.5 rounded-md border border-[#c4e1c5]/60 inline-block">
            {isPetani ? 'Panen Terjual' : 'Pasokan Terbeli'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-1">
          <span className="text-[11px] text-[#71717a] font-medium">Reputasi Akun</span>
          <div className="text-[20px] font-extrabold text-[#a44a04]">
            ⭐ {currentUser.reputation}
          </div>
          <span className="text-[10px] text-[#71717a]">Skala 5.0 Akurasi Mutu</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-1">
          <span className="text-[11px] text-[#71717a] font-medium">
            {isPetani ? 'Lapak Terpasang' : 'Tawaran Diajukan'}
          </span>
          <div className="text-[20px] font-extrabold text-[#0f2316]">
            {isPetani ? products.length : myOffers.length}
          </div>
          <span className="text-[10px] text-[#71717a]">
            {isPetani ? 'Komoditas Kebun' : 'Pengajuan Harga'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-1">
          <span className="text-[11px] text-[#71717a] font-medium">Integritas Timbang</span>
          <div className="text-[20px] font-extrabold text-[#1e5128]">
            100%
          </div>
          <span className="text-[10px] text-[#71717a]">Timbang Terbuka di Lahan</span>
        </div>
      </section>

      {/* 3A. ROLE: PETANI VIEW -> "Hasil Panen Saya" */}
      {isPetani && (
        <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#0f2316]">Hasil Panen di Lapak Anda</h2>
              <p className="text-[11.5px] text-[#64748b]">Kelola stok panen yang siap ditawar pedagang.</p>
            </div>
            <button
              onClick={openAddHarvest}
              className="text-[12px] font-bold text-[#1e5128] flex items-center gap-1 hover:underline cursor-pointer bg-[#edf7ed] px-2.5 py-1 rounded-lg border border-[#c4e1c5]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Pasang Panen</span>
            </button>
          </div>

          <div className="space-y-2.5 divide-y divide-[#e2e8f0]/60">
            {products.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-[13px] text-[#71717a]">Belum ada panen yang terpasang.</p>
                <button
                  onClick={openAddHarvest}
                  className="px-3 py-1.5 rounded-lg bg-[#1e5128] text-white text-[12px] font-bold"
                >
                  Pasang Panen Sekarang
                </button>
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[13.5px] font-bold text-[#0f2316] block truncate">
                      {p.commodityName}
                    </span>
                    <p className="text-[11.5px] text-[#52525b]">
                      Stok: <strong>{p.quantity.toLocaleString('id-ID')} {p.unit}</strong> • {formatRupiah(p.startingPrice)}/{p.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => viewProduct(p.id)}
                      className="h-8 px-2.5 rounded-lg bg-[#f8faf9] hover:bg-[#f1f5f2] border border-[#e2e8f0] text-[#0f2316] text-[11px] font-bold cursor-pointer"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => {
                        const relatedOffer = myOffers.find(o => o.productId === p.id);
                        if (relatedOffer) {
                          openRuangNegosiasi(relatedOffer.id);
                        } else {
                          goToTab('transaksi');
                        }
                      }}
                      className="h-8 px-2.5 rounded-lg bg-[#1e5128] text-white text-[11px] font-bold shadow-2xs cursor-pointer"
                    >
                      Tawaran Masuk
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* 3B. ROLE: PEDAGANG VIEW -> "Aktivitas Pengadaan & Penawaran Saya" */}
      {!isPetani && (
        <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#fed7aa] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#8a3800]">Tawaran Pembelian Saya</h2>
              <p className="text-[11.5px] text-[#64748b]">Pantau status negosiasi harga dengan para petani.</p>
            </div>
            <button
              onClick={() => goToTab('pasar')}
              className="text-[12px] font-bold text-[#a44a04] flex items-center gap-1 hover:underline cursor-pointer bg-[#fff5eb] px-2.5 py-1 rounded-lg border border-[#fed7aa]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cari Komoditas</span>
            </button>
          </div>

          <div className="space-y-2.5 divide-y divide-[#e2e8f0]/60">
            {myOffers.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-[13px] text-[#71717a]">Belum ada penawaran harga yang Anda ajukan.</p>
                <button
                  onClick={() => goToTab('pasar')}
                  className="px-3 py-1.5 rounded-lg bg-[#a44a04] text-white text-[12px] font-bold"
                >
                  Jelajahi Pasar Panen
                </button>
              </div>
            ) : (
              myOffers.map((offer) => (
                <div key={offer.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[13.5px] font-bold text-[#0f2316] block truncate">
                      {offer.commodityName} ({offer.quantity} kg)
                    </span>
                    <p className="text-[11.5px] text-[#52525b]">
                      Petani: <strong>{offer.farmerName}</strong> • Tawaran Anda: <strong className="text-[#a44a04]">{formatRupiah(offer.offeredPrice)}/kg</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openRuangNegosiasi(offer.id)}
                      className="h-8 px-2.5 rounded-lg bg-[#a44a04] hover:bg-[#853c03] text-white text-[11px] font-bold shadow-2xs cursor-pointer"
                    >
                      Buka Negosiasi
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* 4. Menu Operasional & Bantuan */}
      <section className="bg-white rounded-2xl shadow-xs border border-[#e2e8f0] overflow-hidden divide-y divide-[#e2e8f0]">
        {!isPetani && (
          <button
            onClick={openCalculator}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#f8faf9] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#a44a04]" />
              <div>
                <span className="text-[13px] font-bold text-[#0f2316] block">
                  Simulasi Margin Muatan &amp; Armada Angkut
                </span>
                <span className="text-[11px] text-[#64748b]">Hitung tonase, susut perjalanan, dan estimasi keuntungan bersih.</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a1a1aa]" />
          </button>
        )}

        {/* Cloud Database Integration */}
        <button
          onClick={openDatabaseModal}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#f8faf9] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-[#0f2316]">
                  Koneksi Database Cloud (Supabase)
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  isSupabaseLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSupabaseLive ? 'Live Aktif' : 'Perlu Kunci'}
                </span>
              </div>
              <span className="text-[11px] text-[#64748b]">
                Sinkronkan data hasil panen, penawaran harga, &amp; akad transaksi secara langsung.
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#a1a1aa]" />
        </button>

        <button
          onClick={() => showToast(isPetani ? 'Data Kelompok Tani telah terverifikasi.' : 'Profil usaha pedagang terverifikasi aktif.', 'success')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#f8faf9] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]'}`} />
            <span className="text-[13px] font-bold text-[#0f2316]">
              {isPetani ? 'Data Kelompok Tani / Sertifikasi Lahan' : 'Data Izin Usaha & Wilayah Operasional'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#a1a1aa]" />
        </button>

        <button
          onClick={() => showToast('Prinsip: Timbang bersama di lokasi kebun tanpa potongan tengkulak tersembunyi.', 'info')}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#f8faf9] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#1e5128]" />
            <span className="text-[13px] font-bold text-[#0f2316]">
              Panduan Transaksi &amp; Standar Mutu Lapak Tani
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#a1a1aa]" />
        </button>

        <a
          href="https://wa.me/6281234567890?text=Halo%20Admin%20Lapak%20Tani,%20saya%20butuh%20bantuan."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#f8faf9] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#1e5128]" />
            <span className="text-[13px] font-bold text-[#0f2316]">
              Bantuan Komunitas &amp; Posko Admin
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-[#a1a1aa]" />
        </a>
      </section>

      {/* 5. Logout Button */}
      <button
        onClick={() => setConfirmLogoutOpen(true)}
        className="w-full h-12 bg-white border border-[#dc2626]/30 text-[#dc2626] hover:bg-[#fee2e2]/20 font-bold text-[14px] rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Keluar dari Akun</span>
      </button>

      {/* Logout Confirmation */}
      <ConfirmationModal
        isOpen={confirmLogoutOpen}
        title="Keluar dari Akun?"
        message="Anda dapat masuk kembali kapan saja untuk memantau negosiasi panen Anda."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          logout();
          showToast('Anda telah keluar dari akun.', 'info');
        }}
        onCancel={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
};
