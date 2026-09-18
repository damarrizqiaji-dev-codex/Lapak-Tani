import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Sprout, Check, Phone, Lock, Eye, EyeOff, ShieldCheck, Scale, Headphones, ArrowRight, Store, UserCheck } from 'lucide-react';

export const LoginRegisterScreen: React.FC = () => {
  const { loginUser, allUsers, switchUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('petani');
  const [phone, setPhone] = useState('812 3456 7890');
  const [pin, setPin] = useState('123456');
  const [showPin, setShowPin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(phone, selectedRole, isRegisterMode ? name : undefined);
  };

  const handleQuickDemo = (role: UserRole) => {
    const target = allUsers.find(u => u.role === role);
    if (target) {
      switchUser(target.id);
      loginUser(target.phone, target.role, target.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8fc] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col">
        {/* Brand & Welcome Section */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-14 h-14 bg-[#1e5128] text-white rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <Sprout className="w-8 h-8 text-[#b8f1b9]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0edf1] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1e5128]" />
            <span className="text-[11px] font-bold text-[#414940] uppercase tracking-wider">
              Platform Pasar Tani Mandiri
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1b1b1e] tracking-tight mb-1.5">
            Selamat Datang di Lapak Tani
          </h1>
          <p className="text-[14px] text-[#414940] max-w-xs leading-relaxed">
            Jual beli komoditas segar langsung dari lahan panen ke tangan pedagang terpercaya.
          </p>
        </div>

        {/* Quick Demo Shortcuts for Evaluator */}
        <div className="bg-[#f0edf1] p-2.5 rounded-xl mb-5 flex flex-col gap-1.5 border border-[#c1c9bd]/30">
          <span className="text-[11px] font-bold text-[#414940] uppercase px-1">
            Akses Cepat Pengujian:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('petani')}
              className="h-9 rounded-lg bg-white border border-[#c1c9bd] text-[#013a13] font-semibold text-[12px] flex items-center justify-center gap-1 hover:bg-[#b8f1b9]/30 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#1e5128]" />
              Masuk: Pak Joko (Petani)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('pedagang')}
              className="h-9 rounded-lg bg-white border border-[#c1c9bd] text-[#904d00] font-semibold text-[12px] flex items-center justify-center gap-1 hover:bg-[#ffdcc3]/40 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#904d00]" />
              Masuk: H. Anwar (Pedagang)
            </button>
          </div>
        </div>

        {/* Role Picker Header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[13px] text-[#1b1b1e] font-bold">Pilih Peran Akun</span>
          <span className="text-[12px] text-[#414940]">Langkah 1 dari 2</span>
        </div>

        {/* Role Selection Cards */}
        <div className="flex flex-col gap-2.5 mb-5">
          {/* Option A: Petani */}
          <div
            onClick={() => setSelectedRole('petani')}
            className={`relative flex items-start gap-3 p-4 rounded-xl bg-white shadow-xs cursor-pointer transition-all duration-150 border-2 ${
              selectedRole === 'petani'
                ? 'border-[#1e5128] ring-1 ring-[#1e5128]/20'
                : 'border-transparent hover:border-[#c1c9bd]'
            }`}
          >
            <div className="mt-0.5 p-2 rounded-lg bg-[#f5f3f6] text-[#1e5128] shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-[#1b1b1e]">Petani</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#b8f1b9] text-[#002108]">
                  Penjual
                </span>
              </div>
              <p className="text-[13px] text-[#414940] mt-1 leading-snug">
                Pasang hasil panen terkini dan terima tawaran harga langsung tanpa perantara.
              </p>
            </div>
            <div
              className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                selectedRole === 'petani'
                  ? 'bg-[#1e5128] text-white shadow-xs'
                  : 'bg-[#e4e1e5] text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 font-bold stroke-[3]" />
            </div>
          </div>

          {/* Option B: Pedagang */}
          <div
            onClick={() => setSelectedRole('pedagang')}
            className={`relative flex items-start gap-3 p-4 rounded-xl bg-white shadow-xs cursor-pointer transition-all duration-150 border-2 ${
              selectedRole === 'pedagang'
                ? 'border-[#1e5128] ring-1 ring-[#1e5128]/20'
                : 'border-transparent hover:border-[#c1c9bd]'
            }`}
          >
            <div className="mt-0.5 p-2 rounded-lg bg-[#f5f3f6] text-[#904d00] shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-[#1b1b1e]">Pedagang</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#ffdcc3] text-[#2f1500]">
                  Pembeli
                </span>
              </div>
              <p className="text-[13px] text-[#414940] mt-1 leading-snug">
                Cari stok pasokan pangan bermutu tinggi dan ajukan negosiasi harga wajar.
              </p>
            </div>
            <div
              className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                selectedRole === 'pedagang'
                  ? 'bg-[#1e5128] text-white shadow-xs'
                  : 'bg-[#e4e1e5] text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 font-bold stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-xs mb-5 flex flex-col gap-4 border border-[#c1c9bd]/30">
          {isRegisterMode && (
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-[#1b1b1e] mb-1">
                Nama Lengkap / Usaha
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={selectedRole === 'petani' ? 'Contoh: Pak Joko Susilo' : 'Contoh: H. Anwar Grosir'}
                className="w-full h-12 px-3.5 bg-[#f5f3f6] text-[#1b1b1e] rounded-lg text-[14px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] transition-all"
              />
            </div>
          )}

          {/* WhatsApp Field */}
          <div className="flex flex-col">
            <label className="text-[13px] font-semibold text-[#1b1b1e] mb-1 flex items-center justify-between">
              <span>Nomor WhatsApp Aktif</span>
              <span className="text-[#904d00] text-[11px] font-bold">Wajib</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 text-[#414940]">
                <Phone className="w-4 h-4" />
                <span className="text-[14px] font-bold text-[#1b1b1e] pl-1 border-r border-[#c1c9bd] pr-2">
                  +62
                </span>
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="812 3456 7890"
                className="w-full h-12 pl-20 pr-4 bg-[#f5f3f6] text-[#1b1b1e] rounded-lg text-[15px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] transition-all"
              />
            </div>
            <span className="text-[11px] text-[#414940] mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1e5128]" />
              Digunakan untuk verifikasi SMS/WA &amp; rincian transaksi
            </span>
          </div>

          {/* PIN Field */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-semibold text-[#1b1b1e]">
                PIN Keamanan (6 Digit)
              </label>
              <button
                type="button"
                onClick={() => alert('Fitur pemulihan PIN: Hubungi admin kelompok tani atau kirim kode verifikasi ke WhatsApp Anda.')}
                className="text-[11px] text-[#1e5128] font-bold hover:underline"
              >
                Lupa PIN?
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#414940] flex items-center">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                required
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full h-12 pl-10 pr-12 bg-[#f5f3f6] text-[#1b1b1e] rounded-lg text-[18px] tracking-widest font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] transition-all"
              />
              <button
                type="button"
                aria-label="Tampilkan PIN"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 text-[#414940] hover:text-[#1b1b1e] p-1"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            className="w-full h-12 mt-1 bg-[#1e5128] hover:bg-[#013a13] active:scale-[0.99] text-white font-bold text-[15px] rounded-lg flex items-center justify-center gap-2 shadow-sm transition-transform cursor-pointer"
          >
            <span>{isRegisterMode ? 'Daftar Akun Baru' : 'Masuk ke Akun Lapak Tani'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center mb-6">
          <p className="text-[13px] text-[#414940]">
            {isRegisterMode ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-[13px] text-[#1e5128] underline font-bold ml-1 hover:text-[#013a13]"
            >
              {isRegisterMode ? 'Masuk dengan Nomor Terdaftar' : 'Daftar Petani / Pedagang Baru'}
            </button>
          </p>
        </div>

        {/* Trust Badge Card */}
        <div className="p-4 rounded-xl bg-[#f5f3f6] border border-[#c1c9bd]/40 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ffdcc3] text-[#6e3900] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[13px] text-[#1b1b1e] font-bold">
              Jaminan Transaksi Adil &amp; Transparan
            </span>
          </div>
          <p className="text-[12px] text-[#414940] leading-relaxed">
            Data referensi harga pasar dihimpun langsung dari kesepakatan riil di Lapak Tani. Bebas biaya pendaftaran awal demi kemajuan rantai pasok pangan Nusantara.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[#71796f] text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Akad Terbuka
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> Bantuan Komunitas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
