import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Smartphone, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  MapPin, 
  Phone, 
  RotateCcw,
  CheckCircle,
  Eye,
  Tag
} from 'lucide-react';
import { api } from '../services/api.js';
import ProductDetailModal from './ProductDetailModal.jsx';

const BRANDS = ['All', 'SAMSUNG', 'Apple', 'OnePlus', 'vivo', 'oppo', 'Xiaomi', 'realme', 'Google'];

export default function CustomerStorefront({ onSelectProductForPOS, isAdmin = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [condition, setCondition] = useState('All');
  const [ram, setRam] = useState('All');
  const [storage, setStorage] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand, condition, ram, storage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedBrand !== 'All') params.brand = selectedBrand;
      if (condition !== 'All') params.condition = condition;
      if (ram !== 'All') params.ram = ram;
      if (storage !== 'All') params.storage = storage;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.products.getPublic(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('All');
    setCondition('All');
    setRam('All');
    setStorage('All');
    setMaxPrice('');
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Showcase Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-10 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Official Mobile Showroom & Service
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-slate-100">
           Madhav Communication
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Browse genuine brand-new and certified mint condition mobile phones with official GST tax invoice and warranty.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Original IMEIs
            </span>
            <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> GST Tax Invoice Included
            </span>
            <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <MapPin className="w-4 h-4 text-blue-400" /> Sakin Colony, Kumhrar, Housing Colony, PS-Agamkuan, Patna, Bihar-800026
            </span>
          </div>

          {/* Quick Notice for Customers */}
          <div className="max-w-xl mx-auto mt-4 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-amber-300 text-xs flex items-center justify-center gap-2">
            <span>📢 Pick your preferred phone below, then visit or message our shopkeeper to generate your bill!</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        
        {/* Search & Brand Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by model (e.g. Galaxy A57, iPhone 16 Pro, OnePlus)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </form>

          {/* Brand Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Brands:
            </span>
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedBrand === b
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="All">All Conditions</option>
                <option value="New">Brand New</option>
                <option value="Used">Pre-owned / Mint</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">RAM</label>
              <select
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="All">Any RAM</option>
                <option value="4GB">4 GB</option>
                <option value="8GB">8 GB</option>
                <option value="12GB">12 GB</option>
                <option value="16GB">16 GB</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Storage</label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="All">Any Storage</option>
                <option value="128GB">128 GB</option>
                <option value="256GB">256 GB</option>
                <option value="512GB">512 GB</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Max Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 60000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={fetchProducts}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-500 text-sm mt-3">Loading available phones...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching mobile phones found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search keywords, clearing your filters, or asking our shopkeeper directly.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => {
              const primaryImg = (p.images || []).find(img => img.is_primary)?.image_url 
                || p.images?.[0]?.image_url 
                || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80';
              
              const isAvailable = (p.stock_quantity > 0) || (p.available_units_count > 0);
              const specs = typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : (p.specs || {});

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
                >
                  {/* Card Image */}
                  <div 
                    onClick={() => setSelectedProduct(p)}
                    className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-slate-100"
                  >
                    <img
                      src={primaryImg}
                      alt={p.model}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                        isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {isAvailable ? `In Stock (${p.stock_quantity || p.available_units_count})` : 'Sold Out'}
                      </span>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        p.condition === 'Used' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white'
                      }`}>
                        {p.condition || 'New'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">
                        {p.brand}
                      </div>
                      <h3 
                        onClick={() => setSelectedProduct(p)}
                        className="font-bold text-slate-900 text-base hover:text-amber-600 cursor-pointer line-clamp-1 mt-0.5"
                      >
                        {p.model}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium">
                        {p.variant} • {p.color}
                      </div>

                      {/* Key specs row */}
                      <div className="mt-2.5 flex flex-wrap gap-1 text-[10px]">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {specs.ram || p.variant.split('/')[0] || '8GB RAM'}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {specs.storage || p.variant.split('/')[1] || '256GB'}
                        </span>
                        {specs.camera && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium truncate max-w-[120px]">
                            {specs.camera.split('+')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Buttons */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-2.5">
                        <div>
                          <span className="text-lg font-black text-slate-900">
                            ₹{Number(p.selling_price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Incl. GST
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {p.warranty_period?.split(' ')[0] || '1 Yr'} War.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        
                        {isAdmin && onSelectProductForPOS ? (
                          <button
                            onClick={() => onSelectProductForPOS(p)}
                            disabled={!isAvailable}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                          >
                            Add POS
                          </button>
                        ) : (
                          <a
                            href={`https://wa.me/918409946197?text=${encodeURIComponent(`Hi Shri Narayan Telecom, I am inquiring about ${p.brand} ${p.model} (${p.variant}) priced at ₹${p.selling_price}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Ask Shop
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Store Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 px-4 mt-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="font-serif font-black text-lg text-white">
              SHRI NARAYAN TELECOM
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Patna's premier mobile showroom for genuine smartphones, original accessories, fast warranty support, and authorized GST billing.
            </p>
            <div className="font-mono text-amber-400 text-[11px]">
              GSTIN : 10EHNPK2687B1ZI
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Showroom Address</h5>
            <p className="text-slate-400 leading-relaxed">
             East of Santi Market, Teacher Colony, <br />
            Post-Bahadurpur, Sakin Colony, Kumhrar<br />
            Housing Colony, PS-Agamkuan, Patna, Bihar-800026
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Contact & Inquiries</h5>
            <p className="text-slate-400">
              Phone: +91 7277715180<br />           
              WhatsApp: +91 8409946197<br />
              Email: manishkumarmehta97@gmail.com
            </p>
            <div className="pt-1">
              <span className="inline-block bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                Open: 10:00 AM - 9:30 PM (All 7 Days)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Finance & Payments</h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Accepting UPI, Cash, Credit/Debit Cards, and 0% Easy EMI Finance via <strong>BAJAJ FINSERV</strong>, Home Credit, and HDFC.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          © {new Date().getFullYear()} Shri Narayan Telecom. All rights reserved. Patna Jurisdiction Only.
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onSelectProductForPOS}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
