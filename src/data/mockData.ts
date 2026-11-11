import { 
  UserProfile, 
  Course, 
  Assignment, 
  CampusIssue, 
  EventItem, 
  Club, 
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

export const initialAssignments: Assignment[] = [
  {
    id: 'asg_01',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    title: 'Assignment #3: B+ Tree Indexing & Query Cost Calculation',
    dueDate: 'Tomorrow, 11:59 PM',
    status: 'PENDING',
    totalMarks: 20,
  },
  {
    id: 'asg_02',
    courseCode: 'CS305',
    courseName: 'OS & Systems Programming Lab',
    title: 'Lab Record 6: Producer-Consumer Problem with POSIX Semaphores',
    dueDate: 'In 3 days (Friday)',
    status: 'PENDING',
    totalMarks: 15,
  },
  {
    id: 'asg_03',
    courseCode: 'CS304',
    courseName: 'Software Engineering & Agile',
    title: 'Milestone 2: SRS Document & Architecture Diagrams for Campus OS',
    dueDate: 'Yesterday',
    status: 'SUBMITTED',
    totalMarks: 25,
    obtainedMarks: 24,
  }
];

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
    id: 'club_01',
    name: 'ACM Student Chapter',
    category: 'TECH',
    description: 'The premier technical student organization hosting weekly coding jams, tech talks, and open-source hack nights.',
    leadName: 'Aravind K. (4th Year CSE)',
    membersCount: 230,
    isJoined: true,
    recruitmentOpen: true,
    recruitmentDeadline: 'Oct 20, 2026',
    badge: 'Verified Official',
  },
  {
    id: 'club_02',
    name: 'Robotics & Automation Society (RAS)',
    category: 'TECH',
    description: 'Hands-on robotics lab designing combat bots, autonomous drones, and line-follower rovers.',
    leadName: 'Meera Pillai (3rd Year ECE)',
    membersCount: 145,
    isJoined: false,
    recruitmentOpen: true,
    recruitmentDeadline: 'Oct 18, 2026',
    badge: 'Verified Official',
  },
  {
    id: 'club_03',
    name: 'Design Guild & UI/UX Club',
    category: 'CULTURAL',
    description: 'Community for designers, product thinkers, Figma wizards, and digital illustrators.',
    leadName: 'Tanvi Shah (3rd Year Des)',
    membersCount: 95,
    isJoined: false,
    recruitmentOpen: false,
    badge: 'Verified Official',
  },
  {
    id: 'club_04',
    name: 'Rotaract Youth Club',
    category: 'SOCIAL',
    description: 'Social welfare organization conducting campus blood donation camps, school mentoring, and clean-up drives.',
    leadName: 'Rohan Deshmukh (4th Year Mech)',
    membersCount: 310,
    isJoined: true,
    recruitmentOpen: true,
    recruitmentDeadline: 'Oct 25, 2026',
    badge: 'Verified Official',
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
    description: 'Graduating senior selling my genuine Casio ClassWiz. Perfect for all engineering semesters, matrix operations, and integration. Comes with original protective slide-on case.',
    price: 650,
    photos: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: 'Yesterday',
  },
  {
    id: 'mkt_02',
    sellerId: 'usr_anjali_008',
    sellerName: 'Anjali Sharma',
    sellerRoll: '22CS019',
    type: 'SELL',
    category: 'BOOKS',
    title: 'Database System Concepts (Silberschatz) 7th Edition Hardcover',
    description: 'Standard textbook for CS301. Clean pages with minimal pencil highlights. Saves you ₹1,200 compared to new bookstore price.',
    price: 450,
    photos: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: '2 days ago',
  },
  {
    id: 'mkt_03',
    sellerId: 'usr_keerthi_001',
    sellerName: 'Keerthi V. (You)',
    sellerRoll: '22CS084',
    type: 'FREE',
    category: 'LAB_COAT',
    title: 'White Chemistry / Workshop Lab Coat (Size Large)',
    description: 'Free giveaway to any 1st or 2nd year student. Clean, freshly washed, zero tears. Collect from Hostel Block B.',
    price: 0,
    photos: ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&auto=format&fit=crop&q=80'],
    status: 'ACTIVE',
    createdAt: '3 days ago',
  },
  {
    id: 'mkt_04',
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
    title: 'Mid-Semester Examinations (Odd Sem 2026-27) Timetable & Hall Ticket Notice',
    source: 'Office of the Controller of Examinations',
    category: 'ACADEMIC',
    publishedAt: 'Yesterday, 04:30 PM',
    content: 'All students are hereby notified that Mid-Semester Examinations will commence from Monday, November 02, 2026. Hall tickets will be issued only to candidates having minimum 75% attendance in each registered theory and practical subject. Attendance condonation requests must reach the Dean (Academics) before Oct 24.',
    isImportant: true,
    read: false,
  },
  {
    id: 'ann_02',
    title: 'Scheduled Campus Fiber-Optic & Wi-Fi Maintenance Window',
    source: 'Campus Information Technology Center',
    category: 'CRITICAL',
    publishedAt: '2 days ago',
    content: 'Planned core switch upgrade will take place on Saturday midnight (01:00 AM - 05:00 AM). Internet and local Intranet services across hostels and academic blocks will experience intermittent outages during this window.',
    isImportant: true,
    read: true,
  },
  {
    id: 'ann_03',
    title: 'Inter-College Tech Symposium "INVENTO 2026" Call for Volunteers',
    source: 'Student Affairs Council',
    category: 'EVENTS',
    publishedAt: '3 days ago',
    content: 'Inviting energetic student volunteers for event logistics, technical staging, PR, and guest hospitality. Certificates will be recognized in the official student achievement wallet.',
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
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    examType: 'END_SEM',
    date: '2026-05-12',
    time: '09:30 AM - 12:30 PM',
    hall: 'LHC-204',
    seatNumber: 'Seat B-14',
    instructions: 'Non-programmable calculators permitted. Bring institute ID card.'
  },
  {
    id: 'ex_2',
    courseCode: 'CS302',
    courseName: 'Computer Networks',
    examType: 'END_SEM',
    date: '2026-05-15',
    time: '09:30 AM - 12:30 PM',
    hall: 'LHC-204',
    seatNumber: 'Seat B-14',
    instructions: 'Formula sheet will be provided in the question paper booklet.'
  },
  {
    id: 'ex_3',
    courseCode: 'CS303',
    courseName: 'Compiler Design',
    examType: 'END_SEM',
    date: '2026-05-18',
    time: '02:00 PM - 05:00 PM',
    hall: 'LHC-102',
    seatNumber: 'Seat D-08',
    instructions: 'Strictly no electronic devices. Hall opens 20 minutes prior.'
  },
  {
    id: 'ex_4',
    courseCode: 'CS304',
    courseName: 'Machine Learning Foundations',
    examType: 'END_SEM',
    date: '2026-05-22',
    time: '09:30 AM - 12:30 PM',
    hall: 'LHC-301',
    seatNumber: 'Seat A-22',
    instructions: 'Standard statistical tables will be provided if required.'
  }
];

