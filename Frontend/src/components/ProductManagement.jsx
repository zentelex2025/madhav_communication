import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Barcode, 
  Smartphone, 
  ShieldCheck, 
  X, 
  Check, 
  AlertCircle,
  PackageCheck,
  ImagePlus
} from 'lucide-react';
import { api } from '../services/api.js';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [unitModalProduct, setUnitModalProduct] = useState(null);
  const [newImei1, setNewImei1] = useState('');
  const [newImei2, setNewImei2] = useState('');
  const [newSerial, setNewSerial] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    color: '',
    condition: 'New',
    purchase_price: '',
    selling_price: '',
    warranty_period: '1 Year Brand Warranty',
    description: '',
    is_visible: true,
    image_url_1: '',
    image_url_2: '',
    ram: '',
    storage: '',
    battery: '',
    camera: '',
    display: '',
    processor: '',
    initial_imeis: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [brandFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (brandFilter !== 'All') params.brand = brandFilter;
      const res = await api.products.getAdmin(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      brand: 'SAMSUNG',
      model: '',
      variant: '8GB / 256GB',
      color: '',
      condition: 'New',
      purchase_price: '',
      selling_price: '',
      warranty_period: '1 Year Brand Warranty',
      description: '',
      is_visible: true,
      image_url_1: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      image_url_2: '',
      ram: '8GB',
      storage: '256GB',
      battery: '5000 mAh',
      camera: '50MP OIS',
      display: '6.6-inch AMOLED 120Hz',
      processor: '',
      initial_imeis: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    const specs = typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : (p.specs || {});
    const images = p.images || [];

    setFormData({
      brand: p.brand,
      model: p.model,
      variant: p.variant,
      color: p.color,
      condition: p.condition || 'New',
      purchase_price: p.purchase_price,
      selling_price: p.selling_price,
      warranty_period: p.warranty_period,
      description: p.description || '',
      is_visible: p.is_visible,
      image_url_1: images[0]?.image_url || '',
      image_url_2: images[1]?.image_url || '',
      ram: specs.ram || '',
      storage: specs.storage || '',
      battery: specs.battery || '',
      camera: specs.camera || '',
      display: specs.display || '',
      processor: specs.processor || '',
      initial_imeis: ''
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const images = [];
      if (formData.image_url_1) images.push(formData.image_url_1.trim());
      if (formData.image_url_2) images.push(formData.image_url_2.trim());

      const specs = {
        ram: formData.ram,
        storage: formData.storage,
        battery: formData.battery,
        camera: formData.camera,
        display: formData.display,
        processor: formData.processor
      };

      const payload = {
        brand: formData.brand,
        model: formData.model,
        variant: formData.variant,
        color: formData.color,
        condition: formData.condition,
        purchase_price: Number(formData.purchase_price) || 0,
        selling_price: Number(formData.selling_price) || 0,
        warranty_period: formData.warranty_period,
        description: formData.description,
        is_visible: formData.is_visible,
        specs,
        images
      };

      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
      } else {
        // Parse initial IMEIs
        const imeis = formData.initial_imeis
          ? formData.initial_imeis.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
          : [];
        payload.imeis = imeis;
        await api.products.create(payload);
      }

      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this phone and all its units?')) {
      try {
        await api.products.delete(id);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await api.products.toggleVisibility(id);
      fetchProducts();
    } catch (err) {
      alert('Failed to toggle visibility: ' + err.message);
    }
  };

  const handleOpenUnits = async (p) => {
    try {
      const res = await api.products.getById(p.id);
      setUnitModalProduct(res.product);
    } catch (err) {
      alert('Failed to load IMEI units: ' + err.message);
    }
  };

  const handleAddImeiUnit = async (e) => {
    e.preventDefault();
    if (!newImei1) return;
    try {
      await api.products.addUnit(unitModalProduct.id, {
        imei_1: newImei1.trim(),
        imei_2: newImei2.trim() || null,
        serial_no: newSerial.trim() || null,
      });
      setNewImei1('');
      setNewImei2('');
      setNewSerial('');
      // Reload units
      const res = await api.products.getById(unitModalProduct.id);
      setUnitModalProduct(res.product);
      fetchProducts();
    } catch (err) {
      alert('Failed to add IMEI: ' + err.message);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (confirm('Delete this unsold IMEI unit?')) {
      try {
        await api.products.deleteUnit(unitId);
        const res = await api.products.getById(unitModalProduct.id);
        setUnitModalProduct(res.product);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete IMEI: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            Showroom Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add models, track individual 15-digit IMEIs, adjust prices, and toggle public visibility
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Mobile
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand, model, color..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
            />
          </div>
          <button
            onClick={fetchProducts}
            className="px-3 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
          >
            Filter
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Brand:</span>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-200 font-medium bg-white focus:outline-none"
          >
            <option value="All">All Brands</option>
            <option value="SAMSUNG">SAMSUNG</option>
            <option value="Apple">Apple</option>
            <option value="OnePlus">OnePlus</option>
            <option value="vivo">vivo</option>
            <option value="oppo">oppo</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="realme">realme</option>
            <option value="Google">Google</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Device Model</th>
                <th className="p-3.5">Variant & Color</th>
                <th className="p-3.5">Condition</th>
                <th className="p-3.5 text-right">Cost Price</th>
                <th className="p-3.5 text-right">Selling Price</th>
                <th className="p-3.5 text-center">Available Stock</th>
                <th className="p-3.5 text-center">Website</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    Loading inventory list...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    No products found. Add your first phone!
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const img = p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80';
                  const availableUnits = p.available_units_count !== undefined ? p.available_units_count : p.stock_quantity;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {p.brand} {p.model}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            HSN: {p.hsn_code || '85171300'}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium text-slate-700">
                        <div>{p.variant}</div>
                        <div className="text-[11px] text-slate-500">{p.color}</div>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.condition === 'Used' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.condition || 'New'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right font-mono text-slate-600">
                        ₹{Number(p.purchase_price || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 text-sm">
                        ₹{Number(p.selling_price).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleOpenUnits(p)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 inline-flex items-center gap-1 ${
                            availableUnits === 0
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : availableUnits <= 2
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Click to view & add IMEIs"
                        >
                          <Barcode className="w-3.5 h-3.5" />
                          <span>{availableUnits} Units</span>
                        </button>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleVisibility(p.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold ${
                            p.is_visible
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title={p.is_visible ? 'Visible on Website' : 'Hidden from Website'}
                        >
                          {p.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenUnits(p)}
                            title="Manage IMEIs"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            title="Delete Product"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-base font-bold font-serif">
                {editingProduct ? 'Edit Mobile Phone' : 'Add New Mobile to Catalog'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                    required
                  >
                    <option value="SAMSUNG">SAMSUNG</option>
                    <option value="Apple">Apple</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="vivo">vivo</option>
                    <option value="oppo">oppo</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="realme">realme</option>
                    <option value="Google">Google</option>
                    <option value="Motorola">Motorola</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Galaxy S24 Ultra 5G"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Variant (RAM/Storage) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12GB / 512GB"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Color *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Titanium Gray"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="New">Brand New</option>
                    <option value="Used">Pre-owned / Mint Used</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Warranty Period</label>
                  <input
                    type="text"
                    placeholder="1 Year Brand Warranty"
                    value={formData.warranty_period}
                    onChange={(e) => setFormData({ ...formData, warranty_period: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Purchase / Cost Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Selling Price (Incl. GST) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 58700"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 uppercase">Product Image URL(s)</label>
                <input
                  type="url"
                  placeholder="Primary Image URL (https://...)"
                  value={formData.image_url_1}
                  onChange={(e) => setFormData({ ...formData, image_url_1: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
                <input
                  type="url"
                  placeholder="Secondary Image URL (optional)"
                  value={formData.image_url_2}
                  onChange={(e) => setFormData({ ...formData, image_url_2: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              {/* Specifications */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 uppercase">Specifications</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="RAM (e.g. 8GB LPDDR5X)"
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="p-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Storage (e.g. 256GB UFS)"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="p-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Battery (e.g. 5000 mAh)"
                    value={formData.battery}
                    onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                    className="p-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Camera (e.g. 50MP OIS)"
                    value={formData.camera}
                    onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                    className="p-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Display (e.g. 120Hz OLED)"
                    value={formData.display}
                    onChange={(e) => setFormData({ ...formData, display: e.target.value })}
                    className="p-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Processor (e.g. Snapdragon)"
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Initial IMEIs for new product */}
              {!editingProduct && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 uppercase">
                    Initial IMEIs (One per line or comma separated)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. 351791522686701, 351791522686702"
                    value={formData.initial_imeis}
                    onChange={(e) => setFormData({ ...formData, initial_imeis: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description / Notes</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="visibleCheck"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="visibleCheck" className="font-semibold text-slate-700">
                  Show this mobile in the public customer showroom
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-sm"
                >
                  {editingProduct ? 'Update Mobile' : 'Save & Add IMEIs'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: IMEI UNITS MANAGER */}
      {/* ========================================================================= */}
      {unitModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold font-serif">
                  IMEI Units: {unitModalProduct.brand} {unitModalProduct.model}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {unitModalProduct.variant} • {unitModalProduct.color}
                </p>
              </div>
              <button
                onClick={() => setUnitModalProduct(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Add New Unit Form */}
              <form onSubmit={handleAddImeiUnit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-600" /> Add Single Physical Unit (IMEI)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">IMEI 1 *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 351791522686707"
                      value={newImei1}
                      onChange={(e) => setNewImei1(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">IMEI 2 (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 351791522686715"
                      value={newImei2}
                      onChange={(e) => setNewImei2(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Serial No. (Optional)"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
                  >
                    + Add to Stock
                  </button>
                </div>
              </form>

              {/* Units List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Tracked Devices ({unitModalProduct.units?.length || 0})</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    Available: {(unitModalProduct.units || []).filter(u => u.status === 'available').length}
                  </span>
                </div>

                {(unitModalProduct.units || []).length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl">
                    No units recorded yet. Add an IMEI barcode above!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {unitModalProduct.units.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="font-mono">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>IMEI 1: {u.imei_1}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase ${
                              u.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {u.status}
                            </span>
                          </div>
                          {u.imei_2 && (
                            <div className="text-[11px] text-slate-500">
                              IMEI 2: {u.imei_2}
                            </div>
                          )}
                          {u.serial_no && (
                            <div className="text-[10px] text-slate-400">
                              Serial: {u.serial_no}
                            </div>
                          )}
                        </div>

                        {u.status === 'available' ? (
                          <button
                            onClick={() => handleDeleteUnit(u.id)}
                            title="Remove IMEI"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            Sold on Bill
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
