import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import CustomerStorefront from './components/CustomerStorefront.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProductManagement from './components/ProductManagement.jsx';
import BillingPOS from './components/BillingPOS.jsx';
import BillsHistory from './components/BillsHistory.jsx';
import ShopSettings from './components/ShopSettings.jsx';
import BillPrintModal from './components/BillPrintModal.jsx';
import { api } from './services/api.js';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('storefront');
  const [activeBillForPrint, setActiveBillForPrint] = useState(null);
  const [productForPOS, setProductForPOS] = useState(null);

  // Check URL query parameters (e.g. ?invoice=2686)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invoiceNo = params.get('invoice');
    if (invoiceNo) {
      loadBillByInvoiceNo(invoiceNo);
    }
  }, []);

  const loadBillByInvoiceNo = async (invoiceNo) => {
    try {
      const res = await api.bills.getByInvoiceNo(invoiceNo);
      if (res.bill) {
        setActiveBillForPrint(res.bill);
      }
    } catch (err) {
      console.warn('Could not load invoice from URL parameter:', err);
    }
  };

  const handleSelectProductForPOS = (product) => {
    setProductForPOS(product);
    setActiveTab('billing');
  };

  const handleBillGenerated = (bill) => {
    setActiveBillForPrint(bill);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">Initializing Shri Narayan Telecom System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1">
        {activeTab === 'storefront' && (
          <CustomerStorefront
            onSelectProductForPOS={isAuthenticated ? handleSelectProductForPOS : null}
            isAdmin={isAuthenticated}
          />
        )}

        {activeTab === 'login' && (
          <AdminLogin
            onSuccess={() => setActiveTab('dashboard')}
          />
        )}

        {/* Protected Routes for Shopkeeper */}
        {isAuthenticated && (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                onNavigate={(tab) => setActiveTab(tab)}
                onPrintBill={(bill) => setActiveBillForPrint(bill)}
              />
            )}

            {activeTab === 'billing' && (
              <BillingPOS
                onBillGenerated={handleBillGenerated}
                initialProduct={productForPOS}
              />
            )}

            {activeTab === 'products' && (
              <ProductManagement />
            )}

            {activeTab === 'bills' && (
              <BillsHistory
                onPrintBill={(bill) => setActiveBillForPrint(bill)}
              />
            )}

            {activeTab === 'settings' && (
              <ShopSettings />
            )}
          </>
        )}
      </main>

      {/* Pixel-Accurate Bill Print Modal */}
      {activeBillForPrint && (
        <BillPrintModal
          bill={activeBillForPrint}
          onClose={() => setActiveBillForPrint(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
