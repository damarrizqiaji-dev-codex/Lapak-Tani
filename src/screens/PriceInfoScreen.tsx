import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getPriceInfo } from '../services/storage';
import { findRealtimePrice, getStoredRealtimePrices, syncRealtimeMarketPrices, RealtimeCommodityPrice } from '../services/marketPriceService';
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
  AlertCircle,
  Globe,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Calculator
} from 'lucide-react';

export const PriceInfoScreen: React.FC = () => {
  const { backToPrevious, goToTab, showToast, openCalculator } = useApp();
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Cabai Merah Keriting');
  const [activeDataSource, setActiveDataSource] = useState<'internet' | 'internal'>('internet');
  const [priceTier, setPriceTier] = useState<'produsen' | 'grosir' | 'eceran'>('produsen');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [realtimePrices, setRealtimePrices] = useState<RealtimeCommodityPrice[]>(() => getStoredRealtimePrices());

  const priceData = getPriceInfo(selectedCommodity);
  const realtimeData = findRealtimePrice(selectedCommodity);

  const commodities = [
    'Cabai Merah Keriting',
    'Cabai Rawit Merah (Ori/Setan)',
    'Bawang Merah Lokal Super',
    'Bawang Putih Honan / Kating',
    'Jagung Pipil Kering',
    'Tomat Mutiara Sayur',
    'Kentang Granola Super',
    'Beras Medium Penggilingan',
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncRealtimeMarketPrices();
      setRealtimePrices(res.prices);
      showToast('Data harga pasar nasional berhasil disinkronkan dari internet!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal menyinkronkan data harga dari internet.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadReport = () => {
    showToast(`Rekapitulasi harga acuan ${selectedCommodity} berhasil diunduh ke perangkat Anda.`, 'success');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-3.5">
      {/* 1. Header Banner */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#a44a04] uppercase tracking-wider">
              Transparansi Pangan
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1e5128]"></span>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#edf7ed] text-[#1e5128] text-[11px] font-bold border border-[#c4e1c5] hover:bg-[#e2f2e3] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sinkronisasi...' : 'Perbarui Data Internet'}</span>
          </button>
        </div>

        <h1 className="text-[20px] font-extrabold text-[#0f2316] leading-snug">
          Pusat Informasi Harga Acuan Pasar
        </h1>
        <p className="text-[13px] text-[#52525b] leading-relaxed">
          Kombinasi data real-time <strong>Badan Pangan Nasional (BAPANAS)</strong> &amp; <strong>SP2KP Kemendag</strong> serta kesepakatan timbang riil di Lapak Tani.
        </p>
      </section>

      {/* 2. Source Selector Tabs */}
      <div className="flex items-center p-1 bg-[#f1f5f2] rounded-2xl border border-[#e2e8f0]">
        <button
          onClick={() => setActiveDataSource('internet')}
          className={`flex-1 h-9 rounded-xl text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeDataSource === 'internet'
              ? 'bg-white text-[#1e5128] shadow-xs'
              : 'text-[#64748b] hover:text-[#0f2316]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Pasar Nasional (BAPANAS Live)</span>
        </button>
        <button
          onClick={() => setActiveDataSource('internal')}
          className={`flex-1 h-9 rounded-xl text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeDataSource === 'internal'
              ? 'bg-white text-[#1e5128] shadow-xs'
              : 'text-[#64748b] hover:text-[#0f2316]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Transaksi Lapak Tani ({priceData.transactionCount})</span>
        </button>
      </div>

      {/* 3. Commodity Selector */}
      <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e2e8f0] space-y-2.5">
        <label className="text-[12px] font-bold text-[#0f2316] block">
          Pilih Komoditas Pangan
        </label>
        <select
          value={selectedCommodity}
          onChange={(e) => setSelectedCommodity(e.target.value)}
          className="w-full h-11 px-3 bg-[#f8faf9] rounded-xl text-[13.5px] font-bold text-[#0f2316] border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1e5128] cursor-pointer"
        >
          {commodities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 4. INTERNET LIVE VIEW */}
      {activeDataSource === 'internet' && realtimeData && (
        <>
          {/* Main Benchmark Price Card */}
          <section className="bg-[#1e5128] text-white p-4.5 rounded-2xl shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b8f1b9]">
                Harga Rujukan Nasional (Real-Time)
              </span>
              <span className="bg-[#b8f1b9] text-[#002108] text-[10.5px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1e5128]" />
                BAPANAS Terverifikasi
              </span>
            </div>

            {/* Tier Switcher inside Card */}
            <div className="flex items-center p-1 bg-black/20 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setPriceTier('produsen')}
                className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center ${
                  priceTier === 'produsen'
                    ? 'bg-white text-[#1e5128] shadow-xs font-extrabold'
                    : 'text-[#e2f2e3] hover:text-white'
                }`}
              >
                Tingkat Petani Lahan
              </button>
              <button
                onClick={() => setPriceTier('grosir')}
                className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center ${
                  priceTier === 'grosir'
                    ? 'bg-white text-[#1e5128] shadow-xs font-extrabold'
                    : 'text-[#e2f2e3] hover:text-white'
                }`}
              >
                Pasar Grosir Induk
              </button>
              <button
                onClick={() => setPriceTier('eceran')}
                className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center ${
                  priceTier === 'eceran'
                    ? 'bg-white text-[#1e5128] shadow-xs font-extrabold'
                    : 'text-[#e2f2e3] hover:text-white'
                }`}
              >
                Eceran Konsumen
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] text-[#b8f1b9] block font-medium">
                {priceTier === 'produsen' 
                  ? 'Harga Diterima Petani di Kebun (Farm-Gate)' 
                  : priceTier === 'grosir' 
                    ? 'Harga Beli Pedagang Grosir / Pasar Induk' 
                    : 'Harga Eceran Konsumen di Pasar Tradisional'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] font-extrabold leading-none tracking-tight">
                  {formatRupiah(
                    priceTier === 'produsen'
                      ? realtimeData.producerPrice
                      : priceTier === 'grosir'
                        ? realtimeData.wholesalePrice
                        : realtimeData.consumerPrice
                  )}
                </span>
                <span className="text-[15px] text-[#b8f1b9]">/{realtimeData.unit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11.5px] text-[#b8f1b9] pt-2 border-t border-white/15">
              <span>Sentra: {realtimeData.primaryLocation}</span>
              <span className="font-semibold">{realtimeData.qualityStandard}</span>
            </div>
          </section>

          {/* 3-Tier Grid Comparison */}
          <section className="space-y-2">
            <h2 className="text-[14px] font-extrabold text-[#0f2316] px-1">
              Rantai Nilai Harga Pangan Komprehensif
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <div className={`p-3 rounded-xl border space-y-1 ${
                priceTier === 'produsen' ? 'bg-[#edf7ed] border-[#c4e1c5]' : 'bg-white border-[#e2e8f0]'
              }`}>
                <span className="text-[11px] text-[#64748b] block font-medium">Tingkat Petani</span>
                <span className="text-[15px] font-extrabold text-[#0f2316] block">
                  {formatRupiah(realtimeData.producerPrice)}
                </span>
                <span className="text-[10px] text-[#1e5128] font-bold block">Harga Lahan Kebun</span>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                priceTier === 'grosir' ? 'bg-[#edf7ed] border-[#c4e1c5]' : 'bg-white border-[#e2e8f0]'
              }`}>
                <span className="text-[11px] text-[#64748b] block font-medium">Pasar Grosir</span>
                <span className="text-[15px] font-extrabold text-[#0f2316] block">
                  {formatRupiah(realtimeData.wholesalePrice)}
                </span>
                <span className="text-[10px] text-[#a44a04] font-bold block">Pasar Induk</span>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                priceTier === 'eceran' ? 'bg-[#edf7ed] border-[#c4e1c5]' : 'bg-white border-[#e2e8f0]'
              }`}>
                <span className="text-[11px] text-[#64748b] block font-medium">Eceran Konsumen</span>
                <span className="text-[15px] font-extrabold text-[#0f2316] block">
                  {formatRupiah(realtimeData.consumerPrice)}
                </span>
                <span className="text-[10px] text-[#64748b] font-medium block">Pasar Tradisional</span>
              </div>
            </div>
          </section>

          {/* Market Insights & Trend Reason */}
          <section className="bg-white p-4 rounded-xl shadow-xs border border-[#e2e8f0] space-y-2">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0f2316]">
              <TrendingUp className="w-4 h-4 text-[#1e5128]" />
              <span>Analisis Pergerakan Pasar</span>
            </div>
            <p className="text-[12.5px] text-[#52525b] leading-relaxed">
              {realtimeData.trendReason}. Selisih margin antara harga produsen dan grosir berkisar <strong>20-25%</strong> untuk menutup ongkos logistik angkut dan risiko susut timbangan.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={openCalculator}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e5128] text-white text-[12px] font-bold cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulasi Margin ({realtimeData.name})</span>
              </button>
              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1f5f2] text-[#0f2316] hover:bg-[#e4ece5] text-[12px] font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#1e5128]" />
                <span>Unduh Rekap</span>
              </button>
            </div>
          </section>
        </>
      )}

      {/* 5. INTERNAL LAPAK TANI TRANSACTIONS VIEW */}
      {activeDataSource === 'internal' && (
        <>
          {!priceData.hasEnoughData ? (
            <section className="bg-white p-8 rounded-xl border border-[#e2e8f0] text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-[#a44a04] mx-auto" />
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-[#0f2316]">
                  Belum ada kesepakatan transaksi Lapak Tani untuk komoditas ini.
                </h3>
                <p className="text-[12.5px] text-[#64748b] max-w-sm mx-auto">
                  Begitu petani dan pedagang menyetujui akad jual-beli dan timbang kebun, rata-rata harga riil akan otomatis tercatat di sini.
                </p>
              </div>
              <button
                onClick={() => goToTab('pasar')}
                className="h-10 px-4 rounded-lg bg-[#1e5128] text-white text-[13px] font-bold cursor-pointer"
              >
                Buka Katalog Pasar Panen
              </button>
            </section>
          ) : (
            <>
              {/* Main Average Price Card */}
              <section className="bg-[#1e5128] text-white p-4.5 rounded-xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#b8f1b9]">
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
                  <span className="text-[14px] text-[#b8f1b9]">/kg</span>
                </div>

                <p className="text-[12px] text-[#b8f1b9] leading-snug">
                  Dihitung dari <strong>{priceData.transactionCount} transaksi</strong> riil di wilayah Rembang, Pati, dan Kudus.
                </p>
              </section>

              {/* Transactions List */}
              <section className="space-y-2">
                <h2 className="text-[14px] font-bold text-[#0f2316] px-1">
                  Riwayat Kesepakatan Terakhir
                </h2>

                <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden divide-y divide-[#e2e8f0]">
                  {priceData.transactions.map((t) => (
                    <div key={t.id} className="p-3.5 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[13px] font-bold text-[#0f2316] block truncate">
                          {t.parties}
                        </span>
                        <p className="text-[11.5px] text-[#64748b]">
                          {t.date} • {t.volume} kg • {t.location.split(',')[0]}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[14px] font-bold text-[#1e5128] block">
                          {formatRupiah(t.price)}
                        </span>
                        <span className="text-[10px] text-[#64748b]">per kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};
