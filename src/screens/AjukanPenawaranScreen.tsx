import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getProductById, createOffer } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { 
  ArrowLeft, 
  HelpCircle, 
  Sprout, 
  Info, 
  CheckCircle2, 
  Scale, 
  Send, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface AjukanPenawaranScreenProps {
  productId: string;
}

export const AjukanPenawaranScreen: React.FC<AjukanPenawaranScreenProps> = ({ productId }) => {
  const { backToPrevious, openRuangNegosiasi, currentUser, refreshAll } = useApp();
  const product = getProductById(productId);

  const [quantity, setQuantity] = useState<number>(300);
  const [offeredPrice, setOfferedPrice] = useState<number>(28000);
  const [message, setMessage] = useState<string>(
    'Tawar untuk pasokan pasar grosir. Siap angkut sendiri dengan armada pick-up. Timbang bersama langsung di lokasi kebun.'
  );
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#ba1a1a] font-bold">Produk tidak ditemukan.</p>
        <button
          onClick={backToPrevious}
          className="mt-3 px-4 py-2 bg-[#1e5128] text-white rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

  const minOrder = product.minimumOrder || 50;
  const maxStock = product.quantity;
  const priceDiff = offeredPrice - product.startingPrice;
  const totalValue = quantity * offeredPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < minOrder) {
      setErrorMsg(`Jumlah pembelian minimal adalah ${minOrder} ${product.unit}.`);
      return;
    }
    if (quantity > maxStock) {
      setErrorMsg(`Jumlah pembelian melebihi stok yang tersedia (${maxStock} ${product.unit}).`);
      return;
    }
    if (offeredPrice <= 0) {
      setErrorMsg('Harga penawaran harus valid.');
      return;
    }

    try {
      const newOffer = createOffer(
        product.id,
        currentUser.id,
        quantity,
        offeredPrice,
        message
      );
      refreshAll();
      openRuangNegosiasi(newOffer.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim penawaran.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-4">
      {/* 1. Header Bar */}
      <div className="bg-white px-3 py-2.5 rounded-xl shadow-xs border border-[#c1c9bd]/30 flex items-center justify-between">
        <button
          onClick={backToPrevious}
          className="flex items-center gap-1.5 text-[#1b1b1e] hover:text-[#1e5128] font-bold text-[14px] p-1.5 rounded-lg hover:bg-[#f5f3f6]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <span className="text-[14px] font-bold text-[#1b1b1e]">Ajukan Penawaran</span>

        <button
          onClick={() => setShowGuide(!showGuide)}
          aria-label="Panduan Tawar"
          className="flex items-center gap-1 text-[12px] font-bold text-[#904d00] hover:text-[#6e3900] px-2 py-1 rounded-lg hover:bg-[#ffdcc3]/30"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Panduan</span>
        </button>
      </div>

      {/* Guide Drawer Alert */}
      {showGuide && (
        <div className="bg-[#ffdcc3]/60 p-4 rounded-xl border border-[#ffb77d] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#6e3900] flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Etika &amp; Panduan Negosiasi Wajar
            </span>
            <button
              onClick={() => setShowGuide(false)}
              className="text-[12px] text-[#6e3900] font-bold"
            >
              Tutup
            </button>
          </div>
          <ul className="text-[12px] text-[#6e3900] space-y-1 list-disc list-inside">
            <li>Ajukan penawaran yang proporsional dengan kualitas panen dan volume angkut.</li>
            <li>Petani berhak menerima, menolak, atau mengajukan tawaran balik (counteroffer).</li>
            <li>Kesepakatan harga mengikat untuk ditimbang langsung di lahan panen.</li>
          </ul>
        </div>
      )}

      {/* 2. Product Context Snapshot */}
      <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#c1c9bd]/30 flex items-center gap-3">
        <img
          src={product.photo}
          alt={product.commodityName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-lg object-cover bg-[#eae7eb] shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#1e5128] bg-[#b8f1b9] px-2 py-0.2 rounded-md">
              {product.quality}
            </span>
            <span className="text-[11px] text-[#414940] truncate">
              {product.farmerName} • {product.location.split(',')[0]}
            </span>
          </div>
          <h2 className="text-[15px] font-bold text-[#1b1b1e] leading-snug truncate">
            {product.commodityName}
          </h2>
          <div className="flex items-center gap-3 text-[12px] text-[#414940]">
            <span>
              Harga Awal:{' '}
              <strong className="text-[#1e5128]">{formatRupiah(product.startingPrice)}</strong>/{product.unit}
            </span>
            <span>•</span>
            <span>Stok: {product.quantity} {product.unit}</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-xl text-[13px] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Offer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quantity Field */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-[#1b1b1e]">
              Jumlah yang Ingin Dibeli ({product.unit})
            </label>
            <span className="text-[12px] text-[#414940]">
              Min. {minOrder} {product.unit}
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min={minOrder}
              max={maxStock}
              step={10}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-12 px-3.5 bg-[#f5f3f6] text-[#1b1b1e] rounded-xl text-[16px] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#414940]">
              {product.unit}
            </span>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setQuantity(minOrder)}
              className="px-2.5 py-1 rounded-md bg-[#f0edf1] hover:bg-[#eae7eb] text-[11px] font-bold text-[#1b1b1e]"
            >
              Min ({minOrder})
            </button>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxStock, 200))}
              className="px-2.5 py-1 rounded-md bg-[#f0edf1] hover:bg-[#eae7eb] text-[11px] font-bold text-[#1b1b1e]"
            >
              200 {product.unit}
            </button>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxStock, 300))}
              className="px-2.5 py-1 rounded-md bg-[#f0edf1] hover:bg-[#eae7eb] text-[11px] font-bold text-[#1b1b1e]"
            >
              300 {product.unit}
            </button>
            <button
              type="button"
              onClick={() => setQuantity(maxStock)}
              className="px-2.5 py-1 rounded-md bg-[#f0edf1] hover:bg-[#eae7eb] text-[11px] font-bold text-[#1b1b1e]"
            >
              Semua ({maxStock})
            </button>
          </div>
        </div>

        {/* Price Field */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-[#1b1b1e]">
              Harga Penawaran Anda per {product.unit} (Rp)
            </label>
            <span className="text-[12px] text-[#414940]">
              Awal: {formatRupiah(product.startingPrice)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#414940]">
              Rp
            </span>
            <input
              type="number"
              step={500}
              required
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(Number(e.target.value))}
              className="w-full h-12 pl-12 pr-12 bg-[#f5f3f6] text-[#1b1b1e] rounded-xl text-[18px] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#414940]">
              /{product.unit}
            </span>
          </div>

          {/* Difference Tag */}
          <div className="pt-1">
            {priceDiff < 0 ? (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#904d00] bg-[#ffdcc3]/50 px-2 py-0.5 rounded-md">
                - {formatRupiah(Math.abs(priceDiff))} /{product.unit} dari harga pembuka petani (wajar &amp; proporsional)
              </span>
            ) : priceDiff === 0 ? (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#1e5128] bg-[#b8f1b9] px-2 py-0.5 rounded-md">
                Sesuai harga pembuka petani
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#1e5128] bg-[#b8f1b9] px-2 py-0.5 rounded-md">
                + {formatRupiah(priceDiff)} /{product.unit} (penawaran prioritas)
              </span>
            )}
          </div>
        </div>

        {/* Message / Delivery Notes */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-2">
          <label className="text-[13px] font-bold text-[#1b1b1e] flex items-center justify-between">
            <span>Catatan &amp; Rencana Pengangkutan</span>
            <span className="text-[11px] font-normal text-[#414940]">Opsional</span>
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Contoh: Siap jemput dengan pick-up L300 hari Rabu pagi. Bayar timbang di lokasi kebun..."
            className="w-full p-3 bg-[#f5f3f6] text-[#1b1b1e] rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] transition-all resize-none"
          />
        </div>

        {/* Calculation Summary Box */}
        <div className="bg-[#f5f3f6] p-4 rounded-xl border border-[#c1c9bd]/30 space-y-2.5">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#414940]">
            Estimasi Nilai Penawaran
          </span>
          <div className="space-y-1.5 text-[13px] text-[#414940]">
            <div className="flex justify-between">
              <span>Volume Pembelian</span>
              <strong className="text-[#1b1b1e]">{quantity} {product.unit}</strong>
            </div>
            <div className="flex justify-between">
              <span>Harga Satuan Diajukan</span>
              <strong className="text-[#1b1b1e]">{formatRupiah(offeredPrice)} /{product.unit}</strong>
            </div>
            <div className="pt-2 border-t border-[#c1c9bd]/30 flex justify-between items-baseline">
              <span className="font-bold text-[#1b1b1e]">Total Nilai Akad</span>
              <span className="text-[22px] font-bold text-[#1e5128]">
                {formatRupiah(totalValue)}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#71796f] leading-snug">
            *Biaya pengangkutan dan bongkar muat disepakati bersama pihak pembeli.
          </p>
        </div>

        {/* Fixed Bottom Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#c1c9bd]/30 p-3 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <button
              type="submit"
              className="w-full h-12 bg-[#1e5128] hover:bg-[#013a13] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
              <span>Kirim Penawaran ke Petani</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
