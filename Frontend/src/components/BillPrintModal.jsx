// import React, { useState, useRef } from 'react';
// import { 
//   Printer, 
//   Share2, 
//   Download, 
//   X, 
//   FileText, 
//   Receipt, 
//   CheckCircle2, 
//   Smartphone,
//   Copy
// } from 'lucide-react';

// export default function BillPrintModal({ bill, onClose }) {
//   const [format, setFormat] = useState('a4'); // 'a4' or 'thermal'
//   const [copied, setCopied] = useState(false);
//   const printRef = useRef(null);

//   if (!bill) return null;

//   const shop = bill.shop || {
//     shop_name: 'Madhav Communication',
//     tagline: 'Deals in : All types of Mobile & Accessories',
//     address: 'East of Santi Market, Teacher Colony, Post-Bahadurpur, Sakin Colony, Kumhrar, Housing Colony, PS-Agamkuan, Patna, Bihar-800026',
//     phone: '7277715180',
//     whatsapp_number: '918409946197',
//     email: 'manishkumarmehta97@gmail.com',
//     gstin: '10EHNPK2687B1ZI',
//     bank_name: 'STATE BANK OF INDIA',
//     account_no: '389201948192',
//     ifsc_code: 'SBIN0001234',
//     upi_id: '8409946197@upi',
//     terms_1: '1.No Refund after Sale of Any Mobiles.',
//     terms_2: '2.All Subject to "PATNA" Jurisdiction Only.',
//     salesman_name: 'MANISH KUMAR MEHTA'
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleShareWhatsApp = () => {
//     const itemNames = (bill.items || []).map(i => `${i.model_name} (IMEI: ${i.imei_1})`).join('\n• ');
//     const msg = `*TAX INVOICE - ${shop.shop_name}*\n` +
//       `Invoice No: #${bill.invoice_no}\n` +
//       `Date: ${new Date(bill.invoice_date).toLocaleDateString('en-IN')}\n` +
//       `Customer: ${bill.customer_name} (${bill.customer_phone})\n\n` +
//       `*Purchased Items:*\n• ${itemNames}\n\n` +
//       `*Total Amount:* ₹${Number(bill.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
//       `Payment Mode: ${bill.payment?.payment_mode || 'Cash'}\n\n` +
//       `Thank you for shopping with ${shop.shop_name}!\n` +
//       `Contact: ${shop.phone}`;

//     const url = `https://wa.me/${bill.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
//     window.open(url, '_blank');
//   };

//   const handleCopyLink = () => {
//     const link = `${window.location.origin}/?invoice=${bill.invoice_no}`;
//     navigator.clipboard.writeText(link);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const totalQty = (bill.items || []).reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
//       <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-4">
        
//         {/* Top Control Bar (Hidden when printing) */}
//         <div className="no-print bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
//           <div className="flex items-center gap-2">
//             <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
//               <CheckCircle2 className="w-3.5 h-3.5" /> Invoice #{bill.invoice_no}
//             </span>
//             <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
//               <button
//                 onClick={() => setFormat('a4')}
//                 className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
//                   format === 'a4' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
//                 }`}
//               >
//                 <FileText className="w-3.5 h-3.5" /> Standard A4 (Photo Match)
//               </button>
//               <button
//                 onClick={() => setFormat('thermal')}
//                 className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
//                   format === 'thermal' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
//                 }`}
//               >
//                 <Receipt className="w-3.5 h-3.5" /> 80mm POS Thermal
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleCopyLink}
//               title="Copy Invoice Link"
//               className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700"
//             >
//               <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
//             </button>
//             <button
//               onClick={handleShareWhatsApp}
//               title="Share on WhatsApp"
//               className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
//             >
//               <Share2 className="w-3.5 h-3.5" /> WhatsApp
//             </button>
//             <button
//               onClick={handlePrint}
//               className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md"
//             >
//               <Printer className="w-3.5 h-3.5" /> Print / PDF
//             </button>
//             <button
//               onClick={onClose}
//               className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Invoice Body Canvas */}
//         <div className="p-4 sm:p-8 max-h-[85vh] overflow-y-auto bg-slate-100 flex justify-center">

//           {/* ========================================================================= */}
//           {/* FORMAT 1: A4 TAX INVOICE - REPLICATING THE ATTACHED PHOTO PIXEL-FOR-PIXEL */}
//           {/* ========================================================================= */}
//           {format === 'a4' && (
//             <div 
//               ref={printRef}
//               className="print-container bg-white text-black p-6 sm:p-8 w-full max-w-[210mm] shadow-lg border border-slate-300 font-sans text-[12px] leading-tight select-text"
//               style={{ minHeight: '270mm' }}
//             >
//               {/* Header Box */}
//               <div className="border border-black p-3 mb-2">
//                 <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider">
//                   <div>GSTIN : {shop.gstin}</div>
//                   <div className="text-center font-bold text-[13px] uppercase underline tracking-wider">
//                     TAX INVOICE
//                   </div>
//                   <div>Phone : {shop.phone}</div>
//                 </div>

//                 <div className="text-center mt-1">
//                   <h1 className="text-2xl sm:text-3xl font-black tracking-wide uppercase font-serif text-slate-900">
//                     {shop.shop_name}
//                   </h1>
//                   <p className="text-[11px] font-semibold mt-0.5 tracking-tight uppercase">
//                     {shop.address}
//                   </p>
//                   <p className="text-[10px] text-slate-800">
//                     E-Mail : {shop.email}
//                   </p>
//                 </div>