export const initialAcademicCalendar: AcademicCalendarItem[] = [
  {
    id: 'cal_1',
    title: 'Mid-Semester Examinations Commencement',
    date: '2026-03-02',
    category: 'EXAM',
    description: 'Central mid-term exams across all undergraduate departments.',
    isMilestone: true
  },
  {
    id: 'cal_2',
    title: 'Holi / Spring Break Recess',
    date: '2026-03-14',
    category: 'HOLIDAY',
    description: 'Campus instructional recess and hostel mess holiday schedule.',
    isMilestone: false
  },
  {
    id: 'cal_3',
    title: 'Final B.Tech Capstone Project Milestone 2 Review',
    date: '2026-04-10',
    category: 'DEADLINE',
    description: 'Submission of prototype architecture and intermediate evaluation report.',
    isMilestone: true
  },
  {
    id: 'cal_4',
    title: 'Course Feedback & Teaching Assessment Survey Closes',
    date: '2026-04-28',
    category: 'EVENT',
    description: 'Mandatory online feedback for end-semester registration hall tickets.',
    isMilestone: false
  },
  {
    id: 'cal_5',
    title: 'Last Instructional Day for Even Semester',
    date: '2026-05-02',
    category: 'EVENT',
    description: 'Completion of lectures, lab internal assessments and viva.',
    isMilestone: true
  },
  {
    id: 'cal_6',
    title: 'End-Semester Final Theory Examinations Begin',
    date: '2026-05-12',
    category: 'EXAM',
    description: 'Terminal examinations across LHC-101 to LHC-304.',
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
      'Peer Discovery & Mentorship',
      'Projects Collaboration Workspace',
      'Campus Issues & Hostel Reporting',
      'Marketplace & Lost and Found'
    ],
    restrictedFeatures: [
      'Administrative Verifications',
      'Print Hub Order Management'
    ],
    primaryTab: 'dashboard'
  },
  {
    id: 'demo_student',
    role: 'STUDENT',
    title: 'Student Portal',
    badge: 'Undergraduate',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    description: 'Access courses, project workspace, marketplace, lost & found, and hostel services.',
    credentials: {
      identifier: '22CS084',
      password: 'student123'
    },
    user: initialCurrentUser,
    allowedFeatures: [
      'Dashboard & Announcements',
      'Academics (Exams, Assignments, Notes)',
      'Peer Discovery & Mentorship',
      'Projects Collaboration Workspace',
      'Campus Issues & Hostel Reporting',
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
    description: 'Process and manage print jobs submitted across campus.',
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
      department: 'Campus Reprographics & Print Center',
      batchYear: 2020,
      semester: 0,
      bio: 'Operator at Central Library Reprographics Center. Managing fast Xerox & binding queues.',
      skills: ['Reprographics', 'Lamination', 'Spiral Binding'],
      interests: ['Customer Service', 'Campus Logistics'],
      collaborationGoals: [],
      isMentor: false,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Println Print Queue',
      'Document Rendering & Pricing',
      'Pickup Notification Dispatch'
    ],
    restrictedFeatures: [
      'Student Gradebook & Timetable',
      'Administrative Verification Queues'
    ],
    primaryTab: 'println'
  },
  {
    id: 'demo_facility',
    role: 'FACILITY_STAFF',
    title: 'Facility Technician',
    badge: 'Maintenance',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Resolve campus infrastructure, electrical, plumbing, and network issues.',
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
      skills: ['HVAC', 'Electrical Wiring', 'Plumbing Diagnostics', 'Network Cabling'],
      interests: ['Facility Management', 'Safety Auditing'],
      collaborationGoals: [],
      isMentor: false,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Campus Issue Management',
      'Maintenance Work Orders',
      'Resolution Status Updates'
    ],
    restrictedFeatures: [
      'Academics & Exam Records',
      'Student ID Approvals'
    ],
    primaryTab: 'issues'
  },
  {
    id: 'demo_admin',
    role: 'CAMPUS_ADMIN',
    title: 'Campus Administration / Dean',
    badge: 'Administrator',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    description: 'Full campus oversight, ID approvals, moderation, announcements, and audit logging.',
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
      bio: 'Dean of Student Affairs & Campus Administration. Overseeing institutional policies and campus governance.',
      skills: ['Campus Governance', 'Academic Policy', 'Student Grievance Arbitration'],
      interests: ['Higher Education Tech', 'Institutional Strategy'],
      collaborationGoals: [],
      isMentor: false,
      isVerified: true,
      verificationStatus: 'APPROVED',
      privacySettings: { showEmail: true, showRoom: false, isDiscoverable: true }
    },
    allowedFeatures: [
      'Student ID Card Approvals',
      'Report Moderation Queue',
      'Official Broadcast Management',
      'System-Wide Audit Logs'
    ],
    restrictedFeatures: [],
    primaryTab: 'admin'
  }
];
