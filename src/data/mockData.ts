import { 
  UserProfile, 
  Course, 
  Assignment, 
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
  MessMeal, 
  OfficialAnnouncement, 
  CampusKnowledgeChunk,
  ConnectionRequest,
  InterestCommunity,
  ProjectShowcase,
  DirectMessage,
  ItemReport,
  MessFoodReport,
  ExamTimetableItem,
  AcademicCalendarItem,
  AuditLog,
  DemoLoginAccount
} from '../types';
import {
  CYBER_SECURITY_SEM3_TIMETABLE,
  CYBER_SECURITY_SEM3_COURSES,
  CYBER_SECURITY_SEM3_ASSIGNMENTS,
  CYBER_SECURITY_SEM3_EXAM_TIMETABLE,
  CYBER_SECURITY_SEM3_METADATA,
  FACULTY_DIRECTORY,
  isCyberSecuritySem3
} from './cyberSecuritySem3Data';

export {
  CYBER_SECURITY_SEM3_TIMETABLE,
  CYBER_SECURITY_SEM3_COURSES,
  CYBER_SECURITY_SEM3_ASSIGNMENTS,
  CYBER_SECURITY_SEM3_EXAM_TIMETABLE,
  CYBER_SECURITY_SEM3_METADATA,
  FACULTY_DIRECTORY,
  isCyberSecuritySem3
};

export type { DemoLoginAccount };

export const initialCurrentUser: UserProfile = {
  id: 'usr_keerthi_001',
  name: 'Keerthi V.',
  rollNumber: '22CS084',
  email: 'keerthi.22cs@campus.edu',
  avatarUrl: '',
  avatarColor: '#4f46e5',
  role: 'STUDENT',
  department: 'Computer Science & Engineering',
  batchYear: 2026,
  semester: 6,
  hostelBlock: 'Hostel Block B',
  roomNumber: 'Room 304',
  bio: 'Full-stack builder passionate about distributed systems and campus civic tech. Always down for hackathons!',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
  interests: ['Systems Design', 'Open Source', 'Hackathons', 'Badminton', 'AI Agents'],
  collaborationGoals: ['Hackathon Teammate', 'Study Buddy', 'Competitive Programming'],
  isMentor: true,
  mentorTopics: ['Frontend Dev & React', 'Landing Summer Internships', 'DSA Preparation'],
  isVerified: true,
  verificationStatus: 'APPROVED',
  privacySettings: {
    showEmail: false,
    showRoom: false,
    isDiscoverable: true,
  }
};

export const initialCyberSecurityStudent: UserProfile = {
  id: 'usr_cyber_042',
  name: 'Aarav Sharma',
  rollNumber: '24CY042',
  email: 'aarav.24cy@campus.edu',
  avatarUrl: '',
  avatarColor: '#0284c7',
  role: 'STUDENT',
  department: 'Computer Science & Engineering (Cyber Security)',
  batchYear: 2028,
  semester: 3,
  hostelBlock: 'Hostel Block B',
  roomNumber: 'Room 204',
  bio: 'Cyber Security (Sem 3) undergraduate student exploring network security, reverse engineering, and Linux kernel programming.',
  skills: ['Linux Kernel', 'Core Java', 'Data Structures', 'Wireshark', 'Digital Electronics'],
  interests: ['Cyber Security', 'CTF Challenges', 'Operating Systems', 'System Programming'],
  collaborationGoals: ['CTF Team', 'Study Group', 'Hackathon Teammate'],
  isMentor: false,
  isVerified: true,
  verificationStatus: 'APPROVED',
  privacySettings: {
    showEmail: false,
    showRoom: false,
    isDiscoverable: true,
  }
};

export const initialCourses: Course[] = [
  {
    id: 'crs_101',
    code: 'CS301',
    name: 'Database Management Systems',
    facultyName: 'Dr. Radhakrishnan S.',
    credits: 4,
    classesHeld: 25,
    classesAttended: 18, // 72.0% -> AT RISK!
    room: 'Hall 402 (CS Block)',
    scheduleDayTime: 'Mon, Wed, Fri • 10:00 AM - 11:30 AM',
  },
  {
    id: 'crs_102',
    code: 'CS302',
    name: 'Operating Systems & Concurrency',
    facultyName: 'Prof. Ananya Sen',
    credits: 4,
    classesHeld: 25,
    classesAttended: 22, // 88.0% -> SAFE!
    room: 'Hall 401 (CS Block)',
    scheduleDayTime: 'Tue, Thu • 09:00 AM - 10:30 AM',
  },
  {
    id: 'crs_103',
    code: 'CS303',
    name: 'Computer Networks & Protocols',
    facultyName: 'Dr. Michael Chen',
    credits: 3,
    classesHeld: 24,
    classesAttended: 20, // 83.3% -> SAFE
    room: 'Hall 305 (Main Block)',
    scheduleDayTime: 'Mon, Wed • 02:00 PM - 03:30 PM',
  },
  {
    id: 'crs_104',
    code: 'CS304',
    name: 'Software Engineering & Agile',
    facultyName: 'Prof. Geetha V.',
    credits: 3,
    classesHeld: 22,
    classesAttended: 19, // 86.4% -> SAFE
    room: 'Seminar Room 2',
    scheduleDayTime: 'Tue, Thu • 11:30 AM - 01:00 PM',
  },
  {
    id: 'crs_105',
    code: 'CS305',
    name: 'OS & Systems Programming Lab',
    facultyName: 'Prof. Ananya Sen & Lab Staff',
    credits: 2,
    classesHeld: 10,
    classesAttended: 8, // 80.0% -> SAFE
    room: 'Systems Lab 2 (Ground Floor)',
    scheduleDayTime: 'Wed • 02:00 PM - 05:00 PM',
  }
];

export const initialAssignments: Assignment[] = [];

export const initialCampusIssues: CampusIssue[] = [
  {
    id: 'ISSUE-2041',
    title: '3rd Floor Wi-Fi Router Outage in Hostel Block B',
    description: 'The Cisco AP blinking solid amber on the corridor ceiling. None of the students on rooms 301-320 have had internet since 8:00 AM.',
    category: 'WIFI',
    locationBuilding: 'Hostel Block B',
    locationRoom: 'Corridor 3rd Floor',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    reporterId: 'usr_keerthi_001',
    reporterName: 'Keerthi V. (You)',
    assignedTo: 'Network Operations IT Cell',
    staffNotes: 'Technician dispatched with replacement AP unit. Expected resolution by 4:30 PM.',
    createdAt: 'Today, 08:45 AM',
    reopenCount: 0,
  },
  {
    id: 'ISSUE-1988',
    title: 'HDMI Display Flickering in CS Hall 402 Projector',
    description: 'Projector cuts out every 30 seconds when connecting via podium HDMI cable.',
    category: 'CLASSROOM',
    locationBuilding: 'Computer Science Block',
    locationRoom: 'Hall 402',
    urgency: 'MEDIUM',
    status: 'RESOLVED',
    reporterId: 'usr_keerthi_001',
    reporterName: 'Keerthi V.',
    assignedTo: 'AV Support Team',
    staffNotes: 'Replaced damaged HDMI podium cable and tested with faculty laptop.',
    createdAt: '2 days ago',
    resolvedAt: 'Yesterday, 03:15 PM',
    reopenCount: 0,
  },
  {
    id: 'ISSUE-2015',
    title: 'Water Cooler on 2nd Floor Library Leaking',
    description: 'Water pooling around the drinking station causing slippery hazard.',
    category: 'WASHROOM',
    locationBuilding: 'Central Library',
    locationRoom: '2nd Floor North Wing',
    urgency: 'MEDIUM',
    status: 'REPORTED',
    reporterId: 'usr_siddharth_002',
    reporterName: 'Siddharth M.',
    createdAt: 'Yesterday, 11:30 AM',
    reopenCount: 0,
  }
];

