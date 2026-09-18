import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getPriceInfo } from '../services/storage';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { 
  TrendingUp, 
  Info, 
  ShieldCheck, 
  Scale, 
  ArrowLeft, 
  Download, 
  Calendar, 
  Building2, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const PriceInfoScreen: React.FC = () => {
  const { backToPrevious, goToTab } = useApp();
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Cabai Merah Keriting');
  const [timeRange, setTimeRange] = useState<'hari_ini' | '7_hari' | '30_hari'>('hari_ini');

  const priceData = getPriceInfo(selectedCommodity);

  const commodities = [
    'Cabai Merah Keriting',
    'Bawang Merah',
    'Jagung Pipil Kering',
    'Tomat Mutiara',
    'Kentang Granola',
  ];

  return (
    <div className="flex flex-col w-full pb-24 space-y-3.5">
      {/* 1. Header Banner */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">
            Transparansi Pasar
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1e5128]"></span>
        </div>
        <h1 className="text-[20px] font-bold text-[#1b1b1e] leading-snug">
          Pusat Informasi Harga
        </h1>
        <p className="text-[13px] text-[#414940] leading-relaxed">
          Informasi harga dihimpun dari transaksi riil yang terjadi di Lapak Tani (bukan data harga resmi pemerintah).
        </p>
      </section>

      {/* 2. Mandatory Disclaimer Notice */}
      <section className="bg-[#ffdcc3]/50 p-3.5 rounded-xl border border-[#ffb77d]/60 flex items-start gap-2.5">
        <Info className="w-5 h-5 text-[#904d00] shrink-0 mt-0.5" />
        <div className="text-[12px] text-[#6e3900] space-y-0.5">
          <strong className="block font-bold">Catatan Integritas Data Pasar</strong>
          <p className="leading-snug">
            Data ini murni mencerminkan kesepakatan jual-beli nyata yang telah ditimbang dan disetujui antara petani dan pedagang di platform ini sebagai rujukan negosiasi yang berimbang.
          </p>
        </div>
      </section>

      {/* 3. Commodity & Range Selectors */}
      <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-3">
        <div>
          <label className="text-[12px] font-bold text-[#1b1b1e] block mb-1">
            Pilih Komoditas
          </label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full h-11 px-3 bg-[#f5f3f6] rounded-xl text-[14px] font-bold text-[#1b1b1e] focus:outline-none focus:ring-2 focus:ring-[#1e5128] cursor-pointer"
          >
            {commodities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f5f3f6] rounded-xl">
          <button
            onClick={() => setTimeRange('hari_ini')}
            className={`flex-1 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              timeRange === 'hari_ini'
                ? 'bg-white text-[#1e5128] shadow-xs'
                : 'text-[#414940] hover:text-[#1b1b1e]'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setTimeRange('7_hari')}
            className={`flex-1 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              timeRange === '7_hari'
                ? 'bg-white text-[#1e5128] shadow-xs'
                : 'text-[#414940] hover:text-[#1b1b1e]'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => setTimeRange('30_hari')}
            className={`flex-1 h-8 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              timeRange === '30_hari'
                ? 'bg-white text-[#1e5128] shadow-xs'
                : 'text-[#414940] hover:text-[#1b1b1e]'
            }`}
          >
            30 Hari
          </button>
        </div>
      </div>

      {/* 4. Main Price Metric or Empty State */}
      {!priceData.hasEnoughData ? (
        <section className="bg-white p-8 rounded-xl border border-[#c1c9bd]/30 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-[#904d00] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-[16px] font-bold text-[#1b1b1e]">
              Belum cukup data transaksi untuk menampilkan informasi harga.
            </h3>
            <p className="text-[13px] text-[#414940] max-w-sm mx-auto">
              Lapak Tani tidak memalsukan data pasar. Informasi harga rata-rata akan otomatis terbit begitu ada kesepakatan transaksi riil untuk komoditas ini.
            </p>
          </div>
          <button
            onClick={() => goToTab('pasar')}
            className="h-10 px-4 rounded-lg bg-[#1e5128] text-white text-[13px] font-bold"
          >
            Lihat Lapak Komoditas Lain
          </button>
        </section>
      ) : (
        <>
          {/* Main Average Price Card */}
          <section className="bg-[#1e5128] text-white p-4.5 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8fc195]">
                Rata-rata Transaksi Disepakati
              </span>
              <span className="bg-[#b8f1b9] text-[#002108] text-[10.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1e5128]" />
                Terverifikasi Lapak Tani
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-bold leading-none tracking-tight">
                {formatRupiah(priceData.averagePrice)}
              </span>
              <span className="text-[14px] text-[#8fc195]">/kg</span>
            </div>

            <p className="text-[12px] text-[#8fc195] leading-snug">
              Dihitung dari <strong>{priceData.transactionCount} transaksi</strong> riil di wilayah Rembang, Pati, dan Kudus.
            </p>
          </section>

          {/* 3-Party Price Comparison Grid */}
          <section className="space-y-2">
            <h2 className="text-[15px] font-bold text-[#1b1b1e] px-1">
              Rincian Perbandingan 3 Pihak
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-3 rounded-xl border border-[#c1c9bd]/30 space-y-1">
                <span className="text-[11px] text-[#414940] block font-medium">Harga Awal Petani</span>
                <span className="text-[15px] font-bold text-[#1b1b1e] block">
                  {formatRupiah(priceData.startingPriceAverage)}
                </span>
                <span className="text-[10px] text-[#71796f] block">Rata-rata pembuka</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#c1c9bd]/30 space-y-1">
                <span className="text-[11px] text-[#414940] block font-medium">Rentang Tawaran</span>
                <span className="text-[14px] font-bold text-[#904d00] block truncate">
                  {formatRupiah(priceData.traderOfferMin)}
                </span>
                <span className="text-[10px] text-[#71796f] block">s/d {formatRupiah(priceData.traderOfferMax)}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#c1c9bd]/30 space-y-1">
                <span className="text-[11px] text-[#414940] block font-medium">Transaksi Terakhir</span>
                <span className="text-[15px] font-bold text-[#1e5128] block">
                  {formatRupiah(priceData.lastTransactionPrice)}
                </span>
                <span className="text-[10px] text-[#71796f] block">Tercatat aktif</span>
              </div>
            </div>
          </section>

          {/* Volume and Recorded Value */}
          <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-2.5">
            <h2 className="text-[15px] font-bold text-[#1b1b1e]">
              Total Volume &amp; Nilai Tercatat
            </h2>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div className="p-3 bg-[#f5f3f6] rounded-lg">
                <span className="text-[11px] text-[#414940] block">Volume Terjual</span>
                <span className="text-[18px] font-bold text-[#1b1b1e]">
                  {formatNumber(priceData.totalVolume)} kg
                </span>
              </div>

              <div className="p-3 bg-[#f5f3f6] rounded-lg">
                <span className="text-[11px] text-[#414940] block">Nilai Kesepakatan</span>
                <span className="text-[18px] font-bold text-[#1e5128]">
                  {formatRupiah(priceData.totalValue)}
                </span>
              </div>
            </div>
          </section>

          {/* Actual Transaction History List */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-[#1b1b1e]">
                Riwayat Kesepakatan Terakhir
              </h2>
              <span className="text-[11px] text-[#71796f]">Data Riil Lapak Tani</span>
            </div>

            <div className="bg-white rounded-xl border border-[#c1c9bd]/30 overflow-hidden divide-y divide-[#c1c9bd]/20">
              {priceData.transactions.map((t) => (
                <div key={t.id} className="p-3.5 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[13px] font-bold text-[#1b1b1e] block truncate">
                      {t.parties}
                    </span>
                    <p className="text-[11.5px] text-[#414940]">
                      {t.date} • {t.volume} kg • {t.location.split(',')[0]}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[14px] font-bold text-[#1e5128] block">
                      {formatRupiah(t.price)}
                    </span>
                    <span className="text-[10px] text-[#71796f]">per kg</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Download PDF button */}
          <button
            onClick={() => alert(`Rekap bulanan harga ${selectedCommodity} berhasil diunduh dalam format PDF!`)}
            className="w-full h-11 bg-white border border-[#c1c9bd] text-[#1b1b1e] hover:bg-[#f5f3f6] rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#1e5128]" />
            <span>Unduh Rekap Bulanan ({selectedCommodity})</span>
          </button>
        </>
      )}
    </div>
  );
};
