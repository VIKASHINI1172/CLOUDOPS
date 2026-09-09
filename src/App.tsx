import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { AppShell } from './components/layout/AppShell';

// Core Pages
import { OverviewPage } from './pages/OverviewPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { FilesPage } from './pages/FilesPage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { MeetingNotesPage } from './pages/MeetingNotesPage';
import { SharedNotesPage } from './pages/SharedNotesPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { WorkloadPage } from './pages/WorkloadPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { MembersPage } from './pages/MembersPage';
import { OrgChartPage } from './pages/OrgChartPage';
import { ShiftsPage } from './pages/ShiftsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { WhiteboardPage } from './pages/WhiteboardPage';
import { PollsPage } from './pages/PollsPage';
import { KudosPage } from './pages/KudosPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { currentRoute } = useWorkspace();

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'overview':
        return <OverviewPage />;
      case 'tasks':
        return <TasksPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'files':
        return <FilesPage />;
      case 'discussions':
        return <DiscussionsPage />;
      case 'meeting-notes':
        return <MeetingNotesPage />;
      case 'shared-notes':
        return <SharedNotesPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'workload':
        return <WorkloadPage />;
      case 'audit-log':
        return <AuditLogPage />;
      case 'members':
        return <MembersPage />;
      case 'org-chart':
        return <OrgChartPage />;
      case 'shifts':
        return <ShiftsPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'whiteboard':
        return <WhiteboardPage />;
      case 'polls':
        return <PollsPage />;
      case 'kudos':
        return <KudosPage />;
      case 'decisions':
        return <DecisionsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <OverviewPage />;
    }
  };

  return <AppShell>{renderActiveRoute()}</AppShell>;
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
