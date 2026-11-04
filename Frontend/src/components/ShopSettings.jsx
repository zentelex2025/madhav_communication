import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Building2, CreditCard, FileCheck, Phone } from 'lucide-react';
import { api } from '../services/api.js';

export default function ShopSettings() {
  const [settings, setSettings] = useState({
    shop_name: 'Madhav Communication',
    tagline: 'Deals in : All types of Mobile & Accessories',
    address: 'KAZIPUR QUARTER ROAD NO-3 NEAR-RADHE SHYAM MANDIR PATNA-800004',
    phone: '8409946197',
    whatsapp_number: '918409946197',
    email: 'manishkumarmehta97@gmail.com',
    gstin: '10DUEPK6618D1Z2',
    hsn_default: '85171300',
    salesman_name: 'Saket kumar',
    bank_name: 'STATE BANK OF INDIA',
    account_no: '389201948192',
    ifsc_code: 'SBIN0001234',
    upi_id: '8409946197@upi',
    terms_1: '1.No Refund after Sale of Any Mobiles.',
    terms_2: '2.All Subject to "PATNA" Jurisdiction Only.',
    jurisdiction: 'PATNA',
    default_gst_percent: 18.00
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.shop.getSettings();
      if (res.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.error('Failed to load shop settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.shop.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            Store Profile & Tax Invoice Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure GST registration, bank account details, and legal invoice terms
          </p>
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Store Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            Store Identity & GST Registration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Store Legal Name</label>
              <input
                type="text"
                required
                value={settings.shop_name}
                onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold uppercase text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Deals In / Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Registered Showroom Address</label>
              <textarea
                rows="2"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">GSTIN Number</label>
              <input
                type="text"
                required
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Default HSN/SAC Code</label>
              <input
                type="text"
                value={settings.hsn_default}
                onChange={(e) => setSettings({ ...settings, hsn_default: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-blue-500" />
            Contact & Support
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">WhatsApp Number (with 91)</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Store Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Bank & Settlement Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CreditCard className="w-4 h-4 text-emerald-500" />
            Bank Account & UPI Details (Printed on Invoice)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Account Number</label>
              <input
                type="text"
                value={settings.account_no}
                onChange={(e) => setSettings({ ...settings, account_no: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">IFSC Code</label>
              <input
                type="text"
                value={settings.ifsc_code}
                onChange={(e) => setSettings({ ...settings, ifsc_code: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">UPI ID</label>
              <input
                type="text"
                value={settings.upi_id}
                onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Terms & Legal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileCheck className="w-4 h-4 text-purple-500" />
            Terms & Conditions (Printed on Invoice Footer)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Condition 1</label>
              <input
                type="text"
                value={settings.terms_1}
                onChange={(e) => setSettings({ ...settings, terms_1: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Condition 2 & Jurisdiction</label>
              <input
                type="text"
                value={settings.terms_2}
                onChange={(e) => setSettings({ ...settings, terms_2: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
