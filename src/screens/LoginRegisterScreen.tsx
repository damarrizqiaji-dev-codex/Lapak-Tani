import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Sprout, 
  Store, 
  Check, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Users, 
  Briefcase,
  HelpCircle,
  TrendingUp,
  Scale
} from 'lucide-react';

export const LoginRegisterScreen: React.FC = () => {
  const { loginUser, allUsers, switchUser } = useApp();
  
  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('petani');
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState('0812-3456-7890');
  const [loginPin, setLoginPin] = useState('123456');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPin, setRegPin] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);
  const [regLocation, setRegLocation] = useState('Rembang, Jawa Tengah');
  const [regGroupName, setRegGroupName] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(loginPhone, selectedRole);
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    loginUser(regPhone, selectedRole, regName);
  };

  // Quick Account Selectors
  const handleSelectQuickUser = (role: UserRole) => {
    setSelectedRole(role);
    const target = allUsers.find(u => u.role === role);
    if (target) {
      setLoginPhone(target.phone);
      setLoginPin('123456');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col">
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-[#1e5128] text-white rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <Sprout className="w-8 h-8 text-[#b8f1b9]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf7ed] border border-[#c4e1c5] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1e5128]" />
            <span className="text-[11px] font-extrabold text-[#0f3d1e] uppercase tracking-wider">
              Lapak Tani — Ekosistem Pasar Panen
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0f2316] tracking-tight mb-1">
            {authMode === 'login' ? 'Masuk ke Akun Anda' : 'Pendaftaran Akun Baru'}
          </h1>
          <p className="text-[13.5px] text-[#52525b] max-w-sm leading-relaxed">
            {authMode === 'login'
              ? 'Pilih peran Anda dan nikmati ruang tawar panen terbuka tanpa perantara.'
              : 'Daftarkan profil kebun atau badan usaha grosir Anda untuk akses pasar langsung.'}
          </p>
        </div>

        {/* Tab Switcher: Masuk vs Daftar */}
        <div className="flex bg-[#e8eee9] p-1 rounded-xl mb-4 border border-[#d2ddd3]">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-lg text-[13.5px] font-extrabold transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-[#1e5128] shadow-xs'
                : 'text-[#52525b] hover:text-[#0f2316]'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-lg text-[13.5px] font-extrabold transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white text-[#1e5128] shadow-xs'
                : 'text-[#52525b] hover:text-[#0f2316]'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Peran Akun Card Picker (Consistent Farmer vs Trader distinction) */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12.5px] font-bold text-[#0f2316]">
              1. Pilih Tipe &amp; Peran Akun:
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              selectedRole === 'petani' 
                ? 'bg-[#edf7ed] text-[#1e5128] border border-[#c4e1c5]' 
                : 'bg-[#fff5eb] text-[#a44a04] border border-[#fed7aa]'
            }`}>
              Mode: {selectedRole === 'petani' ? 'Petani / Poktan' : 'Pedagang / Pengepul'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Kartu Petani */}
            <div
              onClick={() => handleSelectQuickUser('petani')}
              className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'petani'
                  ? 'bg-white border-[#1e5128] shadow-sm ring-2 ring-[#1e5128]/15'
                  : 'bg-white/60 border-[#e2e8f0] hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#edf7ed] text-[#1e5128] flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  selectedRole === 'petani' ? 'bg-[#1e5128] text-white' : 'border border-[#cbd5e1] text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
              <div className="text-[14px] font-extrabold text-[#0f2316]">Petani</div>
              <span className="text-[10.5px] font-bold text-[#1e5128] bg-[#edf7ed] px-1.5 py-0.5 rounded inline-block mt-0.5 mb-1">
                Produsen / Penjual
              </span>
              <p className="text-[11.5px] text-[#64748b] leading-snug">
                Pasang hasil panen, terima tawaran harga, dan pantau timbangan kebun.
              </p>
            </div>

            {/* Kartu Pedagang */}
            <div
              onClick={() => handleSelectQuickUser('pedagang')}
              className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === 'pedagang'
                  ? 'bg-white border-[#a44a04] shadow-sm ring-2 ring-[#a44a04]/15'
                  : 'bg-white/60 border-[#e2e8f0] hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#fff5eb] text-[#a44a04] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  selectedRole === 'pedagang' ? 'bg-[#a44a04] text-white' : 'border border-[#cbd5e1] text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
              <div className="text-[14px] font-extrabold text-[#0f2316]">Pedagang</div>
              <span className="text-[10.5px] font-bold text-[#a44a04] bg-[#fff5eb] px-1.5 py-0.5 rounded inline-block mt-0.5 mb-1">
                Pengepul / Pembeli
              </span>
              <p className="text-[11.5px] text-[#64748b] leading-snug">
                Cari pasokan segar skala besar, ajukan tawar harga, &amp; atur armada jemput.
              </p>
            </div>
          </div>
        </div>

        {/* MODE 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="bg-white p-5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-4 mb-4">
            <div className="border-b border-[#e2e8f0] pb-2.5">
              <span className="text-[13px] font-bold text-[#0f2316]">
                2. Masuk sebagai {selectedRole === 'petani' ? 'Petani' : 'Pedagang'}
              </span>
              <p className="text-[11.5px] text-[#64748b]">
                Gunakan nomor HP/WhatsApp yang terdaftar pada akun Anda.
              </p>
            </div>

            {/* Quick Demo Autofill Hint */}
            <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-[#e2e8f0] flex items-center justify-between text-[11.5px]">
              <span className="text-[#52525b]">
                Akun Contoh: <strong className="text-[#0f2316]">{selectedRole === 'petani' ? 'Pak Joko Susilo' : 'H. Anwar Grosir'}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (selectedRole === 'petani') {
                    setLoginPhone('0812-3456-7890');
                  } else {
                    setLoginPhone('0813-9876-5432');
                  }
                  setLoginPin('123456');
                }}
                className="text-[#1e5128] font-bold hover:underline cursor-pointer"
              >
                Isi Otomatis
              </button>
            </div>

            {/* Nomor WhatsApp */}
            <div className="space-y-1">
              <label className="text-[12.5px] font-bold text-[#0f2316] flex items-center justify-between">
                <span>Nomor WhatsApp / HP</span>
                <span className="text-[11px] text-[#1e5128] font-semibold">Aktif</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#64748b]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[13.5px] font-semibold text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
                />
              </div>
            </div>

            {/* PIN Keamanan */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[12.5px] font-bold text-[#0f2316]">
                  PIN Keamanan (6 Digit)
                </label>
                <button
                  type="button"
                  onClick={() => alert('Untuk demo, PIN default adalah: 123456')}
                  className="text-[11px] text-[#1e5128] font-bold hover:underline"
                >
                  Lupa PIN?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#64748b]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showLoginPin ? 'text' : 'password'}
                  maxLength={6}
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="123456"
                  className="w-full h-11 pl-9 pr-10 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[15px] font-bold tracking-widest text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPin(!showLoginPin)}
                  className="absolute right-3 text-[#64748b] hover:text-[#0f2316]"
                >
                  {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full h-11 text-white font-extrabold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                selectedRole === 'petani' 
                  ? 'bg-[#1e5128] hover:bg-[#163f1f]' 
                  : 'bg-[#a44a04] hover:bg-[#853c03]'
              }`}
            >
              <span>Masuk Sebagai {selectedRole === 'petani' ? 'Petani' : 'Pedagang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* MODE 2: REGISTER FORM (Daftar Akun Baru) */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="bg-white p-5 rounded-2xl shadow-xs border border-[#e2e8f0] space-y-3.5 mb-4">
            <div className="border-b border-[#e2e8f0] pb-2.5">
              <span className="text-[13px] font-bold text-[#0f2316]">
                2. Formulir Registrasi {selectedRole === 'petani' ? 'Petani Produsen' : 'Pedagang / Pengepul'}
              </span>
              <p className="text-[11.5px] text-[#64748b]">
                {selectedRole === 'petani' 
                  ? 'Lengkapi data kepemilikan lahan atau kelompok tani Anda.'
                  : 'Lengkapi data usaha grosir / armada angkut Anda.'}
              </p>
            </div>

            {/* Nama Lengkap / Usaha */}
            <div className="space-y-1">
              <label className="text-[12.5px] font-bold text-[#0f2316]">
                {selectedRole === 'petani' ? 'Nama Petani / Pemilik Lahan' : 'Nama Pedagang / Nama Usaha Grosir'}
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={selectedRole === 'petani' ? 'Contoh: Pak Joko Susilo' : 'Contoh: H. Anwar / UD Makmur Sayur'}
                className="w-full h-11 px-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[13.5px] text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>

            {/* Kelompok Tani atau Nama Toko/Pasar */}
            <div className="space-y-1">
              <label className="text-[12.5px] font-bold text-[#0f2316] flex items-center gap-1">
                {selectedRole === 'petani' ? <Users className="w-3.5 h-3.5 text-[#1e5128]" /> : <Briefcase className="w-3.5 h-3.5 text-[#a44a04]" />}
                <span>{selectedRole === 'petani' ? 'Kelompok Tani (Poktan / Gapoktan)' : 'Basis Usaha / Pasar Distribusi'}</span>
              </label>
              <input
                type="text"
                value={regGroupName}
                onChange={(e) => setRegGroupName(e.target.value)}
                placeholder={selectedRole === 'petani' ? 'Contoh: Poktan Tani Makmur Rembang' : 'Contoh: Kios Blok B Pasar Induk Kudus'}
                className="w-full h-11 px-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[13.5px] text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>

            {/* Domisili Lahan / Wilayah Operasional */}
            <div className="space-y-1">
              <label className="text-[12.5px] font-bold text-[#0f2316] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#1e5128]" />
                <span>{selectedRole === 'petani' ? 'Lokasi Lahan Panen' : 'Wilayah Gudang / Operasional'}</span>
              </label>
              <input
                type="text"
                required
                value={regLocation}
                onChange={(e) => setRegLocation(e.target.value)}
                placeholder="Kabupaten / Kota (contoh: Rembang, Jawa Tengah)"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[13.5px] text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="text-[12.5px] font-bold text-[#0f2316]">
                Nomor WhatsApp Aktif
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#64748b]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[13.5px] text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
                />
              </div>
              <span className="text-[10.5px] text-[#64748b]">
                Nomor ini akan digunakan untuk konfirmasi surat jalan &amp; akad nota timbang.
              </span>
            </div>

            {/* PIN Keamanan */}
            <div className="space-y-1">
              <label className="text-[12.5px] font-bold text-[#0f2316]">
                Buat PIN Keamanan (6 Digit)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#64748b]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showRegPin ? 'text' : 'password'}
                  maxLength={6}
                  required
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="Contoh: 123456"
                  className="w-full h-11 pl-9 pr-10 rounded-xl bg-[#f8faf9] border border-[#e2e8f0] text-[15px] font-bold tracking-widest text-[#0f2316] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPin(!showRegPin)}
                  className="absolute right-3 text-[#64748b] hover:text-[#0f2316]"
                >
                  {showRegPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full h-11 text-white font-extrabold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                selectedRole === 'petani' 
                  ? 'bg-[#1e5128] hover:bg-[#163f1f]' 
                  : 'bg-[#a44a04] hover:bg-[#853c03]'
              }`}
            >
              <span>Daftarkan Akun {selectedRole === 'petani' ? 'Petani' : 'Pedagang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Guidance Card */}
        <div className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] text-[12px] text-[#52525b] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#0f2316]">
            <Scale className="w-4 h-4 text-[#1e5128]" />
            <span>Perbedaan Konsisten Peran di Lapak Tani:</span>
          </div>
          <ul className="space-y-1 pl-5 list-disc text-[11.5px] leading-snug">
            <li>
              <strong className="text-[#1e5128]">Laman Petani:</strong> Dasbor manajemen panen kebun, tombol pasang komoditas baru, persetujuan/tolak harga tawaran pedagang, serta buku nota timbang hasil kebun.
            </li>
            <li>
              <strong className="text-[#a44a04]">Laman Pedagang:</strong> Dasbor belanja pasokan, katalog pasar segar lengkap, simulasi margin angkut/truk, serta pengajuan harga beli grosir langsung ke petani.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
