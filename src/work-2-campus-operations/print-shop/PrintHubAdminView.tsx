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
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrintOrderStatus, PrintOrder } from '../../types';
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
  const [printingJob, setPrintingJob] = useState<PrintOrder | null>(null);

  const activeOrders = printOrders.filter(order => {
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') return false;
    if (filterShop !== 'ALL' && order.shopName && !order.shopName.includes(filterShop)) return false;
    return true;
  });

  const saveRates = (event: React.FormEvent) => {
    event.preventDefault();
    updatePrintRates(rates);
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

  const handleRealPrint = (order: PrintOrder) => {
    setPrintingJob(order);
    showToast(`Opening Print Dialog for Order #${order.id}...`);
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
              Advance process states, trigger direct print runs, and configure fixed pricing for college reprographics.
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
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Live Print Orders Queue</h2>
            </div>

            {/* Filter by Shop */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">Counter:</span>
              <select 
                value={filterShop}
                onChange={e => setFilterShop(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Print Shops</option>
                <option value="Main">DSCE Main Xerox</option>
                <option value="Heritage">Heritage Xerox</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
                No active print orders pending for this shop queue.
              </div>
            ) : (
              activeOrders.map(order => (
                <article key={order.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black font-mono text-campus-600 dark:text-campus-400">
                          {order.id}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${statusStyles[order.status]}`}>
                          {order.status.replaceAll('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {order.shopName || 'DSCE Main Xerox'}
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {order.studentName} • <span className="font-mono text-slate-500">{order.studentRoll}</span>
                      </p>

                      <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs">
                        <span className="font-bold text-slate-500 block mb-0.5">Attached Files:</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">
                          {order.files.map(f => f.name).join(', ')}
                        </p>
                      </div>

                      <div className="mt-3 grid gap-2 text-[11px] text-slate-500 sm:grid-cols-2">
                        <span>
                          <strong>{order.colorMode === 'COLOR' ? 'Color Print' : 'Black & White'}</strong> • {order.pageCount} pages × {order.copies} copy/copies
                        </span>
                        <span>
                          <strong>Layout:</strong> {printLayoutLabels[order.layout]}
                        </span>
                        <span>
                          <strong>Binding:</strong> {printBindingLabels[order.binding]}
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          Total Amount Paid: ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Operator Controls & Real Print Action */}
                    <div className="flex shrink-0 flex-col gap-2 lg:w-48">
                      {/* Real Print Action Button */}
                      <button
                        type="button"
                        onClick={() => handleRealPrint(order)}
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

      {/* Hidden Print Docket (used by window.print) */}
      {printingJob && (
        <div id="print-job-docket" className="hidden print:block p-8 text-black bg-white">
          <div className="border-b-2 border-black pb-4 mb-4">
            <h1 className="text-2xl font-black">DAYANANDA SAGAR COLLEGE OF ENGINEERING</h1>
            <p className="text-sm font-bold">Println Reprographics • Job Production Ticket</p>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Order ID:</strong> {printingJob.id}</p>
            <p><strong>Print Shop:</strong> {printingJob.shopName || 'DSCE Main Xerox'}</p>
            <p><strong>Student Name:</strong> {printingJob.studentName} ({printingJob.studentRoll})</p>
            <p><strong>Files to Print:</strong> {printingJob.files.map(f => f.name).join(', ')}</p>
            <p><strong>Mode:</strong> {printingJob.colorMode === 'COLOR' ? 'Color' : 'Black & White'}</p>
            <p><strong>Layout:</strong> {printLayoutLabels[printingJob.layout]}</p>
            <p><strong>Binding:</strong> {printBindingLabels[printingJob.binding]}</p>
            <p><strong>Copies:</strong> {printingJob.copies}</p>
            <p><strong>Total Amount Collected:</strong> ₹{printingJob.totalAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
};
