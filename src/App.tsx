import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginRegisterScreen } from './screens/LoginRegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MarketplaceScreen } from './screens/MarketplaceScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { AjukanPenawaranScreen } from './screens/AjukanPenawaranScreen';
import { RuangNegosiasiScreen } from './screens/RuangNegosiasiScreen';
import { TransactionDetailScreen } from './screens/TransactionDetailScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { PriceInfoScreen } from './screens/PriceInfoScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TransactionsListScreen } from './screens/TransactionsListScreen';
import { AddProductModal } from './screens/AddProductModal';
import { Toast } from './components/Toast';
import { InteractiveCalculatorModal } from './components/InteractiveCalculatorModal';

const AppContent: React.FC = () => {
  const { activeView, activeTab, toast, closeToast, isCalculatorOpen, closeCalculator } = useApp();

  // 1. Full-screen Login / Register flow
  if (activeView.type === 'login') {
    return (
      <>
        <LoginRegisterScreen />
        <Toast toast={toast} onClose={closeToast} />
      </>
    );
  }

  // 2. Focused Detail and Workflow Views
  if (activeView.type === 'product-detail') {
    return (
      <main className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-20">
          <ProductDetailScreen productId={activeView.productId} />
        </div>
        <Toast toast={toast} onClose={closeToast} />
        <InteractiveCalculatorModal isOpen={isCalculatorOpen} onClose={closeCalculator} />
      </main>
    );
  }

  if (activeView.type === 'ajukan-penawaran') {
    return (
      <main className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-20">
          <AjukanPenawaranScreen productId={activeView.productId} />
        </div>
        <Toast toast={toast} onClose={closeToast} />
        <InteractiveCalculatorModal isOpen={isCalculatorOpen} onClose={closeCalculator} />
      </main>
    );
  }

  if (activeView.type === 'ruang-negosiasi') {
    return (
      <main className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-20">
          <RuangNegosiasiScreen offerId={activeView.offerId} />
        </div>
        <Toast toast={toast} onClose={closeToast} />
        <InteractiveCalculatorModal isOpen={isCalculatorOpen} onClose={closeCalculator} />
      </main>
    );
  }

  if (activeView.type === 'transaction-detail') {
    return (
      <main className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-20">
          <TransactionDetailScreen transactionId={activeView.transactionId} />
        </div>
        <Toast toast={toast} onClose={closeToast} />
        <InteractiveCalculatorModal isOpen={isCalculatorOpen} onClose={closeCalculator} />
      </main>
    );
  }

  // 3. Tabbed Views
  return (
    <div className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e] flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-20">
        {activeTab === 'beranda' && <HomeScreen />}
        {activeTab === 'pasar' && <MarketplaceScreen />}
        {activeTab === 'komunitas' && <CommunityScreen />}
        {activeTab === 'transaksi' && <TransactionsListScreen />}
        {activeTab === 'profil' && <ProfileScreen />}
        {activeTab === 'harga' && <PriceInfoScreen />}
      </main>
      <BottomNav />
      <AddProductModal />
      <InteractiveCalculatorModal isOpen={isCalculatorOpen} onClose={closeCalculator} />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
