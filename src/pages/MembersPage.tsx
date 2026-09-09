import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Grid,
  List,
  Shield,
  Briefcase,
  Check,
  X,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { User, UserRole } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';

export const MembersPage: React.FC = () => {
  const {
    members,
    currentUser,
    setCurrentUserById,
    inviteMember,
    tasks,
    navigate,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePosition, setInvitePosition] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Member');
  const [inviteDept, setInviteDept] = useState('Operations');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || m.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const initials = inviteName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    inviteMember(
      inviteEmail.trim(),
      inviteName.trim(),
      inviteRole,
      invitePosition.trim() || 'Club Associate'
    );

    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePosition('');
  };

  return (
    <div id="members-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Team Directory
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {members.length} active roster
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization members, functional roles, and permission levels.
          </p>
        </div>

        <button
          id="btn-invite-member"
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roster by name, email, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </select>

          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
            const isCurrent = member.id === currentUser.id;

            return (
              <div
                key={member.id}
                className={`p-5 rounded-xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <UserAvatar
                      initials={member.avatarInitials}
                      size="lg"
                      bgClass={member.avatarBg}
                      status={member.status}
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    {member.position}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Department</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{member.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Active Tasks</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{memberTasks.length}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setCurrentUserById(member.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {isCurrent ? 'Active Persona' : 'Switch to Persona'}
                  </button>
                  <button
                    onClick={() => navigate('profile')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Member</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Position</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar initials={member.avatarInitials} size="sm" bgClass={member.avatarBg} />
                      <span className="font-bold text-slate-900 dark:text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-indigo-600 dark:text-indigo-400">{member.role}</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">{member.position}</td>
                  <td className="p-3.5 text-slate-500">{member.department}</td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">{member.email}</td>
                  <td className="p-3.5 text-slate-500">{member.status}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setCurrentUserById(member.id)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      {member.id === currentUser.id ? 'Current' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsInviteOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Invite New Team Member
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Chen"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  University / Club Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. liam@campusinnovation.club"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Position Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Lead"
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sponsorship">Sponsorship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Permission Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Admin">Admin (Full administrative control)</option>
                  <option value="Editor">Editor (Can create & manage boards)</option>
                  <option value="Member">Member (Standard team contributor)</option>
                  <option value="Viewer">Viewer (Read-only access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
