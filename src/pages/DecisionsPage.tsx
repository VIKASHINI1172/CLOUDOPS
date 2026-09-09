import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  Archive,
  ArrowRight,
  Shield,
  X,
  FileCheck,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface DecisionRecord {
  id: string;
  code: string;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Superseded' | 'Rejected';
  decisionMaker: string;
  date: string;
  context: string;
  decision: string;
  consequences: string;
}

export const DecisionsPage: React.FC = () => {
  const { currentUser, showToast } = useWorkspace();

  const [decisions, setDecisions] = useState<DecisionRecord[]>([
    {
      id: 'adr-1',
      code: 'ADR-001',
      title: 'Standardize All Club Compute Infrastructure on Google Cloud Run',
      status: 'Accepted',
      decisionMaker: 'Priya Sharma (Tech VP)',
      date: '2026-08-15',
      context: 'Managing disparate self-hosted VPS servers led to frequent downtime and credential leaks during past hackathons.',
      decision: 'Containerize all club applications using Docker and deploy serverless workloads directly via Google Cloud Run with unified IAM service accounts.',
      consequences: 'Zero infrastructure management overhead, sub-second cold starts, and zero idle costs when workshops are not running.',
    },
    {
      id: 'adr-2',
      code: 'ADR-002',
      title: 'Consolidate Asynchronous Communications from WhatsApp to Workspace',
      status: 'Accepted',
      decisionMaker: 'Aisha Khan (President)',
      date: '2026-08-28',
      context: 'Important announcements and file approvals were getting buried inside informal WhatsApp groups, resulting in missed deadlines.',
      decision: 'Mandate that all official announcements, approval requests, and meeting action items must be tracked inside the CloudOps Workspace platform.',
      consequences: 'Complete auditability and searchable knowledge base for future incoming executive boards.',
    },
    {
      id: 'adr-3',
      code: 'ADR-003',
      title: 'Tiered Sponsorship Model with Dedicated Mentor Tracks',
      status: 'Proposed',
      decisionMaker: 'Vikram Patel (Finance)',
      date: '2026-09-02',
      context: 'Corporate partners requested direct engagement opportunities with top engineering talent rather than just logo placements on banners.',
      decision: 'Offer custom mentor keynote slots and dedicated resume review lounges for Platinum tier sponsors ($5,000+).',
      consequences: 'Higher sponsorship revenue while providing better career pipelines for club attendees.',
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [consequences, setConsequences] = useState('');

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !decisionText.trim()) return;

    const newDec: DecisionRecord = {
      id: `adr-${Date.now()}`,
      code: `ADR-00${decisions.length + 1}`,
      title: title.trim(),
      status: 'Accepted',
      decisionMaker: `${currentUser.name} (${currentUser.position})`,
      date: new Date().toISOString().slice(0, 10),
      context: context.trim() || 'Internal operational requirement.',
      decision: decisionText.trim(),
      consequences: consequences.trim() || 'Positive operational clarity.',
    };

    setDecisions([newDec, ...decisions]);
    setIsCreateOpen(false);
    setTitle('');
    setContext('');
    setDecisionText('');
    setConsequences('');
    showToast('Decision Recorded', 'New ADR added to governance register.', 'success');
  };

  const getStatusBadge = (status: DecisionRecord['status']) => {
    if (status === 'Accepted') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    if (status === 'Proposed') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    if (status === 'Superseded') return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
  };

  return (
    <div id="decisions-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Decision Records (ADRs)
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {decisions.length} recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal architectural and operational decision records capturing the context, rationale, and consequences.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Decision</span>
        </button>
      </div>

      {/* Decisions List */}
      <div className="space-y-5">
        {decisions.map((adr) => (
          <div
            key={adr.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  {adr.code}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(adr.status)}`}>
                  {adr.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Author: <strong className="text-slate-700 dark:text-slate-300">{adr.decisionMaker}</strong> • {adr.date}
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              {adr.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  1. Context & Problem
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{adr.context}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  2. Agreed Decision
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{adr.decision}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  3. Consequences & Impact
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{adr.consequences}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Decision Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Architecture Decision</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Decision Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standardize On GitHub Projects for Sprint Backlog"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Context & Problem Statement *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was the motivating force behind this change?"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  The Decision *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was decided? State clearly and objectively."
                  value={decisionText}
                  onChange={(e) => setDecisionText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consequences & Trade-offs
                </label>
                <textarea
                  rows={2}
                  placeholder="What are the expected benefits, costs, or risks?"
                  value={consequences}
                  onChange={(e) => setConsequences(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Commit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
