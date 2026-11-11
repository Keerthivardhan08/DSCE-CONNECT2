import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, COLLEGE_DEPARTMENTS } from '../../types';
import { DEMO_LOGIN_ACCOUNTS, DemoLoginAccount } from '../../data/mockData';
import { IdVerificationView } from './IdVerificationView';
import { 
  Shield, 
  GraduationCap, 
  Printer, 
  Wrench, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  User, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ChevronRight,
  School,
  XCircle,
  UserPlus,
  LogIn,
  Award,
  BookOpen
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, registerStudent } = useApp();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login states
  const [selectedAccountId, setSelectedAccountId] = useState<string>(DEMO_LOGIN_ACCOUNTS[0]?.id || 'demo_cyber_student');
  const [selectedRole, setSelectedRole] = useState<UserRole>(DEMO_LOGIN_ACCOUNTS[0]?.role || 'STUDENT');
  const [identifier, setIdentifier] = useState(DEMO_LOGIN_ACCOUNTS[0]?.credentials.identifier || '24CY042');
  const [password, setPassword] = useState(DEMO_LOGIN_ACCOUNTS[0]?.credentials.password || 'cyber123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register states
  const [regRollNumber, setRegRollNumber] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDept, setRegDept] = useState<string>(COLLEGE_DEPARTMENTS[0] || 'Computer Science & Engineering (Cyber Security)');
  const [regBatch, setRegBatch] = useState(2028);
  const [regSemester, setRegSemester] = useState(3);
  const [regHostel, setRegHostel] = useState('Hostel Block B');
  const [regRoom, setRegRoom] = useState('Room 204');

  const activeAccount = DEMO_LOGIN_ACCOUNTS.find(a => a.id === selectedAccountId) || DEMO_LOGIN_ACCOUNTS[0];

  const handleRoleTabChange = (acc: DemoLoginAccount) => {
    setSelectedAccountId(acc.id);
    setSelectedRole(acc.role);
    setIdentifier(acc.credentials.identifier);
    setPassword(acc.credentials.password);
    setErrorMessage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your University ID, Roll Number, or Official Email.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    const res = await login({
      identifier: identifier.trim(),
      password,
      role: selectedRole
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regRollNumber.trim() || !regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all mandatory fields (USN, Name, Email, Password).');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    const res = await registerStudent({
      rollNumber: regRollNumber.toUpperCase().trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      department: regDept,
      batchYear: Number(regBatch),
      semester: Number(regSemester),
      hostelBlock: regHostel,
      roomNumber: regRoom
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Account registration failed.');
    }
  };

  const handleQuickDemoLogin = async (acc: DemoLoginAccount) => {
    setLoading(true);
    setErrorMessage(null);
    const res = await login({
      identifier: acc.credentials.identifier,
      password: acc.credentials.password,
      role: acc.role
    });
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Quick login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col justify-between text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 lg:p-10">
      
      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-campus-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-campus-600/20">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">DSCE Connect</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-campus-100 text-campus-700 dark:bg-campus-950 dark:text-campus-300 border border-campus-300 dark:border-campus-800">
                RBAC Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dayananda Sagar College of Engineering</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Multi-Tenant Enterprise Isolation</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-6xl w-full mx-auto my-8 grid lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Role Selector & Feature Capabilities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-50 dark:bg-campus-950/60 border border-campus-200 dark:border-campus-800 text-campus-700 dark:text-campus-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              Role-Based Access Control System
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Sign in with your verified campus role.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              DSCE Connect provides isolated dashboards and permissions for students, Xerox operators, maintenance staff, and administration.
            </p>
          </div>

          {/* Role Portal Selection Tabs */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Select Stakeholder Portal:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {DEMO_LOGIN_ACCOUNTS.map(acc => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleRoleTabChange(acc)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-campus-500 ring-2 ring-campus-500/20 shadow-xl shadow-campus-500/10'
                        : 'bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        isSelected 
                          ? 'bg-campus-600 text-white shadow-md' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:scale-105'
                      } transition-transform`}>
                        {acc.role === 'STUDENT' && <GraduationCap className="w-5 h-5" />}
                        {acc.role === 'PRINT_ADMIN' && <Printer className="w-5 h-5" />}
                        {acc.role === 'FACILITY_STAFF' && <Wrench className="w-5 h-5" />}
                        {acc.role === 'CAMPUS_ADMIN' && <ShieldAlert className="w-5 h-5" />}
                        {acc.role === 'CLASS_REP' && <School className="w-5 h-5" />}
                        {acc.role === 'FACULTY' && <BookOpen className="w-5 h-5" />}
                        {acc.role === 'CLUB_LEADER' && <Award className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {acc.title}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-campus-600 animate-ping" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                          {acc.badge}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-campus-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card & Capabilities (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  authMode === 'LOGIN'
                    ? 'bg-white dark:bg-slate-900 text-campus-600 dark:text-campus-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Account</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('REGISTER'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  authMode === 'REGISTER'
                    ? 'bg-white dark:bg-slate-900 text-campus-600 dark:text-campus-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Student Account (USN)</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1 font-semibold">{errorMessage}</div>
              </div>
            )}

            {authMode === 'LOGIN' ? (
              <>
                {/* Active Portal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${activeAccount.badgeColor}`}>
                        {activeAccount.badge}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      Sign in as {activeAccount.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeAccount.description}
                    </p>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {selectedRole === 'STUDENT' ? 'Student Roll Number or College Email' : 
                       selectedRole === 'PRINT_ADMIN' ? 'Print Hub Operator ID or Email' : 
                       selectedRole === 'FACILITY_STAFF' ? 'Staff Technician ID or Official Email' : 
                       'Administrative ID or Official Email'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={activeAccount.credentials.identifier}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 dark:focus:border-campus-400 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Secret Password / Access PIN
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Default: <code className="font-mono text-campus-600 dark:text-campus-400 font-bold">{activeAccount.credentials.password}</code>
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 dark:focus:border-campus-400 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-campus-600 to-indigo-600 hover:from-campus-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-campus-600/25 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to {activeAccount.badge}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* 1-Click Instant Demo Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(activeAccount)}
                      disabled={loading}
                      className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>1-Click Demo Login</span>
                    </button>
                  </div>
                </form>

                {/* Role Capabilities Breakdown Card */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Access Permissions for {activeAccount.title}:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Allowed */}
                    <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorized Modules</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {activeAccount.allowedFeatures.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Restricted */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Restricted Views</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-400 dark:text-slate-500">
                        {activeAccount.restrictedFeatures.slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Verified Student Account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enter your university roll number (USN) to initiate onboarding.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Student USN / Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24CS119"
                      value={regRollNumber}
                      onChange={(e) => setRegRollNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akash Verma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@campus.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Set Secure Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Department *
                    </label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none truncate"
                    >
                      {COLLEGE_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      value={regBatch}
                      onChange={(e) => setRegBatch(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Semester
                    </label>
                    <select
                      value={regSemester}
                      onChange={(e) => setRegSemester(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    >
                      {[1,2,3,4,5,6,7,8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hostel Block (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hostel Block B"
                      value={regHostel}
                      onChange={(e) => setRegHostel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Room Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room 204"
                      value={regRoom}
                      onChange={(e) => setRegRoom(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-campus-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-campus-600 to-indigo-600 hover:from-campus-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-campus-600/25 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue to Step 2: Upload Student ID Card</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Footer System Disclaimer */}
      <div className="max-w-6xl w-full mx-auto text-center text-slate-400 text-[11px] py-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>DSCE Connect 2.0 • Dayananda Sagar College of Engineering</span>
        <span>Default Student: <code className="font-mono text-campus-600 dark:text-campus-400">22CS084</code> / <code className="font-mono text-campus-600 dark:text-campus-400">student123</code></span>
      </div>

    </div>
  );
};
