import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users2, 
  CheckCircle2, 
  UserPlus, 
  Clock, 
  Sparkles, 
  Search, 
  Compass, 
  Trophy, 
  ShieldCheck,
  Calendar,
  Code2,
  FileText,
  Send,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  X,
  Award,
  ArrowRight
} from 'lucide-react';
import { ClubRecruitment, ClubEventItem, ClubHackathonItem, ClubApplication } from '../../types';

export const ClubsView: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    clubs, 
    clubRecruitments, 
    clubEvents, 
    clubHackathons, 
    clubApplications,
    toggleJoinClub, 
    addClubRecruitment,
    addClubEvent,
    addClubHackathon,
    submitClubApplication,
    updateClubApplicationStatus,
    showToast 
  } = useApp();

  const isClubLeader = currentRole === 'CLUB_LEADER';

  // Determine which club this leader administers
  const defaultAdminClub = currentUser.email.includes('aegis') ? 'AEGIS' :
    currentUser.email.includes('pointblank') ? 'POINTBLANK' :
    currentUser.email.includes('cpa') ? 'CPA' : 'AEGIS';

  const [activeTab, setActiveTab] = useState<'CLUBS' | 'RECRUITMENTS' | 'EVENTS' | 'HACKATHONS' | 'ADMIN'>(
    isClubLeader ? 'ADMIN' : 'CLUBS'
  );

  const [selectedClubForFilter, setSelectedClubForFilter] = useState<'ALL' | 'AEGIS' | 'POINTBLANK' | 'CPA'>('ALL');
  
  // Application Modal state
  const [applyingForRecruitment, setApplyingForRecruitment] = useState<ClubRecruitment | null>(null);
  const [applicationRole, setApplicationRole] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [experience, setExperience] = useState('');

  // Admin Form state
  const [adminClubName, setAdminClubName] = useState(defaultAdminClub);
  const [showNewRecruitModal, setShowNewRecruitModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showNewHackModal, setShowNewHackModal] = useState(false);

  // Form inputs
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecRoles, setNewRecRoles] = useState('');
  const [newRecDesc, setNewRecDesc] = useState('');
  const [newRecEligibility, setNewRecEligibility] = useState('');
  const [newRecDeadline, setNewRecDeadline] = useState('Dec 20, 2026');

  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDate, setNewEvtDate] = useState('');
  const [newEvtTime, setNewEvtTime] = useState('');
  const [newEvtVenue, setNewEvtVenue] = useState('');
  const [newEvtDesc, setNewEvtDesc] = useState('');

  const [newHackTitle, setNewHackTitle] = useState('');
  const [newHackDate, setNewHackDate] = useState('');
  const [newHackPrize, setNewHackPrize] = useState('');
  const [newHackProblems, setNewHackProblems] = useState('');

  const filteredRecruitments = clubRecruitments.filter(r => 
    selectedClubForFilter === 'ALL' || r.clubName.toUpperCase() === selectedClubForFilter
  );

  const filteredEvents = clubEvents.filter(e => 
    selectedClubForFilter === 'ALL' || e.clubName.toUpperCase() === selectedClubForFilter
  );

  const filteredHackathons = clubHackathons.filter(h => 
    selectedClubForFilter === 'ALL' || h.clubName.toUpperCase() === selectedClubForFilter
  );

  const displayClubs = clubs.filter(c => ['AEGIS', 'POINTBLANK', 'CPA'].includes(c.name?.trim().toUpperCase()));
  const renderedClubs = displayClubs.length > 0 ? displayClubs : clubs;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingForRecruitment || !applicationRole.trim()) {
      showToast('Please select a role to apply for.');
      return;
    }

    submitClubApplication({
      clubId: applyingForRecruitment.clubId,
      clubName: applyingForRecruitment.clubName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      rollNumber: currentUser.rollNumber,
      email: currentUser.email,
      department: currentUser.department,
      semester: currentUser.semester || 3,
      roleApplied: applicationRole,
      githubOrPortfolio: githubUrl,
      whyJoin,
      pastExperience: experience
    });

    setApplyingForRecruitment(null);
    setApplicationRole('');
    setGithubUrl('');
    setWhyJoin('');
    setExperience('');
  };

  const handleCreateRecruitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle.trim()) return;

    addClubRecruitment({
      clubId: `club_${adminClubName.toLowerCase()}`,
      clubName: adminClubName,
      title: newRecTitle,
      roles: newRecRoles.split(',').map(r => r.trim()).filter(Boolean),
      description: newRecDesc,
      eligibility: newRecEligibility || 'Open to all DSCE students',
      deadline: newRecDeadline,
      isOpen: true
    });

    setShowNewRecruitModal(false);
    setNewRecTitle('');
    setNewRecRoles('');
    setNewRecDesc('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvtTitle.trim()) return;

    addClubEvent({
      clubId: `club_${adminClubName.toLowerCase()}`,
      clubName: adminClubName,
      title: newEvtTitle,
      date: newEvtDate || 'Dec 10, 2026',
      time: newEvtTime || '02:00 PM - 04:30 PM',
      venue: newEvtVenue || 'Seminar Hall',
      description: newEvtDesc,
      type: 'WORKSHOP'
    });

    setShowNewEventModal(false);
    setNewEvtTitle('');
    setNewEvtDesc('');
  };

  const handleCreateHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHackTitle.trim()) return;

    addClubHackathon({
      clubId: `club_${adminClubName.toLowerCase()}`,
      clubName: adminClubName,
      title: newHackTitle,
      date: newHackDate || 'Jan 20, 2027',
      mode: 'OFFLINE',
      prizePool: newHackPrize || '₹50,000',
      registrationDeadline: 'Dec 30, 2026',
      problemStatements: newHackProblems || 'AI, Cybersecurity & Systems'
    });

    setShowNewHackModal(false);
    setNewHackTitle('');
    setNewHackPrize('');
    setNewHackProblems('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
              <Code2 className="h-3.5 w-3.5" /> Technical Communities & Chapters
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              AEGIS • POINTBLANK • CPA
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Explore official technical student chapters, participate in hackathons, register for workshops, and apply for core recruitment drives online.
            </p>
          </div>

          {isClubLeader && (
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/60 px-5 py-3 text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block">Logged In As</span>
              <p className="text-base font-black text-white">{adminClubName} Club Admin</p>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Subtabs & Club Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('CLUBS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CLUBS' 
                ? 'bg-campus-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Clubs Overview (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('RECRUITMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'RECRUITMENTS' 
                ? 'bg-campus-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Recruitments ({clubRecruitments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'EVENTS' 
                ? 'bg-campus-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events & Workshops ({clubEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('HACKATHONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'HACKATHONS' 
                ? 'bg-campus-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Hackathons ({clubHackathons.length})</span>
          </button>

          {isClubLeader && (
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ADMIN' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Club Admin Portal</span>
            </button>
          )}
        </div>

        {/* Filter by Specific Club */}
        {activeTab !== 'ADMIN' && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Filter:</span>
            {(['ALL', 'AEGIS', 'POINTBLANK', 'CPA'] as const).map(c => (
              <button
                key={c}
                onClick={() => setSelectedClubForFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedClubForFilter === c 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUBTAB 1: 3 CLUBS OVERVIEW */}
      {activeTab === 'CLUBS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderedClubs.map(club => {
            const clubRecruits = clubRecruitments.filter(r => r.clubId === club.id);
            const clubEvts = clubEvents.filter(e => e.clubId === club.id);
            const clubHacks = clubHackathons.filter(h => h.clubId === club.id);

            return (
              <div 
                key={club.id}
                className="p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      {club.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {club.membersCount} Members
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      {club.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Lead: {club.leadName}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {club.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="font-extrabold text-slate-900 dark:text-white block">{clubRecruits.length}</span>
                      <span className="text-[10px] text-slate-400">Recruitments</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="font-extrabold text-slate-900 dark:text-white block">{clubEvts.length}</span>
                      <span className="text-[10px] text-slate-400">Events</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="font-extrabold text-slate-900 dark:text-white block">{clubHacks.length}</span>
                      <span className="text-[10px] text-slate-400">Hackathons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  {club.recruitmentOpen && (
                    <button
                      onClick={() => {
                        const rec = clubRecruitments.find(r => r.clubId === club.id) || clubRecruitments[0];
                        setApplyingForRecruitment(rec);
                      }}
                      className="w-full py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-campus-600/20 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Apply for Recruitment</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleJoinClub(club.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      club.isJoined 
                        ? 'border border-emerald-300 dark:border-emerald-800 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {club.isJoined ? '✓ Joined Member' : '+ Follow Chapter'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: RECRUITMENTS ANNOUNCEMENTS */}
      {activeTab === 'RECRUITMENTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Active Recruitment Announcements</h3>
              <p className="text-xs text-slate-500">Official inductions open for students. Fill the application form online.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecruitments.map(rec => (
              <div 
                key={rec.id}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {rec.clubName}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {rec.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                    Open
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {rec.description}
                </p>

                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-[11px] text-slate-500">
                    <strong>Roles Available:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.roles.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2">
                    <strong>Eligibility:</strong> {rec.eligibility}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Deadline: <strong className="text-slate-700 dark:text-slate-300">{rec.deadline}</strong>
                  </span>

                  <button
                    onClick={() => setApplyingForRecruitment(rec)}
                    className="px-4 py-1.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                  >
                    <span>Apply Online</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: EVENTS & WORKSHOPS */}
      {activeTab === 'EVENTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredEvents.map(evt => (
              <div 
                key={evt.id}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {evt.clubName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{evt.type}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>📅 {evt.date} • {evt.time}</div>
                    <div>📍 {evt.venue}</div>
                  </div>

                  <button 
                    onClick={() => showToast(`Registered for ${evt.title}! Confirmation sent to student email.`)}
                    className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
                  >
                    Register for Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: HACKATHONS */}
      {activeTab === 'HACKATHONS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredHackathons.map(hack => (
              <div 
                key={hack.id}
                className="p-6 rounded-[2rem] border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950 shadow-md space-y-4"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                    {hack.clubName}
                  </span>
                  <span className="text-xs font-black text-amber-600">
                    🏆 {hack.prizePool}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {hack.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Mode: {hack.mode} • Date: {hack.date}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-500 block mb-1">Themes & Problem Statements:</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{hack.problemStatements}</p>
                </div>

                <button 
                  onClick={() => showToast(`Team registration link opened for ${hack.title}!`)}
                  className="w-full py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs shadow-md transition"
                >
                  Submit Team Entry
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: CLUB ADMIN DASHBOARD (FOR AEGIS, POINTBLANK & CPA LOGINS) */}
      {activeTab === 'ADMIN' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Admin Selector & Actions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">
                    Club Admin Management Portal
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Managing: <span className="text-campus-600">{adminClubName}</span>
                </h2>
                <p className="text-xs text-slate-500">Edit what is visible to students, post recruitments, and review applications.</p>
              </div>

              {/* Club Switcher for testing all 3 admins */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Switch Chapter:</span>
                {(['AEGIS', 'POINTBLANK', 'CPA'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setAdminClubName(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                      adminClubName === c 
                        ? 'bg-campus-600 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Publish Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowNewRecruitModal(true)}
                className="px-4 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Recruitment Drive</span>
              </button>

              <button
                onClick={() => setShowNewEventModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Event / Workshop</span>
              </button>

              <button
                onClick={() => setShowNewHackModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Hackathon</span>
              </button>
            </div>
          </div>

          {/* Submitted Student Applications Review Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Student Recruitment Applications ({clubApplications.filter(a => a.clubName.toUpperCase() === adminClubName).length})
                </h3>
                <p className="text-xs text-slate-500">Review candidates who applied online for {adminClubName} core team.</p>
              </div>
            </div>

            <div className="space-y-3">
              {clubApplications.filter(a => a.clubName.toUpperCase() === adminClubName).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No student applications received yet for {adminClubName}.
                </div>
              ) : (
                clubApplications
                  .filter(a => a.clubName.toUpperCase() === adminClubName)
                  .map(app => (
                    <div 
                      key={app.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{app.studentName}</h4>
                          <span className="font-mono text-xs text-slate-500 font-bold">{app.rollNumber}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            app.status === 'SHORTLISTED' ? 'bg-amber-100 text-amber-700' :
                            app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <p className="text-xs text-indigo-600 font-bold">
                          Role Applied: {app.roleApplied} • {app.department} (Sem {app.semester})
                        </p>

                        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                          <p><strong>Why Join:</strong> {app.whyJoin}</p>
                          {app.pastExperience && <p><strong>Past Experience:</strong> {app.pastExperience}</p>}
                          {app.githubOrPortfolio && (
                            <p className="flex items-center gap-1 text-campus-600">
                              <ExternalLink className="w-3 h-3" />
                              <a href={app.githubOrPortfolio} target="_blank" rel="noreferrer" className="underline truncate">
                                {app.githubOrPortfolio}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Buttons */}
                      <div className="flex md:flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => updateClubApplicationStatus(app.id, 'SHORTLISTED')}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition border border-amber-200"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => updateClubApplicationStatus(app.id, 'ACCEPTED')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateClubApplicationStatus(app.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Online Recruitment Application Modal */}
      {applyingForRecruitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form 
            onSubmit={handleApplySubmit}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-campus-600 tracking-wider">
                  Online Recruitment Application
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Join {applyingForRecruitment.clubName} Core Team
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setApplyingForRecruitment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Domain / Role Applied For: *
              </label>
              <select
                required
                value={applicationRole}
                onChange={e => setApplicationRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none focus:border-campus-500"
              >
                <option value="">-- Choose Role --</option>
                {applyingForRecruitment.roles.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GitHub / Portfolio / LinkedIn Link:
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs outline-none focus:border-campus-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Why do you want to join {applyingForRecruitment.clubName}? *
              </label>
              <textarea
                required
                rows={3}
                value={whyJoin}
                onChange={e => setWhyJoin(e.target.value)}
                placeholder="Share your motivation, passion for the domain, and what you aim to contribute..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs outline-none focus:border-campus-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Past Experience / Relevant Projects / Skills:
              </label>
              <textarea
                rows={2}
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="Mention any past projects, hackathons, tools, or programming languages..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs outline-none focus:border-campus-500"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs shadow-md transition"
              >
                Submit Application Online
              </button>
              <button
                type="button"
                onClick={() => setApplyingForRecruitment(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Recruitment Modal (Admin) */}
      {showNewRecruitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form 
            onSubmit={handleCreateRecruitment}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Post Recruitment Drive for {adminClubName}
              </h3>
              <button type="button" onClick={() => setShowNewRecruitModal(false)} className="text-slate-400">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Drive Title: *</label>
              <input
                required
                value={newRecTitle}
                onChange={e => setNewRecTitle(e.target.value)}
                placeholder="e.g. Winter Developer & CTF Induction 2026"
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Roles (comma-separated): *</label>
              <input
                required
                value={newRecRoles}
                onChange={e => setNewRecRoles(e.target.value)}
                placeholder="Frontend Dev, CTF Player, Security Analyst"
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Description: *</label>
              <textarea
                required
                rows={2}
                value={newRecDesc}
                onChange={e => setNewRecDesc(e.target.value)}
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Deadline Date:</label>
              <input
                value={newRecDeadline}
                onChange={e => setNewRecDeadline(e.target.value)}
                placeholder="Dec 20, 2026"
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-campus-600 text-white font-bold text-xs">
                Publish Recruitment Drive
              </button>
              <button type="button" onClick={() => setShowNewRecruitModal(false)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Event Modal (Admin) */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form 
            onSubmit={handleCreateEvent}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Publish Event / Workshop for {adminClubName}
              </h3>
              <button type="button" onClick={() => setShowNewEventModal(false)} className="text-slate-400">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Event Title: *</label>
              <input
                required
                value={newEvtTitle}
                onChange={e => setNewEvtTitle(e.target.value)}
                placeholder="e.g. Hands-on Docker & Kubernetes Workshop"
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold mb-1">Date:</label>
                <input
                  value={newEvtDate}
                  onChange={e => setNewEvtDate(e.target.value)}
                  placeholder="Dec 15, 2026"
                  className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Venue:</label>
                <input
                  value={newEvtVenue}
                  onChange={e => setNewEvtVenue(e.target.value)}
                  placeholder="CDS10 Systems Lab"
                  className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Description:</label>
              <textarea
                rows={2}
                value={newEvtDesc}
                onChange={e => setNewEvtDesc(e.target.value)}
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                Publish Event
              </button>
              <button type="button" onClick={() => setShowNewEventModal(false)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Hackathon Modal (Admin) */}
      {showNewHackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form 
            onSubmit={handleCreateHackathon}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Publish Hackathon for {adminClubName}
              </h3>
              <button type="button" onClick={() => setShowNewHackModal(false)} className="text-slate-400">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Hackathon Name: *</label>
              <input
                required
                value={newHackTitle}
                onChange={e => setNewHackTitle(e.target.value)}
                placeholder="e.g. CodeBlaze 2027"
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold mb-1">Dates:</label>
                <input
                  value={newHackDate}
                  onChange={e => setNewHackDate(e.target.value)}
                  placeholder="Jan 15 - 17, 2027"
                  className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Prize Pool:</label>
                <input
                  value={newHackPrize}
                  onChange={e => setNewHackPrize(e.target.value)}
                  placeholder="₹1,00,000"
                  className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Themes & Problem Statements:</label>
              <textarea
                rows={2}
                value={newHackProblems}
                onChange={e => setNewHackProblems(e.target.value)}
                placeholder="AI, Smart Cities, Cybersecurity, Distributed Systems"
                className="w-full rounded-xl border p-2 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                Publish Hackathon
              </button>
              <button type="button" onClick={() => setShowNewHackModal(false)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