//                 {/* Deals in Banner */}
//                 <div className="mt-2 text-center border-t border-b border-black py-0.5 font-bold text-[12px] tracking-wide bg-slate-50">
//                   {shop.tagline || 'Deals in : All types of Mobile & Accessories'}
//                 </div>

//                 {/* Brand Logos Ribbon (as on original bill) */}
//                 <div className="flex items-center justify-between text-[11px] font-bold px-2 py-1 border-b border-black text-slate-800 uppercase tracking-tighter">
//                   <span className="flex items-center gap-1 font-black"> Apple</span>
//                   <span className="font-extrabold tracking-widest">SAMSUNG</span>
//                   <span className="font-bold lowercase bg-orange-600 text-white px-1 rounded-sm text-[10px]">mi</span>
//                   <span className="font-bold text-emerald-800 lowercase">oppo</span>
//                   <span className="font-extrabold text-blue-800 lowercase">vivo</span>
//                   <span className="font-bold text-amber-600 lowercase bg-amber-100 px-1 rounded-sm">realme</span>
//                   <span className="font-semibold text-slate-700">M motorola</span>
//                   <span className="font-extrabold text-red-700">1+ OnePlus</span>
//                   <span className="font-medium text-slate-900">G Pixel</span>
//                 </div>
//               </div>

//               {/* Customer and Invoice Details Block */}
//               <div className="border border-black grid grid-cols-12 mb-2 text-[11px]">
//                 {/* Left: Customer Info */}
//                 <div className="col-span-7 border-r border-black p-2 space-y-1">
//                   <div className="font-bold underline text-[11px]">Customer Details</div>
//                   <div className="font-extrabold text-[13px] uppercase">
//                     Name : {bill.customer_name}
//                   </div>
//                   <div className="uppercase">
//                     Address : {bill.customer_address || 'PATNA'}
//                   </div>
//                   <div>
//                     Phone No: {bill.customer_phone}
//                   </div>
//                   <div>
//                     GST : {bill.customer_gstin || '-'}
//                   </div>
//                 </div>

//                 {/* Right: Invoice Info */}
//                 <div className="col-span-5 p-2 space-y-1">
//                   <div className="flex justify-between border-b border-slate-300 pb-1">
//                     <span className="font-bold">Invoice No. :</span>
//                     <span className="font-bold text-[13px]">{bill.invoice_no}</span>
//                   </div>
//                   <div className="flex justify-between border-b border-slate-300 pb-1">
//                     <span className="font-bold">Invoice Date :</span>
//                     <span>{new Date(bill.invoice_date).toLocaleDateString('en-GB')}</span>
//                   </div>
//                   <div className="flex justify-between pt-1">
//                     <span className="font-bold">Sales Man :</span>
//                     <span className="uppercase">{bill.sales_man || shop.salesman_name}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Products Table (exact column setup) */}
//               <div className="border border-black mb-2">
//                 <table className="w-full text-left border-collapse text-[11px]">
//                   <thead>
//                     <tr className="border-b border-black bg-slate-100 text-center font-bold">
//                       <th className="border-r border-black p-1 w-8">S.</th>
//                       <th className="border-r border-black p-1 text-left">Products</th>
//                       <th className="border-r border-black p-1 w-20">HSN/SAC</th>
//                       <th className="border-r border-black p-1 w-12">Qty</th>
//                       <th className="border-r border-black p-1 w-24 text-right">Rate</th>
//                       <th className="p-1 w-24 text-right">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(bill.items || []).map((item, idx) => (
//                       <tr key={idx} className="border-b border-black align-top">
//                         <td className="border-r border-black p-1.5 text-center font-bold">
//                           {idx + 1}.
//                         </td>
//                         <td className="border-r border-black p-1.5 font-mono text-[11px] space-y-0.5">
//                           <div className="font-bold text-slate-900 uppercase">
//                             Company : {item.company}
//                           </div>
//                           <div className="font-extrabold uppercase">
//                             Model No. : {item.model_name}
//                           </div>
//                           <div className="text-slate-800">
//                             IMEI No. : <span className="font-bold">{item.imei_1 || '-'}</span>
//                           </div>
//                           {item.imei_2 && (
//                             <div className="text-slate-800">
//                               IMEI No. 2 : <span className="font-bold">{item.imei_2}</span>
//                             </div>
//                           )}
//                           {(item.finance_name || bill.payment?.finance_company) && (
//                             <div className="font-bold text-slate-900 uppercase">
//                               FIN NAME : {item.finance_name || bill.payment?.finance_company}
//                             </div>
//                           )}
//                           {item.loan_no && (
//                             <div className="font-bold text-slate-800 uppercase">
//                               LOAN NO : {item.loan_no}
//                             </div>
//                           )}
//                         </td>
//                         <td className="border-r border-black p-1.5 text-center font-semibold">
//                           {item.hsn_sac || '85171300'}
//                         </td>
//                         <td className="border-r border-black p-1.5 text-center font-bold">
//                           {item.quantity}
//                         </td>
//                         <td className="border-r border-black p-1.5 text-right font-bold">
//                           {Number(item.rate).toFixed(2)}
//                         </td>
//                         <td className="p-1.5 text-right font-extrabold">
//                           {Number(item.amount).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                     {/* Minimum row height filler */}
//                     {(bill.items?.length || 0) < 2 && (
//                       <tr className="border-b border-black h-16">
//                         <td className="border-r border-black"></td>
//                         <td className="border-r border-black"></td>
//                         <td className="border-r border-black"></td>
//                         <td className="border-r border-black"></td>
//                         <td className="border-r border-black"></td>
//                         <td></td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//                 {/* Sub-bar below table */}
//                 <div className="grid grid-cols-12 border-t border-black text-[11px]">
//                   <div className="col-span-4 border-r border-black p-1.5 font-bold">
//                     NO.OF ITEMS : <span className="font-extrabold text-[12px]">{bill.items?.length || 1}</span>
//                   </div>
//                   <div className="col-span-3 border-r border-black p-1.5 font-bold text-center">
//                     TOTAL QTY : <span className="font-extrabold text-[12px]">{totalQty}</span>
//                   </div>
//                   <div className="col-span-5 p-1.5 space-y-1 text-right">
//                     <div className="flex justify-between">
//                       <span className="font-semibold">Sub Total :</span>
//                       <span className="font-mono">{Number(bill.sub_total).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="font-semibold">Total Discount :</span>
//                       <span className="font-mono">{Number(bill.total_discount || 0).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="font-semibold">SGST Payable :</span>
//                       <span className="font-mono">{Number(bill.sgst_amount).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="font-semibold">CGST Payable :</span>
//                       <span className="font-mono">{Number(bill.cgst_amount).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="font-semibold">CR/DR Note :</span>
//                       <span className="font-mono">{Number(bill.cr_dr_note || 0).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-black pb-1">
//                       <span className="font-semibold">Roundoff :</span>
//                       <span className="font-mono">{Number(bill.roundoff || 0).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between font-black text-[14px] pt-1">
//                       <span>G.TOTAL =</span>
//                       <span>₹ {Number(bill.grand_total).toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Amount In Words & GST Breakdown Table */}
//               <div className="border border-black p-2 mb-2 bg-slate-50 text-[11px]">
//                 <div className="text-[10px] font-semibold text-slate-700">Amount in Words</div>
//                 <div className="font-bold text-[12px] uppercase tracking-wide">
//                   {bill.amount_in_words}
//                 </div>
//               </div>

