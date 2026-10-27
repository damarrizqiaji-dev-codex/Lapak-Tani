import React from 'react';
import { useApp } from '../context/AppContext';
import { getProductById } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Scale, 
  Package, 
  Clock, 
  Droplet, 
  MessageSquare, 
  ArrowRight,
  Truck,
  Sprout
} from 'lucide-react';

interface ProductDetailScreenProps {
  productId: string;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ productId }) => {
  const { backToPrevious, openAjukanPenawaran, goToTab, currentUser, openAddHarvest, showToast } = useApp();
  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-[#ba1a1a] font-bold">Produk tidak ditemukan.</p>
        <button
          onClick={backToPrevious}
          className="h-10 px-4 rounded-lg bg-[#1e5128] text-white text-[13px] font-semibold"
        >
          Kembali ke Pasar
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.commodityName,
        text: `Lihat hasil panen ${product.commodityName} dari ${product.farmerName} di Lapak Tani!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan komoditas telah disalin ke papan klip!', 'success');
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-4">
      {/* 1. Sub-Header Navigation */}
      <div className="bg-white px-3 py-2.5 rounded-xl shadow-xs border border-[#c1c9bd]/30 flex items-center justify-between">
        <button
          onClick={backToPrevious}
          className="flex items-center gap-1.5 text-[#1b1b1e] hover:text-[#1e5128] font-bold text-[14px] p-1.5 rounded-lg hover:bg-[#f5f3f6] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <span className="text-[14px] font-bold text-[#1b1b1e]">Detail Komoditas</span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            aria-label="Bagikan"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#414940] hover:bg-[#f0edf1]"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Komoditas disimpan ke daftar pantauan!')}
            aria-label="Simpan"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#414940] hover:bg-[#f0edf1]"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Photo Hero Stage */}
      <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-sm bg-[#eae7eb]">
        <img
          src={product.photo}
          alt={product.commodityName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#1e5128]/95 text-white font-bold text-[11px] px-3 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#b8f1b9]" />
            Terverifikasi Poktan
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 text-white font-medium text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs">
            Foto Panen Riil Lahan
          </span>
        </div>
        {product.harvestDate && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-white/95 text-[#002108] font-bold text-[11px] px-2.5 py-1 rounded-md shadow-xs">
              {product.harvestDate}
            </span>
          </div>
        )}
      </div>

      {/* 3. Title & Price Block */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#904d00]">
              {product.category.toUpperCase()} • HORTIKULTURA
            </span>
            <span className="bg-[#b8f1b9] text-[#002108] text-[11px] font-bold px-2 py-0.5 rounded-md">
              {product.quality}
            </span>
          </div>
          <h1 className="text-[22px] font-bold text-[#1b1b1e] leading-snug">
            {product.commodityName}
          </h1>
          <div className="flex items-center gap-1.5 text-[13px] text-[#414940]">
            <MapPin className="w-4 h-4 text-[#1e5128] shrink-0" />
            <span>{product.location}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#f5f3f6] border border-[#c1c9bd]/30 flex flex-col gap-1">
          <span className="text-[12px] font-medium text-[#414940]">Harga Pembuka Petani</span>
          <div className="text-[26px] font-bold text-[#1e5128] leading-tight">
            {formatRupiah(product.startingPrice)}{' '}
            <span className="text-[14px] font-normal text-[#414940]">/{product.unit}</span>
          </div>
          <p className="text-[11.5px] text-[#71796f] leading-snug pt-0.5">
            *Harga belum termasuk ongkos angkut; dapat dinegosiasikan sesuai volume pesanan dan armada penjemputan.
          </p>
        </div>
      </section>

      {/* 4. Rincian Spesifikasi Hasil Panen */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-3">
        <h2 className="text-[15px] font-bold text-[#1b1b1e]">Rincian Hasil Panen</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#f5f3f6] p-2.5 rounded-lg flex items-start gap-2">
            <Package className="w-4 h-4 text-[#1e5128] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-[#414940] block">Stok Tersedia</span>
              <span className="text-[14px] font-bold text-[#1b1b1e]">
                {product.quantity} {product.unit}
              </span>
            </div>
          </div>

          <div className="bg-[#f5f3f6] p-2.5 rounded-lg flex items-start gap-2">
            <Scale className="w-4 h-4 text-[#1e5128] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-[#414940] block">Minimal Pesan</span>
              <span className="text-[14px] font-bold text-[#1b1b1e]">
                {product.minimumOrder || 50} {product.unit}
              </span>
            </div>
          </div>

          <div className="bg-[#f5f3f6] p-2.5 rounded-lg flex items-start gap-2">
            <Truck className="w-4 h-4 text-[#1e5128] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-[#414940] block">Kemasan Muat</span>
              <span className="text-[14px] font-bold text-[#1b1b1e]">
                {product.packaging || 'Krat Plastik'}
              </span>
            </div>
          </div>

          <div className="bg-[#f5f3f6] p-2.5 rounded-lg flex items-start gap-2">
            <Droplet className="w-4 h-4 text-[#1e5128] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-[#414940] block">Kondisi Air</span>
              <span className="text-[14px] font-bold text-[#1b1b1e]">
                {product.moisture || '< 12% Kering Angin'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Profil Petani Pemilik Panen */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-3">
        <h2 className="text-[15px] font-bold text-[#1b1b1e]">Petani Pemilik Panen</h2>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#b8f1b9] text-[#002108] flex items-center justify-center font-bold text-[16px] shrink-0 shadow-xs">
              {product.farmerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[#1b1b1e]">{product.farmerName}</span>
                <CheckCircle2 className="w-4 h-4 text-[#1e5128]" />
              </div>
              <p className="text-[12px] text-[#414940]">
                {product.farmerGroupName || 'Kelompok Tani Tani Makmur Rembang'}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#71796f]">
                <span>12x Transaksi Selesai</span>
                <span>•</span>
                <span className="font-semibold text-[#904d00]">⭐ 4.9 Reputasi</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/6281234567890?text=Halo%20${encodeURIComponent(product.farmerName)},%20saya%20tertarik%20dengan%20hasil%20panen%20${encodeURIComponent(product.commodityName)}%20di%20Lapak%20Tani.`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3 rounded-lg bg-[#f0edf1] hover:bg-[#eae7eb] text-[#1e5128] font-bold text-[12px] flex items-center gap-1 shrink-0 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Tanya WA</span>
          </a>
        </div>
      </section>

      {/* 6. Catatan & Kondisi Panen */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-2">
        <h2 className="text-[15px] font-bold text-[#1b1b1e]">Catatan &amp; Kondisi Panen</h2>
        <p className="text-[13px] text-[#414940] leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </section>

      {/* 7. Jaminan Akad Lapak Tani */}
      <section className="bg-[#bcefc0]/40 p-3.5 rounded-xl border border-[#bcefc0] flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#073919] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-[12px] text-[#073919]">
          <strong className="block font-bold">Jaminan Transparansi Lapak Tani</strong>
          <p className="leading-snug">
            Platform tidak mengenakan potongan komisi bagi petani maupun pedagang. Penimbangan bersama dilakukan di lahan sebelum muatan diberangkatkan.
          </p>
        </div>
      </section>

      {/* 8. Fixed Bottom Action Dock with Safe Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-lg select-none">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button
            onClick={() => goToTab('komunitas')}
            className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-[#f8faf9] hover:bg-[#f1f5f2] text-[#0f2316] border border-[#e2e8f0] font-bold text-[12.5px] sm:text-[13px] flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#1e5128]" />
            <span className="hidden xs:inline">Forum</span>
          </button>

          {currentUser.role === 'petani' && product.farmerId === currentUser.id ? (
            <button
              onClick={() => goToTab('transaksi')}
              className="flex-1 h-11 sm:h-12 px-3 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-extrabold text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span className="truncate">Lihat Tawaran Panen Ini</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : currentUser.role === 'petani' ? (
            <button
              onClick={() => openAddHarvest()}
              className="flex-1 h-11 sm:h-12 px-3 rounded-xl bg-[#edf7ed] hover:bg-[#e2f2e3] text-[#1e5128] border border-[#c4e1c5] font-extrabold text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <Sprout className="w-4 h-4 shrink-0" />
              <span className="truncate">Pasang Panen Serupa</span>
            </button>
          ) : (
            <button
              onClick={() => openAjukanPenawaran(product.id)}
              className="flex-1 h-11 sm:h-12 px-3 rounded-xl bg-[#a44a04] hover:bg-[#853c03] text-white font-extrabold text-[13.5px] sm:text-[15px] flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span className="truncate">Ajukan Tawar Grosir</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
