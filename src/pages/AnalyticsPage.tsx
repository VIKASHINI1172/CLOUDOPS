import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
  Zap,
  Calendar,
  Users,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { tasks, members, meetings, approvals } = useWorkspace();

  // Velocity data
  const velocityData = [
    { week: 'Week 1', completed: 12, created: 15 },
    { week: 'Week 2', completed: 18, created: 14 },
    { week: 'Week 3', completed: 22, created: 19 },
    { week: 'Week 4', completed: 28, created: 21 },
    { week: 'Week 5', completed: 25, created: 18 },
    { week: 'Week 6 (Current)', completed: 31, created: 24 },
  ];

  // Priority distribution
  const priorityCounts = {
    Urgent: tasks.filter((t) => t.priority === 'Urgent').length,
    High: tasks.filter((t) => t.priority === 'High').length,
    Medium: tasks.filter((t) => t.priority === 'Medium').length,
    Low: tasks.filter((t) => t.priority === 'Low').length,
  };

  const priorityPieData = [
    { name: 'Urgent', value: priorityCounts.Urgent, color: '#f43f5e' },
    { name: 'High', value: priorityCounts.High, color: '#f97316' },
    { name: 'Medium', value: priorityCounts.Medium, color: '#eab308' },
    { name: 'Low', value: priorityCounts.Low, color: '#64748b' },
  ];

  // Workload by member
  const memberWorkloadData = members.map((m) => ({
    name: m.name.split(' ')[0],
    tasks: tasks.filter((t) => t.assigneeId === m.id).length,
    completed: tasks.filter((t) => t.assigneeId === m.id && t.status === 'Done').length,
  }));

  // Meeting hours by week
  const meetingHoursData = [
    { week: 'W1', hours: 4.5 },
    { week: 'W2', hours: 6.0 },
    { week: 'W3', hours: 5.5 },
    { week: 'W4', hours: 8.0 },
    { week: 'W5', hours: 6.5 },
  ];

  return (
    <div id="analytics-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Analytics & Insights
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Real-time telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational throughput, cycle time analysis, and club sprint velocity.
          </p>
        </div>
      </div>

      {/* Top Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Cycle Time</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">3.4 days</span>
            <span className="text-xs font-semibold text-emerald-600">-0.8d vs last mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From In Progress to Done</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sprint Completion</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">87.5%</span>
            <span className="text-xs font-semibold text-emerald-600">+4.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sprint goals hit on target</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Engagement Index</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">94 / 100</span>
            <span className="text-xs font-semibold text-purple-600">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Discussions & sync attendance</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Approval SLA</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">18.2 hrs</span>
            <span className="text-xs font-semibold text-emerald-600">Fast</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average authorization latency</p>
        </div>
      </div>

      {/* Chart Section 1: Sprint Velocity Area Chart & Priority Breakdown Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sprint Task Velocity
              </h3>
              <p className="text-xs text-slate-500">Tasks completed vs. newly created backlog items</p>
            </div>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              Velocity Trend: +14%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" name="Completed Tasks" />
                <Area type="monotone" dataKey="created" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" name="Created Tasks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Pie Chart */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Tasks by Priority
            </h3>
            <p className="text-xs text-slate-500 mb-4">Current distribution across all active tickets</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {priorityPieData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{p.name}: {p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section 2: Member Output & Meeting Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Deliverable Completion by Team Member
          </h3>
          <p className="text-xs text-slate-500 mb-4">Total assigned vs finished tickets</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberWorkloadData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="tasks" fill="#818cf8" radius={[4, 4, 0, 0]} name="Assigned Tasks" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Weekly Synchronous Meeting Overhead (Hours)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Target: Keep team meeting time under 8 hrs/week</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meetingHoursData}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} name="Meeting Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
