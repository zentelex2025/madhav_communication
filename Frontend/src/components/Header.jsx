import React from 'react';
import { 
  Store, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  ShoppingCart, 
  FileText, 
  Package, 
  BarChart3, 
  Settings,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ activeTab, setActiveTab, cartCount = 0, onOpenCart }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="no-print bg-slate-900 text-white shadow-lg sticky top-0 z-40">
      {/* Top Contact Strip */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
            East of Santi Market, Teacher Colony, Post-Bahadurpur, Sakin Colony, Kumhrar, Housing Colony, PS-Agamkuan, Patna, Bihar-800026
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              +91  7277715180

            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block font-mono text-slate-400 text-[11px]">
              GSTIN: <strong className="text-slate-200">10EHNPK2687B1ZI</strong>
            </span>
            <a
              href="https://wa.me/918409946197?text=Hello%20Shri%20Narayan%20Telecom,%20I%20am%20inquiring%20about%20mobile%20phones."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp Store
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('storefront')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              MC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                 Madhav Communication
                </span>
                <span className="hidden sm:inline-block bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  PATNA
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
                Deals in: Apple • Samsung • OnePlus • Vivo • Oppo • Realme • Xiaomi
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'storefront'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Showcase</span>
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'billing'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Billing POS</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'products'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Inventory</span>
                </button>

                <button
                  onClick={() => setActiveTab('bills')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'bills'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Bills History</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    activeTab === 'settings'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Shop Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="hidden lg:block text-right">
                    <div className="text-xs font-bold text-slate-200">{user?.name?.split(' ')[0]}</div>
                    <div className="text-[10px] text-amber-400 uppercase">Shopkeeper</div>
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Shopkeeper Login</span>
              </button>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
