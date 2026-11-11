import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { 
  Briefcase, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  GraduationCap, 
  Search, 
  Sparkles, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Trophy, 
  ArrowUpDown, 
  ExternalLink,
  Users,
  Compass
} from 'lucide-react';

type OpportunityType = 'ALL' | 'INTERNSHIP' | 'HACKATHON' | 'SCHOLARSHIP' | 'RESEARCH' | 'FELLOWSHIP';

interface TypeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  barGradient: string;
  iconBg: string;
  emoji: string;
}

const TYPE_CONFIG: Record<OpportunityType, TypeConfig> = {
  ALL: {
    label: 'All Opportunities',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    barGradient: 'from-emerald-500 to-teal-600',
    iconBg: 'from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900',
    emoji: '🌟',
  },
  INTERNSHIP: {
    label: 'Internships',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    border: 'border-blue-200 dark:border-blue-800/40',
    barGradient: 'from-blue-500 to-indigo-600',
    iconBg: 'from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900',
    emoji: '💼',
  },
  HACKATHON: {
    label: 'Hackathons',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    border: 'border-amber-200 dark:border-amber-800/40',
    barGradient: 'from-amber-500 to-orange-600',
    iconBg: 'from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900',
    emoji: '⚡',
  },
  SCHOLARSHIP: {
    label: 'Scholarships',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    border: 'border-purple-200 dark:border-purple-800/40',
    barGradient: 'from-purple-500 to-pink-600',
    iconBg: 'from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900',
    emoji: '🎓',
  },
  RESEARCH: {
    label: 'Research',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-100 dark:bg-indigo-950/60',
    border: 'border-indigo-200 dark:border-indigo-800/40',
    barGradient: 'from-indigo-500 to-cyan-600',
    iconBg: 'from-indigo-50 to-cyan-100 dark:from-indigo-950 dark:to-cyan-900',
    emoji: '🔬',
  },
  FELLOWSHIP: {
    label: 'Fellowships',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    border: 'border-rose-200 dark:border-rose-800/40',
    barGradient: 'from-rose-500 to-red-600',
    iconBg: 'from-rose-50 to-red-100 dark:from-rose-950 dark:to-red-900',
    emoji: '🏆',
  },
};

function getDaysRemaining(deadlineStr: string) {
  const cleanStr = deadlineStr.replace(/\s*\(.*\)/, '').trim();
  const targetDate = new Date(cleanStr);
  if (isNaN(targetDate.getTime())) {
    return { days: 999, text: deadlineStr, isUrgent: false, isExpired: false };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(23, 59, 59, 999);
  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: diffDays, text: 'Deadline Passed', isUrgent: false, isExpired: true };
  }
  if (diffDays === 0) {
    return { days: 0, text: 'Closes Today!', isUrgent: true, isExpired: false };
  }
  if (diffDays === 1) {
    return { days: 1, text: '1 day left', isUrgent: true, isExpired: false };
  }
  return { 
    days: diffDays, 
    text: `${diffDays} days left`, 
    isUrgent: diffDays <= 7, 
    isExpired: false 
  };
}

