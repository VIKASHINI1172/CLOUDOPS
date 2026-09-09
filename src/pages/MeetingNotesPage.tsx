import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  ListOrdered,
  FileText,
  Check,
  Play,
  RotateCw,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { MeetingNote, ActionItem } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';

export const MeetingNotesPage: React.FC = () => {
  const {
    meetings,
    generateMeetingSummary,
    createTasksFromMeetingActionItems,
    members,
    openCreateModal,
  } = useWorkspace();

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const activeMeeting =
    meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  const handleGenerateSummary = async () => {
    if (!activeMeeting) return;
    setIsGeneratingAi(true);
    await new Promise((res) => setTimeout(res, 900));
    generateMeetingSummary(activeMeeting.id);
    setIsGeneratingAi(false);
  };

  return (
    <div id="meeting-notes-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Meeting Intelligence
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {meetings.length} sessions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated transcription summaries, decision extraction, and instant Kanban task generation.
          </p>
        </div>

        <button
          onClick={() => openCreateModal('meeting')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Sync</span>
        </button>
      </div>

      {/* Main 2-Column Split: Meeting list (left) & Meeting details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of meetings */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Recorded Syncs
          </h3>
          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {meetings.map((meeting) => {
              const isSelected = activeMeeting && activeMeeting.id === meeting.id;
              return (
                <div
                  key={meeting.id}
                  onClick={() => setSelectedMeetingId(meeting.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">
                      {meeting.meetingType}
                    </span>
                    <span className="text-[11px] text-slate-400">{meeting.date}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                    {meeting.title}
                  </h4>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span>{meeting.time}</span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {meeting.participants.slice(0, 4).map((p, idx) => (
                        <UserAvatar
                          key={idx}
                          initials={p.split(' ').map((n) => n[0]).join('')}
                          size="xs"
                          className="ring-2 ring-white dark:ring-slate-900"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Active Meeting Detail & AI Assistant */}
        {activeMeeting && (
          <div className="lg:col-span-8 space-y-5">
            {/* Header & Meta card */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {activeMeeting.meetingType}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {activeMeeting.title}
                  </h2>
                </div>

                {/* AI Summary trigger */}
                <button
                  id="btn-generate-ai-summary"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 self-start sm:self-auto"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'Synthesizing...' : 'Generate AI Summary'}</span>
                </button>
              </div>

              {/* Metadata rows */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeMeeting.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeMeeting.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Type</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeMeeting.meetingType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeMeeting.status}</span>
                </div>
              </div>

              {/* Participants */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">Attendees:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMeeting.participants.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Summary Section */}
            {activeMeeting.aiSummary && (
              <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-950/20 shadow-2xs">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" /> AI Generated Executive Summary
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeMeeting.aiSummary}
                </p>
              </div>
            )}

            {/* Agenda Topics */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Agenda Checklist</h3>
              <div className="space-y-2">
                {activeMeeting.agenda.split('\n').filter(Boolean).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items Box with Convert to Tasks */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Action Items ({activeMeeting.actionItems.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Extracted deliverables from discussion consensus.
                  </p>
                </div>

                <button
                  id="btn-create-tasks-from-action-items"
                  onClick={() => createTasksFromMeetingActionItems(activeMeeting.id)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create tasks on Kanban board</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {activeMeeting.actionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 shrink-0">
                        {item.status === 'Completed' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 font-medium">
                        Assignee: {item.ownerName}
                      </span>
                      <span>Due: {item.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Transcript / Raw Notes Section */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Live Transcript & Notes</h3>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line border border-slate-100 dark:border-slate-800">
                {activeMeeting.transcriptPreview || activeMeeting.rawNotes || 'No real-time transcript stream available for this session.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
