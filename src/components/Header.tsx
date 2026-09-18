import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Sprout, ArrowLeftRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, switchUserRole, activeOffersCount, goToTab } = useApp();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const roleLabel = currentUser.role === 'petani' 
    ? `Petani - ${currentUser.name.split(' ')[1] || currentUser.name}`
    : `Pedagang - ${currentUser.name.split(' ')[0] || currentUser.name}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#fbf8fc]/90 backdrop-blur-xl border-b border-[#c1c9bd]/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand & Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => goToTab('beranda')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#1e5128] text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5 text-[#b8f1b9]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-[#013a13] leading-tight tracking-tight">
              Lapak Tani
            </span>
            <span className="text-[11px] font-semibold text-[#414940] bg-[#f0edf1] px-1.5 py-0.5 rounded-md w-fit">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick role toggle button */}
          <button
            onClick={() => switchUserRole(currentUser.role === 'petani' ? 'pedagang' : 'petani')}
            title="Ganti Peran Antara Petani & Pedagang"
            className="flex items-center gap-1 h-8 px-2.5 rounded-lg bg-[#f0edf1] hover:bg-[#eae7eb] text-[#1b1b1e] text-[12px] font-semibold transition-colors active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#1e5128]" />
            <span className="hidden sm:inline">Mode</span>
            <span className="text-[#1e5128] font-bold capitalize">{currentUser.role}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => goToTab('transaksi')}
            aria-label="Pemberitahuan"
            className="w-10 h-10 flex items-center justify-center text-[#414940] hover:text-[#1b1b1e] relative rounded-full hover:bg-[#f0edf1] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {activeOffersCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse" />
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={() => goToTab('profil')}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 shadow-xs transition-transform active:scale-95 ${
              currentUser.role === 'petani' 
                ? 'bg-[#b8f1b9] text-[#002108]' 
                : 'bg-[#ffdcc3] text-[#2f1500]'
            }`}
          >
            {getInitials(currentUser.name)}
          </button>
        </div>
      </div>
    </header>
  );
};
