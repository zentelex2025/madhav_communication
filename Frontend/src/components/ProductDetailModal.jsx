import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Battery, 
  Camera, 
  Smartphone, 
  MessageCircle,
  Tag,
  Sparkles
} from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, isAdmin = false }) {
  if (!product) return null;

  const images = product.images || [];
  const [selectedImg, setSelectedImg] = useState(
    images.find(img => img.is_primary)?.image_url || images[0]?.image_url || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
  );

  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : (product.specs || {});
  const isAvailable = (product.stock_quantity > 0) || (product.available_units_count > 0);

  const handleWhatsAppInquiry = () => {
    const text = `Hello  Madhav Communication! I am interested in the ${product.brand} ${product.model} (${product.variant}, ${product.color}) priced at ₹${Number(product.selling_price).toLocaleString('en-IN')}. Is this currently available in the shop?`;
    const url = `https://wa.me/918409946197?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded uppercase">
              {product.brand}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
              product.condition === 'Used' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {product.condition || 'New'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative shadow-inner">
                <img
                  src={selectedImg}
                  alt={product.model}
                  className="w-full h-full object-contain p-4 transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 ${
                    isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {isAvailable ? `In Stock (${product.stock_quantity || product.available_units_count} units)` : 'Sold Out'}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img.image_url)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all ${
                        selectedImg === img.image_url ? 'border-amber-500 scale-95 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Warranty Card */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-amber-950">Warranty Coverage</div>
                  <div className="text-amber-800">{product.warranty_period || '1 Year Brand Warranty'}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Original GST Tax Invoice provided upon purchase.</div>
                </div>
              </div>
            </div>

            {/* Right: Info & Specs */}
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {product.brand} {product.model}
                </h2>
                <div className="text-slate-600 font-medium text-sm mt-1">
                  Variant: <span className="font-bold text-slate-800">{product.variant}</span> • Color: <span className="font-bold text-slate-800">{product.color}</span>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    ₹{Number(product.selling_price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    (Incl. 18% GST)
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {product.description}
                </p>
              )}

              {/* Technical Specifications */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Key Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">RAM / Storage</div>
                      <div className="font-bold text-slate-800">{specs.ram || product.variant}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                    <Battery className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">Battery</div>
                      <div className="font-bold text-slate-800">{specs.battery || '5000 mAh'}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">Camera</div>
                      <div className="font-bold text-slate-800 truncate" title={specs.camera}>{specs.camera || '50MP OIS'}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">Display</div>
                      <div className="font-bold text-slate-800 truncate" title={specs.display}>{specs.display || '120Hz AMOLED'}</div>
                    </div>
                  </div>
                </div>

                {specs.processor && (
                  <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                    <strong className="text-slate-900">Processor:</strong> {specs.processor}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Inquire on WhatsApp (Shopkeeper Direct)
                </button>

                {isAdmin && onAddToCart && (
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    disabled={!isAvailable}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 text-slate-950 font-bold rounded-xl text-sm transition-all"
                  >
                    {isAvailable ? 'Add to POS Billing Cart' : 'Out of Stock'}
                  </button>
                )}

                <p className="text-[11px] text-slate-600 font-medium text-center">
                  📍 Visit shop: Sakin Colony, Kumhrar, Housing Colony, PS-Agamkuan, Patna, Bihar-800026
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
