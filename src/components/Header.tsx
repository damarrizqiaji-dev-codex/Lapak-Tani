import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Sprout, Store, ArrowLeftRight, HelpCircle, Database } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole, 
    activeOffersCount, 
    goToTab, 
    openGuide,
    openDatabaseModal,
    isSupabaseLive
  } = useApp();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const isPetani = currentUser.role === 'petani';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0] shadow-xs pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-2xl mx-auto h-15 sm:h-16 px-2.5 sm:px-4 flex items-center justify-between gap-1.5">
        {/* Brand & Identity */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none shrink min-w-0"
          onClick={() => goToTab('beranda')}
        >
          <div className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 transition-colors ${
            isPetani ? 'bg-[#1e5128] text-white' : 'bg-[#a44a04] text-white'
          }`}>
            {isPetani ? (
              <Sprout className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#b8f1b9]" />
            ) : (
              <Store className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#ffdcc3]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[15px] sm:text-[17px] font-extrabold text-[#0f2316] leading-tight tracking-tight whitespace-nowrap">
                Lapak Tani
              </span>
              <span className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                isPetani 
                  ? 'bg-[#edf7ed] text-[#1e5128] border border-[#c4e1c5]' 
                  : 'bg-[#fff5eb] text-[#a44a04] border border-[#fed7aa]'
              }`}>
                {isPetani ? 'Petani' : 'Pedagang'}
              </span>
            </div>
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-[#64748b] leading-tight truncate max-w-[110px] sm:max-w-[160px]">
              {currentUser.name}
            </span>
          </div>
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick role toggle button */}
          <button
            onClick={() => switchUserRole(isPetani ? 'pedagang' : 'petani')}
            title="Ganti Peran Antara Petani & Pedagang"
            className={`flex items-center gap-1 h-8 px-2 sm:px-2.5 rounded-xl border text-[11px] sm:text-[11.5px] font-bold transition-all active:scale-95 cursor-pointer ${
              isPetani 
                ? 'bg-[#edf7ed] text-[#0f3d1e] border-[#c4e1c5] hover:bg-[#e2f2e3]' 
                : 'bg-[#fff5eb] text-[#8a3800] border-[#fed7aa] hover:bg-[#ffedd5]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
            <span className="capitalize">{isPetani ? 'Pedagang' : 'Petani'}</span>
          </button>

          {/* Database Cloud Live Indicator & Config */}
          <button
            onClick={openDatabaseModal}
            title={isSupabaseLive ? 'Database Supabase Cloud Terhubung (Live)' : 'Konfigurasi Database Cloud'}
            className={`flex items-center justify-center gap-1 h-8 px-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className={`w-2 h-2 rounded-full shrink-0 ${isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden md:inline">
              {isSupabaseLive ? 'Live' : 'Set'}
            </span>
          </button>

          {/* Guide / Panduan Cara Kerja */}
          <button
            onClick={openGuide}
            title="Panduan Alur Transaksi"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1e5128] bg-[#f1f5f2] hover:bg-[#e4ece5] transition-colors cursor-pointer shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-[#1e5128]" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => goToTab('transaksi')}
            aria-label="Pemberitahuan Transaksi"
            className="w-8 h-8 flex items-center justify-center text-[#52525b] hover:text-[#0f2316] relative rounded-xl hover:bg-[#f8faf9] transition-colors cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4" />
            {activeOffersCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-3.5 px-0.5 bg-[#dc2626] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {activeOffersCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={() => goToTab('profil')}
            title="Buka Profil Akun"
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11.5px] font-extrabold shrink-0 shadow-2xs transition-transform active:scale-95 cursor-pointer ${
              isPetani 
                ? 'bg-[#edf7ed] text-[#0f3d1e] border border-[#c4e1c5]' 
                : 'bg-[#fff5eb] text-[#8a3800] border border-[#fed7aa]'
            }`}
          >
            {getInitials(currentUser.name)}
          </button>
        </div>
      </div>
    </header>
  );
};
