# 🎓 Student Hub — Organized Team Repository

This is a separately organized copy of the Campus OS / Student Hub project.
The original project remains unchanged at `E:\community`.

## Team ownership

| Member | Folder | Features |
| --- | --- | --- |
| Work 1 | `src/work-1-academics/` | Dashboard, academics, attendance, GPA tools, library, Println |
| Work 2 | `src/work-2-campus-operations/` | Campus issues, hostel, mess, admin portal, Print Hub Admin |
| Work 3 | `src/work-3-community-career/` | Events, clubs, opportunities, projects, people and mentors |
| Work 4 | `src/work-4-student-services/` | Marketplace, lost and found, Campus AI |

Shared code stays in `src/context/`, `src/data/`, `src/types/`, and `src/components/layout/`.

## Working rules

- Work inside your assigned member folder for feature changes.
- Use the shared context and types instead of duplicating state models.
- Coordinate changes to `src/App.tsx` and shared files before merging.
- Run `npm install` once, then use `npm run build` before opening a pull request.
- Do not commit `node_modules`, `dist`, or generated files under `data/`.

## Suggested GitHub repository

Create a new GitHub repository named `student-hub-organized`, then add it as the `origin` remote for this folder.

---

# 🎓 Campus OS — College Student Ecosystem (V1)
> **A complete, production-grade One-College Student Campus Operating System**  
> Built according to the Comprehensive PRD specification.

---

## 🌟 Overview & Highlights

Campus OS is a fully functional, production-ready campus platform designed to centralize academic tracking, peer collaboration, campus maintenance ticketing, verified events, student commerce, and grounded regulatory AI into a single trusted hub.

### 🚀 What's Working & Ready to Use:
1. **Student Dashboard**: Personalized academic summary, real-time aggregate attendance health, active maintenance ticket lifecycle stepper, today's timetable, pending assignment deadlines, and official announcements.
2. **Academics & Attendance Risk Engine**:
   - Course overview with credits, room, syllabus, and faculty details.
   - **Forward Projection & Bunk-Budget Engine**: Calculates exact classes needed to cross the 75% examination eligibility cutoff or safe bunkable lectures.
   - Interactive semester SGPA/CGPA estimator with letter-grade mappings.
   - Verified Previous-Year Exam Question Banks (PYQs) & lecture notes download center.
3. **Campus Issues & Maintenance SLA (Ticketing)**:
   - Report issues with categories (Wi-Fi, Electrical, Classroom, Lab, Washroom, Hostel).
   - Auto-routing to department maintenance desks (Network IT, Facilities Cell).
   - Real-time 4-stage lifecycle tracker (`Reported` → `Assigned` → `In Progress` → `Resolved`).
   - Staff triage tools & notes.
   - **Student Reopen & Escalation Flow**: If an issue persists, students can reopen with audit notes, escalating directly to the Dean / Head of Facilities.
4. **Events & Digital QR Entry Passes**:
   - Discover hackathons, workshops, and sports tournaments.
   - 1-Click RSVP with real-time capacity and registration tracker.
   - **Cryptographic QR Code Pass Generator**: Digital student entry tickets.
   - **Organizer Gate Scanner Simulator**: Verifies valid student pass tokens and marks attendance in the database.
5. **Project Team Finder & Collaborations**:
   - Create project listings with skill tags and open member slots.
   - Apply with personalized pitches without exposing private phone numbers.
   - Interactive project workspace with task checklist and assignee milestones.
6. **Campus Marketplace & Barter Exchange**:
   - Buy, sell, lend/borrow, or donate calculators, lab coats, textbooks, and electronic kits.
   - Zero platform fees, student roll-number verification, and in-app direct seller contact.
7. **Campus Lost & Found with Challenge Verification**:
   - Post lost or found items (ID cards, AirPods, keys, water bottles).
   - **Private Challenge Question Barrier**: Claimants must answer a secret verification question (e.g., *"What sticker is on the back?"*) before handover details are unlocked.
8. **Central Library Catalog & Digital Loans**:
   - Search physical shelf locations and check real-time available copies.
   - Borrow books with 14-day automatic due-date countdown and return tracking.
9. **Hostel & Weekly Mess Menu**:
   - Full 7-day meal plan (Breakfast, Lunch, Snacks, Dinner) with interactive day-of-week switcher.
   - Direct link to hostel maintenance tickets.
10. **Grounded Campus AI ("Ask Campus AI")**:
    - Grounded Retrieval-Augmented Generation (RAG) over verified college handbooks and circulars.
    - Zero hallucination policy: Every answer displays exact **Document Name**, **Section**, and **Page Number** provenance citations.
11. **Student Directory & Senior Mentor Network**:
    - Privacy-preserving directory searchable by technical skills (React, Python, ROS, etc.).
    - Verified senior mentor profiles with bookable topics.
12. **Admin & Representative Console**:
    - Track maintenance resolution SLAs, open ticket aging, and broadcast emergency official notices.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend API**: Node.js v24, Express, CORS
- **Database**: Native Node v24 SQLite (`node:sqlite` `DatabaseSync`) with WAL mode (`data/campus.db`)
- **Seeder**: Automatic initial seeding of realistic college ecosystem data on startup (`server/seed.js`)
- **AI RAG Engine**: In-memory keyword + semantic vector scoring with source citation provenance

---

## 🏃 Quick Start Guide

### 1. Run the Full Application (Backend + Frontend together):
```bash
npm run dev:full
```
This concurrently starts:
- The REST API and SQLite Database on `http://localhost:5000`
- The Vite Client on `http://localhost:3000` (with automatic `/api` proxying to port 5000)

### 2. Or Run the Production Server (Serves API + Built Frontend):
```bash
npm run start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

### 3. Build the Frontend:
```bash
npm run build
```

---

## 👤 Pre-configured Test Personas

You can switch personas anytime using the **Switch Persona** button in the top navigation bar:
- **Student**: Keerthi V. (Roll #22CS084, 3rd Year CSE)
- **Class Representative**: Rohan Deshmukh (Mech)
- **Club Leader**: Aravind K. (ACM Chapter Lead)
- **Faculty / Professor**: Dr. Radhakrishnan S. (DBMS Faculty)
- **Hostel Staff**: Chief Warden Office
- **Campus Admin**: Dean & Facilities Director
