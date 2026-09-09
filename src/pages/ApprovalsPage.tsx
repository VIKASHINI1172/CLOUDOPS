import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  FileCheck,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Approval } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';
import { StatusBadge } from '../components/common/StatusBadge';

export const ApprovalsPage: React.FC = () => {
  const {
    approvals,
    updateApprovalStatus,
    currentUser,
    openCreateModal,
  } = useWorkspace();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  const filteredApprovals = approvals.filter((appr) => {
    if (filterStatus === 'All') return true;
    return appr.status === filterStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;

  const handleApprove = (id: string) => {
    updateApprovalStatus(id, 'Approved', feedbackComment);
    setFeedbackComment('');
    setSelectedApproval(null);
  };

  const handleReject = (id: string) => {
    updateApprovalStatus(id, 'Rejected', feedbackComment);
    setFeedbackComment('');
    setSelectedApproval(null);
  };

  return (
    <div id="approvals-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Approval Workflows
            </h1>
            {pendingCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {pendingCount} pending review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal multi-tier governance for club budget allocations, creative releases, and vendor payments.
          </p>
        </div>

        <button
          id="btn-new-approval-req"
          onClick={() => openCreateModal('approval')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Approval Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {status} ({status === 'All' ? approvals.length : approvals.filter((a) => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Approvals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApprovals.map((req) => (
          <div
            key={req.id}
            id={`approval-card-${req.id}`}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Type tag & Status Badge */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                  {req.type} Authorization
                </span>
                <StatusBadge status={req.status} />
              </div>

              {/* Title & Amount */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {req.title}
              </h3>
              {req.amount && (
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Amount Requested: {req.amount}
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {req.description}
              </p>

              {/* Stepper info */}
              <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Current Step:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{req.currentStep}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Reviewers:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{req.reviewers.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Footer Requester & Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <UserAvatar initials={req.requestedByName.split(' ').map((n) => n[0]).join('')} size="xs" />
                <div>
                  <span className="font-medium text-slate-900 dark:text-white block leading-tight">
                    {req.requestedByName}
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">Due: {req.dueDate}</span>
                </div>
              </div>

              {req.status === 'Pending' ? (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    id={`btn-reject-appr-${req.id}`}
                    onClick={() => handleReject(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-semibold"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    id={`btn-approve-appr-${req.id}`}
                    onClick={() => handleApprove(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              ) : (
                <div className="text-right text-[11px] text-slate-400">
                  Reviewed by {req.reviewers[0]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