export const initialEvents: EventItem[] = [
  {
    id: 'evt_101',
    title: 'HackCamp 2026: 36-Hour National Campus Hackathon',
    organizer: 'ACM Student Chapter & Google Developer Group',
    category: 'TECH',
    date: 'Oct 17 - Oct 19, 2026',
    time: 'Friday 06:00 PM onwards',
    venue: 'Convention Center Main Auditorium',
    description: 'Build solutions for sustainability, AI, and campus life. Over ₹1,50,000 in cash prizes + sponsor goodies!',
    capacity: 250,
    registeredCount: 198,
    isRegistered: true,
    registrationDeadline: 'Oct 15, 2026',
    qrPassCode: 'CAMPUS-PASS-HACK-22CS084-VERIFIED',
  },
  {
    id: 'evt_102',
    title: 'Workshop: Demystifying LLMs & RAG Architectures',
    organizer: 'AI & Data Science Club',
    category: 'TECH',
    date: 'Tomorrow, Oct 08, 2026',
    time: '04:30 PM - 06:30 PM',
    venue: 'Seminar Hall 1, CS Block',
    description: 'Hands-on session using Python, LangChain, and pgvector. Bring your laptops with Python installed.',
    capacity: 80,
    registeredCount: 76,
    isRegistered: false,
    registrationDeadline: 'Today, 11:59 PM',
  },
  {
    id: 'evt_103',
    title: 'Annual Inter-Hostel Badminton Championship',
    organizer: 'Campus Sports Council',
    category: 'SPORTS',
    date: 'Saturday, Oct 11, 2026',
    time: '08:00 AM - 05:00 PM',
    venue: 'Indoor Sports Complex',
    description: 'Singles and doubles knockout tournament between hostels. Register your team before Friday.',
    capacity: 64,
    registeredCount: 48,
    isRegistered: false,
    registrationDeadline: 'Oct 10, 2026',
  },
  {
    id: 'evt_104',
    title: 'Career Talk: Transitioning from Engineering to Product & Tech',
    organizer: 'Training & Placement Cell',
    category: 'CAREER',
    date: 'Oct 14, 2026',
    time: '05:00 PM - 06:30 PM',
    venue: 'Main Auditorium',
    description: 'Alumni panel featuring engineers and PMs at Google, Stripe, and Microsoft sharing interview tips.',
    capacity: 300,
    registeredCount: 240,
    isRegistered: true,
    registrationDeadline: 'Oct 13, 2026',
    qrPassCode: 'CAMPUS-PASS-CAREER-22CS084',
  }
];

export const initialClubs: Club[] = [
  {
    id: 'club_aegis',
    name: 'AEGIS',
    category: 'TECH',
    description: 'The Official Information Science & Cyber Security Student Chapter of DSCE. Dedicated to ethical hacking, CTF challenges, red/blue teaming, security audits, and hands-on offensive & defensive labs.',
    leadName: 'Aditya Sharma (Club Lead)',
    membersCount: 140,
    isJoined: true,
    recruitmentOpen: true,
    recruitmentDeadline: 'Dec 15, 2026',
    badge: 'Official Cyber Security Chapter',
    adminEmail: 'aegis.admin@campus.edu'
  },
  {
    id: 'club_pointblank',
    name: 'POINTBLANK',
    category: 'TECH',
    description: 'DSCE Premier Student Coding & Algorithms Community. Organizing national collegiate hackathons, algorithmic contests, open-source projects, and systems development workshops.',
    leadName: 'Rohan Gupta (President)',
    membersCount: 195,
    isJoined: false,
    recruitmentOpen: true,
    recruitmentDeadline: 'Dec 12, 2026',
    badge: 'Premier Dev Guild',
    adminEmail: 'pointblank.admin@campus.edu'
  },
  {
    id: 'club_cpa',
    name: 'CPA',
    category: 'TECH',
    description: 'Club of Programming & Algorithms / Creative Professionals Association. Accelerating software craftsmanship, technical paper presentations, hackathons, and student tech mentorship.',
    leadName: 'Sneha Rao (Convenor)',
    membersCount: 110,
    isJoined: false,
    recruitmentOpen: true,
    recruitmentDeadline: 'Dec 20, 2026',
    badge: 'Verified Technical Chapter',
    adminEmail: 'cpa.admin@campus.edu'
  }
];

export const initialClubRecruitments: ClubRecruitment[] = [
  {
    id: 'rec_aegis_01',
    clubId: 'club_aegis',
    clubName: 'AEGIS',
    title: 'Core Technical & CTF Team Recruitments (2026-27)',
    roles: ['Vulnerability Analyst', 'Network Security Dev', 'Web & Mobile App Pentester', 'PR & Event Coordinator'],
    description: 'Looking for passionate students for CTF teams and hands-on defense lab setups. Open to 1st, 2nd & 3rd year students.',
    eligibility: 'All Engineering branches, minimum 6.5 CGPA, strong interest in security.',
    deadline: 'Dec 15, 2026',
    isOpen: true,
    postedAt: '2 days ago'
  },
  {
    id: 'rec_pb_01',
    clubId: 'club_pointblank',
    clubName: 'POINTBLANK',
    title: 'Annual Developer & Problem Setter Recruitment',
    roles: ['Competitive Programmer (DSA)', 'Full Stack Developer', 'DevOps & Cloud Lead', 'Design & UI/UX'],
    description: 'Join Pointblank core team to organize collegiate hackathons, build open-source tools, and mentor juniors.',
    eligibility: 'All years and branches. Familiarity with GitHub and problem-solving.',
    deadline: 'Dec 12, 2026',
    isOpen: true,
    postedAt: 'Yesterday'
  },
  {
    id: 'rec_cpa_01',
    clubId: 'club_cpa',
    clubName: 'CPA',
    title: 'CPA Executive Council & Coding Mentors Induction',
    roles: ['Algorithm Designer', 'Python & AI Engineer', 'Technical Content Writer', 'Outreach Lead'],
    description: 'Conduct coding bootcamps and algorithmic contest curation.',
    eligibility: 'Open to all DSCE students.',
    deadline: 'Dec 20, 2026',
    isOpen: true,
    postedAt: 'Today'
  }
];

export const initialClubEvents: ClubEventItem[] = [
  {
    id: 'evt_aegis_01',
    clubId: 'club_aegis',
    clubName: 'AEGIS',
    title: 'RootTheBox: Live Capture The Flag (CTF) Bootcamp',
    date: 'Nov 28, 2026',
    time: '02:00 PM - 05:00 PM',
    venue: 'CDS10 Systems & Cyber Security Lab',
    description: 'Hands-on training covering reverse engineering, binary exploitation, and steganography challenges.',
    registrationLink: 'https://aegis.dsce.in/ctf-bootcamp',
    type: 'WORKSHOP'
  },
  {
    id: 'evt_pb_01',
    clubId: 'club_pointblank',
    clubName: 'POINTBLANK',
    title: 'Graph Algorithms & Dynamic Programming Masterclass',
    date: 'Dec 02, 2026',
    time: '04:00 PM - 06:00 PM',
    venue: 'CS Seminar Hall 201',
    description: 'Deep dive into advanced graph traversals, shortest paths, and DP optimizations for placement tests.',
    registrationLink: 'https://pointblank.club/masterclass',
    type: 'TALK'
  },
  {
    id: 'evt_cpa_01',
    clubId: 'club_cpa',
    clubName: 'CPA',
    title: 'Building Production Microservices with Go & Docker',
    date: 'Dec 05, 2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Central Innovation Lab',
    description: 'Hands-on architectural workshop building concurrent RESTful services in Golang.',
    registrationLink: 'https://cpa-dsce.org/workshop',
    type: 'BOOTCAMP'
  }
];

