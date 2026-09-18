import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  HelpCircle, 
  Sprout, 
  Store, 
  ArrowRight, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Handshake, 
  Sparkles,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, defaultRole = 'petani' }) => {
  const [activeTab, setActiveTab] = useState<'alur' | 'peran' | 'timbang' | 'faq'>('alur');

  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Petani Pasang Hasil Panen',
      desc: 'Petani memotret komoditas langsung di lahan, mencantumkan perkiraan tonase (kg), kualitas (Grade A / B), serta harga pembuka.',
      roleBadge: 'Petani Produsen',
      icon: <Sprout className="w-5 h-5 text-[#1e5128]" />,
      bgColor: 'bg-[#edf7ed]',
      borderColor: 'border-[#c4e1c5]',
    },
    {
      num: '2',
      title: 'Pedagang Menawar Terbuka',
      desc: 'Pedagang grosir menelusuri katalog, menyimulasikan margin logistik angkut, lalu mengajukan harga beli wajar langsung tanpa perantara.',
      roleBadge: 'Pedagang Pasar',
      icon: <Store className="w-5 h-5 text-[#a44a04]" />,
      bgColor: 'bg-[#fff5eb]',
      borderColor: 'border-[#fed7aa]',
    },
    {
      num: '3',
      title: 'Akad Harga & Volume Terkunci',
      desc: 'Kedua belah pihak berunding di Ruang Negosiasi. Begitu disetujui, terbit Surat Jalan & Nota Kesepakatan digital ber-ID resmi.',
      roleBadge: 'Kedua Pihak',
      icon: <Handshake className="w-5 h-5 text-[#1e5128]" />,
      bgColor: 'bg-[#edf7ed]',
      borderColor: 'border-[#c4e1c5]',
    },
    {
      num: '4',
      title: 'Timbang Terbuka & Pelunasan',
      desc: 'Armada pedagang menjemput ke lokasi kebun. Dilakukan timbang terbuka di lahan bersama kelompok tani dan pelunasan nota tanpa potongan calo.',
      roleBadge: 'Di Lahan Panen',
      icon: <Scale className="w-5 h-5 text-[#004d26]" />,
      bgColor: 'bg-[#e8f5e9]',
      borderColor: 'border-[#a5d6a7]',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#1e5128] text-white p-4.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#b8f1b9]" />
              </div>
              <div>
                <h2 className="text-[17px] font-extrabold leading-tight tracking-tight">
                  Panduan Mudah Lapak Tani
                </h2>
                <p className="text-[12px] text-[#b8f1b9] font-medium">
                  Prinsip pasar terbuka langsung antara Petani &amp; Pedagang
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-[#e2e8f0] bg-[#f8faf9] px-3 pt-2 gap-1 shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('alur')}
              className={`px-3 py-2 text-[12.5px] font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'alur'
                  ? 'border-[#1e5128] text-[#1e5128] bg-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              4 Langkah Alur
            </button>
            <button
              onClick={() => setActiveTab('peran')}
              className={`px-3 py-2 text-[12.5px] font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'peran'
                  ? 'border-[#1e5128] text-[#1e5128] bg-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              Petani vs Pedagang
            </button>
            <button
              onClick={() => setActiveTab('timbang')}
              className={`px-3 py-2 text-[12.5px] font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'timbang'
                  ? 'border-[#1e5128] text-[#1e5128] bg-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              Integritas Timbang
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-2 text-[12.5px] font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'border-[#1e5128] text-[#1e5128] bg-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f2316]'
              }`}
            >
              Pertanyaan (FAQ)
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4.5 overflow-y-auto space-y-4 flex-1">
            {/* TAB 1: ALUR TRANSAKSI */}
            {activeTab === 'alur' && (
              <div className="space-y-3">
                <div className="bg-[#edf7ed] p-3 rounded-xl border border-[#c4e1c5] flex items-center gap-2 text-[12px] text-[#0f3d1e]">
                  <Sparkles className="w-4 h-4 text-[#1e5128] shrink-0" />
                  <span>
                    Transaksi 100% langsung: petani memegang kepastian harga, pedagang mendapat pasokan segar dari tangan pertama.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {steps.map((step) => (
                    <div
                      key={step.num}
                      className={`p-3.5 rounded-xl border ${step.borderColor} ${step.bgColor} flex items-start gap-3 transition-all`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white font-extrabold text-[#0f2316] text-[13px] flex items-center justify-center shrink-0 shadow-2xs border border-[#e2e8f0]">
                        {step.num}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-[13.5px] font-extrabold text-[#0f2316]">
                            {step.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#e2e8f0] text-[#52525b]">
                            {step.roleBadge}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#52525b] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: PETANI VS PEDAGANG */}
            {activeTab === 'peran' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Petani Box */}
                  <div className="p-3.5 rounded-xl bg-[#edf7ed] border border-[#c4e1c5] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1e5128] text-white flex items-center justify-center">
                        <Sprout className="w-4 h-4 text-[#b8f1b9]" />
                      </div>
                      <div>
                        <span className="text-[13.5px] font-extrabold text-[#0f2316] block">
                          Peran Petani
                        </span>
                        <span className="text-[11px] text-[#1e5128] font-bold">Produsen Kebun</span>
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-[11.5px] text-[#2e5238]">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5128] shrink-0 mt-0.5" />
                        <span>Pasang komoditas siap panen dengan foto &amp; perkiraan tanggal petik.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5128] shrink-0 mt-0.5" />
                        <span>Terima tawaran harga dari beragam pedagang, tawar balik atau setujui.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5128] shrink-0 mt-0.5" />
                        <span>Tidak ada potongan tengkulak gelap; timbang terbuka di lahan sendiri.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pedagang Box */}
                  <div className="p-3.5 rounded-xl bg-[#fff5eb] border border-[#fed7aa] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#a44a04] text-white flex items-center justify-center">
                        <Store className="w-4 h-4 text-[#ffdcc3]" />
                      </div>
                      <div>
                        <span className="text-[13.5px] font-extrabold text-[#0f2316] block">
                          Peran Pedagang
                        </span>
                        <span className="text-[11px] text-[#a44a04] font-bold">Pengepul / Grosir</span>
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-[11.5px] text-[#8a3800]">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a44a04] shrink-0 mt-0.5" />
                        <span>Cari pasokan segar skala besar (kuintal/ton) langsung dari sumber.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a44a04] shrink-0 mt-0.5" />
                        <span>Gunakan kalkulator armada truk untuk memastikan margin keuntungan.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a44a04] shrink-0 mt-0.5" />
                        <span>Kirim armada jemput dengan Surat Jalan resmi yang terbit otomatis.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#f8faf9] p-3 rounded-xl border border-[#e2e8f0] text-[12px] text-[#52525b] text-center">
                  💡 <em>Anda dapat berganti peran kapan saja lewat tombol di bilah atas untuk melihat perspektif kedua pihak.</em>
                </div>
              </div>
            )}

            {/* TAB 3: TIMBANG BERSAMA */}
            {activeTab === 'timbang' && (
              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] space-y-2">
                  <div className="flex items-center gap-2 text-[#0f2316]">
                    <Scale className="w-4.5 h-4.5 text-[#1e5128]" />
                    <h4 className="text-[14px] font-extrabold">Standar Integritas Timbang Lapak Tani</h4>
                  </div>
                  <p className="text-[12px] text-[#52525b] leading-relaxed">
                    Masalah utama tata niaga panen tradisional adalah timbangan curang dan potongan tara berlebihan oleh tengkulak. Lapak Tani menerapkan 3 prinsip utama:
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#edf7ed] border border-[#c4e1c5] text-[11.5px] text-[#0f3d1e]">
                      <strong>1. Timbang di Hadapan Saksi:</strong> Dilakukan langsung di lokasi kebun atau posko poktan disaksikan perwakilan kedua belah pihak.
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#edf7ed] border border-[#c4e1c5] text-[11.5px] text-[#0f3d1e]">
                      <strong>2. Bebas Potongan Sepihak:</strong> Toleransi susut wadah (keranjang/karung) disepakati terlebih dahulu sebelum timbangan dimulai.
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#edf7ed] border border-[#c4e1c5] text-[11.5px] text-[#0f3d1e]">
                      <strong>3. Validasi Nota Digital:</strong> Hasil timbang dicatat pada Surat Jalan resmi dan menjadi dasar pelunasan akhir.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white border border-[#e2e8f0] space-y-1">
                  <h5 className="text-[12.5px] font-bold text-[#0f2316]">
                    Apakah ada biaya potongan komisi transaksi?
                  </h5>
                  <p className="text-[11.5px] text-[#52525b] leading-relaxed">
                    Tidak ada biaya komisi tersembunyi. Platform Lapak Tani bertujuan memotong rantai tengkulak dan menghubungkan produsen dengan pembeli grosir secara bebas biaya.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#e2e8f0] space-y-1">
                  <h5 className="text-[12.5px] font-bold text-[#0f2316]">
                    Bagaimana jika harga tawaran pedagang terlalu rendah?
                  </h5>
                  <p className="text-[11.5px] text-[#52525b] leading-relaxed">
                    Petani memiliki hak penuh untuk menolak atau mengajukan tawaran balik (counter offer) di Ruang Negosiasi hingga tercapai kesepakatan harga yang saling menguntungkan.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#e2e8f0] space-y-1">
                  <h5 className="text-[12.5px] font-bold text-[#0f2316]">
                    Siapa yang menanggung biaya armada angkut?
                  </h5>
                  <p className="text-[11.5px] text-[#52525b] leading-relaxed">
                    Secara umum, pedagang mengirimkan armada jemput (pick-up / truk) langsung ke titik kumpul lahan panen petani. Biaya BBM dan sopir ditanggung pedagang dan sudah dihitung dalam margin harga beli.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-3.5 bg-[#f8faf9] border-t border-[#e2e8f0] flex items-center justify-between shrink-0">
            <span className="text-[11.5px] text-[#64748b]">
              Pusat bantuan siap via WhatsApp
            </span>
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold text-[12.5px] cursor-pointer transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
