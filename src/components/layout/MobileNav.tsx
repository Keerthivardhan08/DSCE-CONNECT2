import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Wrench, 
  Sparkles, 
  Menu, 
  ClipboardCheck, 
  Printer, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const MobileNav: React.FC<{ onOpenAllMenu: () => void }> = ({ onOpenAllMenu }) => {
  const { activeTab, setActiveTab, currentRole, campusIssues } = useApp();
  const activeIssueCount = campusIssues.filter(i => i.status === 'REPORTED' || i.status === 'IN_PROGRESS' || i.status === 'REOPENED').length;

  const NavBtn = ({ id, icon: Icon, label, badge }: { id: string; icon: React.ComponentType<{ className?: string }>; label: string; badge?: string }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id as any)}
        className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-all px-3 py-1 rounded-2xl ${
          isActive
            ? 'text-campus-600 dark:text-campus-400 bg-campus-50 dark:bg-campus-950/40'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
        }`}
      >
        <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
        <span>{label}</span>
        {badge && (
          <span className="absolute -top-0.5 right-1 text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold shadow-sm">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border-t border-white/30 dark:border-slate-800/60 shadow-2xl shadow-black/10 px-3 py-2 flex items-center justify-around">

      {currentRole === 'PRINT_ADMIN' ? (
        <>
          <NavBtn id="print_admin" icon={ClipboardCheck} label="Print Hub" />
          <NavBtn id="println" icon={Printer} label="Println" />
        </>
      ) : currentRole === 'CAMPUS_ADMIN' ? (
        <>
          <NavBtn id="admin" icon={ShieldCheck} label="Admin SLA" />
          <NavBtn id="dashboard" icon={LayoutDashboard} label="Home" />
        </>
      ) : currentRole === 'FACILITY_STAFF' ? (
        <>
          <NavBtn id="issues" icon={Wrench} label="Tickets" badge={activeIssueCount > 0 ? `${activeIssueCount}` : undefined} />
          <NavBtn id="hostel" icon={Building2} label="Hostel" />
        </>
      ) : (
        <>
          <NavBtn id="dashboard" icon={LayoutDashboard} label="Home" />
          <NavBtn id="academics" icon={BookOpen} label="Academics" />
        </>
      )}

      {/* Floating Center AI button */}
      <button
        onClick={() => setActiveTab('ask_ai')}
        className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 via-campus-600 to-indigo-600 text-white shadow-xl shadow-violet-500/40 active:scale-95 transition-transform animate-gradient"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Right nav buttons */}
      {currentRole === 'PRINT_ADMIN' ? (
        <NavBtn id="issues" icon={Wrench} label="Issues" badge={activeIssueCount > 0 ? `${activeIssueCount}` : undefined} />
      ) : currentRole === 'CAMPUS_ADMIN' ? (
        <NavBtn id="issues" icon={Wrench} label="Escalations" badge={activeIssueCount > 0 ? `${activeIssueCount}` : undefined} />
      ) : currentRole === 'FACILITY_STAFF' ? (
        <NavBtn id="dashboard" icon={LayoutDashboard} label="Home" />
      ) : (
        <NavBtn id="issues" icon={Wrench} label="Issues" badge={activeIssueCount > 0 ? `${activeIssueCount}` : undefined} />
      )}

      <button
        onClick={onOpenAllMenu}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors px-3 py-1"
      >
        <Menu className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
};