export const initialClubHackathons: ClubHackathonItem[] = [
  {
    id: 'hack_pb_01',
    clubId: 'club_pointblank',
    clubName: 'POINTBLANK',
    title: 'CodeBlaze 2026: 36-Hour National Collegiate Hackathon',
    date: 'Jan 16 - 18, 2027',
    mode: 'OFFLINE',
    prizePool: '₹1,50,000 + Internship Opportunities',
    registrationDeadline: 'Dec 25, 2026',
    problemStatements: 'FinTech, Web3, Smart Campus Solutions, HealthTech, AI Agents & Edge Computing',
    registrationLink: 'https://codeblaze.pointblank.club'
  },
  {
    id: 'hack_aegis_01',
    clubId: 'club_aegis',
    clubName: 'AEGIS',
    title: 'CyberShield CTF & DefCon Qualifier Hack',
    date: 'Jan 22, 2027',
    mode: 'HYBRID',
    prizePool: '₹75,000 + Bug Bounty Badges',
    registrationDeadline: 'Jan 10, 2027',
    problemStatements: 'Zero-Day Vulnerability Patching, SCADA Network Security, Cryptographic Protocol Break',
    registrationLink: 'https://cybershield.aegis.in'
  },
  {
    id: 'hack_cpa_01',
    clubId: 'club_cpa',
    clubName: 'CPA',
    title: 'AlgoSprint: Real-Time Algorithm Optimization Contest',
    date: 'Dec 18, 2026',
    mode: 'ONLINE',
    prizePool: '₹35,000 + Sponsored Cloud Credits',
    registrationDeadline: 'Dec 14, 2026',
    problemStatements: 'High-Frequency Trading Engine Latency, Route Optimization, Memory-Constrained Indexing',
    registrationLink: 'https://algosprint.cpa.org'
  }
];

export const initialClubApplications: ClubApplication[] = [
  {
    id: 'app_01',
    clubId: 'club_aegis',
    clubName: 'AEGIS',
    studentId: 'usr_keerthi_001',
    studentName: 'Keerthi V.',
    rollNumber: '24CY042',
    email: 'keerthi.v@campus.edu',
    department: 'Cyber Security Engineering',
    semester: 3,
    roleApplied: 'Vulnerability Analyst',
    githubOrPortfolio: 'https://github.com/KeerthiV',
    whyJoin: 'Passionate about binary analysis, active participant in HackTheBox and room challenges.',
    pastExperience: 'Built packet inspector tool with Wireshark and Scapy in Python.',
    status: 'PENDING',
    submittedAt: 'Today, 10:15 AM'
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp_01',
    title: 'Summer Research Fellowship 2027',
    organization: 'Indian Institute of Science (IISc)',
    type: 'RESEARCH',
    stipendOrPrize: '₹12,000 / month + Accommodation',
    departmentEligibility: ['CSE', 'ECE', 'Mech', 'Civil'],
    minCgpa: 8.0,
    deadline: 'Nov 15, 2026',
    skills: ['Python', 'Data Analysis', 'Research Writing'],
    description: 'Two-month funded research fellowship working directly under IISc faculties in machine learning and robotics.',
    isSaved: true,
    applicationStatus: 'APPLIED',
  },
  {
    id: 'opp_02',
    title: 'Smart India Hackathon (SIH 2026) College Nominations',
    organization: 'Ministry of Education & Innovation Cell',
    type: 'HACKATHON',
    stipendOrPrize: '₹1,00,000 per problem statement',
    departmentEligibility: ['All Departments'],
    deadline: 'Oct 22, 2026',
    skills: ['Full Stack', 'Mobile Dev', 'IoT', 'AI/ML'],
    description: 'Submit your 6-member team idea for college internal evaluation to secure state and national nominations.',
    isSaved: true,
    applicationStatus: 'NOT_APPLIED',
  },
  {
    id: 'opp_03',
    title: 'Software Engineering Intern — Summer 2027',
    organization: 'Atlassian India',
    type: 'INTERNSHIP',
    stipendOrPrize: '₹1,20,000 / month',
    departmentEligibility: ['CSE', 'IT', 'ECE'],
    minCgpa: 7.5,
    deadline: 'Oct 30, 2026',
    skills: ['Java', 'C++', 'Data Structures', 'System Design'],
    description: 'Work with the Jira or Confluence engineering teams on scalable microservices and collaboration tools.',
    isSaved: false,
    applicationStatus: 'NOT_APPLIED',
  }
];

export const initialProjects: ProjectListing[] = [
  {
    id: 'proj_01',
    title: 'Autonomous Campus EV Shuttle Dispatcher & Tracker',
    ownerId: 'usr_keerthi_001',
    ownerName: 'Keerthi V. (You)',
    description: 'Building an IoT and mobile app system to dynamically dispatch campus electric golf carts based on student pickup demand.',
    stage: 'PROTOTYPING',
    requiredSkills: ['Flutter', 'Node.js', 'WebSockets', 'Raspberry Pi'],
    openSlots: 2,
    currentMembersCount: 2,
    applicants: [
      {
        userId: 'usr_rahul_004',
        userName: 'Rahul Nair (3rd Year ECE)',
        skills: ['Embedded C', 'Hardware IoT', 'PCB Design'],
        pitch: 'I built an OBD-II telematics tracker last semester. Would love to handle the hardware GPS integration!',
        status: 'PENDING',
      }
    ],
    tasks: [
      { id: 'tsk_1', title: 'Connect GPS module to MQTT broker', assignee: 'Keerthi', done: true },
      { id: 'tsk_2', title: 'Design live map UI in Flutter', assignee: 'Open', done: false },
      { id: 'tsk_3', title: 'Deploy routing optimization algorithm', assignee: 'Keerthi', done: false },
    ]
  },
  {
    id: 'proj_02',
    title: 'AI Exam Prep Synthesizer from Lecture Audio',
    ownerId: 'usr_tanmay_007',
    ownerName: 'Tanmay Saxena (4th Year CSE)',
    description: 'Open source project to transcribe classroom recordings using Whisper and generate concise flashcards and cheat sheets for exam prep.',
    stage: 'HACKATHON',
    requiredSkills: ['Python', 'OpenAI Whisper', 'FastAPI', 'Next.js'],
    openSlots: 1,
    currentMembersCount: 3,
    applicants: [],
    tasks: [
      { id: 'tsk_4', title: 'Benchmark transcription accuracy', assignee: 'Tanmay', done: true },
      { id: 'tsk_5', title: 'Build export to Anki flashcards', assignee: 'Tanmay', done: false },
    ]
  }
];

