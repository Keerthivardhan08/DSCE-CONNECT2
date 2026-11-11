import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LoginView } from './components/auth/LoginView';
import { IdVerificationView } from './components/auth/IdVerificationView';
import { isTabAllowed, ROLE_DEFAULT_TAB } from './utils/rbac';

// Domain Views
import { StudentDashboard } from './work-1-academics/dashboard/StudentDashboard';
import { AcademicsView } from './work-1-academics/academics/AcademicsView';
import { LibraryView } from './work-1-academics/library/LibraryView';
import { CampusIssuesView } from './work-2-campus-operations/issues/CampusIssuesView';
import { HostelView } from './work-2-campus-operations/hostel/HostelView';
import { AdminPortalView } from './work-2-campus-operations/admin/AdminPortalView';
import { PrintHubAdminView } from './work-2-campus-operations/print-shop/PrintHubAdminView';
import { EventsView } from './work-3-community-career/events/EventsView';
import { ClubsView } from './work-3-community-career/clubs/ClubsView';
import { OpportunitiesView } from './work-3-community-career/opportunities/OpportunitiesView';
import { ProjectsView } from './work-3-community-career/projects/ProjectsView';
import { PeopleDirectoryView } from './work-3-community-career/people/PeopleDirectoryView';
import { MarketplaceView } from './work-4-student-services/marketplace/MarketplaceView';
import { LostFoundView } from './work-4-student-services/lostfound/LostFoundView';
import { AskCampusAIView } from './work-4-student-services/ai/AskCampusAIView';
import { PrintlnView } from './work-1-academics/println/PrintlnView';

