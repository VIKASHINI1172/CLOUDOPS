import React from 'react';
import {
  X,
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
  Layers,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { UserAvatar } from '../common/UserAvatar';

export const MobileNav: React.FC = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    currentRoute,
    navigate,
    currentUser,
    workspace,
  } = useWorkspace();

  if (!isMobileNavOpen) return null;

  const sections = [
    {
      title: 'Workspace',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'files', label: 'Files', icon: Folder },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare },
        { id: 'meeting-notes', label: 'Meeting Notes', icon: Video },
        { id: 'shared-notes', label: 'Shared Notes', icon: FileText },
        { id: 'approvals', label: 'Approvals', icon: ShieldCheck },
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
    <div
      id="mobile-drawer-backdrop"
      className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsMobileNavOpen(false)}
    >
      <div
        id="mobile-drawer-content"
        className="w-72 max-w-[80vw] h-full bg-[#06070e]/95 border-r border-white/10 text-[#e0e0ff] shadow-2xl flex flex-col justify-between backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-[0_0_12px_rgba(99,102,241,0.6)]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs uppercase tracking-[0.2em] text-white font-mono">{workspace.name}</span>
          </div>
          <button
            id="btn-close-mobile-nav"
            onClick={() => setIsMobileNavOpen(false)}
            className="p-1.5 rounded-full text-indigo-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-2 text-[9px] font-mono font-semibold text-indigo-300/50 uppercase tracking-[0.2em]">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-indigo-600/30 text-white font-medium border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                        : 'text-indigo-200/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-300' : 'text-indigo-400/70'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1.5 bg-black/40">
          <button
            onClick={() => {
              navigate('settings');
              setIsMobileNavOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-indigo-200/80 hover:bg-white/5 hover:text-white"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              navigate('profile');
              setIsMobileNavOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-indigo-200/80 hover:bg-white/5 hover:text-white"
          >
            <UserAvatar initials={currentUser.avatarInitials} size="xs" bgClass={currentUser.avatarBg} />
            <div className="truncate text-left">
              <span className="block font-semibold text-white">{currentUser.name}</span>
              <span className="block text-[10px] font-mono text-indigo-300/60">{currentUser.position}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
