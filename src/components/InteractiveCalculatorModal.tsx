import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, Truck, Check, ArrowRight, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface InteractiveCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCommodity?: string;
  defaultPrice?: number;
  defaultQuantity?: number;
}

export const InteractiveCalculatorModal: React.FC<InteractiveCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultCommodity = 'Cabai Merah Keriting',
  defaultPrice = 28500,
  defaultQuantity = 500,
}) => {
  const [commodity, setCommodity] = useState(defaultCommodity);
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [price, setPrice] = useState(defaultPrice);
  const [vehicle, setVehicle] = useState<'pickup' | 'engkel' | 'canter'>('pickup');

  if (!isOpen) return null;

  const grossTotal = quantity * price;
  const platformFee = Math.round(grossTotal * 0.01); // 1% transparent fee
  const netFarmer = grossTotal - platformFee;

  // Logistics cost estimate based on vehicle type
  const vehicleCost = {
    pickup: 350000, // L300 / GranMax (max 1.200 kg)
    engkel: 750000, // Truk 4 roda (max 2.500 kg)
    canter: 1400000, // Truk 6 roda (max 5.000 kg)
  }[vehicle];

  const totalCostTrader = grossTotal + vehicleCost;
  const estimatedResalePrice = Math.round(price * 1.18); // Typical wholesale to regional retail markup 18%
  const estimatedResaleTotal = quantity * estimatedResalePrice;
  const estimatedTraderMargin = estimatedResaleTotal - totalCostTrader;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#c1c9bd]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1e5128] text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-5 h-5 text-[#b8f1b9]" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#1b1b1e]">
                  Kalkulator Panen &amp; Logistik
                </h2>
                <p className="text-[11px] text-[#414940]">
                  Simulasi nilai transaksi riil &amp; estimasi margin angkut
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#414940] hover:bg-[#f0edf1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Commodity & Controls */}
          <div className="space-y-3.5">
            <div>
              <label className="text-[12px] font-bold text-[#1b1b1e] block mb-1">
                Komoditas Panen
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Cabai Merah', 'Bawang Merah', 'Jagung Kering'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCommodity(c);
                      if (c === 'Cabai Merah') setPrice(28500);
                      if (c === 'Bawang Merah') setPrice(33000);
                      if (c === 'Jagung Kering') setPrice(5800);
                    }}
                    className={`py-2 px-2.5 text-[12px] font-semibold rounded-lg border transition-all cursor-pointer ${
                      commodity.includes(c.split(' ')[0])
                        ? 'bg-[#1e5128] text-white border-[#1e5128] shadow-xs'
                        : 'bg-[#f5f3f6] text-[#414940] border-transparent hover:bg-[#eae7eb]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider & Input */}
            <div className="bg-[#f9f9fb] p-3.5 rounded-xl border border-[#c1c9bd]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1b1b1e]">Volume Panen (kg)</span>
                <span className="text-[15px] font-extrabold text-[#1e5128] bg-white px-2.5 py-0.5 rounded-md border border-[#c1c9bd]/30 shadow-xs">
                  {quantity.toLocaleString('id-ID')} kg
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#1e5128] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#71796f] font-medium">
                <span>100 kg</span>
                <span>1.000 kg</span>
                <span>2.500 kg</span>
                <span>5.000 kg</span>
              </div>
            </div>

            {/* Price per Kg Slider & Input */}
            <div className="bg-[#f9f9fb] p-3.5 rounded-xl border border-[#c1c9bd]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1b1b1e]">Harga Kesepakatan /kg</span>
                <span className="text-[15px] font-extrabold text-[#904d00] bg-white px-2.5 py-0.5 rounded-md border border-[#c1c9bd]/30 shadow-xs">
                  {formatRupiah(price)}
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="60000"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#904d00] cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {[15000, 28500, 33000, 45000].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrice(p)}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#c1c9bd]/30 text-[#414940] hover:text-[#1b1b1e] font-medium transition-colors"
                  >
                    Rp {(p / 1000).toFixed(0)}rb
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="text-[12px] font-bold text-[#1b1b1e] block mb-1">
                Estimasi Armada Angkut
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pickup', label: 'Pick-up L300', cap: 'Max 1.2 Ton', cost: 'Rp 350rb' },
                  { id: 'engkel', label: 'Truk Engkel', cap: 'Max 2.5 Ton', cost: 'Rp 750rb' },
                  { id: 'canter', label: 'Truk Canter', cap: 'Max 5.0 Ton', cost: 'Rp 1.4jt' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicle(v.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      vehicle === v.id
                        ? 'bg-[#1e5128]/10 border-[#1e5128] text-[#013a13]'
                        : 'bg-white border-[#c1c9bd]/30 text-[#414940] hover:bg-[#f5f3f6]'
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1 text-[#1e5128]" />
                    <span className="text-[12px] font-bold block leading-tight">{v.label}</span>
                    <span className="text-[10px] text-[#71796f] block">{v.cap}</span>
                    <span className="text-[11px] font-semibold text-[#1e5128] mt-0.5 block">{v.cost}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Computation Result Cards */}
            <div className="border border-[#c1c9bd]/30 rounded-xl overflow-hidden divide-y divide-[#c1c9bd]/20 bg-white">
              {/* Petani Perspective */}
              <div className="p-3.5 bg-[#f5fbf6] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#013a13] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#1e5128]" />
                    Penerimaan Petani (Penjual)
                  </span>
                  <span className="text-[11px] font-semibold text-[#1e5128] bg-white px-2 py-0.5 rounded-full border border-[#1e5128]/20">
                    Bersih di Lahan
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-[11px] text-[#414940] space-y-0.5">
                    <div>Nilai Kotor: {formatRupiah(grossTotal)}</div>
                    <div>Biaya Layanan (1%): -{formatRupiah(platformFee)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#414940] block">Terima Bersih Petani:</span>
                    <span className="text-[18px] font-extrabold text-[#013a13]">
                      {formatRupiah(netFarmer)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pedagang Perspective */}
              <div className="p-3.5 bg-[#fffaf5] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#663500] flex items-center gap-1">
                    <Truck className="w-4 h-4 text-[#904d00]" />
                    Modal &amp; Estimasi Margin Pedagang
                  </span>
                  <span className="text-[11px] font-semibold text-[#904d00] bg-white px-2 py-0.5 rounded-full border border-[#904d00]/20">
                    Grosir ke Pasar
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-[11px] text-[#414940] space-y-0.5">
                    <div>Total Modal (Beli + Angkut): {formatRupiah(totalCostTrader)}</div>
                    <div>Proyeksi Jual: {formatRupiah(estimatedResaleTotal)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#414940] block">Estimasi Laba Kotor:</span>
                    <span className="text-[17px] font-extrabold text-[#904d00]">
                      {formatRupiah(estimatedTraderMargin)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1e5128] hover:bg-[#013a13] text-white font-bold text-[14px] transition-colors cursor-pointer"
          >
            Terapkan &amp; Tutup Simulasi
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
