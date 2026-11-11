import React from 'react';
import { useApp, ActiveNavTab } from '../../context/AppContext';
import { isTabAllowed } from '../../utils/rbac';
import {
  LayoutDashboard, BookOpen, Wrench, Calendar, Users2, Briefcase,
  FolderGit2, UserCheck, ShoppingBag, SearchCode, Library, Building2,
  Sparkles, ShieldCheck, Printer, ClipboardCheck
} from 'lucide-react';

interface NavItem {
  id: ActiveNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
  iconBg?: string;
  iconColor?: string;
  activeBg?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, campusIssues } = useApp();
  const activeIssueCount = campusIssues.filter(i => i.status === 'REPORTED' || i.status === 'IN_PROGRESS' || i.status === 'REOPENED').length;

  const rawCoreItems: NavItem[] = [
    { id: 'dashboard',     label: 'Home Dashboard',    icon: LayoutDashboard, iconBg: 'bg-blue-100 dark:bg-blue-950',    iconColor: 'text-blue-600 dark:text-blue-400',   activeBg: 'from-blue-600 to-campus-600' },
    { id: 'admin',         label: 'Executive Admin & SLA', icon: ShieldCheck, iconBg: 'bg-red-100 dark:bg-red-950',     iconColor: 'text-red-600 dark:text-red-400',     activeBg: 'from-red-600 to-rose-600' },
    { id: 'print_admin',   label: 'Print Hub Admin',   icon: ClipboardCheck, iconBg: 'bg-indigo-100 dark:bg-indigo-950', iconColor: 'text-indigo-600 dark:text-indigo-400', activeBg: 'from-slate-700 to-indigo-700' },
    { id: 'issues',        label: 'Campus Issues & SLA', icon: Wrench,        iconBg: 'bg-rose-100 dark:bg-rose-950',    iconColor: 'text-rose-600 dark:text-rose-400',   activeBg: 'from-rose-600 to-red-600',    badge: activeIssueCount > 0 ? `${activeIssueCount}` : undefined },
    { id: 'academics',     label: 'Academics & Risk',  icon: BookOpen,        iconBg: 'bg-violet-100 dark:bg-violet-950', iconColor: 'text-violet-600 dark:text-violet-400', activeBg: 'from-violet-600 to-purple-600' },
    { id: 'println',       label: 'Println • Xerox Hub', icon: Printer,        iconBg: 'bg-indigo-100 dark:bg-indigo-950', iconColor: 'text-indigo-600 dark:text-indigo-400', activeBg: 'from-indigo-600 to-blue-600' },
    { id: 'events',        label: 'Events & Passes',   icon: Calendar,        iconBg: 'bg-purple-100 dark:bg-purple-950', iconColor: 'text-purple-600 dark:text-purple-400', activeBg: 'from-purple-600 to-violet-600' },
    { id: 'clubs',         label: 'Clubs & Chapters',  icon: Users2,          iconBg: 'bg-indigo-100 dark:bg-indigo-950', iconColor: 'text-indigo-600 dark:text-indigo-400', activeBg: 'from-indigo-600 to-blue-600' },
    { id: 'opportunities', label: 'Opportunities',     icon: Briefcase,       iconBg: 'bg-emerald-100 dark:bg-emerald-950', iconColor: 'text-emerald-600 dark:text-emerald-400', activeBg: 'from-emerald-600 to-teal-600' },
    { id: 'projects',      label: 'Project Finder',    icon: FolderGit2,      iconBg: 'bg-cyan-100 dark:bg-cyan-950',    iconColor: 'text-cyan-600 dark:text-cyan-400',   activeBg: 'from-cyan-600 to-sky-600' },
  ];

  const rawLifeItems: NavItem[] = [
    { id: 'people',        label: 'People & Mentors',  icon: UserCheck,   iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-950', iconColor: 'text-fuchsia-600 dark:text-fuchsia-400', activeBg: 'from-fuchsia-600 to-pink-600' },
    { id: 'marketplace',   label: 'Marketplace',       icon: ShoppingBag, iconBg: 'bg-teal-100 dark:bg-teal-950',       iconColor: 'text-teal-600 dark:text-teal-400',   activeBg: 'from-teal-600 to-emerald-600' },
    { id: 'lostfound',     label: 'Lost & Found',      icon: SearchCode,  iconBg: 'bg-amber-100 dark:bg-amber-950',     iconColor: 'text-amber-600 dark:text-amber-400', activeBg: 'from-amber-600 to-orange-600' },
    { id: 'library',       label: 'Library Catalog',   icon: Library,     iconBg: 'bg-sky-100 dark:bg-sky-950',         iconColor: 'text-sky-600 dark:text-sky-400',     activeBg: 'from-sky-600 to-blue-600' },
    { id: 'hostel',        label: 'Hostel & Mess',     icon: Building2,   iconBg: 'bg-orange-100 dark:bg-orange-950',   iconColor: 'text-orange-600 dark:text-orange-400', activeBg: 'from-orange-600 to-amber-600' },
    { id: 'ask_ai',        label: 'Ask Campus AI',     icon: Sparkles,    iconBg: 'bg-violet-100 dark:bg-violet-950',   iconColor: 'text-violet-600 dark:text-violet-400', activeBg: 'from-violet-600 to-indigo-600', highlight: true },
  ];

  const coreItems = rawCoreItems.filter(item => isTabAllowed(currentRole, item.id));
  const lifeItems = rawLifeItems.filter(item => isTabAllowed(currentRole, item.id));

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
          isActive
            ? `bg-gradient-to-r ${item.activeBg || 'from-campus-600 to-campus-500'} text-white shadow-lg shadow-black/15`
            : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:shadow-sm hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            isActive
              ? 'bg-white/20 shadow-sm'
              : `${item.iconBg} group-hover:scale-110`
          }`}>
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.iconColor}`} />
          </div>
          <span>{item.label}</span>
        </div>

        <div className="flex items-center gap-1">
          {item.badge && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center ${
              isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
            }`}>
              {item.badge}
            </span>
          )}
          {item.highlight && !isActive && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-black tracking-wide">
              AI
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col py-5 px-3 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 space-y-0.5 overflow-y-auto">
        {/* Core nav section */}
        <div className="px-3 pb-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Core Campus</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
          </div>
        </div>
        {coreItems.map(renderNavButton)}

        {/* Campus Life section */}
        <div className="px-3 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Campus Life</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
          </div>
        </div>
        {lifeItems.map(renderNavButton)}
      </div>

      {/* Role badge at bottom */}
      <div className="mt-4 mx-1 p-3.5 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/60 dark:to-slate-900/60 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Role</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-campus-600 to-campus-500 text-white font-bold capitalize shadow-sm">
            {currentRole.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Tenant: <span className="font-bold text-campus-600 dark:text-campus-400">MIT_CAMPUS</span>
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="relative flex w-1.5 h-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">Multi-tenant isolated</span>
        </div>
      </div>
    </aside>
  );
};
