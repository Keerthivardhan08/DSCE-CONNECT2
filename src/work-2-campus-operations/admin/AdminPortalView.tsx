import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Megaphone, 
  Flame, 
  Building2, 
  Briefcase,
  GraduationCap,
  Sparkles, 
  Layers,
  ChevronRight,
  PlusCircle,
  ExternalLink,
  Award,
  TrendingUp,
  X,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { CampusIssue, Opportunity } from '../../types';

export const AdminPortalView: React.FC = () => {
  const { 
    announcements, 
    broadcastAnnouncement, 
    campusIssues, 
    updateIssueStatus,
    opportunities,
    toggleSaveOpportunity,
    showToast 
  } = useApp();

  // Column view selector for responsive screens
  const [activeColumn, setActiveColumn] = useState<'ALL' | 'ADMIN_SLA' | 'ISSUES_SLA' | 'OPPORTUNITIES'>('ALL');

  // Executive Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'CRITICAL' | 'ACADEMIC' | 'HOSTEL' | 'EVENTS'>('CRITICAL');

  // Issue filter inside Column 2
  const [issueFilter, setIssueFilter] = useState<'ALL' | 'EMERGENCY' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  // Opportunities filter inside Column 3
  const [oppTypeFilter, setOppTypeFilter] = useState<string>('ALL');
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppOrg, setNewOppOrg] = useState('');
  const [newOppType, setNewOppType] = useState<Opportunity['type']>('INTERNSHIP');
  const [newOppStipend, setNewOppStipend] = useState('');
  const [newOppDeadline, setNewOppDeadline] = useState('');
  const [newOppCgpa, setNewOppCgpa] = useState('7.5');
  const [newOppSkills, setNewOppSkills] = useState('Python, Data Structures, Git');
  const [newOppDesc, setNewOppDesc] = useState('');

  // Local state for newly added opportunities
  const [localOpportunities, setLocalOpportunities] = useState<Opportunity[]>(opportunities);

  // Synchronize when context changes
  React.useEffect(() => {
    setLocalOpportunities(opportunities);
  }, [opportunities]);

  // SLA calculations
  const totalIssues = campusIssues.length;
  const resolvedIssues = useMemo(
    () => campusIssues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length,
    [campusIssues]
  );
  const slaComplianceRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 98;
  const emergencyIssuesCount = useMemo(
    () => campusIssues.filter(i => i.urgency === 'EMERGENCY' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length,
    [campusIssues]
  );

  const filteredIssues = useMemo(() => {
    return campusIssues.filter(i => {
      if (issueFilter === 'EMERGENCY') return i.urgency === 'EMERGENCY' && i.status !== 'RESOLVED';
      if (issueFilter === 'IN_PROGRESS') return i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED';
      if (issueFilter === 'RESOLVED') return i.status === 'RESOLVED' || i.status === 'CLOSED';
      return true;
    });
  }, [campusIssues, issueFilter]);

  const filteredOpportunities = useMemo(() => {
    if (oppTypeFilter === 'ALL') return localOpportunities;
    return localOpportunities.filter(o => o.type === oppTypeFilter);
  }, [localOpportunities, oppTypeFilter]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    broadcastAnnouncement(broadcastTitle, broadcastContent, broadcastCategory);
    showToast(`Executive circular "${broadcastTitle}" broadcasted successfully!`);
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  const handleAddOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppTitle.trim() || !newOppOrg.trim()) return;

    const newOpp: Opportunity = {
      id: `opp_${Date.now()}`,
      title: newOppTitle,
      organization: newOppOrg,
      type: newOppType,
      stipendOrPrize: newOppStipend || 'Competitive Package',
      departmentEligibility: ['CSE', 'ISE', 'Cyber Security', 'AIML'],
      minCgpa: parseFloat(newOppCgpa) || 7.0,
      deadline: newOppDeadline || 'Dec 30, 2026',
      skills: newOppSkills.split(',').map(s => s.trim()),
      description: newOppDesc || 'Executive Dean-approved opportunity for eligible DSCE students.',
      isSaved: false,
      applicationStatus: 'NOT_APPLIED'
    };

    setLocalOpportunities(prev => [newOpp, ...prev]);
    setShowAddOppModal(false);
    showToast(`Opportunity "${newOppTitle}" posted by Dean's Office!`);
    setNewOppTitle('');
    setNewOppOrg('');
    setNewOppDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Dean Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-bold text-indigo-200">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>OFFICE OF THE DEAN & REGISTRAR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Executive Governance & SLA Oversight
            </h1>
            <p className="text-xs text-indigo-200/80 max-w-xl">
              Dayananda Sagar College of Engineering — Executive SLA controls, campus operations SLA resolution, and corporate career opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400">{slaComplianceRate}%</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Campus SLA</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-rose-400">{emergencyIssuesCount}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Urgent Breaches</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-indigo-300">{localOpportunities.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Opportunities</div>
            </div>
          </div>
        </div>

        {/* View Switcher for smaller screens */}
        <div className="flex items-center gap-1.5 pt-4 mt-4 border-t border-white/10 text-xs font-bold xl:hidden overflow-x-auto">
          <span className="text-[10px] text-indigo-300 uppercase tracking-wider mr-2">Show Column:</span>
          {[
            { id: 'ALL', label: 'All 3 Columns' },
            { id: 'ADMIN_SLA', label: '1. Executive Admin & SLA' },
            { id: 'ISSUES_SLA', label: '2. Campus Issues & SLA' },
            { id: 'OPPORTUNITIES', label: '3. Opportunities' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveColumn(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeColumn === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 COLUMNS ONLY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* COLUMN 1: EXECUTIVE ADMIN & SLA */}
        {(activeColumn === 'ALL' || activeColumn === 'ADMIN_SLA') && (
          <div className="space-y-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
                  1
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Executive Admin & SLA
                  </h2>
                  <p className="text-[11px] text-slate-500">Governance policies & circular broadcast</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Dean Console
              </span>
            </div>

            {/* SLA Key Performance Indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-500" /> Avg SLA Turnaround
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">4.2 hrs</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Within 8hr campus quota</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" /> Resolution Target
                </span>
                <p className="text-xl font-black text-emerald-600 mt-1">96.4%</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Target: 95.0%</p>
              </div>
            </div>

            {/* Department SLA Matrix */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                Departmental SLA Health
              </span>

              <div className="space-y-2.5">
                {[
                  { dept: 'Electrical & Power Supply', health: 98, status: 'Optimal' },
                  { dept: 'Network & WiFi Infrastructure', health: 94, status: 'Good' },
                  { dept: 'Classroom & Lab Facilities', health: 96, status: 'Optimal' },
                  { dept: 'Water & Sanitation Services', health: 91, status: 'Monitoring' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.dept}</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.health}% SLA</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.health >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${item.health}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast Executive Circular */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-rose-600" />
                Broadcast Executive Circular
              </span>

              <form onSubmit={handleBroadcast} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Circular Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Official Notice: 3rd Internal Schedule..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Priority *</label>
                    <select
                      value={broadcastCategory}
                      onChange={(e) => setBroadcastCategory(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                    >
                      <option value="CRITICAL">🔴 Urgent / Critical</option>
                      <option value="ACADEMIC">📘 Academic</option>
                      <option value="EVENTS">🎉 Events / General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Target Audience</label>
                    <div className="text-xs p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold mt-1">
                      All Students & Faculty
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Official Notice Content *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter official circular content dispatched to student dashboard..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Executive Notice</span>
                </button>
              </form>
            </div>

            {/* Pinned Circulars list */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 shadow-xs flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Dispatched Circulars ({announcements.length})
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {announcements.slice(0, 4).map(item => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</span>
                      <span className="text-[9px] font-mono text-slate-400">{item.publishedAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COLUMN 2: CAMPUS ISSUES & SLA */}
        {(activeColumn === 'ALL' || activeColumn === 'ISSUES_SLA') && (
          <div className="space-y-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black">
                  2
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Campus Issues & SLA
                  </h2>
                  <p className="text-[11px] text-slate-500">Incident resolution tracking & SLA breaches</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                {campusIssues.length} Active Tickets
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
              {[
                { id: 'ALL', label: 'All Tickets' },
                { id: 'EMERGENCY', label: '🔥 Urgent' },
                { id: 'IN_PROGRESS', label: '⚡ In Progress' },
                { id: 'RESOLVED', label: '✓ Closed' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setIssueFilter(f.id as any)}
                  className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
                    issueFilter === f.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tickets list */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[800px] pr-1">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All tickets clear under this filter</p>
                  <p className="text-[10px] text-slate-400">Campus SLA compliance is well maintained.</p>
                </div>
              ) : (
                filteredIssues.map(issue => {
                  const isEmergency = issue.urgency === 'EMERGENCY';
                  const isResolved = issue.status === 'RESOLVED' || issue.status === 'CLOSED';

                  return (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-xs space-y-2.5 ${
                        isEmergency 
                          ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                              isEmergency 
                                ? 'bg-rose-500 text-white animate-pulse' 
                                : issue.urgency === 'HIGH'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {issue.urgency}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {issue.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{issue.id.slice(0, 6)}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                            {issue.title}
                          </h4>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isResolved 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : issue.status === 'IN_PROGRESS'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {issue.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {issue.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{issue.locationBuilding}{issue.locationRoom ? ` (${issue.locationRoom})` : ''}</span>
                        </span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          SLA: {isEmergency ? '4-Hr Emergency Window' : '24-Hr Standard Window'}
                        </span>
                      </div>

                      {/* Status Management Button */}
                      {!isResolved && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              updateIssueStatus(issue.id, 'IN_PROGRESS', 'Facility crew dispatched by Dean office');
                              showToast(`Ticket #${issue.id.slice(0, 6)} assigned to crew!`);
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold transition text-center"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => {
                              updateIssueStatus(issue.id, 'RESOLVED', 'Resolved under Dean SLA protocol');
                              showToast(`Ticket #${issue.id.slice(0, 6)} resolved!`);
                            }}
                            className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Close Ticket</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* COLUMN 3: OPPORTUNITIES */}
        {(activeColumn === 'ALL' || activeColumn === 'OPPORTUNITIES') && (
          <div className="space-y-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
                  3
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Opportunities
                  </h2>
                  <p className="text-[11px] text-slate-500">Corporate internships, grants & placements</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddOppModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Opportunity</span>
              </button>
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs overflow-x-auto">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'INTERNSHIP', label: 'Internships' },
                { id: 'HACKATHON', label: 'Hackathons' },
                { id: 'RESEARCH', label: 'Research' },
                { id: 'SCHOLARSHIP', label: 'Grants' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setOppTypeFilter(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                    oppTypeFilter === t.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Opportunities List */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[800px] pr-1">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No opportunities listed in this category</p>
                  <p className="text-[10px] text-slate-400">Click Post Opportunity to add a new campus drive.</p>
                </div>
              ) : (
                filteredOpportunities.map(opp => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs transition space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {opp.type}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {opp.organization}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1 group-hover:text-emerald-600 transition">
                          {opp.title}
                        </h4>
                      </div>

                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl shrink-0">
                        {opp.stipendOrPrize}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Eligibility & Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.minCgpa && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          Min CGPA: {opp.minCgpa}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold">
                        Deadline: {opp.deadline}
                      </span>
                      {opp.skills.slice(0, 3).map((skill, sIdx) => (
                        <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-400">Verified by Placement Cell</span>
                      <button
                        onClick={() => {
                          toggleSaveOpportunity(opp.id);
                          showToast('Opportunity bookmarked for students!');
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Bookmark Drive</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* POST OPPORTUNITY MODAL */}
      {showAddOppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Post Campus Opportunity</h3>
              </div>
              <button onClick={() => setShowAddOppModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOpportunity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Research Fellowship at IISc Bangalore"
                  value={newOppTitle}
                  onChange={(e) => setNewOppTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company / Institute *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India / DRDO"
                    value={newOppOrg}
                    onChange={(e) => setNewOppOrg(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Type *</label>
                  <select
                    value={newOppType}
                    onChange={(e) => setNewOppType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="HACKATHON">Hackathon / Contest</option>
                    <option value="RESEARCH">Research Project</option>
                    <option value="SCHOLARSHIP">Scholarship / Grant</option>
                    <option value="FELLOWSHIP">Fellowship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stipend / Prize Pool *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹45,000 / month or ₹2,00,000"
                    value={newOppStipend}
                    onChange={(e) => setNewOppStipend(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Min CGPA Required</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="7.5"
                    value={newOppCgpa}
                    onChange={(e) => setNewOppCgpa(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Application Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. Dec 28, 2026"
                  value={newOppDeadline}
                  onChange={(e) => setNewOppDeadline(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Python, C++, Machine Learning, Docker"
                  value={newOppSkills}
                  onChange={(e) => setNewOppSkills(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description & Application Link *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Eligibility details, interview rounds, and registration link..."
                  value={newOppDesc}
                  onChange={(e) => setNewOppDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOppModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30"
                >
                  Publish to Student Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
