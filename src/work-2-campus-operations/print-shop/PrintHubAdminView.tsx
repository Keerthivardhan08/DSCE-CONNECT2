import React, { useState } from 'react';
import { CheckCircle2, ClipboardCheck, IndianRupee, Printer, Settings2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrintOrderStatus } from '../../types';

const statusFlow: PrintOrderStatus[] = ['PAID', 'QUEUED', 'PRINTING', 'READY_FOR_PICKUP', 'COMPLETED'];
const statusStyles: Record<PrintOrderStatus, string> = {
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700', PAID: 'bg-blue-100 text-blue-700', QUEUED: 'bg-indigo-100 text-indigo-700', PRINTING: 'bg-violet-100 text-violet-700', READY_FOR_PICKUP: 'bg-emerald-100 text-emerald-700', COMPLETED: 'bg-slate-100 text-slate-700', CANCELLED: 'bg-rose-100 text-rose-700',
};

export const PrintHubAdminView: React.FC = () => {
  const { printOrders, printRates, updatePrintOrderStatus, updatePrintRates, showToast } = useApp();
  const [rates, setRates] = useState(printRates);
  const [note, setNote] = useState<Record<string, string>>({});
  const activeOrders = printOrders.filter(order => !['COMPLETED', 'CANCELLED'].includes(order.status));

  const saveRates = (event: React.FormEvent) => {
    event.preventDefault();
    updatePrintRates(rates);
  };

  const advanceOrder = (orderId: string, currentStatus: PrintOrderStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[Math.min(statusFlow.length - 1, currentIndex + 1)];
    if (nextStatus === currentStatus) {
      showToast('This order is already ready for pickup or completed.');
      return;
    }
    updatePrintOrderStatus(orderId, nextStatus, note[orderId]);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200"><ClipboardCheck className="h-3.5 w-3.5" /> Print Hub Admin</div><h1 className="text-3xl font-black tracking-tight">Keep the queue moving.</h1><p className="mt-2 max-w-xl text-sm text-slate-300">Confirm payments, progress print jobs, and notify students the moment orders are ready.</p></div><div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center"><p className="text-3xl font-black">{activeOrders.length}</p><p className="text-xs text-slate-300">active orders</p></div></div></section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10"><div className="mb-5 flex items-center gap-2"><Printer className="h-5 w-5 text-indigo-500" /><h2 className="text-lg font-black text-slate-900 dark:text-white">Incoming print orders</h2></div><div className="space-y-4">{activeOrders.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">No active print orders yet.</div> : activeOrders.map(order => <article key={order.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-black text-slate-900 dark:text-white">{order.id}</h3><span className={`rounded-full px-2 py-1 text-[9px] font-black ${statusStyles[order.status]}`}>{order.status.replaceAll('_', ' ')}</span></div><p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{order.studentName} • {order.studentRoll}</p><p className="mt-2 break-words text-xs text-slate-500">{order.files.map(file => file.name).join(', ')}</p><div className="mt-3 grid gap-2 text-[11px] text-slate-500 sm:grid-cols-2"><span>{order.pageCount} pages • {order.copies} copies • {order.colorMode === 'COLOR' ? 'Color' : 'B&W'}</span><span>{order.layout.replace('_', ' ')} • {order.binding.replaceAll('_', ' ')}</span><span>Requested by: {new Date(order.readyBy).toLocaleString()}</span><span className="font-black text-slate-700 dark:text-slate-200">Collect ₹{order.totalAmount}</span></div></div><div className="flex shrink-0 flex-col gap-2 lg:w-44"><select value={order.status} onChange={event => updatePrintOrderStatus(order.id, event.target.value as PrintOrderStatus, note[order.id])} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{statusFlow.map(status => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}<option value="CANCELLED">CANCELLED</option></select><input value={note[order.id] || ''} onChange={event => setNote(prev => ({ ...prev, [order.id]: event.target.value }))} placeholder="Shop note" className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800" /><button onClick={() => advanceOrder(order.id, order.status)} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black text-white hover:bg-indigo-700"><CheckCircle2 className="h-3.5 w-3.5" /> Advance order</button></div></div></article>)}</div></section>

        <form onSubmit={saveRates} className="h-fit rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-lg dark:border-slate-800 dark:bg-slate-950/40"><div className="mb-5 flex items-center gap-2"><Settings2 className="h-5 w-5 text-campus-600" /><div><h2 className="text-base font-black text-slate-900 dark:text-white">Fixed price list</h2><p className="text-xs text-slate-500">Changes apply to new orders.</p></div></div><div className="space-y-3">{([['blackWhitePerPage', 'B&W per sheet'], ['colorPerPage', 'Color per sheet'], ['spiralBinding', 'Spiral binding'], ['lamination', 'Lamination']] as const).map(([key, label]) => <label key={key} className="block text-xs font-bold text-slate-600 dark:text-slate-300">{label}<div className="relative mt-1"><IndianRupee className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input type="number" min={0} value={rates[key]} onChange={event => setRates(prev => ({ ...prev, [key]: Math.max(0, Number(event.target.value) || 0) }))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-sm outline-none focus:border-campus-500 dark:border-slate-700 dark:bg-slate-900" /></div></label>)}<button type="submit" className="mt-2 w-full rounded-xl bg-campus-600 px-3 py-3 text-xs font-black text-white hover:bg-campus-700">Save rates</button></div></form>
      </div>
    </div>
  );
};

