import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  ChevronDown,
  Sparkles,
  CheckSquare,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Upload,
  FileText,
  User as UserIcon,
  Settings as SettingsIcon,
  Moon,
  Sun,
  RotateCcw,
  Check,
  Menu,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { UserAvatar } from '../common/UserAvatar';

interface TopHeaderProps {
  onOpenFocusModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenFocusModal }) => {
  const {
    workspace,
    currentUser,
    members,
    setCurrentUserById,
    setIsSearchOpen,
    openCreateModal,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isFocusMode,
    isFocusRunning,
    focusTimeRemaining,
    navigate,
    theme,
    toggleTheme,
    resetData,
    setIsMobileNavOpen,
  } = useWorkspace();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) setIsCreateMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotificationOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setIsWorkspaceMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const focusMinutes = Math.floor(focusTimeRemaining / 60);
  const focusSeconds = focusTimeRemaining % 60;
  const focusTimerString = `${String(focusMinutes).padStart(2, '0')}:${String(focusSeconds).padStart(2, '0')}`;

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-black/50 backdrop-blur-md border-b border-white/10 text-[#e0e0ff] transition-colors select-none"
    >
      {/* Left section: mobile hamburger & workspace switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          id="btn-mobile-menu-toggle"
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-indigo-300 hover:bg-white/10"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Workspace selector dropdown */}
        <div ref={wsRef} className="relative">
          <button
            id="btn-workspace-switcher"
            type="button"
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors text-left border border-white/5"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.6)]">
              {workspace.logoText || 'CIC'}
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white tracking-wider uppercase leading-none block">
                {workspace.name}
              </span>
              <span className="text-[10px] text-indigo-300/60 font-mono uppercase tracking-widest leading-none">
                {workspace.plan}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-300/60 ml-0.5" />
          </button>

          {isWorkspaceMenuOpen && (
            <div
              id="dropdown-workspace-switcher"
              className="absolute left-0 mt-1.5 w-64 bg-[#0a0b16]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 py-2 z-40 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3.5 py-2 border-b border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/60">Active Workspace</p>
                <p className="text-sm font-semibold text-white mt-0.5">{workspace.name}</p>
                <p className="text-xs text-indigo-200/70 truncate mt-0.5">{workspace.description}</p>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    navigate('settings');
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Workspace Settings & Roles
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry live status HUD badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-full font-mono text-[10px] text-indigo-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>SIGNAL: OPTIMAL</span>
        </div>
      </div>

      {/* Center section: Global Search Bar - fully responsive across mobile, tablet, and desktop */}
      <div className="flex-1 min-w-0 max-w-md mx-2 sm:mx-3">
        <button
          id="btn-trigger-global-search"
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-2.5 sm:px-3.5 md:px-4 py-1.5 text-xs text-indigo-200/70 bg-white/5 hover:bg-white/10 hover:border-indigo-500/40 rounded-full border border-white/10 transition-all shadow-2xs group min-w-0"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
            <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:text-indigo-300 transition-colors" />
            <span className="truncate text-left text-xs">
              <span className="inline sm:hidden">Search...</span>
              <span className="hidden sm:inline lg:hidden">Search workspace...</span>
              <span className="hidden lg:inline">Search telemetry, tasks, logs, records...</span>
            </span>
          </div>
          <kbd className="hidden md:inline-flex items-center font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-indigo-300 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Focus indicator, Create button, Notifications, Help, User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Focus Mode button/badge */}
        <button
          id="btn-focus-mode-indicator"
          type="button"
          onClick={onOpenFocusModal}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all border ${
            isFocusMode
              ? 'bg-purple-900/40 text-purple-200 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'text-indigo-300/80 bg-white/5 hover:bg-white/10 border-white/10'
          }`}
          title="Toggle deep focus timer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isFocusMode ? 'text-purple-400 animate-pulse' : 'text-indigo-400'}`} />
          <span className="hidden md:inline">{isFocusMode ? `FOCUS (${focusTimerString})` : 'FOCUS'}</span>
          {isFocusMode && !isFocusRunning && <span className="text-[10px] text-amber-400 font-bold ml-0.5">PAUSED</span>}
        </button>

        {/* Global Create Button with neon Immersive glow */}
        <div ref={createRef} className="relative">
          <button
            id="btn-global-create-dropdown"
            type="button"
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {isCreateMenuOpen && (
            <div
              id="dropdown-global-create-menu"
              className="absolute right-0 mt-1.5 w-56 bg-[#0a0b16]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 py-2 z-40 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3.5 py-1.5 text-[10px] font-mono font-semibold text-indigo-300/60 uppercase tracking-widest">
                Initialize Entry
              </div>
              <button
                id="menu-item-create-task"
                onClick={() => {
                  openCreateModal('task');
                  setIsCreateMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>New task</span>
              </button>
              <button
                id="menu-item-create-meeting"
                onClick={() => {
                  openCreateModal('meeting');
                  setIsCreateMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>New meeting</span>
              </button>
              <button
                id="menu-item-create-announcement"
                onClick={() => {
                  openCreateModal('announcement');
                  setIsCreateMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>New announcement</span>
              </button>
              <button
                id="menu-item-create-approval"
                onClick={() => {
                  openCreateModal('approval');
                  setIsCreateMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>New approval request</span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                id="menu-item-upload-file"
                onClick={() => {
                  openCreateModal('file');
                  setIsCreateMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload file</span>
              </button>
              <button
                id="menu-item-create-note"
                onClick={() => {
                  openCreateModal('note');
                  setIsCreateMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FileText className="w-4 h-4 text-rose-400" />
                <span>New shared note</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            id="btn-notifications-bell"
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-full text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(99,102,241,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div
              id="dropdown-notifications"
              className="absolute right-0 mt-1.5 w-80 sm:w-88 bg-[#0a0b16]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 z-40 py-2 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-500/40 text-indigo-300">
                      {unreadCount} UNREAD
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    id="btn-mark-all-read"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.slice(0, 6).map((notif) => (
                  <div
                    key={notif.id}
                    id={`notif-item-${notif.id}`}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.actionUrl) navigate(notif.actionUrl);
                      setIsNotificationOpen(false);
                    }}
                    className={`p-3 text-left hover:bg-white/10 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-indigo-900/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-white">{notif.title}</h5>
                      <span className="text-[10px] font-mono text-indigo-300/60 shrink-0">{notif.createdAt}</span>
                    </div>
                    <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    navigate('settings');
                    setIsNotificationOpen(false);
                  }}
                  className="text-xs text-indigo-300 hover:text-white"
                >
                  Notification Preferences
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help icon - hidden on small mobile to maximize search bar space */}
        <button
          id="btn-help-dialog"
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="hidden sm:flex p-2 rounded-full text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Workspace guide and shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User avatar dropdown */}
        <div ref={userRef} className="relative ml-1">
          <button
            id="btn-user-profile-menu"
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-400 transition-all"
            aria-label="User profile settings"
          >
            <UserAvatar
              initials={currentUser.avatarInitials}
              name={currentUser.name}
              size="sm"
              bgClass={currentUser.avatarBg}
              status={currentUser.status}
            />
          </button>

          {isUserMenuOpen && (
            <div
              id="dropdown-user-menu"
              className="absolute right-0 mt-1.5 w-64 bg-[#0a0b16]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 py-2 z-40 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3.5 py-2.5 border-b border-white/10">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-indigo-300/70 font-mono">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-500/30">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-indigo-300/60">• {currentUser.position}</span>
                </div>
              </div>

              {/* Switch active demo persona */}
              <div className="p-1 border-b border-white/10">
                <div className="px-2.5 py-1 text-[10px] font-mono font-semibold text-indigo-300/60 uppercase tracking-widest">
                  Switch Active Persona
                </div>
                <div className="max-h-36 overflow-y-auto space-y-0.5">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentUserById(member.id);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-white/10 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <UserAvatar initials={member.avatarInitials} size="xs" bgClass={member.avatarBg} />
                        <span className="truncate text-indigo-100 font-medium">
                          {member.name}
                        </span>
                      </div>
                      {member.id === currentUser.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    navigate('profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Preferences & Appearance
                </button>
                <button
                  onClick={toggleTheme}
                  className="w-full text-left flex items-center justify-between px-3 py-2 text-xs text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>Theme</span>
                  </div>
                  <span className="capitalize text-[10px] font-mono text-indigo-300/60">{theme} mode</span>
                </button>
                <button
                  onClick={() => {
                    resetData();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sample Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal with Immersive UI styling */}
      {isHelpOpen && (
        <div
          id="help-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            id="help-modal-dialog"
            className="bg-[#0a0b16]/95 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-[#e0e0ff] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white mb-2 tracking-wide uppercase font-mono">
              CloudOps Immersive Navigation
            </h3>
            <p className="text-xs text-indigo-200/70 mb-4 leading-relaxed">
              Cloud-native operations interface combining tasks, meetings, telemetry, and collaborative team intelligence.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="font-semibold text-indigo-300 block mb-1">
                  ⌨️ Keyboard Shortcuts
                </span>
                <ul className="space-y-1 text-indigo-200 font-mono text-[11px]">
                  <li>⌘K or Ctrl+K : Open Global Search</li>
                  <li>ESC : Dismiss modals & overlays</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="font-semibold text-indigo-300 block mb-1">
                  🚀 Interactive Walkthrough
                </span>
                <ol className="list-decimal list-inside space-y-1 text-indigo-200">
                  <li>Visit <strong>Tasks</strong> to test Kanban dragging and status updates.</li>
                  <li>Go to <strong>Meeting Notes</strong> and click <em>"Generate summary"</em> for AI synthesis.</li>
                  <li>Click <em>"Create tasks from action items"</em> to automatically populate Kanban!</li>
                  <li>Check <strong>Workload</strong> to review capacity balances and redistribution.</li>
                  <li>Use the <strong>Focus timer</strong> in the header for deep work sessions.</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest bg-indigo-600 text-white rounded-full hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
