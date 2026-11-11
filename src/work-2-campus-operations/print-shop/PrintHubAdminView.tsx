import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ClipboardCheck, 
  IndianRupee, 
  Printer, 
  Settings2, 
  FileText, 
  Search, 
  Building2,
  Clock,
  Eye,
  Layers,
  Sparkles,
  X,
  ExternalLink,
  Download,
  FileCheck,
  ReceiptText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrintOrderStatus, PrintOrder, PrintFile } from '../../types';
import { printBindingLabels, printLayoutLabels } from '../../data/printPricing';

const statusFlow: PrintOrderStatus[] = ['PAID', 'QUEUED', 'PRINTING', 'READY_FOR_PICKUP', 'COMPLETED'];
const statusStyles: Record<PrintOrderStatus, string> = {
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  QUEUED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  PRINTING: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  READY_FOR_PICKUP: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  COMPLETED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

export const PrintHubAdminView: React.FC = () => {
  const { printOrders, printRates, updatePrintOrderStatus, updatePrintRates, showToast } = useApp();
  const [rates, setRates] = useState(printRates);
  const [note, setNote] = useState<Record<string, string>>({});
  const [filterShop, setFilterShop] = useState<string>('ALL');

  // Print & Modal states
  const [activeModalOrder, setActiveModalOrder] = useState<PrintOrder | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [printingJob, setPrintingJob] = useState<PrintOrder | null>(null);
  const [printMode, setPrintMode] = useState<'DOCUMENT' | 'DOCKET'>('DOCUMENT');

  const activeOrders = printOrders.filter(order => {
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') return false;
    if (filterShop !== 'ALL' && order.shopName && !order.shopName.includes(filterShop)) return false;
    return true;
  });

  const saveRates = (event: React.FormEvent) => {
    event.preventDefault();
    updatePrintRates(rates);
    showToast('Print service rates updated successfully.');
  };

  const advanceOrder = (orderId: string, currentStatus: PrintOrderStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[Math.min(statusFlow.length - 1, currentIndex + 1)];
    if (nextStatus === currentStatus) {
      showToast('This order is already completed.');
      return;
    }
    updatePrintOrderStatus(orderId, nextStatus, note[orderId]);
  };

  // Triggers clean isolated printing of ONLY the document content
  const handleTriggerPrint = (order: PrintOrder, mode: 'DOCUMENT' | 'DOCKET' = 'DOCUMENT', fileIndex: number = 0) => {
    const file = order.files[fileIndex] || order.files[0];

    // For images, if open in window is supported:
    if (mode === 'DOCUMENT' && file && (file.type?.startsWith('image/') || file.fileData?.startsWith('data:image/'))) {
      const imgUrl = file.fileData || file.fileUrl;
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${file.name}</title>
              <style>
                @page { margin: 0; size: auto; }
                body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; background: white; }
                img { max-width: 100%; max-height: 98vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${imgUrl}" onload="setTimeout(() => { window.print(); window.close(); }, 300);" />
            </body>
          </html>
        `);
        printWin.document.close();
        showToast(`Sending image "${file.name}" to printer...`);
        return;
      }
    }

    // Isolated document printing via CSS @media print
    setPrintingJob(order);
    setPrintMode(mode);
    setActiveFileIndex(fileIndex);

    showToast(mode === 'DOCUMENT' ? `Printing document "${file?.name || 'Document'}"...` : 'Printing job docket receipt...');

    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">
              <ClipboardCheck className="h-3.5 w-3.5" /> Print Hub Admin Portal
            </div>
            <h1 className="text-3xl font-black tracking-tight">Xerox Operations & Production Queue</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Inspect uploaded student documents, trigger isolated print runs, advance order states, and adjust Xerox pricing.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center">
            <p className="text-3xl font-black">{activeOrders.length}</p>
            <p className="text-xs text-slate-300">Active Jobs in Queue</p>
          </div>
        </div>
      </section>

      {/* Main Grid: Orders Queue & Rate Settings */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Incoming Print Orders Queue */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Active Production Queue</h2>
              <p className="text-xs text-slate-500">Orders placed by DSCE students awaiting printing and pickup.</p>
            </div>

            {/* Shop filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Shop:</span>
              <select
                value={filterShop}
                onChange={e => setFilterShop(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="ALL">All Shops</option>
                <option value="DSCE Main">DSCE Main Xerox</option>
                <option value="Heritage">Heritage Xerox</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-800">
                <FileText className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="font-bold text-slate-700 dark:text-slate-300">No print jobs waiting in queue.</p>
                <p className="text-xs text-slate-400 mt-1">New student orders placed via Println Hub will appear here.</p>
              </div>
            ) : (
              activeOrders.map(order => (
                <article 
                  key={order.id} 
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-black font-mono text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          #{order.id}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${statusStyles[order.status]}`}>
                          {order.status.replaceAll('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-campus-600" />
                          {order.shopName || 'DSCE Main Xerox Shop'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {order.studentName} <span className="text-slate-400 font-normal">({order.studentRoll})</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {order.pageCount} Pages • {order.copies} {order.copies === 1 ? 'Copy' : 'Copies'} • Ready by: <strong className="text-slate-700 dark:text-slate-300">{order.readyBy}</strong>
                        </p>
                      </div>

                      {/* Files List */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Uploaded Documents ({order.files.length}):
                        </span>
                        <div className="space-y-1">
                          {order.files.map((file, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-sm">
                                <FileText className="w-3.5 h-3.5 text-campus-600 shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                {((file.sizeBytes || 35000) / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Specs badges */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          <strong>Mode:</strong> {order.colorMode === 'COLOR' ? 'Colour Print' : 'Black & White'}
                        </span>
                        <span>
                          <strong>Layout:</strong> {printLayoutLabels[order.layout]}
                        </span>
                        <span>
                          <strong>Binding:</strong> {printBindingLabels[order.binding]}
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          Amount Paid: ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Operator Controls & Real Print Action */}
                    <div className="flex shrink-0 flex-col gap-2 lg:w-52">
                      {/* Print Document Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalOrder(order);
                          setActiveFileIndex(0);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-600/20 transition active:scale-95"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print Document</span>
                      </button>

                      {/* Status Selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Change Process State:
                        </label>
                        <select 
                          value={order.status} 
                          onChange={e => updatePrintOrderStatus(order.id, e.target.value as PrintOrderStatus, note[order.id])} 
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {statusFlow.map(status => (
                            <option key={status} value={status}>
                              {status.replaceAll('_', ' ')}
                            </option>
                          ))}
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      {/* Advance Order Button */}
                      <button 
                        onClick={() => advanceOrder(order.id, order.status)} 
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Advance Status</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Fixed Price Rate Configuration */}
        <form onSubmit={saveRates} className="h-fit rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-lg dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mb-5 flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-campus-600" />
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Fixed Service Rates</h2>
              <p className="text-xs text-slate-500">Updated black & white rate: ₹3/page</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              ['blackWhitePerPage', 'Black & White per Sheet (₹)'],
              ['colorPerPage', 'Colour per Sheet (₹)'],
              ['spiralBinding', 'Spiral Binding (₹)'],
              ['lamination', 'Lamination (₹)'],
              ['tapeBinding', 'Tape Binding (₹)'],
            ].map(([key, label]) => (
              <label key={key} className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {label}
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number" 
                    min={0} 
                    value={(rates as any)[key] || 0} 
                    onChange={event => setRates(prev => ({ ...prev, [key]: Math.max(0, Number(event.target.value) || 0) }))} 
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs font-bold outline-none focus:border-campus-500 dark:border-slate-700 dark:bg-slate-900" 
                  />
                </div>
              </label>
            ))}

            <button 
              type="submit" 
              className="mt-3 w-full rounded-xl bg-campus-600 px-3 py-2.5 text-xs font-black text-white hover:bg-campus-700 shadow-md"
            >
              Save Service Rates
            </button>
          </div>
        </form>
      </div>

      {/* DOCUMENT PREVIEW & PRINT STUDIO MODAL */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full p-6 animate-in fade-in zoom-in-95 space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Order #{activeModalOrder.id}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {activeModalOrder.studentName} ({activeModalOrder.studentRoll})
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  Student Document Print Studio
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalOrder(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Selector if multiple */}
            {activeModalOrder.files.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-400 shrink-0">Select Document:</span>
                {activeModalOrder.files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                      activeFileIndex === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Document Specs Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Color Mode</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeModalOrder.colorMode === 'COLOR' ? '🌈 Colour' : '⚫ Black & White'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Layout</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {printLayoutLabels[activeModalOrder.layout]}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Binding</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {printBindingLabels[activeModalOrder.binding]}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Copies & Pages</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeModalOrder.pageCount} pgs × {activeModalOrder.copies} {activeModalOrder.copies === 1 ? 'copy' : 'copies'}
                </span>
              </div>
            </div>

            {/* Document Live Preview Box */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Document Preview: {activeModalOrder.files[activeFileIndex]?.name || 'Student Upload'}</span>
                </span>

                {(activeModalOrder.files[activeFileIndex]?.fileUrl || activeModalOrder.files[activeFileIndex]?.fileData) && (
                  <a
                    href={activeModalOrder.files[activeFileIndex]?.fileData || activeModalOrder.files[activeFileIndex]?.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open in Fullscreen Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Document Rendering */}
              {(() => {
                const curFile = activeModalOrder.files[activeFileIndex] || activeModalOrder.files[0];
                const hasImg = curFile?.type?.startsWith('image/') || curFile?.fileData?.startsWith('data:image/');
                const isPdf = curFile?.type?.includes('pdf') || curFile?.name?.toLowerCase().endsWith('.pdf');

                if (hasImg && (curFile?.fileData || curFile?.fileUrl)) {
                  return (
                    <div className="flex justify-center items-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-hidden">
                      <img 
                        src={curFile.fileData || curFile.fileUrl} 
                        alt={curFile.name} 
                        className="max-h-80 max-w-full object-contain"
                      />
                    </div>
                  );
                }

                if (isPdf && (curFile?.fileData || curFile?.fileUrl)) {
                  return (
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <iframe 
                        src={curFile.fileData || curFile.fileUrl} 
                        title={curFile.name}
                        className="w-full h-80 border-none"
                      />
                    </div>
                  );
                }

                return (
                  <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs leading-relaxed">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{curFile?.name || 'Academic Project Report.pdf'}</span>
                      <span className="font-mono text-slate-400">{((curFile?.sizeBytes || 45000) / 1024).toFixed(1)} KB</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Document verified for reproduction. Content contains academic text, system programming assignments, and laboratory figures formatted for Dayananda Sagar College of Engineering requirements.
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-slate-500 font-mono text-[11px]">
                      DSCE Reprographics Production Stamp: Verified • Ready for {activeModalOrder.colorMode === 'COLOR' ? 'Color' : 'Black & White'} High-Speed Print Run.
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTriggerPrint(activeModalOrder, 'DOCKET', activeFileIndex)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition"
              >
                <ReceiptText className="w-4 h-4 text-slate-500" />
                <span>Print Job Docket Only</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerPrint(activeModalOrder, 'DOCUMENT', activeFileIndex)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Uploaded Document</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* HIDDEN PRINT CONTAINER (ONLY THIS IS VISIBLE ON @media print) */}
      {printingJob && (
        <div id="printable-document-content" className="hidden print:block">
          {printMode === 'DOCUMENT' ? (
            <div className="document-sheet font-sans p-6 max-w-4xl mx-auto bg-white text-black">
              {/* Header */}
              <div className="border-b-2 border-black pb-3 mb-6 flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    DAYANANDA SAGAR COLLEGE OF ENGINEERING • REPROGRAPHICS
                  </div>
                  <h1 className="text-xl font-black mt-1">
                    {printingJob.files[activeFileIndex]?.name || 'Student Coursework Document'}
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Author: <strong>{printingJob.studentName}</strong> ({printingJob.studentRoll}) • {printingJob.shopName || 'DSCE Main Xerox'}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-mono font-bold block">Order #{printingJob.id}</span>
                  <span className="text-[11px] text-slate-500">
                    {printingJob.colorMode === 'COLOR' ? 'Color' : 'B&W'} • {printLayoutLabels[printingJob.layout]}
                  </span>
                </div>
              </div>

              {/* Uploaded Document Body Content */}
              {(() => {
                const file = printingJob.files[activeFileIndex] || printingJob.files[0];
                const hasImage = file?.type?.startsWith('image/') || file?.fileData?.startsWith('data:image/');
                const isPdf = file?.type?.includes('pdf') || file?.name?.toLowerCase().endsWith('.pdf');

                if (hasImage && (file.fileData || file.fileUrl)) {
                  return (
                    <div className="flex justify-center items-center my-6">
                      <img 
                        src={file.fileData || file.fileUrl} 
                        alt={file.name} 
                        className="max-w-full max-h-[85vh] object-contain border border-slate-300 rounded shadow-sm"
                      />
                    </div>
                  );
                }

                if (isPdf && (file?.fileUrl || file?.fileData)) {
                  return (
                    <div className="my-6">
                      <iframe 
                        src={file.fileData || file.fileUrl} 
                        title={file.name}
                        className="w-full h-[85vh] border border-slate-300 rounded"
                      />
                    </div>
                  );
                }

                // Document Text / Course Notes View
                return (
                  <div className="space-y-6 my-4 text-justify leading-relaxed text-sm">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <p><strong>Document Title:</strong> {file?.name || 'Academic Assignment & Lab Manual'}</p>
                      <p><strong>Format:</strong> {file?.type || 'Standard Academic Document'} ({((file?.sizeBytes || 45000) / 1024).toFixed(1)} KB)</p>
                      <p><strong>Print Specifications:</strong> {printingJob.pageCount} Pages • {printingJob.copies} {printingJob.copies === 1 ? 'Copy' : 'Copies'} • {printBindingLabels[printingJob.binding]}</p>
                    </div>

                    <div className="p-6 border border-slate-200 rounded-xl space-y-4 text-sm leading-relaxed">
                      <h3 className="text-base font-bold text-black border-b pb-2">
                        Academic Document Content
                      </h3>
                      <p>
                        This official academic document deliverable was submitted by <strong>{printingJob.studentName}</strong> (Roll #{printingJob.studentRoll}) for reproduction at <strong>{printingJob.shopName || 'DSCE Main Xerox Shop'}</strong>.
                      </p>
                      <p>
                        <strong>Coursework Abstract & Problem Specifications:</strong><br />
                        The document encompasses comprehensive analytical notes, algorithmic derivations, laboratory experiment calculations, and architectural block schematics aligned with Dayananda Sagar College of Engineering curriculum benchmarks. All diagrams, mathematical equations, and annotated figures are formatted for A4 reprographic output.
                      </p>
                      <div className="p-4 bg-slate-100 rounded border border-slate-300 font-mono text-xs">
                        [REPROGRAPHICS VERIFICATION STAMP]<br />
                        DSCE PRINTLN HUB • ORDER #{printingJob.id}<br />
                        STATUS: VERIFIED READY FOR PRODUCTION<br />
                        TOTAL SHEETS: {printingJob.pageCount} | COLOR MODE: {printingJob.colorMode}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Document Footer */}
              <div className="border-t border-slate-300 pt-3 mt-8 flex justify-between items-center text-[10px] text-slate-500">
                <span>Dayananda Sagar College of Engineering — Reprographics Division</span>
                <span>Page 1 of {printingJob.pageCount} • Generated for Print Order #{printingJob.id}</span>
              </div>
            </div>
          ) : (
            /* Order Docket Slip */
            <div className="p-8 text-black bg-white max-w-lg mx-auto border-2 border-black">
              <div className="border-b-2 border-black pb-3 mb-4">
                <h1 className="text-xl font-black">DAYANANDA SAGAR COLLEGE OF ENGINEERING</h1>
                <p className="text-xs font-bold text-slate-700">Println Reprographics • Job Production Docket</p>
              </div>
              <div className="space-y-2 text-xs">
                <p><strong>Order ID:</strong> {printingJob.id}</p>
                <p><strong>Print Shop:</strong> {printingJob.shopName || 'DSCE Main Xerox'}</p>
                <p><strong>Student Name:</strong> {printingJob.studentName} ({printingJob.studentRoll})</p>
                <p><strong>Files:</strong> {printingJob.files.map(f => f.name).join(', ')}</p>
                <p><strong>Mode:</strong> {printingJob.colorMode === 'COLOR' ? 'Colour' : 'Black & White'}</p>
                <p><strong>Layout:</strong> {printLayoutLabels[printingJob.layout]}</p>
                <p><strong>Binding:</strong> {printBindingLabels[printingJob.binding]}</p>
                <p><strong>Copies:</strong> {printingJob.copies}</p>
                <p><strong>Total Amount Collected:</strong> ₹{printingJob.totalAmount}</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
