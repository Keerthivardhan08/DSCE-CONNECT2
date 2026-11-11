import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Search, 
  Bell, 
  Shield, 
  UserCheck, 
  GraduationCap, 
  CheckCircle2, 
  X,
  ChevronDown,
  Sparkles,
  Info,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    logout,
    announcements, 
    markAnnouncementAsRead,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    toastMessage
  } = useApp();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifsModal, setShowNotifsModal] = useState(false);

  const unreadAnnouncements = announcements.filter(a => !a.read);

  const availableRoles: { role: UserRole; title: string; desc: string; icon: string }[] = [
    { role: 'STUDENT', title: 'Student', desc: 'Standard student view with timetable, attendance risk, clubs, issues & print orders.', icon: '🎓' },
    { role: 'PRINT_ADMIN', title: 'Print Hub Admin', desc: 'Manage incoming student print queue, fulfill print jobs & configure Xerox rates.', icon: '🖨️' },
    { role: 'FACILITY_STAFF', title: 'Facilities Maintenance Desk', desc: 'Triage campus maintenance tickets, log technician notes & advance resolution status.', icon: '🔧' },
    { role: 'CAMPUS_ADMIN', title: 'Campus Super Admin (Dean)', desc: 'Executive oversight, audit student escalations, SLA analytics & broadcast notices.', icon: '🛡️' },
    { role: 'CLASS_REP', title: 'Class Representative', desc: 'Coordinate class assignments, batch issue escalations & post batch notices.', icon: '📢' },
    { role: 'CLUB_LEADER', title: 'Club Leader', desc: 'Manage club profile, member applications, and event QR check-in scanning.', icon: '🏆' },
    { role: 'FACULTY', title: 'Faculty / Professor', desc: 'Course syllabus oversight, lab grading and student academic risk alerts.', icon: '👨‍🏫' },
    { role: 'HOSTEL_STAFF', title: 'Hostel & Mess Staff', desc: 'Manage 7-day mess menu, hostel room repairs & out-pass verification.', icon: '🏢' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-slate-950/75 backdrop-blur-2xl border-b border-white/30 dark:border-slate-800/60 transition-colors shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-campus-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md cursor-pointer hover:scale-105 transition active:scale-95"
            >
              🎓
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">Campus OS</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-campus-50 text-campus-600 dark:bg-campus-950 dark:text-campus-400 border border-campus-200 dark:border-campus-800">
                  {currentUser.department.split(' ')[0]}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">National Institute Campus Network</p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search courses, campus issues, events, books, or classmates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-campus-500 dark:focus:border-campus-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Role Persona Switcher, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Ask Campus AI Button */}
            <button
              onClick={() => setActiveTab('ask_ai')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Persona / Role Switcher Pill */}
            <button 
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition border border-slate-200 dark:border-slate-700"
              title="Switch user perspective / role"
            >
              <Shield className="w-3.5 h-3.5 text-campus-600 dark:text-campus-400" />
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {currentRole.replace('_', ' ').toLowerCase()}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifsModal(!showNotifsModal)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadAnnouncements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifsModal && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Official Notices</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-100 dark:bg-campus-900 text-campus-700 dark:text-campus-300 font-bold">
                        {unreadAnnouncements.length} unread
                      </span>
                    </div>
                    <button onClick={() => setShowNotifsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
                      ✕
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto mt-2">
                    {announcements.map(ann => (
                      <div 
                        key={ann.id} 
                        onClick={() => markAnnouncementAsRead(ann.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition ${!ann.read ? 'bg-campus-50/60 dark:bg-campus-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ann.category === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400' :
                            ann.category === 'ACADEMIC' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {ann.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{ann.publishedAt}</span>
                        </div>
                        <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">{ann.title}</h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div 
              onClick={() => setActiveTab('people')} 
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              <UserAvatar 
                name={currentUser.name} 
                color={currentUser.avatarColor}
                size="sm" 
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                  <CheckCircle2 className="w-3 h-3 text-campus-500" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.rollNumber}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
              title="Sign Out of Campus OS"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 shadow-2xl border border-slate-700/60 dark:border-slate-300/60 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-xs">
          <div className="w-8 h-8 rounded-xl bg-campus-500/20 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-campus-400 dark:text-campus-600" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Role Persona Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-campus-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Switch Campus Persona</h3>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
              Select any stakeholder role to experience the Campus OS from their verified authorization level:
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {availableRoles.map(r => (
                <div
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setShowRoleModal(false);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    currentRole === r.role 
                      ? 'bg-campus-50 dark:bg-campus-950/50 border-campus-500 text-campus-900 dark:text-campus-100 ring-2 ring-campus-500/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{r.title}</span>
                      {currentRole === r.role && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-600 text-white font-bold">Active</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
