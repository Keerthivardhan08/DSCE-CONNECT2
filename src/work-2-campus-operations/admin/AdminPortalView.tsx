import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Send, 
  Wrench, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Megaphone, 
  Archive, 
  Flame, 
  Building2, 
  MapPin, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  AlertOctagon, 
  Layers,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  FileText,
  History,
  Check,
  X,
  Eye,
  Flag,
  Utensils
} from 'lucide-react';
import { CampusIssue, OfficialAnnouncement, UserProfile } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';

export const AdminPortalView: React.FC = () => {
  const { 
    announcements, 
    broadcastAnnouncement, 
    campusIssues, 
    pendingVerifications, 
    verifyStudentId,
    itemReports,
    moderateItemReport,
    messReports,
    resolveMessReport,
    auditLogs,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ID_VERIFICATIONS' | 'MODERATION' | 'AUDIT_LOGS'>('OVERVIEW');

  // Broadcast state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'CRITICAL' | 'ACADEMIC' | 'HOSTEL' | 'EVENTS'>('CRITICAL');
  const [issueFilter, setIssueFilter] = useState<'ALL' | 'EMERGENCY' | 'ESCALATED' | 'IN_PROGRESS'>('ALL');

  // Preview ID Card Modal
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);

  // Stats calculation
  const totalIssues = campusIssues.length;
  const resolvedCount = useMemo(
    () => campusIssues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length,
    [campusIssues]
  );
  const inProgressCount = useMemo(
    () => campusIssues.filter(i => i.status === 'IN_PROGRESS').length,
    [campusIssues]
  );
  const activeAnnouncementsCount = announcements.length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 100;
  
  const emergencyCount = useMemo(
    () => campusIssues.filter(i => i.urgency === 'EMERGENCY' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length,
    [campusIssues]
  );

  const escalatedCount = useMemo(
    () => campusIssues.filter(i => (i.reopenCount > 0 || i.status === 'REOPENED') && i.status !== 'CLOSED').length,
    [campusIssues]
  );

  // Open issues (non-resolved)
  const openIssues = useMemo(() => {
    return campusIssues.filter(i => {
      const isNotResolved = i.status !== 'RESOLVED' && i.status !== 'CLOSED';
      if (!isNotResolved) return false;
      if (issueFilter === 'EMERGENCY') return i.urgency === 'EMERGENCY';
      if (issueFilter === 'ESCALATED') return i.status === 'REOPENED' || i.reopenCount > 0;
      if (issueFilter === 'IN_PROGRESS') return i.status === 'IN_PROGRESS';
      return true;
    });
  }, [campusIssues, issueFilter]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    broadcastAnnouncement(title, content, category);
    showToast(`Official ${category} broadcast sent to all student dashboards!`);
    setTitle('');
    setContent('');
  };

  const getCategoryTheme = (cat: 'CRITICAL' | 'ACADEMIC' | 'HOSTEL' | 'EVENTS') => {
    switch (cat) {
      case 'CRITICAL':
        return {
          pill: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          border: 'border-l-rose-500',
          dot: 'bg-rose-500'
        };
      case 'ACADEMIC':
        return {
          pill: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          border: 'border-l-blue-500',
          dot: 'bg-blue-500'
        };
      case 'HOSTEL':
        return {
          pill: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          border: 'border-l-amber-500',
          dot: 'bg-amber-500'
        };
      case 'EVENTS':
        return {
          pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          border: 'border-l-emerald-500',
          dot: 'bg-emerald-500'
        };
    }
  };

  const getUrgencyBadge = (urgency: CampusIssue['urgency']) => {
    switch (urgency) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-black bg-rose-500 text-white shadow-xs animate-pulse">
            <Flame className="w-3 h-3" /> EMERGENCY
          </span>
        );
      case 'HIGH':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500 text-white">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: CampusIssue['status']) => {
    switch (status) {
      case 'REPORTED':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40">
            REPORTED
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-300/40">
            ASSIGNED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300/40">
            IN PROGRESS
          </span>
        );
      case 'REOPENED':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300/40">
            REOPENED
          </span>
        );
      case 'RESOLVED':
      case 'CLOSED':
        return (
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 animate-gradient text-white p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-rose-100">
              <Lock className="w-3.5 h-3.5 text-rose-200" />
              <span>SUPER ADMIN & CAMPUS AUTHORITY CONSOLE</span>
            </div>

            <span className="text-xs text-rose-200/90 font-medium">
              Office of the Dean & Registrar
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Campus Admin & Governance Suite</span>
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 mt-1 max-w-2xl leading-relaxed">
              Verify student identity cards, review reported marketplace posts and mess food escalations, inspect immutable audit logs, and broadcast emergency circulars.
            </p>
          </div>

          {/* 4 Stat Pods */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-rose-200 text-xs font-semibold mb-0.5">
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>Pending IDs</span>
              </div>
              <div className="text-2xl font-black text-white">{pendingVerifications.length}</div>
              <div className="text-[10px] text-amber-200 font-bold">Awaiting Review</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-rose-200 text-xs font-semibold mb-0.5">
                <Flag className="w-4 h-4 text-rose-300" />
                <span>Flagged Items</span>
              </div>
              <div className="text-2xl font-black text-white">{itemReports.filter(r => r.status === 'PENDING').length}</div>
              <div className="text-[10px] text-rose-200/80">Moderation Queue</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-rose-200 text-xs font-semibold mb-0.5">
                <Utensils className="w-4 h-4 text-orange-300" />
                <span>Mess Issues</span>
              </div>
              <div className="text-2xl font-black text-white">{messReports.length}</div>
              <div className="text-[10px] text-rose-200/80">Chief Warden Feed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center hover:bg-white/15 transition group">
              <div className="flex items-center justify-center gap-1.5 text-emerald-200 text-xs font-semibold mb-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Resolution Rate</span>
              </div>
              <div className="text-2xl font-black text-white">{resolutionRate}%</div>
              <div className="text-[10px] text-emerald-200 font-bold">{resolvedCount} / {totalIssues} Closed</div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW' ? 'bg-white text-rose-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Broadcasts</span>
          </button>
          <button
            onClick={() => setActiveTab('ID_VERIFICATIONS')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'ID_VERIFICATIONS' ? 'bg-white text-rose-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student ID Approvals ({pendingVerifications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('MODERATION')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'MODERATION' ? 'bg-white text-rose-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Report Moderation ({itemReports.length + messReports.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'AUDIT_LOGS' ? 'bg-white text-rose-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>System Audit Logs ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & BROADCASTS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Broadcast Form (5 cols) */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Broadcast Campus Notice
                </h3>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mandatory Hall Ticket Biometric Scanning"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Notice Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                  >
                    <option value="CRITICAL">Critical Emergency (Immediate Alert)</option>
                    <option value="ACADEMIC">Academic / Examination Circular</option>
                    <option value="HOSTEL">Hostel & Mess Administration</option>
                    <option value="EVENTS">Campus Events & Fest Notices</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Content & Directives *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full instructions, deadlines, or safety protocols..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Broadcast Notice</span>
                </button>
              </form>
            </div>

            {/* Published Notices (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Broadcast Feed ({announcements.length} Published)
              </h3>
              <div className="space-y-3 max-h-[460px] overflow-y-auto">
                {announcements.map(ann => {
                  const theme = getCategoryTheme(ann.category);
                  return (
                    <div 
                      key={ann.id}
                      className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 border-l-4 ${theme.border}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${theme.pill}`}>
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{ann.publishedAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">Signed: {ann.source}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Infrastructure Maintenance SLA Monitor */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/40 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Campus Facilities & Maintenance Tickets SLA Queue
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">{openIssues.length} Active Tickets</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-2">Issue</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Urgency</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {openIssues.slice(0, 5).map(issue => (
                    <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{issue.title}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{issue.locationBuilding}</td>
                      <td className="py-2.5">{getUrgencyBadge(issue.urgency)}</td>
                      <td className="py-2.5">{getStatusBadge(issue.status)}</td>
                      <td className="py-2.5 text-slate-500">{issue.assignedTo || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT ID CARD APPROVAL QUEUE */}
      {activeTab === 'ID_VERIFICATIONS' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Institutional Identity Verification Queue</h3>
            <p className="text-xs text-slate-500">
              Review physical student ID cards submitted during account registration. Approving marks the account VERIFIED and grants access to library loans and campus amenities.
            </p>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">All Student ID Submissions Cleared!</h4>
              <p className="text-xs text-slate-500">Zero pending student verification cards in the approval queue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingVerifications.map(student => (
                <div 
                  key={student.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={student.name} color={student.avatarColor} size="lg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">{student.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                              PENDING
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">USN: {student.rollNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div><strong>Department:</strong> {student.department}</div>
                      <div><strong>Batch:</strong> Class of {student.batchYear} • Semester {student.semester}</div>
                      <div><strong>Official Email:</strong> {student.email}</div>
                    </div>

                    {/* Uploaded ID Card Preview */}
                    <div className="space-y-1 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Uploaded Student ID Card</span>
                      <div 
                        onClick={() => setInspectingUser(student)}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 cursor-pointer relative group"
                      >
                        <img 
                          src={student.idCardUrl || 'https://placehold.co/600x380/1e293b/ffffff.png?text=STUDENT+ID+CARD+-+' + encodeURIComponent(student.rollNumber)} 
                          alt="Student ID Preview" 
                          className="w-full h-44 object-contain bg-slate-900 group-hover:opacity-90 transition"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/60 transition">
                          <span className="text-xs text-white font-bold flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                            <Eye className="w-3.5 h-3.5" /> Click to Inspect Full ID
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => verifyStudentId(student.id, false, 'Invalid ID card or unreadable photo')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => verifyStudentId(student.id, true, `Verified identity against college master roll ${student.rollNumber}`)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Identity</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REPORT MODERATION QUEUE */}
      {activeTab === 'MODERATION' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Community & Dining Moderation Queue</h3>
            <p className="text-xs text-slate-500">Flagged marketplace/lost & found posts and escalated hostel mess food violations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Reports */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-rose-500" />
                <span>Flagged Item Posts ({itemReports.length})</span>
              </h4>

              {itemReports.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  Zero flagged listings.
                </p>
              ) : (
                itemReports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {rep.itemType} REPORT
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'ACTIONED' ? 'bg-emerald-100 text-emerald-700' :
                        rep.status === 'DISMISSED' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{rep.itemTitle}</h5>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Reason: {rep.reason}</p>
                    {rep.details && <p className="text-xs text-slate-500">Details: "{rep.details}"</p>}
                    <span className="text-[10px] text-slate-400 block">Reported by {rep.reporterName}</span>

                    {rep.status === 'PENDING' && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => moderateItemReport(rep.id, 'DISMISSED')}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                        >
                          Dismiss Flag
                        </button>
                        <button
                          onClick={() => moderateItemReport(rep.id, 'ACTIONED')}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                        >
                          Take Down Listing
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Mess Food Reports */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-500" />
                <span>Mess Food Quality Violations ({messReports.length})</span>
              </h4>

              {messReports.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  Zero escalated mess issues.
                </p>
              ) : (
                messReports.map(mfr => (
                  <div key={mfr.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {mfr.category.replace('_', ' ')} • {mfr.severity}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mfr.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {mfr.status}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{mfr.messBlock} ({mfr.mealType})</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300">"{mfr.description}"</p>
                    <span className="text-[10px] text-slate-400 block">Reported by student {mfr.studentName}</span>

                    {mfr.status !== 'RESOLVED' && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                          onClick={() => resolveMessReport(mfr.id, 'Chief Warden inspected dining counter and issued warning to caterer.')}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Mark Inspected & Resolved
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Institutional Audit Trail & Governance Logs</h3>
            <p className="text-xs text-slate-500">Immutable chronological record of administrative actions, identity verifications, and compliance events.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Action Type</th>
                  <th className="pb-3">Authority / Actor</th>
                  <th className="pb-3">Target Entity</th>
                  <th className="pb-3">Log Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-[11px] text-slate-400">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{log.actorName}</td>
                    <td className="py-3 font-mono text-slate-500">{log.targetEntity}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full ID Card Inspection Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Student ID Card Inspection</h3>
                <p className="text-xs text-slate-500">{inspectingUser.name} • USN: {inspectingUser.rollNumber}</p>
              </div>
              <button onClick={() => setInspectingUser(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950">
              <img 
                src={inspectingUser.idCardUrl || 'https://placehold.co/600x380/1e293b/ffffff.png?text=STUDENT+ID+CARD+-+' + encodeURIComponent(inspectingUser.rollNumber)}
                alt="Full ID Card Preview"
                className="w-full h-80 object-contain bg-slate-900"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-slate-500">
                Department: {inspectingUser.department} • Batch: {inspectingUser.batchYear}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    verifyStudentId(inspectingUser.id, false, 'Invalid ID card or unreadable photo');
                    setInspectingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Reject Card
                </button>
                <button
                  onClick={() => {
                    verifyStudentId(inspectingUser.id, true, `Verified identity against college master roll ${inspectingUser.rollNumber}`);
                    setInspectingUser(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Approve Student Identity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
