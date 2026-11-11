import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, InterestCommunity } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  GraduationCap, 
  Users, 
  Award, 
  X, 
  CheckCircle2, 
  User, 
  BookOpen, 
  Compass, 
  Briefcase, 
  Lock,
  Mail,
  Edit3,
  Sliders,
  Plus,
  Send,
  UserCheck,
  Building,
  Eye,
  EyeOff
} from 'lucide-react';

export const PeopleDirectoryView: React.FC = () => {
  const { 
    studentsDirectory, 
    currentUser, 
    updateProfile, 
    communities, 
    toggleJoinCommunity, 
    createCommunity, 
    connectionRequests, 
    sendConnectionRequest, 
    respondToConnectionRequest, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'COMMUNITIES' | 'REQUESTS'>('DIRECTORY');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'MENTORS'>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Edit Profile Modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editSkills, setEditSkills] = useState(currentUser.skills.join(', '));
  const [editInterests, setEditInterests] = useState((currentUser.interests || []).join(', '));
  const [editGoals, setEditGoals] = useState((currentUser.collaborationGoals || []).join(', '));
  const [editIsMentor, setEditIsMentor] = useState(currentUser.isMentor);
  const [editMentorTopics, setEditMentorTopics] = useState((currentUser.mentorTopics || []).join(', '));
  const [editShowEmail, setEditShowEmail] = useState(currentUser.privacySettings?.showEmail ?? false);
  const [editShowRoom, setEditShowRoom] = useState(currentUser.privacySettings?.showRoom ?? false);
  const [editIsDiscoverable, setEditIsDiscoverable] = useState(currentUser.privacySettings?.isDiscoverable ?? true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Connect / Mentor Request Modal
  const [targetStudentForRequest, setTargetStudentForRequest] = useState<UserProfile | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  // Create Community Modal
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false);
  const [commName, setCommName] = useState('');
  const [commCategory, setCommCategory] = useState<InterestCommunity['category']>('TECH');
  const [commDesc, setCommDesc] = useState('');

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = new Set<string>();
    studentsDirectory.forEach(s => {
      if (s.department) depts.add(s.department);
    });
    return Array.from(depts);
  }, [studentsDirectory]);

  // Filtered students with isDiscoverable enforcement
  const filteredStudents = useMemo(() => {
    return studentsDirectory.filter(person => {
      // Enforce isDiscoverable: hide student if isDiscoverable is false unless viewing self
      if (person.id !== currentUser.id && person.privacySettings && person.privacySettings.isDiscoverable === false) {
        return false;
      }
      if (filterMode === 'MENTORS' && !person.isMentor) {
        return false;
      }
      if (selectedDept !== 'ALL' && person.department !== selectedDept) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = person.name.toLowerCase().includes(q);
        const matchesDept = person.department.toLowerCase().includes(q);
        const matchesSkill = person.skills.some(sk => sk.toLowerCase().includes(q));
        const matchesInterest = person.interests?.some(it => it.toLowerCase().includes(q)) ?? false;
        const matchesTopic = person.mentorTopics?.some(mt => mt.toLowerCase().includes(q)) ?? false;
        return matchesName || matchesDept || matchesSkill || matchesInterest || matchesTopic;
      }
      return true;
    });
  }, [studentsDirectory, filterMode, selectedDept, searchQuery, currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const parsedSkills = editSkills.split(',').map(s => s.trim()).filter(Boolean);
    const parsedInterests = editInterests.split(',').map(s => s.trim()).filter(Boolean);
    const parsedGoals = editGoals.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTopics = editMentorTopics.split(',').map(s => s.trim()).filter(Boolean);

    await updateProfile({
      bio: editBio,
      skills: parsedSkills,
      interests: parsedInterests,
      collaborationGoals: parsedGoals,
      isMentor: editIsMentor,
      mentorTopics: parsedTopics,
      privacySettings: {
        showEmail: editShowEmail,
        showRoom: editShowRoom,
        isDiscoverable: editIsDiscoverable
      }
    });
    setIsSavingProfile(false);
    setShowEditProfileModal(false);
  };

  const handleSendConnection = async () => {
    if (!targetStudentForRequest) return;
    setIsSendingRequest(true);
    await sendConnectionRequest(
      targetStudentForRequest.id,
      targetStudentForRequest.isMentor ? 'MENTORSHIP' : 'COLLABORATION',
      requestNote.trim()
    );
    setIsSendingRequest(false);
    setTargetStudentForRequest(null);
    setRequestNote('');
  };

  const handleCreateCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commName.trim() || !commDesc.trim()) return;
    await createCommunity(commName.trim(), commCategory, commDesc.trim());
    setShowCreateCommunityModal(false);
    setCommName('');
    setCommDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 animate-gradient text-white p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-violet-100">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>VERIFIED CAMPUS IDENTITY & PEER NETWORK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              People, Communities & Mentorship
            </h1>
            <p className="text-xs sm:text-sm text-violet-100/90 max-w-2xl leading-relaxed">
              Connect with classmates, join domain-specific interest guilds, and request opt-in 1-on-1 mentorship with granular privacy controls.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditBio(currentUser.bio || '');
                setEditSkills(currentUser.skills.join(', '));
                setEditInterests((currentUser.interests || []).join(', '));
                setEditGoals((currentUser.collaborationGoals || []).join(', '));
                setEditIsMentor(currentUser.isMentor);
                setEditMentorTopics((currentUser.mentorTopics || []).join(', '));
                setEditShowEmail(currentUser.privacySettings?.showEmail ?? false);
                setEditShowRoom(currentUser.privacySettings?.showRoom ?? false);
                setEditIsDiscoverable(currentUser.privacySettings?.isDiscoverable ?? true);
                setShowEditProfileModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white text-violet-900 font-bold text-xs hover:bg-violet-50 transition shadow-lg flex items-center gap-1.5 shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile & Privacy</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'DIRECTORY' ? 'bg-white text-violet-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Directory & Mentors ({filteredStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('COMMUNITIES')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'COMMUNITIES' ? 'bg-white text-violet-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Interest Communities ({communities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'REQUESTS' ? 'bg-white text-violet-900 shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connection & Mentor Requests ({connectionRequests.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DIRECTORY & MENTORS */}
      {activeTab === 'DIRECTORY' && (
        <div className="space-y-6">
          
          {/* 'My Profile' Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl p-6 sm:p-7">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-violet-500 via-purple-500 to-indigo-600" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <UserAvatar name={currentUser.name} color={currentUser.avatarColor} size="xl" />
                  {currentUser.isVerified && (
                    <div 
                      className="absolute -bottom-1 -right-1 bg-violet-600 text-white rounded-full p-1 shadow-md"
                      title="Verified Student Identity"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-200/50">
                      MY PROFILE
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      USN: {currentUser.rollNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentUser.verificationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {currentUser.verificationStatus || 'APPROVED'}
                    </span>
                    {currentUser.isMentor && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1 border border-amber-300/40">
                        <Sparkles className="w-3 h-3" /> Senior Mentor
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentUser.department} • Semester {currentUser.semester} • Class of {currentUser.batchYear}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 pt-0.5 max-w-2xl">
                    {currentUser.bio}
                  </p>
                </div>
              </div>

              {/* Privacy summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privacy Rules Enforced</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div>Email: {currentUser.privacySettings?.showEmail ? 'Visible to Campus' : 'Hidden'}</div>
                  <div>Hostel Room: {currentUser.privacySettings?.showRoom ? 'Visible' : 'Hidden'}</div>
                  <div>Search Visibility: {currentUser.privacySettings?.isDiscoverable ? 'Discoverable' : 'Hidden from Directory'}</div>
                </div>
              </div>
            </div>

            {/* Skills pills */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap gap-1.5">
              {currentUser.skills.map(sk => (
                <span key={sk} className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search students by name, skill (React, C++, ROS...), or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 backdrop-blur-sm outline-none focus:border-violet-500 text-slate-800 dark:text-slate-100 transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFilterMode('ALL')}
                  className={`text-xs px-3 py-2 rounded-xl font-bold transition ${
                    filterMode === 'ALL'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white'
                  }`}
                >
                  All Students
                </button>
                <button
                  onClick={() => setFilterMode('MENTORS')}
                  className={`text-xs px-3 py-2 rounded-xl font-bold transition flex items-center gap-1 ${
                    filterMode === 'MENTORS'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white/50 dark:bg-slate-800/50 text-amber-700 dark:text-amber-300 hover:bg-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mentors Only</span>
                </button>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-semibold outline-none"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(person => {
              const isCurrentUser = person.id === currentUser.id;

              return (
                <div
                  key={person.id}
                  className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl hover:-translate-y-1 transition p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <UserAvatar name={person.name} color={person.avatarColor} size="lg" />
                        {person.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-violet-600 text-white rounded-full p-0.5 shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {person.isMentor ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1 border border-amber-300/40">
                            <Sparkles className="w-3 h-3 text-amber-500" /> MENTOR
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                            {person.rollNumber}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">Class of {person.batchYear}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{person.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{person.department}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {person.bio || 'Campus collaborator.'}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {person.skills.slice(0, 4).map(sk => (
                        <span key={sk} className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Mentoring Topics if Mentor */}
                    {person.isMentor && person.mentorTopics && person.mentorTopics.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                        <strong>Mentoring:</strong> {person.mentorTopics.join(' • ')}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      {person.privacySettings?.showEmail && person.email ? (
                        <span>{person.email}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600"><Lock className="w-3 h-3" /> Private</span>
                      )}
                    </span>

                    {!isCurrentUser && (
                      <button
                        onClick={() => {
                          setTargetStudentForRequest(person);
                          setRequestNote('');
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          person.isMentor
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{person.isMentor ? 'Request Mentorship' : 'Connect'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTEREST COMMUNITIES */}
      {activeTab === 'COMMUNITIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Campus Interest Guilds & Study Circles</h3>
              <p className="text-xs text-slate-500">Opt-in communities organized around research, competitive coding, robotics, and open source.</p>
            </div>
            <button
              onClick={() => setShowCreateCommunityModal(true)}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md hover:bg-violet-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Guild</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.map(comm => (
              <div 
                key={comm.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                      {comm.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {comm.name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {comm.memberCount} members
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comm.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Led by {comm.leaderName}</span>
                  <button
                    onClick={() => toggleJoinCommunity(comm.id)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
                      comm.isJoined
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                    }`}
                  >
                    {comm.isJoined ? 'Joined ✓ (Leave)' : 'Join Guild'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONNECTION & MENTORSHIP REQUESTS */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Collaboration & Mentor Inquiries</h3>
            <p className="text-xs text-slate-500">Incoming and outgoing requests for study partnerships and 1-on-1 career guidance.</p>
          </div>

          <div className="space-y-3">
            {connectionRequests.map(req => {
              const isTargetingMe = req.targetUserId === currentUser.id;

              return (
                <div 
                  key={req.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        req.type === 'MENTORSHIP' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                      }`}>
                        {req.type}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {isTargetingMe ? `${req.senderName} (${req.senderRoll})` : `To User ${req.targetUserId}`}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {req.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{req.note}"
                      </p>
                    )}
                  </div>

                  {isTargetingMe && req.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => respondToConnectionRequest(req.id, 'ACCEPTED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToConnectionRequest(req.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-rose-600 font-bold text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Profile & Privacy Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-violet-600" />
                  Edit Profile & Field-Level Privacy Controls
                </h3>
                <p className="text-xs text-slate-500">Changes persist permanently across sessions.</p>
              </div>
              <button onClick={() => setShowEditProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Personal Statement
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editInterests}
                    onChange={(e) => setEditInterests(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Collaboration Goals (comma separated)
                </label>
                <input
                  type="text"
                  value={editGoals}
                  onChange={(e) => setEditGoals(e.target.value)}
                  placeholder="e.g. Hackathon Teammate, Study Buddy, Research Collaborator"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Mentorship Settings */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Opt-in as Peer Senior Mentor</span>
                  <input
                    type="checkbox"
                    checked={editIsMentor}
                    onChange={(e) => setEditIsMentor(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                </div>
                {editIsMentor && (
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-800 dark:text-amber-200 mb-1">
                      Mentoring Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editMentorTopics}
                      onChange={(e) => setEditMentorTopics(e.target.value)}
                      placeholder="e.g. Resume Reviews, System Design, DSA Prep"
                      className="w-full text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Field-level privacy switches */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Field-Level Privacy Controls</span>
                
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold block text-slate-700 dark:text-slate-300">Show Email in Directory</span>
                    <span className="text-[10px] text-slate-400">If disabled, classmates contact you via in-app message without seeing your email.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editShowEmail}
                    onChange={(e) => setEditShowEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold block text-slate-700 dark:text-slate-300">Show Hostel Room Number</span>
                    <span className="text-[10px] text-slate-400">Keeps your physical hostel room address confidential.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editShowRoom}
                    onChange={(e) => setEditShowRoom(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold block text-slate-700 dark:text-slate-300">Discoverable in Directory Search</span>
                    <span className="text-[10px] text-slate-400">If disabled, you will be completely hidden from classmate searches.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsDiscoverable}
                    onChange={(e) => setEditIsDiscoverable(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect / Mentor Request Modal */}
      {targetStudentForRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {targetStudentForRequest.isMentor ? 'Request 1-on-1 Peer Mentorship' : 'Send Collaboration Invitation'}
            </h3>
            <p className="text-xs text-slate-500">
              Connecting with <strong>{targetStudentForRequest.name}</strong> ({targetStudentForRequest.department}).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Introductory Pitch / Purpose
              </label>
              <textarea
                rows={3}
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder="Briefly state what you'd like to work on together or questions you have..."
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTargetStudentForRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSendingRequest}
                onClick={handleSendConnection}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md hover:bg-violet-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateCommunityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Launch Interest Guild</h3>
            <form onSubmit={handleCreateCommunitySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Guild Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Reading Guild"
                  value={commName}
                  onChange={(e) => setCommName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Domain</label>
                <select
                  value={commCategory}
                  onChange={(e) => setCommCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                >
                  <option value="TECH">Technology & Systems</option>
                  <option value="OPEN_SOURCE">Open Source Builders</option>
                  <option value="COMPETITIVE_CODING">Competitive Coding & Algorithms</option>
                  <option value="ROBOTICS">Robotics & IoT</option>
                  <option value="DESIGN">Product & UI/UX Design</option>
                  <option value="CAREER">Career & Interview Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description & Meeting cadence</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Weekly reading papers, project sprints, or contest practice..."
                  value={commDesc}
                  onChange={(e) => setCommDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCommunityModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md hover:bg-violet-700"
                >
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
