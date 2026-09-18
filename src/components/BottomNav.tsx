import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Home, Store, Users, Receipt, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, goToTab, activeOffersCount } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: 'pasar',
      label: 'Pasar',
      icon: <Store className="w-6 h-6" />,
    },
    {
      id: 'komunitas',
      label: 'Komunitas',
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: 'transaksi',
      label: 'Transaksi',
      icon: <Receipt className="w-6 h-6" />,
      badge: activeOffersCount > 0 ? activeOffersCount : undefined,
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: <User className="w-6 h-6" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fbf8fc]/90 backdrop-blur-xl border-t border-[#c1c9bd]/30 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => goToTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 transition-colors relative ${
                isActive
                  ? 'text-[#1e5128] font-bold'
                  : 'text-[#414940] hover:text-[#1b1b1e] font-normal'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 bg-[#fe932c] text-[#663500] font-bold text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-bold text-[#1e5128]' : 'font-medium text-[#414940]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
