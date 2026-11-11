import { Course, Assignment, ExamTimetableItem } from '../types';

export interface TimetableSlot {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  periodNumber: number; // 1, 2, 3, 4, 5, 6, 7
  time: string; // e.g. "9:00 - 10:00"
  courseCode: string;
  courseName: string;
  shortName: string;
  faculty: string;
  room: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'MEETING' | 'BREAK';
  batches?: string; // e.g. "A1", "A2 & A3", "All"
  durationHours?: number;
  periodSpan?: number; // 2 if occupies two periods
}

export interface TimetableMetadata {
  title: string;
  academicYear: string;
  duration: string;
  semester: number;
  withEffectFrom: string;
  roomNo: string;
  department: string;
  program: string;
}

export const CYBER_SECURITY_SEM3_METADATA: TimetableMetadata = {
  title: 'UG - BE CLASS TIME-TABLE FOR THE ACADEMIC YEAR 2026-27 [ODD SEMESTER]',
  academicYear: '2026-27 [ODD SEMESTER]',
  duration: 'AUGUST 2026 – DECEMBER 2026',
  semester: 3,
  withEffectFrom: '24-08-2026',
  roomNo: 'CDS10-104',
  department: 'Computer Science & Engineering (Cyber Security)',
  program: 'UG - BE'
};

