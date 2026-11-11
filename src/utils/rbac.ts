import { UserRole } from '../types';

export type ActiveNavTab = 
  | 'dashboard' 
  | 'academics' 
  | 'issues' 
  | 'events' 
  | 'clubs' 
  | 'opportunities' 
  | 'projects' 
  | 'people' 
  | 'marketplace' 
  | 'lostfound' 
  | 'library' 
  | 'hostel' 
  | 'ask_ai' 
  | 'admin'
  | 'println'
  | 'print_admin';

export const ROLE_ALLOWED_TABS: Record<UserRole, ActiveNavTab[]> = {
  STUDENT: [
    'dashboard', 'academics', 'println', 'issues', 'events', 
    'clubs', 'opportunities', 'projects', 'people', 
    'marketplace', 'lostfound', 'library', 'hostel', 'ask_ai'
  ],
  PRINT_ADMIN: [
    'print_admin', 'println', 'ask_ai'
  ],
  FACILITY_STAFF: [
    'issues', 'ask_ai', 'people'
  ],
  CAMPUS_ADMIN: [
    'admin', 'issues', 'opportunities', 'ask_ai'
  ],
  CLASS_REP: [
    'dashboard', 'academics', 'println', 'issues', 'events', 
    'clubs', 'opportunities', 'projects', 'people', 
    'marketplace', 'lostfound', 'library', 'hostel', 'ask_ai'
  ],
  CLUB_LEADER: [
    'clubs', 'events', 'opportunities', 'projects', 'people', 'ask_ai'
  ],
  FACULTY: [
    'academics', 'dashboard', 'issues', 'library', 'people', 'ask_ai'
  ],
  HOSTEL_STAFF: [
    'hostel', 'issues', 'dashboard', 'people', 'ask_ai'
  ],
  LIBRARIAN: [
    'library', 'dashboard', 'issues', 'people', 'ask_ai'
  ],
  SENIOR_MENTOR: [
    'dashboard', 'academics', 'println', 'issues', 'events', 
    'clubs', 'opportunities', 'projects', 'people', 
    'marketplace', 'lostfound', 'library', 'hostel', 'ask_ai'
  ]
};

export const ROLE_DEFAULT_TAB: Record<UserRole, ActiveNavTab> = {
  STUDENT: 'dashboard',
  PRINT_ADMIN: 'print_admin',
  FACILITY_STAFF: 'issues',
  CAMPUS_ADMIN: 'admin',
  CLASS_REP: 'dashboard',
  CLUB_LEADER: 'clubs',
  FACULTY: 'academics',
  HOSTEL_STAFF: 'hostel',
  LIBRARIAN: 'library',
  SENIOR_MENTOR: 'dashboard'
};

export function isTabAllowed(role: UserRole, tab: ActiveNavTab): boolean {
  const allowed = ROLE_ALLOWED_TABS[role];
  return allowed ? allowed.includes(tab) : true;
}
