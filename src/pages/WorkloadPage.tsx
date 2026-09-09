import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle,
  ArrowRightLeft,
  Sparkles,
  CheckSquare,
  Clock,
  User as UserIcon,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { PriorityBadge } from '../components/common/StatusBadge';

export const WorkloadPage: React.FC = () => {
  const { members, tasks, updateTask } = useWorkspace();
  const [rebalanceCompleted, setRebalanceCompleted] = useState(false);

  // Compute workload for each member
  const memberWorkloads = members.map((member) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === member.id && t.status !== 'Done');
    const estimatedHours = memberTasks.length * 3.5;
    const capacityHours = 20; // 20 hours/wk baseline for student club
    const utilizationPct = Math.round((estimatedHours / capacityHours) * 100);

    let status: 'Overloaded' | 'Balanced' | 'Underutilized' = 'Balanced';
    if (utilizationPct > 115) status = 'Overloaded';
    else if (utilizationPct < 60) status = 'Underutilized';

    return {
      member,
      tasks: memberTasks,
      estimatedHours,
      capacityHours,
      utilizationPct,
      status,
    };
  });

  const overloadedMember = memberWorkloads.find((w) => w.status === 'Overloaded');
  const availableMember = memberWorkloads.find((w) => w.status === 'Underutilized');

  const handleRebalance = () => {
    if (overloadedMember && availableMember && overloadedMember.tasks.length > 0) {
      const taskToMove = overloadedMember.tasks[0];
      updateTask(taskToMove.id, {
        assigneeId: availableMember.member.id,
        assigneeName: availableMember.member.name,
        assigneeInitials: availableMember.member.avatarInitials,
      });
      setRebalanceCompleted(true);
      setTimeout(() => setRebalanceCompleted(false), 4000);
    }
  };

  return (
    <div id="workload-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Workload Transparency
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Capacity balancer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate member bandwidth, eliminate burnout hotspots, and equalize sprint allocation.
          </p>
        </div>

        {/* AI Rebalance Action Button */}
        {overloadedMember && availableMember && (
          <button
            id="btn-rebalance-workload"
            onClick={handleRebalance}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Auto-Rebalance Workload</span>
          </button>
        )}
      </div>

      {/* AI Recommendation Alert Box if imbalances detected */}
      {rebalanceCompleted && (
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Task successfully reassigned! Team workload capacity is now evenly distributed.</span>
        </div>
      )}

      {overloadedMember && availableMember && !rebalanceCompleted && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Capacity Imbalance Detected</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                <strong>{overloadedMember.member.name}</strong> is currently at {overloadedMember.utilizationPct}% capacity ({overloadedMember.estimatedHours} hrs assigned).
                Meanwhile, <strong>{availableMember.member.name}</strong> has open bandwidth ({availableMember.utilizationPct}% capacity).
              </p>
            </div>
          </div>
          <button
            onClick={handleRebalance}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0"
          >
            Shift 1 Task to {availableMember.member.name.split(' ')[0]}
          </button>
        </div>
      )}

      {/* Team Capacity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {memberWorkloads.map((item) => {
          const isOver = item.status === 'Overloaded';
          const isUnder = item.status === 'Underutilized';

          return (
            <div
              key={item.member.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Member Identity & Status Tag */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar
                      initials={item.member.avatarInitials}
                      size="md"
                      bgClass={item.member.avatarBg}
                      status={item.member.status}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.member.name}
                      </h3>
                      <span className="text-xs text-slate-400 block">{item.member.position}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isOver
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : isUnder
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Utilization gauge */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Utilization ({item.estimatedHours}h / {item.capacityHours}h)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.utilizationPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-rose-500' : isUnder ? 'bg-slate-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(item.utilizationPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Tasks list */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Active Tasks ({item.tasks.length})
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {item.tasks.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No tasks currently assigned</p>
                    ) : (
                      item.tasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs flex items-center justify-between gap-2"
                        >
                          <span className="truncate text-slate-800 dark:text-slate-200">{t.title}</span>
                          <PriorityBadge priority={t.priority} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Weekly Commitment</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.capacityHours} hrs / wk</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