export const CYBER_SECURITY_SEM3_TIMETABLE: TimetableSlot[] = [
  // =================== MONDAY ===================
  {
    day: 'MON',
    periodNumber: 1,
    time: '9:00 - 10:00',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming (OS)',
    shortName: 'OS',
    faculty: 'Padmavathi S',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'MON',
    periodNumber: 2,
    time: '10:00 - 11:00',
    courseCode: '1BCY304',
    courseName: 'Data Structures and Applications (DSA)',
    shortName: 'DSA',
    faculty: 'Dr. Mohd. Tajuddin',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'MON',
    periodNumber: 3,
    time: '11:15 - 12:15',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java (OPJ)',
    shortName: 'OPJ',
    faculty: 'Dr. Rakshitha Kiran P',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'MON',
    periodNumber: 4,
    time: '12:15 - 1:15',
    courseCode: '1BCY305',
    courseName: 'Digital Design & Computer Architecture (DDCA)',
    shortName: 'DDCA',
    faculty: 'Dr. Pallavi Kulkarni',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'MON',
    periodNumber: 5,
    time: '2:00 - 4:00',
    courseCode: '1BCY303 / LAB',
    courseName: 'Operating System & Linux System Programming Lab',
    shortName: 'OS Lab A2 & A3 (PS + VHC + NAR + MK)',
    faculty: 'Padmavathi S + Dr. Vinod H C + Nida Afreen Rizvi + MK',
    room: 'Systems Lab',
    type: 'LAB',
    batches: 'A2 & A3',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'MON',
    periodNumber: 7,
    time: '4:00 - 5:00',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'Maths',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },

  // =================== TUESDAY ===================
  {
    day: 'TUE',
    periodNumber: 1,
    time: '9:00 - 11:00',
    courseCode: '1BCYL306 / 1BCY302',
    courseName: 'DSA Lab A1 (MT + ML) / OPJ Lab A2 & A3 (RK + VD + VHC)',
    shortName: 'DSA Lab A1 (MT + ML) / OPJ Lab A2 & A3 (RK + VD + VHC)',
    faculty: 'Dr. Mohd. Tajuddin + ML / Dr. Rakshitha Kiran P + VD + Dr. Vinod H C',
    room: 'DSA & Java Computing Labs',
    type: 'LAB',
    batches: 'A1 (DSA) / A2 & A3 (OPJ)',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'TUE',
    periodNumber: 3,
    time: '11:15 - 12:15',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'PS',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'TUE',
    periodNumber: 4,
    time: '12:15 - 1:15',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming (OS)',
    shortName: 'OS',
    faculty: 'Padmavathi S',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'TUE',
    periodNumber: 5,
    time: '2:00 - 3:00',
    courseCode: '1BCY305',
    courseName: 'Digital Design & Computer Architecture (DDCA)',
    shortName: 'DDCA',
    faculty: 'Dr. Pallavi Kulkarni',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'TUE',
    periodNumber: 6,
    time: '3:00 - 4:00',
    courseCode: '1BCY304',
    courseName: 'Data Structures and Applications (DSA)',
    shortName: 'DSA',
    faculty: 'Dr. Mohd. Tajuddin',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'TUE',
    periodNumber: 7,
    time: '4:00 - 5:00',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'Maths',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },

  // =================== WEDNESDAY ===================
  {
    day: 'WED',
    periodNumber: 1,
    time: '9:00 - 11:00',
    courseCode: '1BCYL306',
    courseName: 'Data Structures Laboratory (Batches A2 & A3)',
    shortName: 'DSA Lab A2 & A3 (MT + VD + VHC + PS)',
    faculty: 'Dr. Mohd. Tajuddin + VD + Dr. Vinod H C + Padmavathi S',
    room: 'DSA Lab (Systems Block)',
    type: 'LAB',
    batches: 'A2 & A3',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'WED',
    periodNumber: 3,
    time: '11:15 - 12:15',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming (OS)',
    shortName: 'OS',
    faculty: 'Padmavathi S',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'WED',
    periodNumber: 4,
    time: '12:15 - 1:15',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'PS',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'WED',
    periodNumber: 5,
    time: '2:00 - 4:00',
    courseCode: '1BCY303 / 1BCYL307A',
    courseName: 'OS Lab A1 (PS + PB) / AEC Lab A3 (NAR + ML)',
    shortName: 'OS Lab A1 (PS + PB) / AEC Lab A3 (NAR + ML)',
    faculty: 'Padmavathi S + PB / Nida Afreen Rizvi + ML',
    room: 'OS Lab / Cyber Security Lab',
    type: 'LAB',
    batches: 'A1 (OS Lab) & A3 (AEC Lab)',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'WED',
    periodNumber: 7,
    time: '4:00 - 5:00',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'Maths',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },

  // =================== THURSDAY ===================
  {
    day: 'THU',
    periodNumber: 1,
    time: '9:00 - 10:00',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'PS',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'THU',
    periodNumber: 2,
    time: '10:00 - 11:00',
    courseCode: '1BCY304',
    courseName: 'Data Structures and Applications (DSA)',
    shortName: 'DSA',
    faculty: 'Dr. Mohd. Tajuddin',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'THU',
    periodNumber: 3,
    time: '11:15 - 12:15',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java (OPJ)',
    shortName: 'OPJ',
    faculty: 'Dr. Rakshitha Kiran P',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'THU',
    periodNumber: 4,
    time: '12:15 - 1:15',
    courseCode: '1BCY305',
    courseName: 'Digital Design & Computer Architecture (DDCA)',
    shortName: 'DDCA',
    faculty: 'Dr. Pallavi Kulkarni',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'THU',
    periodNumber: 5,
    time: '2:00 - 4:00',
    courseCode: '1BCY302 / LAB',
    courseName: 'Object Oriented Programming with Java Lab (Batch A1)',
    shortName: 'OPJ Lab A1 (RK + PS)',
    faculty: 'Dr. Rakshitha Kiran P + Padmavathi S',
    room: 'Java Lab',
    type: 'LAB',
    batches: 'A1',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'THU',
    periodNumber: 7,
    time: '4:00 - 5:00',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'Maths',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },

  // =================== FRIDAY ===================
  {
    day: 'FRI',
    periodNumber: 1,
    time: '9:00 - 10:00',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java (OPJ)',
    shortName: 'OPJ',
    faculty: 'Dr. Rakshitha Kiran P',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'FRI',
    periodNumber: 2,
    time: '10:00 - 11:00',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    shortName: 'PS',
    faculty: 'Dr. K V Nagmani',
    room: 'CDS10-104',
    type: 'LECTURE',
    durationHours: 1,
    periodSpan: 1
  },
  {
    day: 'FRI',
    periodNumber: 3,
    time: '11:15 - 1:15',
    courseCode: '1BCYL307A',
    courseName: 'Cyber Security and its Applications Lab (Batches A1 & A2)',
    shortName: 'AEC Lab A1 & A2 (NAR + PS + PB)',
    faculty: 'Nida Afreen Rizvi + Padmavathi S + PB',
    room: 'Cyber Security AEC Lab',
    type: 'LAB',
    batches: 'A1 & A2',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'FRI',
    periodNumber: 5,
    time: '2:00 - 4:00',
    courseCode: '1BCP308',
    courseName: 'Community Project (Project-Based Learning) / Societal Project',
    shortName: 'Community Project (VHC + MT)',
    faculty: 'Dr. Vinod H C + Dr. Mohd. Tajuddin',
    room: 'CDS10-104 / Innovation Lab',
    type: 'LAB',
    batches: 'All Batches',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'FRI',
    periodNumber: 7,
    time: '4:00 - 5:00',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java Tutorial',
    shortName: 'Tutorial OPJ',
    faculty: 'Dr. Rakshitha Kiran P',
    room: 'CDS10-104',
    type: 'TUTORIAL',
    durationHours: 1,
    periodSpan: 1
  },

  // =================== SATURDAY ===================
  {
    day: 'SAT',
    periodNumber: 1,
    time: '9:00 - 11:00',
    courseCode: '1BCY305',
    courseName: 'Digital Design & Computer Architecture Tutorial',
    shortName: 'Tutorial DDCA',
    faculty: 'Dr. Pallavi Kulkarni',
    room: 'CDS10-104',
    type: 'TUTORIAL',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'SAT',
    periodNumber: 3,
    time: '11:15 - 1:15',
    courseCode: 'PROCTOR',
    courseName: 'Faculty Proctor & Academic Mentorship Meeting',
    shortName: 'PROCTOR MEETING',
    faculty: 'Department Mentors & Faculty Advisors',
    room: 'CDS10-104',
    type: 'MEETING',
    durationHours: 2,
    periodSpan: 2
  },
  {
    day: 'SAT',
    periodNumber: 5,
    time: '2:00 - 4:00',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming Tutorial',
    shortName: 'Tutorial OS',
    faculty: 'Padmavathi S',
    room: 'CDS10-104',
    type: 'TUTORIAL',
    durationHours: 2,
    periodSpan: 2
  }
];

