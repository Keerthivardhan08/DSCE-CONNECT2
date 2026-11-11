export type UserRole = 
  | 'STUDENT' 
  | 'SENIOR_MENTOR' 
  | 'CLASS_REP' 
  | 'CLUB_LEADER' 
  | 'FACULTY' 
  | 'LIBRARIAN' 
  | 'HOSTEL_STAFF' 
  | 'FACILITY_STAFF'
  | 'PRINT_ADMIN'
  | 'CAMPUS_ADMIN';

export const COLLEGE_DEPARTMENTS = [
  'Computer Science & Engineering (Cyber Security)',
  'Cyber Security',
  'Artificial Intelligence and Machine Learning',
  'Aeronautical Engineering',
  'Automobile Engineering',
  'Biotechnology',
  'Computer Science and Engineering',
  'Computer Science and Business Systems',
  'Computer Science & Engineering (Cyber Security)',
  'Computer Science & Engineering (Data Science)',
  'Computer Science & Engineering (Internet of Things and Cyber Security Including Block Chain Technology)',
  'Computer Science and Design',
  'Chemical Engineering',
  'Civil Engineering',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering',
  'Information Science and Engineering',
  'Electronics and Instrumentation Engineering',
  'Mechanical Engineering',
  'Medical Electronics Engineering',
  'Electronics and Telecommunication Engineering',
  'Robotics and Artificial Intelligence'
] as const;

export type CollegeDepartment = (typeof COLLEGE_DEPARTMENTS)[number];

export interface AuthCredentials {
  identifier: string;
  password?: string;
  role?: UserRole;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatarUrl: string;
  avatarColor?: string;
  role: UserRole;
  department: string;
  batchYear: number;
  semester: number;
  hostelBlock?: string;
  roomNumber?: string;
  bio: string;
  skills: string[];
  interests: string[];
  collaborationGoals: string[];
  isMentor: boolean;
  mentorTopics?: string[];
  isVerified: boolean;
  idCardUrl?: string;
  verificationStatus?: 'PENDING' | 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  privacySettings: {
    showEmail: boolean;
    showRoom: boolean;
    isDiscoverable: boolean;
  };
}

export interface Course {
  id: string;
  code: string;
  name: string;
  facultyName: string;
  credits: number;
  classesHeld: number;
  classesAttended: number;
  room: string;
  scheduleDayTime: string;
  syllabusUrl?: string;
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  totalMarks: number;
  obtainedMarks?: number;
  fileAttachment?: string;
  submittedAt?: string;
}

export type IssueStatus = 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
export type IssueUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type IssueCategory = 
  | 'WIFI' 
  | 'ELECTRICAL' 
  | 'CLASSROOM' 
  | 'LAB' 
  | 'WASHROOM' 
  | 'HOSTEL' 
  | 'SAFETY'
  | 'LIBRARY'
  | 'CANTEEN'
  | 'SPORTS_FACILITY'
  | 'PARKING'
  | 'SECURITY'
  | 'TRANSPORT'
  | 'IT_HELPDESK'
  | 'MEDICAL_CENTER'
  | 'ADMINISTRATION'
  | 'GARDEN_GROUNDS'
  | 'LIFT_ELEVATOR'
  | 'FIRE_SAFETY'
  | 'AUDITORIUM'
  | 'OTHER';

export interface CampusIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  locationBuilding: string;
  locationRoom?: string;
  urgency: IssueUrgency;
  status: IssueStatus;
  reporterId: string;
  reporterName: string;
  assignedTo?: string;
  staffNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  photoUrl?: string;
  reopenCount: number;
}

export interface EventItem {
  id: string;
  title: string;
  organizer: string;
  clubId?: string;
  category: 'TECH' | 'CULTURAL' | 'SPORTS' | 'CAREER' | 'ACADEMIC';
  date: string;
  time: string;
  venue: string;
  description: string;
  capacity: number;
  registeredCount: number;
  isRegistered: boolean;
  registrationDeadline: string;
  qrPassCode?: string;
  isSaved?: boolean;
}

export interface Club {
  id: string;
  name: string;
  category: 'TECH' | 'CULTURAL' | 'SPORTS' | 'SOCIAL' | 'ACADEMIC';
  description: string;
  leadName: string;
  membersCount: number;
  isJoined: boolean;
  recruitmentOpen: boolean;
  recruitmentDeadline?: string;
  badge: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'INTERNSHIP' | 'HACKATHON' | 'SCHOLARSHIP' | 'RESEARCH' | 'FELLOWSHIP';
  stipendOrPrize: string;
  rewardOrStipend?: string;
  departmentEligibility: string[];
  minCgpa?: number;
  deadline: string;
  skills: string[];
  description: string;
  isSaved: boolean;
  applicationStatus?: 'NOT_APPLIED' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED';
}

export interface ProjectListing {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  description: string;
  stage: 'IDEA' | 'PROTOTYPING' | 'HACKATHON' | 'RESEARCH';
  requiredSkills: string[];
  openSlots: number;
  currentMembersCount: number;
  applicants: {
    userId: string;
    userName: string;
    skills: string[];
    pitch: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  }[];
  tasks: {
    id: string;
    title: string;
    assignee: string;
    done: boolean;
  }[];
}

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRoll: string;
  type: 'SELL' | 'EXCHANGE' | 'FREE' | 'BORROW';
  category: 'BOOKS' | 'ELECTRONICS' | 'CALCULATOR' | 'LAB_COAT' | 'FURNITURE';
  title: string;
  description: string;
  price: number; // 0 for free/borrow
  photos: string[];
  status: 'ACTIVE' | 'RESERVED' | 'SOLD';
  createdAt: string;
}

