import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import {
  Calendar, MapPin, Users, QrCode, X, Ticket, Clock, Sparkles,
  Search, Trophy, Briefcase, Palette, Zap, Star, CheckCircle2, AlertCircle,
  Bookmark, BookmarkCheck
} from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; darkBg: string; darkText: string; emoji: string; gradient: string }> = {
  ALL:      { label: 'All Events',  color: 'text-slate-700',  bg: 'bg-slate-100',   border: 'border-slate-200', darkBg: 'dark:bg-slate-800', darkText: 'dark:text-slate-200', emoji: '🎪', gradient: 'from-slate-500 to-slate-700' },
  TECH:     { label: 'Tech',        color: 'text-blue-700',   bg: 'bg-blue-100',    border: 'border-blue-200',  darkBg: 'dark:bg-blue-950',  darkText: 'dark:text-blue-300',  emoji: '💻', gradient: 'from-blue-500 to-indigo-600' },
  CAREER:   { label: 'Career',      color: 'text-emerald-700',bg: 'bg-emerald-100', border: 'border-emerald-200',darkBg: 'dark:bg-emerald-950',darkText: 'dark:text-emerald-300',emoji: '💼', gradient: 'from-emerald-500 to-teal-600' },
  SPORTS:   { label: 'Sports',      color: 'text-amber-700',  bg: 'bg-amber-100',   border: 'border-amber-200', darkBg: 'dark:bg-amber-950',  darkText: 'dark:text-amber-300',  emoji: '🏆', gradient: 'from-amber-500 to-orange-600' },
  CULTURAL: { label: 'Cultural',    color: 'text-purple-700', bg: 'bg-purple-100',  border: 'border-purple-200',darkBg: 'dark:bg-purple-950', darkText: 'dark:text-purple-300', emoji: '🎭', gradient: 'from-purple-500 to-pink-600' },
  ACADEMIC: { label: 'Academic',    color: 'text-rose-700',   bg: 'bg-rose-100',    border: 'border-rose-200',  darkBg: 'dark:bg-rose-950',   darkText: 'dark:text-rose-300',   emoji: '📚', gradient: 'from-rose-500 to-red-600' },
};

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const EventsView: React.FC = () => {
  const { events, registerForEvent, cancelEventRegistration, toggleEventBookmark, currentUser, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [viewPassEvent, setViewPassEvent] = useState<EventItem | null>(null);

  const filteredEvents = events.filter(evt => {
    const matchesCat = selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchesSearch = !searchQuery || evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSaved = !showSavedOnly || Boolean(evt.isSaved);
    return matchesCat && matchesSearch && matchesSaved;
  });

  const registeredCount = events.filter(e => e.isRegistered).length;
  const bookmarkedCount = events.filter(e => e.isSaved).length;
  const upcomingCount = events.length;

  return (
    <div className="space-y-6">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800 animate-gradient p-6 sm:p-8 text-white shadow-2xl shadow-purple-900/30">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-purple-200 border border-white/10">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              🎟️ QR-Verified Digital Passes · Live Events
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Campus Events &amp; Digital Passes
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl leading-relaxed">
              Discover hackathons, guest seminars, inter-hostel tournaments &amp; cultural fests. Get instant QR ticket passes.
            </p>
          </div>

          {/* Stat Pods */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[90px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">Upcoming</div>
              <div className="text-2xl font-extrabold mt-1 group-hover:scale-105 transition-transform">{upcomingCount}</div>
              <div className="text-[10px] mt-0.5 bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full font-bold">Events</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[90px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">My RSVPs</div>
              <div className="text-2xl font-extrabold mt-1 text-emerald-300 group-hover:scale-105 transition-transform">{registeredCount}</div>
              <div className="text-[10px] mt-0.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Registered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              showSavedOnly
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            {showSavedOnly ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>Bookmarked ({bookmarkedCount})</span>
          </button>
          {['ALL', 'TECH', 'CAREER', 'SPORTS', 'CULTURAL', 'ACADEMIC'].map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg shadow-purple-500/20`
                    : `${cfg.bg} ${cfg.color} ${cfg.darkBg} ${cfg.darkText} ${cfg.border} border hover:-translate-y-0.5 hover:shadow-md`
                }`}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <span className="text-xs font-bold text-slate-400">{filteredEvents.length} EVENTS FOUND</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40">
          <div className="text-4xl mb-3">🎪</div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No events found</h3>
          <p className="text-xs text-slate-400 mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map(evt => {
            const isFull = evt.registeredCount >= evt.capacity;
            const cfg = CATEGORY_CONFIG[evt.category] || CATEGORY_CONFIG.ALL;
            const fillPct = Math.min((evt.registeredCount / evt.capacity) * 100, 100);
            const daysUntilDeadline = getDaysUntil(evt.registrationDeadline);

            return (
              <div
                key={evt.id}
                className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 flex flex-col"
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl bg-gradient-to-b ${cfg.gradient}`} />

                <div className="p-5 pl-6 flex-1 space-y-3">
                  {/* Category + capacity + bookmark */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} ${cfg.darkBg} ${cfg.darkText} flex items-center gap-1`}>
                      <span>{cfg.emoji}</span> {cfg.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEventBookmark(evt.id);
                        }}
                        className={`p-1 rounded-lg transition ${
                          evt.isSaved 
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={evt.isSaved ? 'Remove bookmark' : 'Bookmark event'}
                      >
                        {evt.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      {evt.isRegistered && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Registered
                        </span>
                      )}
                      {isFull && !evt.isRegistered && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                          FULL
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate font-medium">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate font-medium">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate font-medium">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-medium">{evt.registeredCount}/{evt.capacity}</span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Capacity</span>
                      <span>{Math.round(fillPct)}% filled</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${fillPct >= 90 ? 'bg-gradient-to-r from-rose-500 to-red-400' : fillPct >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : `bg-gradient-to-r ${cfg.gradient}`}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Deadline badge */}
                  {daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && !evt.isRegistered && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-xl">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Registration deadline in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}!
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-5 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400 font-medium">by {evt.organizer}</span>
                  {evt.isRegistered ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewPassEvent(evt)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>
                      <button
                        onClick={() => cancelEventRegistration(evt.id)}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors px-2 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => registerForEvent(evt.id)}
                      disabled={isFull}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-lg ${
                        isFull
                          ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                          : `bg-gradient-to-r ${cfg.gradient} hover:opacity-90 shadow-purple-500/30 hover:-translate-y-0.5`
                      }`}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{isFull ? 'Fully Booked' : 'RSVP & Get Ticket'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Pass Modal */}
      {viewPassEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-white/30 dark:border-slate-700/50 shadow-2xl max-w-sm w-full overflow-hidden">
            {/* Modal top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${CATEGORY_CONFIG[viewPassEvent.category]?.gradient || 'from-purple-500 to-indigo-600'}`} />

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" /> Official Entry Pass
                </span>
                <button onClick={() => setViewPassEvent(null)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{viewPassEvent.title}</h3>
                <p className="text-xs text-slate-500">{viewPassEvent.venue} · {viewPassEvent.time}</p>
              </div>

              {/* QR Code visual */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-purple-300 dark:border-purple-700 flex flex-col items-center gap-3">
                <div className="w-44 h-44 bg-white rounded-xl p-3 shadow-inner border border-slate-200 dark:border-slate-700">
                  <div className="w-full h-full grid grid-cols-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const isCorner = (i < 16 && i % 8 < 3 && Math.floor(i / 8) < 3) ||
                                       (i < 16 && i % 8 > 4) ||
                                       (i > 47 && i % 8 < 3);
                      const isDark = isCorner || (i % 3 === 0 && i % 7 !== 0) || (i % 11 === 0) || (i === 27 || i === 36 || i === 35);
                      return (
                        <div key={i} className={`rounded-[1px] ${isDark ? 'bg-slate-900 dark:bg-slate-100' : 'bg-transparent'}`} />
                      );
                    })}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest">
                  {viewPassEvent.qrPassCode || 'CAMPUS-OS-VERIFIED'}
                </span>
              </div>

              {/* Student info */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Student</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Roll No.</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentUser.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('✅ Gate scanner simulated — attendance verified!');
                  setViewPassEvent(null);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-extrabold shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Simulate Gate Scanner Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