export const CYBER_SECURITY_SEM3_COURSES: Course[] = [
  {
    id: 'crs_cy_301',
    code: '1BMAT31A',
    name: 'Probability and Statistics (PS)',
    facultyName: 'Dr. K V Nagmani',
    credits: 4,
    classesHeld: 28,
    classesAttended: 25,
    room: 'CDS10-104',
    scheduleDayTime: 'Tue (11:15 AM & 4 PM), Wed (12:15 PM & 4 PM), Thu (9 AM & 4 PM), Fri (10 AM)',
    syllabusUrl: '/syllabus/1bmat31a.pdf'
  },
  {
    id: 'crs_cy_302',
    code: '1BCY302',
    name: 'Object Oriented Programming with Java (OPJ)',
    facultyName: 'Dr. Rakshitha Kiran P',
    credits: 4,
    classesHeld: 26,
    classesAttended: 24,
    room: 'CDS10-104 / Java Lab',
    scheduleDayTime: 'Mon (11:15 AM), Thu (11:15 AM & 2 PM Lab A1), Fri (9 AM & 4 PM Tut)',
    syllabusUrl: '/syllabus/1bcy302.pdf'
  },
  {
    id: 'crs_cy_303',
    code: '1BCY303',
    name: 'Operating System & Linux System Programming (OS)',
    facultyName: 'Padmavathi S',
    credits: 4,
    classesHeld: 26,
    classesAttended: 23,
    room: 'CDS10-104 / Systems Lab',
    scheduleDayTime: 'Mon (9 AM & 2 PM Lab), Tue (12:15 PM), Wed (11:15 AM & 2 PM Lab), Sat (2 PM Tut)',
    syllabusUrl: '/syllabus/1bcy303.pdf'
  },
  {
    id: 'crs_cy_304',
    code: '1BCY304',
    name: 'Data Structures and Applications (DSA)',
    facultyName: 'Dr. Mohd. Tajuddin',
    credits: 4,
    classesHeld: 25,
    classesAttended: 22,
    room: 'CDS10-104',
    scheduleDayTime: 'Mon (10 AM), Tue (3 PM), Thu (10 AM)',
    syllabusUrl: '/syllabus/1bcy304.pdf'
  },
  {
    id: 'crs_cy_305',
    code: '1BCY305',
    name: 'Digital Design & Computer Architecture (DDCA)',
    facultyName: 'Dr. Pallavi Kulkarni',
    credits: 4,
    classesHeld: 24,
    classesAttended: 21,
    room: 'CDS10-104',
    scheduleDayTime: 'Mon (12:15 PM), Tue (2 PM), Thu (12:15 PM), Sat (9 AM Tut)',
    syllabusUrl: '/syllabus/1bcy305.pdf'
  },
  {
    id: 'crs_cy_306',
    code: '1BCYL306',
    name: 'Data Structures Laboratory',
    facultyName: 'Dr. Mohd. Tajuddin & Lab Staff',
    credits: 1.5,
    classesHeld: 10,
    classesAttended: 9,
    room: 'DSA Systems Lab',
    scheduleDayTime: 'Tue 9:00 - 11:00 AM (A1) • Wed 9:00 - 11:00 AM (A2 & A3)',
    syllabusUrl: '/syllabus/1bcyl306.pdf'
  },
  {
    id: 'crs_cy_307',
    code: '1BCYL307A',
    name: 'Cyber Security and its Applications (AEC Lab)',
    facultyName: 'Nida Afreen Rizvi',
    credits: 1.5,
    classesHeld: 10,
    classesAttended: 10,
    room: 'Cyber Security AEC Lab',
    scheduleDayTime: 'Wed 2:00 - 4:00 PM (A3) • Fri 11:15 AM - 1:15 PM (A1 & A2)',
    syllabusUrl: '/syllabus/1bcyl307a.pdf'
  },
  {
    id: 'crs_cy_308',
    code: '1BCP308',
    name: 'Community Project (Project-Based Learning) / Societal Project',
    facultyName: 'Dr. Vinod H C',
    credits: 2,
    classesHeld: 8,
    classesAttended: 8,
    room: 'CDS10-104 / Innovation Lab',
    scheduleDayTime: 'Fri 2:00 - 4:00 PM',
    syllabusUrl: '/syllabus/1bcp308.pdf'
  }
];

