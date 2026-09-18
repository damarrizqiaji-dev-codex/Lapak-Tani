import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Home, Store, Users, Receipt, User, Sprout } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, goToTab, activeOffersCount, currentUser } = useApp();
  const isPetani = currentUser.role === 'petani';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'pasar',
      label: isPetani ? 'Lapak Panen' : 'Pasar Grosir',
      icon: isPetani ? <Sprout className="w-5 h-5" /> : <Store className="w-5 h-5" />,
    },
    {
      id: 'transaksi',
      label: isPetani ? 'Nota & Akad' : 'Transaksi',
      icon: <Receipt className="w-5 h-5" />,
      badge: activeOffersCount > 0 ? activeOffersCount : undefined,
    },
    {
      id: 'komunitas',
      label: 'Forum Tani',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'profil',
      label: isPetani ? 'Kebun Saya' : 'Profil Usaha',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const activeColor = isPetani ? 'text-[#1e5128]' : 'text-[#a44a04]';
          return (
            <button
              key={item.id}
              onClick={() => goToTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-12 transition-colors relative cursor-pointer ${
                isActive
                  ? `${activeColor} font-extrabold`
                  : 'text-[#64748b] hover:text-[#0f2316] font-medium'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 bg-[#fe932c] text-[#663500] font-extrabold text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10.5px] leading-tight tracking-tight ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