export interface LostAndFoundItem {
  id: string;
  posterId: string;
  posterName: string;
  type: 'LOST' | 'FOUND';
  category: 'ID_CARD' | 'ELECTRONICS' | 'KEYS' | 'BOTTLE' | 'WALLET' | 'OTHER';
  title: string;
  description: string;
  locationArea: string;
  incidentDate: string;
  secretChallengeQuestion: string; // Question that owner answers to verify ownership
  status: 'OPEN' | 'VERIFYING' | 'RETURNED' | 'CLOSED';
  claimedBy?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  authors: string;
  category: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  isBorrowedByMe: boolean;
  dueDate?: string;
}

export type PrintLayout = 'ALL_PAGES' | 'FOUR_UP' | 'EIGHT_UP';
export type PrintColorMode = 'COLOR' | 'BLACK_WHITE';
export type PrintBinding = 'NONE' | 'SPIRAL' | 'LAMINATION' | 'SPIRAL_LAMINATION';
export type PrintOrderStatus = 'PAYMENT_PENDING' | 'PAID' | 'QUEUED' | 'PRINTING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';

export interface PrintFile {
  name: string;
  type: string;
  sizeBytes: number;
}

export interface PrintRates {
  blackWhitePerPage: number;
  colorPerPage: number;
  spiralBinding: number;
  lamination: number;
}

export interface PrintOrder {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  files: PrintFile[];
  pageCount: number;
  layout: PrintLayout;
  colorMode: PrintColorMode;
  binding: PrintBinding;
  copies: number;
  readyBy: string;
  totalAmount: number;
  status: PrintOrderStatus;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  notificationRead: boolean;
  createdAt: string;
  shopNote?: string;
}

export interface MessMeal {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface OfficialAnnouncement {
  id: string;
  title: string;
  source: string; // e.g. "Office of the Dean", "Chief Warden"
  category: 'CRITICAL' | 'ACADEMIC' | 'HOSTEL' | 'EVENTS';
  publishedAt: string;
  content: string;
  isImportant: boolean;
  read: boolean;
}

export interface CampusKnowledgeChunk {
  id: string;
  documentTitle: string;
  section: string;
  pageNumber: number;
  content: string;
  keywords: string[];
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderRoll: string;
  senderDept: string;
  receiverId?: string;
  targetUserId?: string;
  type: 'CONNECT' | 'MENTOR_1ON1' | 'COLLABORATION' | 'MENTORSHIP';
  message?: string;
  note?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED';
  createdAt: string;
}

export interface InterestCommunity {
  id: string;
  name: string;
  category: string;
  description: string;
  memberCount: number;
  createdBy?: string;
  leaderName?: string;
  isMember?: boolean;
  isJoined?: boolean;
  topics?: string[];
  tags?: string[];
}

export interface ProjectShowcase {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  authors?: string;
  teamName?: string;
  category?: string;
  tags: string[];
  repoUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  stars?: number;
  award?: string;
  year?: string;
  submittedAt?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName?: string;
  itemId?: string;
  itemTitle?: string;
  itemContext?: string;
  content: string;
  sentAt?: string;
  createdAt?: string;
}

export interface ItemReport {
  id: string;
  targetType?: 'MARKETPLACE' | 'LOST_FOUND';
  itemType?: 'MARKETPLACE' | 'LOST_FOUND';
  targetId?: string;
  itemId?: string;
  itemTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details?: string;
  status: 'OPEN' | 'PENDING' | 'ACTIONED' | 'DISMISSED' | 'REMOVED';
  createdAt: string;
}

export interface MessFoodReport {
  id: string;
  reporterId?: string;
  studentId?: string;
  reporterName?: string;
  studentName?: string;
  reporterRoll?: string;
  hostelBlock?: string;
  messBlock?: string;
  mealType: string;
  category: 'FOOD_QUALITY' | 'HYGIENE' | 'FOREIGN_OBJECT' | 'SHORTAGE' | 'TIMING' | 'STAFF_BEHAVIOR' | 'TASTE_COOKING' | 'DELAY_SHORTAGE' | 'CONTRACTOR_VIOLATION';
  incidentDate?: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ESCALATED' | 'IN_INVESTIGATION' | 'RESOLVED';
  actionTaken?: string;
  resolutionNotes?: string;
  createdAt: string;
}

export interface ExamTimetableItem {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'MID_TERM' | 'END_SEM';
  date: string;
  timeSlot?: string;
  time?: string;
  hall: string;
  seatNumber: string;
  maxMarks?: number;
  instructions?: string;
}

export interface AcademicCalendarItem {
  id: string;
  title: string;
  category: 'EXAM' | 'HOLIDAY' | 'DEADLINE' | 'FEST' | 'SEMESTER' | 'EVENT';
  date?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  isImportant?: boolean;
  isMilestone?: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole?: string;
  action: string;
  targetEntity?: string;
  details: string;
  timestamp: string;
}

export interface DemoLoginAccount {
  id: string;
  role: UserRole;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  credentials: {
    identifier: string;
    password: string;
  };
  user: UserProfile;
  allowedFeatures: string[];
  restrictedFeatures: string[];
  primaryTab: string;
}