//               {/* GST Breakdown Grid & Bank Details Box (2 Columns) */}
//               <div className="grid grid-cols-12 gap-2 mb-2 text-[10px]">
//                 {/* GST Breakdown Table */}
//                 <div className="col-span-8 border border-black overflow-hidden">
//                   <table className="w-full text-center border-collapse">
//                     <thead>
//                       <tr className="border-b border-black bg-slate-100 font-bold">
//                         <th className="border-r border-black p-1">GST CLASS</th>
//                         <th className="border-r border-black p-1">Taxable Amt</th>
//                         <th className="border-r border-black p-1">SGST %</th>
//                         <th className="border-r border-black p-1">Value</th>
//                         <th className="border-r border-black p-1">CGST %</th>
//                         <th className="border-r border-black p-1">Value</th>
//                         <th className="p-1">TOTAL</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr className="border-b border-slate-300">
//                         <td className="border-r border-black p-0.5">0.00%</td>
//                         <td className="border-r border-black p-0.5">0.00</td>
//                         <td className="border-r border-black p-0.5">0</td>
//                         <td className="border-r border-black p-0.5">0.0</td>
//                         <td className="border-r border-black p-0.5">0</td>
//                         <td className="border-r border-black p-0.5">0.0</td>
//                         <td className="p-0.5">0.00</td>
//                       </tr>
//                       <tr className="border-b border-slate-300">
//                         <td className="border-r border-black p-0.5">5.00%</td>
//                         <td className="border-r border-black p-0.5">0.00</td>
//                         <td className="border-r border-black p-0.5">2.5</td>
//                         <td className="border-r border-black p-0.5">0.00</td>
//                         <td className="border-r border-black p-0.5">2.5</td>
//                         <td className="border-r border-black p-0.5">0.00</td>
//                         <td className="p-0.5">0.00</td>
//                       </tr>
//                       <tr className="border-b border-black font-semibold">
//                         <td className="border-r border-black p-0.5">{bill.gst_percent}%</td>
//                         <td className="border-r border-black p-0.5">{Number(bill.taxable_amount).toFixed(2)}</td>
//                         <td className="border-r border-black p-0.5">{bill.sgst_rate}</td>
//                         <td className="border-r border-black p-0.5">{Number(bill.sgst_amount).toFixed(2)}</td>
//                         <td className="border-r border-black p-0.5">{bill.cgst_rate}</td>
//                         <td className="border-r border-black p-0.5">{Number(bill.cgst_amount).toFixed(2)}</td>
//                         <td className="p-0.5">{Number(bill.grand_total).toFixed(2)}</td>
//                       </tr>
//                       <tr className="font-bold bg-slate-50">
//                         <td className="border-r border-black p-0.5">TOTAL</td>
//                         <td className="border-r border-black p-0.5">{Number(bill.taxable_amount).toFixed(2)}</td>
//                         <td className="border-r border-black p-0.5">-</td>
//                         <td className="border-r border-black p-0.5">{Number(bill.sgst_amount).toFixed(2)}</td>
//                         <td className="border-r border-black p-0.5">-</td>
//                         <td className="border-r border-black p-0.5">{Number(bill.cgst_amount).toFixed(2)}</td>
//                         <td className="p-0.5">{Number(bill.grand_total).toFixed(2)}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Bank Details Box */}
//                 <div className="col-span-4 border border-black p-1.5 space-y-0.5">
//                   <div className="font-bold text-center border-b border-black pb-0.5 underline">
//                     Bank Details
//                   </div>
//                   <div><span className="font-semibold">Bank:</span> {shop.bank_name}</div>
//                   <div><span className="font-semibold">A/C:</span> {shop.account_no}</div>
//                   <div><span className="font-semibold">IFSC:</span> {shop.ifsc_code}</div>
//                   <div><span className="font-semibold">UPI ID:</span> {shop.upi_id}</div>
//                   {bill.payment?.payment_mode && (
//                     <div className="mt-1 pt-1 border-t border-slate-300 font-bold text-blue-900">
//                       Paid via: {bill.payment.payment_mode} {bill.payment.finance_company ? `(${bill.payment.finance_company})` : ''}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Footer: Terms & Conditions and Signature Section (Exactly as in photo) */}
//               <div className="border border-black grid grid-cols-12 text-[11px] relative mt-3">
//                 {/* Terms and Customer Signature */}
//                 <div className="col-span-7 border-r border-black p-2 flex flex-col justify-between">
//                   <div>
//                     <div className="font-bold underline text-[11px] mb-1">Terms & Conditions</div>
//                     <p className="text-[10px] leading-tight text-slate-800">
//                       {shop.terms_1 || '1.No Refund after Sale of Any Mobiles.'}
//                     </p>
//                     <p className="text-[10px] leading-tight text-slate-800">
//                       {shop.terms_2 || '2.All Subject to "PATNA" Jurisdiction Only.'}
//                     </p>
//                   </div>
//                   <div className="pt-8 border-t border-dotted border-black/40 text-center font-bold text-[10px] uppercase">
//                     Customers Seal & Signature
//                   </div>
//                 </div>

