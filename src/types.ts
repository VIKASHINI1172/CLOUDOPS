export type UserRole = 'Admin' | 'Member' | 'Viewer';
export type UserStatus = 'Online' | 'Focusing' | 'In a meeting' | 'Away' | 'Offline';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  position: string;
  department?: string;
  avatarInitials: string;
  avatarBg?: string;
  email: string;
  status: UserStatus;
  workloadHours?: number;
  openTasksCount?: number;
  completedTasksCount?: number;
  capacityHours?: number;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  plan: string;
  logoText: string;
}

export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  url?: string;
}

export interface TaskActivity {
  id: string;
  authorName: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeInitials: string;
  dueDate: string;
  commentsCount: number;
  attachmentsCount: number;
  label: string;
  progress?: number;
  lastEditedBy: string;
  lastEditedAt: string;
  checklist?: ChecklistItem[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  history?: TaskActivity[];
  viewers?: string[];
}

export interface FileItem {
  id: string;
  name: string;
  folder: string;
  size: string;
  sizeBytes?: number;
  uploadedBy: string;
  uploadedDate: string;
  sharedStatus: 'Shared with Team' | 'Private' | 'Public Link';
  extension: string;
  type: 'doc' | 'pdf' | 'archive' | 'sheet' | 'data' | 'design' | 'video' | 'image' | 'other';
  contentPreview?: string;
}

export interface DiscussionComment {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorPosition: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorPosition: string;
  type: 'Announcement' | 'Discussion';
  pinned: boolean;
  requiresAcknowledgment: boolean;
  acknowledgedBy: string[]; // user IDs
  repliesCount: number;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  comments: DiscussionComment[];
  readBy: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  priority: TaskPriority;
  dueDate: string;
  status: 'Not started' | 'In progress' | 'Completed';
  createdAsTask?: boolean;
}

export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  attendanceStatus?: string;
  meetingType: 'Sync' | 'Planning' | 'Review' | 'Outreach';
  agenda: string;
  rawNotes: string;
  aiSummary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  transcriptPreview?: string;
  status: 'Processed' | 'Draft';
  reviewed: boolean;
}

export interface ApprovalStep {
  stepNumber: number;
  title: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'current';
  date?: string;
}

export interface Approval {
  id: string;
  title: string;
  type: 'Budget' | 'Creative' | 'Software' | 'Payment' | 'Policy';
  requestedById: string;
  requestedByName: string;
  currentStep: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  amount?: string;
  createdAt: string;
  dueDate: string;
  reviewers: string[];
  description: string;
  attachedFiles?: string[];
  steps?: ApprovalStep[];
  comments?: { id: string; author: string; text: string; time: string }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'meeting' | 'deadline' | 'task' | 'focus';
  requiredAttendees: string[];
  optionalAttendees: string[];
  location?: string;
  description?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'approval' | 'meeting' | 'announcement' | 'system';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail?: string;
  action: string;
  entity: 'Task' | 'File' | 'Meeting' | 'Approval' | 'Discussion' | 'Member' | 'System' | 'Decision';
  entityName: string;
  changeSummary: string;
  diffBefore?: string;
  diffAfter?: string;
}

export interface SharedNote {
  id: string;
  title: string;
  category: string;
  content: string;
  lastEditedBy: string;
  lastEditedAt: string;
  isFavorite: boolean;
  contributors: string[];
  activeEditor?: string;
  commentsCount: number;
  relatedTasks?: string[];
  relatedMeetings?: string[];
}

export interface WorkloadSnapshot {
  memberId: string;
  memberName: string;
  role: string;
  openTasks: number;
  completedTasks: number;
  estimatedHours: number;
  capacityHours: number;
  status: 'Overloaded' | 'Balanced' | 'Underutilized';
  focusHoursThisWeek: number;
  suggestedAction?: string;
}

export interface Shift {
  id: string;
  title: string;
  date: string; // e.g., 2026-09-15
  startTime: string;
  endTime: string;
  location: string;
  assignedMemberIds: string[];
  requiredCount: number;
  status: 'Covered' | 'Understaffed' | 'Open';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Task lists' | 'Meeting agendas' | 'Approval requests' | 'Event planning' | 'Onboarding';
  tasksCount: number;
  createdBy: string;
  lastUsed: string;
  contentPreview: string[];
}

export interface WhiteboardItem {
  id: string;
  type: 'sticky' | 'shape' | 'text';
  text: string;
  color: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  category?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  authorName: string;
  createdAt: string;
  endDate: string;
  isAnonymous: boolean;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  isClosed: boolean;
}

export interface Kudo {
  id: string;
  fromName: string;
  fromRole: string;
  toName: string;
  toRole: string;
  message: string;
  linkedTask?: string;
  timestamp: string;
  reactions: { [emoji: string]: number };
  userReacted?: string[];
}

export interface Decision {
  id: string;
  text: string;
  decidedBy: string;
  date: string;
  sourceMeetingOrDiscussion: string;
  relatedTasks: string[];
  status: 'Active' | 'Under Review' | 'Superseded';
  context?: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  completedAt: string;
}
