import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'campus.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT,
    avatar_url TEXT,
    avatar_color TEXT DEFAULT '#6366f1',
    role TEXT NOT NULL DEFAULT 'STUDENT',
    department TEXT NOT NULL,
    batch_year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    hostel_block TEXT,
    room_number TEXT,
    bio TEXT,
    skills TEXT, -- JSON array
    interests TEXT, -- JSON array
    collaboration_goals TEXT, -- JSON array
    is_mentor INTEGER DEFAULT 0,
    mentor_topics TEXT, -- JSON array
    is_verified INTEGER DEFAULT 1,
    id_card_url TEXT,
    verification_status TEXT DEFAULT 'APPROVED',
    privacy_settings TEXT -- JSON object
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    faculty_name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    classes_held INTEGER NOT NULL DEFAULT 0,
    classes_attended INTEGER NOT NULL DEFAULT 0,
    room TEXT,
    schedule_day_time TEXT,
    syllabus_url TEXT
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    total_marks INTEGER NOT NULL,
    obtained_marks INTEGER,
    file_attachment TEXT
  );

  CREATE TABLE IF NOT EXISTS campus_issues (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location_building TEXT NOT NULL,
    location_room TEXT,
    urgency TEXT NOT NULL DEFAULT 'MEDIUM',
    status TEXT NOT NULL DEFAULT 'REPORTED',
    reporter_id TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    assigned_to TEXT,
    staff_notes TEXT,
    created_at TEXT NOT NULL,
    resolved_at TEXT,
    photo_url TEXT,
    reopen_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    club_id TEXT,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    registered_count INTEGER NOT NULL DEFAULT 0,
    registration_deadline TEXT
  );

  CREATE TABLE IF NOT EXISTS event_registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_roll TEXT NOT NULL,
    user_name TEXT NOT NULL,
    qr_pass_code TEXT NOT NULL,
    checked_in INTEGER DEFAULT 0,
    registered_at TEXT NOT NULL,
    FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    lead_name TEXT NOT NULL,
    members_count INTEGER NOT NULL DEFAULT 0,
    is_joined INTEGER DEFAULT 0,
    recruitment_open INTEGER DEFAULT 1,
    recruitment_deadline TEXT,
    badge TEXT
  );

  CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    type TEXT NOT NULL,
    stipend_or_prize TEXT,
    department_eligibility TEXT, -- JSON
    min_cgpa REAL,
    deadline TEXT NOT NULL,
    skills TEXT, -- JSON
    description TEXT,
    is_saved INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    description TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'HACKATHON',
    required_skills TEXT, -- JSON
    open_slots INTEGER DEFAULT 2,
    current_members_count INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS project_applicants (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    skills TEXT, -- JSON
    pitch TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TEXT NOT NULL,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS project_tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    assignee TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS marketplace_items (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    seller_roll TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER DEFAULT 0,
    photos TEXT, -- JSON
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lost_and_found (
    id TEXT PRIMARY KEY,
    poster_id TEXT NOT NULL,
    poster_name TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location_area TEXT NOT NULL,
    incident_date TEXT NOT NULL,
    secret_challenge_question TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    claimed_by TEXT
  );

  CREATE TABLE IF NOT EXISTS library_books (
    id TEXT PRIMARY KEY,
    isbn TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    category TEXT NOT NULL,
    shelf_location TEXT NOT NULL,
    total_copies INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    is_borrowed_by_me INTEGER DEFAULT 0,
    due_date TEXT
  );

  CREATE TABLE IF NOT EXISTS hostel_mess (
    day TEXT PRIMARY KEY,
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    snacks TEXT NOT NULL,
    dinner TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    published_at TEXT NOT NULL,
    content TEXT NOT NULL,
    is_important INTEGER DEFAULT 0,
    read INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS campus_knowledge (
    id TEXT PRIMARY KEY,
    document_title TEXT NOT NULL,
    section TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT NOT NULL -- JSON
  );

  CREATE TABLE IF NOT EXISTS direct_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    item_id TEXT,
    item_title TEXT,
    content TEXT NOT NULL,
    sent_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS event_bookmarks (
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY(user_id, event_id)
  );

  CREATE TABLE IF NOT EXISTS connection_requests (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_roll TEXT NOT NULL,
    sender_dept TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'CONNECT',
    message TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL,
    topics TEXT
  );

  CREATE TABLE IF NOT EXISTS community_memberships (
    community_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TEXT NOT NULL,
    PRIMARY KEY(community_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS project_showcases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    team_name TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT,
    github_url TEXT,
    demo_url TEXT,
    award TEXT,
    year TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS item_reports (
    id TEXT PRIMARY KEY,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    item_title TEXT NOT NULL,
    reporter_id TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS mess_reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reporter_roll TEXT NOT NULL,
    hostel_block TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    category TEXT NOT NULL,
    incident_date TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'HIGH',
    status TEXT NOT NULL DEFAULT 'ESCALATED',
    action_taken TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exam_timetable (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    hall TEXT NOT NULL,
    seat_number TEXT NOT NULL,
    max_marks INTEGER NOT NULL,
    instructions TEXT
  );

  CREATE TABLE IF NOT EXISTS academic_calendar (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    description TEXT NOT NULL,
    is_important INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS print_rates (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    black_white_per_page INTEGER NOT NULL DEFAULT 2,
    color_per_page INTEGER NOT NULL DEFAULT 10,
    spiral_binding INTEGER NOT NULL DEFAULT 20,
    lamination INTEGER NOT NULL DEFAULT 15
  );

  CREATE TABLE IF NOT EXISTS print_orders (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_roll TEXT NOT NULL,
    files TEXT NOT NULL,
    page_count INTEGER NOT NULL,
    layout TEXT NOT NULL,
    color_mode TEXT NOT NULL,
    binding TEXT NOT NULL,
    copies INTEGER NOT NULL,
    ready_by TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAID',
    payment_status TEXT NOT NULL DEFAULT 'PAID',
    notification_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    shop_note TEXT
  );
`);

db.prepare(`INSERT OR IGNORE INTO print_rates (id, black_white_per_page, color_per_page, spiral_binding, lamination) VALUES (1, 2, 10, 20, 15)`).run();

// Safe schema migration for users columns
try {
  const tableCols = db.prepare("PRAGMA table_info(users)").all();
  const colNames = new Set(tableCols.map(c => c.name));
  if (!colNames.has('password')) {
    db.exec("ALTER TABLE users ADD COLUMN password TEXT;");
  }
  if (!colNames.has('avatar_color')) {
    db.exec("ALTER TABLE users ADD COLUMN avatar_color TEXT DEFAULT '#6366f1';");
  }
  if (!colNames.has('id_card_url')) {
    db.exec("ALTER TABLE users ADD COLUMN id_card_url TEXT;");
  }
  if (!colNames.has('verification_status')) {
    db.exec("ALTER TABLE users ADD COLUMN verification_status TEXT DEFAULT 'APPROVED';");
  }

  // Safe schema migration for direct_messages
  const dmCols = db.prepare("PRAGMA table_info(direct_messages)").all();
  const dmColNames = new Set(dmCols.map(c => c.name));
  if (!dmColNames.has('receiver_name')) {
    db.exec("ALTER TABLE direct_messages ADD COLUMN receiver_name TEXT DEFAULT '';");
  }
  if (!dmColNames.has('item_id')) {
    db.exec("ALTER TABLE direct_messages ADD COLUMN item_id TEXT;");
  }
  if (!dmColNames.has('item_title')) {
    db.exec("ALTER TABLE direct_messages ADD COLUMN item_title TEXT;");
  }
} catch (e) {
  // column already handled
}

export function getDb() {
  return db;
}
