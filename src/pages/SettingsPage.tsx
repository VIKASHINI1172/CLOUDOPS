import React, { useState } from 'react';
import {
  Settings,
  Database,
  Download,
  RotateCcw,
  Upload,
  Cloud,
  CheckCircle2,
  Shield,
  Bell,
  Sparkles,
  Save,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const SettingsPage: React.FC = () => {
  const { workspace, setWorkspace, showToast } = useWorkspace();

  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);
  const [enableAi, setEnableAi] = useState(true);
  const [enableAudit, setEnableAudit] = useState(true);
  const [enableSound, setEnableSound] = useState(false);

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkspace({ ...workspace, name: workspaceName, description });
    showToast('Preferences Saved', 'Workspace configuration updated successfully.', 'success');
  };

  const handleExportJSON = () => {
    const backupData = {
      workspace,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CloudOps_Workspace_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Backup Exported', 'Full workspace JSON snapshot downloaded.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean factory state? Any new changes will be refreshed.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div id="settings-page" className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure organization preferences, data sovereignty, and cloud synchronization.
        </p>
      </div>

      {/* General Workspace Profile */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-600" />
          <span>Organization Profile</span>
        </h2>

        <form onSubmit={handleSaveWorkspace} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Workspace Slug / URL Handle
              </label>
              <div className="flex items-center">
                <span className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-lg text-slate-400 font-mono text-[11px]">
                  cloudops.app/
                </span>
                <input
                  type="text"
                  disabled
                  value="campus-innovation-club"
                  className="w-full p-2.5 rounded-r-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose & Mission
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Workspace Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feature & Governance Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Intelligence & Automation Features</span>
        </h2>

        <div className="space-y-3.5 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                AI Meeting Summary & Action Extraction
              </span>
              <span className="text-slate-500 text-[11px]">
                Synthesize meeting recordings and auto-extract Kanban deliverables.
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableAi}
              onChange={(e) => setEnableAi(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Immutable Audit Logging
              </span>
              <span className="text-slate-500 text-[11px]">
                Record all administrative changes, approvals, and board edits for compliance.
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableAudit}
              onChange={(e) => setEnableAudit(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Audio Chimes for Focus Mode & Timer Alerts
              </span>
              <span className="text-slate-500 text-[11px]">
                Play gentle browser tones when Pomodoro focus blocks conclude.
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableSound}
              onChange={(e) => setEnableSound(e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Cloud & Supabase Architecture Status */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Cloud className="w-4 h-4 text-indigo-600" />
          <span>Backend & Persistence Layer</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          CloudOps Workspace features clean decoupled architecture. It currently uses local storage persistence with an abstracted service layer that is plug-and-play ready for remote Supabase PostgreSQL integration.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Storage Engine: Client-Side StorageService
              </span>
              <span className="text-slate-400 text-[11px]">
                Zero latency, 100% offline-first responsive persistence.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[11px] self-start sm:self-auto">
            Operational
          </span>
        </div>
      </div>

      {/* Backup & Data Management */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Data Sovereignty & Backups</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Export your complete workspace snapshot as a clean JSON backup file or restore factory demo states.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete Workspace JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
