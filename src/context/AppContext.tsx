import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  AuthCredentials,
  AuthSession,
  Course, 
  Assignment, 
  AssignmentSubmission,
  CampusIssue, 
  EventItem, 
  Club, 
  ClubRecruitment,
  ClubEventItem,
  ClubHackathonItem,
  ClubApplication,
  Opportunity, 
  ProjectListing, 
  MarketplaceItem, 
  LostAndFoundItem, 
  LibraryBook, 
  PrintOrder,
  PrintRates,
  PrintOrderStatus,
  OfficialAnnouncement, 
  CampusKnowledgeChunk,
  IssueStatus,
  IssueCategory,
  IssueUrgency,
  ConnectionRequest,
  InterestCommunity,
  ProjectShowcase,
  DirectMessage,
  ItemReport,
  MessFoodReport,
  ExamTimetableItem,
  AcademicCalendarItem,
  AuditLog
} from '../types';
import { 
  initialCurrentUser, 
  initialCourses, 
  initialAssignments, 
  initialCampusIssues, 
  initialEvents, 
  initialClubs, 
  initialClubRecruitments,
  initialClubEvents,
  initialClubHackathons,
  initialClubApplications,
  initialOpportunities, 
  initialProjects, 
  initialMarketplace, 
  initialLostAndFound, 
  initialLibraryBooks, 
  initialAnnouncements,
  campusKnowledgeBase,
  mockDirectoryStudents,
  DEMO_LOGIN_ACCOUNTS,
  initialExamTimetable,
  initialAcademicCalendar,
  initialCommunities,
  initialProjectShowcases,
  initialDirectMessages,
  initialConnectionRequests,
  initialItemReports,
  initialMessReports,
  initialAuditLogs,
  CYBER_SECURITY_SEM3_COURSES,
  CYBER_SECURITY_SEM3_ASSIGNMENTS,
  CYBER_SECURITY_SEM3_EXAM_TIMETABLE,
  isCyberSecuritySem3
} from '../data/mockData';
import { getPrintAmount, initialPrintRates } from '../data/printPricing';
import { ActiveNavTab, ROLE_DEFAULT_TAB, isTabAllowed } from '../utils/rbac';

export type { ActiveNavTab };

export interface AIAnswerResult {
  answer: string;
  sourceDocument: string;
  sourceSection: string;
  pageNumber: number;
  confidence: number;
}

