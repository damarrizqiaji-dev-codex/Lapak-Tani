import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Sprout, Store, ArrowLeftRight, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, switchUserRole, activeOffersCount, goToTab, logout } = useApp();

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand & Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => goToTab('beranda')}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
            isPetani ? 'bg-[#1e5128] text-white' : 'bg-[#a44a04] text-white'
          }`}>
            {isPetani ? (
              <Sprout className="w-5 h-5 text-[#b8f1b9]" />
            ) : (
              <Store className="w-5 h-5 text-[#ffdcc3]" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-extrabold text-[#0f2316] leading-tight tracking-tight">
                Lapak Tani
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                isPetani 
                  ? 'bg-[#edf7ed] text-[#1e5128] border border-[#c4e1c5]' 
                  : 'bg-[#fff5eb] text-[#a44a04] border border-[#fed7aa]'
              }`}>
                {isPetani ? 'Petani' : 'Pedagang'}
              </span>
            </div>
            <span className="text-[11.5px] font-semibold text-[#64748b] leading-tight truncate max-w-[150px]">
              {currentUser.name}
            </span>
          </div>
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick role toggle button */}
          <button
            onClick={() => switchUserRole(isPetani ? 'pedagang' : 'petani')}
            title="Ganti Peran Antara Petani & Pedagang"
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl border text-[11.5px] font-bold transition-all active:scale-95 cursor-pointer ${
              isPetani 
                ? 'bg-[#edf7ed] text-[#0f3d1e] border-[#c4e1c5] hover:bg-[#e2f2e3]' 
                : 'bg-[#fff5eb] text-[#8a3800] border-[#fed7aa] hover:bg-[#ffedd5]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ganti ke</span>
            <span className="capitalize">{isPetani ? 'Pedagang' : 'Petani'}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => goToTab('transaksi')}
            aria-label="Pemberitahuan Transaksi"
            className="w-9 h-9 flex items-center justify-center text-[#52525b] hover:text-[#0f2316] relative rounded-xl hover:bg-[#f8faf9] transition-colors cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {activeOffersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#dc2626] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={() => goToTab('profil')}
            title="Buka Profil Akun"
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12.5px] font-extrabold shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer ${
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