export const CYBER_SECURITY_SEM3_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_cy_01',
    courseCode: '1BCY304',
    courseName: 'Data Structures and Applications (DSA)',
    title: 'Assignment 2: Red-Black Trees, AVL Self-Balancing & B-Trees',
    description: 'Implement insertion and rotation operations for self-balancing AVL trees in C++.',
    dueDate: 'Tomorrow, 11:59 PM',
    status: 'PENDING',
    totalMarks: 20
  },
  {
    id: 'asg_cy_02',
    courseCode: '1BCYL307A',
    courseName: 'Cyber Security and its Applications (AEC Lab)',
    title: 'Lab Report 4: Wireshark Packet Sniffing & TLS Handshake Cryptanalysis',
    description: 'Submit packet inspection capture file (.pcap) and answer reflection prompts.',
    dueDate: 'In 3 days (Friday)',
    status: 'PENDING',
    totalMarks: 25
  },
  {
    id: 'asg_cy_03',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming (OS)',
    title: 'Assignment 3: Multi-Threaded Banker\'s Algorithm & Deadlock Avoidance',
    description: 'Implement deadlock detection and resolution routines using POSIX pthreads in Linux.',
    dueDate: 'Next Monday',
    status: 'PENDING',
    totalMarks: 20
  },
  {
    id: 'asg_cy_04',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java (OPJ)',
    title: 'Mini-Project: Secure Banking Transaction Gateway in Core Java',
    description: 'Design inheritance hierarchy, custom exceptions, and stream cipher simulation.',
    dueDate: 'In 5 days',
    status: 'PENDING',
    totalMarks: 30
  },
  {
    id: 'asg_cy_05',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    title: 'Problem Set 4: Joint Continuous Random Variables & Bayes Decision Theory',
    description: 'Solve analytical questions from Module 3 and submit scanned handwritten steps.',
    dueDate: 'In 6 days',
    status: 'PENDING',
    totalMarks: 15
  }
];