interface AppContextType {
  // Authentication & RBAC
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isPendingIdVerification: boolean;
  setIsPendingIdVerification: (pending: boolean) => void;
  completeIdVerification: () => void;
  registerStudent: (data: {
    rollNumber: string;
    name: string;
    email: string;
    password: string;
    department: string;
    batchYear: number;
    semester: number;
    hostelBlock?: string;
    roomNumber?: string;
  }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  uploadIdCard: (userId: string, idCardUrl: string) => Promise<{ success: boolean; error?: string }>;
  verifyStudentId: (userId: string, approved: boolean, note?: string) => Promise<{ success: boolean; error?: string }>;
  pendingVerifications: UserProfile[];

  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  
  // Academics
  courses: Course[];
  assignments: Assignment[];
  examTimetable: ExamTimetableItem[];
  academicCalendar: AcademicCalendarItem[];
  updateCourseAttendance: (courseId: string, attended: number, total: number) => void;
  submitAssignment: (assignmentId: string, notes: string) => Promise<{ success: boolean; error?: string }>;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  deleteAssignment: (assignmentId: string) => void;
  deleteAllMockAssignments: () => void;
  submitAssignmentWork: (assignmentId: string, data: { textContent?: string; fileName?: string; fileUrl?: string }) => Promise<{ success: boolean }>;
  gradeAssignmentSubmission: (assignmentId: string, studentId: string, marks: number, feedback?: string) => void;
  updateCourseSyllabus: (courseId: string, syllabus: { content?: string; type: 'PDF' | 'IMAGE' | 'TEXT'; fileName?: string; url?: string }) => void;
  
  // Issues
  campusIssues: CampusIssue[];
  reportIssue: (data: {
    title: string;
    description: string;
    category: IssueCategory;
    locationBuilding: string;
    locationRoom?: string;
    urgency: IssueUrgency;
  }) => void;
  updateIssueStatus: (issueId: string, status: IssueStatus, staffNotes?: string) => void;
  reopenIssue: (issueId: string, reason: string) => void;

  // Events
  events: EventItem[];
  registerForEvent: (eventId: string) => void;
  cancelEventRegistration: (eventId: string) => void;
  toggleEventBookmark: (eventId: string) => void;

  // Clubs
  clubs: Club[];
  clubRecruitments: ClubRecruitment[];
  clubEvents: ClubEventItem[];
  clubHackathons: ClubHackathonItem[];
  clubApplications: ClubApplication[];
  toggleJoinClub: (clubId: string) => void;
  addClubRecruitment: (data: Omit<ClubRecruitment, 'id' | 'postedAt'>) => void;
  addClubEvent: (data: Omit<ClubEventItem, 'id'>) => void;
  addClubHackathon: (data: Omit<ClubHackathonItem, 'id'>) => void;
  submitClubApplication: (data: Omit<ClubApplication, 'id' | 'status' | 'submittedAt'>) => void;
  updateClubApplicationStatus: (appId: string, status: 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => void;

  // Opportunities
  opportunities: Opportunity[];
  toggleSaveOpportunity: (oppId: string) => void;

  // Projects
  projects: ProjectListing[];
  projectShowcases: ProjectShowcase[];
  createProject: (title: string, description: string, skills: string[], openSlots: number, stage: 'IDEA' | 'PROTOTYPING' | 'HACKATHON') => void;
  applyToProject: (projectId: string, pitch: string) => void;
  reviewProjectApplicant: (projectId: string, applicantUserId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  addProjectTask: (projectId: string, title: string, assignee: string) => Promise<void>;
  toggleProjectTask: (projectId: string, taskId: string) => Promise<void>;
  submitProjectShowcase: (showcase: Omit<ProjectShowcase, 'id' | 'stars' | 'submittedAt'>) => Promise<void>;

  // Communities & Mentorship
  communities: InterestCommunity[];
  toggleJoinCommunity: (communityId: string) => Promise<void>;
  createCommunity: (name: string, category: InterestCommunity['category'], description: string) => Promise<void>;
  connectionRequests: ConnectionRequest[];
  sendConnectionRequest: (targetUserId: string, type: 'COLLABORATION' | 'MENTORSHIP', note?: string) => Promise<{ success: boolean; error?: string }>;
  respondToConnectionRequest: (requestId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<{ success: boolean }>;

  // Marketplace & Lost/Found
  marketplace: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'sellerId' | 'sellerName' | 'sellerRoll' | 'createdAt' | 'status'>) => void;
  markMarketplaceItemSold: (itemId: string) => void;
  lostAndFound: LostAndFoundItem[];
  addLostFoundItem: (item: Omit<LostAndFoundItem, 'id' | 'posterId' | 'posterName' | 'status'>) => void;
  verifyLostFoundClaim: (itemId: string, claimantAnswer: string) => { success: boolean; message: string };
  directMessages: DirectMessage[];
  sendMessage: (receiverId: string, content: string, itemContext?: string) => Promise<void>;
  itemReports: ItemReport[];
  reportItem: (itemId: string, itemTitle: string, itemType: 'MARKETPLACE' | 'LOST_FOUND', reason: string, details?: string) => Promise<void>;
  moderateItemReport: (reportId: string, status: 'ACTIONED' | 'DISMISSED') => Promise<void>;

  // Mess & Hostel
  messReports: MessFoodReport[];
  submitMessReport: (data: Omit<MessFoodReport, 'id' | 'studentId' | 'studentName' | 'status' | 'createdAt'>) => Promise<void>;
  resolveMessReport: (reportId: string, resolutionNotes?: string) => Promise<void>;

  // Admin & Audit
  auditLogs: AuditLog[];

  // Library
  libraryBooks: LibraryBook[];
  borrowBook: (bookId: string) => void;
  returnBook: (bookId: string) => void;

  // Println / Print Hub
  printOrders: PrintOrder[];
  printRates: PrintRates;
  placePrintOrder: (data: Omit<PrintOrder, 'id' | 'studentId' | 'studentName' | 'studentRoll' | 'totalAmount' | 'status' | 'paymentStatus' | 'notificationRead' | 'createdAt'>) => void;
  updatePrintOrderStatus: (orderId: string, status: PrintOrderStatus, shopNote?: string) => void;
  updatePrintRates: (rates: PrintRates) => void;
  markPrintNotificationRead: (orderId: string) => void;
  cancelPrintOrder: (orderId: string) => { success: boolean; message: string };

  // Announcements
  announcements: OfficialAnnouncement[];
  markAnnouncementAsRead: (id: string) => void;
  broadcastAnnouncement: (title: string, content: string, category: 'CRITICAL' | 'ACADEMIC' | 'HOSTEL' | 'EVENTS') => void;

  // People Directory
  studentsDirectory: UserProfile[];

  // Ask Campus AI (RAG grounded)
  askCampusAI: (query: string) => AIAnswerResult;

  // Search & Global state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isBackendConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('campus_auth_session'));
  });

  const [isPendingIdVerification, setIsPendingIdVerification] = useState<boolean>(() => {
    return localStorage.getItem('campus_pending_verification') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const session = localStorage.getItem('campus_auth_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.user) return parsed.user;
      } catch {}
    }
    const saved = localStorage.getItem('campus_user');
    return saved ? JSON.parse(saved) : initialCurrentUser;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = localStorage.getItem('campus_auth_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.user?.role) return parsed.user.role;
      } catch {}
    }
    return (localStorage.getItem('campus_role') as UserRole) || 'STUDENT';
  });

  const [activeTab, setActiveTab] = useState<ActiveNavTab>(() => {
    const session = localStorage.getItem('campus_auth_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.user?.role) return ROLE_DEFAULT_TAB[parsed.user.role as UserRole] || 'dashboard';
      } catch {}
    }
    return 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [courses, setCourses] = useState<Course[]>(() => {
    if (isCyberSecuritySem3(currentUser)) {
      return CYBER_SECURITY_SEM3_COURSES;
    }
    const saved = localStorage.getItem('campus_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    if (isCyberSecuritySem3(currentUser)) {
      return CYBER_SECURITY_SEM3_ASSIGNMENTS;
    }
    const saved = localStorage.getItem('campus_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [campusIssues, setCampusIssues] = useState<CampusIssue[]>(() => {
    const saved = localStorage.getItem('campus_issues');
    return saved ? JSON.parse(saved) : initialCampusIssues;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('campus_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem('campus_clubs');
    return saved ? JSON.parse(saved) : initialClubs;
  });

  const [clubRecruitments, setClubRecruitments] = useState<ClubRecruitment[]>(() => {
    const saved = localStorage.getItem('campus_club_recruitments');
    return saved ? JSON.parse(saved) : initialClubRecruitments;
  });

  const [clubEvents, setClubEvents] = useState<ClubEventItem[]>(() => {
    const saved = localStorage.getItem('campus_club_events');
    return saved ? JSON.parse(saved) : initialClubEvents;
  });

  const [clubHackathons, setClubHackathons] = useState<ClubHackathonItem[]>(() => {
    const saved = localStorage.getItem('campus_club_hackathons');
    return saved ? JSON.parse(saved) : initialClubHackathons;
  });

  const [clubApplications, setClubApplications] = useState<ClubApplication[]>(() => {
    const saved = localStorage.getItem('campus_club_applications');
    return saved ? JSON.parse(saved) : initialClubApplications;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('campus_opportunities');
    return saved ? JSON.parse(saved) : initialOpportunities;
  });

  const [projects, setProjects] = useState<ProjectListing[]>(() => {
    const saved = localStorage.getItem('campus_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('campus_marketplace');
    return saved ? JSON.parse(saved) : initialMarketplace;
  });

  const [lostAndFound, setLostAndFound] = useState<LostAndFoundItem[]>(() => {
    const saved = localStorage.getItem('campus_lostfound');
    return saved ? JSON.parse(saved) : initialLostAndFound;
  });

  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(() => {
    const saved = localStorage.getItem('campus_library');
    return saved ? JSON.parse(saved) : initialLibraryBooks;
  });

  const [announcements, setAnnouncements] = useState<OfficialAnnouncement[]>(() => {
    const saved = localStorage.getItem('campus_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [printOrders, setPrintOrders] = useState<PrintOrder[]>(() => {
    const saved = localStorage.getItem('campus_print_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [printRates, setPrintRates] = useState<PrintRates>(() => {
    const saved = localStorage.getItem('campus_print_rates');
    return saved ? JSON.parse(saved) : initialPrintRates;
  });

  const [studentsDirectory, setStudentsDirectory] = useState<UserProfile[]>(mockDirectoryStudents);

  const [examTimetable, setExamTimetable] = useState<ExamTimetableItem[]>(() => {
    if (isCyberSecuritySem3(currentUser)) {
      return CYBER_SECURITY_SEM3_EXAM_TIMETABLE;
    }
    const saved = localStorage.getItem('campus_exam_timetable');
    return saved ? JSON.parse(saved) : initialExamTimetable;
  });

  const [academicCalendar, setAcademicCalendar] = useState<AcademicCalendarItem[]>(() => {
    const saved = localStorage.getItem('campus_academic_calendar');
    return saved ? JSON.parse(saved) : initialAcademicCalendar;
  });

  const [communities, setCommunities] = useState<InterestCommunity[]>(() => {
    const saved = localStorage.getItem('campus_communities');
    return saved ? JSON.parse(saved) : initialCommunities;
  });

  const [projectShowcases, setProjectShowcases] = useState<ProjectShowcase[]>(() => {
    const saved = localStorage.getItem('campus_project_showcases');
    return saved ? JSON.parse(saved) : initialProjectShowcases;
  });

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('campus_direct_messages');
    return saved ? JSON.parse(saved) : initialDirectMessages;
  });

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('campus_connection_requests');
    return saved ? JSON.parse(saved) : initialConnectionRequests;
  });

  const [itemReports, setItemReports] = useState<ItemReport[]>(() => {
    const saved = localStorage.getItem('campus_item_reports');
    return saved ? JSON.parse(saved) : initialItemReports;
  });

  const [messReports, setMessReports] = useState<MessFoodReport[]>(() => {
    const saved = localStorage.getItem('campus_mess_reports');
    return saved ? JSON.parse(saved) : initialMessReports;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('campus_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [pendingVerifications, setPendingVerifications] = useState<UserProfile[]>(() => {
    return mockDirectoryStudents.filter(u => u.verificationStatus === 'PENDING_VERIFICATION');
  });

  // Sync with real backend if accessible
  useEffect(() => {
    const session = localStorage.getItem('campus_auth_session');
    let activeUserId = '';
    if (session) {
      try {
        const parsed = JSON.parse(session);
        activeUserId = parsed?.user?.id || '';
      } catch {}
    }

    const url = activeUserId ? `/api/initial-state?userId=${encodeURIComponent(activeUserId)}` : '/api/initial-state';
    const headers: Record<string, string> = activeUserId ? { 'x-user-id': activeUserId } : {};

    fetch(url, { headers })
      .then(res => res.json())
      .then(data => {
        if (data && data.courses) {
          setIsBackendConnected(true);
          if (!isCyberSecuritySem3(currentUser)) {
            setCourses(data.courses);
            setAssignments(data.assignments);
          }
          setCampusIssues(data.campusIssues);
          setEvents(data.events);
          setClubs(data.clubs);
          setOpportunities(data.opportunities);
          setProjects(data.projects);
          setMarketplace(data.marketplace);
          setLostAndFound(data.lostAndFound);
          setLibraryBooks(data.libraryBooks);
          setAnnouncements(data.announcements);
          if (data.printOrders) setPrintOrders(data.printOrders);
          if (data.printRates) setPrintRates(data.printRates);
          if (data.studentsDirectory) setStudentsDirectory(data.studentsDirectory);
          // Only update currentUser if it matches the active authenticated user ID
          if (data.currentUser && activeUserId && data.currentUser.id === activeUserId) {
            setCurrentUser(data.currentUser);
          }
          if (data.examTimetable) setExamTimetable(data.examTimetable);
          if (data.academicCalendar) setAcademicCalendar(data.academicCalendar);
          if (data.communities) setCommunities(data.communities);
          if (data.projectShowcases) setProjectShowcases(data.projectShowcases);
          if (data.directMessages) setDirectMessages(data.directMessages);
          if (data.connectionRequests) setConnectionRequests(data.connectionRequests);
          if (data.itemReports) setItemReports(data.itemReports);
          if (data.messReports) setMessReports(data.messReports);
          if (data.auditLogs) setAuditLogs(data.auditLogs);
        }
      })
      .catch(() => {
        // Fallback to local storage if running in standalone static preview
        setIsBackendConnected(false);
      });

    fetch('/api/admin/pending-verifications')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (Array.isArray(data)) {
            setPendingVerifications(data);
          } else if (data.pendingUsers && Array.isArray(data.pendingUsers)) {
            setPendingVerifications(data.pendingUsers);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('campus_user', JSON.stringify(currentUser));
    if (isCyberSecuritySem3(currentUser)) {
      setCourses(CYBER_SECURITY_SEM3_COURSES);
      setAssignments(CYBER_SECURITY_SEM3_ASSIGNMENTS);
      setExamTimetable(CYBER_SECURITY_SEM3_EXAM_TIMETABLE);
      localStorage.setItem('campus_courses', JSON.stringify(CYBER_SECURITY_SEM3_COURSES));
      localStorage.setItem('campus_assignments', JSON.stringify(CYBER_SECURITY_SEM3_ASSIGNMENTS));
      localStorage.setItem('campus_exam_timetable', JSON.stringify(CYBER_SECURITY_SEM3_EXAM_TIMETABLE));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('campus_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('campus_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('campus_issues', JSON.stringify(campusIssues));
  }, [campusIssues]);

  useEffect(() => {
    localStorage.setItem('campus_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('campus_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('campus_marketplace', JSON.stringify(marketplace));
  }, [marketplace]);

  useEffect(() => {
    localStorage.setItem('campus_lostfound', JSON.stringify(lostAndFound));
  }, [lostAndFound]);

  useEffect(() => {
    localStorage.setItem('campus_library', JSON.stringify(libraryBooks));
  }, [libraryBooks]);

  useEffect(() => {
    localStorage.setItem('campus_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('campus_print_orders', JSON.stringify(printOrders));
  }, [printOrders]);

  useEffect(() => {
    localStorage.setItem('campus_print_rates', JSON.stringify(printRates));
  }, [printRates]);

  useEffect(() => {
    localStorage.setItem('campus_exam_timetable', JSON.stringify(examTimetable));
  }, [examTimetable]);

  useEffect(() => {
    localStorage.setItem('campus_academic_calendar', JSON.stringify(academicCalendar));
  }, [academicCalendar]);

  useEffect(() => {
    localStorage.setItem('campus_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('campus_project_showcases', JSON.stringify(projectShowcases));
  }, [projectShowcases]);

  useEffect(() => {
    localStorage.setItem('campus_direct_messages', JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    localStorage.setItem('campus_connection_requests', JSON.stringify(connectionRequests));
  }, [connectionRequests]);

  useEffect(() => {
    localStorage.setItem('campus_item_reports', JSON.stringify(itemReports));
  }, [itemReports]);

  useEffect(() => {
    localStorage.setItem('campus_mess_reports', JSON.stringify(messReports));
  }, [messReports]);

  useEffect(() => {
    localStorage.setItem('campus_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const login = async (creds: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      let loggedUser: UserProfile | null = null;
      let token = `auth_tok_${Date.now()}`;

      // 1. Try server login endpoint
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(creds)
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          loggedUser = data.user;
          token = data.token;
        } else if (!res.ok && data.error && !creds.role) {
          return { success: false, error: data.error };
        }
      } catch {
        // Fallback to offline mock validation
      }

      // 2. Fallback check with DEMO_LOGIN_ACCOUNTS
      if (!loggedUser) {
        const demo = DEMO_LOGIN_ACCOUNTS.find(acc => {
          if (creds.role && acc.role === creds.role) return true;
          if (creds.identifier) {
            const idLower = creds.identifier.toLowerCase().trim();
            return acc.credentials.identifier.toLowerCase() === idLower ||
                   acc.user.email.toLowerCase() === idLower ||
                   acc.user.rollNumber.toLowerCase() === idLower;
          }
          return false;
        });

        if (demo) {
          if (creds.password && creds.password !== demo.credentials.password) {
            return { success: false, error: 'Incorrect password for this account.' };
          }
          loggedUser = demo.user;
        }
      }

      if (!loggedUser) {
        return { success: false, error: 'User account not found. Please check your credentials or click Quick Demo Sign-in.' };
      }

      setCurrentUser(loggedUser);
      setCurrentRole(loggedUser.role);
      setIsAuthenticated(true);
      if (isCyberSecuritySem3(loggedUser)) {
        setCourses(CYBER_SECURITY_SEM3_COURSES);
        setAssignments(CYBER_SECURITY_SEM3_ASSIGNMENTS);
        setExamTimetable(CYBER_SECURITY_SEM3_EXAM_TIMETABLE);
        localStorage.setItem('campus_courses', JSON.stringify(CYBER_SECURITY_SEM3_COURSES));
        localStorage.setItem('campus_assignments', JSON.stringify(CYBER_SECURITY_SEM3_ASSIGNMENTS));
        localStorage.setItem('campus_exam_timetable', JSON.stringify(CYBER_SECURITY_SEM3_EXAM_TIMETABLE));
      }
      localStorage.setItem('campus_auth_session', JSON.stringify({ token, user: loggedUser }));
      localStorage.setItem('campus_user', JSON.stringify(loggedUser));
      localStorage.setItem('campus_role', loggedUser.role);

      const targetTab = ROLE_DEFAULT_TAB[loggedUser.role] || 'dashboard';
      setActiveTab(targetTab);
      showToast(`Welcome, ${loggedUser.name}!`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login encountered an unexpected error.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('campus_auth_session');
    localStorage.removeItem('campus_pending_verification');
    setIsPendingIdVerification(false);
    setIsAuthenticated(false);
    setCurrentUser(initialCurrentUser);
    setCurrentRole('STUDENT');
    setActiveTab('dashboard');
    showToast('Signed out of Campus OS.');
  };

  const completeIdVerification = () => {
    setIsPendingIdVerification(false);
    localStorage.removeItem('campus_pending_verification');
    setActiveTab('dashboard');
  };

  const registerStudent = async (data: {
    rollNumber: string;
    name: string;
    email: string;
    password: string;
    department: string;
    batchYear: number;
    semester: number;
    hostelBlock?: string;
    roomNumber?: string;
  }): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'Registration failed' };
      }
      const user = resData.user as UserProfile;
      setCurrentUser(user);
      setCurrentRole(user.role);
      setIsAuthenticated(true);
      if (isCyberSecuritySem3(user)) {
        setCourses(CYBER_SECURITY_SEM3_COURSES);
        setAssignments(CYBER_SECURITY_SEM3_ASSIGNMENTS);
        setExamTimetable(CYBER_SECURITY_SEM3_EXAM_TIMETABLE);
        localStorage.setItem('campus_courses', JSON.stringify(CYBER_SECURITY_SEM3_COURSES));
        localStorage.setItem('campus_assignments', JSON.stringify(CYBER_SECURITY_SEM3_ASSIGNMENTS));
        localStorage.setItem('campus_exam_timetable', JSON.stringify(CYBER_SECURITY_SEM3_EXAM_TIMETABLE));
      }
      setIsPendingIdVerification(true);
      localStorage.setItem('campus_pending_verification', 'true');
      localStorage.setItem('campus_auth_session', JSON.stringify({ token: resData.token, user }));
      localStorage.setItem('campus_user', JSON.stringify(user));
      localStorage.setItem('campus_role', user.role);
      setStudentsDirectory(prev => [user, ...prev]);
      setPendingVerifications(prev => [user, ...prev]);
      showToast('Account created! Please upload your Student ID Card for verification.');
      return { success: true, user };
    } catch {
      // Offline fallback
      const colorChoices = ['#4f46e5', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2'];
      const avatarColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      const fallbackUser: UserProfile = {
        id: `usr_${Date.now()}`,
        rollNumber: data.rollNumber.toUpperCase().trim(),
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        role: 'STUDENT',
        avatarUrl: '',
        avatarColor,
        department: data.department,
        batchYear: data.batchYear,
        semester: data.semester,
        hostelBlock: data.hostelBlock || '',
        roomNumber: data.roomNumber || '',
        bio: 'Student at Campus OS.',
        skills: ['Teamwork', 'Problem Solving'],
        interests: ['Technology', 'Academics'],
        collaborationGoals: ['Study Buddy'],
        isMentor: false,
        isVerified: false,
        verificationStatus: 'PENDING_VERIFICATION',
        privacySettings: { showEmail: false, showRoom: false, isDiscoverable: true }
      };
      setCurrentUser(fallbackUser);
      setCurrentRole('STUDENT');
      setIsAuthenticated(true);
      if (isCyberSecuritySem3(fallbackUser)) {
        setCourses(CYBER_SECURITY_SEM3_COURSES);
        setAssignments(CYBER_SECURITY_SEM3_ASSIGNMENTS);
        setExamTimetable(CYBER_SECURITY_SEM3_EXAM_TIMETABLE);
        localStorage.setItem('campus_courses', JSON.stringify(CYBER_SECURITY_SEM3_COURSES));
        localStorage.setItem('campus_assignments', JSON.stringify(CYBER_SECURITY_SEM3_ASSIGNMENTS));
        localStorage.setItem('campus_exam_timetable', JSON.stringify(CYBER_SECURITY_SEM3_EXAM_TIMETABLE));
      }
      setIsPendingIdVerification(true);
      localStorage.setItem('campus_pending_verification', 'true');
      localStorage.setItem('campus_auth_session', JSON.stringify({ token: `mock_tok_${Date.now()}`, user: fallbackUser }));
      localStorage.setItem('campus_user', JSON.stringify(fallbackUser));
      localStorage.setItem('campus_role', 'STUDENT');
      setStudentsDirectory(prev => [fallbackUser, ...prev]);
      setPendingVerifications(prev => [fallbackUser, ...prev]);
      showToast('Account created! Please upload your Student ID Card for verification.');
      return { success: true, user: fallbackUser };
    }
  };

  const uploadIdCard = async (userId: string, idCardUrl: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/upload-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, idCardUrl })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Upload failed' };
      }
    } catch {}

    const updatedUser: UserProfile = { ...currentUser, idCardUrl, verificationStatus: 'PENDING_VERIFICATION' };
    setCurrentUser(updatedUser);
    localStorage.setItem('campus_user', JSON.stringify(updatedUser));
    const session = localStorage.getItem('campus_auth_session');
    if (session) {
      try {
        const s = JSON.parse(session);
        s.user = updatedUser;
        localStorage.setItem('campus_auth_session', JSON.stringify(s));
      } catch {}
    }
    setPendingVerifications(prev => {
      const exists = prev.some(u => u.id === userId);
      return exists ? prev.map(u => u.id === userId ? updatedUser : u) : [updatedUser, ...prev];
    });
    showToast('Student ID Card submitted for administrative verification!');
    return { success: true };
  };

  const verifyStudentId = async (userId: string, approved: boolean, note?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await fetch('/api/admin/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          approved,
          action: approved ? 'APPROVE' : 'REJECT',
          adminId: currentUser.id,
          adminName: currentUser.name,
          note,
          notes: note
        })
      });
    } catch {}

    const newStatus = approved ? 'APPROVED' : 'REJECTED';
    setPendingVerifications(prev => prev.filter(u => u.id !== userId));
    setStudentsDirectory(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: newStatus, isVerified: approved } : u));
    if (currentUser.id === userId) {
      const updated = { ...currentUser, verificationStatus: newStatus as any, isVerified: approved };
      setCurrentUser(updated);
      localStorage.setItem('campus_user', JSON.stringify(updated));
    }
    const logItem: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: approved ? 'USER_VERIFIED' : 'USER_REJECTED',
      targetEntity: userId,
      details: note || (approved ? 'Verified student identity against college roll records.' : 'Rejected invalid ID upload.'),
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [logItem, ...prev]);
    showToast(approved ? `Student identity approved & verified!` : `Student verification rejected.`);
    return { success: true };
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('campus_user', JSON.stringify(updated));
    setStudentsDirectory(prev => prev.map(u => u.id === currentUser.id ? updated : u));

    try {
      await fetch(`/api/users/${currentUser.id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch {}

    showToast('Profile and privacy preferences updated permanently.');
    return { success: true };
  };

  const switchRole = (role: UserRole) => {
    const matchingDemo = DEMO_LOGIN_ACCOUNTS.find(a => a.role === role);
    const targetUser = matchingDemo ? matchingDemo.user : { ...currentUser, role };
    setCurrentRole(role);
    setCurrentUser(targetUser);
    localStorage.setItem('campus_role', role);
    localStorage.setItem('campus_user', JSON.stringify(targetUser));
    localStorage.setItem('campus_auth_session', JSON.stringify({ token: `switch_${Date.now()}`, user: targetUser }));

    if (!isTabAllowed(role, activeTab)) {
      setActiveTab(ROLE_DEFAULT_TAB[role] || 'dashboard');
    }
    showToast(`Switched view to ${role.replace(/_/g, ' ')} persona.`);
  };

  const updateCourseAttendance = (courseId: string, attended: number, total: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, classesAttended: attended, classesHeld: total };
      }
      return c;
    }));

    fetch(`/api/courses/${courseId}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attended, total })
    }).catch(() => {});

    showToast('Attendance updated and saved to campus database.');
  };

  const reportIssue = (data: {
    title: string;
    description: string;
    category: IssueCategory;
    locationBuilding: string;
    locationRoom?: string;
    urgency: IssueUrgency;
  }) => {
    const id = `ISSUE-${Math.floor(2000 + Math.random() * 900)}`;
    const assignedTo = data.category === 'WIFI' ? 'Network Operations IT' : data.category === 'ELECTRICAL' ? 'Electrical Maintenance Cell' : 'Campus Facilities Desk';

    const newIssue: CampusIssue = {
      id,
      title: data.title,
      description: data.description,
      category: data.category,
      locationBuilding: data.locationBuilding,
      locationRoom: data.locationRoom,
      urgency: data.urgency,
      status: 'REPORTED',
      reporterId: currentUser.id,
      reporterName: `${currentUser.name} (You)`,
      createdAt: 'Just now',
      reopenCount: 0,
      assignedTo
    };

    setCampusIssues(prev => [newIssue, ...prev]);

    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        reporterId: currentUser.id,
        reporterName: currentUser.name
      })
    }).catch(() => {});

    showToast(`Ticket #${newIssue.id} submitted & auto-routed to ${assignedTo}!`);
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus, staffNotes?: string) => {
    setCampusIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status,
          staffNotes: staffNotes || issue.staffNotes,
          resolvedAt: status === 'RESOLVED' ? 'Just now' : issue.resolvedAt
        };
      }
      return issue;
    }));

    fetch(`/api/issues/${issueId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, staffNotes })
    }).catch(() => {});

    showToast(`Ticket #${issueId} status changed to ${status}.`);
  };

  const reopenIssue = (issueId: string, reason: string) => {
    setCampusIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: 'REOPENED',
          reopenCount: (issue.reopenCount || 0) + 1,
          staffNotes: `Student Reopened: "${reason}". Escalated to Head of Facilities.`
        };
      }
      return issue;
    }));

    fetch(`/api/issues/${issueId}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    }).catch(() => {});

    showToast(`Ticket #${issueId} reopened & escalated to Dean/Admin.`);
  };

  const registerForEvent = (eventId: string) => {
    const qrPassCode = `CAMPUS-PASS-${eventId.toUpperCase()}-${currentUser.rollNumber}`;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          isRegistered: true,
          registeredCount: evt.registeredCount + 1,
          qrPassCode,
        };
      }
      return evt;
    }));

    fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        userRoll: currentUser.rollNumber,
        userName: currentUser.name
      })
    }).catch(() => {});

    showToast('Registration confirmed! QR Pass generated in your wallet.');
  };

  const cancelEventRegistration = (eventId: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          isRegistered: false,
          registeredCount: Math.max(0, evt.registeredCount - 1),
          qrPassCode: undefined,
        };
      }
      return evt;
    }));

    fetch(`/api/events/${eventId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    }).catch(() => {});

    showToast('Registration cancelled.');
  };

  const toggleJoinClub = (clubId: string) => {
    setClubs(prev => prev.map(cl => {
      if (cl.id === clubId) {
        const nextState = !cl.isJoined;
        return {
          ...cl,
          isJoined: nextState,
          membersCount: nextState ? cl.membersCount + 1 : cl.membersCount - 1
        };
      }
      return cl;
    }));
  };

  const toggleSaveOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === oppId) {
        const nextSaved = !opp.isSaved;
        showToast(nextSaved ? 'Opportunity bookmarked!' : 'Removed from bookmarks');
        return { ...opp, isSaved: nextSaved };
      }
      return opp;
    }));
  };

  const createProject = (
    title: string, 
    description: string, 
    skills: string[], 
    openSlots: number, 
    stage: 'IDEA' | 'PROTOTYPING' | 'HACKATHON'
  ) => {
    const newProj: ProjectListing = {
      id: `proj_${Date.now()}`,
      title,
      ownerId: currentUser.id,
      ownerName: `${currentUser.name} (You)`,
      description,
      stage,
      requiredSkills: skills,
      openSlots,
      currentMembersCount: 1,
      applicants: [],
      tasks: [
        { id: 't1', title: 'Initialize Git repo and architecture document', assignee: currentUser.name, done: true },
        { id: 't2', title: 'Sprint planning and task breakdown', assignee: 'Open', done: false }
      ]
    };
    setProjects(prev => [newProj, ...prev]);
    showToast('Project listing published! Matching students will be notified.');
  };

  const applyToProject = (projectId: string, pitch: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          applicants: [
            ...proj.applicants,
            {
              userId: currentUser.id,
              userName: `${currentUser.name} (${currentUser.department})`,
              skills: currentUser.skills,
              pitch,
              status: 'PENDING'
            }
          ]
        };
      }
      return proj;
    }));
    showToast('Application and pitch sent to project owner!');
  };

  const addMarketplaceItem = (item: Omit<MarketplaceItem, 'id' | 'sellerId' | 'sellerName' | 'sellerRoll' | 'createdAt' | 'status'>) => {
    const newItem: MarketplaceItem = {
      ...item,
      id: `mkt_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: `${currentUser.name} (You)`,
      sellerRoll: currentUser.rollNumber,
      createdAt: 'Just now',
      status: 'ACTIVE'
    };
    setMarketplace(prev => [newItem, ...prev]);

    fetch('/api/marketplace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...item,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerRoll: currentUser.rollNumber
      })
    }).catch(() => {});

    showToast('Item posted to Campus Marketplace!');
  };

  const addLostFoundItem = (item: Omit<LostAndFoundItem, 'id' | 'posterId' | 'posterName' | 'status'>) => {
    const newItem: LostAndFoundItem = {
      ...item,
      id: `lnf_${Date.now()}`,
      posterId: currentUser.id,
      posterName: `${currentUser.name} (You)`,
      status: 'OPEN'
    };
    setLostAndFound(prev => [newItem, ...prev]);

    fetch('/api/lostfound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...item,
        posterId: currentUser.id,
        posterName: currentUser.name
      })
    }).catch(() => {});

    showToast(`${item.type === 'LOST' ? 'Lost' : 'Found'} item posted with secret challenge verification!`);
  };

  const verifyLostFoundClaim = (itemId: string, claimantAnswer: string) => {
    const item = lostAndFound.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Item not found' };
    
    if (claimantAnswer.trim().length >= 4) {
      setLostAndFound(prev => prev.map(i => {
        if (i.id === itemId) {
          return { ...i, status: 'VERIFYING', claimedBy: currentUser.name };
        }
        return i;
      }));

      fetch(`/api/lostfound/${itemId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimantName: currentUser.name, claimantAnswer })
      }).catch(() => {});

      return { 
        success: true, 
        message: 'Your verification answer has been accepted by the finder! Contact details and handover location unlocked.' 
      };
    } else {
      return { 
        success: false, 
        message: 'Verification answer too vague. Please provide specific details to confirm ownership.' 
      };
    }
  };

  const borrowBook = (bookId: string) => {
    setLibraryBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          availableCopies: Math.max(0, b.availableCopies - 1),
          isBorrowedByMe: true,
          dueDate: '14 days from today'
        };
      }
      return b;
    }));

    fetch(`/api/library/${bookId}/borrow`, { method: 'POST' }).catch(() => {});
    showToast('Book borrowed! Added to your Library Loans. Return in 14 days.');
  };

  const returnBook = (bookId: string) => {
    setLibraryBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          availableCopies: b.availableCopies + 1,
          isBorrowedByMe: false,
          dueDate: undefined
        };
      }
      return b;
    }));

    fetch(`/api/library/${bookId}/return`, { method: 'POST' }).catch(() => {});
    showToast('Book returned to library inventory.');
  };

  const placePrintOrder = (data: Omit<PrintOrder, 'id' | 'studentId' | 'studentName' | 'studentRoll' | 'totalAmount' | 'status' | 'paymentStatus' | 'notificationRead' | 'createdAt'>) => {
    const id = `PRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const order: PrintOrder = {
      ...data,
      id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRoll: currentUser.rollNumber,
      totalAmount: getPrintAmount(data, printRates),
      status: 'PAID',
      paymentStatus: 'PAID',
      notificationRead: false,
      createdAt: new Date().toISOString(),
    };
    setPrintOrders(prev => [order, ...prev]);
    fetch('/api/print-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(() => {});
    showToast(`Print order ${id} placed. Collect by showing this number at the counter.`);
  };

  const cancelPrintOrder = (orderId: string): { success: boolean; message: string } => {
    const order = printOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    if (['PRINTING', 'READY_FOR_PICKUP', 'COMPLETED'].includes(order.status)) {
      showToast('Cannot cancel: The print shop is already processing your order.');
      return { success: false, message: 'Cannot cancel order once processing begins.' };
    }

    setPrintOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'CANCELLED' as PrintOrderStatus,
      paymentStatus: 'REFUNDED'
    } : o));

    showToast(`Print order ${orderId} has been cancelled.`);
    return { success: true, message: 'Print order cancelled successfully.' };
  };

  const addAssignment = (data: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...data,
      id: `asg_${Date.now()}`,
      status: 'PENDING',
      submissions: []
    };
    setAssignments(prev => [newAsg, ...prev]);
    showToast(`Assignment "${data.title}" published! Students can now view and submit.`);
  };

  const deleteAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    showToast('Assignment deleted.');
  };

  const deleteAllMockAssignments = () => {
    setAssignments([]);
    showToast('All mock assignments deleted successfully!');
  };

  const submitAssignmentWork = async (assignmentId: string, data: { textContent?: string; fileName?: string; fileUrl?: string }): Promise<{ success: boolean }> => {
    const submission: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      rollNumber: currentUser.rollNumber,
      submittedAt: new Date().toLocaleString(),
      textContent: data.textContent,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      status: 'SUBMITTED'
    };

    setAssignments(prev => prev.map(asg => {
      if (asg.id === assignmentId) {
        const subs = asg.submissions ? asg.submissions.filter(s => s.studentId !== currentUser.id) : [];
        return {
          ...asg,
          status: 'SUBMITTED',
          submittedAt: submission.submittedAt,
          fileAttachment: data.fileName || asg.fileAttachment,
          submissions: [submission, ...subs]
        };
      }
      return asg;
    }));

    showToast('Assignment work submitted successfully!');
    return { success: true };
  };

  const gradeAssignmentSubmission = (assignmentId: string, studentId: string, marks: number, feedback?: string) => {
    setAssignments(prev => prev.map(asg => {
      if (asg.id === assignmentId) {
        const updatedSubs = (asg.submissions || []).map(sub => {
          if (sub.studentId === studentId) {
            return {
              ...sub,
              obtainedMarks: marks,
              feedback,
              status: 'GRADED' as const
            };
          }
          return sub;
        });
        return {
          ...asg,
          obtainedMarks: studentId === currentUser.id ? marks : asg.obtainedMarks,
          submissions: updatedSubs
        };
      }
      return asg;
    }));
    showToast(`Graded submission: ${marks} marks recorded.`);
  };

  const updateCourseSyllabus = (courseId: string, syllabus: { content?: string; type: 'PDF' | 'IMAGE' | 'TEXT'; fileName?: string; url?: string }) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          syllabusContent: syllabus.content,
          syllabusType: syllabus.type,
          syllabusFileName: syllabus.fileName,
          syllabusUrl: syllabus.url || course.syllabusUrl
        };
      }
      return course;
    }));
    showToast('Course syllabus updated successfully.');
  };

  const markMarketplaceItemSold = (itemId: string) => {
    setMarketplace(prev => prev.map(m => m.id === itemId ? { ...m, status: 'SOLD' } : m));
    showToast('Item marked as Sold / Deal Closed.');
  };

  const addClubRecruitment = (data: Omit<ClubRecruitment, 'id' | 'postedAt'>) => {
    const item: ClubRecruitment = {
      ...data,
      id: `rec_${Date.now()}`,
      postedAt: 'Just now'
    };
    setClubRecruitments(prev => [item, ...prev]);
    showToast(`Recruitment announcement posted for ${data.clubName}!`);
  };

  const addClubEvent = (data: Omit<ClubEventItem, 'id'>) => {
    const item: ClubEventItem = {
      ...data,
      id: `evt_${Date.now()}`
    };
    setClubEvents(prev => [item, ...prev]);
    showToast(`Club event published for ${data.clubName}!`);
  };

  const addClubHackathon = (data: Omit<ClubHackathonItem, 'id'>) => {
    const item: ClubHackathonItem = {
      ...data,
      id: `hack_${Date.now()}`
    };
    setClubHackathons(prev => [item, ...prev]);
    showToast(`Hackathon published for ${data.clubName}!`);
  };

  const submitClubApplication = (data: Omit<ClubApplication, 'id' | 'status' | 'submittedAt'>) => {
    const item: ClubApplication = {
      ...data,
      id: `app_${Date.now()}`,
      status: 'PENDING',
      submittedAt: 'Just now'
    };
    setClubApplications(prev => [item, ...prev]);
    showToast(`Application successfully submitted to ${data.clubName}!`);
  };

  const updateClubApplicationStatus = (appId: string, status: 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => {
    setClubApplications(prev => prev.map(app => app.id === appId ? { ...app, status } : app));
    showToast(`Candidate status updated to ${status}.`);
  };

  const updatePrintOrderStatus = (orderId: string, status: PrintOrderStatus, shopNote?: string) => {
    setPrintOrders(prev => prev.map(order => order.id === orderId ? {
      ...order,
      status,
      shopNote: shopNote || order.shopNote,
      notificationRead: status === 'READY_FOR_PICKUP' ? false : order.notificationRead,
    } : order));
    fetch(`/api/print-orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, shopNote })
    }).catch(() => {});
    if (status === 'READY_FOR_PICKUP') showToast(`Print order ${orderId} is ready for pickup.`);
  };

  const updatePrintRates = (rates: PrintRates) => {
    setPrintRates(rates);
    fetch('/api/print-rates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rates)
    }).catch(() => {});
    showToast('Print Hub pricing updated.');
  };

  const markPrintNotificationRead = (orderId: string) => {
    setPrintOrders(prev => prev.map(order => order.id === orderId ? { ...order, notificationRead: true } : order));
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const broadcastAnnouncement = (title: string, content: string, category: 'CRITICAL' | 'ACADEMIC' | 'HOSTEL' | 'EVENTS') => {
    const newAnn: OfficialAnnouncement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      category,
      source: currentRole === 'CAMPUS_ADMIN' ? 'Office of the Dean & Registrar' : 'Authorized College Council',
      publishedAt: 'Just now',
      isImportant: category === 'CRITICAL' || category === 'ACADEMIC',
      read: false
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        category,
        source: newAnn.source
      })
    }).catch(() => {});

    showToast('Official announcement published to campus feed!');
  };

  const toggleEventBookmark = (eventId: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const nextSaved = !evt.isSaved;
        showToast(nextSaved ? 'Event bookmarked!' : 'Event removed from bookmarks');
        return { ...evt, isSaved: nextSaved };
      }
      return evt;
    }));

    fetch(`/api/events/${eventId}/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    }).catch(() => {});
  };

  const submitAssignment = async (assignmentId: string, notes: string): Promise<{ success: boolean; error?: string }> => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'SUBMITTED' } : a));

    try {
      await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentUser.id, studentName: currentUser.name, notes })
      });
    } catch {}

    showToast('Assignment submitted successfully!');
    return { success: true };
  };

  const reviewProjectApplicant = async (projectId: string, applicantUserId: string, status: 'ACCEPTED' | 'REJECTED') => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedApplicants = p.applicants.map(a => a.userId === applicantUserId ? { ...a, status } : a);
        const slotsDelta = status === 'ACCEPTED' ? -1 : 0;
        const membersDelta = status === 'ACCEPTED' ? 1 : 0;
        return {
          ...p,
          openSlots: Math.max(0, p.openSlots + slotsDelta),
          currentMembersCount: p.currentMembersCount + membersDelta,
          applicants: updatedApplicants
        };
      }
      return p;
    }));

    fetch(`/api/projects/${projectId}/applicants/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantUserId, status })
    }).catch(() => {});

    showToast(status === 'ACCEPTED' ? 'Applicant accepted into project team!' : 'Applicant pitch declined.');
  };

  const addProjectTask = async (projectId: string, title: string, assignee: string) => {
    const taskId = `task_${Date.now()}`;
    const newTask = { id: taskId, title, assignee, done: false };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, tasks: [...(p.tasks || []), newTask] };
      }
      return p;
    }));

    fetch(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    }).catch(() => {});

    showToast('Task added to project team workspace!');
  };

  const toggleProjectTask = async (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: (p.tasks || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
      }
      return p;
    }));

    fetch(`/api/projects/${projectId}/tasks/${taskId}/toggle`, {
      method: 'POST'
    }).catch(() => {});
  };

  const submitProjectShowcase = async (showcase: Omit<ProjectShowcase, 'id' | 'stars' | 'submittedAt'>) => {
    const newShow: ProjectShowcase = {
      ...showcase,
      id: `show_${Date.now()}`,
      stars: 1,
      submittedAt: new Date().toISOString().slice(0, 10)
    };
    setProjectShowcases(prev => [newShow, ...prev]);

    fetch('/api/projects/showcase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(showcase)
    }).catch(() => {});

    showToast('Project submitted to Campus Showcase Gallery!');
  };

  const toggleJoinCommunity = async (communityId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const nextJoined = !c.isJoined;
        return {
          ...c,
          isJoined: nextJoined,
          memberCount: nextJoined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1)
        };
      }
      return c;
    }));

    fetch(`/api/communities/${communityId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    }).catch(() => {});

    showToast('Community membership updated!');
  };

  const createCommunity = async (name: string, category: InterestCommunity['category'], description: string) => {
    const newComm: InterestCommunity = {
      id: `comm_${Date.now()}`,
      name,
      category,
      description,
      memberCount: 1,
      leaderName: currentUser.name,
      isJoined: true
    };
    setCommunities(prev => [newComm, ...prev]);

    fetch('/api/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category,
        description,
        leaderId: currentUser.id,
        leaderName: currentUser.name
      })
    }).catch(() => {});

    showToast(`Interest Community "${name}" created!`);
  };

  const sendConnectionRequest = async (targetUserId: string, type: 'COLLABORATION' | 'MENTORSHIP', note?: string): Promise<{ success: boolean; error?: string }> => {
    const target = studentsDirectory.find(s => s.id === targetUserId);
    const newReq: ConnectionRequest = {
      id: `cr_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRoll: currentUser.rollNumber,
      senderDept: currentUser.department,
      targetUserId,
      type,
      note,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setConnectionRequests(prev => [newReq, ...prev]);

    fetch('/api/connections/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRoll: currentUser.rollNumber,
        senderDept: currentUser.department,
        targetUserId,
        type,
        note
      })
    }).catch(() => {});

    showToast(`${type === 'MENTORSHIP' ? 'Mentorship guidance request' : 'Connection invitation'} sent to ${target?.name || 'student'}!`);
    return { success: true };
  };

  const respondToConnectionRequest = async (requestId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<{ success: boolean }> => {
    setConnectionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));

    fetch(`/api/connections/${requestId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});

    showToast(status === 'ACCEPTED' ? 'Connection request accepted! You can now collaborate.' : 'Connection request declined.');
    return { success: true };
  };

  const sendMessage = async (receiverId: string, content: string, itemContext?: string) => {
    const newMsg: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      senderName: currentUser.name,
      content,
      createdAt: new Date().toISOString(),
      itemContext
    };
    setDirectMessages(prev => [...prev, newMsg]);

    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg)
    }).catch(() => {});
  };

  const reportItem = async (itemId: string, itemTitle: string, itemType: 'MARKETPLACE' | 'LOST_FOUND', reason: string, details?: string) => {
    const newReport: ItemReport = {
      id: `rep_${Date.now()}`,
      itemId,
      itemTitle,
      itemType,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason,
      details,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setItemReports(prev => [newReport, ...prev]);

    fetch('/api/reports/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport)
    }).catch(() => {});

    showToast('Report submitted. Campus moderators will review within 24 hours.');
  };

  const moderateItemReport = async (reportId: string, status: 'ACTIONED' | 'DISMISSED') => {
    setItemReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));

    fetch(`/api/reports/item/${reportId}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        moderatorId: currentUser.id,
        moderatorName: currentUser.name
      })
    }).catch(() => {});

    showToast(`Report ${status.toLowerCase()}.`);
  };

  const submitMessReport = async (data: Omit<MessFoodReport, 'id' | 'studentId' | 'studentName' | 'status' | 'createdAt'>) => {
    const newReport: MessFoodReport = {
      ...data,
      id: `mfr_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: 'ESCALATED',
      createdAt: new Date().toISOString()
    };
    setMessReports(prev => [newReport, ...prev]);

    fetch('/api/reports/mess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport)
    }).catch(() => {});

    showToast('Mess quality issue reported & escalated to Chief Warden & Mess Committee!');
  };

  const resolveMessReport = async (reportId: string, resolutionNotes?: string) => {
    setMessReports(prev => prev.map(m => m.id === reportId ? { ...m, status: 'RESOLVED', resolutionNotes } : m));

    fetch(`/api/reports/mess/${reportId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resolutionNotes,
        resolverId: currentUser.id,
        resolverName: currentUser.name
      })
    }).catch(() => {});

    showToast('Mess report resolved and corrective action logged.');
  };

  // Grounded RAG Query Engine
  const askCampusAI = (query: string): AIAnswerResult => {
    const lower = query.toLowerCase();
    
    let bestChunk: CampusKnowledgeChunk | null = null;
    let highestScore = 0;

    for (const chunk of campusKnowledgeBase) {
      let score = 0;
      for (const kw of chunk.keywords) {
        if (lower.includes(kw.toLowerCase())) score += 2;
      }
      if (lower.includes(chunk.documentTitle.toLowerCase().split(' ')[0].toLowerCase())) score += 1;

      if (score > highestScore) {
        highestScore = score;
        bestChunk = chunk;
      }
    }

    if (bestChunk && highestScore > 0) {
      return {
        answer: bestChunk.content,
        sourceDocument: bestChunk.documentTitle,
        sourceSection: bestChunk.section,
        pageNumber: bestChunk.pageNumber,
        confidence: 0.94
      };
    }

    return {
      answer: "I couldn't find a direct official circular or handbook policy matching this specific question in the verified campus database. To ensure you receive accurate and authoritative information, please consult the Academic Section (Dean Office, Room 102) or submit a query to the Student Affairs Desk.",
      sourceDocument: "Campus Official Directory",
      sourceSection: "Administrative Helpdesk & Contacts",
      pageNumber: 1,
      confidence: 0.40
    };
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isPendingIdVerification,
        setIsPendingIdVerification,
        completeIdVerification,
        registerStudent,
        uploadIdCard,
        verifyStudentId,
        pendingVerifications,
        currentUser,
        setCurrentUser,
        currentRole,
        switchRole,
        activeTab,
        setActiveTab,
        updateProfile,
        courses,
        assignments,
        examTimetable,
        academicCalendar,
        updateCourseAttendance,
        submitAssignment,
        addAssignment,
        deleteAssignment,
        deleteAllMockAssignments,
        submitAssignmentWork,
        gradeAssignmentSubmission,
        updateCourseSyllabus,
        campusIssues,
        reportIssue,
        updateIssueStatus,
        reopenIssue,
        events,
        registerForEvent,
        cancelEventRegistration,
        toggleEventBookmark,
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
        opportunities,
        toggleSaveOpportunity,
        projects,
        projectShowcases,
        createProject,
        applyToProject,
        reviewProjectApplicant,
        addProjectTask,
        toggleProjectTask,
        submitProjectShowcase,
        communities,
        toggleJoinCommunity,
        createCommunity,
        connectionRequests,
        sendConnectionRequest,
        respondToConnectionRequest,
        marketplace,
        addMarketplaceItem,
        markMarketplaceItemSold,
        lostAndFound,
        addLostFoundItem,
        verifyLostFoundClaim,
        directMessages,
        sendMessage,
        itemReports,
        reportItem,
        moderateItemReport,
        messReports,
        submitMessReport,
        resolveMessReport,
        auditLogs,
        libraryBooks,
        borrowBook,
        returnBook,
        printOrders,
        printRates,
        placePrintOrder,
        updatePrintOrderStatus,
        updatePrintRates,
        markPrintNotificationRead,
        cancelPrintOrder,
        announcements,
        markAnnouncementAsRead,
        broadcastAnnouncement,
        studentsDirectory,
        askCampusAI,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        isBackendConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
