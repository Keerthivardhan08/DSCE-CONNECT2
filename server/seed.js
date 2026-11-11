import { getDb } from './db.js';

function ensureAuthUsers(db) {
  const upsertUser = db.prepare(`
    INSERT INTO users (id, name, roll_number, email, password, avatar_url, avatar_color, role, department, batch_year, semester, hostel_block, room_number, bio, skills, interests, collaboration_goals, is_mentor, mentor_topics, is_verified, verification_status, id_card_url, privacy_settings)
    VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      password = excluded.password,
      role = excluded.role,
      name = excluded.name,
      roll_number = excluded.roll_number,
      email = excluded.email,
      department = excluded.department,
      avatar_url = '',
      avatar_color = excluded.avatar_color,
      verification_status = excluded.verification_status,
      id_card_url = excluded.id_card_url
  `);

  // 1. Student: Keerthi V.
  upsertUser.run(
    'usr_keerthi_001',
    'Keerthi V.',
    '22CS084',
    'keerthi.22cs@campus.edu',
    'student123',
    '#6366f1',
    'STUDENT',
    'Computer Science & Engineering',
    2026,
    6,
    'Hostel Block B',
    'Room 304',
    'Full-stack builder passionate about distributed systems and campus civic tech.',
    JSON.stringify(['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker']),
    JSON.stringify(['Systems Design', 'Open Source', 'Hackathons', 'Badminton']),
    JSON.stringify(['Hackathon Teammate', 'Study Buddy', 'Competitive Programming']),
    1,
    JSON.stringify(['Frontend Dev & React', 'Landing Summer Internships', 'DSA Preparation']),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: false, showRoom: false, isDiscoverable: true })
  );

  // 2. Print Admin: Rajesh Patel
  upsertUser.run(
    'usr_print_admin_001',
    'Rajesh Patel (Xerox Hub Manager)',
    'PRINT-HUB-01',
    'printadmin@campus.edu',
    'print123',
    '#0ea5e9',
    'PRINT_ADMIN',
    'Central Xerox & Document Operations',
    2020,
    0,
    'Commercial Complex',
    'Shop G-04',
    'Manager of Campus Central Xerox Hub. Handling academic printing, spiral bindings, and course packs.',
    JSON.stringify(['High-Speed Printing', 'Digital Finishing', 'Inventory Management']),
    JSON.stringify(['Document Ops', 'Publishing']),
    JSON.stringify([]),
    0,
    JSON.stringify([]),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: true, showRoom: false, isDiscoverable: true })
  );

  // 3. Facilities & Maintenance Staff: Er. Sundaram M.
  upsertUser.run(
    'usr_facility_staff_001',
    'Er. Sundaram M. (Facilities Supervisor)',
    'FAC-ENG-101',
    'facilities@campus.edu',
    'staff123',
    '#f59e0b',
    'FACILITY_STAFF',
    'Estate Maintenance & Technical Services',
    2018,
    0,
    'Estate Wing',
    'Office 12',
    'Supervising campus electrical, civil, network, and plumbing work orders with active 24h SLA compliance.',
    JSON.stringify(['Civil Works', 'Electrical Grid', 'HVAC & Plumbing', 'Network Cabling']),
    JSON.stringify(['Infrastructure Maintenance', 'Safety Compliance']),
    JSON.stringify([]),
    0,
    JSON.stringify([]),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: true, showRoom: false, isDiscoverable: true })
  );

  // 4. Campus Admin / Dean: Prof. K. Swaminathan
  upsertUser.run(
    'usr_dean_001',
    'Prof. K. Swaminathan (Dean of Student Affairs)',
    'ADMIN-DEAN-01',
    'dean@campus.edu',
    'admin123',
    '#dc2626',
    'CAMPUS_ADMIN',
    'Office of the Dean & Student Welfare',
    2010,
    0,
    'Administrative Block',
    'Dean Office 101',
    'Dean of Student Affairs. Managing student welfare, resolving escalated campus issues, and issuing official university announcements.',
    JSON.stringify(['Institutional Leadership', 'Student Grievance Arbitration', 'Policy Drafting']),
    JSON.stringify(['Campus Governance', 'Academics']),
    JSON.stringify([]),
    0,
    JSON.stringify([]),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: true, showRoom: false, isDiscoverable: true })
  );

  // 5. Class Representative: Rohan Deshmukh
  upsertUser.run(
    'usr_rohan_rep',
    'Rohan Deshmukh (Class Rep)',
    '22ME041',
    'rohan.rep@campus.edu',
    'rep123',
    '#8b5cf6',
    'CLASS_REP',
    'Mechanical Engineering',
    2026,
    6,
    'Hostel Block A',
    'Room 210',
    'Class Representative for 3rd Year Mech. Liaison between faculty and students.',
    JSON.stringify(['CAD', 'SolidWorks', 'Class Coordination']),
    JSON.stringify(['Automotive', 'Student Advocacy']),
    JSON.stringify(['Batch Representative']),
    0,
    JSON.stringify([]),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: true, showRoom: true, isDiscoverable: true })
  );

  // 6. Hostel Warden: Dr. Meenakshi Sundaram
  upsertUser.run(
    'usr_warden_001',
    'Dr. Meenakshi Sundaram (Chief Warden)',
    'WARDEN-B-01',
    'warden@campus.edu',
    'warden123',
    '#10b981',
    'HOSTEL_STAFF',
    'Hostel Administration & Welfare',
    2015,
    0,
    'Hostel Block B',
    'Warden Office 01',
    'Chief Warden for Boys Hostels. Managing mess operations, room allotments, and discipline.',
    JSON.stringify(['Hostel Administration', 'Mess Oversight']),
    JSON.stringify(['Student Living Standards']),
    JSON.stringify([]),
    0,
    JSON.stringify([]),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: true, showRoom: false, isDiscoverable: true })
  );

  // 7. Student Pending Verification: Akash Verma
  upsertUser.run(
    'usr_akash_unverified',
    'Akash Verma',
    '23CS105',
    'akash.23cs@campus.edu',
    'student123',
    '#ec4899',
    'STUDENT',
    'Computer Science & Engineering',
    2027,
    4,
    'Hostel Block A',
    'Room 108',
    'Interested in Web Development and Open Source Contributions.',
    JSON.stringify(['JavaScript', 'Python', 'HTML/CSS']),
    JSON.stringify(['Web Dev', 'Robotics']),
    JSON.stringify(['Study Partner']),
    0,
    JSON.stringify([]),
    0,
    'PENDING',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e293b" rx="16"/><rect x="20" y="20" width="360" height="50" fill="%233b82f6" rx="8"/><text x="200" y="52" fill="white" font-size="16" font-weight="bold" text-anchor="middle">INSTITUTE OF TECHNOLOGY - STUDENT ID</text><circle cx="70" cy="140" r="35" fill="%2364748b"/><text x="70" y="146" fill="white" font-size="18" font-weight="bold" text-anchor="middle">AV</text><text x="130" y="115" fill="white" font-size="15" font-weight="bold">Name: Akash Verma</text><text x="130" y="140" fill="%2394a3b8" font-size="13">USN: 23CS105</text><text x="130" y="165" fill="%2394a3b8" font-size="13">Dept: Computer Science</text><text x="130" y="190" fill="%2394a3b8" font-size="13">Valid Thru: 2027</text></svg>',
    JSON.stringify({ showEmail: true, showRoom: false, isDiscoverable: true })
  );

  // 8. Siddharth Menon
  upsertUser.run(
    'usr_siddharth_002',
    'Siddharth Menon',
    '23EC044',
    'siddharth.23ec@campus.edu',
    'student123',
    '#0284c7',
    'STUDENT',
    'Electronics & Communication',
    2027,
    4,
    'Hostel Block A',
    'Room 214',
    'IoT tinkerer, embedded systems nerd, and robotics competitor.',
    JSON.stringify(['C++', 'Embedded Systems', 'PCB Design', 'ROS', 'Python']),
    JSON.stringify(['Robotics', 'Hardware', 'Drones', 'Table Tennis']),
    JSON.stringify(['Hackathon Teammate', 'Robotics Competition']),
    0,
    JSON.stringify([]),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: false, showRoom: false, isDiscoverable: true })
  );

  // 9. Ananya Sharma
  upsertUser.run(
    'usr_ananya_003',
    'Ananya Sharma',
    '21CS012',
    'ananya.21cs@campus.edu',
    'senior123',
    '#14b8a6',
    'SENIOR_MENTOR',
    'Computer Science & Engineering',
    2025,
    8,
    'Hostel Block C',
    'Room 102',
    'Incoming Software Engineer @ Microsoft. Happy to guide juniors.',
    JSON.stringify(['System Design', 'Java', 'Distributed Systems', 'Algorithms']),
    JSON.stringify(['Mentorship', 'Cloud Computing', 'Reading']),
    JSON.stringify(['Mentor', 'Research Collaborator']),
    1,
    JSON.stringify(['FAANG Interview Prep', 'Resume Roast', 'Core CS Subjects']),
    1,
    'APPROVED',
    null,
    JSON.stringify({ showEmail: false, showRoom: false, isDiscoverable: true })
  );
}

