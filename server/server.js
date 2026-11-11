import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from './db.js';
import { seedInitialData } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed database on startup
seedInitialData();

// Helper to format database user row
function formatUserRow(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    rollNumber: user.roll_number || user.rollNumber,
    email: user.email,
    avatarUrl: '', // Image URLs removed in favor of color avatar
    avatarColor: user.avatar_color || user.avatarColor || '#6366f1',
    role: user.role,
    department: user.department,
    batchYear: user.batch_year || user.batchYear,
    semester: user.semester,
    hostelBlock: user.hostel_block || user.hostelBlock,
    roomNumber: user.room_number || user.roomNumber,
    bio: user.bio || '',
    skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : (Array.isArray(user.skills) ? user.skills : []),
    interests: typeof user.interests === 'string' ? JSON.parse(user.interests || '[]') : (Array.isArray(user.interests) ? user.interests : []),
    collaborationGoals: typeof user.collaboration_goals === 'string' ? JSON.parse(user.collaboration_goals || '[]') : (Array.isArray(user.collaborationGoals) ? user.collaborationGoals : []),
    mentorTopics: typeof user.mentor_topics === 'string' ? JSON.parse(user.mentor_topics || '[]') : (Array.isArray(user.mentorTopics) ? user.mentorTopics : []),
    privacySettings: typeof user.privacy_settings === 'string' ? JSON.parse(user.privacy_settings || '{"showEmail":false,"showRoom":false,"isDiscoverable":true}') : (user.privacySettings || { showEmail: false, showRoom: false, isDiscoverable: true }),
    isMentor: Boolean(user.is_mentor ?? user.isMentor),
    isVerified: Boolean(user.is_verified ?? user.isVerified),
    verificationStatus: user.verification_status || (user.is_verified ? 'APPROVED' : 'PENDING_VERIFICATION'),
    idCardUrl: user.id_card_url || user.idCardUrl || null
  };
}