export const OpportunitiesView: React.FC = () => {
  const { opportunities, toggleSaveOpportunity, showToast } = useApp();
  const [selectedType, setSelectedType] = useState<OpportunityType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortByUrgency, setSortByUrgency] = useState(true);

  // Compute stat pod values
  const totalListings = opportunities.length;
  const savedCount = opportunities.filter(o => o.isSaved).length;
  const hackathonsCount = opportunities.filter(o => o.type === 'HACKATHON').length;

  // Filtered and sorted opportunities
  const filteredOpportunities = useMemo(() => {
    let list = opportunities.filter(opp => {
      const matchesType = selectedType === 'ALL' || opp.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.skills.some(s => s.toLowerCase().includes(q)) ||
        opp.departmentEligibility.some(d => d.toLowerCase().includes(q));
      const matchesSaved = !savedOnly || opp.isSaved;

      return matchesType && matchesSearch && matchesSaved;
    });

    if (sortByUrgency) {
      list.sort((a, b) => {
        const daysA = getDaysRemaining(a.deadline).days;
        const daysB = getDaysRemaining(b.deadline).days;
        return daysA - daysB;
      });
    }

    return list;
  }, [opportunities, selectedType, searchQuery, savedOnly, sortByUrgency]);

  const handleApply = (opp: Opportunity) => {
    showToast(`External application portal link opened for ${opp.title}!`);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 animate-gradient text-white p-6 sm:p-8 shadow-2xl shadow-green-900/30">
        {/* Decorative glass blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-emerald-200 border border-white/15">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
              </span>
              💼 Verified Postings · Career, Research &amp; Placement Board
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Opportunities &amp; Internships Board
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Discover verified industry summer internships, premier research fellowships (IISc/IIT), SIH national hackathons, and corporate merit scholarships for your cohort.
            </p>
          </div>

          {/* Glass Stat Pods */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 self-start lg:self-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">Total Listings</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 group-hover:scale-105 transition-transform">{totalListings}</div>
              <div className="text-[10px] mt-0.5 bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold">Open Board</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">Saved</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-cyan-200 group-hover:scale-105 transition-transform">{savedCount}</div>
              <div className="text-[10px] mt-0.5 bg-cyan-400/20 text-cyan-200 px-2 py-0.5 rounded-full font-bold">Bookmarked</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">Hackathons</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-amber-300 group-hover:scale-105 transition-transform">{hackathonsCount}</div>
              <div className="text-[10px] mt-0.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Competitions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search opportunities by title, organization, skill, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortByUrgency(!sortByUrgency)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
              sortByUrgency
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20'
                : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Urgent Deadlines First</span>
          </button>

          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
              savedOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved Only ({savedCount})</span>
          </button>
        </div>
      </div>

      {/* Filter Pills with Color Coding */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_CONFIG) as OpportunityType[]).map(typeKey => {
          const cfg = TYPE_CONFIG[typeKey];
          const isActive = selectedType === typeKey;
          const count = typeKey === 'ALL' ? totalListings : opportunities.filter(o => o.type === typeKey).length;

          return (
            <button
              key={typeKey}
              onClick={() => setSelectedType(typeKey)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                  : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                isActive ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Showing {filteredOpportunities.length} of {opportunities.length} Opportunities
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Opportunity Cards Grid (2 cols md) */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map(opp => {
            const typeCfg = TYPE_CONFIG[opp.type] || TYPE_CONFIG.ALL;
            const remaining = getDaysRemaining(opp.deadline);

            return (
              <div
                key={opp.id}
                className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group space-y-4"
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b ${typeCfg.barGradient}`} />

                <div className="space-y-3.5">
                  {/* Top Bar: Type Badge, Stipend/Prize Highlight, Bookmark */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${typeCfg.iconBg} flex items-center justify-center text-base shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                        {typeCfg.emoji}
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${typeCfg.bg} ${typeCfg.color} ${typeCfg.border}`}>
                        {opp.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Stipend or Prize Highlight in campus-600 */}
                      <span className="text-xs sm:text-sm font-extrabold text-campus-600 dark:text-campus-400 bg-campus-50 dark:bg-campus-950/50 border border-campus-200 dark:border-campus-800/40 px-3 py-1 rounded-full shadow-xs">
                        {opp.stipendOrPrize}
                      </span>

                      {/* Bookmark Toggle */}
                      <button
                        onClick={() => {
                          toggleSaveOpportunity(opp.id);
                          showToast(opp.isSaved ? `Removed from saved bookmarks` : `Saved ${opp.title} to your board!`);
                        }}
                        aria-label="Save Opportunity"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        {opp.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{opp.organization}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {opp.description}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {opp.skills.map(skill => (
                      <span
                        key={skill}
                        className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Eligibility & Deadline row */}
                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>Eligible:</strong> {opp.departmentEligibility.join(', ')}</span>
                      </div>

                      {opp.minCgpa && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                          Min CGPA: {opp.minCgpa}
                        </span>
                      )}
                    </div>

                    {/* Deadline with Days Remaining Badge */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: <strong>{opp.deadline}</strong></span>
                      </div>

                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          remaining.isExpired
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : remaining.isUrgent
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {remaining.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    {opp.applicationStatus && opp.applicationStatus !== 'NOT_APPLIED' ? (
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        opp.applicationStatus === 'APPLIED'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                          : opp.applicationStatus === 'INTERVIEWING'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        Status: {opp.applicationStatus}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Verified by College Portal
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleApply(opp)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all flex items-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
            💼
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Opportunities Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any opportunities matching your active filters or keyword search.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedType('ALL');
              setSearchQuery('');
              setSavedOnly(false);
              setSortByUrgency(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
