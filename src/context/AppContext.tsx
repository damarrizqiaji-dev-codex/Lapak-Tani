import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Product, Offer, Transaction } from '../types';
import {
  getCurrentUser,
  setCurrentUserId,
  getAllUsers,
  getProducts,
  getOffers,
  getTransactions,
  registerOrLoginUser,
  initStorage,
} from '../services/storage';

export type ActiveTab = 'beranda' | 'pasar' | 'komunitas' | 'transaksi' | 'profil' | 'harga';

export type ActiveView = 
  | { type: 'tabs' }
  | { type: 'product-detail'; productId: string }
  | { type: 'ajukan-penawaran'; productId: string }
  | { type: 'ruang-negosiasi'; offerId: string }
  | { type: 'transaction-detail'; transactionId: string }
  | { type: 'login' };

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  activeTab: ActiveTab;
  activeView: ActiveView;
  isAddHarvestOpen: boolean;
  isCalculatorOpen: boolean;
  isGuideOpen: boolean;
  activeOffersCount: number;
  activeTransactionsCount: number;
  toast: { id: string; message: string; type?: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  closeToast: () => void;
  openCalculator: () => void;
  closeCalculator: () => void;
  openGuide: () => void;
  closeGuide: () => void;
  goToTab: (tab: ActiveTab) => void;
  viewProduct: (productId: string) => void;
  openAjukanPenawaran: (productId: string) => void;
  openRuangNegosiasi: (offerId: string) => void;
  viewTransaction: (transactionId: string) => void;
  backToPrevious: () => void;
  openAddHarvest: () => void;
  closeAddHarvest: () => void;
  switchUserRole: (newRole: UserRole) => void;
  switchUser: (userId: string) => void;
  loginUser: (phone: string, role: UserRole, name?: string) => void;
  logout: () => void;
  refreshAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    initStorage();
    return getCurrentUser();
  });
  const [allUsers, setAllUsers] = useState<User[]>(() => getAllUsers());
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'tabs' });
  const [historyStack, setHistoryStack] = useState<ActiveView[]>([]);
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ id: string; message: string; type?: 'success' | 'info' | 'warning' } | null>(null);
  const [version, setVersion] = useState<number>(0);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 3800);
  };

  const closeToast = () => setToast(null);
  const openCalculator = () => setIsCalculatorOpen(true);
  const closeCalculator = () => setIsCalculatorOpen(false);
  const openGuide = () => setIsGuideOpen(true);
  const closeGuide = () => setIsGuideOpen(false);

  const refreshAll = () => {
    setCurrentUser(getCurrentUser());
    setAllUsers(getAllUsers());
    setVersion(v => v + 1);
  };

  useEffect(() => {
    initStorage();
    refreshAll();
  }, []);

  const goToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setActiveView({ type: 'tabs' });
    setHistoryStack([]);
  };

  const pushView = (view: ActiveView) => {
    setHistoryStack(prev => [...prev, activeView]);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToPrevious = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack(historyStack.slice(0, -1));
      setActiveView(prev);
    } else {
      setActiveView({ type: 'tabs' });
    }
  };

  const viewProduct = (productId: string) => {
    pushView({ type: 'product-detail', productId });
  };

  const openAjukanPenawaran = (productId: string) => {
    pushView({ type: 'ajukan-penawaran', productId });
  };

  const openRuangNegosiasi = (offerId: string) => {
    pushView({ type: 'ruang-negosiasi', offerId });
  };

  const viewTransaction = (transactionId: string) => {
    pushView({ type: 'transaction-detail', transactionId });
  };

  const openAddHarvest = () => setIsAddHarvestOpen(true);
  const closeAddHarvest = () => {
    setIsAddHarvestOpen(false);
    refreshAll();
  };

  const switchUserRole = (newRole: UserRole) => {
    const users = getAllUsers();
    // Switch to appropriate counterpart (Pak Joko for petani, H. Anwar for pedagang)
    const targetUser = users.find(u => u.role === newRole) || users[0];
    setCurrentUserId(targetUser.id);
    setCurrentUser(targetUser);
    refreshAll();
    showToast(
      newRole === 'petani'
        ? 'Beralih ke Mode Petani — Kelola hasil panen & tawar-menawar'
        : 'Beralih ke Mode Pedagang — Jelajahi pasar komoditas & ajukan harga',
      'info'
    );
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const users = getAllUsers();
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Aktif sebagai ${found.name} (${found.role})`, 'info');
    }
    refreshAll();
  };

  const loginUser = (phone: string, role: UserRole, name?: string) => {
    const user = registerOrLoginUser(phone, role, name);
    setCurrentUser(user);
    setActiveView({ type: 'tabs' });
    setActiveTab('beranda');
    refreshAll();
    showToast(`Selamat datang, ${user.name}!`, 'success');
  };

  const logout = () => {
    setActiveView({ type: 'login' });
  };

  // Compute active badges
  const offers = getOffers();
  const transactions = getTransactions();
  const activeOffersCount = offers.filter(o => 
    o.status === 'menunggu' || o.status === 'dinegosiasi'
  ).length;
  const activeTransactionsCount = transactions.filter(t => 
    t.status === 'disepakati' || t.status === 'diproses'
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        activeTab,
        activeView,
        isAddHarvestOpen,
        isCalculatorOpen,
        isGuideOpen,
        activeOffersCount,
        activeTransactionsCount,
        toast,
        showToast,
        closeToast,
        openCalculator,
        closeCalculator,
        openGuide,
        closeGuide,
        goToTab,
        viewProduct,
        openAjukanPenawaran,
        openRuangNegosiasi,
        viewTransaction,
        backToPrevious,
        openAddHarvest,
        closeAddHarvest,
        switchUserRole,
        switchUser,
        loginUser,
        logout,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
