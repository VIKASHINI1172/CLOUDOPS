import React from 'react';
import { TaskPriority, TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus | 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Covered' | 'Understaffed' | 'Open';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Done':
      case 'Approved':
      case 'Covered':
      case 'Active':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
      case 'In Progress':
        return 'bg-indigo-950/50 text-indigo-300 border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]';
      case 'In Review':
      case 'Pending':
        return 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
      case 'To Do':
        return 'bg-blue-950/50 text-blue-300 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]';
      case 'Backlog':
      case 'Open':
        return 'bg-white/5 text-indigo-200/80 border-white/10';
      case 'Rejected':
      case 'Understaffed':
        return 'bg-rose-950/50 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]';
      default:
        return 'bg-white/5 text-indigo-200/80 border-white/10';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const getPriorityStyle = () => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-950/50 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]';
      case 'High':
        return 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
      case 'Medium':
        return 'bg-blue-950/50 text-blue-300 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]';
      case 'Low':
        return 'bg-white/5 text-indigo-200/70 border-white/10';
      default:
        return 'bg-white/5 text-indigo-200/70 border-white/10';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${getPriorityStyle()} ${className}`}
    >
      {priority}
    </span>
  );
};
