import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { getProducts } from '../services/storage';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Sprout, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  PlusCircle, 
  Calculator,
  ShieldCheck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export const MarketplaceScreen: React.FC = () => {
  const { viewProduct, openAjukanPenawaran, openAddHarvest, openCalculator, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedLocation, setSelectedLocation] = useState<string>('semua');
  const [selectedSort, setSelectedSort] = useState<'terbaru' | 'harga_terendah' | 'stok_terbanyak'>('terbaru');

  const products = getProducts();

  const categories = [
    { id: 'semua', label: 'Semua Komoditas' },
    { id: 'cabai', label: 'Cabai & Rawit' },
    { id: 'bawang', label: 'Bawang Merah' },
    { id: 'palawija', label: 'Jagung & Palawija' },
    { id: 'sayuran', label: 'Sayuran & Buah' },
  ];

  const locations = [
    { id: 'semua', label: 'Semua Wilayah' },
    { id: 'rembang', label: 'Rembang' },
    { id: 'brebes', label: 'Brebes' },
    { id: 'pati', label: 'Pati' },
    { id: 'grobogan', label: 'Grobogan' },
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchSearch = p.commodityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'semua' || p.category === selectedCategory;
    const matchLocation = selectedLocation === 'semua' || p.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchSearch && matchCategory && matchLocation;
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    if (selectedSort === 'harga_terendah') return a.startingPrice - b.startingPrice;
    if (selectedSort === 'stok_terbanyak') return b.quantity - a.quantity;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. Header Banner */}
      <section className="bg-white p-4.5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-[#a44a04] uppercase tracking-wider">
            Pasar Grosir Terbuka
          </span>
          <span className="text-[11px] font-semibold text-[#1e5128] bg-[#edf7ed] px-2 py-0.5 rounded-md border border-[#c4e1c5]">
            Langsung Dari Lahan
          </span>
        </div>
        <h1 className="text-[21px] font-extrabold text-[#0f2316] leading-snug tracking-tight">
          Komoditas Tani Segar
        </h1>
        <p className="text-[13px] text-[#52525b] leading-relaxed">
          Beli langsung dari petani dengan transparansi timbangan di kebun dan ruang tawar harga tanpa perantara tersembunyi.
        </p>
      </section>

      {/* 2. Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari komoditas (cabai, jagung, bawang, tomat...)"
            className="w-full h-11 pl-10 pr-3.5 bg-white text-[#0f2316] rounded-xl text-[13px] border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#1e5128] transition-all placeholder:text-[#a1a1aa]"
          />
        </div>
        <button
          onClick={() => setSelectedSort(s => s === 'terbaru' ? 'harga_terendah' : s === 'harga_terendah' ? 'stok_terbanyak' : 'terbaru')}
          title="Urutkan Komoditas"
          className="h-11 px-3.5 bg-white text-[#0f2316] rounded-xl border border-[#e2e8f0] flex items-center justify-center gap-1.5 shrink-0 text-[12px] font-bold hover:bg-[#f8faf9] cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#1e5128]" />
          <span className="hidden sm:inline">
            {selectedSort === 'terbaru' ? 'Terbaru' : selectedSort === 'harga_terendah' ? 'Termurah' : 'Stok Terbanyak'}
          </span>
        </button>
      </div>

      {/* 3. Category Carousel Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-8.5 px-3.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1e5128] text-white shadow-xs'
                  : 'bg-white text-[#52525b] border border-[#e2e8f0] hover:bg-[#f8faf9]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Region Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar -mx-1 px-1">
        <span className="text-[11px] font-bold text-[#71717a] shrink-0 mr-1">Wilayah:</span>
        {locations.map((loc) => {
          const isActive = selectedLocation === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#fff5eb] text-[#8a3800] border border-[#fed7aa]'
                  : 'bg-white text-[#71717a] border border-[#e2e8f0]/80 hover:bg-[#f8faf9]'
              }`}
            >
              {loc.label}
            </button>
          );
        })}
      </div>

      {/* 5. Products Grid */}
      <div className="flex flex-col gap-3.5">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] text-center space-y-2">
            <p className="text-[14px] font-bold text-[#0f2316]">Tidak ada komoditas ditemukan.</p>
            <p className="text-[12px] text-[#64748b]">Coba ganti kata kunci pencarian atau bersihkan filter wilayah.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('semua'); setSelectedLocation('semua'); }}
              className="mt-2 text-[12px] font-bold text-[#1e5128] underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xs border border-[#e2e8f0] overflow-hidden hover:border-[#1e5128]/40 transition-colors"
            >
              {/* Top Photo & Badges */}
              <div className="relative h-44 w-full bg-[#eae7eb] overflow-hidden">
                <img
                  src={product.photo}
                  alt={product.commodityName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="bg-[#1e5128]/95 text-white font-bold text-[11px] px-2.5 py-1 rounded-md shadow-xs backdrop-blur-xs">
                    {product.quality}
                  </span>
                  {product.harvestDate && (
                    <span className="bg-white/95 text-[#0f2316] font-semibold text-[11px] px-2 py-1 rounded-md shadow-xs backdrop-blur-xs">
                      {product.harvestDate}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="bg-[#0f2316]/85 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    Tersedia: {product.quantity.toLocaleString('id-ID')} {product.unit}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-3">
                {/* Farmer & Location Info */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#edf7ed] text-[#0f3d1e] flex items-center justify-center text-[11px] font-extrabold shrink-0">
                      {product.farmerName[0]}
                    </div>
                    <span className="text-[13px] font-bold text-[#0f2316] truncate">
                      {product.farmerName}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#1e5128] shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[11.5px] text-[#52525b] shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#1e5128]" />
                    <span>{product.location.split(',')[0]}</span>
                  </div>
                </div>

                {/* Commodity Title */}
                <div>
                  <h3 
                    onClick={() => viewProduct(product.id)}
                    className="text-[17px] font-bold text-[#0f2316] hover:text-[#1e5128] cursor-pointer transition-colors leading-snug"
                  >
                    {product.commodityName}
                  </h3>
                  <p className="text-[12.5px] text-[#52525b] line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Spec Badges Row */}
                <div className="flex flex-wrap gap-2 text-[11px] text-[#52525b]">
                  {product.minimumOrder && (
                    <span className="bg-[#f8faf9] px-2.5 py-1 rounded-md font-medium border border-[#e2e8f0]/60">
                      Min. Ambil: <strong className="text-[#0f2316]">{product.minimumOrder} {product.unit}</strong>
                    </span>
                  )}
                  {product.packaging && (
                    <span className="bg-[#f8faf9] px-2.5 py-1 rounded-md font-medium border border-[#e2e8f0]/60">
                      Kemasan: <strong className="text-[#0f2316]">{product.packaging}</strong>
                    </span>
                  )}
                </div>

                {/* Price & Action Area */}
                <div className="pt-2 border-t border-[#e2e8f0]/80 flex items-end justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[#71717a] block font-medium">
                      Harga Buka Petani
                    </span>
                    <div className="text-[20px] font-extrabold text-[#1e5128] leading-tight">
                      {formatRupiah(product.startingPrice)}{' '}
                      <span className="text-[12px] font-normal text-[#71717a]">/{product.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={openCalculator}
                      title="Simulasi margin angkut"
                      className="h-10 px-2.5 rounded-xl bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#1e5128] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Calculator className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => viewProduct(product.id)}
                      className="h-10 px-3 rounded-xl bg-[#f8faf9] hover:bg-[#f1f5f2] text-[#0f2316] font-bold text-[13px] border border-[#e2e8f0] transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => openAjukanPenawaran(product.id)}
                      className="h-10 px-3.5 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[13px] flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>Tawar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 6. Farmer Promotion Banner */}
      <section className="bg-[#fff5eb] p-4.5 rounded-2xl border border-[#fed7aa] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-[14px] font-extrabold text-[#8a3800]">
            Punya hasil panen siap jual di kebun Anda?
          </h4>
          <p className="text-[12px] text-[#8a3800]/90">
            Daftarkan lapak komoditas langsung tanpa komisi tersembunyi dan terima tawaran langsung dari pedagang.
          </p>
        </div>
        <button
          onClick={openAddHarvest}
          className="h-10 px-4 bg-[#a44a04] hover:bg-[#853c03] text-white font-bold text-[13px] rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Pasang Hasil Panen</span>
        </button>
      </section>
    </div>
  );
};