export const CYBER_SECURITY_SEM3_EXAM_TIMETABLE: ExamTimetableItem[] = [
  {
    id: 'ex_cy_01',
    courseCode: '1BMAT31A',
    courseName: 'Probability and Statistics (PS)',
    examType: 'MID_TERM',
    date: 'Oct 26, 2026',
    timeSlot: '09:30 AM - 12:30 PM',
    time: '09:30 AM - 12:30 PM',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    maxMarks: 50,
    instructions: 'Calculator (fx-991ES or MS) allowed. Statistical tables provided.'
  },
  {
    id: 'ex_cy_02',
    courseCode: '1BCY302',
    courseName: 'Object Oriented Programming with Java (OPJ)',
    examType: 'MID_TERM',
    date: 'Oct 28, 2026',
    timeSlot: '09:30 AM - 12:30 PM',
    time: '09:30 AM - 12:30 PM',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    maxMarks: 50
  },
  {
    id: 'ex_cy_03',
    courseCode: '1BCY303',
    courseName: 'Operating System & Linux System Programming (OS)',
    examType: 'MID_TERM',
    date: 'Oct 30, 2026',
    timeSlot: '09:30 AM - 12:30 PM',
    time: '09:30 AM - 12:30 PM',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    maxMarks: 50
  },
  {
    id: 'ex_cy_04',
    courseCode: '1BCY304',
    courseName: 'Data Structures and Applications (DSA)',
    examType: 'MID_TERM',
    date: 'Nov 02, 2026',
    timeSlot: '09:30 AM - 12:30 PM',
    time: '09:30 AM - 12:30 PM',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    maxMarks: 50
  },
  {
    id: 'ex_cy_05',
    courseCode: '1BCY305',
    courseName: 'Digital Design & Computer Architecture (DDCA)',
    examType: 'MID_TERM',
    date: 'Nov 04, 2026',
    timeSlot: '09:30 AM - 12:30 PM',
    time: '09:30 AM - 12:30 PM',
    hall: 'CDS10-104',
    seatNumber: 'CDS-CY-042',
    maxMarks: 50
  },
  {
    id: 'ex_cy_06',
    courseCode: '1BCYL306',
    courseName: 'Data Structures Laboratory (Practical)',
    examType: 'MID_TERM',
    date: 'Nov 06, 2026',
    timeSlot: '01:30 PM - 04:30 PM',
    time: '01:30 PM - 04:30 PM',
    hall: 'DSA Computing Lab',
    seatNumber: 'TERM-07',
    maxMarks: 50
  },
  {
    id: 'ex_cy_07',
    courseCode: '1BCYL307A',
    courseName: 'Cyber Security and its Applications Practical',
    examType: 'MID_TERM',
    date: 'Nov 08, 2026',
    timeSlot: '01:30 PM - 04:30 PM',
    time: '01:30 PM - 04:30 PM',
    hall: 'Cyber Security AEC Lab',
    seatNumber: 'CY-LAB-12',
    maxMarks: 50
  }
];

export const FACULTY_DIRECTORY = [
  { code: '1BMAT31A', name: 'Probability and Statistics (PS)', faculty: 'Dr. K V Nagmani', initials: 'KVN' },
  { code: '1BCY302', name: 'Object Oriented Programming with Java (OPJ)', faculty: 'Dr. Rakshitha Kiran P', initials: 'RK' },
  { code: '1BCY303', name: 'Operating System & Linux System Programming (OS)', faculty: 'Padmavathi S', initials: 'PS' },
  { code: '1BCY304', name: 'Data Structures and Applications (DSA)', faculty: 'Dr. Mohd. Tajuddin', initials: 'MT' },
  { code: '1BCY305', name: 'Digital Design & Computer Architecture (DDCA)', faculty: 'Dr. Pallavi Kulkarni', initials: 'PK' },
  { code: '1BCYL306', name: 'Data Structures Laboratory', faculty: 'Dr. Mohd. Tajuddin', initials: 'MT' },
  { code: '1BCYL307A', name: 'Cyber Security and its Applications', faculty: 'Nida Afreen Rizvi', initials: 'NAR' },
  { code: '1BCP308', name: 'Community Project (Project-Based Learning) / Societal Project', faculty: 'Dr. Vinod H C', initials: 'VHC' }
];

export const isCyberSecuritySem3 = (user?: { department?: string; semester?: number | string } | null): boolean => {
  if (!user) return false;
  const dept = (user.department || '').toLowerCase();
  const sem = Number(user.semester);
  const isCyber = dept.includes('cyber') || dept.includes('cys');
  return isCyber && sem === 3;
};
