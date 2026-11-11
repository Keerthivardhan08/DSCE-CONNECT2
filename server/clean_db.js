import { getDb } from './db.js';
const db = getDb();

console.log('Running clean_db.js...');

// 1. Check existing clubs
const existingClubs = db.prepare('SELECT id, name FROM clubs').all();
console.log('Current clubs in DB:', existingClubs);

// Delete all old clubs that are not AEGIS, POINTBLANK, or CPA
db.exec("DELETE FROM clubs WHERE name NOT IN ('AEGIS', 'POINTBLANK', 'CPA');");

// Check if AEGIS, POINTBLANK, CPA exist, insert if missing
const permittedClubs = [
  {
    id: 'club_aegis',
    name: 'AEGIS',
    category: 'TECHNICAL',
    description: 'Premier Cybersecurity & Ethical Hacking chapter of DSCE. Organizing CTFs, Bug Bounty workshops, security auditing labs, and reverse engineering bootcamps.',
    lead_name: 'Aditya Rao',
    members_count: 142,
    is_joined: 1,
    recruitment_open: 1,
    recruitment_deadline: 'Dec 15, 2026',
    badge: 'Official Cyber Chapter'
  },
  {
    id: 'club_pointblank',
    name: 'POINTBLANK',
    category: 'TECHNICAL',
    description: 'Premier student-led coding club and developer collective at DSCE. Driving open-source development, competitive hackathons, modern web/app stacks, and system engineering.',
    lead_name: 'Rohan Sharma',
    members_count: 198,
    is_joined: 0,
    recruitment_open: 1,
    recruitment_deadline: 'Dec 12, 2026',
    badge: 'Premier Dev Guild'
  },
  {
    id: 'club_cpa',
    name: 'CPA',
    category: 'TECHNICAL',
    description: 'Competitive Programming Association of DSCE. Dedicated to ICPC preparation, advanced data structures, algorithmic problem solving, Codeforces, and LeetCode ladders.',
    lead_name: 'Siddharth Nair',
    members_count: 120,
    is_joined: 0,
    recruitment_open: 1,
    recruitment_deadline: 'Dec 18, 2026',
    badge: 'Algorithms & ICPC'
  }
];

const insertClub = db.prepare(`
  INSERT OR REPLACE INTO clubs (id, name, category, description, lead_name, members_count, is_joined, recruitment_open, recruitment_deadline, badge)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const c of permittedClubs) {
  insertClub.run(c.id, c.name, c.category, c.description, c.lead_name, c.members_count, c.is_joined, c.recruitment_open, c.recruitment_deadline, c.badge);
}

const finalClubs = db.prepare('SELECT id, name FROM clubs').all();
console.log('Cleaned clubs in DB:', finalClubs);

// 2. Marketplace cleaning
const existingMkt = db.prepare('SELECT id, title, category FROM marketplace_items').all();
console.log('Current marketplace items:', existingMkt);

db.exec("DELETE FROM marketplace_items WHERE category = 'LAB_COAT' OR title LIKE '%Lab Coat%';");

// Insert standard book if not present
const checkBook = db.prepare("SELECT COUNT(*) as cnt FROM marketplace_items WHERE id = 'mkt_grewal'").get();
if (checkBook.cnt === 0) {
  const insertMkt = db.prepare(`
    INSERT INTO marketplace_items (id, seller_id, seller_name, seller_roll, type, category, title, description, price, photos, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertMkt.run(
    'mkt_grewal',
    'usr_01',
    'Rohit Sharma',
    '24CY018',
    'SELL',
    'BOOKS',
    'Higher Engineering Mathematics - B.S. Grewal (44th Edition)',
    'Mint condition textbook with solved previous VTU/DSCE exam problems and complete calculus and linear algebra modules. Contact +91 98450 12345 or via DSCE Connect message.',
    420,
    JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80']),
    'ACTIVE',
    'Today'
  );
}

console.log('Final marketplace items:', db.prepare('SELECT id, title, category FROM marketplace_items').all());
console.log('DB Clean successfully finished!');
