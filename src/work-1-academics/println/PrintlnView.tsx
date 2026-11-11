import React, { useMemo, useRef, useState } from 'react';
import { BellRing, CheckCircle2, Clock3, FileText, Printer, ReceiptText, UploadCloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrintBinding, PrintColorMode, PrintFile, PrintLayout, PrintOrder } from '../../types';
import { getPrintAmount, getPrintSheetCount, printBindingLabels, printLayoutLabels } from '../../data/printPricing';

const ACCEPTED_FORMATS = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp';
const ACCEPTED_FORMAT_LABEL = 'PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, JPG, JPEG, PNG, WEBP';

const statusStyles: Record<PrintOrder['status'], string> = {
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-blue-100 text-blue-700',
  QUEUED: 'bg-indigo-100 text-indigo-700',
  PRINTING: 'bg-violet-100 text-violet-700',
  READY_FOR_PICKUP: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-slate-100 text-slate-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
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
  const { currentUser, printOrders, printRates, placePrintOrder, markPrintNotificationRead, showToast } = useApp();
  const [files, setFiles] = useState<PrintFile[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [layout, setLayout] = useState<PrintLayout>('ALL_PAGES');
  const [colorMode, setColorMode] = useState<PrintColorMode>('BLACK_WHITE');
  const [binding, setBinding] = useState<PrintBinding>('NONE');
  const [copies, setCopies] = useState(1);
  const [readyBy, setReadyBy] = useState(getDefaultReadyBy);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFiles(selected);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      showToast('Upload at least one document before placing a print order.');
      return;
    }
    placePrintOrder(draft);
    setFiles([]);
    setPageCount(1);
    setLayout('ALL_PAGES');
    setColorMode('BLACK_WHITE');
    setBinding('NONE');
    setCopies(1);
    setReadyBy(getDefaultReadyBy());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-campus-900 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-campus-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-campus-100">
              <Printer className="h-3.5 w-3.5" /> Println • Skip the queue
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Upload now. Pick up when ready.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Send your notes, assignments, and forms to the college Xerox Shop, pay upfront, and receive a unique pickup ID when your printout is ready.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"><div className="text-2xl font-black">{myOrders.length}</div><div className="text-indigo-200">My orders</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"><div className="text-2xl font-black">{readyOrders.length}</div><div className="text-indigo-200">Ready now</div></div>
          </div>
        </div>
      </section>

      {readyOrders.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
          <div className="flex items-start gap-3">
            <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <p className="text-sm font-black">Your printout is ready for pickup.</p>
              <p className="mt-1 text-xs text-emerald-800">Show the order ID at the Xerox Shop counter and take your printout without waiting in the queue.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {readyOrders.map(order => (
                  <button key={order.id} onClick={() => markPrintNotificationRead(order.id)} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">{order.id} • Mark seen</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"><UploadCloud className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-black text-slate-900 dark:text-white">Create a print order</h2><p className="text-xs text-slate-500">Choose exactly how the shop should print it.</p></div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Upload document(s)</label>
              <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_FORMATS} onChange={handleFiles} className="block w-full cursor-pointer rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/50 p-4 text-xs text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:border-indigo-500 dark:border-indigo-900 dark:bg-indigo-950/20 dark:text-slate-300" />
              <p className="mt-2 text-[11px] text-slate-400">Accepted formats: {ACCEPTED_FORMAT_LABEL}. Files are attached to this order.</p>
              {files.length > 0 && <div className="mt-3 space-y-2">{files.map(file => <div key={file.name} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800"><FileText className="h-4 w-4 text-indigo-500" /><span className="min-w-0 flex-1 truncate font-semibold text-slate-700 dark:text-slate-200">{file.name}</span><span className="text-slate-400">{formatFileSize(file.sizeBytes)}</span></div>)}</div>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Total pages
                <input type="number" min={1} max={1000} value={pageCount} onChange={event => setPageCount(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800" />
              </label>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Number of copies
                <input type="number" min={1} max={100} value={copies} onChange={event => setCopies(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800" />
              </label>
            </div>

            <div><p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Pages per sheet</p><div className="grid gap-2 sm:grid-cols-3">{(Object.keys(printLayoutLabels) as PrintLayout[]).map(option => <button type="button" key={option} onClick={() => setLayout(option)} className={`rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${layout === option ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 dark:bg-indigo-950/50 dark:text-indigo-300' : 'border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:text-slate-300'}`}>{printLayoutLabels[option]}</button>)}</div></div>

            <div><p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Print color</p><div className="grid gap-2 sm:grid-cols-2">{(['BLACK_WHITE', 'COLOR'] as PrintColorMode[]).map(option => <button type="button" key={option} onClick={() => setColorMode(option)} className={`rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${colorMode === option ? 'border-campus-500 bg-campus-50 text-campus-700 ring-2 ring-campus-500/20 dark:bg-campus-950/50 dark:text-campus-300' : 'border-slate-200 text-slate-600 hover:border-campus-300 dark:border-slate-700 dark:text-slate-300'}`}>{option === 'COLOR' ? 'Color print' : 'Black & white'}<span className="mt-1 block text-[10px] font-normal opacity-70">₹{option === 'COLOR' ? printRates.colorPerPage : printRates.blackWhitePerPage} per sheet</span></button>)}</div></div>

            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Binding and finishing<select value={binding} onChange={event => setBinding(event.target.value as PrintBinding)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{(Object.keys(printBindingLabels) as PrintBinding[]).map(option => <option key={option} value={option}>{printBindingLabels[option]}</option>)}</select></label>

            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Ready by<input type="datetime-local" value={readyBy} onChange={event => setReadyBy(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" /><span className="mt-1 block text-[10px] font-normal normal-case tracking-normal text-slate-400">The shop will use this as your requested completion time.</span></label>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-campus-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"><ReceiptText className="h-4 w-4" /> Pay ₹{totalAmount} & place order</button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Live estimate</p><p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">₹{totalAmount}</p></div><div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950"><CheckCircle2 className="h-6 w-6" /></div></div><div className="mt-5 space-y-2 text-xs text-slate-500 dark:text-slate-400"><div className="flex justify-between"><span>{sheets} sheets × {copies} copies</span><span>{colorMode === 'COLOR' ? 'Color' : 'B&W'}</span></div><div className="flex justify-between"><span>{printLayoutLabels[layout]}</span><span>{printBindingLabels[binding]}</span></div><div className="border-t border-slate-100 pt-2 text-[11px] dark:border-slate-800">Rates are maintained by the Print Hub admin.</div></div></div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40"><div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-indigo-500" /><h3 className="text-sm font-black text-slate-900 dark:text-white">My print orders</h3></div><div className="mt-4 space-y-3">{myOrders.length === 0 ? <p className="text-xs leading-5 text-slate-400">Your order history will appear here after you submit a document.</p> : myOrders.map(order => <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-black text-slate-800 dark:text-white">{order.id}</p><p className="mt-1 text-[10px] text-slate-400">{order.files.map(file => file.name).join(', ')}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-black ${statusStyles[order.status]}`}>{order.status.replaceAll('_', ' ')}</span></div><div className="mt-2 flex items-center justify-between text-[10px] text-slate-400"><span>₹{order.totalAmount} • {order.copies} copies</span><span>{order.status === 'READY_FOR_PICKUP' ? 'Show ID at shop' : `Ready by ${new Date(order.readyBy).toLocaleString()}`}</span></div></div>)}</div></div>
        </aside>
      </div>
    </div>
  );
};