function logAuditEvent(db, actorId, actorName, actorRole, action, details) {
  try {
    const id = `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const timestamp = 'Just now';
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, actorId || 'system', actorName || 'System', actorRole || 'SYSTEM', action, details, timestamp);
  } catch (e) {
    console.error('Failed to log audit event:', e);
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'Campus OS V1' });
});

// Authentication / Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;
  const db = getDb();

  try {
    let user = null;
    if (identifier) {
      const q = identifier.trim().toLowerCase();
      user = db.prepare(`
        SELECT * FROM users 
        WHERE lower(roll_number) = ? OR lower(email) = ? OR lower(id) = ?
      `).get(q, q, q);
    } else if (role) {
      user = db.prepare("SELECT * FROM users WHERE role = ? LIMIT 1").get(role);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'User account not found for provided credentials.' });
    }

    // Check password if provided
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please verify your credentials.' });
    }

    const formattedUser = formatUserRow(user);

    res.json({
      success: true,
      token: `auth_tok_${user.id}_${Date.now()}`,
      user: formattedUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Authentication service error.' });
  }
});

// Student Account Registration using USN
app.post('/api/auth/register', (req, res) => {
  const { rollNumber, name, email, password, department, batchYear, semester, hostelBlock, roomNumber, bio } = req.body;
  const db = getDb();

  try {
    if (!rollNumber || !name || !email || !password) {
      return res.status(400).json({ success: false, error: 'USN / Roll number, name, email, and password are required.' });
    }

    const cleanUSN = rollNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if USN or email already exists
    const existing = db.prepare("SELECT id FROM users WHERE lower(roll_number) = ? OR lower(email) = ?").get(cleanUSN.toLowerCase(), cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this USN / Roll number or Email already exists.' });
    }

    const userId = `usr_${cleanUSN.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const privacySettings = JSON.stringify({ showEmail: false, showRoom: false, isDiscoverable: true });

    db.prepare(`
      INSERT INTO users (
        id, name, roll_number, email, password, avatar_url, avatar_color, role, department, batch_year, semester, hostel_block, room_number, bio, skills, interests, collaboration_goals, is_mentor, mentor_topics, is_verified, verification_status, privacy_settings
      ) VALUES (?, ?, ?, ?, ?, '', ?, 'STUDENT', ?, ?, ?, ?, ?, ?, '[]', '[]', '[]', 0, '[]', 0, 'PENDING_VERIFICATION', ?)
    `).run(
      userId,
      name.trim(),
      cleanUSN,
      cleanEmail,
      password,
      randomColor,
      department || 'Computer Science & Engineering',
      batchYear || 2027,
      semester || 4,
      hostelBlock || 'Hostel Block A',
      roomNumber || 'Room 101',
      bio || 'New student joining Campus OS.',
      privacySettings
    );

    const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    const formatted = formatUserRow(newUser);

    logAuditEvent(db, userId, name.trim(), 'STUDENT', 'USER_REGISTERED', `Student registered with USN: ${cleanUSN}. Awaiting ID verification.`);

    res.json({
      success: true,
      token: `auth_tok_${userId}_${Date.now()}`,
      user: formatted
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Failed to create student account: ' + err.message });
  }
});

// Upload Student ID Card for Institutional Verification
app.post('/api/auth/upload-id', (req, res) => {
  const { userId, idCardUrl } = req.body;
  const db = getDb();

  try {
    if (!userId || !idCardUrl) {
      return res.status(400).json({ success: false, error: 'User ID and Student ID image data required.' });
    }

    db.prepare("UPDATE users SET id_card_url = ?, verification_status = 'PENDING_VERIFICATION' WHERE id = ?").run(idCardUrl, userId);

    const u = db.prepare("SELECT name, roll_number FROM users WHERE id = ?").get(userId);
    logAuditEvent(db, userId, u ? u.name : userId, 'STUDENT', 'ID_CARD_SUBMITTED', `Student ID card submitted for institutional verification by ${u ? u.name : userId} (${u ? u.roll_number : ''}).`);

    res.json({ success: true, message: 'Student ID card submitted successfully. Admin review pending.' });
  } catch (err) {
    console.error('ID Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Pending ID Verifications Queue
app.get('/api/admin/pending-verifications', (req, res) => {
  const db = getDb();
  try {
    const pending = db.prepare("SELECT * FROM users WHERE verification_status IN ('PENDING', 'PENDING_VERIFICATION') OR (role = 'STUDENT' AND is_verified = 0 AND id_card_url IS NOT NULL)").all().map(formatUserRow);
    res.json({ success: true, pendingUsers: pending });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Approve / Reject Student ID Verification
app.post('/api/admin/verify-id', (req, res) => {
  const { userId, action, approved, notes, note, adminId, adminName } = req.body;
  const db = getDb();

  try {
    const isApprove = action === 'APPROVE' || approved === true;
    const status = isApprove ? 'APPROVED' : 'REJECTED';
    const isVerified = isApprove ? 1 : 0;

    db.prepare("UPDATE users SET is_verified = ?, verification_status = ? WHERE id = ?").run(isVerified, status, userId);

    const targetUser = db.prepare("SELECT name, roll_number FROM users WHERE id = ?").get(userId);
    const targetName = targetUser ? `${targetUser.name} (${targetUser.roll_number})` : userId;

    logAuditEvent(
      db, 
      adminId || 'usr_dean_001', 
      adminName || 'Dean Office', 
      'CAMPUS_ADMIN', 
      isApprove ? 'ID_VERIFICATION_APPROVED' : 'ID_VERIFICATION_REJECTED',
      `Student ID card for ${targetName} was ${status.toLowerCase()} by Dean/Admin. Note: ${notes || note || 'Standard verification review'}`
    );

    res.json({ success: true, status, isVerified: Boolean(isVerified) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update User Profile & Privacy Controls
app.patch('/api/users/:id/profile', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const { name, bio, skills, interests, collaborationGoals, isMentor, mentorTopics, hostelBlock, roomNumber, privacySettings } = req.body;

  try {
    const currentUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    db.prepare(`
      UPDATE users SET
        name = coalesce(?, name),
        bio = coalesce(?, bio),
        skills = coalesce(?, skills),
        interests = coalesce(?, interests),
        collaboration_goals = coalesce(?, collaboration_goals),
        is_mentor = coalesce(?, is_mentor),
        mentor_topics = coalesce(?, mentor_topics),
        hostel_block = coalesce(?, hostel_block),
        room_number = coalesce(?, room_number),
        privacy_settings = coalesce(?, privacy_settings)
      WHERE id = ?
    `).run(
      name || null,
      bio !== undefined ? bio : null,
      skills ? JSON.stringify(skills) : null,
      interests ? JSON.stringify(interests) : null,
      collaborationGoals ? JSON.stringify(collaborationGoals) : null,
      isMentor !== undefined ? (isMentor ? 1 : 0) : null,
      mentorTopics ? JSON.stringify(mentorTopics) : null,
      hostelBlock || null,
      roomNumber || null,
      privacySettings ? JSON.stringify(privacySettings) : null,
      id
    );

    const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    logAuditEvent(db, id, updated.name, updated.role, 'PROFILE_UPDATED', `User ${updated.name} updated profile details and privacy settings.`);

    res.json({ success: true, user: formatUserRow(updated) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Current User Profile Endpoint
app.get('/api/auth/me', (req, res) => {
  const db = getDb();
  const userId = req.query.userId || req.headers['x-user-id'];
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(formatUserRow(user));
});

// Full Initial State Aggregator Endpoint
app.get('/api/initial-state', (req, res) => {
  const db = getDb();
  try {
    const requestedUserId = req.query.userId || req.headers['x-user-id'];
    let user = null;
    if (requestedUserId) {
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(requestedUserId);
    }
    if (user) {
      user.skills = JSON.parse(user.skills || '[]');
      user.interests = JSON.parse(user.interests || '[]');
      user.collaborationGoals = JSON.parse(user.collaboration_goals || '[]');
      user.mentorTopics = JSON.parse(user.mentor_topics || '[]');
      user.privacySettings = JSON.parse(user.privacy_settings || '{}');
      user.rollNumber = user.roll_number;
      user.avatarUrl = user.avatar_url;
      user.batchYear = user.batch_year;
      user.hostelBlock = user.hostel_block;
      user.roomNumber = user.room_number;
      user.isMentor = Boolean(user.is_mentor);
      user.isVerified = Boolean(user.is_verified);
    }

    const isCyberUser = user && (
      (user.department || '').toLowerCase().includes('cyber') || 
      (user.department || '').toLowerCase().includes('cys')
    ) && Number(user.semester) === 3;

    let courses = [];
    let assignments = [];

    if (isCyberUser) {
      courses = [
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

      assignments = [
        {
          id: 'asg_cy_01',
          courseCode: '1BCY304',
          courseName: 'Data Structures and Applications (DSA)',
          title: 'Assignment 2: Red-Black Trees, AVL Self-Balancing & B-Trees',
          dueDate: 'Tomorrow, 11:59 PM',
          status: 'PENDING',
          totalMarks: 20
        },
        {
          id: 'asg_cy_02',
          courseCode: '1BCYL307A',
          courseName: 'Cyber Security and its Applications (AEC Lab)',
          title: 'Lab Report 4: Wireshark Packet Sniffing & TLS Handshake Cryptanalysis',
          dueDate: 'In 3 days (Friday)',
          status: 'PENDING',
          totalMarks: 25
        },
        {
          id: 'asg_cy_03',
          courseCode: '1BCY303',
          courseName: 'Operating System & Linux System Programming (OS)',
          title: 'Assignment 3: Multi-Threaded Banker\'s Algorithm & Deadlock Avoidance',
          dueDate: 'Next Monday',
          status: 'PENDING',
          totalMarks: 20
        },
        {
          id: 'asg_cy_04',
          courseCode: '1BCY302',
          courseName: 'Object Oriented Programming with Java (OPJ)',
          title: 'Mini-Project: Secure Banking Transaction Gateway in Core Java',
          dueDate: 'In 5 days',
          status: 'PENDING',
          totalMarks: 30
        },
        {
          id: 'asg_cy_05',
          courseCode: '1BMAT31A',
          courseName: 'Probability and Statistics (PS)',
          title: 'Problem Set 4: Joint Continuous Random Variables & Bayes Decision Theory',
          dueDate: 'In 6 days',
          status: 'PENDING',
          totalMarks: 15
        }
      ];
    } else {
      courses = db.prepare("SELECT * FROM courses").all().map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        facultyName: c.faculty_name,
        credits: c.credits,
        classesHeld: c.classes_held,
        classesAttended: c.classes_attended,
        room: c.room,
        scheduleDayTime: c.schedule_day_time,
        syllabusUrl: c.syllabus_url
      }));

      assignments = db.prepare("SELECT * FROM assignments").all().map(a => ({
        id: a.id,
        courseCode: a.course_code,
        courseName: a.course_name,
        title: a.title,
        dueDate: a.due_date,
        status: a.status,
        totalMarks: a.total_marks,
        obtainedMarks: a.obtained_marks,
        fileAttachment: a.file_attachment
      }));
    }

    const campusIssues = db.prepare("SELECT * FROM campus_issues ORDER BY created_at DESC").all().map(i => ({
      id: i.id,
      title: i.title,
      description: i.description,
      category: i.category,
      locationBuilding: i.location_building,
      locationRoom: i.location_room,
      urgency: i.urgency,
      status: i.status,
      reporterId: i.reporter_id,
      reporterName: i.reporter_name,
      assignedTo: i.assigned_to,
      staffNotes: i.staff_notes,
      createdAt: i.created_at,
      resolvedAt: i.resolved_at,
      photoUrl: i.photo_url,
      reopenCount: i.reopen_count
    }));

    const events = db.prepare("SELECT * FROM events").all().map(e => {
      const activeUid = user ? user.id : 'usr_keerthi_001';
      const reg = db.prepare("SELECT * FROM event_registrations WHERE event_id = ? AND user_id = ?").get(e.id, activeUid);
      const bm = db.prepare("SELECT 1 FROM event_bookmarks WHERE user_id = ? AND event_id = ?").get(activeUid, e.id);
      return {
        id: e.id,
        title: e.title,
        organizer: e.organizer,
        clubId: e.club_id,
        category: e.category,
        date: e.date,
        time: e.time,
        venue: e.venue,
        description: e.description,
        capacity: e.capacity,
        registeredCount: e.registered_count,
        registrationDeadline: e.registration_deadline,
        isRegistered: Boolean(reg),
        qrPassCode: reg ? reg.qr_pass_code : undefined,
        isSaved: Boolean(bm)
      };
    });

    const clubs = db.prepare("SELECT * FROM clubs").all().map(cl => ({
      id: cl.id,
      name: cl.name,
      category: cl.category,
      description: cl.description,
      leadName: cl.lead_name,
      membersCount: cl.members_count,
      isJoined: Boolean(cl.is_joined),
      recruitmentOpen: Boolean(cl.recruitment_open),
      recruitmentDeadline: cl.recruitment_deadline,
      badge: cl.badge
    }));

    const opportunities = db.prepare("SELECT * FROM opportunities").all().map(o => ({
      id: o.id,
      title: o.title,
      organization: o.organization,
      type: o.type,
      stipendOrPrize: o.stipend_or_prize,
      departmentEligibility: JSON.parse(o.department_eligibility || '[]'),
      minCgpa: o.min_cgpa,
      deadline: o.deadline,
      skills: JSON.parse(o.skills || '[]'),
      description: o.description,
      isSaved: Boolean(o.is_saved)
    }));

    const rawProjects = db.prepare("SELECT * FROM projects").all();
    const projects = rawProjects.map(p => {
      const applicants = db.prepare("SELECT * FROM project_applicants WHERE project_id = ?").all(p.id).map(a => ({
        userId: a.user_id,
        userName: a.user_name,
        skills: JSON.parse(a.skills || '[]'),
        pitch: a.pitch,
        status: a.status
      }));
      const tasks = db.prepare("SELECT * FROM project_tasks WHERE project_id = ?").all(p.id).map(t => ({
        id: t.id,
        title: t.title,
        assignee: t.assignee,
        done: Boolean(t.done)
      }));
      return {
        id: p.id,
        title: p.title,
        ownerId: p.owner_id,
        ownerName: p.owner_name,
        description: p.description,
        stage: p.stage,
        requiredSkills: JSON.parse(p.required_skills || '[]'),
        openSlots: p.open_slots,
        currentMembersCount: p.current_members_count,
        applicants,
        tasks
      };
    });

    const marketplace = db.prepare("SELECT * FROM marketplace_items ORDER BY created_at DESC").all().map(m => ({
      id: m.id,
      sellerId: m.seller_id,
      sellerName: m.seller_name,
      sellerRoll: m.seller_roll,
      type: m.type,
      category: m.category,
      title: m.title,
      description: m.description,
      price: m.price,
      photos: JSON.parse(m.photos || '[]'),
      status: m.status,
      createdAt: m.created_at
    }));

    const lostAndFound = db.prepare("SELECT * FROM lost_and_found ORDER BY incident_date DESC").all().map(l => ({
      id: l.id,
      posterId: l.poster_id,
      posterName: l.poster_name,
      type: l.type,
      category: l.category,
      title: l.title,
      description: l.description,
      locationArea: l.location_area,
      incidentDate: l.incident_date,
      secretChallengeQuestion: l.secret_challenge_question,
      status: l.status,
      claimedBy: l.claimed_by
    }));

    const libraryBooks = db.prepare("SELECT * FROM library_books").all().map(b => ({
      id: b.id,
      isbn: b.isbn,
      title: b.title,
      authors: b.authors,
      category: b.category,
      shelfLocation: b.shelf_location,
      totalCopies: b.total_copies,
      availableCopies: b.available_copies,
      isBorrowedByMe: Boolean(b.is_borrowed_by_me),
      dueDate: b.due_date
    }));

    const announcements = db.prepare("SELECT * FROM announcements ORDER BY published_at DESC").all().map(an => ({
      id: an.id,
      title: an.title,
      source: an.source,
      category: an.category,
      publishedAt: an.published_at,
      content: an.content,
      isImportant: Boolean(an.is_important),
      read: Boolean(an.read)
    }));

    const rates = db.prepare("SELECT black_white_per_page, color_per_page, spiral_binding, lamination FROM print_rates WHERE id = 1").get();
    const printRates = rates ? {
      blackWhitePerPage: rates.black_white_per_page,
      colorPerPage: rates.color_per_page,
      spiralBinding: rates.spiral_binding,
      lamination: rates.lamination
    } : { blackWhitePerPage: 2, colorPerPage: 10, spiralBinding: 20, lamination: 15 };

    const printOrders = db.prepare("SELECT * FROM print_orders ORDER BY created_at DESC").all().map(order => ({
      id: order.id,
      studentId: order.student_id,
      studentName: order.student_name,
      studentRoll: order.student_roll,
      files: JSON.parse(order.files || '[]'),
      pageCount: order.page_count,
      layout: order.layout,
      colorMode: order.color_mode,
      binding: order.binding,
      copies: order.copies,
      readyBy: order.ready_by,
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      notificationRead: Boolean(order.notification_read),
      createdAt: order.created_at,
      shopNote: order.shop_note || undefined
    }));

    const directory = db.prepare("SELECT * FROM users").all().map(formatUserRow);

    const examTimetable = db.prepare("SELECT * FROM exam_timetable ORDER BY date ASC").all().map(et => ({
      id: et.id,
      courseCode: et.course_code,
      courseName: et.course_name,
      examType: et.exam_type,
      date: et.date,
      timeSlot: et.time_slot,
      hall: et.hall,
      seatNumber: et.seat_number,
      maxMarks: et.max_marks,
      instructions: et.instructions
    }));

    const academicCalendar = db.prepare("SELECT * FROM academic_calendar ORDER BY start_date ASC").all().map(ac => ({
      id: ac.id,
      title: ac.title,
      category: ac.category,
      startDate: ac.start_date,
      endDate: ac.end_date,
      description: ac.description,
      isImportant: Boolean(ac.is_important)
    }));

    const communities = db.prepare("SELECT * FROM communities").all().map(cm => {
      const isMem = db.prepare("SELECT 1 FROM community_memberships WHERE community_id = ? AND user_id = ?").get(cm.id, user ? user.id : 'usr_keerthi_001');
      return {
        id: cm.id,
        name: cm.name,
        category: cm.category,
        description: cm.description,
        memberCount: cm.member_count,
        createdBy: cm.created_by,
        isMember: Boolean(isMem),
        topics: JSON.parse(cm.topics || '[]')
      };
    });

    const projectShowcases = db.prepare("SELECT * FROM project_showcases").all().map(ps => ({
      id: ps.id,
      title: ps.title,
      teamName: ps.team_name,
      description: ps.description,
      tags: JSON.parse(ps.tags || '[]'),
      githubUrl: ps.github_url,
      demoUrl: ps.demo_url,
      award: ps.award,
      year: ps.year
    }));

    const activeUid = user ? user.id : 'usr_keerthi_001';
    const directMessages = db.prepare("SELECT * FROM direct_messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_at ASC").all(activeUid, activeUid).map(dm => ({
      id: dm.id,
      senderId: dm.sender_id,
      receiverId: dm.receiver_id,
      senderName: dm.sender_name,
      receiverName: dm.receiver_name,
      itemId: dm.item_id,
      itemTitle: dm.item_title,
      content: dm.content,
      sentAt: dm.sent_at
    }));

    const connectionRequests = db.prepare("SELECT * FROM connection_requests WHERE receiver_id = ? OR sender_id = ? ORDER BY created_at DESC").all(activeUid, activeUid).map(cr => ({
      id: cr.id,
      senderId: cr.sender_id,
      senderName: cr.sender_name,
      senderRoll: cr.sender_roll,
      senderDept: cr.sender_dept,
      receiverId: cr.receiver_id,
      type: cr.type,
      message: cr.message,
      status: cr.status,
      createdAt: cr.created_at
    }));

    const itemReports = db.prepare("SELECT * FROM item_reports ORDER BY created_at DESC").all().map(ir => ({
      id: ir.id,
      targetType: ir.target_type,
      targetId: ir.target_id,
      itemTitle: ir.item_title,
      reporterId: ir.reporter_id,
      reporterName: ir.reporter_name,
      reason: ir.reason,
      details: ir.details,
      status: ir.status,
      createdAt: ir.created_at
    }));

    const messReports = db.prepare("SELECT * FROM mess_reports ORDER BY created_at DESC").all().map(mr => ({
      id: mr.id,
      reporterId: mr.reporter_id,
      reporterName: mr.reporter_name,
      reporterRoll: mr.reporter_roll,
      hostelBlock: mr.hostel_block,
      mealType: mr.meal_type,
      category: mr.category,
      incidentDate: mr.incident_date,
      description: mr.description,
      severity: mr.severity,
      status: mr.status,
      actionTaken: mr.action_taken,
      createdAt: mr.created_at
    }));

    const auditLogs = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC").all().map(al => ({
      id: al.id,
      actorId: al.actor_id,
      actorName: al.actor_name,
      actorRole: al.actor_role,
      action: al.action,
      details: al.details,
      timestamp: al.timestamp
    }));

    res.json({
      currentUser: user ? formatUserRow(user) : null,
      courses,
      assignments,
      campusIssues,
      events,
      clubs,
      opportunities,
      projects,
      marketplace,
      lostAndFound,
      libraryBooks,
      announcements,
      printOrders,
      printRates,
      studentsDirectory: directory,
      examTimetable,
      academicCalendar,
      communities,
      projectShowcases,
      directMessages,
      connectionRequests,
      itemReports,
      messReports,
      auditLogs
    });
  } catch (err) {
    console.error('Error fetching initial state:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update Course Attendance
app.post('/api/courses/:id/attendance', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { attended, total } = req.body;
  db.prepare("UPDATE courses SET classes_attended = ?, classes_held = ? WHERE id = ?").run(attended, total, id);
  res.json({ success: true, attended, total });
});

// Report Campus Issue
app.post('/api/issues', (req, res) => {
  const db = getDb();
  const { title, description, category, locationBuilding, locationRoom, urgency, reporterId, reporterName } = req.body;
  const id = `ISSUE-${Math.floor(2000 + Math.random() * 900)}`;
  const CATEGORY_ROUTING = {
    WIFI:           'Network Operations & IT Cell',
    ELECTRICAL:     'Electrical Maintenance Cell',
    CLASSROOM:      'Estate & Academic Facilities Wing',
    LAB:            'Lab & Equipment Maintenance Team',
    WASHROOM:       'Sanitation & Housekeeping Services',
    HOSTEL:         'Chief Warden & Hostel Management',
    SAFETY:         'Campus Safety & Security Office',
    LIBRARY:        'Library Administration & Operations',
    CANTEEN:        'Mess Supervisor & Canteen Management',
    SPORTS_FACILITY:'Physical Education & Sports Department',
    PARKING:        'Security Office & Parking Authority',
    SECURITY:       'Campus Security & Vigilance Cell',
    TRANSPORT:      'Transport & Fleet Management Office',
    IT_HELPDESK:    'IT Services Helpdesk & Support',
    MEDICAL_CENTER: 'Medical & Health Center',
    ADMINISTRATION: 'Office of the Registrar & Administration',
    GARDEN_GROUNDS: 'Horticulture & Grounds Maintenance',
    LIFT_ELEVATOR:  'AMC & Elevator Maintenance Team',
    FIRE_SAFETY:    'Fire Safety & Emergency Response Cell',
    AUDITORIUM:     'Auditorium & Event Infrastructure',
    OTHER:          'Campus Facilities Helpdesk',
  };
  const assignedTo = CATEGORY_ROUTING[category] || 'Campus Facilities Desk';
  const createdAt = 'Just now';

  db.prepare(`
    INSERT INTO campus_issues (id, title, description, category, location_building, location_room, urgency, status, reporter_id, reporter_name, assigned_to, created_at, reopen_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'REPORTED', ?, ?, ?, ?, 0)
  `).run(id, title, description, category, locationBuilding, locationRoom || '', urgency, reporterId || 'usr_keerthi_001', reporterName || 'Keerthi V. (You)', assignedTo, createdAt);

  res.json({ success: true, id, assignedTo });
});

// Update Issue Status (Staff / Admin)
app.patch('/api/issues/:id/status', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { status, staffNotes } = req.body;
  const resolvedAt = status === 'RESOLVED' ? 'Just now' : null;
  db.prepare(`
    UPDATE campus_issues SET status = ?, staff_notes = coalesce(?, staff_notes), resolved_at = coalesce(?, resolved_at) WHERE id = ?
  `).run(status, staffNotes || null, resolvedAt, id);
  res.json({ success: true });
});

// Reopen Issue (Student)
app.post('/api/issues/:id/reopen', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { reason } = req.body;
  const note = `Student Reopened with note: "${reason}". Escalated to Head of Facilities.`;
  db.prepare(`
    UPDATE campus_issues SET status = 'REOPENED', staff_notes = ?, reopen_count = reopen_count + 1 WHERE id = ?
  `).run(note, id);
  res.json({ success: true });
});

// Events: Register
app.post('/api/events/:id/register', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { userId, userRoll, userName } = req.body;
  const qrPassCode = `CAMPUS-PASS-${id.toUpperCase()}-${userRoll || '22CS084'}`;

  const regId = `reg_${Date.now()}`;
  db.prepare(`
    INSERT INTO event_registrations (id, event_id, user_id, user_roll, user_name, qr_pass_code, registered_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(regId, id, userId || 'usr_keerthi_001', userRoll || '22CS084', userName || 'Keerthi V.', qrPassCode, new Date().toISOString());

  db.prepare("UPDATE events SET registered_count = registered_count + 1 WHERE id = ?").run(id);
  res.json({ success: true, qrPassCode });
});

// Events: Cancel
app.post('/api/events/:id/cancel', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { userId } = req.body;
  db.prepare("DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?").run(id, userId || 'usr_keerthi_001');
  db.prepare("UPDATE events SET registered_count = max(0, registered_count - 1) WHERE id = ?").run(id);
  res.json({ success: true });
});

// Events: Organizer Verify Gate Pass
app.post('/api/events/verify-pass', (req, res) => {
  const db = getDb();
  const { qrPassCode } = req.body;
  const reg = db.prepare("SELECT * FROM event_registrations WHERE qr_pass_code = ?").get(qrPassCode);
  if (!reg) {
    return res.status(404).json({ valid: false, message: 'Invalid or forged pass code.' });
  }
  db.prepare("UPDATE event_registrations SET checked_in = 1 WHERE id = ?").run(reg.id);
  res.json({ valid: true, message: `Pass verified! Welcome ${reg.user_name} (${reg.user_roll}).`, reg });
});

// Marketplace: Add Item
app.post('/api/marketplace', (req, res) => {
  const db = getDb();
  const { sellerId, sellerName, sellerRoll, type, category, title, description, price, photos } = req.body;
  const id = `mkt_${Date.now()}`;
  db.prepare(`
    INSERT INTO marketplace_items (id, seller_id, seller_name, seller_roll, type, category, title, description, price, photos, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'Just now')
  `).run(id, sellerId, sellerName, sellerRoll, type, category, title, description || '', price || 0, JSON.stringify(photos || []));
  res.json({ success: true, id });
});

// Lost & Found: Add Item
app.post('/api/lostfound', (req, res) => {
  const db = getDb();
  const { posterId, posterName, type, category, title, description, locationArea, incidentDate, secretChallengeQuestion } = req.body;
  const id = `lnf_${Date.now()}`;
  db.prepare(`
    INSERT INTO lost_and_found (id, poster_id, poster_name, type, category, title, description, location_area, incident_date, secret_challenge_question, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `).run(id, posterId, posterName, type, category, title, description || '', locationArea, incidentDate, secretChallengeQuestion);
  res.json({ success: true, id });
});

// Lost & Found: Verify Claim
app.post('/api/lostfound/:id/verify', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { claimantName, claimantAnswer } = req.body;
  if (!claimantAnswer || claimantAnswer.trim().length < 4) {
    return res.json({ success: false, message: 'Answer is too brief to confirm ownership.' });
  }
  db.prepare("UPDATE lost_and_found SET status = 'VERIFYING', claimed_by = ? WHERE id = ?").run(claimantName || 'Keerthi V.', id);
  res.json({ success: true, message: 'Challenge answer accepted by finder! Handover instructions unlocked.' });
});

// Library: Borrow & Return
app.post('/api/library/:id/borrow', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  db.prepare("UPDATE library_books SET available_copies = max(0, available_copies - 1), is_borrowed_by_me = 1, due_date = '14 days from today' WHERE id = ?").run(id);
  res.json({ success: true });
});

app.post('/api/library/:id/return', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  db.prepare("UPDATE library_books SET available_copies = available_copies + 1, is_borrowed_by_me = 0, due_date = null WHERE id = ?").run(id);
  res.json({ success: true });
});

app.post('/api/print-orders', (req, res) => {
  const db = getDb();
  const order = req.body;
  if (!order?.id || !order?.studentId || !Array.isArray(order.files) || order.files.length === 0) {
    return res.status(400).json({ error: 'A print order requires an ID, student, and at least one file.' });
  }
  db.prepare(`
    INSERT OR REPLACE INTO print_orders (id, student_id, student_name, student_roll, files, page_count, layout, color_mode, binding, copies, ready_by, total_amount, status, payment_status, notification_read, created_at, shop_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(order.id, order.studentId, order.studentName, order.studentRoll, JSON.stringify(order.files), order.pageCount, order.layout, order.colorMode, order.binding, order.copies, order.readyBy, order.totalAmount, order.status || 'PAID', order.paymentStatus || 'PAID', order.notificationRead ? 1 : 0, order.createdAt || new Date().toISOString(), order.shopNote || null);
  res.json({ success: true, id: order.id });
});

app.patch('/api/print-orders/:id/status', (req, res) => {
  const db = getDb();
  const { status, shopNote } = req.body;
  db.prepare("UPDATE print_orders SET status = ?, shop_note = coalesce(?, shop_note), notification_read = CASE WHEN ? = 'READY_FOR_PICKUP' THEN 0 ELSE notification_read END WHERE id = ?").run(status, shopNote || null, status, req.params.id);
  res.json({ success: true });
});

app.patch('/api/print-rates', (req, res) => {
  const db = getDb();
  const { blackWhitePerPage, colorPerPage, spiralBinding, lamination } = req.body;
  db.prepare("UPDATE print_rates SET black_white_per_page = ?, color_per_page = ?, spiral_binding = ?, lamination = ? WHERE id = 1").run(Math.max(0, Number(blackWhitePerPage) || 0), Math.max(0, Number(colorPerPage) || 0), Math.max(0, Number(spiralBinding) || 0), Math.max(0, Number(lamination) || 0));
  res.json({ success: true });
});

// Announcements: Broadcast
app.post('/api/announcements', (req, res) => {
  const db = getDb();
  const { title, content, category, source } = req.body;
  const id = `ann_${Date.now()}`;
  db.prepare(`
    INSERT INTO announcements (id, title, source, category, published_at, content, is_important, read)
    VALUES (?, ?, ?, ?, 'Just now', ?, 1, 0)
  `).run(id, title, source || 'Dean of Student Affairs', category || 'CRITICAL', content);
  res.json({ success: true, id });
});

// Event Bookmark Toggle
app.post('/api/events/:id/bookmark', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { userId } = req.body;
  const uid = userId || 'usr_keerthi_001';
  try {
    const existing = db.prepare("SELECT 1 FROM event_bookmarks WHERE user_id = ? AND event_id = ?").get(uid, id);
    if (existing) {
      db.prepare("DELETE FROM event_bookmarks WHERE user_id = ? AND event_id = ?").run(uid, id);
      res.json({ success: true, isSaved: false });
    } else {
      db.prepare("INSERT INTO event_bookmarks (user_id, event_id, created_at) VALUES (?, ?, ?)").run(uid, id, new Date().toISOString());
      res.json({ success: true, isSaved: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Connection Requests
app.get('/api/connections', (req, res) => {
  const db = getDb();
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_keerthi_001';
  try {
    const list = db.prepare("SELECT * FROM connection_requests WHERE receiver_id = ? OR sender_id = ? ORDER BY created_at DESC").all(userId, userId);
    res.json(list.map(cr => ({
      id: cr.id,
      senderId: cr.sender_id,
      senderName: cr.sender_name,
      senderRoll: cr.sender_roll,
      senderDept: cr.sender_dept,
      receiverId: cr.receiver_id,
      type: cr.type,
      message: cr.message,
      status: cr.status,
      createdAt: cr.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/connections/request', (req, res) => {
  const db = getDb();
  const { senderId, senderName, senderRoll, senderDept, receiverId, type, message } = req.body;
  const id = `req_${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO connection_requests (id, sender_id, sender_name, sender_roll, sender_dept, receiver_id, type, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'Just now')
    `).run(id, senderId, senderName, senderRoll, senderDept || 'Engineering', receiverId, type || 'CONNECT', message || '');
    
    logAuditEvent(db, senderId, senderName, 'STUDENT', 'CONNECTION_REQUEST_SENT', `Sent ${type || 'connection'} request to peer ${receiverId}.`);

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/connections/:id/status', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { status, userId, userName } = req.body; // 'ACCEPTED' | 'DECLINED'
  try {
    db.prepare("UPDATE connection_requests SET status = ? WHERE id = ?").run(status, id);
    logAuditEvent(db, userId || 'usr_keerthi_001', userName || 'Student', 'STUDENT', `CONNECTION_${status}`, `Connection request #${id} marked as ${status}.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Communities / Interest Groups
app.get('/api/communities', (req, res) => {
  const db = getDb();
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_keerthi_001';
  try {
    const list = db.prepare("SELECT * FROM communities").all().map(cm => {
      const isMem = db.prepare("SELECT 1 FROM community_memberships WHERE community_id = ? AND user_id = ?").get(cm.id, userId);
      return {
        id: cm.id,
        name: cm.name,
        category: cm.category,
        description: cm.description,
        memberCount: cm.member_count,
        createdBy: cm.created_by,
        isMember: Boolean(isMem),
        topics: JSON.parse(cm.topics || '[]')
      };
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/communities', (req, res) => {
  const db = getDb();
  const { name, category, description, createdBy, topics, creatorName } = req.body;
  const id = `comm_${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO communities (id, name, category, description, member_count, created_by, topics)
      VALUES (?, ?, ?, ?, 1, ?, ?)
    `).run(id, name, category || 'GENERAL', description, createdBy || 'usr_keerthi_001', JSON.stringify(topics || []));
    
    db.prepare(`INSERT OR IGNORE INTO community_memberships (community_id, user_id, joined_at) VALUES (?, ?, ?)`).run(id, createdBy || 'usr_keerthi_001', new Date().toISOString());

    logAuditEvent(db, createdBy || 'usr_keerthi_001', creatorName || 'Student', 'STUDENT', 'COMMUNITY_CREATED', `Founded student community: "${name}" (${category}).`);

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/communities/:id/toggle-join', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { userId, userName } = req.body;
  const uid = userId || 'usr_keerthi_001';
  try {
    const isMem = db.prepare("SELECT 1 FROM community_memberships WHERE community_id = ? AND user_id = ?").get(id, uid);
    if (isMem) {
      db.prepare("DELETE FROM community_memberships WHERE community_id = ? AND user_id = ?").run(id, uid);
      db.prepare("UPDATE communities SET member_count = max(1, member_count - 1) WHERE id = ?").run(id);
      res.json({ success: true, isMember: false });
    } else {
      db.prepare("INSERT INTO community_memberships (community_id, user_id, joined_at) VALUES (?, ?, ?)").run(id, uid, new Date().toISOString());
      db.prepare("UPDATE communities SET member_count = member_count + 1 WHERE id = ?").run(id);
      logAuditEvent(db, uid, userName || 'Student', 'STUDENT', 'COMMUNITY_JOINED', `Joined campus interest community #${id}.`);
      res.json({ success: true, isMember: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Projects: Applicant Review & Workspace Tasks
app.patch('/api/projects/:id/applicants/:userId', (req, res) => {
  const db = getDb();
  const { id, userId } = req.params;
  const { status, ownerId, ownerName } = req.body; // 'ACCEPTED' | 'REJECTED'
  try {
    db.prepare("UPDATE project_applicants SET status = ? WHERE project_id = ? AND user_id = ?").run(status, id, userId);
    if (status === 'ACCEPTED') {
      db.prepare("UPDATE projects SET current_members_count = current_members_count + 1, open_slots = max(0, open_slots - 1) WHERE id = ?").run(id);
    }
    logAuditEvent(db, ownerId || 'usr_keerthi_001', ownerName || 'Team Lead', 'STUDENT', 'PROJECT_APPLICANT_' + status, `Project lead ${status.toLowerCase()} applicant ${userId} for project #${id}.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/projects/:id/tasks', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { title, assignee } = req.body;
  const taskId = `tsk_${Date.now()}`;
  try {
    db.prepare("INSERT INTO project_tasks (id, project_id, title, assignee, done) VALUES (?, ?, ?, ?, 0)").run(taskId, id, title, assignee || 'Unassigned');
    res.json({ success: true, id: taskId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/projects/:id/tasks/:taskId/toggle', (req, res) => {
  const db = getDb();
  const { taskId } = req.params;
  try {
    db.prepare("UPDATE project_tasks SET done = CASE WHEN done = 1 THEN 0 ELSE 1 END WHERE id = ?").run(taskId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/projects/showcases', (req, res) => {
  const db = getDb();
  const { title, teamName, description, tags, githubUrl, demoUrl, award, year, submitterId, submitterName } = req.body;
  const id = `shw_${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO project_showcases (id, title, team_name, description, tags, github_url, demo_url, award, year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, teamName, description, JSON.stringify(tags || []), githubUrl || null, demoUrl || null, award || null, year || '2026');
    
    logAuditEvent(db, submitterId || 'usr_keerthi_001', submitterName || 'Student', 'STUDENT', 'SHOWCASE_SUBMITTED', `Showcased project: "${title}" by ${teamName}.`);

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Direct Messaging (Chat)
app.get('/api/messages', (req, res) => {
  const db = getDb();
  const { userId, partnerId } = req.query;
  const uid = userId || 'usr_keerthi_001';
  try {
    let msgs;
    if (partnerId) {
      msgs = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY sent_at ASC
      `).all(uid, partnerId, partnerId, uid);
    } else {
      msgs = db.prepare(`
        SELECT * FROM direct_messages 
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY sent_at ASC
      `).all(uid, uid);
    }
    res.json(msgs.map(dm => ({
      id: dm.id,
      senderId: dm.sender_id,
      receiverId: dm.receiver_id,
      senderName: dm.sender_name,
      receiverName: dm.receiver_name,
      itemId: dm.item_id,
      itemTitle: dm.item_title,
      content: dm.content,
      sentAt: dm.sent_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', (req, res) => {
  const db = getDb();
  const { senderId, receiverId, senderName, receiverName, itemId, itemTitle, content } = req.body;
  const id = `msg_${Date.now()}`;
  const sentAt = 'Just now';
  try {
    db.prepare(`
      INSERT INTO direct_messages (id, sender_id, receiver_id, sender_name, receiver_name, item_id, item_title, content, sent_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, senderId, receiverId, senderName, receiverName, itemId || null, itemTitle || null, content, sentAt);
    res.json({ success: true, id, message: { id, senderId, receiverId, senderName, receiverName, itemId, itemTitle, content, sentAt } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Item Reporting (Marketplace & Lost/Found)
app.post('/api/reports/item', (req, res) => {
  const db = getDb();
  const { targetType, targetId, itemTitle, reporterId, reporterName, reason, details } = req.body;
  const id = `rep_${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO item_reports (id, target_type, target_id, item_title, reporter_id, reporter_name, reason, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', 'Just now')
    `).run(id, targetType, targetId, itemTitle, reporterId, reporterName, reason, details || '');
    
    logAuditEvent(db, reporterId, reporterName, 'STUDENT', 'ITEM_REPORTED', `Reported ${targetType} item "${itemTitle}" for: ${reason}`);

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/reports', (req, res) => {
  const db = getDb();
  try {
    const list = db.prepare("SELECT * FROM item_reports ORDER BY created_at DESC").all();
    res.json(list.map(ir => ({
      id: ir.id,
      targetType: ir.target_type,
      targetId: ir.target_id,
      itemTitle: ir.item_title,
      reporterId: ir.reporter_id,
      reporterName: ir.reporter_name,
      reason: ir.reason,
      details: ir.details,
      status: ir.status,
      createdAt: ir.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/reports/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { action, adminId, adminName } = req.body; // 'DISMISS' | 'REMOVE_ITEM'
  try {
    const rep = db.prepare("SELECT * FROM item_reports WHERE id = ?").get(id);
    if (!rep) return res.status(404).json({ error: 'Report not found' });

    if (action === 'REMOVE_ITEM') {
      db.prepare("UPDATE item_reports SET status = 'REMOVED' WHERE id = ?").run(id);
      if (rep.target_type === 'MARKETPLACE') {
        db.prepare("UPDATE marketplace_items SET status = 'SOLD' WHERE id = ?").run(rep.target_id);
      } else {
        db.prepare("UPDATE lost_and_found SET status = 'CLOSED' WHERE id = ?").run(rep.target_id);
      }
      logAuditEvent(db, adminId || 'usr_dean_001', adminName || 'Dean Office', 'CAMPUS_ADMIN', 'ITEM_MODERATED', `Removed reported item "${rep.item_title}" from ${rep.target_type}.`);
    } else {
      db.prepare("UPDATE item_reports SET status = 'DISMISSED' WHERE id = ?").run(id);
      logAuditEvent(db, adminId || 'usr_dean_001', adminName || 'Dean Office', 'CAMPUS_ADMIN', 'REPORT_DISMISSED', `Dismissed report against "${rep.item_title}".`);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Hostel Mess Food Escalation to Higher Authority
app.post('/api/hostel/mess-reports', (req, res) => {
  const db = getDb();
  const { reporterId, reporterName, reporterRoll, hostelBlock, mealType, category, incidentDate, description, severity } = req.body;
  const id = `mess_rep_${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO mess_reports (id, reporter_id, reporter_name, reporter_roll, hostel_block, meal_type, category, incident_date, description, severity, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ESCALATED', 'Just now')
    `).run(id, reporterId, reporterName, reporterRoll, hostelBlock, mealType, category, incidentDate, description, severity || 'HIGH');
    
    logAuditEvent(db, reporterId, reporterName, 'STUDENT', 'MESS_ESCALATION', `Mess grievance escalated for ${hostelBlock} (${mealType} - ${category}).`);

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/hostel/mess-reports', (req, res) => {
  const db = getDb();
  try {
    const list = db.prepare("SELECT * FROM mess_reports ORDER BY created_at DESC").all();
    res.json(list.map(mr => ({
      id: mr.id,
      reporterId: mr.reporter_id,
      reporterName: mr.reporter_name,
      reporterRoll: mr.reporter_roll,
      hostelBlock: mr.hostel_block,
      mealType: mr.meal_type,
      category: mr.category,
      incidentDate: mr.incident_date,
      description: mr.description,
      severity: mr.severity,
      status: mr.status,
      actionTaken: mr.action_taken,
      createdAt: mr.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/hostel/mess-reports/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { status, actionTaken, adminId, adminName } = req.body;
  try {
    db.prepare("UPDATE mess_reports SET status = ?, action_taken = ? WHERE id = ?").run(status || 'RESOLVED', actionTaken || 'Chief Warden audited mess contractor kitchen.', id);
    logAuditEvent(db, adminId || 'usr_warden_001', adminName || 'Chief Warden', 'HOSTEL_STAFF', 'MESS_REPORT_RESOLVED', `Grievance #${id} resolved: ${actionTaken || 'Kitchen audited.'}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Assignment Submission
app.patch('/api/assignments/:id/submit', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { fileAttachment, studentId, studentName } = req.body;
  try {
    db.prepare("UPDATE assignments SET status = 'SUBMITTED', file_attachment = coalesce(?, file_attachment) WHERE id = ?").run(fileAttachment || 'assignment_submission.pdf', id);
    logAuditEvent(db, studentId || 'usr_keerthi_001', studentName || 'Student', 'STUDENT', 'ASSIGNMENT_SUBMITTED', `Submitted coursework assignment #${id}.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', (req, res) => {
  const db = getDb();
  try {
    const list = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC").all();
    res.json(list.map(al => ({
      id: al.id,
      actorId: al.actor_id,
      actorName: al.actor_name,
      actorRole: al.actor_role,
      action: al.action,
      details: al.details,
      timestamp: al.timestamp
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grounded AI: Ask Campus RAG Engine
app.post('/api/ai/ask', (req, res) => {
  const db = getDb();
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });

  const chunks = db.prepare("SELECT * FROM campus_knowledge").all();
  const lower = query.toLowerCase();

  let bestChunk = null;
  let highestScore = 0;

  for (const c of chunks) {
    const keywords = JSON.parse(c.keywords || '[]');
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score += 2;
    }
    if (lower.includes(c.document_title.toLowerCase().split(' ')[0].toLowerCase())) score += 1;

    if (score > highestScore) {
      highestScore = score;
      bestChunk = c;
    }
  }

  if (bestChunk && highestScore > 0) {
    res.json({
      answer: bestChunk.content,
      sourceDocument: bestChunk.document_title,
      sourceSection: bestChunk.section,
      pageNumber: bestChunk.page_number,
      confidence: 0.96
    });
  } else {
    res.json({
      answer: "I couldn't find a direct official circular or regulation matching your query in the verified campus database. Please visit the Academic Section (Dean Office, Room 102) or submit a ticket to the Student Affairs Desk.",
      sourceDocument: "Campus Official Directory",
      sourceSection: "Administrative Helpdesk & Contacts",
      pageNumber: 1,
      confidence: 0.40
    });
  }
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Campus OS Backend & Real SQLite Database running on http://localhost:${PORT}`);
});
