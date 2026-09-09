import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Shield,
  User as UserIcon,
  Calendar,
  X,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';

export const AuditLogPage: React.FC = () => {
  const { auditLog, members } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');

  const actionTypes = ['All', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT'];

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.changeSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActor = selectedActor === 'All' || entry.actor === selectedActor;
    const matchesAction = selectedAction === 'All' || entry.action === selectedAction;
    return matchesSearch && matchesActor && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Action', 'Entity', 'Target', 'Details'];
    const rows = filteredLog.map((l) => [
      l.timestamp,
      l.actor,
      l.action,
      l.entity,
      `"${l.entityName}"`,
      `"${l.changeSummary}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CloudOps_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (action: string) => {
    if (action === 'CREATE') return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300';
    if (action === 'APPROVE') return 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300';
    if (action === 'UPDATE') return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
    if (action === 'DELETE' || action === 'REJECT') return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
  };

  return (
    <div id="audit-log-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Audit History</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {auditLog.length} events logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable workspace audit trail for security compliance, governance, and activity verification.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar - fully responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Search audit trail by actor, target, or action detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none outline-none text-white placeholder:text-indigo-300/40 min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-indigo-400 hover:text-white p-1 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap self-end sm:self-auto">
          {/* Action filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs rounded-xl border border-white/10 bg-white/5 p-1.5 text-indigo-200 focus:outline-none focus:border-indigo-500"
          >
            {actionTypes.map((act) => (
              <option key={act} value={act} className="bg-[#0a0b16] text-white">
                Action: {act}
              </option>
            ))}
          </select>

          {/* Actor filter */}
          <select
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="text-xs rounded-xl border border-white/10 bg-white/5 p-1.5 text-indigo-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All" className="bg-[#0a0b16] text-white">All Actors</option>
            {members.map((m) => (
              <option key={m.id} value={m.name} className="bg-[#0a0b16] text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity Type</th>
                <th className="p-3.5">Target Name</th>
                <th className="p-3.5">Context & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLog.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        initials={entry.actor.split(' ').map((n) => n[0]).join('')}
                        size="xs"
                      />
                      <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {entry.actor}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getActionBadgeColor(entry.action)}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium whitespace-nowrap">
                    {entry.entity}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {entry.entityName}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-sm truncate">
                    {entry.changeSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