import { 
  X, 
  Search, 
  LayoutDashboard, 
  BookOpen, 
  Wrench, 
  Calendar, 
  Users2, 
  Briefcase, 
  FolderGit2, 
  ShoppingBag, 
  SearchCode, 
  Library, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  UserCheck,
  Printer,
  ClipboardCheck,
  ShieldAlert,
  Lock
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { 
    isAuthenticated,
    isPendingIdVerification,
    completeIdVerification,
    currentRole,
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    courses, 
    campusIssues, 
    events, 
    libraryBooks, 
    marketplace 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, render the Role-Based Login Screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // If newly registered student undergoing ID verification onboarding
  if (isPendingIdVerification) {
    return <IdVerificationView onComplete={completeIdVerification} />;
  }

  // Global search filtering across entities
  const hasSearch = searchQuery.trim().length > 0;
  const searchResults = hasSearch ? {
    courses: courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())),
    issues: campusIssues.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())),
    events: events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.venue.toLowerCase().includes(searchQuery.toLowerCase())),
    books: libraryBooks.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.authors.toLowerCase().includes(searchQuery.toLowerCase())),
    market: marketplace.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
  } : null;

  const renderActiveView = () => {
    // RBAC Security Guard: Check if active tab is permitted for user's role
    if (!isTabAllowed(currentRole, activeTab)) {
      return (
        <div className="my-12 p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-rose-200 dark:border-rose-900 shadow-2xl text-center space-y-4 max-w-lg mx-auto animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-bold">
              <Lock className="w-3 h-3" /> RBAC Authorization Denied
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Your active session (<strong className="text-rose-600 dark:text-rose-400 capitalize">{currentRole.replace(/_/g, ' ').toLowerCase()}</strong>) is not authorized to access the requested portal module (<code>/{activeTab}</code>).
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5">
            <button
              onClick={() => setActiveTab(ROLE_DEFAULT_TAB[currentRole] || 'dashboard')}
              className="px-5 py-2.5 rounded-2xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs shadow-md shadow-campus-600/30 transition active:scale-95"
            >
              Return to Authorized Portal
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <StudentDashboard />;
      case 'academics': return <AcademicsView />;
      case 'issues': return <CampusIssuesView />;
      case 'events': return <EventsView />;
      case 'clubs': return <ClubsView />;
      case 'opportunities': return <OpportunitiesView />;
      case 'projects': return <ProjectsView />;
      case 'people': return <PeopleDirectoryView />;
      case 'marketplace': return <MarketplaceView />;
      case 'lostfound': return <LostFoundView />;
      case 'library': return <LibraryView />;
      case 'hostel': return <HostelView />;
      case 'ask_ai': return <AskCampusAIView />;
      case 'admin': return <AdminPortalView />;
      case 'println': return <PrintlnView />;
      case 'print_admin': return <PrintHubAdminView />;
      default: return <StudentDashboard />;
    }
  };

  const allNavMenuItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: 'Academics & Timetable', icon: BookOpen },
    { id: 'println', label: 'Println • Xerox Hub', icon: Printer },
    { id: 'issues', label: 'Campus Issues & Tickets', icon: Wrench },
    { id: 'events', label: 'Events & Digital Passes', icon: Calendar },
    { id: 'clubs', label: 'Clubs & Societies', icon: Users2 },
    { id: 'opportunities', label: 'Internships & Hackathons', icon: Briefcase },
    { id: 'projects', label: 'Project Team Finder', icon: FolderGit2 },
    { id: 'people', label: 'People & Mentors', icon: UserCheck },
    { id: 'marketplace', label: 'Campus Marketplace', icon: ShoppingBag },
    { id: 'lostfound', label: 'Lost & Found', icon: SearchCode },
    { id: 'library', label: 'Library Catalog', icon: Library },
    { id: 'hostel', label: 'Hostel & Mess Menu', icon: Building2 },
    { id: 'ask_ai', label: 'Ask Campus AI', icon: Sparkles },
    { id: 'print_admin', label: 'Print Hub Admin', icon: ClipboardCheck },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];

  const allowedNavMenuItems = allNavMenuItems.filter(item => isTabAllowed(currentRole, item.id as any));

  return (
    <div className="min-h-screen bg-mesh text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-5xl overflow-hidden">
          
          {/* Global Search Results Overlay */}
          {hasSearch && searchResults && (

            <div className="mb-6 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-campus-500/20 dark:border-campus-500/20 shadow-2xl shadow-campus-500/10 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-campus-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Global Campus Search Results for "{searchQuery}"
                  </h2>
                </div>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  Clear Results ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {searchResults.courses.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-campus-600 uppercase tracking-wider text-[10px]">Courses ({searchResults.courses.length})</span>
                    {searchResults.courses.map(c => (
                      <div key={c.id} onClick={() => { setActiveTab('academics'); setSearchQuery(''); }} className="cursor-pointer hover:underline font-semibold">
                        • {c.code}: {c.name} ({c.facultyName})
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.issues.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-red-500 uppercase tracking-wider text-[10px]">Tickets ({searchResults.issues.length})</span>
                    {searchResults.issues.map(i => (
                      <div key={i.id} onClick={() => { setActiveTab('issues'); setSearchQuery(''); }} className="cursor-pointer hover:underline font-semibold">
                        • #{i.id}: {i.title} [{i.status}]
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.events.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-purple-600 uppercase tracking-wider text-[10px]">Events ({searchResults.events.length})</span>
                    {searchResults.events.map(e => (
                      <div key={e.id} onClick={() => { setActiveTab('events'); setSearchQuery(''); }} className="cursor-pointer hover:underline font-semibold">
                        • {e.title} ({e.date})
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.books.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">Library Books ({searchResults.books.length})</span>
                    {searchResults.books.map(b => (
                      <div key={b.id} onClick={() => { setActiveTab('library'); setSearchQuery(''); }} className="cursor-pointer hover:underline font-semibold">
                        • {b.title} by {b.authors}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.market.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-teal-600 uppercase tracking-wider text-[10px]">Marketplace ({searchResults.market.length})</span>
                    {searchResults.market.map(m => (
                      <div key={m.id} onClick={() => { setActiveTab('marketplace'); setSearchQuery(''); }} className="cursor-pointer hover:underline font-semibold">
                        • {m.title} — ₹{m.price}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Core View Render */}
          <div key={activeTab} className="view-enter">
            {renderActiveView()}
          </div>

        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileNav onOpenAllMenu={() => setMobileMenuOpen(true)} />

      {/* Mobile Drawer Navigation Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-80 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">All Campus Services</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {allowedNavMenuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                        isActive 
                          ? 'bg-campus-600 text-white shadow-xs' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
              Campus OS V1 • One-College System
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
