import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTransactionById, updateTransactionStatus } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Phone, 
  ShieldCheck, 
  Receipt, 
  TrendingUp, 
  Scale, 
  FileText,
  Sprout,
  Store,
  Check,
  CheckCircle
} from 'lucide-react';

interface TransactionDetailScreenProps {
  transactionId: string;
}

export const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({ transactionId }) => {
  const { backToPrevious, goToTab, refreshAll, showToast } = useApp();
  const transaction = getTransactionById(transactionId);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState<boolean>(false);

  if (!transaction) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#e2e8f0]">
        <p className="text-[#dc2626] font-bold">Transaksi tidak ditemukan.</p>
        <button
          onClick={backToPrevious}
          className="mt-3 px-4 py-2 bg-[#1e5128] text-white rounded-xl text-[13px] font-bold cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  const handleConfirmComplete = () => {
    setConfirmCompleteOpen(false);
    updateTransactionStatus(transaction.id, 'selesai');
    refreshAll();
    showToast(`Transaksi ${transaction.transactionCode} telah ditandai selesai dan lunas!`, 'success');
  };

  const isCompleted = transaction.status === 'selesai';

  const handleDownloadProof = () => {
    showToast(`Nota Timbang digital #${transaction.transactionCode} diunduh.`, 'info');
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-4">
      {/* 1. Header Navigation */}
      <div className="bg-white px-3 py-2.5 rounded-2xl shadow-xs border border-[#e2e8f0] flex items-center justify-between">
        <button
          onClick={backToPrevious}
          className="flex items-center gap-1.5 text-[#0f2316] hover:text-[#1e5128] font-bold text-[14px] p-1.5 rounded-lg hover:bg-[#f8faf9] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <span className="text-[13px] font-bold text-[#0f2316] block leading-tight">
            Surat Jalan &amp; Nota Timbang
          </span>
          <span className="text-[11px] font-mono text-[#1e5128] font-bold bg-[#edf7ed] px-2 py-0.5 rounded-md border border-[#c4e1c5]">
            {transaction.transactionCode}
          </span>
        </div>

        <button
          onClick={handleDownloadProof}
          title="Unduh Bukti Transaksi"
          aria-label="Unduh Bukti"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[#52525b] hover:bg-[#f1f5f2] cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Status Banner */}
      <section className={`p-4 rounded-2xl border flex items-start gap-3 ${
        isCompleted
          ? 'bg-[#edf7ed] border-[#c4e1c5] text-[#0f3d1e]'
          : 'bg-[#fff5eb] border-[#fed7aa] text-[#8a3800]'
      }`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted ? 'bg-[#1e5128] text-white' : 'bg-[#a44a04] text-white'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider block">
            {isCompleted ? 'Transaksi Selesai & Lunas' : 'Kesepakatan Harga Terjalin'}
          </span>
          <h1 className="text-[15px] font-bold leading-snug">
            {isCompleted 
              ? 'Seluruh muatan telah diserahterimakan dan pembayaran lunas.' 
              : 'Menunggu Jadwal Muat & Timbang di Lokasi Kebun'}
          </h1>
          <p className="text-[11.5px] opacity-90 leading-snug pt-0.5">
            Dicatat pada {transaction.transactionDate}
          </p>
        </div>
      </section>

      {/* 3. 3-Step Stepper */}
      <section className="bg-white p-4 rounded-2xl shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-[#e2e8f0] -z-0"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-[#1e5128] text-white flex items-center justify-center text-[12px] font-bold shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-[#1e5128]">Disepakati</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shadow-xs ${
              isCompleted 
                ? 'bg-[#1e5128] text-white' 
                : 'bg-[#a44a04] text-white'
            }`}>
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span className="text-[11px] font-semibold text-[#0f2316]">Siap Timbang</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
              isCompleted 
                ? 'bg-[#1e5128] text-white shadow-xs' 
                : 'bg-[#f1f5f2] text-[#71717a]'
            }`}>
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <span className={`text-[11px] font-semibold ${isCompleted ? 'text-[#1e5128]' : 'text-[#71717a]'}`}>
              Selesai Lunas
            </span>
          </div>
        </div>
      </section>

      {/* 4. Komoditas & Pihak Terlibat */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3">
        <h2 className="text-[15px] font-extrabold text-[#0f2316]">Komoditas &amp; Pihak Terlibat</h2>

        {/* Product Box */}
        <div className="p-3 bg-[#f8faf9] rounded-xl flex items-center gap-3 border border-[#e2e8f0]/80">
          <div className="w-11 h-11 rounded-xl bg-[#edf7ed] text-[#1e5128] flex items-center justify-center shrink-0 border border-[#c4e1c5]">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-extrabold text-[#0f2316] truncate">
              {transaction.commodityName}
            </h3>
            <span className="text-[12px] text-[#52525b]">
              Standar Mutu: <strong className="text-[#0f2316]">{transaction.productQuality}</strong>
            </span>
          </div>
        </div>

        {/* Parties Grid */}
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div className="p-3 bg-[#f8faf9] rounded-xl space-y-1 border border-[#e2e8f0]/80">
            <span className="text-[11px] font-extrabold uppercase text-[#1e5128]">Petani Penjual</span>
            <span className="font-bold text-[#0f2316] block text-[13px]">
              {transaction.farmerName}
            </span>
            <span className="text-[#52525b] block text-[11px]">
              {transaction.farmerGroupName || 'Kel. Tani Rembang'}
            </span>
          </div>

          <div className="p-3 bg-[#f8faf9] rounded-xl space-y-1 border border-[#e2e8f0]/80">
            <span className="text-[11px] font-extrabold uppercase text-[#a44a04]">Pedagang Pembeli</span>
            <span className="font-bold text-[#0f2316] block text-[13px]">
              {transaction.traderName}
            </span>
            <span className="text-[#52525b] block text-[11px]">
              {transaction.traderBusinessName || 'Grosir Sayur Kudus'}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Lokasi Serah Terima & Timbang */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-2">
        <h2 className="text-[15px] font-extrabold text-[#0f2316] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#1e5128]" />
          Lokasi Serah Terima &amp; Timbang
        </h2>
        <div className="p-3 bg-[#f8faf9] rounded-xl space-y-1 text-[13px] text-[#52525b] border border-[#e2e8f0]/80">
          <p className="font-bold text-[#0f2316]">{transaction.location}</p>
          <p className="text-[12px] text-[#71717a]">
            *Akses jalan beton muat armada pick-up L300 &amp; truk engkel. Timbangan digital disediakan di tempat kebun.
          </p>
        </div>
      </section>

      {/* 6. Rincian Nilai Transaksi */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3">
        <h2 className="text-[15px] font-extrabold text-[#0f2316] flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-[#1e5128]" />
          Rincian Nilai Transaksi
        </h2>

        <div className="space-y-2 text-[13px] text-[#52525b]">
          <div className="flex justify-between">
            <span>Volume Disepakati:</span>
            <strong className="text-[#0f2316]">{transaction.quantity.toLocaleString('id-ID')} kg</strong>
          </div>
          <div className="flex justify-between">
            <span>Harga Akhir Disepakati:</span>
            <strong className="text-[#0f2316]">{formatRupiah(transaction.finalPrice)} /kg</strong>
          </div>
          <div className="flex justify-between">
            <span>Biaya Layanan Lapak Tani:</span>
            <span className="text-[#1e5128] font-bold">Rp 0 (Gratis)</span>
          </div>
          <div className="pt-2 border-t border-[#e2e8f0] flex justify-between items-baseline">
            <span className="font-extrabold text-[#0f2316] text-[14px]">Total Nilai Transaksi:</span>
            <span className="text-[22px] font-extrabold text-[#1e5128]">
              {formatRupiah(transaction.totalValue)}
            </span>
          </div>
        </div>
      </section>

      {/* 7. Jadwal & Armada Angkut */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-2.5">
        <h2 className="text-[15px] font-extrabold text-[#0f2316] flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-[#1e5128]" />
          Jadwal &amp; Armada Angkut
        </h2>

        <div className="space-y-1.5 text-[12.5px] text-[#52525b] bg-[#f8faf9] p-3 rounded-xl border border-[#e2e8f0]/80">
          <div className="flex justify-between">
            <span>Jadwal Penjemputan:</span>
            <strong className="text-[#0f2316]">{transaction.pickupSchedule || 'Rabu, 25 Okt • 07:30 WIB'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Jenis Armada:</span>
            <strong className="text-[#0f2316]">{transaction.pickupVehicle || 'Pick-up L300'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Nama Sopir / Kru:</span>
            <strong className="text-[#0f2316]">{transaction.driverName || 'Bpk. Slamet'}</strong>
          </div>
          <div className="pt-1 text-[11px] text-[#71717a]">
            Metode Pembayaran: {transaction.paymentMethod || 'Timbang bersama di kebun & pelunasan langsung.'}
          </div>
        </div>
      </section>

      {/* 8. Price Center Feed Banner */}
      <section 
        onClick={() => goToTab('harga')}
        className="bg-[#edf7ed] p-3.5 rounded-2xl border border-[#c4e1c5] flex items-center justify-between gap-2 cursor-pointer hover:bg-[#e4ece5] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <TrendingUp className="w-5 h-5 text-[#0f3d1e] shrink-0" />
          <div className="space-y-0.5 text-[12px] text-[#0f3d1e]">
            <strong className="block font-bold">Pusat Informasi Harga Terkini</strong>
            <p className="leading-snug truncate text-[#0f3d1e]/85">
              Transaksi riil ini memperkuat transparansi harga komoditas Jawa Tengah.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-[#1e5128] underline shrink-0">
          Lihat Indeks
        </span>
      </section>

      {/* 9. Fixed Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] p-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          <a
            href={`https://wa.me/6281398765432?text=Halo,%20terkait%20transaksi%20${transaction.transactionCode}%20di%20Lapak%20Tani.`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-4 rounded-xl bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#1e5128] font-bold text-[13px] flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Chat WA</span>
          </a>

          {!isCompleted ? (
            <button
              onClick={() => setConfirmCompleteOpen(true)}
              className="flex-1 h-12 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Konfirmasi Transaksi Selesai</span>
            </button>
          ) : (
            <div className="flex-1 h-12 rounded-xl bg-[#edf7ed] border border-[#c4e1c5] text-[#0f3d1e] font-bold text-[14px] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1e5128]" />
              <span>Transaksi Telah Selesai</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmCompleteOpen}
        title="Selesaikan Transaksi?"
        message={`Konfirmasi bahwa penimbangan bersama telah selesai, muatan telah dinaikkan ke armada angkut, dan pembayaran senilai ${formatRupiah(transaction.totalValue)} telah diterima lunas.`}
        confirmLabel="Ya, Transaksi Selesai"
        cancelLabel="Batal"
        variant="success"
        onConfirm={handleConfirmComplete}
        onCancel={() => setConfirmCompleteOpen(false)}
      />
    </div>
  );
};
