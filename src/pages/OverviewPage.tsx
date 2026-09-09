import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Sparkles,
  FileText,
  Upload,
  AlertCircle,
  Bell,
  Check,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const {
    currentUser,
    tasks,
    meetings,
    approvals,
    members,
    auditLog,
    discussions,
    acknowledgePost,
    openCreateModal,
    navigate,
  } = useWorkspace();

  const openTasks = tasks.filter((t) => t.status !== 'Done');
  const completedTasks = tasks.filter((t) => t.status === 'Done');
  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id || t.assigneeName.includes(currentUser.name)).slice(0, 5);
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');
  const pinnedAnnouncement = discussions.find((d) => d.pinned) || discussions[0];

  // Workload bar chart data
  const workloadData = members.map((m) => {
    const assignedTasks = tasks.filter((t) => t.assigneeId === m.id && t.status !== 'Done').length;
    const hours = assignedTasks * 3.5;
    const status = hours > 28 ? 'Overloaded' : hours < 12 ? 'Underutilized' : 'Balanced';
    return {
      name: m.name.split(' ')[0],
      hours,
      tasks: assignedTasks,
      status,
    };
  });

  const getWorkloadBarColor = (status: string) => {
    if (status === 'Overloaded') return '#f43f5e'; // rose
    if (status === 'Underutilized') return '#94a3b8'; // slate
    return '#10b981'; // emerald
  };

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div id="overview-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-400">TELEMETRY // DASHBOARD</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-indigo-200/70 mt-1 font-mono">
            OPERATIONAL OVERVIEW // CAMPUS INNOVATION CLUSTER
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] font-mono text-indigo-300 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-xs">
            {todayString}
          </div>
          <button
            id="btn-overview-create-task"
            onClick={() => openCreateModal('task')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Pinned Announcement Banner */}
      {pinnedAnnouncement && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-orange-950/20 text-[#e0e0ff] backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(245,158,11,0.1)]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-900/50 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Priority Directive
                </span>
                <span className="text-xs text-indigo-300/60 font-mono">• Posted by {pinnedAnnouncement.authorName}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-1">
                {pinnedAnnouncement.title}
              </h3>
              <p className="text-xs text-indigo-200/80 mt-1 line-clamp-2 leading-relaxed">
                {pinnedAnnouncement.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {pinnedAnnouncement.requiresAcknowledgment && (
              <button
                id="btn-acknowledge-announcement"
                onClick={() => acknowledgePost(pinnedAnnouncement.id)}
                disabled={pinnedAnnouncement.acknowledgedBy.includes(currentUser.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all border ${
                  pinnedAnnouncement.acknowledgedBy.includes(currentUser.id)
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {pinnedAnnouncement.acknowledgedBy.includes(currentUser.id) ? 'Acknowledged' : 'Acknowledge Notice'}
                </span>
              </button>
            )}
            <button
              onClick={() => navigate('discussions')}
              className="px-3.5 py-1.5 text-xs text-indigo-300 hover:text-white hover:bg-white/10 rounded-full transition-colors font-mono"
            >
              Discussions →
            </button>
          </div>
        </div>
      )}

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 hover:border-indigo-500/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)] group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-indigo-300/60 uppercase tracking-widest">Active Operations</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{openTasks.length}</span>
            <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-indigo-300/60 mt-1 font-mono">Tasks in execution queue</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 hover:border-indigo-500/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)] group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-indigo-300/60 uppercase tracking-widest">Completed Sprint</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{completedTasks.length + 12}</span>
            <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +8%
            </span>
          </div>
          <p className="text-[11px] text-indigo-300/60 mt-1 font-mono">Velocity rating: OPTIMAL</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 hover:border-indigo-500/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)] group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-indigo-300/60 uppercase tracking-widest">Pending Signoffs</span>
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{pendingApprovals.length}</span>
            <span className="text-xs font-mono font-semibold text-amber-400">
              2 new
            </span>
          </div>
          <p className="text-[11px] text-indigo-300/60 mt-1 font-mono">Budget & charter approvals</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 hover:border-indigo-500/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)] group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-indigo-300/60 uppercase tracking-widest">Core Availability</span>
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">4/6</span>
            <span className="text-xs font-mono text-indigo-300/70">Online</span>
          </div>
          <p className="text-[11px] text-indigo-300/60 mt-1 font-mono">2 members in deep focus</p>
        </div>
      </div>

      {/* Main Grid: My Tasks (Left 2 cols) & Upcoming Meetings + Quick Actions (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns: My Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono uppercase tracking-wider text-white">Assigned Directives</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300">
                  {myTasks.length}
                </span>
              </div>
              <button
                id="btn-view-all-tasks"
                onClick={() => navigate('tasks')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Kanban View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {myTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-indigo-300/40 font-mono">
                  NO PENDING DIRECTIVES DETECTED.
                </div>
              ) : (
                myTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`overview-task-${task.id}`}
                    onClick={() => navigate('tasks')}
                    className="p-3.5 rounded-xl border border-white/5 hover:border-indigo-500/40 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[10px] font-mono text-indigo-300/60">#{task.label}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1 truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs text-indigo-200/70 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-xs text-indigo-300/70 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Due {task.dueDate}</span>
                      </div>
                      <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                          style={{ width: `${task.progress || 20}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Workload snapshot & team capacity chart */}
          <div className="p-5 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-white">Workload Telemetry</h3>
                <p className="text-xs text-indigo-300/60 font-mono">Active hours & cluster distribution</p>
              </div>
              <button
                onClick={() => navigate('workload')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Heatmap <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6366f1" opacity={0.6} fontSize={11} tickLine={false} />
                  <YAxis stroke="#6366f1" opacity={0.6} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0b16',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      color: '#e0e0ff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                    {workloadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getWorkloadBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3 text-[10px] font-mono text-indigo-300/70 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" /> Balanced
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]" /> Overloaded
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/50" /> Underutilized
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 column: Upcoming meetings & Quick actions & Activity */}
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <div className="p-5 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Upcoming Syncs</h3>
              <button
                onClick={() => navigate('calendar')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-3">
              {meetings.slice(0, 3).map((mtg) => (
                <div
                  key={mtg.id}
                  onClick={() => navigate('meeting-notes')}
                  className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/50 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      {mtg.meetingType}
                    </span>
                    <span className="text-[11px] font-mono text-indigo-300/60">{mtg.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1.5">
                    {mtg.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-indigo-300/60">
                    <span>{mtg.time}</span>
                    <span>{mtg.participants.length} attendees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white mb-3">Initialize Operation</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn-quick-new-task"
                onClick={() => openCreateModal('task')}
                className="p-3 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-left transition-all group"
              >
                <CheckSquare className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-white block">New Task</span>
                <span className="text-[10px] font-mono text-indigo-300/60 block">Add to queue</span>
              </button>

              <button
                id="btn-quick-schedule-meeting"
                onClick={() => openCreateModal('meeting')}
                className="p-3 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-left transition-all group"
              >
                <Calendar className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-white block">Schedule Sync</span>
                <span className="text-[10px] font-mono text-indigo-300/60 block">Team calendar</span>
              </button>

              <button
                id="btn-quick-upload-file"
                onClick={() => openCreateModal('file')}
                className="p-3 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-left transition-all group"
              >
                <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-white block">Upload Asset</span>
                <span className="text-[10px] font-mono text-indigo-300/60 block">Artifact storage</span>
              </button>

              <button
                id="btn-quick-start-note"
                onClick={() => openCreateModal('note')}
                className="p-3 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-left transition-all group"
              >
                <FileText className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-white block">Shared Doc</span>
                <span className="text-[10px] font-mono text-indigo-300/60 block">Realtime note</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="p-5 rounded-2xl bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Event Stream</h3>
              <button
                onClick={() => navigate('audit-log')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
              >
                Full Log →
              </button>
            </div>

            <div className="space-y-3.5">
              {auditLog.slice(0, 4).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2.5 text-xs">
                  <UserAvatar
                    initials={entry.actor.split(' ').map((n) => n[0]).join('')}
                    size="xs"
                    className="shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-indigo-200/90 leading-snug">
                      <strong className="font-semibold text-white">{entry.actor}</strong>{' '}
                      {entry.action.toLowerCase()}:{' '}
                      <span className="text-indigo-300 font-mono">
                        "{entry.entityName}"
                      </span>
                    </p>
                    <span className="text-[10px] font-mono text-indigo-300/50 block mt-0.5">{entry.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