//                 {/* Shop Signatory and Stamp Area */}
//                 <div className="col-span-5 p-2 flex flex-col justify-between text-right relative">
//                   <div className="font-bold text-[11px] uppercase">
//                     For {shop.shop_name}
//                   </div>

//                   {/* Stamp Graphic mimicking the blue stamp in the photo */}
//                   <div className="my-2 flex justify-center items-center py-2 relative">
//                     <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-600/80 flex flex-col items-center justify-center p-1 text-blue-700/80 transform -rotate-12 select-none pointer-events-none">
//                       <span className="text-[8px] font-black uppercase text-center leading-none">★ {shop.shop_name} ★</span>
//                       <span className="text-[7px] text-center leading-none mt-1">Kazipur Quarter Road</span>
//                       <span className="text-[9px] font-extrabold uppercase mt-1">PATNA</span>
//                     </div>
//                     {/* Simulated blue ink signature */}
//                     <div className="absolute font-serif italic text-blue-800 font-bold text-[16px] transform rotate-3 translate-y-2 pointer-events-none">
//                       Manish
//                     </div>
//                   </div>

//                   <div className="font-bold text-[11px] border-t border-dotted border-black/40 pt-1 text-center">
//                     Authorized Signatory
//                   </div>
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ========================================================================= */}
//           {/* FORMAT 2: 80MM POS THERMAL RECEIPT */}
//           {/* ========================================================================= */}
//           {format === 'thermal' && (
//             <div 
//               ref={printRef}
//               className="print-container bg-white text-black p-4 w-[80mm] max-w-[80mm] shadow-lg border border-slate-300 font-mono text-[11px] leading-tight"
//             >
//               <div className="text-center pb-2 border-b border-dashed border-black">
//                 <div className="font-black text-sm uppercase">{shop.shop_name}</div>
//                 <div className="text-[9px] uppercase mt-0.5">{shop.address}</div>
//                 <div className="text-[9px]">Phone: {shop.phone}</div>
//                 <div className="text-[9px]">GSTIN: {shop.gstin}</div>
//                 <div className="font-bold mt-1 text-xs border border-black inline-block px-2 py-0.5">
//                   TAX INVOICE
//                 </div>
//               </div>

//               <div className="py-2 border-b border-dashed border-black text-[10px] space-y-0.5">
//                 <div className="flex justify-between">
//                   <span>Inv No: #{bill.invoice_no}</span>
//                   <span>Date: {new Date(bill.invoice_date).toLocaleDateString('en-GB')}</span>
//                 </div>
//                 <div>Customer: {bill.customer_name}</div>
//                 <div>Phone: {bill.customer_phone}</div>
//                 {bill.customer_address && <div>Addr: {bill.customer_address}</div>}
//               </div>

//               <div className="py-2 border-b border-dashed border-black">
//                 <table className="w-full text-left text-[10px]">
//                   <thead>
//                     <tr className="border-b border-black">
//                       <th className="py-1">Item</th>
//                       <th className="py-1 text-center">Qty</th>
//                       <th className="py-1 text-right">Amt</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(bill.items || []).map((item, idx) => (
//                       <tr key={idx} className="border-b border-dotted border-slate-300">
//                         <td className="py-1 pr-1">
//                           <div className="font-bold">{item.model_name}</div>
//                           <div className="text-[9px] text-slate-700">IMEI: {item.imei_1}</div>
//                           {item.finance_name && (
//                             <div className="text-[9px] font-semibold">{item.finance_name}</div>
//                           )}
//                         </td>
//                         <td className="py-1 text-center font-bold">{item.quantity}</td>
//                         <td className="py-1 text-right font-bold">{Number(item.amount).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="py-2 border-b border-dashed border-black text-[10px] space-y-1">
//                 <div className="flex justify-between">
//                   <span>Sub Total:</span>
//                   <span>₹{Number(bill.sub_total).toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>SGST (9%):</span>
//                   <span>₹{Number(bill.sgst_amount).toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>CGST (9%):</span>
//                   <span>₹{Number(bill.cgst_amount).toFixed(2)}</span>
//                 </div>
//                 {Number(bill.total_discount || 0) > 0 && (
//                   <div className="flex justify-between text-emerald-800">
//                     <span>Discount:</span>
//                     <span>-₹{Number(bill.total_discount).toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between font-extrabold text-[12px] border-t border-black pt-1">
//                   <span>G.TOTAL:</span>
//                   <span>₹{Number(bill.grand_total).toFixed(2)}</span>
//                 </div>
//                 <div className="text-[9px] uppercase font-bold text-slate-800 mt-1">
//                   {bill.amount_in_words}
//                 </div>
//               </div>

