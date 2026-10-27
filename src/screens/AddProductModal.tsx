import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createProduct } from '../services/storage';
import { X, Sprout, Plus, Upload, Check } from 'lucide-react';

export const AddProductModal: React.FC = () => {
  const { isAddHarvestOpen, closeAddHarvest, currentUser, viewProduct } = useApp();

  const [commodityName, setCommodityName] = useState('');
  const [category, setCategory] = useState<'cabai' | 'bawang' | 'sayuran' | 'palawija' | 'beras'>('cabai');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<string>('kg');
  const [quality, setQuality] = useState<string>('Grade A Super');
  const [startingPrice, setStartingPrice] = useState<number>(30000);
  const [minimumOrder, setMinimumOrder] = useState<number>(50);
  const [packaging, setPackaging] = useState<string>('Krat Plastik');
  const [moisture, setMoisture] = useState<string>('< 12% (Kering Angin Segar)');
  const [harvestDate, setHarvestDate] = useState<string>('Hari Ini (Petik Pagi Subuh)');
  const [location, setLocation] = useState<string>(currentUser.location);
  const [description, setDescription] = useState<string>('');
  const [photo, setPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80'
  );

  if (!isAddHarvestOpen) return null;

  const photoPresets = [
    { label: 'Cabai', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bawang', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jagung', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tomat', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodityName.trim() || startingPrice <= 0 || quantity <= 0) return;

    const newProd = createProduct({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerGroupName: currentUser.groupName || 'Poktan Tani Makmur',
      commodityName,
      category,
      photo,
      quantity,
      unit,
      quality,
      startingPrice,
      location,
      description: description || `Hasil panen segar ${commodityName} kualitas ${quality} siap angkut di kebun.`,
      minimumOrder,
      packaging,
      moisture,
      harvestDate,
    });

    closeAddHarvest();
    viewProduct(newProd.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:pb-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c1c9bd]/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e5128] text-white flex items-center justify-center">
              <Sprout className="w-5 h-5 text-[#b8f1b9]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1b1b1e]">
                Pasang Hasil Panen Baru
              </h2>
              <span className="text-[11px] text-[#414940]">Lapak Petani Mandiri</span>
            </div>
          </div>

          <button
            onClick={closeAddHarvest}
            className="p-1.5 rounded-lg text-[#414940] hover:bg-[#f0edf1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
          {/* Commodity Name */}
          <div>
            <label className="font-bold text-[#1b1b1e] block mb-1">
              Nama Komoditas Hasil Panen
            </label>
            <input
              type="text"
              required
              value={commodityName}
              onChange={(e) => setCommodityName(e.target.value)}
              placeholder="Contoh: Cabai Merah Keriting Super"
              className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
            />
          </div>

          {/* Category & Quality */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-[#1b1b1e] block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full h-11 px-3 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              >
                <option value="cabai">Cabai &amp; Rawit</option>
                <option value="bawang">Bawang Merah</option>
                <option value="sayuran">Sayuran Daun/Buah</option>
                <option value="palawija">Jagung &amp; Palawija</option>
                <option value="beras">Padi &amp; Beras</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1b1b1e] block mb-1">Mutu / Grade</label>
              <input
                type="text"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                placeholder="Grade A Super"
                className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-[#1b1b1e] block mb-1">
                Total Stok Panen
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1b1b1e] block mb-1">Satuan</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-11 px-3 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="ton">Ton</option>
                <option value="sak">Sak / Karung</option>
              </select>
            </div>
          </div>

          {/* Starting Price & Minimum Order */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-[#1b1b1e] block mb-1">
                Harga Pembuka Petani (Rp/{unit})
              </label>
              <input
                type="number"
                step={500}
                required
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[#1e5128] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1b1b1e] block mb-1">
                Minimal Pesanan ({unit})
              </label>
              <input
                type="number"
                min={1}
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(Number(e.target.value))}
                className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>
          </div>

          {/* Photo Presets */}
          <div>
            <label className="font-bold text-[#1b1b1e] block mb-1">Foto Panen</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {photoPresets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPhoto(p.url)}
                  className={`h-16 rounded-lg overflow-hidden border-2 relative cursor-pointer ${
                    photo === p.url ? 'border-[#1e5128] ring-1 ring-[#1e5128]' : 'border-transparent'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 text-center font-bold">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Description */}
          <div>
            <label className="font-bold text-[#1b1b1e] block mb-1">Lokasi Kebun / Lahan</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
            />
          </div>

          <div>
            <label className="font-bold text-[#1b1b1e] block mb-1">
              Catatan &amp; Deskripsi Mutu
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Dipanen petik pagi subuh, belum layu. Akses jalan aspal desa muat truk engkel..."
              className="w-full p-3 bg-[#f5f3f6] rounded-xl text-[#1b1b1e] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#c1c9bd]/20">
            <button
              type="button"
              onClick={closeAddHarvest}
              className="h-11 px-4 rounded-xl bg-[#f0edf1] text-[#1b1b1e] font-semibold text-[13px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#1e5128] hover:bg-[#013a13] text-white font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Pasang ke Pasar Tani</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
