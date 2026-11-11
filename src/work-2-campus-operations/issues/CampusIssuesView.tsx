import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueCategory, IssueUrgency, IssueStatus } from '../../types';
import { 
  Wrench, 
  PlusCircle, 
  CheckCircle2, 
  RotateCcw,
  Building, 
  MessageSquare,
  Filter,
  ShieldCheck,
  X,
  Wifi,
  Zap,
  FlaskConical,
  Monitor,
  Droplets,
  BedDouble,
  ShieldAlert,
  BookOpen,
  UtensilsCrossed,
  Dumbbell,
  Car,
  Lock,
  Bus,
  Cpu,
  Stethoscope,
  FileText,
  Leaf,
  ArrowUp,
  Flame,
  Mic2,
  HelpCircle,
  Camera,
  ImagePlus,
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronRight,
  Search,
  SlidersHorizontal
} from 'lucide-react';

// ── Category Config ───────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<IssueCategory, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  WIFI:            { label: 'Wi-Fi & Internet',       icon: <Wifi className="w-3.5 h-3.5" />,            color: 'text-blue-700',    bg: 'bg-blue-100',    border: 'border-blue-200' },
  ELECTRICAL:      { label: 'Electrical & AC',        icon: <Zap className="w-3.5 h-3.5" />,             color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-amber-200' },
  LAB:             { label: 'Lab Instruments',        icon: <FlaskConical className="w-3.5 h-3.5" />,    color: 'text-purple-700',  bg: 'bg-purple-100',  border: 'border-purple-200' },
  CLASSROOM:       { label: 'Classroom / Projector',  icon: <Monitor className="w-3.5 h-3.5" />,         color: 'text-indigo-700',  bg: 'bg-indigo-100',  border: 'border-indigo-200' },
  WASHROOM:        { label: 'Plumbing / Washroom',    icon: <Droplets className="w-3.5 h-3.5" />,        color: 'text-cyan-700',    bg: 'bg-cyan-100',    border: 'border-cyan-200' },
  HOSTEL:          { label: 'Hostel / Furniture',     icon: <BedDouble className="w-3.5 h-3.5" />,       color: 'text-orange-700',  bg: 'bg-orange-100',  border: 'border-orange-200' },
  SAFETY:          { label: 'Campus Safety',          icon: <ShieldAlert className="w-3.5 h-3.5" />,     color: 'text-red-700',     bg: 'bg-red-100',     border: 'border-red-200' },
  LIBRARY:         { label: 'Library & Reading',      icon: <BookOpen className="w-3.5 h-3.5" />,        color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  CANTEEN:         { label: 'Canteen & Mess',         icon: <UtensilsCrossed className="w-3.5 h-3.5" />, color: 'text-yellow-700',  bg: 'bg-yellow-100',  border: 'border-yellow-200' },
  SPORTS_FACILITY: { label: 'Sports & Gymnasium',     icon: <Dumbbell className="w-3.5 h-3.5" />,        color: 'text-lime-700',    bg: 'bg-lime-100',    border: 'border-lime-200' },
  PARKING:         { label: 'Parking & Roads',        icon: <Car className="w-3.5 h-3.5" />,             color: 'text-stone-700',   bg: 'bg-stone-100',   border: 'border-stone-200' },
  SECURITY:        { label: 'Security & Gates',       icon: <Lock className="w-3.5 h-3.5" />,            color: 'text-rose-700',    bg: 'bg-rose-100',    border: 'border-rose-200' },
  TRANSPORT:       { label: 'Bus & Transport',        icon: <Bus className="w-3.5 h-3.5" />,             color: 'text-sky-700',     bg: 'bg-sky-100',     border: 'border-sky-200' },
  IT_HELPDESK:     { label: 'IT Help Desk',           icon: <Cpu className="w-3.5 h-3.5" />,             color: 'text-violet-700',  bg: 'bg-violet-100',  border: 'border-violet-200' },
  MEDICAL_CENTER:  { label: 'Medical Center',         icon: <Stethoscope className="w-3.5 h-3.5" />,     color: 'text-pink-700',    bg: 'bg-pink-100',    border: 'border-pink-200' },
  ADMINISTRATION:  { label: 'Administration Office',  icon: <FileText className="w-3.5 h-3.5" />,        color: 'text-teal-700',    bg: 'bg-teal-100',    border: 'border-teal-200' },
  GARDEN_GROUNDS:  { label: 'Garden & Grounds',       icon: <Leaf className="w-3.5 h-3.5" />,            color: 'text-green-700',   bg: 'bg-green-100',   border: 'border-green-200' },
  LIFT_ELEVATOR:   { label: 'Lift / Elevator',        icon: <ArrowUp className="w-3.5 h-3.5" />,         color: 'text-fuchsia-700', bg: 'bg-fuchsia-100', border: 'border-fuchsia-200' },
  FIRE_SAFETY:     { label: 'Fire Safety System',     icon: <Flame className="w-3.5 h-3.5" />,           color: 'text-red-800',     bg: 'bg-red-50',      border: 'border-red-300' },
  AUDITORIUM:      { label: 'Auditorium / AV',        icon: <Mic2 className="w-3.5 h-3.5" />,            color: 'text-cyan-800',    bg: 'bg-cyan-50',     border: 'border-cyan-300' },
  OTHER:           { label: 'Other (Custom)',          icon: <HelpCircle className="w-3.5 h-3.5" />,      color: 'text-slate-700',   bg: 'bg-slate-100',   border: 'border-slate-200' },
};

const URGENCY_CONFIG = {
  LOW:       { label: 'Low – within 72h',       color: 'text-slate-600', bg: 'bg-slate-100',  ring: 'ring-slate-300',  dot: 'bg-slate-400' },
  MEDIUM:    { label: 'Medium – within 24h',    color: 'text-amber-700', bg: 'bg-amber-100',  ring: 'ring-amber-300',  dot: 'bg-amber-500' },
  HIGH:      { label: 'High – within 6h',       color: 'text-rose-700',  bg: 'bg-rose-100',   ring: 'ring-rose-300',   dot: 'bg-rose-500'  },
  EMERGENCY: { label: 'Emergency – Immediate',  color: 'text-red-800',   bg: 'bg-red-100',    ring: 'ring-red-400',    dot: 'bg-red-600 animate-ping' },
};

const STATUS_CONFIG: Record<IssueStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  REPORTED:    { label: 'Reported',    color: 'text-blue-700',    bg: 'bg-blue-100 dark:bg-blue-950 dark:text-blue-300',    icon: <Clock className="w-3 h-3" /> },
  ASSIGNED:    { label: 'Assigned',   color: 'text-violet-700',  bg: 'bg-violet-100 dark:bg-violet-950 dark:text-violet-300', icon: <ShieldCheck className="w-3 h-3" /> },
  IN_PROGRESS: { label: 'In Progress', color: 'text-amber-700',   bg: 'bg-amber-100 dark:bg-amber-950 dark:text-amber-300',   icon: <Wrench className="w-3 h-3" /> },
  RESOLVED:    { label: 'Resolved',   color: 'text-emerald-700', bg: 'bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300', icon: <CheckCircle2 className="w-3 h-3" /> },
  CLOSED:      { label: 'Closed',     color: 'text-slate-600',   bg: 'bg-slate-100 dark:bg-slate-800 dark:text-slate-400',   icon: <X className="w-3 h-3" /> },
  REOPENED:    { label: 'Reopened',   color: 'text-rose-700',    bg: 'bg-rose-100 dark:bg-rose-950 dark:text-rose-300',      icon: <RotateCcw className="w-3 h-3" /> },
};