export function seedInitialData() {
  const db = getDb();

  // Always ensure system auth users are up-to-date
  ensureAuthUsers(db);
  
  // Check if general tables already seeded
  const courseCount = db.prepare('SELECT count(*) as count FROM courses').get();
  if (courseCount.count === 0) {
    console.log('🌱 Seeding initial campus ecosystem database...');

    // 2. Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, code, name, faculty_name, credits, classes_held, classes_attended, room, schedule_day_time, syllabus_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCourse.run('crs_101', 'CS301', 'Database Management Systems', 'Dr. Radhakrishnan S.', 4, 25, 18, 'Hall 402 (CS Block)', 'Mon, Wed, Fri • 10:00 AM - 11:30 AM', '/syllabus/cs301.pdf');
  insertCourse.run('crs_102', 'CS302', 'Operating Systems & Concurrency', 'Prof. Ananya Sen', 4, 25, 22, 'Hall 401 (CS Block)', 'Tue, Thu • 09:00 AM - 10:30 AM', '/syllabus/cs302.pdf');
  insertCourse.run('crs_103', 'CS303', 'Computer Networks & Protocols', 'Dr. Michael Chen', 3, 24, 20, 'Hall 305 (Main Block)', 'Mon, Wed • 02:00 PM - 03:30 PM', '/syllabus/cs303.pdf');
  insertCourse.run('crs_104', 'CS304', 'Software Engineering & Agile', 'Prof. Geetha V.', 3, 22, 19, 'Seminar Room 2', 'Tue, Thu • 11:30 AM - 01:00 PM', '/syllabus/cs304.pdf');
  insertCourse.run('crs_105', 'CS305', 'OS & Systems Programming Lab', 'Prof. Ananya Sen & Lab Staff', 2, 10, 8, 'Systems Lab 2 (Ground Floor)', 'Wed • 02:00 PM - 05:00 PM', '/syllabus/cs305.pdf');

  // 3. Assignments
  const insertAssignment = db.prepare(`
    INSERT INTO assignments (id, course_code, course_name, title, due_date, status, total_marks, obtained_marks, file_attachment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAssignment.run('asg_01', 'CS301', 'Database Management Systems', 'Assignment #3: B+ Tree Indexing & Query Cost Calculation', 'Tomorrow, 11:59 PM', 'PENDING', 20, null, null);
  insertAssignment.run('asg_02', 'CS305', 'OS & Systems Programming Lab', 'Lab Record 6: Producer-Consumer Problem with POSIX Semaphores', 'In 3 days (Friday)', 'PENDING', 15, null, null);
  insertAssignment.run('asg_03', 'CS304', 'Software Engineering & Agile', 'Milestone 2: SRS Document & Architecture Diagrams for Campus OS', 'Yesterday', 'SUBMITTED', 25, 24, null);

  // 4. Campus Issues
  const insertIssue = db.prepare(`
    INSERT INTO campus_issues (id, title, description, category, location_building, location_room, urgency, status, reporter_id, reporter_name, assigned_to, staff_notes, created_at, resolved_at, photo_url, reopen_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertIssue.run('ISSUE-2041', '3rd Floor Wi-Fi Router Outage in Hostel Block B', 'Cisco AP blinking solid amber on corridor ceiling. No internet for rooms 301-320.', 'WIFI', 'Hostel Block B', 'Corridor 3rd Floor', 'HIGH', 'IN_PROGRESS', 'usr_keerthi_001', 'Keerthi V. (You)', 'Network Operations IT Cell', 'Technician dispatched with replacement AP unit. Expected resolution by 4:30 PM.', 'Today, 08:45 AM', null, null, 0);
  insertIssue.run('ISSUE-1988', 'HDMI Display Flickering in CS Hall 402 Projector', 'Projector cuts out every 30 seconds when connecting via podium HDMI cable.', 'CLASSROOM', 'Computer Science Block', 'Hall 402', 'MEDIUM', 'RESOLVED', 'usr_keerthi_001', 'Keerthi V.', 'AV Support Team', 'Replaced damaged HDMI podium cable and tested with faculty laptop.', '2 days ago', 'Yesterday, 03:15 PM', null, 0);
  insertIssue.run('ISSUE-2015', 'Water Cooler on 2nd Floor Library Leaking', 'Water pooling around drinking station causing slippery hazard.', 'WASHROOM', 'Central Library', '2nd Floor North Wing', 'MEDIUM', 'REPORTED', 'usr_siddharth_002', 'Siddharth M.', 'Facilities Plumbing Cell', null, 'Yesterday, 11:30 AM', null, null, 0);

  // 5. Events
  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, organizer, club_id, category, date, time, venue, description, capacity, registered_count, registration_deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEvent.run('evt_101', 'HackCamp 2026: 36-Hour National Campus Hackathon', 'ACM Student Chapter & Google Developer Group', 'club_01', 'TECH', 'Oct 17 - Oct 19, 2026', 'Friday 06:00 PM onwards', 'Convention Center Main Auditorium', 'Build solutions for sustainability, AI, and campus life. ₹1,50,000 cash prizes!', 250, 198, 'Oct 15, 2026');
  insertEvent.run('evt_102', 'Workshop: Demystifying LLMs & RAG Architectures', 'AI & Data Science Club', 'club_01', 'TECH', 'Tomorrow, Oct 08, 2026', '04:30 PM - 06:30 PM', 'Seminar Hall 1, CS Block', 'Hands-on session using Python, LangChain, and pgvector.', 80, 76, 'Today, 11:59 PM');
  insertEvent.run('evt_103', 'Annual Inter-Hostel Badminton Championship', 'Campus Sports Council', null, 'SPORTS', 'Saturday, Oct 11, 2026', '08:00 AM - 05:00 PM', 'Indoor Sports Complex', 'Singles and doubles knockout tournament between hostels.', 64, 48, 'Oct 10, 2026');

  // Event Registrations
  const insertRegistration = db.prepare(`
    INSERT INTO event_registrations (id, event_id, user_id, user_roll, user_name, qr_pass_code, checked_in, registered_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertRegistration.run('reg_001', 'evt_101', 'usr_keerthi_001', '22CS084', 'Keerthi V.', 'CAMPUS-PASS-EVT_101-22CS084', 0, '2026-10-01');

  // 6. Clubs
  const insertClub = db.prepare(`
    INSERT INTO clubs (id, name, category, description, lead_name, members_count, is_joined, recruitment_open, recruitment_deadline, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertClub.run('club_01', 'ACM Student Chapter', 'TECH', 'Premier technical student organization hosting weekly coding jams and open-source nights.', 'Aravind K. (4th Year CSE)', 230, 1, 1, 'Oct 20, 2026', 'Verified Official');
  insertClub.run('club_02', 'Robotics & Automation Society (RAS)', 'TECH', 'Hands-on robotics lab designing combat bots, autonomous drones, and rovers.', 'Meera Pillai (3rd Year ECE)', 145, 0, 1, 'Oct 18, 2026', 'Verified Official');
  insertClub.run('club_03', 'Design Guild & UI/UX Club', 'CULTURAL', 'Community for designers, product thinkers, and Figma wizards.', 'Tanvi Shah (3rd Year Des)', 95, 0, 0, null, 'Verified Official');
  insertClub.run('club_04', 'Rotaract Youth Club', 'SOCIAL', 'Social welfare organization conducting campus blood donation camps and drives.', 'Rohan Deshmukh (4th Year Mech)', 310, 1, 1, 'Oct 25, 2026', 'Verified Official');

  // 7. Opportunities
  const insertOpp = db.prepare(`
    INSERT INTO opportunities (id, title, organization, type, stipend_or_prize, department_eligibility, min_cgpa, deadline, skills, description, is_saved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertOpp.run('opp_01', 'Summer Research Fellowship 2027', 'Indian Institute of Science (IISc)', 'RESEARCH', '₹12,000 / month + Accommodation', JSON.stringify(['CSE', 'ECE', 'Mech']), 8.0, 'Nov 15, 2026', JSON.stringify(['Python', 'Data Analysis']), 'Two-month funded research fellowship working under IISc faculties.', 1);
  insertOpp.run('opp_02', 'Smart India Hackathon (SIH 2026) College Nominations', 'Ministry of Education & Innovation Cell', 'HACKATHON', '₹1,00,000 per problem statement', JSON.stringify(['All Departments']), null, 'Oct 22, 2026', JSON.stringify(['Full Stack', 'Mobile Dev', 'IoT']), 'Submit your 6-member team idea for college internal evaluation.', 1);
  insertOpp.run('opp_03', 'Software Engineering Intern — Summer 2027', 'Atlassian India', 'INTERNSHIP', '₹1,20,000 / month', JSON.stringify(['CSE', 'IT', 'ECE']), 7.5, 'Oct 30, 2026', JSON.stringify(['Java', 'C++', 'System Design']), 'Work with Jira or Confluence engineering teams on scalable microservices.', 0);

  // 8. Projects
  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, owner_id, owner_name, description, stage, required_skills, open_slots, current_members_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProject.run('proj_01', 'Autonomous Campus EV Shuttle Dispatcher & Tracker', 'usr_keerthi_001', 'Keerthi V. (You)', 'Building IoT and mobile app to dynamically dispatch campus electric golf carts.', 'PROTOTYPING', JSON.stringify(['Flutter', 'Node.js', 'WebSockets', 'Raspberry Pi']), 2, 2);
  insertProject.run('proj_02', 'AI Exam Prep Synthesizer from Lecture Audio', 'usr_tanmay_007', 'Tanmay Saxena (4th Year CSE)', 'Transcribing classroom recordings with Whisper and generating concise flashcards.', 'HACKATHON', JSON.stringify(['Python', 'OpenAI Whisper', 'FastAPI']), 1, 3);

  const insertTask = db.prepare(`INSERT INTO project_tasks (id, project_id, title, assignee, done) VALUES (?, ?, ?, ?, ?)`);
  insertTask.run('tsk_1', 'proj_01', 'Connect GPS module to MQTT broker', 'Keerthi', 1);
  insertTask.run('tsk_2', 'proj_01', 'Design live map UI in Flutter', 'Open', 0);
  insertTask.run('tsk_3', 'proj_01', 'Deploy routing optimization algorithm', 'Keerthi', 0);

  // 9. Marketplace
  const insertMarket = db.prepare(`
    INSERT INTO marketplace_items (id, seller_id, seller_name, seller_roll, type, category, title, description, price, photos, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertMarket.run('mkt_01', 'usr_vikram_005', 'Vikram Joshi', '21ME042', 'SELL', 'CALCULATOR', 'Casio fx-991EX ClassWiz Scientific Calculator (Mint Condition)', 'Graduating senior selling my genuine Casio ClassWiz. With slide-on case.', 650, JSON.stringify(['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=300&auto=format&fit=crop&q=80']), 'ACTIVE', 'Yesterday');
  insertMarket.run('mkt_02', 'usr_anjali_008', 'Anjali Sharma', '22CS019', 'SELL', 'BOOKS', 'Database System Concepts (Silberschatz) 7th Edition Hardcover', 'Standard textbook for CS301. Clean pages with minimal highlights.', 450, JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80']), 'ACTIVE', '2 days ago');
  insertMarket.run('mkt_03', 'usr_keerthi_001', 'Keerthi V. (You)', '22CS084', 'FREE', 'LAB_COAT', 'White Chemistry / Workshop Lab Coat (Size Large)', 'Free giveaway to 1st or 2nd year student. Clean, freshly washed, zero tears.', 0, JSON.stringify(['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&auto=format&fit=crop&q=80']), 'ACTIVE', '3 days ago');

  // 10. Lost and Found
  const insertLnf = db.prepare(`
    INSERT INTO lost_and_found (id, poster_id, poster_name, type, category, title, description, location_area, incident_date, secret_challenge_question, status, claimed_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertLnf.run('lnf_01', 'usr_deepak_010', 'Deepak S. (Found by student)', 'FOUND', 'ELECTRONICS', 'Apple AirPods Pro (2nd Gen) in White Case', 'Left behind on wooden study desk on 2nd floor silent reading zone.', 'Central Library, 2nd Floor Study Cubicle', 'Today, 11:15 AM', 'What cartoon sticker is on the back side of the charging case?', 'OPEN', null);
  insertLnf.run('lnf_02', 'usr_keerthi_001', 'Keerthi V. (You)', 'LOST', 'KEYS', 'Set of 2 Room Keys with Blue Campus Lanyard', 'Lost between CS Block canteen and Hostel B basketball court after 5 PM.', 'Canteen to Hostel B pathway', 'Yesterday, 05:30 PM', 'What metal logo charm is attached with the keys?', 'OPEN', null);
  insertLnf.run('lnf_03', 'usr_security_001', 'Main Gate Security Office', 'FOUND', 'ID_CARD', 'Student ID Card: Siddharth M. (23EC044)', 'Found at campus main entrance gate. Deposited at Security Post #1.', 'Campus Main Entrance Gate', '2 days ago', 'State your student date of birth or show government ID proof.', 'RETURNED', 'Siddharth M.');

  // 11. Library Books
  const insertBook = db.prepare(`
    INSERT INTO library_books (id, isbn, title, authors, category, shelf_location, total_copies, available_copies, is_borrowed_by_me, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertBook.run('lib_01', '978-0262033848', 'Introduction to Algorithms (CLRS)', 'Cormen, Leiserson, Rivest, Stein', 'Computer Science', 'Stack 4B • Shelf 12', 12, 3, 0, null);
  insertBook.run('lib_02', '978-0132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Software Engineering', 'Stack 4A • Shelf 03', 6, 0, 1, 'Oct 14, 2026 (In 7 days)');
  insertBook.run('lib_03', '978-1449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Systems & Architecture', 'Stack 5C • Shelf 08', 8, 2, 0, null);
  insertBook.run('lib_04', '978-0133591620', 'Operating System Concepts (10th Ed)', 'Silberschatz, Galvin, Gagne', 'Operating Systems', 'Stack 4B • Shelf 09', 15, 5, 0, null);

  // 12. Hostel Mess Menu
  const insertMess = db.prepare(`INSERT INTO hostel_mess (day, breakfast, lunch, snacks, dinner) VALUES (?, ?, ?, ?, ?)`);
  insertMess.run('Monday', 'Idli & Medu Vada, Coconut Chutney, Sambar, Filter Coffee', 'Jeera Rice, Dal Tadka, Paneer Butter Masala, Roti, Curd', 'Samosa, Mint Chutney, Hot Tea', 'Phulka, Aloo Gobi, Mixed Veg Pulao, Dal Makhani, Gulab Jamun');
  insertMess.run('Tuesday', 'Poha with Sev & Peanuts, Boiled Eggs / Banana, Tea', 'Steamed Basmati Rice, Rajma Masala, Bhindi Fry, Chapati', 'Veg Cutlet, Tomato Sauce, Tea', 'Egg Curry / Malai Kofta, Steamed Rice, Roti, Yellow Dal, Ice Cream');
  insertMess.run('Wednesday', 'Masala Dosa, Potato Masala, Tomato Chutney, Sambar', 'Veg Biryani / Chicken Biryani (Special), Mirchi Salan, Raita', 'Pav Bhaji, Lemon & Onions, Masala Chai', 'Chapati, Kadai Paneer / Chana Masala, Jeera Rice, Dal Fry, Kheer');
  insertMess.run('Thursday', 'Upma with Coconut Chutney, Sheera (Kesari), Coffee', 'Steamed Rice, South Indian Sambar, Rasam, Potato Roast', 'Biscuits & Banana, Filter Coffee', 'Veg Fried Rice, Chilli Paneer Gravy, Hakka Noodles, Soup');
  insertMess.run('Friday', 'Aloo Paratha with Amul Butter, Curd & Pickle, Tea', 'Roti, Dal Palak, Dum Aloo Kashmiri, Steamed Rice, Papad', 'Mirchi Bajji / Onion Pakoda, Green Chutney, Chai', 'Butter Naan, Paneer Tikka Masala / Fish Curry, Pulao, Rasgulla');
  insertMess.run('Saturday', 'Puri with Potato Saggu / Chana Masala, Halwa', 'Lemon Rice, Curd Rice, Potato Fry, Pickle, Crisp Papads', 'Bread Roll, Tomato Sauce, Tea', 'Phulka, Dal Tadka, Mixed Vegetable Curry, Steamed Rice');
  insertMess.run('Sunday', 'Chole Bhature, Sweet Lassi / Coffee', 'Special Sunday Feast: Paneer Lababdar, Hyderabadi Pulao, Rasmalai', 'Cake Slice / Cookies, Hot Coffee', 'Light Khichdi, Kadhi, Papad, Pickle, Seasonal Fresh Fruit');

  // 13. Announcements
  const insertAnn = db.prepare(`
    INSERT INTO announcements (id, title, source, category, published_at, content, is_important, read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAnn.run('ann_01', 'Mid-Semester Examinations (Odd Sem 2026-27) Timetable & Hall Ticket Notice', 'Office of the Controller of Examinations', 'ACADEMIC', 'Yesterday, 04:30 PM', 'All students are hereby notified that Mid-Semester Examinations will commence from Monday, November 02, 2026. Hall tickets will be issued only to candidates having minimum 75% attendance.', 1, 0);
  insertAnn.run('ann_02', 'Scheduled Campus Fiber-Optic & Wi-Fi Maintenance Window', 'Campus Information Technology Center', 'CRITICAL', '2 days ago', 'Planned core switch upgrade will take place on Saturday midnight (01:00 AM - 05:00 AM). Internet across hostels will experience intermittent outages.', 1, 1);
  insertAnn.run('ann_03', 'Inter-College Tech Symposium "INVENTO 2026" Call for Volunteers', 'Student Affairs Council', 'EVENTS', '3 days ago', 'Inviting energetic student volunteers for event logistics, technical staging, PR, and guest hospitality.', 0, 1);

  // 14. Grounded Campus Knowledge Chunks (RAG)
  const insertKb = db.prepare(`
    INSERT INTO campus_knowledge (id, document_title, section, page_number, content, keywords)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertKb.run('kb_01', 'Academic Regulations & Student Handbook 2025-26', 'Clause 4.3 — Attendance Requirement & Condonation Rules', 14, 'A candidate must secure a minimum of 75% attendance in aggregate of all subjects to be eligible to appear for the end-semester examinations. Condonation of shortage between 65% and 74% may be granted solely on medical grounds (requiring authorized government hospital certificate submitted within 3 days) and payment of prescribed condonation fee of ₹1,000 per subject. Below 65% results in detention.', JSON.stringify(['attendance', 'condonation', 'medical leave', 'exam eligibility', '75 percent', 'detention']));
  insertKb.run('kb_02', 'Hostel Administration Manual & Code of Conduct', 'Rule 8.1 — Room Change & Hostel Reallocation Procedure', 22, 'Room reallocation requests are entertained only at the beginning of each semester or under verified medical grounds. To initiate a room swap, both students must submit a joint written application countersigned by respective Block Wardens to Chief Warden Office (Room 104) before 2nd week of semester. Mutual swaps require zero pending dues in either room.', JSON.stringify(['hostel', 'room change', 'room swap', 'warden', 'hostel block', 'hostel dues']));
  insertKb.run('kb_03', 'Central Library User Charter & Policy', 'Section 3.2 — Borrowing Limits, Overdue Fines and Renewals', 8, 'Undergraduate students may borrow up to 4 books simultaneously for 14 calendar days. Books can be renewed online once for an additional 7 days provided no active reservations exist. Overdue fine is ₹5 per day per book for first 7 days, and ₹10 per day thereafter. Max fine cap is ₹200 per book. No Dues clearance will be blocked if books remain overdue.', JSON.stringify(['library', 'books', 'fine', 'return', 'borrow', 'due date', 'renewal', 'no dues']));
  insertKb.run('kb_04', 'Student Affairs & Career Services Guidelines', 'Section 6.4 — No Objection Certificate (NOC) for External Off-Campus Internships', 31, 'Students in semesters 6, 7, and 8 securing off-campus internships must obtain an official NOC from Training & Placement Cell. Required documents: 1) Formal Offer Letter with stipend and duration; 2) Parent undertaking; 3) Department Head (HOD) recommendation. Application must be submitted at least 15 working days prior to start date.', JSON.stringify(['internship', 'noc', 'placement', 'offer letter', 'permission', 'off campus']));
  insertKb.run('kb_05', 'Hostel Administration Manual & Code of Conduct', 'Rule 5.3 — Night Out and Extended Leave Permissions', 19, 'Students desiring overnight leave must submit an online e-Leave request before 06:00 PM on the day of departure. The digital approval link is automatically sent to the registered parent contact number. Once parental confirmation is logged, biometric gate pass activates at the turnstiles.', JSON.stringify(['night out', 'leave', 'out pass', 'gate pass', 'hostel curfew', 'parents permission']));
  }

  // 15. Communities
  const commCount = db.prepare('SELECT count(*) as count FROM communities').get();
  if (commCount.count === 0) {
    const insertComm = db.prepare(`INSERT INTO communities (id, name, category, description, member_count, created_by, topics) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    insertComm.run('comm_01', 'AI & Machine Learning Research Guild', 'TECH', 'Student research reading group dissecting modern LLMs, multi-modal agents, and computer vision papers.', 48, 'usr_keerthi_001', JSON.stringify(['Deep Learning', 'PyTorch', 'Paper Reviews', 'Transformers']));
    insertComm.run('comm_02', 'Competitive Programming & Algorithms Circle', 'CODING', 'Weekly practice matches on Codeforces, LeetCode, and preparation for ICPC regionals.', 64, 'usr_ananya_003', JSON.stringify(['Graphs', 'DP', 'Codeforces', 'ICPC']));
    insertComm.run('comm_03', 'Autonomous Robotics & Hardware Lab', 'HARDWARE', 'Collaborative builders designing micro-quadcopters, ROS navigation, and PCB firmware.', 32, 'usr_siddharth_002', JSON.stringify(['ROS2', 'STM32', 'Embedded', 'Drones']));
    insertComm.run('comm_04', 'Open Source Developers & Linux Guild', 'DEV', 'Contributing to upstream open source repositories, maintaining campus tools, and Linux ricing.', 55, 'usr_keerthi_001', JSON.stringify(['Git', 'Kernel', 'Web & Cloud', 'Go']));

    const insertCommMember = db.prepare(`INSERT OR IGNORE INTO community_memberships (community_id, user_id, joined_at) VALUES (?, ?, ?)`);
    insertCommMember.run('comm_01', 'usr_keerthi_001', '2026-09-01');
    insertCommMember.run('comm_02', 'usr_keerthi_001', '2026-09-05');
    insertCommMember.run('comm_04', 'usr_keerthi_001', '2026-09-10');
  }

  // 16. Exam Timetable
  const examCount = db.prepare('SELECT count(*) as count FROM exam_timetable').get();
  if (examCount.count === 0) {
    const insertExam = db.prepare(`INSERT INTO exam_timetable (id, course_code, course_name, exam_type, date, time_slot, hall, seat_number, max_marks, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    insertExam.run('exam_01', 'CS301', 'Database Management Systems', 'MID_TERM', 'Nov 02, 2026', '10:00 AM - 12:00 PM', 'Hall 402 (CS Block)', 'CS-402-B14', 50, 'Non-programmable calculators permitted. Bring physical student ID card.');
    insertExam.run('exam_02', 'CS302', 'Operating Systems & Concurrency', 'MID_TERM', 'Nov 04, 2026', '10:00 AM - 12:00 PM', 'Hall 401 (CS Block)', 'CS-401-A08', 50, 'Formula reference sheets will be provided by invigilator.');
    insertExam.run('exam_03', 'CS303', 'Computer Networks & Protocols', 'MID_TERM', 'Nov 06, 2026', '02:00 PM - 04:00 PM', 'Hall 305 (Main Block)', 'MB-305-C02', 50, 'Electronic watches and phones strictly prohibited.');
    insertExam.run('exam_04', 'CS304', 'Software Engineering & Agile', 'MID_TERM', 'Nov 09, 2026', '10:00 AM - 12:00 PM', 'Seminar Hall 2', 'SH2-D11', 50, 'Open case-study analysis section included.');
    insertExam.run('exam_05', 'CS305', 'OS & Systems Programming Lab Exam', 'END_SEM', 'Dec 02, 2026', '09:00 AM - 01:00 PM', 'Systems Lab 2 (Ground Floor)', 'SYS-LAB2-18', 100, 'Hands-on coding exam with live test case verification on Linux machines.');
  }

  // 17. Academic Calendar
  const calCount = db.prepare('SELECT count(*) as count FROM academic_calendar').get();
  if (calCount.count === 0) {
    const insertCal = db.prepare(`INSERT INTO academic_calendar (id, title, category, start_date, end_date, description, is_important) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    insertCal.run('cal_01', 'Odd Semester Academic Commencement', 'SEMESTER', 'Aug 04, 2026', null, 'Classes commence for all 2nd, 3rd, and 4th year B.Tech batches.', 1);
    insertCal.run('cal_02', 'Mid-Semester Examinations Window', 'EXAM', 'Nov 02, 2026', 'Nov 10, 2026', 'Centralized mid-term examinations for all engineering departments.', 1);
    insertCal.run('cal_03', 'Annual Cultural & Tech Festival "INVENTO 2026"', 'FEST', 'Nov 19, 2026', 'Nov 22, 2026', 'Three-day flagship national student symposium with pro-nights and hackathons.', 1);
    insertCal.run('cal_04', 'Last Day of Instruction (Teaching Ends)', 'DEADLINE', 'Nov 27, 2026', null, 'Final submission of course projects, assignments, and attendance freeze.', 1);
    insertCal.run('cal_05', 'End-Semester Practical / Lab Examinations', 'EXAM', 'Dec 01, 2026', 'Dec 08, 2026', 'Department laboratory evaluations and external examiner vivas.', 1);
    insertCal.run('cal_06', 'End-Semester Theory Examinations', 'EXAM', 'Dec 11, 2026', 'Dec 24, 2026', 'University end-term written examinations.', 1);
    insertCal.run('cal_07', 'Winter Vacation & Semester Break', 'HOLIDAY', 'Dec 25, 2026', 'Jan 10, 2027', 'Hostels close for scheduled winter sanitation.', 0);
  }

  // 18. Project Showcases
  const showCount = db.prepare('SELECT count(*) as count FROM project_showcases').get();
  if (showCount.count === 0) {
    const insertShow = db.prepare(`INSERT INTO project_showcases (id, title, team_name, description, tags, github_url, demo_url, award, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    insertShow.run('shw_01', 'CampusNav: AR Indoor Navigation for Multi-Floor Academic Blocks', 'Team VectorAR', 'Augmented reality mobile application guiding freshers and guests to lecture halls, laboratories, and faculty offices.', JSON.stringify(['ARCore', 'Flutter', 'Spatial Mapping']), 'https://github.com/campus/campusnav', 'https://campusnav.demo.edu', '🏆 1st Prize @ HackCamp 2025', '2025');
    insertShow.run('shw_02', 'AeroClean: Autonomous Solar Panel Cleaning Drone', 'Team DroneMakers', 'Heavy-lift hexacopter with ultrasonic nozzles engineered to wash campus rooftop solar arrays, reducing energy loss by 23%.', JSON.stringify(['PX4 Autopilot', 'Computer Vision', 'ROS2']), 'https://github.com/campus/aeroclean', null, '🌟 Dean Innovation Grant ₹50,000', '2026');
    insertShow.run('shw_03', 'SmartMess: RFID Token & Dynamic Meal Production Estimator', 'Team ByteBite', 'Automated token dispenser linked to student ID cards that reduced campus hostel food waste by over 350 kg/week.', JSON.stringify(['Node.js', 'ESP32', 'React', 'TimescaleDB']), 'https://github.com/campus/smartmess', 'https://smartmess.campus.edu', '🏅 Green Campus Sustainability Award', '2026');
  }

  // 19. Sample Direct Messages
  const msgCount = db.prepare('SELECT count(*) as count FROM direct_messages').get();
  if (msgCount.count === 0) {
    const insertMsg = db.prepare(`INSERT INTO direct_messages (id, sender_id, receiver_id, sender_name, receiver_name, item_id, item_title, content, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    insertMsg.run('msg_01', 'usr_keerthi_001', 'usr_vikram_005', 'Keerthi V.', 'Vikram Joshi', 'mkt_01', 'Casio fx-991EX ClassWiz', 'Hi Vikram! Is your Casio calculator still available for ₹650? Can we meet at Central Library?', 'Yesterday, 04:15 PM');
    insertMsg.run('msg_02', 'usr_vikram_005', 'usr_keerthi_001', 'Vikram Joshi', 'Keerthi V.', 'mkt_01', 'Casio fx-991EX ClassWiz', 'Hey Keerthi! Yes, it is still available. I can meet you at the library entrance around 5:30 PM.', 'Yesterday, 04:22 PM');
  }

  // 20. Audit Logs
  const auditCount = db.prepare('SELECT count(*) as count FROM audit_logs').get();
  if (auditCount.count === 0) {
    const insertAudit = db.prepare(`INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, details, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    insertAudit.run('aud_01', 'usr_dean_001', 'Prof. K. Swaminathan (Dean)', 'CAMPUS_ADMIN', 'ANNOUNCEMENT_BROADCAST', 'Broadcasted official notice: Mid-Semester Examinations (Odd Sem 2026-27)', 'Yesterday, 04:30 PM');
    insertAudit.run('aud_02', 'usr_facility_staff_001', 'Er. Sundaram M.', 'FACILITY_STAFF', 'TICKET_STATUS_UPDATED', 'Updated ticket ISSUE-1988 (Hall 402 Projector) to RESOLVED with technician note.', 'Yesterday, 03:15 PM');
    insertAudit.run('aud_03', 'usr_keerthi_001', 'Keerthi V.', 'STUDENT', 'TICKET_REPORTED', 'Submitted campus ticket ISSUE-2041 (Hostel B Wi-Fi Outage) with HIGH urgency.', 'Today, 08:45 AM');
  }

  console.log('✅ Campus database seeded successfully with production-grade data!');
}
