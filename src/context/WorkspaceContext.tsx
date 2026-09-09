import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Workspace,
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
  TaskStatus,
  TaskPriority,
  FocusSession,
} from '../types';
import { StorageService } from '../services/storageService';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface WorkspaceContextType {
  // Navigation & Shell
  currentRoute: string;
  navigate: (route: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Search & Global Create
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  createModalType: 'task' | 'meeting' | 'announcement' | 'approval' | 'file' | 'note' | null;
  openCreateModal: (type: 'task' | 'meeting' | 'announcement' | 'approval' | 'file' | 'note') => void;
  closeCreateModal: () => void;

  // Workspace & Users
  workspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
  members: User[];
  currentUser: User;
  setCurrentUserById: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  inviteMember: (email: string, name: string, role: 'Admin' | 'Member' | 'Viewer', message?: string) => void;

  // Focus Mode
  isFocusMode: boolean;
  toggleFocusMode: (customDuration?: number) => void;
  focusTimeRemaining: number;
  isFocusRunning: boolean;
  activeFocusTask: { id?: string; title?: string } | null;
  startFocusTimer: (task?: { id: string; title: string }, minutes?: number) => void;
  pauseFocusTimer: () => void;
  stopFocusTimer: () => void;
  focusSessions: FocusSession[];

  // Entities & CRUD
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'lastEditedBy' | 'lastEditedAt' | 'commentsCount' | 'attachmentsCount'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  changeTaskStatus: (taskId: string, newStatus: TaskStatus) => void;

  files: FileItem[];
  uploadFile: (fileData: { name: string; folder: string; size: string; extension: string; type: FileItem['type'] }) => FileItem;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  moveFile: (fileId: string, newFolder: string) => void;

  discussions: DiscussionPost[];
  createPost: (post: { title: string; content: string; type: 'Announcement' | 'Discussion'; pinned?: boolean; requiresAcknowledgment?: boolean }) => DiscussionPost;
  acknowledgePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  addPostComment: (postId: string, commentText: string) => void;

  meetings: MeetingNote[];
  createMeeting: (meeting: Omit<MeetingNote, 'id' | 'reviewed'>) => MeetingNote;
  updateMeeting: (meetingId: string, updates: Partial<MeetingNote>) => void;
  generateMeetingSummary: (meetingId: string) => Promise<void>;
  createTasksFromMeetingActionItems: (meetingId: string) => number;

  approvals: Approval[];
  createApproval: (approval: Omit<Approval, 'id' | 'createdAt' | 'status' | 'requestedById' | 'requestedByName'>) => Approval;
  updateApprovalStatus: (approvalId: string, status: 'Approved' | 'Rejected', comment?: string) => void;

  events: CalendarEvent[];
  createCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  deleteCalendarEvent: (eventId: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  auditLog: AuditEntry[];
  addAuditLog: (action: string, entity: AuditEntry['entity'], entityName: string, changeSummary: string, before?: string, after?: string) => void;

  sharedNotes: SharedNote[];
  createSharedNote: (note: Omit<SharedNote, 'id' | 'lastEditedBy' | 'lastEditedAt' | 'contributors' | 'commentsCount'>) => SharedNote;
  updateSharedNote: (noteId: string, updates: Partial<SharedNote>) => void;
  deleteSharedNote: (noteId: string) => void;

  workload: WorkloadSnapshot[];
  updateWorkload: (newWorkload: WorkloadSnapshot[]) => void;

  shifts: Shift[];
  createShift: (shift: Omit<Shift, 'id' | 'status'>) => Shift;
  assignShiftMember: (shiftId: string, memberId: string) => void;

  templates: Template[];
  useTemplate: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => void;

  whiteboardItems: WhiteboardItem[];
  updateWhiteboardItems: (items: WhiteboardItem[]) => void;
  clearWhiteboard: () => void;

  polls: Poll[];
  votePoll: (pollId: string, optionId: string) => void;
  createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'totalVotes' | 'isClosed' | 'authorName'>) => Poll;
  closePoll: (pollId: string) => void;

  kudos: Kudo[];
  giveKudo: (toMemberId: string, message: string, linkedTask?: string) => void;
  reactKudo: (kudoId: string, emoji: string) => void;

  decisions: Decision[];
  createDecision: (decision: Omit<Decision, 'id' | 'date'>) => Decision;
  updateDecision: (decisionId: string, updates: Partial<Decision>) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Reset
  resetData: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Shell state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'overview';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getTheme());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'task' | 'meeting' | 'announcement' | 'approval' | 'file' | 'note' | null>(null);

  // Workspace & Members
  const [workspace, setWorkspaceState] = useState<Workspace>(() => StorageService.getWorkspace());
  const [members, setMembersState] = useState<User[]>(() => StorageService.getMembers());
  const [currentUserId, setCurrentUserIdState] = useState<string>(() => StorageService.getCurrentUserId());

  // Focus Mode
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTimeRemaining, setFocusTimeRemaining] = useState<number>(25 * 60); // 25 min default
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<{ id?: string; title?: string } | null>(null);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => StorageService.getFocusSessions());

  // Entity states
  const [tasks, setTasksState] = useState<Task[]>(() => StorageService.getTasks());
  const [files, setFilesState] = useState<FileItem[]>(() => StorageService.getFiles());
  const [discussions, setDiscussionsState] = useState<DiscussionPost[]>(() => StorageService.getDiscussions());
  const [meetings, setMeetingsState] = useState<MeetingNote[]>(() => StorageService.getMeetings());
  const [approvals, setApprovalsState] = useState<Approval[]>(() => StorageService.getApprovals());
  const [events, setEventsState] = useState<CalendarEvent[]>(() => StorageService.getEvents());
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [auditLog, setAuditLogState] = useState<AuditEntry[]>(() => StorageService.getAuditLog());
  const [sharedNotes, setSharedNotesState] = useState<SharedNote[]>(() => StorageService.getSharedNotes());
  const [workload, setWorkloadState] = useState<WorkloadSnapshot[]>(() => StorageService.getWorkload());
  const [shifts, setShiftsState] = useState<Shift[]>(() => StorageService.getShifts());
  const [templates, setTemplatesState] = useState<Template[]>(() => StorageService.getTemplates());
  const [whiteboardItems, setWhiteboardItemsState] = useState<WhiteboardItem[]>(() => StorageService.getWhiteboard());
  const [polls, setPollsState] = useState<Poll[]>(() => StorageService.getPolls());
  const [kudos, setKudosState] = useState<Kudo[]>(() => StorageService.getKudos());
  const [decisions, setDecisionsState] = useState<Decision[]>(() => StorageService.getDecisions());

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    setIsMobileNavOpen(false);
  };

  // Theme handling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Toast system
  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Current User
  const currentUser = members.find((m) => m.id === currentUserId) || members[0];

  const setCurrentUserById = (userId: string) => {
    setCurrentUserIdState(userId);
    StorageService.setCurrentUserId(userId);
    const target = members.find((m) => m.id === userId);
    if (target) {
      showToast('User Switched', `Now acting as ${target.name} (${target.position})`, 'info');
    }
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    setMembersState((prev) => {
      const updated = prev.map((m) => (m.id === currentUser.id ? { ...m, ...updates } : m));
      StorageService.saveMembers(updated);
      return updated;
    });
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const inviteMember = (email: string, name: string, role: 'Admin' | 'Member' | 'Viewer', message?: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      position: `${role} Contributor`,
      avatarInitials: initials,
      avatarBg: 'bg-indigo-500',
      status: 'Online',
      workloadHours: 0,
      openTasksCount: 0,
      completedTasksCount: 0,
      capacityHours: 25,
    };
    const updated = [...members, newUser];
    setMembersState(updated);
    StorageService.saveMembers(updated);

    addAuditLog('Invited team member', 'Member', name, `Sent invitation to ${email} as ${role}`);
    showToast('Invitation Sent', `Sent invitation to ${email}`, 'success');
  };

  const setWorkspace = (ws: Workspace) => {
    setWorkspaceState(ws);
    StorageService.saveWorkspace(ws);
    showToast('Workspace Saved', ws.name);
  };

  // Audit Log
  const addAuditLog = (
    action: string,
    entity: AuditEntry['entity'],
    entityName: string,
    changeSummary: string,
    diffBefore?: string,
    diffAfter?: string
  ) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: currentUser.name,
      actorEmail: currentUser.email,
      action,
      entity,
      entityName,
      changeSummary,
      diffBefore,
      diffAfter,
    };
    setAuditLogState((prev) => {
      const updated = [newEntry, ...prev];
      StorageService.saveAuditLog(updated);
      return updated;
    });
  };

  // Focus Mode Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFocusRunning && focusTimeRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (focusTimeRemaining === 0 && isFocusRunning) {
      setIsFocusRunning(false);
      setIsFocusMode(false);
      const session: FocusSession = {
        id: `foc-${Date.now()}`,
        taskId: activeFocusTask?.id,
        taskTitle: activeFocusTask?.title || 'General Focus Block',
        durationMinutes: 25,
        completedAt: new Date().toISOString(),
      };
      const updated = [session, ...focusSessions];
      setFocusSessions(updated);
      StorageService.saveFocusSessions(updated);
      showToast('Focus Session Complete!', 'Great work! Take a 5-minute break.', 'success');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusRunning, focusTimeRemaining, activeFocusTask, focusSessions]);

  const toggleFocusMode = (customDuration?: number) => {
    if (!isFocusMode) {
      setIsFocusMode(true);
      setFocusTimeRemaining(customDuration ? customDuration * 60 : 25 * 60);
      setIsFocusRunning(true);
      showToast('Focus Mode Activated', 'Distractions muted. Pomodoro timer running.', 'info');
    } else {
      setIsFocusMode(false);
      setIsFocusRunning(false);
      showToast('Focus Mode Stopped', 'Back to regular workspace notification mode.');
    }
  };

  const startFocusTimer = (task?: { id: string; title: string }, minutes: number = 25) => {
    setIsFocusMode(true);
    setActiveFocusTask(task || null);
    setFocusTimeRemaining(minutes * 60);
    setIsFocusRunning(true);
    showToast('Focus Timer Started', task ? `Focusing on "${task.title}"` : '25-minute deep focus session', 'info');
  };

  const pauseFocusTimer = () => {
    setIsFocusRunning(false);
    showToast('Focus Paused', 'Timer paused.');
  };

  const stopFocusTimer = () => {
    setIsFocusRunning(false);
    setIsFocusMode(false);
    setFocusTimeRemaining(25 * 60);
    setActiveFocusTask(null);
  };

  // Tasks CRUD
  const createTask = (taskData: Omit<Task, 'id' | 'lastEditedBy' | 'lastEditedAt' | 'commentsCount' | 'attachmentsCount'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      lastEditedBy: currentUser.name,
      lastEditedAt: 'Just now',
      commentsCount: 0,
      attachmentsCount: taskData.attachments ? taskData.attachments.length : 0,
      checklist: taskData.checklist || [],
      comments: [],
      attachments: taskData.attachments || [],
      history: [{ id: `h-${Date.now()}`, authorName: currentUser.name, action: 'created task', timestamp: 'Just now' }],
    };

    setTasksState((prev) => {
      const updated = [newTask, ...prev];
      StorageService.saveTasks(updated);
      return updated;
    });

    // Update workload snapshot
    setWorkloadState((prev) => {
      const updated = prev.map((w) =>
        w.memberId === newTask.assigneeId
          ? { ...w, openTasks: w.openTasks + 1, estimatedHours: w.estimatedHours + 3 }
          : w
      );
      StorageService.saveWorkload(updated);
      return updated;
    });

    addAuditLog('Created task', 'Task', newTask.title, `Created under ${newTask.label} assigned to ${newTask.assigneeName}`);
    showToast('Task Created', `"${newTask.title}" added to ${newTask.status}`);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasksState((prev) => {
      const oldTask = prev.find((t) => t.id === taskId);
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const newHistory = [
            ...(t.history || []),
            {
              id: `h-${Date.now()}`,
              authorName: currentUser.name,
              action: `updated task`,
              timestamp: 'Just now',
            },
          ];
          return {
            ...t,
            ...updates,
            lastEditedBy: currentUser.name,
            lastEditedAt: 'Just now',
            history: newHistory,
          };
        }
        return t;
      });
      StorageService.saveTasks(updated);

      if (oldTask && updates.status && updates.status !== oldTask.status) {
        addAuditLog('Moved task', 'Task', oldTask.title, `Status updated to ${updates.status}`);
      }
      return updated;
    });
    showToast('Task Updated', 'Changes saved successfully.');
  };

  const changeTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasksState((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      StorageService.saveTasks(updated);
      return updated;
    });
    if (taskToDelete) {
      addAuditLog('Deleted task', 'Task', taskToDelete.title, `Removed from ${taskToDelete.status}`);
      showToast('Task Deleted', `"${taskToDelete.title}" has been removed.`, 'info');
    }
  };

  // Files CRUD
  const uploadFile = (fileData: { name: string; folder: string; size: string; extension: string; type: FileItem['type'] }) => {
    const newFile: FileItem = {
      id: `f-${Date.now()}`,
      name: fileData.name,
      folder: fileData.folder,
      size: fileData.size,
      uploadedBy: currentUser.name,
      uploadedDate: new Date().toISOString().slice(0, 10),
      sharedStatus: 'Shared with Team',
      extension: fileData.extension,
      type: fileData.type,
      contentPreview: `Document ${fileData.name} successfully indexed and available to all workspace collaborators.`,
    };

    setFilesState((prev) => {
      const updated = [newFile, ...prev];
      StorageService.saveFiles(updated);
      return updated;
    });

    addAuditLog('Uploaded file', 'File', newFile.name, `Added to folder ${newFile.folder} (${newFile.size})`);
    showToast('File Uploaded', `${newFile.name} uploaded successfully.`);
    return newFile;
  };

  const deleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setFilesState((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      StorageService.saveFiles(updated);
      return updated;
    });
    if (file) {
      addAuditLog('Deleted file', 'File', file.name, `Removed from ${file.folder}`);
      showToast('File Deleted', `${file.name} was removed.`, 'info');
    }
  };

  const renameFile = (fileId: string, newName: string) => {
    setFilesState((prev) => {
      const updated = prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f));
      StorageService.saveFiles(updated);
      return updated;
    });
    showToast('File Renamed', `Renamed to ${newName}`);
  };

  const moveFile = (fileId: string, newFolder: string) => {
    setFilesState((prev) => {
      const updated = prev.map((f) => (f.id === fileId ? { ...f, folder: newFolder } : f));
      StorageService.saveFiles(updated);
      return updated;
    });
    showToast('File Moved', `Moved to ${newFolder}`);
  };

  // Discussions CRUD
  const createPost = (post: { title: string; content: string; type: 'Announcement' | 'Discussion'; pinned?: boolean; requiresAcknowledgment?: boolean }) => {
    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      title: post.title,
      content: post.content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorInitials: currentUser.avatarInitials,
      authorPosition: currentUser.position,
      type: post.type,
      pinned: post.pinned || false,
      requiresAcknowledgment: post.requiresAcknowledgment || false,
      acknowledgedBy: post.requiresAcknowledgment ? [currentUser.id] : [],
      repliesCount: 0,
      createdAt: new Date().toISOString(),
      likes: 0,
      userLiked: false,
      comments: [],
      readBy: [currentUser.id],
    };

    setDiscussionsState((prev) => {
      const updated = [newPost, ...prev];
      StorageService.saveDiscussions(updated);
      return updated;
    });

    addAuditLog('Published post', 'Discussion', newPost.title, `Published new ${newPost.type}`);
    showToast(`${post.type} Published`, `"${newPost.title}" posted to discussion board.`);
    return newPost;
  };

  const acknowledgePost = (postId: string) => {
    setDiscussionsState((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const acknowledgedBy = post.acknowledgedBy.includes(currentUser.id)
            ? post.acknowledgedBy
            : [...post.acknowledgedBy, currentUser.id];
          return { ...post, acknowledgedBy };
        }
        return post;
      });
      StorageService.saveDiscussions(updated);
      return updated;
    });
    const post = discussions.find((p) => p.id === postId);
    addAuditLog('Acknowledged post', 'Discussion', post?.title || 'Announcement', 'Logged read receipt and acknowledgment');
    showToast('Acknowledged', 'Your acknowledgment has been recorded.', 'success');
  };

  const toggleLikePost = (postId: string) => {
    setDiscussionsState((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const userLiked = !post.userLiked;
          const likes = userLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
          return { ...post, userLiked, likes };
        }
        return post;
      });
      StorageService.saveDiscussions(updated);
      return updated;
    });
  };

  const addPostComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `dc-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorInitials: currentUser.avatarInitials,
      authorPosition: currentUser.position,
      content: commentText,
      createdAt: 'Just now',
      likes: 0,
    };

    setDiscussionsState((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
            repliesCount: post.repliesCount + 1,
          };
        }
        return post;
      });
      StorageService.saveDiscussions(updated);
      return updated;
    });
    showToast('Reply Added', 'Your comment has been posted.');
  };

  // Meetings CRUD
  const createMeeting = (meetingData: Omit<MeetingNote, 'id' | 'reviewed'>) => {
    const newMeeting: MeetingNote = {
      ...meetingData,
      id: `mtg-${Date.now()}`,
      reviewed: false,
    };

    setMeetingsState((prev) => {
      const updated = [newMeeting, ...prev];
      StorageService.saveMeetings(updated);
      return updated;
    });

    addAuditLog('Created meeting record', 'Meeting', newMeeting.title, `Logged meeting with ${newMeeting.participants.length} attendees`);
    showToast('Meeting Created', `"${newMeeting.title}" logged.`);
    return newMeeting;
  };

  const updateMeeting = (meetingId: string, updates: Partial<MeetingNote>) => {
    setMeetingsState((prev) => {
      const updated = prev.map((m) => (m.id === meetingId ? { ...m, ...updates } : m));
      StorageService.saveMeetings(updated);
      return updated;
    });
  };

  const generateMeetingSummary = async (meetingId: string): Promise<void> => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;

    // Simulate AI loading delay
    await new Promise((res) => setTimeout(res, 1200));

    const simulatedSummary = `The team met to coordinate key logistics and technical milestones for "${meeting.title}". Attendees aligned on deliverable dependencies, finalized resource quotas, and verified speaker itineraries. Risk points regarding Wi-Fi bandwidth and badge distribution were resolved.`;
    const simulatedDecisions = [
      'Approved auditorium seating blueprint and designated media desk.',
      'Delegated check-in kiosk setup to student volunteers under Meera.',
      'Mandated end-to-end dry run by Thursday 5:00 PM.',
    ];
    const simulatedActionItems = [
      {
        id: `act-${Date.now()}-1`,
        title: `Verify AV cabling and HDMI adapters in Auditorium`,
        ownerId: 'usr-rohan',
        ownerName: 'Rohan Mehta',
        priority: 'High' as TaskPriority,
        dueDate: '2026-09-12',
        status: 'Not started' as const,
      },
      {
        id: `act-${Date.now()}-2`,
        title: `Distribute volunteer rosters and emergency contacts`,
        ownerId: 'usr-meera',
        ownerName: 'Meera Iyer',
        priority: 'Medium' as TaskPriority,
        dueDate: '2026-09-14',
        status: 'In progress' as const,
      },
    ];

    updateMeeting(meetingId, {
      aiSummary: simulatedSummary,
      keyDecisions: simulatedDecisions,
      actionItems: [...meeting.actionItems, ...simulatedActionItems],
      status: 'Processed',
    });

    addAuditLog('AI Meeting Intelligence', 'Meeting', meeting.title, 'Generated AI summary, decisions, and action items');
    showToast('AI Summary Ready', `Generated summary and ${simulatedActionItems.length} action items for "${meeting.title}"!`);
  };

  const createTasksFromMeetingActionItems = (meetingId: string): number => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting || !meeting.actionItems || meeting.actionItems.length === 0) {
      showToast('No Action Items', 'There are no pending action items to convert.', 'info');
      return 0;
    }

    let createdCount = 0;
    meeting.actionItems.forEach((action) => {
      if (!action.createdAsTask) {
        createTask({
          title: action.title,
          description: `Derived from meeting action items in "${meeting.title}" (${meeting.date}).`,
          status: 'To Do',
          priority: action.priority,
          assigneeId: action.ownerId,
          assigneeName: action.ownerName,
          assigneeInitials: action.ownerName
            .split(' ')
            .map((n) => n[0])
            .join(''),
          dueDate: action.dueDate,
          label: 'Action Item',
        });
        createdCount++;
      }
    });

    // Mark action items as created
    const updatedActionItems = meeting.actionItems.map((a) => ({ ...a, createdAsTask: true }));
    updateMeeting(meetingId, { actionItems: updatedActionItems });

    addAuditLog('Converted action items to tasks', 'Meeting', meeting.title, `Created ${createdCount} new tasks on Kanban board`);
    showToast('Tasks Created', `Added ${createdCount} tasks from meeting action items directly into Kanban!`);
    return createdCount;
  };

  // Approvals CRUD
  const createApproval = (approvalData: Omit<Approval, 'id' | 'createdAt' | 'status' | 'requestedById' | 'requestedByName'>) => {
    const newApproval: Approval = {
      ...approvalData,
      id: `appr-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      requestedById: currentUser.id,
      requestedByName: currentUser.name,
      steps: [
        { stepNumber: 1, title: 'Submission', approverName: currentUser.name, status: 'approved', date: 'Just now' },
        { stepNumber: 2, title: approvalData.currentStep || 'President Review', approverName: 'Aisha Khan', status: 'current' },
      ],
    };

    setApprovalsState((prev) => {
      const updated = [newApproval, ...prev];
      StorageService.saveApprovals(updated);
      return updated;
    });

    addAuditLog('Created approval request', 'Approval', newApproval.title, `Requisition type: ${newApproval.type} (${newApproval.amount || 'N/A'})`);
    showToast('Approval Submitted', `"${newApproval.title}" sent for review.`);
    return newApproval;
  };

  const updateApprovalStatus = (approvalId: string, status: 'Approved' | 'Rejected', comment?: string) => {
    setApprovalsState((prev) => {
      const updated = prev.map((appr) => {
        if (appr.id === approvalId) {
          const updatedSteps = (appr.steps || []).map((step) => {
            if (step.status === 'current') {
              return {
                ...step,
                status: status === 'Approved' ? ('approved' as const) : ('rejected' as const),
                date: 'Just now',
              };
            }
            return step;
          });
          const newComments = comment
            ? [...(appr.comments || []), { id: `apc-${Date.now()}`, author: currentUser.name, text: comment, time: 'Just now' }]
            : appr.comments;

          return {
            ...appr,
            status,
            currentStep: status === 'Approved' ? 'Completed' : 'Rejected',
            steps: updatedSteps,
            comments: newComments,
          };
        }
        return appr;
      });
      StorageService.saveApprovals(updated);
      return updated;
    });

    const appr = approvals.find((a) => a.id === approvalId);
    addAuditLog(`${status} requisition`, 'Approval', appr?.title || 'Approval', `Status changed to ${status}`);
    showToast(`Request ${status}`, `"${appr?.title}" has been marked ${status.toLowerCase()}.`);
  };

  // Calendar CRUD
  const createCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };

    setEventsState((prev) => {
      const updated = [...prev, newEvent];
      StorageService.saveEvents(updated);
      return updated;
    });

    addAuditLog('Scheduled calendar event', 'Meeting', newEvent.title, `Date: ${newEvent.date} at ${newEvent.startTime}`);
    showToast('Event Scheduled', `"${newEvent.title}" booked on calendar.`);
    return newEvent;
  };

  const deleteCalendarEvent = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    setEventsState((prev) => {
      const updated = prev.filter((e) => e.id !== eventId);
      StorageService.saveEvents(updated);
      return updated;
    });
    if (evt) {
      addAuditLog('Cancelled event', 'Meeting', evt.title, `Removed from ${evt.date}`);
      showToast('Event Cancelled', `"${evt.title}" removed.`, 'info');
    }
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotificationsState((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      StorageService.saveNotifications(updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotificationsState((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      StorageService.saveNotifications(updated);
      return updated;
    });
    showToast('All Read', 'Marked all notifications as read.');
  };

  // Shared Notes
  const createSharedNote = (noteData: Omit<SharedNote, 'id' | 'lastEditedBy' | 'lastEditedAt' | 'contributors' | 'commentsCount'>) => {
    const newNote: SharedNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      lastEditedBy: currentUser.name,
      lastEditedAt: 'Just now',
      contributors: [currentUser.name],
      commentsCount: 0,
    };
    setSharedNotesState((prev) => {
      const updated = [newNote, ...prev];
      StorageService.saveSharedNotes(updated);
      return updated;
    });
    addAuditLog('Created shared note', 'File', newNote.title, `Added to wiki category ${newNote.category}`);
    showToast('Note Created', `"${newNote.title}" saved.`);
    return newNote;
  };

  const updateSharedNote = (noteId: string, updates: Partial<SharedNote>) => {
    setSharedNotesState((prev) => {
      const updated = prev.map((n) => {
        if (n.id === noteId) {
          const contribs = n.contributors.includes(currentUser.name)
            ? n.contributors
            : [...n.contributors, currentUser.name];
          return {
            ...n,
            ...updates,
            lastEditedBy: currentUser.name,
            lastEditedAt: 'Just now',
            contributors: contribs,
          };
        }
        return n;
      });
      StorageService.saveSharedNotes(updated);
      return updated;
    });
  };

  const deleteSharedNote = (noteId: string) => {
    const note = sharedNotes.find((n) => n.id === noteId);
    setSharedNotesState((prev) => {
      const updated = prev.filter((n) => n.id !== noteId);
      StorageService.saveSharedNotes(updated);
      return updated;
    });
    if (note) {
      addAuditLog('Deleted wiki note', 'File', note.title, 'Removed from shared notes');
      showToast('Note Deleted', `"${note.title}" removed.`, 'info');
    }
  };

  // Workload
  const updateWorkload = (newWorkload: WorkloadSnapshot[]) => {
    setWorkloadState(newWorkload);
    StorageService.saveWorkload(newWorkload);
    showToast('Workload Adjusted', 'Team capacity allocations updated.');
  };

  // Shifts
  const createShift = (shiftData: Omit<Shift, 'id' | 'status'>) => {
    const newShift: Shift = {
      ...shiftData,
      id: `shf-${Date.now()}`,
      status: shiftData.assignedMemberIds.length >= shiftData.requiredCount ? 'Covered' : 'Understaffed',
    };
    setShiftsState((prev) => {
      const updated = [...prev, newShift];
      StorageService.saveShifts(updated);
      return updated;
    });
    addAuditLog('Added shift', 'Meeting', newShift.title, `Date: ${newShift.date}, required: ${newShift.requiredCount}`);
    showToast('Shift Added', `"${newShift.title}" added to schedule.`);
    return newShift;
  };

  const assignShiftMember = (shiftId: string, memberId: string) => {
    setShiftsState((prev) => {
      const updated = prev.map((s) => {
        if (s.id === shiftId) {
          const assigned = s.assignedMemberIds.includes(memberId)
            ? s.assignedMemberIds.filter((id) => id !== memberId)
            : [...s.assignedMemberIds, memberId];
          const status = assigned.length >= s.requiredCount ? ('Covered' as const) : ('Understaffed' as const);
          return { ...s, assignedMemberIds: assigned, status };
        }
        return s;
      });
      StorageService.saveShifts(updated);
      return updated;
    });
    showToast('Roster Updated', 'Member shift assignment changed.');
  };

  // Templates
  const useTemplate = (templateId: string) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl) return;

    if (tmpl.category === 'Task lists' || tmpl.category === 'Event planning' || tmpl.category === 'Onboarding') {
      tmpl.contentPreview.forEach((taskTitle, idx) => {
        createTask({
          title: taskTitle,
          description: `Spawned from template "${tmpl.name}"`,
          status: idx === 0 ? 'In Progress' : 'To Do',
          priority: idx === 0 ? 'High' : 'Medium',
          assigneeId: currentUser.id,
          assigneeName: currentUser.name,
          assigneeInitials: currentUser.avatarInitials,
          dueDate: new Date(Date.now() + (idx + 2) * 86400000).toISOString().slice(0, 10),
          label: tmpl.category,
        });
      });
      showToast('Template Instantiated', `Created ${tmpl.contentPreview.length} tasks from "${tmpl.name}". Redirecting to Tasks...`);
      navigate('tasks');
    } else if (tmpl.category === 'Meeting agendas') {
      createMeeting({
        title: `${tmpl.name} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        date: new Date().toISOString().slice(0, 10),
        time: '14:00 - 15:00',
        participants: [currentUser.name, 'Rohan Mehta', 'Priya Sharma'],
        meetingType: 'Sync',
        agenda: tmpl.contentPreview.map((item, i) => `${i + 1}. ${item}`).join('\n'),
        rawNotes: 'Meeting convened following standard template.',
        aiSummary: 'Kickoff meeting based on standard club framework.',
        keyDecisions: [],
        actionItems: [],
        status: 'Draft',
      });
      showToast('Agenda Created', `Created meeting notes for "${tmpl.name}". Redirecting to Meeting Notes...`);
      navigate('meeting-notes');
    } else {
      createApproval({
        title: `${tmpl.name} Requisition`,
        type: 'Budget',
        currentStep: 'Executive Review',
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
        reviewers: ['Aisha Khan'],
        description: `Approval initialized from template "${tmpl.name}". Includes standard items: ${tmpl.contentPreview.join(', ')}`,
      });
      showToast('Approval Created', `Initialized request from "${tmpl.name}". Redirecting to Approvals...`);
      navigate('approvals');
    }
  };

  const duplicateTemplate = (templateId: string) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl) return;
    const duplicated: Template = {
      ...tmpl,
      id: `tmpl-${Date.now()}`,
      name: `${tmpl.name} (Copy)`,
      createdBy: currentUser.name,
      lastUsed: 'Just now',
    };
    setTemplatesState((prev) => {
      const updated = [duplicated, ...prev];
      StorageService.saveTemplates(updated);
      return updated;
    });
    showToast('Template Duplicated', `Created "${duplicated.name}"`);
  };

  // Whiteboard
  const updateWhiteboardItems = (items: WhiteboardItem[]) => {
    setWhiteboardItemsState(items);
    StorageService.saveWhiteboard(items);
  };

  const clearWhiteboard = () => {
    setWhiteboardItemsState([]);
    StorageService.saveWhiteboard([]);
    showToast('Board Cleared', 'Whiteboard reset to blank canvas.');
  };

  // Polls
  const votePoll = (pollId: string, optionId: string) => {
    setPollsState((prev) => {
      const updated = prev.map((poll) => {
        if (poll.id === pollId) {
          const oldOptionId = poll.userVotedOptionId;
          const options = poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (oldOptionId && opt.id === oldOptionId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });
          const totalVotes = oldOptionId ? poll.totalVotes : poll.totalVotes + 1;
          return { ...poll, options, userVotedOptionId: optionId, totalVotes };
        }
        return poll;
      });
      StorageService.savePolls(updated);
      return updated;
    });
    showToast('Vote Recorded', 'Thank you for your vote!');
  };

  const createPoll = (pollData: Omit<Poll, 'id' | 'createdAt' | 'totalVotes' | 'isClosed' | 'authorName'>) => {
    const newPoll: Poll = {
      ...pollData,
      id: `poll-${Date.now()}`,
      authorName: currentUser.name,
      createdAt: new Date().toISOString().slice(0, 10),
      totalVotes: 0,
      isClosed: false,
    };
    setPollsState((prev) => {
      const updated = [newPoll, ...prev];
      StorageService.savePolls(updated);
      return updated;
    });
    addAuditLog('Created team poll', 'Discussion', newPoll.question, `Options: ${newPoll.options.length}`);
    showToast('Poll Published', 'New poll is now live for team voting.');
    return newPoll;
  };

  const closePoll = (pollId: string) => {
    setPollsState((prev) => {
      const updated = prev.map((p) => (p.id === pollId ? { ...p, isClosed: true } : p));
      StorageService.savePolls(updated);
      return updated;
    });
    showToast('Poll Closed', 'Voting for this poll has concluded.');
  };

  // Kudos
  const giveKudo = (toMemberId: string, message: string, linkedTask?: string) => {
    const recipient = members.find((m) => m.id === toMemberId);
    if (!recipient) return;

    const newKudo: Kudo = {
      id: `kudo-${Date.now()}`,
      fromName: currentUser.name,
      fromRole: currentUser.position,
      toName: recipient.name,
      toRole: recipient.position,
      message,
      linkedTask,
      timestamp: 'Just now',
      reactions: { '❤️': 1, '👏': 1 },
      userReacted: ['❤️'],
    };

    setKudosState((prev) => {
      const updated = [newKudo, ...prev];
      StorageService.saveKudos(updated);
      return updated;
    });

    addAuditLog('Gave peer recognition', 'Member', recipient.name, `Sent praise: "${message.substring(0, 40)}..."`);
    showToast('Kudos Sent!', `Recognized ${recipient.name} for great teamwork!`, 'success');
  };

  const reactKudo = (kudoId: string, emoji: string) => {
    setKudosState((prev) => {
      const updated = prev.map((k) => {
        if (k.id === kudoId) {
          const userReacted = k.userReacted || [];
          const hasReacted = userReacted.includes(emoji);
          const newReactions = { ...k.reactions };
          let newUserReacted: string[];

          if (hasReacted) {
            newReactions[emoji] = Math.max(0, (newReactions[emoji] || 1) - 1);
            newUserReacted = userReacted.filter((e) => e !== emoji);
          } else {
            newReactions[emoji] = (newReactions[emoji] || 0) + 1;
            newUserReacted = [...userReacted, emoji];
          }
          return { ...k, reactions: newReactions, userReacted: newUserReacted };
        }
        return k;
      });
      StorageService.saveKudos(updated);
      return updated;
    });
  };

  // Decisions
  const createDecision = (decisionData: Omit<Decision, 'id' | 'date'>) => {
    const newDecision: Decision = {
      ...decisionData,
      id: `dec-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };

    setDecisionsState((prev) => {
      const updated = [newDecision, ...prev];
      StorageService.saveDecisions(updated);
      return updated;
    });

    addAuditLog('Logged architectural decision', 'Decision', newDecision.text, `Decided by ${newDecision.decidedBy}`);
    showToast('Decision Logged', 'Added to formal organizational decision log.');
    return newDecision;
  };

  const updateDecision = (decisionId: string, updates: Partial<Decision>) => {
    setDecisionsState((prev) => {
      const updated = prev.map((d) => (d.id === decisionId ? { ...d, ...updates } : d));
      StorageService.saveDecisions(updated);
      return updated;
    });
    showToast('Decision Updated', 'Changes saved to decision register.');
  };

  // Global Create Modal helper
  const openCreateModal = (type: 'task' | 'meeting' | 'announcement' | 'approval' | 'file' | 'note') => {
    setCreateModalType(type);
  };

  const closeCreateModal = () => {
    setCreateModalType(null);
  };

  // Reset to initial demo data
  const resetData = () => {
    StorageService.resetAll();
    setWorkspaceState(StorageService.getWorkspace());
    setMembersState(StorageService.getMembers());
    setCurrentUserIdState(StorageService.getCurrentUserId());
    setTasksState(StorageService.getTasks());
    setFilesState(StorageService.getFiles());
    setDiscussionsState(StorageService.getDiscussions());
    setMeetingsState(StorageService.getMeetings());
    setApprovalsState(StorageService.getApprovals());
    setEventsState(StorageService.getEvents());
    setNotificationsState(StorageService.getNotifications());
    setAuditLogState(StorageService.getAuditLog());
    setSharedNotesState(StorageService.getSharedNotes());
    setWorkloadState(StorageService.getWorkload());
    setShiftsState(StorageService.getShifts());
    setTemplatesState(StorageService.getTemplates());
    setWhiteboardItemsState(StorageService.getWhiteboard());
    setPollsState(StorageService.getPolls());
    setKudosState(StorageService.getKudos());
    setDecisionsState(StorageService.getDecisions());
    setFocusSessions([]);
    showToast('Reset Complete', 'Workspace restored to default seed demo state.', 'info');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentRoute,
        navigate,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileNavOpen,
        setIsMobileNavOpen,
        isSearchOpen,
        setIsSearchOpen,
        createModalType,
        openCreateModal,
        closeCreateModal,
        workspace,
        setWorkspace,
        members,
        currentUser,
        setCurrentUserById,
        updateCurrentUserProfile,
        inviteMember,
        isFocusMode,
        toggleFocusMode,
        focusTimeRemaining,
        isFocusRunning,
        activeFocusTask,
        startFocusTimer,
        pauseFocusTimer,
        stopFocusTimer,
        focusSessions,
        tasks,
        createTask,
        updateTask,
        deleteTask,
        changeTaskStatus,
        files,
        uploadFile,
        deleteFile,
        renameFile,
        moveFile,
        discussions,
        createPost,
        acknowledgePost,
        toggleLikePost,
        addPostComment,
        meetings,
        createMeeting,
        updateMeeting,
        generateMeetingSummary,
        createTasksFromMeetingActionItems,
        approvals,
        createApproval,
        updateApprovalStatus,
        events,
        createCalendarEvent,
        deleteCalendarEvent,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        auditLog,
        addAuditLog,
        sharedNotes,
        createSharedNote,
        updateSharedNote,
        deleteSharedNote,
        workload,
        updateWorkload,
        shifts,
        createShift,
        assignShiftMember,
        templates,
        useTemplate,
        duplicateTemplate,
        whiteboardItems,
        updateWhiteboardItems,
        clearWhiteboard,
        polls,
        votePoll,
        createPoll,
        closePoll,
        kudos,
        giveKudo,
        reactKudo,
        decisions,
        createDecision,
        updateDecision,
        toasts,
        showToast,
        removeToast,
        resetData,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