// ── Main Component ─────────────────────────────────────────────────────────────
export const CampusIssuesView: React.FC = () => {
  const { campusIssues, reportIssue, updateIssueStatus, reopenIssue, currentRole, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'ESCALATED' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reopenModalIssueId, setReopenModalIssueId] = useState<string | null>(null);
  const [reopenReason, setReopenReason] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('WIFI');
  const [otherCategoryText, setOtherCategoryText] = useState('');
  const [locationBuilding, setLocationBuilding] = useState('');
  const [locationRoom, setLocationRoom] = useState('');
  const [urgency, setUrgency] = useState<IssueUrgency>('MEDIUM');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_DESC = 500;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const filteredIssues = campusIssues.filter(issue => {
    const matchesStatus =
      statusFilter === 'OPEN'      ? (issue.status !== 'RESOLVED' && issue.status !== 'CLOSED') :
      statusFilter === 'ESCALATED' ? (issue.status === 'REOPENED' || issue.reopenCount > 0) :
      statusFilter === 'RESOLVED'  ? (issue.status === 'RESOLVED' || issue.status === 'CLOSED') :
      true;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || issue.title.toLowerCase().includes(q) || issue.category.toLowerCase().includes(q) || issue.locationBuilding.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const openCount = campusIssues.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const escalatedCount = campusIssues.filter(i => i.status === 'REOPENED' || i.reopenCount > 0).length;
  const resolvedCount = campusIssues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

  const handleSubmitNewIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationBuilding.trim()) {
      showToast('Please fill out all required fields.');
      return;
    }
    if (category === 'OTHER' && !otherCategoryText.trim()) {
      showToast('Please describe your issue type.');
      return;
    }
    reportIssue({ title, description, category, locationBuilding, locationRoom, urgency });
    setShowReportModal(false);
    setTitle(''); setDescription(''); setPhotoPreview(null); setOtherCategoryText(''); setLocationBuilding(''); setLocationRoom('');
  };

  const isStaffOrAdmin = currentRole === 'CAMPUS_ADMIN' || currentRole === 'FACILITY_STAFF' || currentRole === 'HOSTEL_STAFF' || currentRole === 'CLASS_REP';

  return (
    <div className="space-y-6">

      {/* ── Gradient Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-orange-400 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/20">
        {/* decorative blobs */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-black/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] font-semibold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Auto-routed • 24h SLA Guarantee
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Campus Issue Reporter</h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-lg">
              Report infrastructure, safety, or facility problems. Every ticket is auto-assigned to the responsible campus cell and escalated on inaction.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-extrabold">{campusIssues.length}</div>
              <div className="text-[10px] text-rose-100 font-medium mt-0.5">Total Tickets</div>
            </div>
            <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-extrabold text-amber-200">{openCount}</div>
              <div className="text-[10px] text-rose-100 font-medium mt-0.5">In Progress</div>
            </div>
            <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-extrabold text-emerald-200">{resolvedCount}</div>
              <div className="text-[10px] text-rose-100 font-medium mt-0.5">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search + Filters + CTA ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by title, category, location…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shrink-0 overflow-x-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5 shrink-0" />
          {[
            { val: 'ALL' as const,       label: `All (${campusIssues.length})`,  active: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' },
            { val: 'OPEN' as const,      label: `Open (${openCount})`,           active: 'bg-amber-500 text-white' },
            { val: 'ESCALATED' as const, label: `Escalated (${escalatedCount})`, active: 'bg-rose-600 text-white' },
            { val: 'RESOLVED' as const,  label: `Resolved (${resolvedCount})`,   active: 'bg-emerald-600 text-white' },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setStatusFilter(f.val)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                statusFilter === f.val ? f.active + ' shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all active:scale-95 shrink-0 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          Report Problem
        </button>
      </div>

      {/* ── Ticket Cards ─────────────────────────────────────────────────── */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tickets found</p>
          <p className="text-xs mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map(issue => {
            const cat = CATEGORY_CONFIG[issue.category] ?? CATEGORY_CONFIG['OTHER'];
            const urg = URGENCY_CONFIG[issue.urgency];
            const sta = STATUS_CONFIG[issue.status];
            const steps: ('REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED')[] = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
            const currentIndex = issue.status === 'RESOLVED' ? 3 : issue.status === 'IN_PROGRESS' ? 2 : issue.status === 'ASSIGNED' ? 1 : 0;

            return (
              <div
                key={issue.id}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl ${
                  issue.urgency === 'EMERGENCY' ? 'bg-red-600' :
                  issue.urgency === 'HIGH'      ? 'bg-rose-500' :
                  issue.urgency === 'MEDIUM'    ? 'bg-amber-400' : 'bg-slate-300'
                }`} />

                <div className="pl-5 pr-5 sm:pr-6 pt-5 pb-5 space-y-4">
                  
                  {/* Top row: tags + status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono tracking-wide">
                          {issue.id}
                        </span>

                        {/* Category badge */}
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                          {cat.icon} {cat.label}
                        </span>

                        {/* Urgency badge */}
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${urg.bg} ${urg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />
                          {issue.urgency}
                        </span>

                        {/* Escalated badge */}
                        {issue.reopenCount > 0 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                            ESCALATED ×{issue.reopenCount}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    {/* Status pill */}
                    <div className="shrink-0 text-right space-y-1">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full ${sta.bg} ${sta.color}`}>
                        {sta.icon} {sta.label}
                      </span>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{issue.createdAt}</div>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-700 dark:text-slate-300">Location:</strong> {issue.locationBuilding}{issue.locationRoom ? ` · ${issue.locationRoom}` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-700 dark:text-slate-300">Assigned:</strong> {issue.assignedTo || 'Auto Triage Desk'}
                    </span>
                    <span>
                      <strong className="text-slate-700 dark:text-slate-300">Reporter:</strong> {issue.reporterName}
                    </span>
                  </div>

                  {/* Lifecycle Stepper */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Resolution Lifecycle
                    </div>
                    <div className="relative">
                      {/* connecting line */}
                      <div className="absolute top-[9px] left-2 right-2 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
                      <div
                        className="absolute top-[9px] left-2 h-0.5 bg-gradient-to-r from-rose-500 to-emerald-500 z-0 transition-all duration-700"
                        style={{ width: `${(currentIndex / 3) * (100 - 4)}%` }}
                      />
                      <div className="relative z-10 grid grid-cols-4 gap-1">
                        {steps.map((step, idx) => (
                          <div key={step} className="flex flex-col items-center gap-1">
                            <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black ring-2 transition-all ${
                              idx < currentIndex  ? 'bg-emerald-500 ring-emerald-300 text-white' :
                              idx === currentIndex ? 'bg-rose-500 ring-rose-300 text-white scale-125' :
                              'bg-slate-200 dark:bg-slate-700 ring-slate-300 dark:ring-slate-600 text-slate-400'
                            }`}>
                              {idx < currentIndex ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[9px] font-bold text-center leading-tight ${
                              idx === currentIndex ? 'text-rose-600 dark:text-rose-400' :
                              idx < currentIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                            }`}>
                              {step.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Staff Notes */}
                  {issue.staffNotes && (
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800">
                      <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                      <div className="text-xs text-indigo-900 dark:text-indigo-200">
                        <strong>Maintenance Update:</strong> {issue.staffNotes}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {issue.status === 'RESOLVED' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Marked Resolved
                        </span>
                        <button
                          onClick={() => { setReopenModalIssueId(issue.id); setReopenReason(''); }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Issue Persists? Reopen
                        </button>
                      </div>
                    )}

                    {isStaffOrAdmin && (
                      <div className="ml-auto flex flex-wrap items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">Staff Actions:</span>
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'IN_PROGRESS', 'Technician on site diagnosing root cause.')}
                          className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-sm"
                        >In Progress</button>
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'RESOLVED', 'Issue repaired and verified operational.')}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-sm"
                        >Mark Resolved</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Report Issue Modal ────────────────────────────────────────────── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full my-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-500 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Report a Campus Problem</h3>
                  <p className="text-[11px] text-rose-100">Auto-routed to the right department within 24h</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewIssue} className="p-5 space-y-4">

              {/* Issue Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wi-Fi router offline on 3rd floor corridor"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                  Problem Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as IssueCategory)}
                    className="w-full text-xs p-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 appearance-none transition font-semibold"
                  >
                    <optgroup label="🌐 Connectivity">
                      <option value="WIFI">Wi-Fi &amp; Internet</option>
                      <option value="IT_HELPDESK">IT Help Desk</option>
                    </optgroup>
                    <optgroup label="⚡ Infrastructure">
                      <option value="ELECTRICAL">Electrical &amp; AC</option>
                      <option value="LIFT_ELEVATOR">Lift / Elevator</option>
                      <option value="FIRE_SAFETY">Fire Safety System</option>
                    </optgroup>
                    <optgroup label="🏫 Academic Facilities">
                      <option value="CLASSROOM">Classroom / Projector</option>
                      <option value="LAB">Lab Instruments</option>
                      <option value="LIBRARY">Library &amp; Reading</option>
                      <option value="AUDITORIUM">Auditorium / AV System</option>
                    </optgroup>
                    <optgroup label="🏠 Residential">
                      <option value="HOSTEL">Hostel / Furniture / Doors</option>
                      <option value="WASHROOM">Plumbing / Washroom</option>
                      <option value="CANTEEN">Canteen &amp; Mess</option>
                    </optgroup>
                    <optgroup label="🏃 Campus Services">
                      <option value="SPORTS_FACILITY">Sports &amp; Gymnasium</option>
                      <option value="MEDICAL_CENTER">Medical Center</option>
                      <option value="TRANSPORT">Bus &amp; Transport</option>
                      <option value="PARKING">Parking &amp; Roads</option>
                      <option value="GARDEN_GROUNDS">Garden &amp; Grounds</option>
                    </optgroup>
                    <optgroup label="🔐 Safety &amp; Admin">
                      <option value="SAFETY">Campus Safety / Lighting</option>
                      <option value="SECURITY">Security &amp; Gates</option>
                      <option value="ADMINISTRATION">Administration Office</option>
                    </optgroup>
                    <optgroup label="💬 Other">
                      <option value="OTHER">Other (describe below)</option>
                    </optgroup>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                </div>

                {/* OTHER custom text */}
                {category === 'OTHER' && (
                  <input
                    type="text"
                    placeholder="Describe your issue type (e.g. Broken notice board in C Block)"
                    value={otherCategoryText}
                    onChange={e => setOtherCategoryText(e.target.value)}
                    className="mt-2 w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-rose-300 outline-none focus:ring-2 focus:ring-rose-100 transition"
                  />
                )}

                {/* Selected category preview badge */}
                {category !== 'OTHER' && (
                  <div className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${CATEGORY_CONFIG[category].bg} ${CATEGORY_CONFIG[category].color} ${CATEGORY_CONFIG[category].border}`}>
                    {CATEGORY_CONFIG[category].icon} {CATEGORY_CONFIG[category].label}
                  </div>
                )}
              </div>

              {/* Urgency */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                  Urgency Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(URGENCY_CONFIG) as IssueUrgency[]).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border-2 transition-all text-[10px] font-bold ${
                        urgency === u
                          ? `border-current ring-2 ${URGENCY_CONFIG[u].bg} ${URGENCY_CONFIG[u].color} ${URGENCY_CONFIG[u].ring}`
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${urgency === u ? URGENCY_CONFIG[u].dot : 'bg-slate-300'}`} />
                      {u}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">{URGENCY_CONFIG[urgency].label}</p>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5">
                    <Building className="w-3 h-3 text-slate-400" /> Building / Block <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hostel Block B"
                    value={locationBuilding}
                    onChange={e => setLocationBuilding(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5">
                    Room / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 304 / 3rd Floor"
                    value={locationRoom}
                    onChange={e => setLocationRoom(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 transition"
                  />
                </div>
              </div>

              {/* Description with character counter */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">Detailed Description <span className="text-rose-500">*</span></span>
                  <span className={`text-[10px] font-semibold ${description.length > MAX_DESC * 0.9 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {description.length}/{MAX_DESC}
                  </span>
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={MAX_DESC}
                  placeholder="Provide precise details — include any error messages, when it started, how many people are affected…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 transition resize-none"
                />
                {/* char progress bar */}
                <div className="mt-1 h-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-0.5 rounded-full transition-all ${description.length > MAX_DESC * 0.9 ? 'bg-rose-500' : 'bg-rose-400'}`}
                    style={{ width: `${Math.min((description.length / MAX_DESC) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" /> Attach Photo (optional, max 5 MB)
                </label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={photoPreview} alt="preview" className="w-full max-h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-rose-600 text-white shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-rose-400 hover:text-rose-500 transition group"
                  >
                    <ImagePlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Click to upload a photo</span>
                  </button>
                )}
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[10px] text-rose-700 dark:text-rose-300">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Privacy Note:</strong> Your ticket is verified by your student roll number. Reporter identity is visible only to authorized department heads, not publicly.</span>
              </div>

              {/* Footer actions */}
              <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white shadow-lg shadow-rose-500/25 transition-all active:scale-95"
                >
                  Submit Ticket →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reopen Modal ──────────────────────────────────────────────────── */}
      {reopenModalIssueId && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Reopen & Escalate Ticket</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">This will escalate to the Head of Facilities and Dean's office.</p>
              </div>
            </div>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={e => setReopenReason(e.target.value)}
              placeholder="e.g. Technician closed the ticket but the Wi-Fi router is still offline on 3rd floor…"
              className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 transition resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReopenModalIssueId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (reopenReason.trim()) {
                    reopenIssue(reopenModalIssueId, reopenReason);
                    setReopenModalIssueId(null);
                  } else {
                    showToast('Please explain why the issue persists.');
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 transition active:scale-95"
              >
                Reopen &amp; Escalate →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
