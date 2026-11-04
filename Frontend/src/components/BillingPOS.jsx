import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Search, 
  Plus, 
  Minus, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Receipt, 
  Barcode, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Tag,
  DollarSign,
  Printer,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api.js';

export default function BillingPOS({ onBillGenerated, initialProduct = null }) {
  // Product search & inventory
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Cart items
  const [cartItems, setCartItems] = useState([]);
  
  // Customer & Bill Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('PATNA');
  const [customerGstin, setCustomerGstin] = useState('');
  const [salesmanName, setSalesmanName] = useState('Saket kumar');
  const [customInvoiceNo, setCustomInvoiceNo] = useState('');
  const [nextInvoiceNo, setNextInvoiceNo] = useState('');

  // Financials & Payment
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [gstPercent, setGstPercent] = useState(18.00);
  const [exchangeValue, setExchangeValue] = useState(0);
  const [exchangePhoneDetails, setExchangePhoneDetails] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash'); // 'Cash', 'UPI', 'Card', 'EMI', 'Mixed'
  const [financeCompany, setFinanceCompany] = useState(''); // 'BAJAJ FINSERV', etc.
  const [loanNo, setLoanNo] = useState(''); // 'INSURANCE - YES'
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  // Customer suggestions
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('cart'); // 'cart' or 'checkout' or 'preview'

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [prodsRes, invRes] = await Promise.all([
        api.products.getAdmin(),
        api.bills.getNextInvoiceNo()
      ]);
      setAllProducts(prodsRes.products || []);
      setNextInvoiceNo(invRes.invoiceNo || '2687');
      setCustomInvoiceNo(invRes.invoiceNo || '2687');

      if (initialProduct) {
        handleAddToCart(initialProduct);
      }
    } catch (err) {
      console.error('Failed to load POS data:', err);
    }
  };

  // Search products by name, brand, or IMEI
  useEffect(() => {
    if (!productSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const term = productSearch.toLowerCase();
    const filtered = allProducts.filter(p => 
      p.brand.toLowerCase().includes(term) ||
      p.model.toLowerCase().includes(term) ||
      p.variant.toLowerCase().includes(term) ||
      p.color.toLowerCase().includes(term)
    );
    setSearchResults(filtered.slice(0, 8));
  }, [productSearch, allProducts]);

  // Customer phone autocomplete
  const handlePhoneChange = async (e) => {
    const val = e.target.value;
    setCustomerPhone(val);
    if (val.length >= 4) {
      try {
        const res = await api.customers.search(val);
        setCustomerSuggestions(res.customers || []);
      } catch (err) {
        // ignore
      }
    } else {
      setCustomerSuggestions([]);
    }
  };

  const handleSelectCustomer = (c) => {
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    if (c.address) setCustomerAddress(c.address);
    if (c.gstin) setCustomerGstin(c.gstin);
    setCustomerSuggestions([]);
  };

  const handleAddToCart = async (product) => {
    setError('');
    try {
      // Fetch full product with fresh units
      const res = await api.products.getById(product.id);
      const fullProd = res.product;
      const availableUnits = (fullProd.units || []).filter(u => u.status === 'available');

      if (availableUnits.length === 0) {
        setError(`Product "${product.brand} ${product.model}" is out of stock! Add IMEIs to stock first.`);
        return;
      }

      // Check if item already in cart
      const existingIdx = cartItems.findIndex(item => item.productId === product.id && !item.selectedUnitId);

      const newItem = {
        cartItemId: Date.now() + Math.random(),
        productId: product.id,
        brand: product.brand,
        model: product.model,
        variant: product.variant,
        color: product.color,
        sellingPrice: Number(product.selling_price),
        rate: Number(product.selling_price),
        discount: 0,
        quantity: 1,
        availableUnits,
        selectedUnitId: availableUnits[0]?.id || null,
        selectedImei1: availableUnits[0]?.imei_1 || '',
        selectedImei2: availableUnits[0]?.imei_2 || '',
        financeName: financeCompany || '',
        loanNo: loanNo || ''
      };

      setCartItems([...cartItems, newItem]);
      setProductSearch('');
      setSearchResults([]);
    } catch (err) {
      setError('Failed to add product to billing cart: ' + err.message);
    }
  };

  const handleUpdateUnit = (cartItemId, unitId) => {
    setCartItems(cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        const unit = item.availableUnits.find(u => u.id === Number(unitId));
        return {
          ...item,
          selectedUnitId: unit ? unit.id : null,
          selectedImei1: unit ? unit.imei_1 : '',
          selectedImei2: unit ? unit.imei_2 : '',
        };
      }
      return item;
    }));
  };

  const handleUpdateItemDiscount = (cartItemId, discount) => {
    setCartItems(cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, discount: Math.max(0, Number(discount) || 0) };
      }
      return item;
    }));
  };

  const handleUpdateItemRate = (cartItemId, rate) => {
    setCartItems(cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, rate: Math.max(0, Number(rate) || 0) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (cartItemId) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Billing Math Calculations
  const subTotalBeforeDiscount = cartItems.reduce((acc, i) => acc + (i.rate * i.quantity), 0);
  const totalItemDiscounts = cartItems.reduce((acc, i) => acc + (i.discount || 0), 0);
  const netBeforeExchange = Math.max(0, subTotalBeforeDiscount - totalItemDiscounts - Number(overallDiscount || 0));
  const grandTotal = Math.max(0, netBeforeExchange - Number(exchangeValue || 0));

  // Reverse Tax Breakdown (Taxable + SGST + CGST = Grand Total)
  const gstPct = Number(gstPercent) || 18.00;
  const taxableAmount = Math.round((grandTotal / (1 + (gstPct / 100))) * 100) / 100;
  const totalGstAmount = Math.round((grandTotal - taxableAmount) * 100) / 100;
  const sgstAmount = Math.round((totalGstAmount / 2) * 100) / 100;
  const cgstAmount = Math.round((totalGstAmount - sgstAmount) * 100) / 100;

  const handleGenerateBill = async () => {
    setError('');
    if (cartItems.length === 0) {
      setError('Please add at least one mobile phone to the cart.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Customer name and phone number are required for Tax Invoicing.');
      setStep('checkout');
      return;
    }

    // Verify each item has an IMEI assigned
    for (const item of cartItems) {
      if (!item.selectedImei1) {
        setError(`Please select an available IMEI for ${item.brand} ${item.model}.`);
        return;
      }
    }

    setLoading(true);
    try {
      const itemsPayload = cartItems.map(item => ({
        productId: item.productId,
        unitId: item.selectedUnitId,
        company: item.brand,
        modelName: `${item.brand} ${item.model}(${item.variant})${item.color}`.trim(),
        variant: item.variant,
        color: item.color,
        imei1: item.selectedImei1,
        imei2: item.selectedImei2,
        financeName: item.financeName || financeCompany,
        loanNo: item.loanNo || loanNo,
        quantity: item.quantity,
        rate: item.rate,
        discount: item.discount,
      }));

      const billPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        customerGstin: customerGstin.trim(),
        salesmanName,
        customInvoiceNo: customInvoiceNo || nextInvoiceNo,
        items: itemsPayload,
        overallDiscount: Number(overallDiscount) || 0,
        gstPercent: gstPct,
        exchangeValue: Number(exchangeValue) || 0,
        exchangePhoneDetails,
        paymentMode,
        financeCompany,
        referenceNo,
        notes: notes || (financeCompany ? `${financeCompany} LOAN (${loanNo || 'INSURANCE - YES'})` : ''),
      };

      const res = await api.bills.generate(billPayload);

      if (res.bill) {
        // Clear cart
        setCartItems([]);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('PATNA');
        setCustomerGstin('');
        setOverallDiscount(0);
        setExchangeValue(0);
        setNotes('');
        setStep('cart');
        
        // Refresh products list
        loadInitialData();

        // Trigger print modal
        if (onBillGenerated) {
          onBillGenerated(res.bill);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to generate tax invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Point of Sale & Tax Billing
            </h1>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
              Invoice #{customInvoiceNo || nextInvoiceNo}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Add phones, assign physical IMEI serials, process EMI/Cash/UPI payments, and print authentic GST invoice
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('cart')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              step === 'cart' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            1. Cart Items ({cartItems.length})
          </button>
          <button
            onClick={() => setStep('checkout')}
            disabled={cartItems.length === 0}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              step === 'checkout' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 disabled:opacity-50'
            }`}
          >
            2. Customer & Payment
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-2.5 text-xs text-red-700 shadow-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main POS Interface (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PRODUCT PICKER & CART ITEMS TABLE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Product Search & Quick Add Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-500" /> Search Phone to Add to Cart
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type phone name or model (e.g. Galaxy A57, iPhone, OnePlus)..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Dropdown Suggestions */}
            {searchResults.length > 0 && (
              <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-64 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((p) => {
                  const stock = p.available_units_count !== undefined ? p.available_units_count : p.stock_quantity;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {p.brand} {p.model}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.variant} • {p.color} • {p.condition}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">
                          ₹{Number(p.selling_price).toLocaleString('en-IN')}
                        </div>
                        <span className={`text-[10px] font-bold ${
                          stock > 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          {stock > 0 ? `${stock} in stock` : 'Sold out'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-500" />
                Active Billing Cart ({cartItems.length} items)
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={() => setCartItems([])}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Your billing cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Search a mobile above or click "Add to POS" from the showroom catalog to begin billing.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cartItems.map((item, idx) => (
                  <div key={item.cartItemId} className="p-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Item #{idx + 1} • {item.brand}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {item.model}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium">
                          {item.variant} • {item.color}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900">
                            ₹{(item.rate * item.quantity - (item.discount || 0)).toLocaleString('en-IN')}
                          </div>
                          {item.discount > 0 && (
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              Disc: -₹{item.discount}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* IMEI Selector & Price Adjustments */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      
                      {/* IMEI Picker */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                          <Barcode className="w-3 h-3" /> Select Unit IMEI *
                        </label>
                        <select
                          value={item.selectedUnitId || ''}
                          onChange={(e) => handleUpdateUnit(item.cartItemId, e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs font-bold text-slate-800"
                        >
                          {(item.availableUnits || []).map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.imei_1} {u.imei_2 ? `(${u.imei_2})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Selling Rate */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Rate (₹)
                        </label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleUpdateItemRate(item.cartItemId, e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                        />
                      </div>

                      {/* Item Discount */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Item Discount (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={item.discount || ''}
                          onChange={(e) => handleUpdateItemDiscount(item.cartItemId, e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: CUSTOMER DETAILS, PAYMENT & BILL SUMMARY */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Customer Block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-500" /> Customer Information
            </h3>

            {/* Phone with Auto-suggest */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Customer Phone No. *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 8210257618"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>

              {customerSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto divide-y divide-slate-100">
                  {customerSuggestions.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCustomer(c)}
                      className="p-2 hover:bg-amber-50 cursor-pointer text-xs"
                    >
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.phone} • {c.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RAJESH KUMAR"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="e.g. PHULWARI SARIF, PATNA"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                placeholder="Buyer GST Number"
                value={customerGstin}
                onChange={(e) => setCustomerGstin(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
          </div>

          {/* Payment & Tax Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-500" /> Payment & Terms
            </h3>

            {/* Payment Mode */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 font-bold bg-white"
              >
                <option value="Cash">Cash Payment</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="EMI">EMI Finance (Bajaj / HDFC)</option>
                <option value="Mixed">Mixed Payment</option>
              </select>
            </div>

            {/* Finance Details (e.g. BAJAJ FINSERV matching the photo) */}
            {paymentMode === 'EMI' && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-amber-950 uppercase mb-0.5">
                    Finance Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BAJAJ FINSERV"
                    value={financeCompany}
                    onChange={(e) => setFinanceCompany(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-amber-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-950 uppercase mb-0.5">
                    Loan No. / Scheme
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INSURANCE - YES or Loan A/C"
                    value={loanNo}
                    onChange={(e) => setLoanNo(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-amber-300 bg-white font-bold"
                  />
                </div>
              </div>
            )}

            {/* Overall Discount & Exchange */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Overall Discount (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={overallDiscount || ''}
                  onChange={(e) => setOverallDiscount(Number(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Exchange Value (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={exchangeValue || ''}
                  onChange={(e) => setExchangeValue(Number(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>
            </div>

            {/* GST % */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                GST Rate (%)
              </label>
              <select
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white font-medium"
              >
                <option value={18.00}>18.00% (Standard Mobile - 9% SGST + 9% CGST)</option>
                <option value={12.00}>12.00% (6% SGST + 6% CGST)</option>
                <option value={5.00}>5.00% (2.5% SGST + 2.5% CGST)</option>
                <option value={0.00}>0.00% (Exempted)</option>
              </select>
            </div>

            {/* Invoice Number Override */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Invoice No.
                </label>
                <input
                  type="text"
                  value={customInvoiceNo}
                  onChange={(e) => setCustomInvoiceNo(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Salesperson
                </label>
                <input
                  type="text"
                  value={salesmanName}
                  onChange={(e) => setSalesmanName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Grand Total & Generate Bill Button */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4 text-xs">
            <div className="space-y-1.5 pb-3 border-b border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{subTotalBeforeDiscount.toFixed(2)}</span>
              </div>
              {(totalItemDiscounts > 0 || overallDiscount > 0) && (
                <div className="flex justify-between text-emerald-400">
                  <span>Total Discount:</span>
                  <span className="font-mono">-₹{(totalItemDiscounts + Number(overallDiscount)).toFixed(2)}</span>
                </div>
              )}
              {exchangeValue > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Old Phone Exchange:</span>
                  <span className="font-mono">-₹{Number(exchangeValue).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{taxableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>SGST ({gstPct / 2}%):</span>
                <span className="font-mono">₹{sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>CGST ({gstPct / 2}%):</span>
                <span className="font-mono">₹{cgstAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-bold text-sm uppercase text-slate-300">Grand Total:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={handleGenerateBill}
              disabled={loading || cartItems.length === 0}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Generate & Print Tax Bill</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
