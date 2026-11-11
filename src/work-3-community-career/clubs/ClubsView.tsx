import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users2, 
  CheckCircle2, 
  UserPlus, 
  LogOut, 
  Clock, 
  Sparkles, 
  Search, 
  Compass, 
  Trophy, 
  Layers,
  Sparkle
} from 'lucide-react';

type ClubCategory = 'ALL' | 'TECH' | 'CULTURAL' | 'SPORTS' | 'SOCIAL' | 'ACADEMIC';

interface CategoryStyle {
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  barGradient: string;
  iconBg: string;
  emoji: string;
}

const CATEGORY_MAP: Record<ClubCategory, CategoryStyle> = {
  ALL: {
    label: 'All Clubs',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    border: 'border-purple-200 dark:border-purple-800/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/50',
    badgeText: 'text-purple-700 dark:text-purple-300',
    barGradient: 'from-purple-500 to-indigo-600',
    iconBg: 'from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900',
    emoji: '🌟',
  },
  TECH: {
    label: 'Tech & Dev',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    border: 'border-blue-200 dark:border-blue-800/40',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    barGradient: 'from-blue-500 to-cyan-500',
    iconBg: 'from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900',
    emoji: '💻',
  },
  CULTURAL: {
    label: 'Cultural & Arts',
    color: 'text-pink-700 dark:text-pink-300',
    bg: 'bg-pink-100 dark:bg-pink-950/60',
    border: 'border-pink-200 dark:border-pink-800/40',
    badgeBg: 'bg-pink-100 dark:bg-pink-950/60',
    badgeText: 'text-pink-700 dark:text-pink-300',
    barGradient: 'from-pink-500 to-rose-500',
    iconBg: 'from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900',
    emoji: '🎭',
  },
  SPORTS: {
    label: 'Sports & Fitness',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    barGradient: 'from-emerald-500 to-teal-500',
    iconBg: 'from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900',
    emoji: '🏆',
  },
  SOCIAL: {
    label: 'Social & Impact',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    border: 'border-amber-200 dark:border-amber-800/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    barGradient: 'from-amber-500 to-orange-500',
    iconBg: 'from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900',
    emoji: '🤝',
  },
  ACADEMIC: {
    label: 'Academic Societies',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-100 dark:bg-indigo-950/60',
    border: 'border-indigo-200 dark:border-indigo-800/40',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    barGradient: 'from-indigo-500 to-purple-600',
    iconBg: 'from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900',
    emoji: '📚',
  },
};

export const ClubsView: React.FC = () => {
  const { clubs, toggleJoinClub, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [joinedOnly, setJoinedOnly] = useState(false);

  // Computed stats
  const totalClubs = clubs.length;
  const joinedCount = clubs.filter(c => c.isJoined).length;
  const recruitingCount = clubs.filter(c => c.recruitmentOpen).length;

  // Filtered clubs
  const filteredClubs = clubs.filter(club => {
    const matchesCategory = selectedCategory === 'ALL' || club.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.leadName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRecruiting = !recruitingOnly || club.recruitmentOpen;
    const matchesJoined = !joinedOnly || club.isJoined;

    return matchesCategory && matchesSearch && matchesRecruiting && matchesJoined;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 animate-gradient text-white p-6 sm:p-8 shadow-2xl shadow-purple-900/30">
        {/* Decorative glass blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-purple-200 border border-white/15">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              🎯 Official Student Chapters &amp; Societies
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Campus Clubs &amp; Student Societies
            </h1>
            
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Explore active technical chapters, cultural groups, and athletic councils. Connect with student leads, attend workshops, and join ongoing recruitment drives.
            </p>
          </div>

          {/* Glass Stat Pods */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 self-start lg:self-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-purple-200 font-semibold uppercase tracking-wider">Total Clubs</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 group-hover:scale-105 transition-transform">{totalClubs}</div>
              <div className="text-[10px] mt-0.5 bg-purple-400/20 text-purple-200 px-2 py-0.5 rounded-full font-bold">Directories</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-purple-200 font-semibold uppercase tracking-wider">My Clubs</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-300 group-hover:scale-105 transition-transform">{joinedCount}</div>
              <div className="text-[10px] mt-0.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Active Member</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-purple-200 font-semibold uppercase tracking-wider">Recruiting</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-amber-300 group-hover:scale-105 transition-transform">{recruitingCount}</div>
              <div className="text-[10px] mt-0.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Open Drives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Quick Toggles */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clubs by name, description, or lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRecruitingOnly(!recruitingOnly)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
              recruitingOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recruiting Only</span>
          </button>

          <button
            onClick={() => setJoinedOnly(!joinedOnly)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
              joinedOnly
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20'
                : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Joined Only</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_MAP) as ClubCategory[]).map(catKey => {
          const cfg = CATEGORY_MAP[catKey];
          const isActive = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                  : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              {catKey !== 'ALL' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                }`}>
                  {clubs.filter(c => c.category === catKey).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Showing {filteredClubs.length} of {clubs.length} Clubs
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Club Cards Grid */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClubs.map(club => {
            const catCfg = CATEGORY_MAP[club.category] || CATEGORY_MAP.ALL;
            // Nominal capacity calculation for progress bar
            const nominalCap = 350;
            const membershipPct = Math.min(100, Math.round((club.membersCount / nominalCap) * 100));

            return (
              <div
                key={club.id}
                className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group space-y-4"
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b ${catCfg.barGradient}`} />

                <div className="space-y-3.5">
                  {/* Top Bar with Category, Badges and Emoji */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${catCfg.iconBg} flex items-center justify-center text-base shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                        {catCfg.emoji}
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${catCfg.bg} ${catCfg.color} ${catCfg.border}`}>
                        {club.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        {club.badge}
                      </span>
                      {club.isJoined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          Joined
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Club Title & Lead */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                      <Users2 className="w-3.5 h-3.5 text-slate-400" />
                      <span><strong>Lead:</strong> {club.leadName}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {club.description}
                  </p>

                  {/* Member Count & Capacity Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Community Strength</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {club.membersCount} Members <span className="text-slate-400 font-normal">({membershipPct}% capacity)</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${catCfg.barGradient} transition-all duration-500`}
                        style={{ width: `${membershipPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Recruitment Status Pill */}
                  {club.recruitmentOpen ? (
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                        <span>Recruiting until <strong>{club.recruitmentDeadline}</strong></span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        Open
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Recruitment currently closed for the term</span>
                    </div>
                  )}
                </div>

                {/* Footer Join/Leave CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {club.isJoined ? 'Official Society Member' : 'Open to all students'}
                  </div>

                  {club.isJoined ? (
                    <button
                      onClick={() => {
                        toggleJoinClub(club.id);
                        showToast(`Left ${club.name}`);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-300 dark:hover:text-rose-300 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 group/btn"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 group-hover/btn:hidden" />
                      <LogOut className="w-3.5 h-3.5 hidden group-hover/btn:inline text-rose-500" />
                      <span>Member ✅ (Leave)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        toggleJoinClub(club.id);
                        showToast(`Joined ${club.name}! 🎉`);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Join / Apply →</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Clubs Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any student societies matching your current filters or search term.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
              setRecruitingOnly(false);
              setJoinedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
