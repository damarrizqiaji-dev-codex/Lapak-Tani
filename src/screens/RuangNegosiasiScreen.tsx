import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  getOfferById, 
  getNegotiations, 
  addNegotiation, 
  acceptOffer, 
  rejectOffer 
} from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Send, 
  Gavel, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  Handshake, 
  FileText,
  Sprout,
  Store,
  Scale,
  Sparkles
} from 'lucide-react';

interface RuangNegosiasiScreenProps {
  offerId: string;
}

export const RuangNegosiasiScreen: React.FC<RuangNegosiasiScreenProps> = ({ offerId }) => {
  const { backToPrevious, viewTransaction, currentUser, refreshAll, showToast } = useApp();
  const offer = getOfferById(offerId);
  const negotiations = getNegotiations(offerId);

  const [isCounterModalOpen, setIsCounterModalOpen] = useState<boolean>(false);
  const [counterPrice, setCounterPrice] = useState<number>(offer ? offer.offeredPrice : 28000);
  const [counterQty, setCounterQty] = useState<number>(offer ? offer.quantity : 300);
  const [counterMessage, setCounterMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Custom modal states
  const [confirmAcceptOpen, setConfirmAcceptOpen] = useState(false);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);

  if (!offer) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#e2e8f0]">
        <p className="text-[#ba1a1a] font-bold">Penawaran tidak ditemukan.</p>
        <button
          onClick={backToPrevious}
          className="mt-3 px-4 py-2 bg-[#1e5128] text-white rounded-xl text-[13px] font-bold cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  const latestNeg = negotiations[negotiations.length - 1];
  const isMyTurn = latestNeg ? latestNeg.senderId !== currentUser.id : true;

  const handleConfirmAccept = () => {
    setConfirmAcceptOpen(false);
    setIsProcessing(true);
    try {
      const trx = acceptOffer(offer.id);
      refreshAll();
      showToast('Harga disepakati! Surat Jalan & Nota Timbang dibuat.', 'success');
      viewTransaction(trx.id);
    } catch (e) {
      console.error(e);
      showToast('Gagal menyetujui tawaran.', 'warning');
    }
  };

  const handleConfirmReject = () => {
    setConfirmRejectOpen(false);
    rejectOffer(offer.id);
    refreshAll();
    showToast('Penawaran telah ditolak.', 'info');
    backToPrevious();
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (counterPrice <= 0) return;

    addNegotiation({
      offerId: offer.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      price: counterPrice,
      quantity: counterQty,
      message: counterMessage || undefined,
    });

    setIsCounterModalOpen(false);
    refreshAll();
    showToast(`Tawaran balik ${formatRupiah(counterPrice)}/kg terkirim!`, 'success');
  };

  const priceDiff = offer.offeredPrice - offer.farmerStartingPrice;
  const percentDiff = Math.round((priceDiff / offer.farmerStartingPrice) * 100);

  return (
    <div className="flex flex-col w-full pb-32 space-y-4">
      {/* 1. Header Bar */}
      <div className="bg-white px-3 py-2.5 rounded-2xl shadow-xs border border-[#e2e8f0] flex items-center justify-between">
        <button
          onClick={backToPrevious}
          className="flex items-center gap-1 text-[#0f2316] hover:text-[#1e5128] font-bold text-[14px] p-1.5 rounded-lg hover:bg-[#f8faf9] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <span className="text-[14px] font-extrabold text-[#0f2316] block leading-tight">
            Ruang Negosiasi
          </span>
          <span className="text-[11px] text-[#64748b]">
            {offer.farmerName} ↔ {offer.traderName}
          </span>
        </div>

        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
          offer.status === 'diterima'
            ? 'bg-[#edf7ed] text-[#0f3d1e] border border-[#c4e1c5]'
            : offer.status === 'ditolak'
            ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]'
            : 'bg-[#fff5eb] text-[#8a3800] border border-[#fed7aa]'
        }`}>
          {offer.status === 'diterima' ? 'Disepakati' : offer.status === 'ditolak' ? 'Ditolak' : 'Negosiasi Aktif'}
        </span>
      </div>

      {/* 2. Commodity Snapshot Card & Visual Price Meter */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3.5">
        <div className="flex items-center gap-3">
          {offer.productPhoto ? (
            <img
              src={offer.productPhoto}
              alt={offer.commodityName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover bg-[#eae7eb] shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-[#edf7ed] flex items-center justify-center shrink-0">
              <Sprout className="w-7 h-7 text-[#1e5128]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-extrabold text-[#0f2316] leading-snug truncate">
              {offer.commodityName}
            </h1>
            <p className="text-[12.5px] text-[#52525b]">
              Volume Negosiasi: <strong className="text-[#0f2316] font-bold">{offer.quantity.toLocaleString('id-ID')} kg</strong>
              {offer.productQuality ? ` • ${offer.productQuality}` : ''}
            </p>
          </div>
        </div>

        {/* Visual Price Comparison Meter */}
        <div className="bg-[#f8faf9] p-3.5 rounded-xl border border-[#e2e8f0]/80 space-y-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-[#52525b]">Perbandingan Harga Penawaran</span>
            <span className={`font-extrabold ${priceDiff < 0 ? 'text-[#a44a04]' : 'text-[#1e5128]'}`}>
              Selisih: {priceDiff > 0 ? `+${formatRupiah(priceDiff)}` : formatRupiah(priceDiff)} ({percentDiff}%)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-2.5 rounded-lg border border-[#e2e8f0]/80">
              <span className="text-[11px] text-[#71717a] block font-medium">Buka Petani</span>
              <span className="text-[15px] text-[#71717a] line-through font-semibold">
                {formatRupiah(offer.farmerStartingPrice)}
              </span>
              <span className="text-[10px] text-[#a1a1aa] block">/kg</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#1e5128]/30 shadow-2xs text-right">
              <span className="text-[11px] text-[#1e5128] block font-bold">Tawaran Pedagang</span>
              <span className="text-[18px] font-extrabold text-[#1e5128]">
                {formatRupiah(offer.offeredPrice)}
              </span>
              <span className="text-[10px] text-[#64748b] block">/kg</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12.5px] pt-1 border-t border-[#e2e8f0]/60">
            <span className="text-[#52525b] font-medium">Total Nilai Transaksi:</span>
            <span className="text-[16px] font-extrabold text-[#0f2316]">
              {formatRupiah(offer.quantity * offer.offeredPrice)}
            </span>
          </div>
        </div>
      </section>

      {/* 3. 4-Stage Transaction Stepper */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-[#e2e8f0] -z-0"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-[#1e5128] text-white flex items-center justify-center text-[12px] font-bold shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-semibold text-[#1e5128]">Ditawarkan</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shadow-xs ${
              offer.status === 'diterima' ? 'bg-[#1e5128] text-white' : 'bg-[#a44a04] text-white'
            }`}>
              {offer.status === 'diterima' ? <Check className="w-3.5 h-3.5" /> : <Gavel className="w-3.5 h-3.5" />}
            </div>
            <span className="text-[11px] font-bold text-[#a44a04]">Negosiasi</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
              offer.status === 'diterima' ? 'bg-[#1e5128] text-white' : 'bg-[#f1f5f2] text-[#71717a]'
            }`}>
              {offer.status === 'diterima' ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <span className="text-[11px] font-medium text-[#71717a]">Disepakati</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-[#f1f5f2] text-[#71717a] flex items-center justify-center text-[12px] font-bold">
              4
            </div>
            <span className="text-[11px] font-medium text-[#71717a]">Timbang Lahan</span>
          </div>
        </div>
      </section>

      {/* 4. Negotiation History Timeline */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-extrabold text-[#0f2316]">
            Riwayat Perubahan Tawaran ({negotiations.length} Catatan)
          </h2>
          <span className="text-[11px] text-[#64748b]">Kronologis</span>
        </div>

        <div className="space-y-2.5">
          {negotiations.map((item, index) => {
            const isFarmer = item.senderRole === 'petani';
            const isMe = item.senderId === currentUser.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-white border-[#1e5128]/30 shadow-xs ml-4'
                    : 'bg-[#f8faf9] border-[#e2e8f0] mr-4'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isFarmer ? 'bg-[#edf7ed] text-[#0f3d1e]' : 'bg-[#fff5eb] text-[#8a3800]'
                    }`}>
                      {isFarmer ? 'P' : 'D'}
                    </div>
                    <span className="text-[13px] font-bold text-[#0f2316]">
                      {item.senderName}
                    </span>
                    <span className="text-[11px] text-[#71717a]">
                      ({isFarmer ? 'Petani' : 'Pedagang'})
                    </span>
                  </div>
                  <span className="text-[11px] text-[#a1a1aa] font-medium">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex items-baseline justify-between py-1.5 bg-white/80 px-2.5 rounded-lg border border-[#e2e8f0]/70 mb-2">
                  <span className="text-[12px] text-[#52525b]">
                    Harga Diajukan:
                  </span>
                  <span className="text-[16px] font-extrabold text-[#1e5128]">
                    {formatRupiah(item.price)} <span className="text-[11px] font-normal text-[#71717a]">/kg</span>
                  </span>
                </div>

                {item.message && (
                  <p className="text-[12.5px] text-[#52525b] leading-relaxed italic bg-white/50 p-2 rounded-md border border-[#e2e8f0]/40">
                    "{item.message}"
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Fixed Decision Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] p-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {offer.status === 'diterima' ? (
            <div className="w-full h-12 bg-[#edf7ed] border border-[#c4e1c5] text-[#0f3d1e] font-bold text-[14px] rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1e5128]" />
              <span>Penawaran Sudah Disepakati</span>
            </div>
          ) : offer.status === 'ditolak' ? (
            <div className="w-full h-12 bg-[#fee2e2] text-[#991b1b] font-bold text-[14px] rounded-xl flex items-center justify-center gap-2">
              <X className="w-5 h-5" />
              <span>Penawaran Telah Ditolak</span>
            </div>
          ) : (
            <>
              {/* Tolak Button */}
              <button
                onClick={() => setConfirmRejectOpen(true)}
                className="h-12 px-4 rounded-xl border border-[#dc2626] text-[#dc2626] hover:bg-[#fee2e2]/40 font-bold text-[13px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Tolak</span>
              </button>

              {/* Counteroffer Button */}
              <button
                onClick={() => setIsCounterModalOpen(true)}
                className="flex-1 h-12 rounded-xl bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#0f2316] font-bold text-[14px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Gavel className="w-4 h-4 text-[#a44a04]" />
                <span>Tawar Balik</span>
              </button>

              {/* Setujui Button */}
              <button
                onClick={() => setConfirmAcceptOpen(true)}
                disabled={isProcessing}
                className="flex-1 h-12 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Setujui Harga</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Counteroffer Modal with Quick Increment Pills */}
      <AnimatePresence>
        {isCounterModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                <h3 className="text-[16px] font-extrabold text-[#0f2316] flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-[#a44a04]" />
                  Ajukan Penawaran Balik
                </h3>
                <button
                  onClick={() => setIsCounterModalOpen(false)}
                  className="p-1 text-[#71717a] hover:text-[#0f2316] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendCounter} className="space-y-3.5">
                <div>
                  <label className="text-[13px] font-bold text-[#0f2316] block mb-1">
                    Harga Balasan per kg (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#52525b]">
                      Rp
                    </span>
                    <input
                      type="number"
                      step={500}
                      required
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(Number(e.target.value))}
                      className="w-full h-12 pl-12 pr-4 bg-[#f8faf9] rounded-xl text-[18px] font-extrabold text-[#0f2316] border border-[#e2e8f0] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
                    />
                  </div>

                  {/* Quick Preset Increment Buttons */}
                  <div className="flex items-center gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setCounterPrice(p => Math.max(1000, p - 1000))}
                      className="px-2 py-1 rounded-lg bg-[#f8faf9] border border-[#e2e8f0] text-[11px] font-bold text-[#52525b] hover:bg-[#f1f5f2] cursor-pointer"
                    >
                      -1.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterPrice(p => Math.max(500, p - 500))}
                      className="px-2 py-1 rounded-lg bg-[#f8faf9] border border-[#e2e8f0] text-[11px] font-bold text-[#52525b] hover:bg-[#f1f5f2] cursor-pointer"
                    >
                      -500
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterPrice(p => p + 500)}
                      className="px-2 py-1 rounded-lg bg-[#f8faf9] border border-[#e2e8f0] text-[11px] font-bold text-[#1e5128] hover:bg-[#edf7ed] cursor-pointer"
                    >
                      +500
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterPrice(p => p + 1000)}
                      className="px-2 py-1 rounded-lg bg-[#f8faf9] border border-[#e2e8f0] text-[11px] font-bold text-[#1e5128] hover:bg-[#edf7ed] cursor-pointer"
                    >
                      +1.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setCounterPrice(offer.farmerStartingPrice)}
                      className="ml-auto px-2 py-1 rounded-lg bg-[#f8faf9] border border-[#e2e8f0] text-[11px] font-medium text-[#71717a] hover:bg-[#f1f5f2] cursor-pointer"
                    >
                      Harga Awal
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-bold text-[#0f2316] block mb-1">
                    Catatan Alasan / Penjelasan
                  </label>
                  <textarea
                    rows={3}
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder="Contoh: Kualitas super grade A petik subuh belum susut. Pengambilan 500 kg kami lepas di harga ini..."
                    className="w-full p-3 bg-[#f8faf9] rounded-xl text-[13px] border border-[#e2e8f0] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCounterModalOpen(false)}
                    className="h-11 px-4 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[#0f2316] font-semibold text-[13px] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Tawaran Balik</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modals (Replacing browser alert/confirm) */}
      <ConfirmationModal
        isOpen={confirmAcceptOpen}
        title="Setujui Kesepakatan Harga?"
        message={`Anda akan menyepakati harga ${formatRupiah(offer.offeredPrice)}/kg untuk volume ${offer.quantity.toLocaleString('id-ID')} kg. Total transaksi: ${formatRupiah(offer.quantity * offer.offeredPrice)}.`}
        confirmLabel="Ya, Sepakati Harga"
        cancelLabel="Kembali"
        variant="success"
        onConfirm={handleConfirmAccept}
        onCancel={() => setConfirmAcceptOpen(false)}
      />

      <ConfirmationModal
        isOpen={confirmRejectOpen}
        title="Tolak Penawaran?"
        message="Penawaran ini akan ditutup dan tidak dapat dinegosiasikan lebih lanjut."
        confirmLabel="Ya, Tolak"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleConfirmReject}
        onCancel={() => setConfirmRejectOpen(false)}
      />
    </div>
  );
};
