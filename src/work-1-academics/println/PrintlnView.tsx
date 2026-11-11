import React, { useMemo, useRef, useState } from 'react';
import { 
  BellRing, 
  CheckCircle2, 
  Clock3, 
  FileText, 
  Printer, 
  ReceiptText, 
  UploadCloud, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  AlertCircle, 
  IndianRupee, 
  Check, 
  Copy,
  Ban,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrintBinding, PrintColorMode, PrintFile, PrintLayout, PrintOrder } from '../../types';
import { getPrintAmount, getPrintSheetCount, printBindingLabels, printLayoutLabels } from '../../data/printPricing';

const PRINT_SHOPS = [
  {
    id: 'shop_dsce_main',
    name: 'DSCE Main Xerox Shop',
    location: 'Ground Floor, Central Library & Admin Block',
    hours: '8:30 AM - 7:00 PM',
    speed: 'High Speed Digital Duplex',
    queueWait: 'Avg ~4 mins',
    rating: '4.9 ★',
    colorSupported: true
  },
  {
    id: 'shop_heritage',
    name: 'Heritage Xerox & Stationery Center',
    location: 'Near Architecture & Mechanical Workshop Block',
    hours: '8:30 AM - 6:30 PM',
    speed: 'Heavy Duty Plotter & Color Laser',
    queueWait: 'Avg ~6 mins',
    rating: '4.7 ★',
    colorSupported: true
  }
];