//               <div className="py-2 text-[9px] text-center space-y-1 border-b border-dashed border-black">
//                 <div>Payment Mode: {bill.payment?.payment_mode || 'Cash'}</div>
//                 <div>Bank: {shop.bank_name}</div>
//                 <div>UPI: {shop.upi_id}</div>
//               </div>

//               <div className="pt-2 text-center text-[8px] text-slate-800">
//                 <div>* {shop.terms_1} *</div>
//                 <div>* {shop.terms_2} *</div>
//                 <div className="font-bold mt-1 text-[10px]">Thank you for visiting!</div>
//               </div>
//             </div>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// }





import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  Share2,
  X,
  FileText,
  Receipt,
  CheckCircle2,
  Copy
} from 'lucide-react';

/**
 * PRINT FIX SUMMARY
 * 1. Modal is rendered with a portal into <body>, so it is not nested inside the app root.
 * 2. A <style> block (below) hides everything except the portal during print,
 *    and removes fixed/overflow/max-height clipping that caused only the top strip to print.
 * 3. @page size switches between A4 and 80mm depending on the selected format.
 * No change is needed in index.css.
 */

const PRINT_CSS = `
@media print {
  /* Hide the whole app, show only the bill portal */
  body > *:not(.bill-print-portal) { display: none !important; }

  html, body {
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
  }

  .bill-print-portal {
    position: static !important;
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #fff !important;
    backdrop-filter: none !important;
  }

  .bill-print-portal .bill-card,
  .bill-print-portal .bill-canvas {
    position: static !important;
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    max-width: none !important;
    width: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: #fff !important;
  }

  .no-print { display: none !important; }

  .print-container {
    box-shadow: none !important;
    border: 0 !important;
    margin: 0 auto !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print-a4 {
    width: 100% !important;
    max-width: none !important;
    min-height: 0 !important;
  }

  .print-thermal {
    width: 80mm !important;
    max-width: 80mm !important;
  }

  /* Keep important blocks from splitting across pages */
  .avoid-break { break-inside: avoid; page-break-inside: avoid; }
}
`;

