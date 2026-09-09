import React, { useState } from 'react';
import {
  Network,
  Users,
  ChevronDown,
  ChevronRight,
  Mail,
  Briefcase,
  Layers,
  ArrowDown,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { User } from '../types';

export const OrgChartPage: React.FC = () => {
  const { members, setCurrentUserById, currentUser } = useWorkspace();
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // Group members into hierarchy levels
  const president = members.find((m) => m.position.includes('President')) || members[0];
  const vps = members.filter(
    (m) => m.position.includes('VP') || m.position.includes('Lead')
  );
  const leads = members.filter(
    (m) => m.id !== president.id && !vps.some((v) => v.id === m.id)
  );

  return (
    <div id="org-chart-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Organizational Hierarchy
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Leadership Structure
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive committee structure and operational reporting lines for Campus Innovation Club.
          </p>
        </div>
      </div>

      {/* Interactive Visual Hierarchy Tree Canvas */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-x-auto min-h-[550px] flex flex-col items-center">
        {/* Level 1: Executive Leader / President */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => setSelectedMember(president)}
            className="p-4 rounded-xl bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-800 border-2 border-indigo-500 shadow-lg cursor-pointer hover:scale-105 transition-all w-64 text-center group"
          >
            <div className="flex justify-center mb-2">
              <UserAvatar
                initials={president.avatarInitials}
                size="lg"
                bgClass={president.avatarBg}
                status={president.status}
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
              Executive Committee
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{president.name}</h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{president.position}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{president.department}</p>
          </div>

          {/* Stem connector */}
          <div className="w-0.5 h-10 bg-indigo-300 dark:bg-indigo-800" />
          <div className="w-96 max-w-full h-0.5 bg-indigo-300 dark:bg-indigo-800" />
        </div>

        {/* Level 2: Vice Presidents & Tech Lead */}
        <div className="flex items-start justify-center gap-6 mt-4 flex-wrap">
          {vps.map((vp) => (
            <div key={vp.id} className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-indigo-300 dark:bg-indigo-800 mb-2" />
              <div
                onClick={() => setSelectedMember(vp)}
                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer hover:border-indigo-500 hover:scale-105 transition-all w-56 text-center"
              >
                <div className="flex justify-center mb-2">
                  <UserAvatar
                    initials={vp.avatarInitials}
                    size="md"
                    bgClass={vp.avatarBg}
                    status={vp.status}
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{vp.name}</h4>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {vp.position}
                </p>
                <p className="text-[10px] text-slate-400">{vp.department}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Level 3: Department Leads & Coordinators */}
        {leads.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full max-w-md h-0.5 bg-slate-200 dark:bg-slate-700 mb-4" />
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedMember(lead)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-indigo-400 hover:scale-105 transition-all w-52 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <UserAvatar
                      initials={lead.avatarInitials}
                      size="sm"
                      bgClass={lead.avatarBg}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{lead.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{lead.position}</p>
                  <p className="text-[10px] text-slate-400">{lead.department}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Member Detail Card Flyout */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-slate-800 dark:text-slate-100 relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <UserAvatar
              initials={selectedMember.avatarInitials}
              size="lg"
              bgClass={selectedMember.avatarBg}
              className="mx-auto mb-3"
            />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMember.name}</h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              {selectedMember.position}
            </p>
            <p className="text-xs text-slate-500 mb-4">{selectedMember.department} • {selectedMember.role}</p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-left space-y-1.5 mb-5">
              <div className="flex justify-between text-slate-500">
                <span>Contact:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedMember.email}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">{selectedMember.status}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setCurrentUserById(selectedMember.id);
                  setSelectedMember(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Switch to Persona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
