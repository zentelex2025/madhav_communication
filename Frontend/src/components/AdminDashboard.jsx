import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  Receipt, 
  Package, 
  AlertTriangle, 
  PlusCircle, 
  ShoppingCart, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Printer
} from 'lucide-react';
import { api } from '../services/api.js';

export default function AdminDashboard({ onNavigate, onPrintBill }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.products.getDashboard();
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = async (billId) => {
    try {
      const res = await api.bills.getById(billId);
      if (res.bill && onPrintBill) {
        onPrintBill(res.bill);
      }
    } catch (err) {
      alert('Failed to load invoice for reprinting: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-slate-500 text-sm mt-3">Loading sales metrics & inventory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            Showroom POS Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time sales tracking, stock counts, and GST billing controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            title="Refresh metrics"
            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" /> Add Mobile
          </button>
          <button
            onClick={() => onNavigate('billing')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" /> New Tax Invoice
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Sales</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{Number(stats?.todaySales || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {stats?.todayBills || 0} bills today
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bills</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalBills || 0}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              All time revenue: ₹{Number(stats?.totalSales || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Physical Stock Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Physical Stock</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalStockCount || 0} <span className="text-xs text-slate-500 font-medium">units</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Across {stats?.totalModelsCount || 0} phone models
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Alert</p>
            <h3 className={`text-2xl font-black mt-1 ${
              (stats?.lowStockCount || 0) > 0 ? 'text-red-600' : 'text-slate-900'
            }`}>
              {stats?.lowStockCount || 0} <span className="text-xs text-slate-500 font-medium">models</span>
            </h3>
            <p className="text-[11px] text-red-600 font-medium mt-1">
              {(stats?.lowStockCount || 0) > 0 ? 'Requires IMEI restocking' : 'Stock levels optimal'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Two Column Grid: Low Stock Alert List & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Low Stock Items */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900">Low Stock / Attention Required</h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
            >
              Manage Inventory <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {(stats?.lowStockProducts || []).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No low stock items. All products have healthy inventory!
            </div>
          ) : (
            <div className="space-y-2">
              {stats.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {p.brand} {p.model}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {p.variant} • {p.color}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                      p.stock_quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.stock_quantity === 0 ? '0 Left (Sold Out)' : `${p.stock_quantity} Left`}
                    </span>
                    <button
                      onClick={() => onNavigate('products')}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-[11px] text-slate-800"
                    >
                      + IMEI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Bills */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-sm text-slate-900">Recent Invoices Generated</h2>
            </div>
            <button
              onClick={() => onNavigate('bills')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All Bills <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {(stats?.recentBills || []).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No bills recorded yet. Create your first bill via POS!
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentBills.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs hover:bg-slate-100/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Invoice #{b.invoice_no}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(b.invoice_date).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {b.customer_name} ({b.customer_phone})
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <span className="font-black text-slate-900 text-sm">
                      ₹{Number(b.grand_total).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleReprint(b.id)}
                      title="Reprint Bill"
                      className="p-1.5 bg-white border border-slate-200 hover:bg-amber-50 hover:border-amber-400 rounded-lg text-slate-700 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
