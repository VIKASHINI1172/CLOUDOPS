import {
  Task,
  FileItem,
  DiscussionPost,
  MeetingNote,
  Approval,
  CalendarEvent,
  NotificationItem,
  AuditEntry,
  SharedNote,
  WorkloadSnapshot,
  Shift,
  Template,
  WhiteboardItem,
  Poll,
  Kudo,
  Decision,
  User,
  Workspace,
  FocusSession,
} from '../types';
import {
  INITIAL_WORKSPACE,
  INITIAL_MEMBERS,
  INITIAL_TASKS,
  INITIAL_FILES,
  INITIAL_DISCUSSIONS,
  INITIAL_MEETING_NOTES,
  INITIAL_APPROVALS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOG,
  INITIAL_SHARED_NOTES,
  INITIAL_WORKLOAD_SNAPSHOTS,
  INITIAL_SHIFTS,
  INITIAL_TEMPLATES,
  INITIAL_WHITEBOARD_ITEMS,
  INITIAL_POLLS,
  INITIAL_KUDOS,
  INITIAL_DECISIONS,
} from '../mockData';

const STORAGE_KEYS = {
  WORKSPACE: 'cloudops_workspace',
  MEMBERS: 'cloudops_members',
  CURRENT_USER_ID: 'cloudops_current_user_id',
  TASKS: 'cloudops_tasks',
  FILES: 'cloudops_files',
  DISCUSSIONS: 'cloudops_discussions',
  MEETINGS: 'cloudops_meetings',
  APPROVALS: 'cloudops_approvals',
  EVENTS: 'cloudops_events',
  NOTIFICATIONS: 'cloudops_notifications',
  AUDIT_LOG: 'cloudops_audit_log',
  SHARED_NOTES: 'cloudops_shared_notes',
  WORKLOAD: 'cloudops_workload',
  SHIFTS: 'cloudops_shifts',
  TEMPLATES: 'cloudops_templates',
  WHITEBOARD: 'cloudops_whiteboard',
  POLLS: 'cloudops_polls',
  KUDOS: 'cloudops_kudos',
  DECISIONS: 'cloudops_decisions',
  FOCUS_SESSIONS: 'cloudops_focus_sessions',
  THEME: 'cloudops_theme',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage, using fallback:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Reset all data to initial defaults
  resetAll: () => {
    localStorage.clear();
    safeSet(STORAGE_KEYS.WORKSPACE, INITIAL_WORKSPACE);
    safeSet(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    safeSet(STORAGE_KEYS.CURRENT_USER_ID, 'usr-aisha');
    safeSet(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    safeSet(STORAGE_KEYS.FILES, INITIAL_FILES);
    safeSet(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
    safeSet(STORAGE_KEYS.MEETINGS, INITIAL_MEETING_NOTES);
    safeSet(STORAGE_KEYS.APPROVALS, INITIAL_APPROVALS);
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_CALENDAR_EVENTS);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    safeSet(STORAGE_KEYS.AUDIT_LOG, INITIAL_AUDIT_LOG);
    safeSet(STORAGE_KEYS.SHARED_NOTES, INITIAL_SHARED_NOTES);
    safeSet(STORAGE_KEYS.WORKLOAD, INITIAL_WORKLOAD_SNAPSHOTS);
    safeSet(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS);
    safeSet(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
    safeSet(STORAGE_KEYS.WHITEBOARD, INITIAL_WHITEBOARD_ITEMS);
    safeSet(STORAGE_KEYS.POLLS, INITIAL_POLLS);
    safeSet(STORAGE_KEYS.KUDOS, INITIAL_KUDOS);
    safeSet(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS);
    safeSet(STORAGE_KEYS.FOCUS_SESSIONS, []);
  },

  // Workspace
  getWorkspace: (): Workspace => safeGet(STORAGE_KEYS.WORKSPACE, INITIAL_WORKSPACE),
  saveWorkspace: (ws: Workspace) => safeSet(STORAGE_KEYS.WORKSPACE, ws),

  // Members
  getMembers: (): User[] => safeGet(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMembers: (members: User[]) => safeSet(STORAGE_KEYS.MEMBERS, members),
  getCurrentUserId: (): string => safeGet(STORAGE_KEYS.CURRENT_USER_ID, 'usr-aisha'),
  setCurrentUserId: (id: string) => safeSet(STORAGE_KEYS.CURRENT_USER_ID, id),

  // Tasks
  getTasks: (): Task[] => safeGet(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: Task[]) => safeSet(STORAGE_KEYS.TASKS, tasks),

  // Files
  getFiles: (): FileItem[] => safeGet(STORAGE_KEYS.FILES, INITIAL_FILES),
  saveFiles: (files: FileItem[]) => safeSet(STORAGE_KEYS.FILES, files),

  // Discussions
  getDiscussions: (): DiscussionPost[] => safeGet(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS),
  saveDiscussions: (posts: DiscussionPost[]) => safeSet(STORAGE_KEYS.DISCUSSIONS, posts),

  // Meetings
  getMeetings: (): MeetingNote[] => safeGet(STORAGE_KEYS.MEETINGS, INITIAL_MEETING_NOTES),
  saveMeetings: (meetings: MeetingNote[]) => safeSet(STORAGE_KEYS.MEETINGS, meetings),

  // Approvals
  getApprovals: (): Approval[] => safeGet(STORAGE_KEYS.APPROVALS, INITIAL_APPROVALS),
  saveApprovals: (approvals: Approval[]) => safeSet(STORAGE_KEYS.APPROVALS, approvals),

  // Events
  getEvents: (): CalendarEvent[] => safeGet(STORAGE_KEYS.EVENTS, INITIAL_CALENDAR_EVENTS),
  saveEvents: (events: CalendarEvent[]) => safeSet(STORAGE_KEYS.EVENTS, events),

  // Notifications
  getNotifications: (): NotificationItem[] => safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs: NotificationItem[]) => safeSet(STORAGE_KEYS.NOTIFICATIONS, notifs),

  // Audit Log
  getAuditLog: (): AuditEntry[] => safeGet(STORAGE_KEYS.AUDIT_LOG, INITIAL_AUDIT_LOG),
  saveAuditLog: (log: AuditEntry[]) => safeSet(STORAGE_KEYS.AUDIT_LOG, log),

  // Shared Notes
  getSharedNotes: (): SharedNote[] => safeGet(STORAGE_KEYS.SHARED_NOTES, INITIAL_SHARED_NOTES),
  saveSharedNotes: (notes: SharedNote[]) => safeSet(STORAGE_KEYS.SHARED_NOTES, notes),

  // Workload
  getWorkload: (): WorkloadSnapshot[] => safeGet(STORAGE_KEYS.WORKLOAD, INITIAL_WORKLOAD_SNAPSHOTS),
  saveWorkload: (workload: WorkloadSnapshot[]) => safeSet(STORAGE_KEYS.WORKLOAD, workload),

  // Shifts
  getShifts: (): Shift[] => safeGet(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS),
  saveShifts: (shifts: Shift[]) => safeSet(STORAGE_KEYS.SHIFTS, shifts),

  // Templates
  getTemplates: (): Template[] => safeGet(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES),
  saveTemplates: (templates: Template[]) => safeSet(STORAGE_KEYS.TEMPLATES, templates),

  // Whiteboard
  getWhiteboard: (): WhiteboardItem[] => safeGet(STORAGE_KEYS.WHITEBOARD, INITIAL_WHITEBOARD_ITEMS),
  saveWhiteboard: (items: WhiteboardItem[]) => safeSet(STORAGE_KEYS.WHITEBOARD, items),

  // Polls
  getPolls: (): Poll[] => safeGet(STORAGE_KEYS.POLLS, INITIAL_POLLS),
  savePolls: (polls: Poll[]) => safeSet(STORAGE_KEYS.POLLS, polls),

  // Kudos
  getKudos: (): Kudo[] => safeGet(STORAGE_KEYS.KUDOS, INITIAL_KUDOS),
  saveKudos: (kudos: Kudo[]) => safeSet(STORAGE_KEYS.KUDOS, kudos),

  // Decisions
  getDecisions: (): Decision[] => safeGet(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS),
  saveDecisions: (decisions: Decision[]) => safeSet(STORAGE_KEYS.DECISIONS, decisions),

  // Focus Sessions
  getFocusSessions: (): FocusSession[] => safeGet(STORAGE_KEYS.FOCUS_SESSIONS, []),
  saveFocusSessions: (sessions: FocusSession[]) => safeSet(STORAGE_KEYS.FOCUS_SESSIONS, sessions),

  // Theme
  getTheme: (): 'light' | 'dark' => safeGet(STORAGE_KEYS.THEME, 'dark'),
  saveTheme: (theme: 'light' | 'dark') => safeSet(STORAGE_KEYS.THEME, theme),
};
