import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { FocusTimerPanel } from './FocusTimerPanel';
import { GlobalSearchModal } from './GlobalSearchModal';
import { GlobalCreateModal } from './GlobalCreateModal';
import { ToastContainer } from '../common/ToastContainer';
import { ChevronRight, Home } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentRoute, navigate } = useWorkspace();
  const [isFocusPanelOpen, setIsFocusPanelOpen] = useState(false);

  const getBreadcrumbTitle = (route: string) => {
    const titles: Record<string, string> = {
      overview: 'Overview',
      tasks: 'Tasks',
      calendar: 'Calendar',
      files: 'File Repository',
      discussions: 'Discussions & Announcements',
      'meeting-notes': 'AI Meeting Intelligence',
      'shared-notes': 'Shared Notes & Wiki',
      approvals: 'Approval Workflows',
      analytics: 'Analytics & Insights',
      workload: 'Workload Transparency',
      'audit-log': 'Audit History',
      members: 'Team Members Directory',
      'org-chart': 'Organizational Hierarchy',
      shifts: 'Shift Scheduling',
      templates: 'Operational Templates',
      whiteboard: 'Visual Whiteboard',
      polls: 'Team Polls & Voting',
      kudos: 'Peer Kudos & Recognition',
      decisions: 'Decision Register',
      settings: 'Workspace Settings',
      profile: 'User Profile',
    };
    return titles[route] || 'Workspace';
  };

  return (
    <div id="app-shell" className="flex h-screen w-screen overflow-hidden bg-[#050508] text-[#e0e0ff] font-sans antialiased relative">
      {/* Immersive UI ambient radial gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, #301060 0%, transparent 45%), radial-gradient(circle at 20% 80%, #102050 0%, transparent 45%)',
        }}
      />

      {/* Sidebar for desktop */}
      <Sidebar onOpenFocusModal={() => setIsFocusPanelOpen(true)} />

      {/* Mobile Drawer */}
      <MobileNav />

      {/* Main layout container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Top Header */}
        <TopHeader onOpenFocusModal={() => setIsFocusPanelOpen(true)} />

        {/* Sub-header / Breadcrumb bar with Immersive HUD styling */}
        <div className="h-9 px-4 sm:px-6 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-indigo-300/70 text-[11px] font-mono tracking-wider uppercase">
            <button
              onClick={() => navigate('overview')}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Workspace</span>
            </button>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <span className="font-semibold text-white tracking-widest text-[11px]">
              {getBreadcrumbTitle(currentRoute)}
            </span>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/60 hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Campus Operations • 2026</span>
          </div>
        </div>

        {/* Scrollable Main content area */}
        <main
          id="main-content-scrollable"
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <FocusTimerPanel isOpen={isFocusPanelOpen} onClose={() => setIsFocusPanelOpen(false)} />
      <GlobalSearchModal />
      <GlobalCreateModal />
      <ToastContainer />
    </div>
  );
};
