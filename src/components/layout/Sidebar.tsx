import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Folder,
  MessageSquare,
  Video,
  FileText,
  ShieldCheck,
  BarChart3,
  UserCheck,
  History,
  Users,
  Network,
  Clock,
  Copy,
  PenTool,
  Vote,
  Award,
  Scale,
  Settings,
  User as UserIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { UserAvatar } from '../common/UserAvatar';

export const Sidebar: React.FC<{ onOpenFocusModal: () => void }> = ({ onOpenFocusModal }) => {
  const {
    currentRoute,
    navigate,
    isSidebarCollapsed,
    toggleSidebar,
    isFocusMode,
    currentUser,
    tasks,
    approvals,
    discussions,
  } = useWorkspace();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'Done').length;
  const pinnedAnnouncementsCount = discussions.filter((d) => d.pinned).length;

  const sections = [
    {
      title: 'Workspace',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: openTasksCount },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'files', label: 'Files', icon: Folder },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare, badge: pinnedAnnouncementsCount },
        { id: 'meeting-notes', label: 'Meeting Notes', icon: Video },
        { id: 'shared-notes', label: 'Shared Notes', icon: FileText },
        { id: 'approvals', label: 'Approvals', icon: ShieldCheck, badge: pendingApprovalsCount, badgeColor: 'bg-amber-500' },
      ],
    },
    {
      title: 'Insights',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'workload', label: 'Workload', icon: UserCheck },
        { id: 'audit-log', label: 'Audit Log', icon: History },
      ],
    },
    {
      title: 'Team',
      items: [
        { id: 'members', label: 'Members', icon: Users },
        { id: 'org-chart', label: 'Org Chart', icon: Network },
        { id: 'shifts', label: 'Shifts', icon: Clock },
      ],
    },
    {
      title: 'Additional',
      items: [
        { id: 'templates', label: 'Templates', icon: Copy },
        { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
        { id: 'polls', label: 'Polls', icon: Vote },
        { id: 'kudos', label: 'Kudos', icon: Award },
        { id: 'decisions', label: 'Decisions', icon: Scale },
      ],
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative hidden md:flex flex-col border-r border-white/10 bg-[#06070e]/90 backdrop-blur-md text-[#e0e0ff] transition-all duration-300 select-none z-20 ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand & collapse trigger */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-white/10 shrink-0">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5 px-1 truncate">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.6)] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white tracking-[0.2em] uppercase block truncate">Aetheris / Ops</span>
              <span className="text-[9px] font-mono text-indigo-300/60 tracking-wider block truncate">Cloud Operations</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.6)]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        )}

        <button
          id="btn-toggle-sidebar"
          type="button"
          onClick={toggleSidebar}
          className={`p-1 rounded-md text-indigo-300/70 hover:text-white hover:bg-white/10 transition-colors ${
            isSidebarCollapsed ? 'hidden' : 'block'
          }`}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {isSidebarCollapsed && (
        <div className="p-2 border-b border-white/10 flex justify-center">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-indigo-300/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation item groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-4 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-2.5 py-1 text-[9px] font-mono font-semibold text-indigo-300/50 uppercase tracking-[0.2em]">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => navigate(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all group relative ${
                    isActive
                      ? 'bg-indigo-600/30 text-white font-medium border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                      : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-300' : 'text-indigo-400/60 group-hover:text-indigo-200'
                    }`}
                  />
                  {!isSidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : isActive
                          ? 'bg-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                          : 'bg-white/10 text-indigo-200 group-hover:bg-white/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed sidebar */}
                  {isSidebarCollapsed && (
                    <span className="fixed left-16 ml-2 px-2.5 py-1 bg-[#0a0b16] text-white text-xs rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/10">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom section: Focus mode toggle, settings, profile, plan badge */}
      <div className="p-2 border-t border-white/10 space-y-1 bg-black/30 shrink-0">
        {/* Focus Mode button */}
        <button
          id="btn-sidebar-focus-mode"
          type="button"
          onClick={onOpenFocusModal}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            isFocusMode
              ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'text-indigo-300/70 hover:text-white hover:bg-white/5 border border-transparent'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title="Focus Mode"
        >
          <Sparkles className={`w-4 h-4 shrink-0 ${isFocusMode ? 'text-purple-400 animate-pulse' : 'text-indigo-400'}`} />
          {!isSidebarCollapsed && (
            <span className="truncate flex-1 text-left">
              {isFocusMode ? 'Focus Active' : 'Focus Timer'}
            </span>
          )}
        </button>

        {/* Workspace Settings */}
        <button
          id="btn-sidebar-settings"
          type="button"
          onClick={() => navigate('settings')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            currentRoute === 'settings'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-indigo-300/70 hover:text-white hover:bg-white/5 border border-transparent'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title="Settings"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate flex-1 text-left">Settings</span>}
        </button>

        {/* User Profile */}
        <button
          id="btn-sidebar-profile"
          type="button"
          onClick={() => navigate('profile')}
          className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-xs transition-colors ${
            currentRoute === 'profile'
              ? 'bg-white/10 text-white border border-white/10'
              : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={currentUser.name}
        >
          <UserAvatar
            initials={currentUser.avatarInitials}
            size="xs"
            bgClass={currentUser.avatarBg}
            status={currentUser.status}
          />
          {!isSidebarCollapsed && (
            <div className="truncate text-left flex-1 min-w-0">
              <span className="text-xs font-semibold text-white block truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-mono text-indigo-300/60 block truncate leading-tight">
                {currentUser.position}
              </span>
            </div>
          )}
        </button>

        {/* Telemetry Status Footer */}
        {!isSidebarCollapsed && (
          <div className="pt-2 px-2 text-[10px] font-mono flex items-center justify-between border-t border-white/10 mt-1">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-indigo-300/40">Array Status</span>
              <span className="text-[9px] text-emerald-400 font-bold">ONLINE_SECURE</span>
            </div>
            <div className="flex gap-1 items-end h-3">
              <div className="h-3 w-1 bg-indigo-500 rounded-xs"></div>
              <div className="h-3 w-1 bg-indigo-500 rounded-xs"></div>
              <div className="h-3 w-1 bg-indigo-500 rounded-xs"></div>
              <div className="h-3 w-1 bg-indigo-500/20 rounded-xs"></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
