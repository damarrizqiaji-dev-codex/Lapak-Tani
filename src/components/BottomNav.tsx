import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Home, Store, TrendingUp, Receipt, User, Sprout } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, goToTab, activeOffersCount, currentUser } = useApp();
  const isPetani = currentUser.role === 'petani';

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'pasar',
      label: isPetani ? 'Lapak Panen' : 'Pasar Grosir',
      icon: isPetani ? Sprout : Store,
    },
    {
      id: 'harga',
      label: 'Harga Pasar',
      icon: TrendingUp,
    },
    {
      id: 'transaksi',
      label: isPetani ? 'Nota & Akad' : 'Transaksi',
      icon: Receipt,
      badge: activeOffersCount > 0 ? activeOffersCount : undefined,
    },
    {
      id: 'profil',
      label: isPetani ? 'Kebun Saya' : 'Profil Usaha',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] select-none">
      <div className="max-w-2xl mx-auto flex justify-between items-center h-[calc(4.1rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] px-1 sm:px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const activeBg = isPetani ? 'bg-[#edf7ed] text-[#1e5128]' : 'bg-[#fff5eb] text-[#a44a04]';
          const activeText = isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]';

          return (
            <button
              key={item.id}
              onClick={() => goToTab(item.id)}
              className="flex-1 h-full py-1.5 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div
                  className={`w-11 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? activeBg : 'text-[#64748b] hover:text-[#0f2316]'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 bg-[#dc2626] text-white font-extrabold text-[9px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center leading-none ring-2 ring-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] xs:text-[10.5px] leading-tight tracking-tight max-w-[68px] truncate text-center ${
                  isActive ? `${activeText} font-extrabold` : 'text-[#64748b] font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