export default function BillPrintModal({ bill, onClose }) {
  const [format, setFormat] = useState('a4'); // 'a4' or 'thermal'
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  // Lock background scroll while the modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!bill) return null;

  const shop = bill.shop || {
    shop_name: 'Madhav Communication',
    tagline: 'Deals in : All types of Mobile & Accessories',
    address: 'East of Santi Market, Teacher Colony, Post-Bahadurpur, Sakin Colony, Kumhrar, Housing Colony, PS-Agamkuan, Patna, Bihar-800026',
    phone: '7277715180',
    whatsapp_number: '918409946197',
    email: 'Saket355@gmail.com',
    gstin: '10EHNPK2687B1ZI',
    bank_name: 'STATE BANK OF INDIA',
    account_no: '389201948192',
    ifsc_code: 'SBIN0001234',
    upi_id: '8409946197@upi',
    terms_1: '1.No Refund after Sale of Any Mobiles.',
    terms_2: '2.All Subject to "PATNA" Jurisdiction Only.',
    salesman_name: 'Saket kumar'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const itemNames = (bill.items || []).map(i => `${i.model_name} (IMEI: ${i.imei_1})`).join('\n• ');
    const msg = `*TAX INVOICE - ${shop.shop_name}*\n` +
      `Invoice No: #${bill.invoice_no}\n` +
      `Date: ${new Date(bill.invoice_date).toLocaleDateString('en-IN')}\n` +
      `Customer: ${bill.customer_name} (${bill.customer_phone})\n\n` +
      `*Purchased Items:*\n• ${itemNames}\n\n` +
      `*Total Amount:* ₹${Number(bill.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
      `Payment Mode: ${bill.payment?.payment_mode || 'Cash'}\n\n` +
      `Thank you for shopping with ${shop.shop_name}!\n` +
      `Contact: ${shop.phone}`;

    const url = `https://wa.me/${String(bill.customer_phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?invoice=${bill.invoice_no}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalQty = (bill.items || []).reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);

  // Page size changes with the selected format
  const pageCss =
    format === 'thermal'
      ? '@media print { @page { size: 80mm auto; margin: 2mm; } }'
      : '@media print { @page { size: A4 portrait; margin: 8mm; } }';

  return createPortal(
    <div className="bill-print-portal fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <style>{PRINT_CSS}</style>
      <style>{pageCss}</style>

      <div className="bill-card relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-4">

        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Invoice #{bill.invoice_no}
            </span>
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setFormat('a4')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  format === 'a4' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Standard A4 (Photo Match)
              </button>
              <button
                onClick={() => setFormat('thermal')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  format === 'thermal' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" /> 80mm POS Thermal
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy Invoice Link"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body Canvas */}
        <div className="bill-canvas p-4 sm:p-8 max-h-[85vh] overflow-y-auto bg-slate-100 flex justify-center">

          {/* ================= FORMAT 1: A4 TAX INVOICE ================= */}
          {format === 'a4' && (
            <div
              ref={printRef}
              className="print-container print-a4 bg-white text-black p-6 sm:p-8 w-full max-w-[210mm] shadow-lg border border-slate-300 font-sans text-[12px] leading-tight select-text"
              style={{ minHeight: '270mm' }}
            >
              {/* Header Box */}
              <div className="border border-black p-3 mb-2">
                <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider">
                  <div>GSTIN : {shop.gstin}</div>
                  <div className="text-center font-bold text-[13px] uppercase underline tracking-wider">
                    TAX INVOICE
                  </div>
                  <div>Phone : {shop.phone}</div>
                </div>

                <div className="text-center mt-1">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-wide uppercase font-serif text-slate-900">
                    {shop.shop_name}
                  </h1>
                  <p className="text-[11px] font-semibold mt-0.5 tracking-tight uppercase">
                    {shop.address}
                  </p>
                  <p className="text-[10px] text-slate-800">
                    E-Mail : {shop.email}
                  </p>
                </div>

                {/* Deals in Banner */}
                <div className="mt-2 text-center border-t border-b border-black py-0.5 font-bold text-[12px] tracking-wide bg-slate-50">
                  {shop.tagline || 'Deals in : All types of Mobile & Accessories'}
                </div>

                {/* Brand Logos Ribbon */}
                <div className="flex items-center justify-between text-[11px] font-bold px-2 py-1 border-b border-black text-slate-800 uppercase tracking-tighter">
                  <span className="flex items-center gap-1 font-black"> Apple</span>
                  <span className="font-extrabold tracking-widest">SAMSUNG</span>
                  <span className="font-bold lowercase bg-orange-600 text-white px-1 rounded-sm text-[10px]">mi</span>
                  <span className="font-bold text-emerald-800 lowercase">oppo</span>
                  <span className="font-extrabold text-blue-800 lowercase">vivo</span>
                  <span className="font-bold text-amber-600 lowercase bg-amber-100 px-1 rounded-sm">realme</span>
                  <span className="font-semibold text-slate-700">M motorola</span>
                  <span className="font-extrabold text-red-700">1+ OnePlus</span>
                  <span className="font-medium text-slate-900">G Pixel</span>
                </div>
              </div>

              {/* Customer and Invoice Details Block */}
              <div className="border border-black grid grid-cols-12 mb-2 text-[11px] avoid-break">
                {/* Left: Customer Info */}
                <div className="col-span-7 border-r border-black p-2 space-y-1">
                  <div className="font-bold underline text-[11px]">Customer Details</div>
                  <div className="font-extrabold text-[13px] uppercase">
                    Name : {bill.customer_name}
                  </div>
                  <div className="uppercase">
                    Address : {bill.customer_address || 'PATNA'}
                  </div>
                  <div>
                    Phone No: {bill.customer_phone}
                  </div>
                  <div>
                    GST : {bill.customer_gstin || '-'}
                  </div>
                </div>

                {/* Right: Invoice Info */}
                <div className="col-span-5 p-2 space-y-1">
                  <div className="flex justify-between border-b border-slate-300 pb-1">
                    <span className="font-bold">Invoice No. :</span>
                    <span className="font-bold text-[13px]">{bill.invoice_no}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-300 pb-1">
                    <span className="font-bold">Invoice Date :</span>
                    <span>{new Date(bill.invoice_date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold">Sales Man :</span>
                    <span className="uppercase">{bill.sales_man || shop.salesman_name}</span>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="border border-black mb-2">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-black bg-slate-100 text-center font-bold">
                      <th className="border-r border-black p-1 w-8">S.</th>
                      <th className="border-r border-black p-1 text-left">Products</th>
                      <th className="border-r border-black p-1 w-20">HSN/SAC</th>
                      <th className="border-r border-black p-1 w-12">Qty</th>
                      <th className="border-r border-black p-1 w-24 text-right">Rate</th>
                      <th className="p-1 w-24 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bill.items || []).map((item, idx) => (
                      <tr key={idx} className="border-b border-black align-top avoid-break">
                        <td className="border-r border-black p-1.5 text-center font-bold">
                          {idx + 1}.
                        </td>
                        <td className="border-r border-black p-1.5 font-mono text-[11px] space-y-0.5">
                          <div className="font-bold text-slate-900 uppercase">
                            Company : {item.company}
                          </div>
                          <div className="font-extrabold uppercase">
                            Model No. : {item.model_name}
                          </div>
                          <div className="text-slate-800">
                            IMEI No. : <span className="font-bold">{item.imei_1 || '-'}</span>
                          </div>
                          {item.imei_2 && (
                            <div className="text-slate-800">
                              IMEI No. 2 : <span className="font-bold">{item.imei_2}</span>
                            </div>
                          )}
                          {(item.finance_name || bill.payment?.finance_company) && (
                            <div className="font-bold text-slate-900 uppercase">
                              FIN NAME : {item.finance_name || bill.payment?.finance_company}
                            </div>
                          )}
                          {item.loan_no && (
                            <div className="font-bold text-slate-800 uppercase">
                              LOAN NO : {item.loan_no}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-black p-1.5 text-center font-semibold">
                          {item.hsn_sac || '85171300'}
                        </td>
                        <td className="border-r border-black p-1.5 text-center font-bold">
                          {item.quantity}
                        </td>
                        <td className="border-r border-black p-1.5 text-right font-bold">
                          {Number(item.rate).toFixed(2)}
                        </td>
                        <td className="p-1.5 text-right font-extrabold">
                          {Number(item.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {/* Minimum row height filler */}
                    {(bill.items?.length || 0) < 2 && (
                      <tr className="border-b border-black h-16">
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Sub-bar below table */}
                <div className="grid grid-cols-12 border-t border-black text-[11px] avoid-break">
                  <div className="col-span-4 border-r border-black p-1.5 font-bold">
                    NO.OF ITEMS : <span className="font-extrabold text-[12px]">{bill.items?.length || 1}</span>
                  </div>
                  <div className="col-span-3 border-r border-black p-1.5 font-bold text-center">
                    TOTAL QTY : <span className="font-extrabold text-[12px]">{totalQty}</span>
                  </div>
                  <div className="col-span-5 p-1.5 space-y-1 text-right">
                    <div className="flex justify-between">
                      <span className="font-semibold">Sub Total :</span>
                      <span className="font-mono">{Number(bill.sub_total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Discount :</span>
                      <span className="font-mono">{Number(bill.total_discount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">SGST Payable :</span>
                      <span className="font-mono">{Number(bill.sgst_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">CGST Payable :</span>
                      <span className="font-mono">{Number(bill.cgst_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">CR/DR Note :</span>
                      <span className="font-mono">{Number(bill.cr_dr_note || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-black pb-1">
                      <span className="font-semibold">Roundoff :</span>
                      <span className="font-mono">{Number(bill.roundoff || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-[14px] pt-1">
                      <span>G.TOTAL =</span>
                      <span>₹ {Number(bill.grand_total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount In Words */}
              <div className="border border-black p-2 mb-2 bg-slate-50 text-[11px] avoid-break">
                <div className="text-[10px] font-semibold text-slate-700">Amount in Words</div>
                <div className="font-bold text-[12px] uppercase tracking-wide">
                  {bill.amount_in_words}
                </div>
              </div>

              {/* GST Breakdown Grid & Bank Details Box */}
              <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] avoid-break">
                {/* GST Breakdown Table */}
                <div className="col-span-8 border border-black overflow-hidden">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-black bg-slate-100 font-bold">
                        <th className="border-r border-black p-1">GST CLASS</th>
                        <th className="border-r border-black p-1">Taxable Amt</th>
                        <th className="border-r border-black p-1">SGST %</th>
                        <th className="border-r border-black p-1">Value</th>
                        <th className="border-r border-black p-1">CGST %</th>
                        <th className="border-r border-black p-1">Value</th>
                        <th className="p-1">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-300">
                        <td className="border-r border-black p-0.5">0.00%</td>
                        <td className="border-r border-black p-0.5">0.00</td>
                        <td className="border-r border-black p-0.5">0</td>
                        <td className="border-r border-black p-0.5">0.0</td>
                        <td className="border-r border-black p-0.5">0</td>
                        <td className="border-r border-black p-0.5">0.0</td>
                        <td className="p-0.5">0.00</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="border-r border-black p-0.5">5.00%</td>
                        <td className="border-r border-black p-0.5">0.00</td>
                        <td className="border-r border-black p-0.5">2.5</td>
                        <td className="border-r border-black p-0.5">0.00</td>
                        <td className="border-r border-black p-0.5">2.5</td>
                        <td className="border-r border-black p-0.5">0.00</td>
                        <td className="p-0.5">0.00</td>
                      </tr>
                      <tr className="border-b border-black font-semibold">
                        <td className="border-r border-black p-0.5">{bill.gst_percent}%</td>
                        <td className="border-r border-black p-0.5">{Number(bill.taxable_amount).toFixed(2)}</td>
                        <td className="border-r border-black p-0.5">{bill.sgst_rate}</td>
                        <td className="border-r border-black p-0.5">{Number(bill.sgst_amount).toFixed(2)}</td>
                        <td className="border-r border-black p-0.5">{bill.cgst_rate}</td>
                        <td className="border-r border-black p-0.5">{Number(bill.cgst_amount).toFixed(2)}</td>
                        <td className="p-0.5">{Number(bill.grand_total).toFixed(2)}</td>
                      </tr>
                      <tr className="font-bold bg-slate-50">
                        <td className="border-r border-black p-0.5">TOTAL</td>
                        <td className="border-r border-black p-0.5">{Number(bill.taxable_amount).toFixed(2)}</td>
                        <td className="border-r border-black p-0.5">-</td>
                        <td className="border-r border-black p-0.5">{Number(bill.sgst_amount).toFixed(2)}</td>
                        <td className="border-r border-black p-0.5">-</td>
                        <td className="border-r border-black p-0.5">{Number(bill.cgst_amount).toFixed(2)}</td>
                        <td className="p-0.5">{Number(bill.grand_total).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bank Details Box */}
                <div className="col-span-4 border border-black p-1.5 space-y-0.5">
                  <div className="font-bold text-center border-b border-black pb-0.5 underline">
                    Bank Details
                  </div>
                  <div><span className="font-semibold">Bank:</span> {shop.bank_name}</div>
                  <div><span className="font-semibold">A/C:</span> {shop.account_no}</div>
                  <div><span className="font-semibold">IFSC:</span> {shop.ifsc_code}</div>
                  <div><span className="font-semibold">UPI ID:</span> {shop.upi_id}</div>
                  {bill.payment?.payment_mode && (
                    <div className="mt-1 pt-1 border-t border-slate-300 font-bold text-blue-900">
                      Paid via: {bill.payment.payment_mode} {bill.payment.finance_company ? `(${bill.payment.finance_company})` : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Terms & Conditions and Signature Section */}
              <div className="border border-black grid grid-cols-12 text-[11px] relative mt-3 avoid-break">
                {/* Terms and Customer Signature */}
                <div className="col-span-7 border-r border-black p-2 flex flex-col justify-between">
                  <div>
                    <div className="font-bold underline text-[11px] mb-1">Terms & Conditions</div>
                    <p className="text-[10px] leading-tight text-slate-800">
                      {shop.terms_1 || '1.No Refund after Sale of Any Mobiles.'}
                    </p>
                    <p className="text-[10px] leading-tight text-slate-800">
                      {shop.terms_2 || '2.All Subject to "PATNA" Jurisdiction Only.'}
                    </p>
                  </div>
                  <div className="pt-8 border-t border-dotted border-black/40 text-center font-bold text-[10px] uppercase">
                    Customers Seal & Signature
                  </div>
                </div>

                {/* Shop Signatory and Stamp Area */}
                <div className="col-span-5 p-2 flex flex-col justify-between text-right relative">
                  <div className="font-bold text-[11px] uppercase">
                    For {shop.shop_name}
                  </div>

                  {/* Stamp graphic */}
                  <div className="my-2 flex justify-center items-center py-2 relative">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-600/80 flex flex-col items-center justify-center p-1 text-blue-700/80 transform -rotate-12 select-none pointer-events-none">
                      <span className="text-[8px] font-black uppercase text-center leading-none">★ {shop.shop_name} ★</span>
                      <span className="text-[7px] text-center leading-none mt-1">Kazipur Quarter Road</span>
                      <span className="text-[9px] font-extrabold uppercase mt-1">PATNA</span>
                    </div>
                    {/* Simulated blue ink signature */}
                    <div className="absolute font-serif italic text-blue-800 font-bold text-[16px] transform rotate-3 translate-y-2 pointer-events-none">
                      Manish
                    </div>
                  </div>

                  <div className="font-bold text-[11px] border-t border-dotted border-black/40 pt-1 text-center">
                    Authorized Signatory
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= FORMAT 2: 80MM POS THERMAL RECEIPT ================= */}
          {format === 'thermal' && (
            <div
              ref={printRef}
              className="print-container print-thermal bg-white text-black p-4 w-[80mm] max-w-[80mm] shadow-lg border border-slate-300 font-mono text-[11px] leading-tight"
            >
              <div className="text-center pb-2 border-b border-dashed border-black">
                <div className="font-black text-sm uppercase">{shop.shop_name}</div>
                <div className="text-[9px] uppercase mt-0.5">{shop.address}</div>
                <div className="text-[9px]">Phone: {shop.phone}</div>
                <div className="text-[9px]">GSTIN: {shop.gstin}</div>
                <div className="font-bold mt-1 text-xs border border-black inline-block px-2 py-0.5">
                  TAX INVOICE
                </div>
              </div>

              <div className="py-2 border-b border-dashed border-black text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span>Inv No: #{bill.invoice_no}</span>
                  <span>Date: {new Date(bill.invoice_date).toLocaleDateString('en-GB')}</span>
                </div>
                <div>Customer: {bill.customer_name}</div>
                <div>Phone: {bill.customer_phone}</div>
                {bill.customer_address && <div>Addr: {bill.customer_address}</div>}
              </div>

              <div className="py-2 border-b border-dashed border-black">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="py-1">Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bill.items || []).map((item, idx) => (
                      <tr key={idx} className="border-b border-dotted border-slate-300">
                        <td className="py-1 pr-1">
                          <div className="font-bold">{item.model_name}</div>
                          <div className="text-[9px] text-slate-700">IMEI: {item.imei_1}</div>
                          {item.finance_name && (
                            <div className="text-[9px] font-semibold">{item.finance_name}</div>
                          )}
                        </td>
                        <td className="py-1 text-center font-bold">{item.quantity}</td>
                        <td className="py-1 text-right font-bold">{Number(item.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="py-2 border-b border-dashed border-black text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>₹{Number(bill.sub_total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%):</span>
                  <span>₹{Number(bill.sgst_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (9%):</span>
                  <span>₹{Number(bill.cgst_amount).toFixed(2)}</span>
                </div>
                {Number(bill.total_discount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount:</span>
                    <span>-₹{Number(bill.total_discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-[12px] border-t border-black pt-1">
                  <span>G.TOTAL:</span>
                  <span>₹{Number(bill.grand_total).toFixed(2)}</span>
                </div>
                <div className="text-[9px] uppercase font-bold text-slate-800 mt-1">
                  {bill.amount_in_words}
                </div>
              </div>

              <div className="py-2 text-[9px] text-center space-y-1 border-b border-dashed border-black">
                <div>Payment Mode: {bill.payment?.payment_mode || 'Cash'}</div>
                <div>Bank: {shop.bank_name}</div>
                <div>UPI: {shop.upi_id}</div>
              </div>

              <div className="pt-2 text-center text-[8px] text-slate-800">
                <div>* {shop.terms_1} *</div>
                <div>* {shop.terms_2} *</div>
                <div className="font-bold mt-1 text-[10px]">Thank you for visiting!</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}