import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockHostelMessMenu } from '../../data/mockData';
import { 
  Building2, 
  Utensils, 
  Wrench, 
  Shield, 
  Clock, 
  Star, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Send,
  Home,
  AlertTriangle,
  Shirt,
  Users2
} from 'lucide-react';

export const HostelView: React.FC = () => {
  const { currentUser, setActiveTab, messReports, submitMessReport, showToast } = useApp();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Auto-detect current weekday
  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    return days.includes(currentDayName) ? currentDayName : 'Wednesday';
  });

  // Mess feedback state
  const [feedbackMeal, setFeedbackMeal] = useState<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'>('Lunch');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  // Escalation / Higher Authority report modal
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationMessBlock, setEscalationMessBlock] = useState('Hostel Block B Central Mess');
  const [escalationMeal, setEscalationMeal] = useState<'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER'>('LUNCH');
  const [escalationCategory, setEscalationCategory] = useState<'HYGIENE' | 'TASTE_COOKING' | 'FOREIGN_OBJECT' | 'DELAY_SHORTAGE' | 'CONTRACTOR_VIOLATION'>('HYGIENE');
  const [escalationSeverity, setEscalationSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [escalationDesc, setEscalationDesc] = useState('');
  const [isSubmittingEscalation, setIsSubmittingEscalation] = useState(false);

  const menu = mockHostelMessMenu[selectedDay] || mockHostelMessMenu['Wednesday'];

  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationDesc.trim()) return;
    setIsSubmittingEscalation(true);
    await submitMessReport({
      messBlock: escalationMessBlock,
      mealType: escalationMeal,
      category: escalationCategory,
      severity: escalationSeverity,
      description: escalationDesc.trim()
    });
    setIsSubmittingEscalation(false);
    setShowEscalationModal(false);
    setEscalationDesc('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Submitted ${rating}-star feedback for ${selectedDay} ${feedbackMeal} to Mess Committee!`);
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 animate-gradient text-white p-6 sm:p-8 shadow-2xl">
        {/* Decorative blur blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-100">
              <Home className="w-3.5 h-3.5" />
              <span>CAMPUS RESIDENTIAL HUB</span>
              <span className="relative flex w-2 h-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowEscalationModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Food Issue to Higher Authority</span>
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Report Room Maintenance</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hostel Life & Weekly Mess Menu
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-2xl leading-relaxed">
              Real-time daily mess schedules, nutritional highlights, curfew guidelines, and direct communication with hostel residential wardens.
            </p>
          </div>

          {/* 3 Prominent Stat Pods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Room Info Pod */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-amber-200 text-xs font-semibold mb-0.5">
                <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Your Assigned Room</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {currentUser.hostelBlock || 'Hostel Block B'}
              </div>
              <div className="text-[11px] text-amber-200 font-bold mt-0.5">
                {currentUser.roomNumber || 'Room 304'}
              </div>
            </div>

            {/* Check-in Status Pod */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-emerald-200 text-xs font-semibold mb-0.5">
                <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform text-emerald-300" />
                <span>Check-in Status</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-200 flex items-center justify-center gap-2">
                <span>Active</span>
                <span className="relative flex w-2.5 h-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
              </div>
              <div className="text-[10px] text-amber-200/80">Biometric Key Registered</div>
            </div>

            {/* Mess Plan Pod */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-amber-200 text-xs font-semibold mb-0.5">
                <Utensils className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Mess Subscription</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                Full Board Plan
              </div>
              <div className="text-[10px] text-amber-200/80">4 Meals Daily • Unlimited Curd</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider: Day Selector */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Weekly Mess Menu</span>
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Day Selector Pill Tabs */}
      <div className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 p-3 sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {days.map(d => {
            const isToday = d === currentDayName;
            const isSelected = selectedDay === d;

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-800'
                }`}
              >
                <span>{d}</span>
                {isToday && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    TODAY
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Meal Cards in 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Breakfast Card (Amber/Yellow Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-amber-600/10 dark:from-amber-950/40 dark:to-yellow-950/30 backdrop-blur-xl border border-amber-300/40 dark:border-amber-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-amber-400 to-yellow-500" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-xl shadow-xs">
                  🌅
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Morning Breakfast
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>07:30 AM – 09:30 AM</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/50">
                Fresh Prep
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {menu.breakfast}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-amber-200/40 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Includes Tea, Filter Coffee & Banana</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Vegetarian</span>
          </div>
        </div>

        {/* 2. Lunch Card (Blue/Sky Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-blue-600/10 dark:from-blue-950/40 dark:to-sky-950/30 backdrop-blur-xl border border-blue-300/40 dark:border-blue-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-blue-400 to-sky-500" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xl shadow-xs">
                  🌞
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Grand Lunch
                  </h3>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>12:30 PM – 02:30 PM</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/50">
                Main Course
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {menu.lunch}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-blue-200/40 dark:border-blue-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Fresh salad counter & chilled buttermilk</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Special Options Available</span>
          </div>
        </div>

        {/* 3. Snacks Card (Purple/Violet Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-purple-600/10 dark:from-purple-950/40 dark:to-violet-950/30 backdrop-blur-xl border border-purple-300/40 dark:border-purple-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-purple-400 to-violet-500" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-xl shadow-xs">
                  🍵
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Evening Snacks & Chai
                  </h3>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>05:00 PM – 06:15 PM</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50">
                High Tea
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {menu.snacks}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-200/40 dark:border-purple-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Ginger tea & sweet/savory snack</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Mess Dining Hall</span>
          </div>
        </div>

        {/* 4. Dinner Card (Emerald/Green Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-600/10 dark:from-emerald-950/40 dark:to-teal-950/30 backdrop-blur-xl border border-emerald-300/40 dark:border-emerald-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-emerald-400 to-teal-500" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-xl shadow-xs">
                  🌙
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Night Dinner & Dessert
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>07:45 PM – 09:45 PM</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/50">
                Night Special
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {menu.dinner}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-emerald-200/40 dark:border-emerald-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Includes warm dessert / sweet</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Hot Phulkas & Rice</span>
          </div>
        </div>
      </div>

      {/* Section Divider: Hostel Info & Mess Feedback */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regulations & Student Feedback</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostel Rules & Info Quick-Ref Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 p-6 sm:p-7 space-y-4">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-amber-400 to-orange-500" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 flex items-center justify-center shadow-sm text-amber-600 dark:text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Hostel Administration & Policies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Important residential rules and contact information
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Warden Contact */}
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Chief Warden Office (Prof. R. K. Meena)
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Hostel Admin Block, Room 104 • Emergency: +91 98765 43210
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                  Visiting Hours: 04:30 PM – 06:30 PM (Mon–Fri)
                </span>
              </div>
            </div>

            {/* Curfew Rules */}
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 flex items-start gap-3">
              <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Curfew & Biometric Turnstile Lock
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Weekdays: <strong>10:30 PM</strong> | Weekends / Holidays: <strong>11:00 PM</strong>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Late entries require warden digital pass confirmation.
                </span>
              </div>
            </div>

            {/* Laundry Schedule */}
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 flex items-start gap-3">
              <Shirt className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Automated Laundry Facility
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Block B Slot: <strong>Tuesdays & Fridays (08:00 AM – 06:00 PM)</strong>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Token pickup from basement control room.
                </span>
              </div>
            </div>

            {/* Visitor Policy */}
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 flex items-start gap-3">
              <Users2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Guest & Day Scholar Visitation Policy
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Allowed in common lounge only between 04:00 PM – 07:00 PM with valid photo ID.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mess Feedback & Rating Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-amber-500 to-rose-500" />

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 flex items-center justify-center shadow-sm text-amber-600 dark:text-amber-400">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Mess Committee Food Quality Feedback
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rate today's meals directly to the student food safety council
                </p>
              </div>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
              {/* Meal Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Meal for Rating
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const).map(meal => (
                    <button
                      type="button"
                      key={meal}
                      onClick={() => setFeedbackMeal(meal)}
                      className={`py-2 rounded-xl text-xs font-bold transition text-center ${
                        feedbackMeal === meal
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating Interactive */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Taste & Hygiene Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        type="button"
                        key={starVal}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        className="p-1 rounded-lg transition hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Comments Text */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Suggestions or Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sambar seasoning was great, kindly refill curd containers faster..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 backdrop-blur-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  Reviewed by Student Mess Secretary
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Rating</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mess Quality Escalations to Chief Warden & Mess Committee Section */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/40 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Official Mess Food Escalations to Chief Warden
              </h3>
              <p className="text-xs text-slate-500">
                Direct statutory escalations for severe hygiene, cooking, contractor, or foreign object violations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEscalationModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
          >
            + File New Escalation
          </button>
        </div>

        {messReports.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No active mess escalations logged.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messReports.map(rep => (
              <div 
                key={rep.id} 
                className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 uppercase">
                    {rep.category.replace('_', ' ')} • {rep.severity}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {rep.messBlock} ({rep.mealType})
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {rep.description}
                </p>

                {rep.resolutionNotes && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Chief Warden Action:</strong> {rep.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Escalation to Higher Authority Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Escalate Food Violation to Chief Warden</h3>
              </div>
              <button onClick={() => setShowEscalationModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This filing will be logged directly in the Campus Admin & Chief Warden portal for inspection and contractual penalty review.
            </p>

            <form onSubmit={handleEscalationSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mess Facility *</label>
                <input
                  type="text"
                  required
                  value={escalationMessBlock}
                  onChange={(e) => setEscalationMessBlock(e.target.value)}
                  placeholder="e.g. Hostel Block B Central Mess"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meal Session</label>
                  <select
                    value={escalationMeal}
                    onChange={(e) => setEscalationMeal(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="SNACKS">Evening Snacks</option>
                    <option value="DINNER">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Violation Category</label>
                  <select
                    value={escalationCategory}
                    onChange={(e) => setEscalationCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="HYGIENE">Sanitation / Dirty Utensils</option>
                    <option value="FOREIGN_OBJECT">Foreign Object in Food</option>
                    <option value="TASTE_COOKING">Undercooked / Spoiled Food</option>
                    <option value="DELAY_SHORTAGE">Food Shortage / Unreasonable Delay</option>
                    <option value="CONTRACTOR_VIOLATION">Caterer Menu Substitution</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Severity Assessment</label>
                <select
                  value={escalationSeverity}
                  onChange={(e) => setEscalationSeverity(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                >
                  <option value="LOW">Low (Minor grievance)</option>
                  <option value="MEDIUM">Medium (Repeated issue)</option>
                  <option value="HIGH">High (Immediate health risk)</option>
                  <option value="CRITICAL">Critical (Food poisoning / Severe contamination)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Description & Evidence *</label>
                <textarea
                  required
                  rows={3}
                  value={escalationDesc}
                  onChange={(e) => setEscalationDesc(e.target.value)}
                  placeholder="Detail the counter number, time, dish name, and specific condition observed..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEscalation}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isSubmittingEscalation ? 'Escalating...' : 'Submit to Chief Warden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