export const initialMarketplace: MarketplaceItem[] = [
  {
    id: 'mkt_01',
    sellerId: 'usr_vikram_005',
    sellerName: 'Vikram Joshi',
    sellerRoll: '21ME042',
    type: 'SELL',
    category: 'CALCULATOR',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator (Mint Condition)',
    description: 'Graduating senior selling my genuine Casio ClassWiz. Perfect for all engineering semesters, matrix operations, complex numbers, and integration. Comes with original protective slide-on case.',
    price: 650,
    photos: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: 'Yesterday',
    contactPhone: '+91 98452 33412',
    contactEmail: 'vikram.j@campus.edu'
  },
  {
    id: 'mkt_02',
    sellerId: 'usr_anjali_008',
    sellerName: 'Anjali Sharma',
    sellerRoll: '22CS019',
    type: 'SELL',
    category: 'BOOKS',
    title: 'Operating System Concepts (Silberschatz, Galvin, Gagne) 10th Edition',
    description: 'Essential textbook for 3rd Sem OS course (1BCY303). Comprehensive notes on process scheduling, semaphores, virtual memory, and file systems. Crisp condition with no pen marks.',
    price: 490,
    photos: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: '2 days ago',
    contactPhone: '+91 97418 55432',
    contactEmail: 'anjali.s@campus.edu'
  },
  {
    id: 'mkt_03',
    sellerId: 'usr_keerthi_001',
    sellerName: 'Keerthi V. (You)',
    sellerRoll: '24CY042',
    type: 'SELL',
    category: 'BOOKS',
    title: 'Higher Engineering Mathematics - Dr. B.S. Grewal (44th Edition)',
    description: 'Complete syllabus textbook for 1BMAT31A Probability, Statistics & Complex Analysis. Includes step-by-step solved VTU previous year questions and practice problem sets.',
    price: 420,
    photos: ['https://images.unsplash.com/photo-1532012164546-f432f2e37271?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: 'Today',
    contactPhone: '+91 99001 88765',
    contactEmail: 'keerthi.v@campus.edu'
  },
  {
    id: 'mkt_04',
    sellerId: 'usr_rohit_012',
    sellerName: 'Rohit Kulkarni',
    sellerRoll: '23CY018',
    type: 'SELL',
    category: 'BOOKS',
    title: 'Introduction to Algorithms (CLRS) 4th Edition - MIT Press',
    description: 'Standard textbook for Data Structures & Applications (1BCY304). Covers Red-Black trees, dynamic programming, graph algorithms, and amortized analysis.',
    price: 680,
    photos: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: 'Yesterday',
    contactPhone: '+91 98860 99421',
    contactEmail: 'rohit.k@campus.edu'
  },
  {
    id: 'mkt_05',
    sellerId: 'usr_deepa_015',
    sellerName: 'Deepa Nayak',
    sellerRoll: '23EC033',
    type: 'SELL',
    category: 'BOOKS',
    title: 'Digital Design: With an Introduction to Verilog HDL (M. Morris Mano)',
    description: 'Reference book for 1BCY305 Digital Design & Computer Architecture (DDCA). Complete with Karnaugh maps, sequential logic, flip-flop registers, and finite state machines.',
    price: 380,
    photos: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: '3 days ago',
    contactPhone: '+91 94481 77209',
    contactEmail: 'deepa.n@campus.edu'
  },
  {
    id: 'mkt_06',
    sellerId: 'usr_pranav_009',
    sellerName: 'Pranav K.',
    sellerRoll: '23EC091',
    type: 'BORROW',
    category: 'ELECTRONICS',
    title: 'Arduino Sensor Pack & Jumper Wires (Borrow for 1 Week)',
    description: 'Lending my sensor kit (ultrasonic, PIR, servo motors, breadboard) for mini-project evaluations.',
    price: 0,
    photos: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: 'Today',
    contactPhone: '+91 96112 44321',
    contactEmail: 'pranav.k@campus.edu'
  }
];

export const initialLostAndFound: LostAndFoundItem[] = [
  {
    id: 'lnf_01',
    posterId: 'usr_deepak_010',
    posterName: 'Deepak S. (Found by student)',
    type: 'FOUND',
    category: 'ELECTRONICS',
    title: 'Apple AirPods Pro (2nd Gen) in White Case',
    description: 'Found left behind on the wooden study desk on the 2nd floor silent reading zone of the Central Library.',
    locationArea: 'Central Library, 2nd Floor Study Cubicle',
    incidentDate: 'Today, 11:15 AM',
    secretChallengeQuestion: 'What cartoon sticker is on the back side of the charging case, and what color is the lanyard strap?',
    status: 'OPEN',
  },
  {
    id: 'lnf_02',
    posterId: 'usr_keerthi_001',
    posterName: 'Keerthi V. (You)',
    type: 'LOST',
    category: 'KEYS',
    title: 'Set of 2 Room Keys with Blue Campus Lanyard',
    description: 'Lost somewhere between the CS Block canteen and Hostel B basketball court after 5:00 PM yesterday.',
    locationArea: 'Canteen to Hostel B pathway',
    incidentDate: 'Yesterday, 05:30 PM',
    secretChallengeQuestion: 'What metal logo charm is attached with the keys?',
    status: 'OPEN',
  },
  {
    id: 'lnf_03',
    posterId: 'usr_security_001',
    posterName: 'Main Gate Security Office',
    type: 'FOUND',
    category: 'ID_CARD',
    title: 'Student ID Card: Siddharth M. (23EC044)',
    description: 'Found at the main campus bus terminus. Deposited at Security Post #1.',
    locationArea: 'Campus Main Entrance Gate',
    incidentDate: '2 days ago',
    secretChallengeQuestion: 'State your student date of birth or show government ID proof.',
    status: 'RETURNED',
    claimedBy: 'Siddharth M.',
  }
];

export const initialLibraryBooks: LibraryBook[] = [
  {
    id: 'lib_01',
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (CLRS)',
    authors: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Computer Science',
    shelfLocation: 'Stack 4B • Shelf 12',
    totalCopies: 12,
    availableCopies: 3,
    isBorrowedByMe: false,
  },
  {
    id: 'lib_02',
    isbn: '978-0132350884',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    authors: 'Robert C. Martin',
    category: 'Software Engineering',
    shelfLocation: 'Stack 4A • Shelf 03',
    totalCopies: 6,
    availableCopies: 0,
    isBorrowedByMe: true,
    dueDate: 'Oct 14, 2026 (In 7 days)',
  },
  {
    id: 'lib_03',
    isbn: '978-1449373320',
    title: 'Designing Data-Intensive Applications',
    authors: 'Martin Kleppmann',
    category: 'Systems & Architecture',
    shelfLocation: 'Stack 5C • Shelf 08',
    totalCopies: 8,
    availableCopies: 2,
    isBorrowedByMe: false,
  },
  {
    id: 'lib_04',
    isbn: '978-0133591620',
    title: 'Operating System Concepts (10th Ed)',
    authors: 'Silberschatz, Galvin, Gagne',
    category: 'Operating Systems',
    shelfLocation: 'Stack 4B • Shelf 09',
    totalCopies: 15,
    availableCopies: 5,
    isBorrowedByMe: false,
  }
];

export const mockHostelMessMenu: Record<string, MessMeal> = {
  Monday: {
    breakfast: 'Idli & Medu Vada, Coconut Chutney, Sambar, Filter Coffee / Tea',
    lunch: 'Jeera Rice, Dal Tadka, Paneer Butter Masala, Roti, Fresh Curd, Salad',
    snacks: 'Samosa, Mint Chutney, Hot Tea',
    dinner: 'Phulka, Aloo Gobi, Mixed Veg Pulao, Dal Makhani, Gulab Jamun',
  },
  Tuesday: {
    breakfast: 'Poha with Sev & Peanuts, Boiled Eggs / Banana, Tea / Coffee',
    lunch: 'Steamed Basmati Rice, Rajma Masala, Bhindi Fry, Chapati, Buttermilk',
    snacks: 'Veg Cutlet, Tomato Sauce, Tea',
    dinner: 'Egg Curry / Malai Kofta, Steamed Rice, Roti, Yellow Dal, Ice Cream',
  },
  Wednesday: {
    breakfast: 'Masala Dosa, Potato Masala, Tomato Chutney, Sambar, Coffee',
    lunch: 'Veg Biryani / Chicken Biryani (Special), Mirchi Ka Salan, Raita',
    snacks: 'Pav Bhaji, Lemon & Onions, Masala Chai',
    dinner: 'Chapati, Kadai Paneer / Chana Masala, Jeera Rice, Dal Fry, Kheer',
  },
  Thursday: {
    breakfast: 'Upma with Coconut Chutney, Sheera (Kesari), Tea / Coffee',
    lunch: 'Steamed Rice, South Indian Sambar, Rasam, Potato Roast, Curd',
    snacks: 'Biscuits & Banana, Filter Coffee',
    dinner: 'Veg Fried Rice, Chilli Paneer Gravy, Hakka Noodles, Soup',
  },
  Friday: {
    breakfast: 'Aloo Paratha with Amul Butter, Curd & Pickle, Tea',
    lunch: 'Roti, Dal Palak, Dum Aloo Kashmiri, Steamed Rice, Papad',
    snacks: 'Mirchi Bajji / Onion Pakoda, Green Chutney, Chai',
    dinner: 'Butter Naan, Paneer Tikka Masala / Fish Curry, Pulao, Rasgulla',
  },
  Saturday: {
    breakfast: 'Puri with Potato Saggu / Chana Masala, Halwa, Coffee',
    lunch: 'Lemon Rice, Curd Rice, Potato Fry, Pickle, Crisp Papads',
    snacks: 'Bread Roll, Tomato Sauce, Tea',
    dinner: 'Phulka, Dal Tadka, Mixed Vegetable Curry, Steamed Rice',
  },
  Sunday: {
    breakfast: 'Chole Bhature, Sweet Lassi / Coffee',
    lunch: 'Special Sunday Feast: Paneer Lababdar, Hyderabadi Pulao, Raita, Rasmalai',
    snacks: 'Cake Slice / Cookies, Hot Coffee',
    dinner: 'Light Khichdi, Kadhi, Papad, Pickle, Seasonal Fresh Fruit',
  }
};

export const initialAnnouncements: OfficialAnnouncement[] = [
  {
    id: 'ann_01',
    title: 'OFFICIAL NOTICE: 3rd Internal Assessment Test (IAT-III) Schedule & Eligibility',
    source: 'Office of Dean Academics & Controller of Examinations',
    category: 'ACADEMIC',
    publishedAt: 'Today, Official Circular',
    content: 'Official notice : 3rd internal starts at 8th dec , only 75% attendance students will be able to write the internals. Strict eligibility checks will be enforced at all examination halls.',
    isImportant: true,
    read: false,
  },
  {
    id: 'ann_02',
    title: 'UG Calendar of Events Odd Semester 2026-27 Approved',
    source: 'Office of the Principal & COE',
    category: 'ACADEMIC',
    publishedAt: 'Yesterday, 04:30 PM',
    content: 'The official calendar of events for 3rd and 5th Semester is now available in the Academic Calendar page. Final CIE submission is scheduled for Dec 18th with semester-end exams commencing Dec 21st onwards.',
    isImportant: true,
    read: false,
  },
  {
    id: 'ann_03',
    title: 'Scheduled Campus Fiber-Optic & Wi-Fi Maintenance Window',
    source: 'Campus Information Technology Center',
    category: 'CRITICAL',
    publishedAt: '2 days ago',
    content: 'Planned core switch upgrade will take place on Saturday midnight (01:00 AM - 05:00 AM). Internet and local Intranet services across hostels and academic blocks will experience intermittent outages during this window.',
    isImportant: false,
    read: true,
  }
];

export const campusKnowledgeBase: CampusKnowledgeChunk[] = [
  {
    id: 'kb_01',
    documentTitle: 'Academic Regulations & Student Handbook 2025-26',
    section: 'Clause 4.3 — Attendance Requirement & Condonation Rules',
    pageNumber: 14,
    content: 'A candidate must secure a minimum of 75% attendance in aggregate of all subjects to be eligible to appear for the end-semester examinations. Condonation of shortage of attendance between 65% and 74% may be granted by the Academic Council solely on medical grounds (requiring authorized government hospital medical certificate submitted within 3 days of resuming classes) and payment of prescribed condonation fee of ₹1,000 per subject. Students below 65% are detained and must repeat the semester.',
    keywords: ['attendance', 'condonation', 'medical leave', 'exam eligibility', '75 percent', 'detention']
  },
  {
    id: 'kb_02',
    documentTitle: 'Hostel Administration Manual & Code of Conduct',
    section: 'Rule 8.1 — Room Change & Hostel Reallocation Procedure',
    pageNumber: 22,
    content: 'Room reallocation requests are entertained only at the beginning of each semester or under exceptional medical grounds verified by the Chief Medical Officer. To initiate a room swap, both students must submit a joint written application countersigned by respective Block Wardens to the Chief Warden Office (Hostel Admin Block, Room 104) before the 2nd week of the semester. Mutual swaps require zero pending dues in either room.',
    keywords: ['hostel', 'room change', 'room swap', 'warden', 'hostel block', 'hostel dues']
  },
  {
    id: 'kb_03',
    documentTitle: 'Central Library User Charter & Policy',
    section: 'Section 3.2 — Borrowing Limits, Overdue Fines and Renewals',
    pageNumber: 8,
    content: 'Undergraduate students may borrow up to 4 books simultaneously for a duration of 14 calendar days. Books can be renewed online once for an additional 7 days provided there are no active reservations on the title. Overdue fine is ₹5 per day per book for the first 7 days of delay, and ₹10 per day thereafter. The maximum fine cap is ₹200 per book. No Dues clearance for semester registration will be blocked if books remain overdue.',
    keywords: ['library', 'books', 'fine', 'return', 'borrow', 'due date', 'renewal', 'no dues']
  },
  {
    id: 'kb_04',
    documentTitle: 'Student Affairs & Career Services Guidelines',
    section: 'Section 6.4 — No Objection Certificate (NOC) for External Off-Campus Internships',
    pageNumber: 31,
    content: 'Students in semesters 6, 7, and 8 securing off-campus internships must obtain an official NOC from the Training & Placement Cell. Required documentation includes: 1) Formal Offer Letter with stipend, duration, and remote/onsite details; 2) Undertaking signed by parent/guardian; 3) Department Head (HOD) recommendation approving project mapping. The application must be submitted at least 15 working days prior to the start date.',
    keywords: ['internship', 'noc', 'placement', 'offer letter', 'permission', 'off campus']
  },
  {
    id: 'kb_05',
    documentTitle: 'Hostel Administration Manual & Code of Conduct',
    section: 'Rule 5.3 — Night Out and Extended Leave Permissions',
    pageNumber: 19,
    content: 'Students desiring overnight leave from campus must submit an online e-Leave request on the campus portal before 06:00 PM on the day of departure. The digital approval link is automatically sent to the registered parent contact number. Once parental SMS/WhatsApp confirmation is logged, the biometric gate pass activates at the campus turnstiles.',
    keywords: ['night out', 'leave', 'out pass', 'gate pass', 'hostel curfew', 'parents permission']
  }
];

export const mockDirectoryStudents: UserProfile[] = [
  initialCyberSecurityStudent,
  initialCurrentUser,
  {
    id: 'usr_siddharth_002',
    name: 'Siddharth Menon',
    rollNumber: '23EC044',
    email: 'siddharth.23ec@campus.edu',
    avatarUrl: '',
    avatarColor: '#059669',
    role: 'STUDENT',
    department: 'Electronics & Communication',
    batchYear: 2027,
    semester: 4,
    hostelBlock: 'Hostel Block A',
    roomNumber: 'Room 214',
    bio: 'IoT tinkerer, embedded systems nerd, and robotics competitor. Looking for software teammates.',
    skills: ['C++', 'Embedded Systems', 'PCB Design', 'ROS', 'Python'],
    interests: ['Robotics', 'Hardware', 'Drones', 'Table Tennis'],
    collaborationGoals: ['Hackathon Teammate', 'Robotics Competition'],
    isMentor: false,
    isVerified: true,
    verificationStatus: 'APPROVED',
    privacySettings: { showEmail: false, showRoom: false, isDiscoverable: true },
  },
  {
    id: 'usr_ananya_003',
    name: 'Ananya Sharma',
    rollNumber: '21CS012',
    email: 'ananya.21cs@campus.edu',
    avatarUrl: '',
    avatarColor: '#d97706',
    role: 'SENIOR_MENTOR',
    department: 'Computer Science & Engineering',
    batchYear: 2025,
    semester: 8,
    bio: 'Incoming Software Engineer @ Microsoft. Happy to guide juniors on resume review and DSA prep.',
    skills: ['System Design', 'Java', 'Distributed Systems', 'Algorithms'],
    interests: ['Mentorship', 'Cloud Computing', 'Reading'],
    collaborationGoals: ['Mentor', 'Research Collaborator'],
    isMentor: true,
    mentorTopics: ['FAANG Interview Prep', 'Resume Roast', 'Core CS Subjects (OS, DBMS)'],
    isVerified: true,
    verificationStatus: 'APPROVED',
    privacySettings: { showEmail: false, showRoom: false, isDiscoverable: true },
  },
  {
    id: 'usr_rohan_004',
    name: 'Rohan Deshmukh',
    rollNumber: '22ME056',
    email: 'rohan.22me@campus.edu',
    avatarUrl: '',
    avatarColor: '#7c3aed',
    role: 'CLASS_REP',
    department: 'Mechanical Engineering',
    batchYear: 2026,
    semester: 6,
    bio: 'Class Representative for 3rd Year Mech. Working on solar EV chassis modeling in SolidWorks.',
    skills: ['SolidWorks', 'ANSYS', 'AutoCAD', 'MATLAB'],
    interests: ['Automotive', 'Formula Student', 'Football'],
    collaborationGoals: ['Study Buddy', 'Formula Student Team'],
    isMentor: false,
    isVerified: true,
    verificationStatus: 'APPROVED',
    privacySettings: { showEmail: false, showRoom: false, isDiscoverable: true },
  },
  {
    id: 'usr_akash_unverified',
    name: 'Akash Verma',
    rollNumber: '24CS112',
    email: 'akash.24cs@campus.edu',
    avatarUrl: '',
    avatarColor: '#dc2626',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    batchYear: 2028,
    semester: 2,
    bio: 'First year CS undergrad learning Python & Web dev.',
    skills: ['Python', 'C', 'HTML'],
    interests: ['Web Development', 'Gaming'],
    collaborationGoals: ['Study Buddy'],
    isMentor: false,
    isVerified: false,
    verificationStatus: 'PENDING_VERIFICATION',
    idCardUrl: 'https://placehold.co/600x400/1e293b/ffffff.png?text=STUDENT+ID+CARD+-+AKASH+VERMA+24CS112',
    privacySettings: { showEmail: false, showRoom: false, isDiscoverable: true },
  }
];

export const initialExamTimetable: ExamTimetableItem[] = [
  {
    id: 'ex_1',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (Maths / PS)',
    examType: 'INTERNALS',
    date: 'Dec 08, 2026',
    time: '09:30 AM - 11:00 AM (Morning Slot 1)',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    instructions: 'Internal Assessment Test 3 (IAT-III). Non-programmable calculators permitted. Minimum 75% attendance mandatory.'
  },
  {
    id: 'ex_2',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java (OPJ)',
    examType: 'INTERNALS',
    date: 'Dec 08, 2026',
    time: '02:00 PM - 03:30 PM (Evening Slot 1)',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    instructions: 'Internal Assessment Test 3 (IAT-III). Minimum 75% attendance mandatory.'
  },
  {
    id: 'ex_3',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming (OS)',
    examType: 'INTERNALS',
    date: 'Dec 09, 2026',
    time: '09:30 AM - 11:00 AM (Morning Slot 1)',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    instructions: 'Internal Assessment Test 3 (IAT-III). Minimum 75% attendance mandatory.'
  },
  {
    id: 'ex_4',
    courseCode: '1BCY304',
    courseName: 'Data Structures and Applications (DSA)',
    examType: 'INTERNALS',
    date: 'Dec 09, 2026',
    time: '02:00 PM - 03:30 PM (Evening Slot 1)',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    instructions: 'Internal Assessment Test 3 (IAT-III). Minimum 75% attendance mandatory.'
  },
  {
    id: 'ex_5',
    courseCode: '1BCY305',
    courseName: 'Digital Design & Computer Architecture (DDCA)',
    examType: 'INTERNALS',
    date: 'Dec 10, 2026',
    time: '09:30 AM - 11:00 AM (Morning Slot 1)',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    instructions: 'Internal Assessment Test 3 (IAT-III). Minimum 75% attendance mandatory.'
  }
];

export const initialAcademicCalendar: AcademicCalendarItem[] = [
  {
    id: 'cal_1',
    title: 'Course Registration & Commencement of Classes',
    date: 'Aug 24 - 28, 2026',
    category: 'SEMESTER',
    description: 'Odd Semester commencement for 3rd and 5th Semester UG programmes. Course registration via college portal.',
    isMilestone: true
  },
  {
    id: 'cal_2',
    title: 'Internal Assessment Test 1 (IAT-I)',
    date: 'Sep 28 - 30, 2026',
    category: 'EXAM',
    description: 'Centralized 1st Internal Assessment Test across all departments.',
    isMilestone: true
  },
  {
    id: 'cal_3',
    title: 'Display of IAT 1 Marks',
    date: 'Oct 07, 2026',
    category: 'DEADLINE',
    description: 'Faculty grievance redressal and portal entry of IAT-1 evaluated marks.',
    isMilestone: false
  },
  {
    id: 'cal_4',
    title: 'Internal Assessment Test 2 (IAT-II)',
    date: 'Nov 03 - 05, 2026',
    category: 'EXAM',
    description: 'Centralized 2nd Internal Assessment Test across all departments.',
    isMilestone: true
  },
  {
    id: 'cal_5',
    title: 'Display of IAT 2 Marks',
    date: 'Nov 12, 2026',
    category: 'DEADLINE',
    description: 'Portal entry and student verification of IAT-2 scorecards.',
    isMilestone: false
  },
  {
    id: 'cal_6',
    title: 'Internal Assessment Test 3 (IAT-III) — 75% Attendance Required',
    date: 'Dec 08 - 10, 2026',
    category: 'EXAM',
    description: 'Final Internal Assessment Test. Theory: Maths, OPJ, OS, DSA, DDCA. Minimum 75% attendance mandatory.',
    isMilestone: true
  },
  {
    id: 'cal_7',
    title: 'Laboratory Internal Assessment & Practical Exams',
    date: 'Dec 12 - 17, 2026',
    category: 'EXAM',
    description: 'Practical lab exam window, viva-voce, and lab record evaluation.',
    isMilestone: true
  },
  {
    id: 'cal_8',
    title: 'Course End Survey Window',
    date: 'Dec 14 - 16, 2026',
    category: 'EVENT',
    description: 'Mandatory student feedback and course outcome survey on college portal.',
    isMilestone: false
  },
  {
    id: 'cal_9',
    title: 'Display of IAT 3 Marks',
    date: 'Dec 15, 2026',
    category: 'DEADLINE',
    description: 'Announcement of IAT-3 performance scores by respective department faculties.',
    isMilestone: false
  },
  {
    id: 'cal_10',
    title: 'Submission of CIE Marks & Attendance to COE / Last Working Day',
    date: 'Dec 18, 2026',
    category: 'DEADLINE',
    description: 'Final submission of Continuous Internal Evaluation (CIE) and attendance to COE Office. Last working day for odd semester.',
    isMilestone: true
  },
  {
    id: 'cal_11',
    title: 'Semester End Theory Examinations (Tentative)',
    date: 'Dec 21, 2026 Onwards',
    category: 'EXAM',
    description: 'VTU Autonomous Semester End Final Theory Examinations commence.',
    isMilestone: true
  }
];

export const initialCommunities: InterestCommunity[] = [
  {
    id: 'comm_ai',
    name: 'AI & Systems Research Guild',
    category: 'TECH',
    description: 'Weekly reading group on LLM architectures, distributed training systems, and paper discussions.',
    memberCount: 42,
    leaderName: 'Ananya Sharma',
    isJoined: true
  },
  {
    id: 'comm_web3',
    name: 'Open Source Builders Collective',
    category: 'OPEN_SOURCE',
    description: 'Collaborative development on student civic tech, campus tools, and GSOC / LFX mentorship prep.',
    memberCount: 38,
    leaderName: 'Keerthi V.',
    isJoined: true
  },
  {
    id: 'comm_cp',
    name: 'Competitive Programming League',
    category: 'COMPETITIVE_CODING',
    description: 'ICPC aspirants, bi-weekly mock contests, advanced DP/Graph problem solving sessions.',
    memberCount: 65,
    leaderName: 'Siddharth Menon',
    isJoined: false
  },
  {
    id: 'comm_robotics',
    name: 'Aeromodelling & Drone Robotics Lab',
    category: 'ROBOTICS',
    description: 'Hardware hacking, autonomous flight controllers, computer vision on ROS2.',
    memberCount: 29,
    leaderName: 'Rohan Deshmukh',
    isJoined: false
  }
];

export const initialProjectShowcases: ProjectShowcase[] = [
  {
    id: 'show_1',
    title: 'SmartMess: AI Food Waste & Quality Telemetry',
    summary: 'Computer vision camera deployed over waste bins and dining hall trays tracking plate wastage and real-time meal rating.',
    authors: 'Keerthi V., Siddharth Menon',
    demoUrl: 'https://smartmess.campus.edu',
    repoUrl: 'https://github.com/campus/smartmess',
    category: 'IoT & Civic Tech',
    stars: 34,
    tags: ['Python', 'YOLOv8', 'FastAPI', 'React'],
    submittedAt: '2026-02-14'
  },
  {
    id: 'show_2',
    title: 'Formula Student Solar Telemetry Dashboard',
    summary: 'CAN-bus real-time telemetry streaming battery pack thermals and motor RPM over MQTT to a live pitwall dashboard.',
    authors: 'Rohan Deshmukh, Team Pravega',
    repoUrl: 'https://github.com/campus/solar-telemetry',
    category: 'Hardware & Automotive',
    stars: 28,
    tags: ['C++', 'MQTT', 'Electron', 'SolidWorks'],
    submittedAt: '2026-02-20'
  }
];

export const initialDirectMessages: DirectMessage[] = [
  {
    id: 'dm_1',
    senderId: 'usr_siddharth_002',
    receiverId: 'usr_keerthi_001',
    senderName: 'Siddharth Menon',
    content: 'Hey Keerthi, is the DBMS Korth book still available for pickup at Hostel Block B?',
    createdAt: '2026-03-01T10:15:00Z',
    itemContext: 'Database System Concepts (Korth 7th Ed.)'
  },
  {
    id: 'dm_2',
    senderId: 'usr_keerthi_001',
    receiverId: 'usr_siddharth_002',
    senderName: 'Keerthi V.',
    content: 'Yes! It is in mint condition. You can drop by around 6 PM near the common room.',
    createdAt: '2026-03-01T10:20:00Z',
    itemContext: 'Database System Concepts (Korth 7th Ed.)'
  }
];

export const initialConnectionRequests: ConnectionRequest[] = [
  {
    id: 'cr_1',
    senderId: 'usr_siddharth_002',
    senderName: 'Siddharth Menon',
    senderRoll: '23EC044',
    senderDept: 'Electronics & Communication',
    targetUserId: 'usr_keerthi_001',
    type: 'COLLABORATION',
    note: 'Would love to team up on the Smart Campus IoT hackathon project!',
    status: 'PENDING',
    createdAt: '2026-03-01T08:00:00Z'
  },
  {
    id: 'cr_2',
    senderId: 'usr_akash_unverified',
    senderName: 'Akash Verma',
    senderRoll: '24CS112',
    senderDept: 'Computer Science',
    targetUserId: 'usr_keerthi_001',
    type: 'MENTORSHIP',
    note: 'Hi Senior! Seeking mentorship on Frontend Dev & React roadmap for 2nd semester.',
    status: 'PENDING',
    createdAt: '2026-03-01T09:30:00Z'
  }
];

export const initialItemReports: ItemReport[] = [
  {
    id: 'rep_1',
    itemId: 'item_01',
    itemTitle: 'Database System Concepts (Korth 7th Ed.)',
    itemType: 'MARKETPLACE',
    reporterId: 'usr_rohan_004',
    reporterName: 'Rohan Deshmukh',
    reason: 'Price gouging or duplicate listing',
    details: 'Seller listed this twice with differing prices.',
    status: 'PENDING',
    createdAt: '2026-03-01T11:00:00Z'
  }
];

export const initialMessReports: MessFoodReport[] = [
  {
    id: 'mfr_1',
    studentId: 'usr_keerthi_001',
    studentName: 'Keerthi V.',
    messBlock: 'Hostel Block B Central Mess',
    mealType: 'LUNCH',
    category: 'HYGIENE',
    severity: 'HIGH',
    description: 'Undercooked rice and spotted hygiene issue with washing water near counter 2.',
    status: 'ESCALATED',
    createdAt: '2026-03-01T13:45:00Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud_1',
    actorId: 'usr_admin_001',
    actorName: 'Dr. Radhakrishnan S. (Dean / Admin)',
    action: 'USER_VERIFIED',
    targetEntity: 'usr_keerthi_001',
    details: 'Verified student ID card against institute master roll 22CS084.',
    timestamp: '2026-01-10T10:00:00Z'
  },
  {
    id: 'aud_2',
    actorId: 'usr_admin_001',
    actorName: 'Dr. Radhakrishnan S. (Dean / Admin)',
    action: 'POLICY_UPDATE',
    targetEntity: 'Academic Regulations 2026',
    details: 'Published mandatory 75% attendance policy amendment and exam timetable.',
    timestamp: '2026-01-15T14:30:00Z'
  }
];

export const DEMO_LOGIN_ACCOUNTS: DemoLoginAccount[] = [
  {
    id: 'demo_cyber_student',
    role: 'STUDENT',
    title: 'Cyber Security (Sem 3) Student',
    badge: 'Sem 3 • Cyber',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
    description: 'Enrolled in Cyber Security Semester 3. View room CDS10-104 weekly timetable, labs (A1/A2/A3), and course schedule.',
    credentials: {
      identifier: '24CY042',
      password: 'cyber123'
    },
    user: initialCyberSecurityStudent,
    allowedFeatures: [
      'Dashboard (Timetable & Lectures)',
      'Academics (Sem 3 Timetable, Courses & Labs)',
      'Assignments & Submissions',
      'Println Hub (4-Step Xerox Queue)',
      'Clubs & Chapters (AEGIS, Pointblank, CPA)',
      'Marketplace & Lost and Found'
    ],
    restrictedFeatures: [
      'Faculty Gradebook Controls',
      'Administrative Verifications'
    ],
    primaryTab: 'dashboard'
  },
  {
    id: 'demo_faculty',
    role: 'FACULTY',
    title: 'Faculty / Professor Portal',
    badge: 'Faculty • CSE/Cyber',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
    description: 'Create & manage course assignments, upload syllabus (PDF/pics/text notes), and review student submissions.',
    credentials: {
      identifier: 'dr.padmavati',
      password: 'faculty123'
    },
    user: {
      id: 'usr_faculty_padmavati',
      name: 'Dr. Padmavati S.',
      rollNumber: 'FAC-CY-012',
      email: 'dr.padmavati@campus.edu',
      avatarUrl: '',
      avatarColor: '#4f46e5',
      role: 'FACULTY',
      department: 'Department of Information Science & Cyber Security',
      batchYear: 2015,
      semester: 0,
      bio: 'Professor, Department of Information Science & Cyber Security. Course Lead for Operating Systems & Linux System Programming.',
      skills: ['Operating Systems', 'Linux Kernel', 'Distributed Systems', 'Academic Evaluation'],
      interests: ['Systems Architecture', 'Cyber Forensics'],
      collaborationGoals: [],
      isMentor: true,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Assignment Creator & File Attachment',
      'Student Submissions Review & Grading',
      'Course Syllabus Upload (PDF / Image / Text)',
      'Continuous Internal Evaluation (CIE) Tracker'
    ],
    restrictedFeatures: [
      'Hostel Room Maintenance Desk',
      'Print Hub Order Management'
    ],
    primaryTab: 'academics'
  },
  {
    id: 'demo_student',
    role: 'STUDENT',
    title: 'Student Portal',
    badge: 'Undergraduate',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    description: 'Access courses, project workspace, marketplace, lost & found, and student services.',
    credentials: {
      identifier: '22CS084',
      password: 'student123'
    },
    user: initialCurrentUser,
    allowedFeatures: [
      'Dashboard & Official Announcements',
      'Academics (Exams, Assignments, Timetable)',
      'Peer Discovery & Mentorship',
      'Projects Collaboration Workspace',
      'Println Xerox Express',
      'Marketplace & Lost and Found'
    ],
    restrictedFeatures: [
      'Administrative Verifications',
      'Print Hub Order Management'
    ],
    primaryTab: 'dashboard'
  },
  {
    id: 'demo_println',
    role: 'PRINT_ADMIN',
    title: 'Println Xerox Operator',
    badge: 'Hub Operator',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    description: 'Manage 4-step print queue, advance process states, real print docket dispatch, and price rates.',
    credentials: {
      identifier: 'print.admin',
      password: 'print123'
    },
    user: {
      id: 'usr_println_001',
      name: 'Ramesh Sharma (Print Hub)',
      rollNumber: 'PRN-HUB-01',
      email: 'println@campus.edu',
      avatarUrl: '',
      avatarColor: '#d97706',
      role: 'PRINT_ADMIN',
      department: 'DSCE Main Xerox Shop & Reprographics',
      batchYear: 2020,
      semester: 0,
      bio: 'Operator at DSCE Main Xerox Shop & Central Library Reprographics Center.',
      skills: ['Reprographics', 'Lamination', 'Spiral Binding', 'Tape Binding'],
      interests: ['Customer Service', 'Campus Logistics'],
      collaborationGoals: [],
      isMentor: false,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      '4-Step Print Queue Triage',
      'Advance Process Status (Queued -> Processing -> Ready)',
      'Direct Print Docket (window.print)',
      'Fixed Price Rate Adjustments (B&W ₹3/page)'
    ],
    restrictedFeatures: [
      'Campus Issues & SLA',
      'Student Gradebook & Timetable'
    ],
    primaryTab: 'print_admin'
  },
  {
    id: 'demo_facility',
    role: 'FACILITY_STAFF',
    title: 'Facility Technician',
    badge: 'Maintenance',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Resolve campus infrastructure, electrical, plumbing, lab equipment, and classroom fixtures.',
    credentials: {
      identifier: 'facility.staff',
      password: 'facility123'
    },
    user: {
      id: 'usr_facility_001',
      name: 'Manoj Kumar (Facility Staff)',
      rollNumber: 'FAC-ENG-08',
      email: 'facility@campus.edu',
      avatarUrl: '',
      avatarColor: '#059669',
      role: 'FACILITY_STAFF',
      department: 'Estate & Campus Maintenance Division',
      batchYear: 2018,
      semester: 0,
      bio: 'Senior Electrical & Facilities Maintenance Supervisor.',
      skills: ['HVAC', 'Electrical Wiring', 'Plumbing Diagnostics', 'Lab Maintenance'],
      interests: ['Facility Management', 'Safety Auditing'],
      collaborationGoals: [],
      isMentor: false,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Campus Maintenance Issues Queue',
      'Technician Work Orders & Field Notes',
      'Resolution Status Updates'
    ],
    restrictedFeatures: [
      'Hostel Room Allotments & Mess Management',
      'Academics & Faculty Grading',
      'Student ID Approvals'
    ],
    primaryTab: 'issues'
  },
  {
    id: 'demo_admin',
    role: 'CAMPUS_ADMIN',
    title: 'Campus Administration / Dean',
    badge: 'Dean Office',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    description: 'Executive oversight portal containing Executive Admin & SLA, Campus Issues & SLA, and Opportunities.',
    credentials: {
      identifier: 'admin.dean',
      password: 'admin123'
    },
    user: {
      id: 'usr_admin_001',
      name: 'Dr. Radhakrishnan S. (Dean / Admin)',
      rollNumber: 'ADM-DEAN-001',
      email: 'dean.admin@campus.edu',
      avatarUrl: '',
      avatarColor: '#7c3aed',
      role: 'CAMPUS_ADMIN',
      department: 'Office of Academic Affairs & Administration',
      batchYear: 2012,
      semester: 0,
      bio: 'Dean of Student Affairs & Campus Administration. Overseeing institutional policies, SLA targets, and campus governance.',
      skills: ['Campus Governance', 'Academic Policy', 'Executive SLA Management'],
      interests: ['Higher Education Strategy', 'Institutional Governance'],
      collaborationGoals: [],
      isMentor: false,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Executive Admin & SLA Analytics',
      'Campus Issues & SLA Oversight',
      'Campus Opportunities Management'
    ],
    restrictedFeatures: [
      'Mess Food Kitchen Operations',
      'Hostel Cleaning Scheduling'
    ],
    primaryTab: 'admin'
  },
  {
    id: 'demo_club_aegis',
    role: 'CLUB_LEADER',
    title: 'AEGIS Club Admin',
    badge: 'Club Admin • AEGIS',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
    description: 'Manage AEGIS Cyber Security club recruitments, post events and hackathons, review student applications online.',
    credentials: {
      identifier: 'aegis.admin',
      password: 'aegis123'
    },
    user: {
      id: 'usr_club_aegis',
      name: 'Aditya Sharma (AEGIS Admin)',
      rollNumber: 'CLB-AEG-01',
      email: 'aegis.admin@campus.edu',
      avatarUrl: '',
      avatarColor: '#0891b2',
      role: 'CLUB_LEADER',
      department: 'Information Science & Cyber Security',
      batchYear: 2024,
      semester: 5,
      bio: 'Lead Coordinator for AEGIS Student Chapter. Managing recruitment drives, CTF events, and security workshops.',
      skills: ['Cyber Security', 'CTF Organizing', 'Penetration Testing'],
      interests: ['InfoSec', 'Event Management'],
      collaborationGoals: [],
      isMentor: true,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'AEGIS Club Portal Management',
      'Post Recruitment Announcements & Roles',
      'Publish Club Events & Hackathons',
      'Review Online Student Recruitment Applications'
    ],
    restrictedFeatures: [
      'Dean Administrative Approvals',
      'Faculty Gradebook'
    ],
    primaryTab: 'clubs'
  },
  {
    id: 'demo_club_pointblank',
    role: 'CLUB_LEADER',
    title: 'Pointblank Club Admin',
    badge: 'Club Admin • Pointblank',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Manage Pointblank Coding Community announcements, collegiate hackathons, and evaluate recruitment candidates.',
    credentials: {
      identifier: 'pointblank.admin',
      password: 'pointblank123'
    },
    user: {
      id: 'usr_club_pointblank',
      name: 'Rohan Gupta (Pointblank Admin)',
      rollNumber: 'CLB-PB-01',
      email: 'pointblank.admin@campus.edu',
      avatarUrl: '',
      avatarColor: '#059669',
      role: 'CLUB_LEADER',
      department: 'Computer Science & Engineering',
      batchYear: 2024,
      semester: 5,
      bio: 'President at Pointblank Developer Community. Coordinating annual CodeBlaze hackathon and problem-setter inductions.',
      skills: ['Competitive Programming', 'System Design', 'Hackathon Logistics'],
      interests: ['Open Source', 'Software Architecture'],
      collaborationGoals: [],
      isMentor: true,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Pointblank Club Portal Management',
      'Post Recruitment Announcements & Roles',
      'Publish Club Events & Hackathons',
      'Review Online Student Recruitment Applications'
    ],
    restrictedFeatures: [
      'Dean Administrative Approvals',
      'Faculty Gradebook'
    ],
    primaryTab: 'clubs'
  },
  {
    id: 'demo_club_cpa',
    role: 'CLUB_LEADER',
    title: 'CPA Club Admin',
    badge: 'Club Admin • CPA',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
    description: 'Manage CPA society announcements, algorithmic contests, bootcamps, and student member applications.',
    credentials: {
      identifier: 'cpa.admin',
      password: 'cpa123'
    },
    user: {
      id: 'usr_club_cpa',
      name: 'Sneha Rao (CPA Admin)',
      rollNumber: 'CLB-CPA-01',
      email: 'cpa.admin@campus.edu',
      avatarUrl: '',
      avatarColor: '#7c3aed',
      role: 'CLUB_LEADER',
      department: 'Computer Science & Engineering',
      batchYear: 2024,
      semester: 5,
      bio: 'Convenor of CPA. Leading algorithmic workshops, Go/Docker microservices bootcamps, and peer tutoring.',
      skills: ['Algorithms', 'Distributed Systems', 'Mentorship'],
      interests: ['Software Engineering', 'Community Building'],
      collaborationGoals: [],
      isMentor: true,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'CPA Club Portal Management',
      'Post Recruitment Announcements & Roles',
      'Publish Club Events & Hackathons',
      'Review Online Student Recruitment Applications'
    ],
    restrictedFeatures: [
      'Dean Administrative Approvals',
      'Faculty Gradebook'
    ],
    primaryTab: 'clubs'
  }
];
