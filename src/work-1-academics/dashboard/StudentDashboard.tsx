import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Wrench, 
  SearchCode, 
  FolderGit2, 
  ShoppingBag, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert,
  FileText,
  BookOpen,
  MapPin,
  Users
} from 'lucide-react';
import { 
  CYBER_SECURITY_SEM3_TIMETABLE, 
  CYBER_SECURITY_SEM3_METADATA, 
  isCyberSecuritySem3,
  FACULTY_DIRECTORY
} from '../../data/cyberSecuritySem3Data';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    courses, 
    assignments, 
    campusIssues, 
    events, 
    opportunities, 
    announcements, 
    setActiveTab,
    setIsPendingIdVerification,
    reopenIssue
  } = useApp();

  const [reopenModalIssueId, setReopenModalIssueId] = useState<string | null>(null);
  const [reopenReason, setReopenReason] = useState('');

  const isCyber = isCyberSecuritySem3(currentUser);
  
  // Day selector for timetable
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
  const currentDayIndex = new Date().getDay(); // 0 Sun, 1 Mon ... 6 Sat
  const defaultDay = (currentDayIndex >= 1 && currentDayIndex <= 6) ? daysOfWeek[currentDayIndex - 1] : 'MON';
  const [selectedDay, setSelectedDay] = useState<typeof daysOfWeek[number]>(defaultDay);
  const [selectedBatch, setSelectedBatch] = useState<'ALL' | 'A1' | 'A2' | 'A3'>('ALL');

  // Filter today's timetable slots
  const cyberDaySlots = CYBER_SECURITY_SEM3_TIMETABLE.filter(s => {
    if (s.day !== selectedDay) return false;
    if (selectedBatch === 'ALL' || !s.batches) return true;
    return s.batches.includes(selectedBatch) || s.batches.includes('All');
  });

  // Active tickets
  const activeTickets = campusIssues.filter(i => i.status !== 'CLOSED');

  return (
    <div className="space-y-6">
      
      {/* Verification Status Notice if Unverified / Pending */}
      {!currentUser.isVerified && (
        <div className="rounded-2xl p-4 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>Identity Verification Status</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  {currentUser.idCardUrl ? 'ID Card Submitted • Pending Admin Review' : 'Action Required • ID Upload Pending'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                {currentUser.idCardUrl
                  ? 'Your institutional student ID card is currently under review by Campus Administration and the Dean of Student Affairs.'
                  : 'Please complete institutional onboarding by submitting your official physical student ID card.'}
              </p>
            </div>
          </div>
          {!currentUser.idCardUrl && (
            <button
              onClick={() => setIsPendingIdVerification(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition whitespace-nowrap self-end sm:self-auto"
            >
              Upload ID Card
            </button>
          )}
        </div>
      )}

      {/* 1. Student Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-campus-800 via-indigo-900 to-slate-900 animate-gradient p-6 sm:p-8 text-white shadow-2xl shadow-campus-900/30">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-campus-400/15 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-campus-200 border border-white/10">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Spring Semester 2026–27 · Week 9 · Live
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Welcome back, {currentUser.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 max-w-xl leading-relaxed">
              {currentUser.department} &nbsp;·&nbsp; Roll #{currentUser.rollNumber} &nbsp;·&nbsp; {currentUser.hostelBlock} ({currentUser.roomNumber})
            </p>
          </div>

          {/* Quick Metrics Pods */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[110px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                {isCyber ? 'Lecture Hall' : 'Enrolled'}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold mt-1 text-campus-200 group-hover:scale-105 transition-transform">
                {isCyber ? 'CDS10-104' : `${courses.length} Courses`}
              </div>
              <div className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full inline-block font-bold bg-campus-500/20 text-campus-200">
                {isCyber ? 'Sem 3 Cyber' : `Sem ${currentUser.semester || 1}`}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[110px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Pending</div>
              <div className="text-2xl font-extrabold mt-1 text-amber-300 group-hover:scale-105 transition-transform">
                {assignments.filter(a => a.status === 'PENDING').length}
              </div>
              <div className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full inline-block font-bold bg-amber-500/20 text-amber-300">
                Assignments
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[110px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Open Tickets</div>
              <div className="text-2xl font-extrabold mt-1 text-sky-300 group-hover:scale-105 transition-transform">
                {activeTickets.length}
              </div>
              <div className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full inline-block font-bold bg-sky-500/20 text-sky-300">
                SLA Active
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 2. Official Campus Announcement Notice Bar */}
      {announcements.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-slate-900 dark:text-slate-100">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white uppercase tracking-wider">
                  Official Notice
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{announcements[0].title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {announcements[0].content}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('academics')}
            className="shrink-0 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline hidden sm:block"
          >
            View Details →
          </button>
        </div>
      )}

      {/* 3. Quick Actions Hub */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            ⚡ Quick Actions
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">1-tap campus workflows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button 
            onClick={() => setActiveTab('issues')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-500 dark:hover:border-campus-500 shadow-xs hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Report Issue</span>
          </button>

          <button 
            onClick={() => setActiveTab('lostfound')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-500 dark:hover:border-campus-500 shadow-xs hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <SearchCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Lost & Found</span>
          </button>

          <button 
            onClick={() => setActiveTab('projects')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-500 dark:hover:border-campus-500 shadow-xs hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Find Teammates</span>
          </button>

          <button 
            onClick={() => setActiveTab('ask_ai')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-500 dark:hover:border-campus-500 shadow-xs hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Ask Campus AI</span>
          </button>

          <button 
            onClick={() => setActiveTab('marketplace')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-500 dark:hover:border-campus-500 shadow-xs hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Marketplace</span>
          </button>

          <button 
            onClick={() => setActiveTab('events')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-500 dark:hover:border-campus-500 shadow-xs hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-campus-600 dark:text-campus-400 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Campus Events</span>
          </button>
        </div>
      </div>

      {/* 4. Two-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 Cols): Schedule, Timetable & Active Tickets */}
        <div className="lg:col-span-8 space-y-6">

          {/* Today's Schedule Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-campus-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isCyber ? `Lectures & Labs · Room ${CYBER_SECURITY_SEM3_METADATA.roomNo}` : "Today's Lectures & Labs"}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Day selector pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
                  {daysOfWeek.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        selectedDay === d
                          ? 'bg-campus-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('academics')}
                  className="text-xs text-campus-600 dark:text-campus-400 font-semibold hover:underline flex items-center gap-0.5 shrink-0 ml-1"
                >
                  Full Timetable <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Break Notification Pill */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-campus-700 dark:text-campus-300">Daily Breaks:</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                ☕ Tea: 11:00 AM – 11:15 AM
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold">
                🍱 Lunch: 1:15 PM – 2:00 PM
              </span>
              {isCyber && (
                <span className="ml-auto text-[10px] text-slate-400 font-medium hidden sm:inline">
                  ODD SEMESTER 2026–27 · CDS10-104
                </span>
              )}
            </div>

            {/* Lecture list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {isCyber ? (
                cyberDaySlots.length > 0 ? (
                  cyberDaySlots.map((slot, idx) => (
                    <div 
                      key={`${slot.day}-${slot.periodNumber}-${idx}`}
                      className={`py-3 flex items-start justify-between gap-3 ${
                        idx === 0 ? 'bg-campus-50/40 dark:bg-campus-950/20 -mx-5 px-5 rounded-2xl' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-center w-16 shrink-0 rounded-xl p-1.5 ${
                          idx === 0 
                            ? 'bg-campus-600 text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          <span className="text-[10px] font-bold block opacity-80">Period {slot.periodNumber}</span>
                          <span className="text-[11px] font-extrabold whitespace-nowrap">{slot.time}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5">
                            <span>{slot.shortName}</span>
                            {slot.courseCode && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                {slot.courseCode}
                              </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              slot.type === 'LAB' 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                                : slot.type === 'TUTORIAL'
                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                                : slot.type === 'MEETING'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}>
                              {slot.type} {slot.batches ? `• ${slot.batches}` : ''}
                            </span>
                            {idx === 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-campus-500 text-white font-bold animate-pulse">
                                Next Up
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            {slot.courseName}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>👨‍🏫 {slot.faculty}</span>
                            <span>📍 {slot.room}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mt-1">
                        {slot.durationHours || 1} Hr
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No classes scheduled for {selectedDay}. Enjoy your revision!
                  </div>
                )
              ) : (
                /* Non-cyber fallback */
                courses.slice(0, 3).map((c, i) => (
                  <div key={c.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="text-center w-14 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5">
                        <span className="text-[10px] text-slate-500 font-bold block">Period {i+1}</span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">10:00</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {c.code} • {c.name}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.facultyName} • {c.room}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.scheduleDayTime}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Timetable Overview Card (Replaces Attendance & Bunk Budget) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-campus-600" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {isCyber ? "Cyber Security Sem 3 · Official Timetable & Courses" : "Academic Schedule & Subjects"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Room: {CYBER_SECURITY_SEM3_METADATA.roomNo} · With Effect From: {CYBER_SECURITY_SEM3_METADATA.withEffectFrom}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isCyber && (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-semibold">
                    {(['ALL', 'A1', 'A2', 'A3'] as const).map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBatch(b)}
                        className={`px-2 py-0.5 rounded-lg transition ${
                          selectedBatch === b 
                            ? 'bg-campus-600 text-white shadow-xs' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {b === 'ALL' ? 'All' : `Batch ${b}`}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setActiveTab('academics')}
                  className="px-3 py-1.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs whitespace-nowrap"
                >
                  <span>Full Matrix</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Course & Faculty Directory Reference Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Enrolled Department Courses & Faculty Mentors (Sem 3)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(isCyber ? FACULTY_DIRECTORY : courses.map(c => ({ code: c.code, name: c.name, faculty: c.facultyName, initials: '' }))).map(item => (
                  <div 
                    key={item.code}
                    className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-campus-100 text-campus-700 dark:bg-campus-950 dark:text-campus-300 border border-campus-200 dark:border-campus-800">
                          {item.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.faculty}</span>
                        {item.initials && <span className="text-slate-400">({item.initials})</span>}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">CDS10-104</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Campus Tickets Tracker */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Your Campus Maintenance Tickets
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('issues')}
                className="text-xs text-campus-600 dark:text-campus-400 font-semibold hover:underline"
              >
                View All ({campusIssues.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {activeTickets.slice(0, 2).map(issue => {
                const steps: ('REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED')[] = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
                const currentIndex = issue.status === 'RESOLVED' ? 3 : issue.status === 'IN_PROGRESS' ? 2 : issue.status === 'ASSIGNED' ? 1 : 0;

                return (
                  <div key={issue.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{issue.id}: {issue.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            issue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            issue.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {issue.locationBuilding} • Assigned to: {issue.assignedTo || 'Pending Triage'}
                        </p>
                      </div>

                      {issue.status === 'RESOLVED' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setReopenModalIssueId(issue.id);
                              setReopenReason('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold hover:bg-rose-100"
                          >
                            Not Fixed? Reopen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stepper Lifecycle Visualizer */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {steps.map((step, idx) => (
                        <div key={step} className="space-y-1">
                          <div className={`h-1.5 rounded-full transition-all ${
                            idx <= currentIndex 
                              ? idx === 3 ? 'bg-emerald-500' : 'bg-campus-600' 
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}></div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-center truncate">
                            {step.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {issue.staffNotes && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        <strong>Staff Update:</strong> {issue.staffNotes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Pending Deadlines, Hackathons & AI Teaser */}
        <div className="lg:col-span-4 space-y-6">

          {/* Pending Assignments Radar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-campus-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Assignments & Deadlines
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('academics')}
                className="text-xs text-campus-600 font-semibold"
              >
                View
              </button>
            </div>

            <div className="space-y-2.5">
              {assignments.map(asg => (
                <div key={asg.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-campus-600 dark:text-campus-400">{asg.courseCode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      asg.status === 'SUBMITTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {asg.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{asg.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Due: {asg.dueDate}</span>
                    <span>{asg.totalMarks} Marks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Campus Events */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Trending Events
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('events')}
                className="text-xs text-campus-600 font-semibold"
              >
                RSVP
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 2).map(evt => (
                <div key={evt.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {evt.category}
                    </span>
                    <span className="text-slate-400">{evt.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{evt.venue}</p>
                  {evt.isRegistered && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Registered & Pass Ready
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Curated Opportunities & Hackathons Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Opportunities & Hackathons
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('events')}
                className="text-xs text-campus-600 font-semibold hover:underline"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-2.5">
              {opportunities.slice(0, 2).map(opp => (
                <div key={opp.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {opp.type}
                    </span>
                    <span className="text-slate-400 font-medium">Deadline: {opp.deadline}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{opp.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>{opp.organization}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {opp.rewardOrStipend || 'Certificate'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ask Campus AI Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Grounded Campus AI
              </span>
              <span className="text-[10px] text-indigo-200">100% Citations</span>
            </div>
            <h4 className="text-sm font-bold leading-snug">Got questions about college circulars, hostel rules or exam hall tickets?</h4>
            <p className="text-xs text-indigo-200">Instant answers retrieved directly from verified college regulatory manuals.</p>
            <button 
              onClick={() => setActiveTab('ask_ai')}
              className="w-full py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition shadow-md flex items-center justify-center gap-1.5"
            >
              Ask Campus Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Reopen Issue Modal */}
      {reopenModalIssueId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Reopen Campus Issue</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please explain why the issue was not resolved. This ticket will be escalated directly to the Head of Facilities and Dean.
            </p>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. Technician closed ticket but the Wi-Fi router is still offline on 3rd floor..."
              className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-3 outline-none focus:border-campus-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setReopenModalIssueId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (reopenReason.trim()) {
                    reopenIssue(reopenModalIssueId, reopenReason);
                    setReopenModalIssueId(null);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Reopen & Escalate Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
