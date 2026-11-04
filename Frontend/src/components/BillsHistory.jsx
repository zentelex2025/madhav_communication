import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  Calendar, 
  User, 
  Phone, 
  IndianRupee, 
  Share2, 
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';

export default function BillsHistory({ onPrintBill }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await api.bills.getAll(params);
      setBills(res.bills || []);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBills();
  };

  const handleReset = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    fetchBills();
  };

  const handleViewBill = async (billId) => {
    try {
      const res = await api.bills.getById(billId);
      if (res.bill && onPrintBill) {
        onPrintBill(res.bill);
      }
    } catch (err) {
      alert('Error fetching bill details: ' + err.message);
    }
  };

  const totalFilteredSales = bills.reduce((acc, b) => acc + Number(b.grand_total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            Tax Invoices & Billing Archive
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search invoices by number, customer phone, reprint bills anytime in A4 or thermal receipt format
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Volume</span>
            <span className="font-black text-slate-900 text-sm">
              ₹{totalFilteredSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={fetchBills}
            title="Refresh"
            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Date Range Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Invoice #, Customer Name, or Phone (e.g. 2686, Rajesh, 8210)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">From:</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">To:</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
        >
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg"
        >
          Reset
        </button>
      </form>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Taxable Amt</th>
                <th className="p-3.5 text-right">Grand Total</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Reprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    Loading invoices...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-slate-900">
                      #{b.invoice_no}
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium">
                      {new Date(b.invoice_date).toLocaleDateString('en-GB')}
                    </td>

                    <td className="p-3.5 font-bold text-slate-800 uppercase">
                      {b.customer_name}
                    </td>

                    <td className="p-3.5 font-mono text-slate-600">
                      {b.customer_phone}
                    </td>

                    <td className="p-3.5 text-center font-bold">
                      {b.total_qty || b.items_count || 1}
                    </td>

                    <td className="p-3.5 text-right font-mono text-slate-600">
                      ₹{Number(b.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3.5 text-right font-mono font-black text-slate-900 text-sm">
                      ₹{Number(b.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.payment_mode === 'EMI' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.payment_mode || 'Cash'} {b.finance_company ? `(${b.finance_company})` : ''}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleViewBill(b.id)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bill</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
