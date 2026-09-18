import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { getProducts } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Sprout, 
  Store,
  CheckCircle2, 
  Info, 
  ArrowRight, 
  PlusCircle, 
  Calculator,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Edit,
  Eye
} from 'lucide-react';

export const MarketplaceScreen: React.FC = () => {
  const { viewProduct, openAjukanPenawaran, openAddHarvest, openCalculator, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedLocation, setSelectedLocation] = useState<string>('semua');
  const [selectedSort, setSelectedSort] = useState<'terbaru' | 'harga_terendah' | 'stok_terbanyak'>('terbaru');
  const [farmerOnlyFilter, setFarmerOnlyFilter] = useState<'semua' | 'kebun_saya'>('semua');

  const isPetani = currentUser.role === 'petani';
  const allProducts = getProducts();

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
  const filteredProducts = allProducts.filter(p => {
    if (isPetani && farmerOnlyFilter === 'kebun_saya' && p.farmerId !== currentUser.id) {
      return false;
    }
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

  const myProductsCount = allProducts.filter(p => p.farmerId === currentUser.id).length;

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. Header Banner with Consistent Role Context */}
      <section className={`p-4.5 rounded-2xl shadow-xs border space-y-2 ${
        isPetani 
          ? 'bg-[#edf7ed] border-[#c4e1c5]' 
          : 'bg-white border-[#e2e8f0]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            isPetani 
              ? 'bg-[#1e5128] text-white' 
              : 'bg-[#fff5eb] text-[#a44a04] border border-[#fed7aa]'
          }`}>
            {isPetani ? 'Laman Pengelolaan Hasil Kebun' : 'Pasar Grosir Panen Langsung'}
          </span>
          <span className="text-[11px] font-semibold text-[#52525b] flex items-center gap-1">
            <ShieldCheck className={`w-3.5 h-3.5 ${isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]'}`} />
            Bebas Biaya Komisi
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-[21px] font-extrabold text-[#0f2316] leading-snug tracking-tight">
              {isPetani ? 'Katalog Lapak & Panen Tani' : 'Komoditas Tani Siap Angkut'}
            </h1>
            <p className="text-[13px] text-[#52525b] leading-relaxed">
              {isPetani
                ? 'Pantau produk panen yang Anda pajang, cek harga pesaing di wilayah sekitar, atau pasang komoditas baru.'
                : 'Temukan komoditas pangan segar kualitas teruji, ajukan negosiasi harga wajar, dan atur armada timbang kebun.'}
            </p>
          </div>

          {/* If Petani: prominent + Pasang Panen button right in header */}
          {isPetani && (
            <button
              onClick={openAddHarvest}
              className="h-11 px-4 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-extrabold text-[13px] flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>+ Pasang Panen Baru</span>
            </button>
          )}
        </div>

        {/* Petani Segment Switch: Panen Saya vs Semua Panen Wilayah */}
        {isPetani && (
          <div className="pt-2 border-t border-[#c4e1c5]/60 flex items-center gap-2">
            <button
              onClick={() => setFarmerOnlyFilter('semua')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold transition-colors cursor-pointer ${
                farmerOnlyFilter === 'semua'
                  ? 'bg-[#1e5128] text-white'
                  : 'bg-white text-[#1e5128] border border-[#c4e1c5]'
              }`}
            >
              Semua Panen Wilayah ({allProducts.length})
            </button>
            <button
              onClick={() => setFarmerOnlyFilter('kebun_saya')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold transition-colors cursor-pointer ${
                farmerOnlyFilter === 'kebun_saya'
                  ? 'bg-[#1e5128] text-white'
                  : 'bg-white text-[#1e5128] border border-[#c4e1c5]'
              }`}
            >
              Panen Kebun Saya ({myProductsCount})
            </button>
          </div>
        )}
      </section>

      {/* 2. Search & Sort Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari komoditas (cabai, jagung, bawang, tomat, beras...)"
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
              onClick={() => { setSearchTerm(''); setSelectedCategory('semua'); setSelectedLocation('semua'); setFarmerOnlyFilter('semua'); }}
              className="mt-2 text-[12px] font-bold text-[#1e5128] underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isOwnProduct = isPetani && product.farmerId === currentUser.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-xs border overflow-hidden transition-all ${
                  isOwnProduct 
                    ? 'border-[#1e5128] ring-1 ring-[#1e5128]/20' 
                    : 'border-[#e2e8f0] hover:border-[#1e5128]/40'
                }`}
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
                    {isOwnProduct && (
                      <span className="bg-[#b8f1b9] text-[#002108] font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-xs">
                        🌾 Kebun Milik Anda
                      </span>
                    )}
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
                        {product.farmerName} {isOwnProduct && '(Anda)'}
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

                  {/* Price & Role-Specific Action Area */}
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

                    {/* ROLE-SPECIFIC CTA BUTTONS */}
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

                      {/* If the user is PEDAGANG -> can propose price offer (Tawar) */}
                      {!isPetani && (
                        <button
                          onClick={() => openAjukanPenawaran(product.id)}
                          className="h-10 px-3.5 rounded-xl bg-[#a44a04] hover:bg-[#853c03] text-white font-bold text-[13px] flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          <span>Tawar Harga</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {/* If the user is PETANI and it's their own product */}
                      {isPetani && isOwnProduct && (
                        <button
                          onClick={() => viewProduct(product.id)}
                          className="h-10 px-3.5 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[13px] flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          <span>Kelola Panen</span>
                        </button>
                      )}

                      {/* If the user is PETANI looking at other farmers' products -> price reference */}
                      {isPetani && !isOwnProduct && (
                        <button
                          onClick={() => viewProduct(product.id)}
                          className="h-10 px-3.5 rounded-xl bg-[#edf7ed] hover:bg-[#e2f2e3] text-[#1e5128] border border-[#c4e1c5] font-bold text-[13px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Pantau</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 6. Farmer Promotion Banner (Only shown if Pedagang wants to inform farmers, or Petani wants to add harvest) */}
      <section className={`p-4.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isPetani 
          ? 'bg-[#edf7ed] border-[#c4e1c5]' 
          : 'bg-[#fff5eb] border-[#fed7aa]'
      }`}>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className={`text-[14px] font-extrabold ${isPetani ? 'text-[#0f3d1e]' : 'text-[#8a3800]'}`}>
            {isPetani ? 'Ada jadwal petik atau panen baru minggu ini?' : 'Ingin terhubung dengan kelompok tani tertentu?'}
          </h4>
          <p className={`text-[12px] ${isPetani ? 'text-[#1e5128]/90' : 'text-[#8a3800]/90'}`}>
            {isPetani 
              ? 'Pasang stok panen segar Anda agar pedagang dari berbagai daerah dapat mengajukan tawar harga langsung.'
              : 'Gunakan fitur Forum Komunitas untuk memesan kebutuhan spesifikasi komoditas atau hubungi langsung ketua poktan.'}
          </p>
        </div>

        {isPetani ? (
          <button
            onClick={openAddHarvest}
            className="h-10 px-4 bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[13px] rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Pasang Hasil Panen</span>
          </button>
        ) : (
          <button
            onClick={openCalculator}
            className="h-10 px-4 bg-[#a44a04] hover:bg-[#853c03] text-white font-bold text-[13px] rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Muatan Truk</span>
          </button>
        )}
      </section>
    </div>
  );
};
