import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Shield,
  CheckCircle,
  Clock,
  Award,
  Sparkles,
  Save,
  Users,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    members,
    setCurrentUserById,
    tasks,
    approvals,
    showToast,
  } = useWorkspace();

  const [name, setName] = useState(currentUser.name);
  const [position, setPosition] = useState(currentUser.position);
  const [department, setDepartment] = useState(currentUser.department || 'Executive Committee');
  const [status, setStatus] = useState(currentUser.status);

  // Stats for current user
  const userTasks = tasks.filter((t) => t.assigneeId === currentUser.id);
  const completedTasks = userTasks.filter((t) => t.status === 'Done');
  const userApprovals = approvals.filter((a) => a.requestedById === currentUser.id);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile Updated', 'Your persona preferences were saved.', 'success');
  };

  return (
    <div id="profile-page" className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Member Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your club credentials, operational role, and team contributions.
        </p>
      </div>

      {/* Profile Overview Hero Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <UserAvatar
            initials={currentUser.avatarInitials}
            size="xl"
            bgClass={currentUser.avatarBg}
            status={currentUser.status}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              {currentUser.position}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{currentUser.email}</span>
              <span>•</span>
              <span>{currentUser.department || 'Operations'}</span>
            </p>
          </div>
        </div>

        {/* Presence Status selector */}
        <div className="self-start sm:self-auto bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Current Status
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="text-xs rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 p-1.5 font-medium text-slate-900 dark:text-white"
          >
            <option value="Active">🟢 Active & Online</option>
            <option value="Away">🟡 Away / In Class</option>
            <option value="In a meeting">🟣 In a Sync / Meeting</option>
            <option value="Focusing">🔴 Deep Focus (Do Not Disturb)</option>
          </select>
        </div>
      </div>

      {/* Contributions Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase block">Total Assigned</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {userTasks.length}
          </span>
          <span className="text-[11px] text-slate-500">Board deliverables</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase block">Finished Tasks</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {completedTasks.length}
          </span>
          <span className="text-[11px] text-slate-500">
            {userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0}% completion
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase block">Requisitions</span>
          <span className="text-2xl font-bold text-indigo-600 mt-1 block">
            {userApprovals.length}
          </span>
          <span className="text-[11px] text-slate-500">Submitted for review</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase block">Kudos Received</span>
          <span className="text-2xl font-bold text-rose-500 mt-1 block">
            3
          </span>
          <span className="text-[11px] text-slate-500">Peer shoutouts</span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Edit Persona Details
        </h3>
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Position Title
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Committee
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Fast Switch Persona Widget */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Quick Switch Teammate Persona</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Experience the workspace through the viewpoint of different executive committee members.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {members.map((m) => {
            const isSelected = m.id === currentUser.id;
            return (
              <button
                key={m.id}
                onClick={() => setCurrentUserById(m.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/50'
                }`}
              >
                <UserAvatar initials={m.avatarInitials} size="sm" bgClass={m.avatarBg} />
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                    {m.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {m.position}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