const statusStyles: Record<PrintOrder['status'], string> = {
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  QUEUED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  PRINTING: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  READY_FOR_PICKUP: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  COMPLETED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

const getDefaultReadyBy = () => {
  const date = new Date(Date.now() + 2 * 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PrintlnView: React.FC = () => {
  const { 
    currentUser, 
    printOrders, 
    printRates, 
    placePrintOrder, 
    cancelPrintOrder,
    markPrintNotificationRead, 
    showToast 
  } = useApp();

  // 4-step wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form selections
  const [selectedShop, setSelectedShop] = useState(PRINT_SHOPS[0].name);
  const [files, setFiles] = useState<PrintFile[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [layout, setLayout] = useState<PrintLayout>('ALL_PAGES');
  const [colorMode, setColorMode] = useState<PrintColorMode>('BLACK_WHITE');
  const [binding, setBinding] = useState<PrintBinding>('NONE');
  const [copies, setCopies] = useState(1);
  const [readyBy, setReadyBy] = useState(getDefaultReadyBy);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active placed bill view
  const [placedOrder, setPlacedOrder] = useState<PrintOrder | null>(null);
  const [inspectingBillOrder, setInspectingBillOrder] = useState<PrintOrder | null>(null);

  const draft = { files, pageCount, layout, colorMode, binding, copies, readyBy };
  const totalAmount = useMemo(() => getPrintAmount(draft, printRates), [binding, colorMode, copies, layout, pageCount, files, readyBy, printRates]);
  const sheets = getPrintSheetCount(pageCount, layout);

  const myOrders = printOrders.filter(order => order.studentId === currentUser.id);
  const readyOrders = myOrders.filter(order => order.status === 'READY_FOR_PICKUP' && !order.notificationRead);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []).map(file => ({
      name: file.name,
      type: file.type || 'application/octet-stream',
      sizeBytes: file.size,
    }));
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      showToast('Please upload at least one document.');
      return;
    }

    const orderId = `PRN-DSCE-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: PrintOrder = {
      ...draft,
      id: orderId,
      shopName: selectedShop,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.rollNumber,
      totalAmount,
      status: 'PAID',
      paymentStatus: 'PAID',
      notificationRead: false,
      createdAt: new Date().toISOString()
    };

    placePrintOrder(newOrder);
    setPlacedOrder(newOrder);

    // Reset draft
    setFiles([]);
    setPageCount(1);
    setLayout('ALL_PAGES');
    setColorMode('BLACK_WHITE');
    setBinding('NONE');
    setCopies(1);
    setReadyBy(getDefaultReadyBy());
    if (fileInputRef.current) fileInputRef.current.value = '';
    setCurrentStep(1);
  };

  const handleCancelClick = (orderId: string) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}? Your payment will be refunded immediately.`)) {
      cancelPrintOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-campus-900 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-campus-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-campus-100">
              <Printer className="h-3.5 w-3.5" /> Println Hub • 4-Step Express Queue
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Order printouts in 4 simple steps.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">
              Choose your Xerox shop, attach any file type, pick paper and binding options, and receive an instant order token. Skip the waiting queue at the counter!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-black">{myOrders.length}</div>
              <div className="text-indigo-200">My Orders</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-black">{readyOrders.length}</div>
              <div className="text-indigo-200">Ready to Collect</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready for Pickup Alert */}
      {readyOrders.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-900 dark:text-emerald-200 shadow-sm">
          <div className="flex items-start gap-3">
            <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="flex-1">
              <p className="text-sm font-black">Your printout is ready for pickup at the counter!</p>
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                Show or say your Order ID at the counter to collect your documents immediately without waiting in queue.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {readyOrders.map(order => (
                  <button 
                    key={order.id} 
                    onClick={() => markPrintNotificationRead(order.id)} 
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    {order.id} • Mark Collected
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placed Order Bill Modal / Notice */}
      {placedOrder && (
        <div className="rounded-3xl border-2 border-campus-500 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Payment Successful • Order Confirmed
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Order ID: <span className="font-mono text-campus-600 dark:text-campus-400">{placedOrder.id}</span>
                </h3>
              </div>
            </div>
            <button 
              onClick={() => setPlacedOrder(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              Close Notice
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Pick Up Counter:</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">{placedOrder.shopName || 'DSCE Main Xerox Shop'}</p>
              <p className="text-xs text-slate-500 mt-1">
                Say Order ID <strong className="text-campus-600 font-mono text-sm">{placedOrder.id}</strong> at the counter to collect your document.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Bill / Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Step Progress Indicator */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { num: 1, title: 'Step 1: Choose Shop', desc: 'Select Xerox Location' },
          { num: 2, title: 'Step 2: Add Document', desc: 'Attach Any File Type' },
          { num: 3, title: 'Step 3: Print Options', desc: 'Color, Sheets & Binding' },
          { num: 4, title: 'Step 4: Pay & Bill', desc: 'Review & Collect Token' },
        ].map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;

          return (
            <div 
              key={s.num}
              onClick={() => {
                // Only allow going back or forward if valid
                if (s.num === 1) setCurrentStep(1);
                else if (s.num === 2) setCurrentStep(2);
                else if (s.num === 3 && files.length > 0) setCurrentStep(3);
                else if (s.num === 4 && files.length > 0) setCurrentStep(4);
              }}
              className={`p-3 sm:p-4 rounded-2xl border transition cursor-pointer ${
                isActive 
                  ? 'border-campus-500 bg-campus-50 dark:bg-campus-950/40 ring-2 ring-campus-500/20' 
                  : isDone 
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  isDone 
                    ? 'bg-emerald-600 text-white' 
                    : isActive 
                      ? 'bg-campus-600 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {isDone ? '✓' : s.num}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {s.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 hidden sm:block truncate">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main 4-Step Form Container */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
          
          {/* STEP 1: CHOOSE PRINT SHOP */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 1: Choose the Print Shop</h2>
                  <p className="text-xs text-slate-500">Select which Xerox counter will process and package your printout.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRINT_SHOPS.map((shop) => {
                  const isSelected = selectedShop === shop.name;

                  return (
                    <div
                      key={shop.id}
                      onClick={() => setSelectedShop(shop.name)}
                      className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'border-campus-600 bg-campus-50/60 dark:bg-campus-950/40 shadow-lg shadow-campus-600/10 ring-2 ring-campus-500/20' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-campus-600 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-campus-600 dark:text-campus-400 bg-campus-100 dark:bg-campus-950 px-2 py-0.5 rounded-full">
                          Open Now
                        </span>
                        <span className="text-xs font-bold text-amber-600">{shop.rating}</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {shop.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-start gap-1">
                        <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                        {shop.location}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span>🕒 {shop.hours}</span>
                        <span className="font-bold text-indigo-600">{shop.queueWait}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-2xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-campus-600/25 transition"
                >
                  <span>Proceed to Step 2: Add Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADD A DOCUMENT (ALL TYPES SUPPORTED + MULTIPLE DOCS) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 2: Add Document(s)</h2>
                  <p className="text-xs text-slate-500">All file formats supported. You can upload multiple documents at once.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Upload Document(s) [PDF, DOCX, PPT, Images, Code, Any Format]
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-3xl border-2 border-dashed border-campus-300 dark:border-campus-800 bg-campus-50/30 dark:bg-campus-950/20 hover:border-campus-500 transition cursor-pointer text-center space-y-2"
                >
                  <UploadCloud className="w-10 h-10 mx-auto text-campus-600" />
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Click or Drag & Drop documents here</p>
                  <p className="text-xs text-slate-400">Supported: PDF, Word, PPTX, Excel, Images (JPG/PNG), CAD, TXT & Code</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="*/*"
                    onChange={handleFiles}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Uploaded Files List */}
              {files.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                    <span>Uploaded Files ({files.length}):</span>
                    <span>Total Estimated Pages:</span>
                  </div>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-campus-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-400">{formatFileSize(file.sizeBytes)} • Ready for print</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Specify total pages across uploaded documents:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={pageCount}
                      onChange={e => setPageCount(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full sm:w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold outline-none focus:border-campus-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Please upload at least one document to proceed to Step 3.</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button
                  type="button"
                  disabled={files.length === 0}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-2xl bg-campus-600 hover:bg-campus-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-campus-600/25 transition"
                >
                  <span>Continue to Step 3: Print Options</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT TYPE OF XEROX, PAGES PER SHEET & BINDING */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 3: Print & Finishing Options</h2>
                  <p className="text-xs text-slate-500">Customize color mode, sheet layout, and binding types.</p>
                </div>
              </div>

              {/* Print Color Mode */}
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Type of Xerox / Print</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setColorMode('BLACK_WHITE')}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      colorMode === 'BLACK_WHITE'
                        ? 'border-campus-600 bg-campus-50/60 dark:bg-campus-950/40 ring-2 ring-campus-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900 dark:text-white">Black & White</span>
                      <span className="text-xs font-bold text-campus-600">₹{printRates.blackWhitePerPage} / sheet</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Standard grayscale notes and assignments</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorMode('COLOR')}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      colorMode === 'COLOR'
                        ? 'border-campus-600 bg-campus-50/60 dark:bg-campus-950/40 ring-2 ring-campus-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900 dark:text-white">Colour Print</span>
                      <span className="text-xs font-bold text-campus-600">₹{printRates.colorPerPage} / sheet</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Vibrant diagrams, charts & project reports</p>
                  </button>
                </div>
              </div>

              {/* Number of Pages in One Sheet */}
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Number of Pages in One Sheet</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(printLayoutLabels) as PrintLayout[]).map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setLayout(option)}
                      className={`p-3 rounded-xl border text-center transition ${
                        layout === option
                          ? 'border-campus-600 bg-campus-50 text-campus-700 dark:bg-campus-950/50 dark:text-campus-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs block font-bold">{printLayoutLabels[option]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Binding Options */}
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Binding & Lamination</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(printBindingLabels) as PrintBinding[]).map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setBinding(option)}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        binding === option
                          ? 'border-campus-600 bg-campus-50 text-campus-700 dark:bg-campus-950/50 dark:text-campus-300 font-bold ring-2 ring-campus-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs block font-bold">{printBindingLabels[option]}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {option === 'NONE' ? 'Free (₹0)' :
                         option === 'SPIRAL' ? `+₹${printRates.spiralBinding}` :
                         option === 'TAPE' ? `+₹${printRates.tapeBinding || 15}` :
                         option === 'LAMINATION' ? `+₹${printRates.lamination}` : `+₹${printRates.spiralBinding + printRates.lamination}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copies & Schedule */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Number of Copies:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={copies}
                    onChange={e => setCopies(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-bold outline-none focus:border-campus-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Ready By (Expected Time):
                  </label>
                  <input
                    type="datetime-local"
                    value={readyBy}
                    onChange={e => setReadyBy(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none focus:border-campus-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-2xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-campus-600/25 transition"
                >
                  <span>Proceed to Step 4: Review & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW, BILL & MAKE PAYMENT */}
          {currentStep === 4 && (
            <form onSubmit={handleCompleteOrder} className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                  <ReceiptText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 4: Review & Make Payment</h2>
                  <p className="text-xs text-slate-500">Confirm order specifications. Bill with Order ID will be generated upon payment.</p>
                </div>
              </div>

              {/* Order Invoice Summary Breakdown */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500">Xerox Destination:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedShop}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500">Documents Attached:</span>
                  <span className="font-bold text-indigo-600">{files.map(f => f.name).join(', ') || '1 Document'}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500">Print Mode:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {colorMode === 'COLOR' ? 'Colour Print' : 'Black & White'} (₹{colorMode === 'COLOR' ? printRates.colorPerPage : printRates.blackWhitePerPage}/sheet)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500">Layout & Binding:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {printLayoutLabels[layout]} • {printBindingLabels[binding]}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500">Sheets & Copies:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sheets} sheet(s) × {copies} copy/copies = {sheets * copies} total prints
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">Total Bill Payable:</span>
                  <span className="text-2xl font-black text-campus-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector Simulation */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <p className="font-bold">Instant Campus Pay & Counter Clearance</p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Upon payment, a distinct Order ID is issued. Note down the number or take a screenshot of your bill to collect your printout from the operator.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-campus-600 hover:from-emerald-500 hover:to-campus-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/20 transition hover:scale-[1.02]"
                >
                  <ReceiptText className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} & Generate Official Bill</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Sidebar: Live Estimate & My Orders with Cancel Feature */}
        <aside className="space-y-5">
          {/* Live Estimate Card */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Order Estimate</p>
                <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">₹{totalAmount}</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Shop:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{selectedShop}</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Sheets:</span>
                <span>{sheets} sheets × {copies} copy/copies</span>
              </div>
              <div className="flex justify-between">
                <span>Print Rate:</span>
                <span>{colorMode === 'COLOR' ? 'Color (₹10/sheet)' : 'B&W (₹3/sheet)'}</span>
              </div>
              <div className="flex justify-between">
                <span>Binding:</span>
                <span>{printBindingLabels[binding]}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800">
                Rates: B&W ₹3 • Color ₹10 • Spiral ₹25 • Lamination ₹20 • Tape ₹15
              </div>
            </div>
          </div>

          {/* Student's Print Orders List with Cancel & View Bill Features */}
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">My Orders History</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {myOrders.length} Orders
              </span>
            </div>

            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <p className="text-xs leading-5 text-slate-400">Your submitted print orders and tokens will appear here.</p>
              ) : (
                myOrders.map(order => {
                  const canCancel = ['PAID', 'QUEUED', 'PAYMENT_PENDING'].includes(order.status);

                  return (
                    <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-black text-campus-600 dark:text-campus-400 font-mono">
                            {order.id}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">{order.shopName || 'DSCE Xerox'}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[180px] mt-0.5">
                            {order.files.map(f => f.name).join(', ')}
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${statusStyles[order.status]}`}>
                          {order.status.replaceAll('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300">₹{order.totalAmount}</span>
                        <span>{order.copies} {order.copies === 1 ? 'copy' : 'copies'}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setInspectingBillOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <ReceiptText className="w-3 h-3" />
                          View Bill
                        </button>

                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => handleCancelClick(order.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-[10px] font-bold transition flex items-center gap-1 border border-rose-200 dark:border-rose-900"
                          >
                            <Ban className="w-3 h-3" />
                            Cancel Order
                          </button>
                        ) : order.status === 'CANCELLED' ? (
                          <span className="text-[10px] text-rose-500 font-bold">Cancelled & Refunded</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">In Processing</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* View Bill Modal */}
      {inspectingBillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-campus-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">Println Hub Official Receipt</h3>
              </div>
              <button 
                onClick={() => setInspectingBillOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Pickup Order Token</span>
              <div className="text-2xl font-black font-mono text-campus-600 dark:text-campus-400 tracking-wider">
                {inspectingBillOrder.id}
              </div>
              <p className="text-xs text-slate-500 font-semibold">Say this number at the counter to collect your printout</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Shop:</span>
                <span className="font-bold text-slate-900 dark:text-white">{inspectingBillOrder.shopName || 'DSCE Main Xerox'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900 dark:text-white">{inspectingBillOrder.studentName} ({inspectingBillOrder.studentRoll})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Files:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{inspectingBillOrder.files.map(f => f.name).join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Print Specifications:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inspectingBillOrder.colorMode === 'COLOR' ? 'Color' : 'B&W'} • {inspectingBillOrder.pageCount} pgs × {inspectingBillOrder.copies}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Binding:</span>
                <span className="font-bold text-slate-900 dark:text-white">{printBindingLabels[inspectingBillOrder.binding]}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm font-black text-slate-900 dark:text-white">Total Amount Paid:</span>
                <span className="text-lg font-black text-campus-600">₹{inspectingBillOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={() => setInspectingBillOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
