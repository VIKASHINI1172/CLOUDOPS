import React, { useState } from 'react';
import { X, CheckSquare, Calendar, Bell, ShieldCheck, Upload, FileText } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TaskPriority, TaskStatus } from '../../types';

export const GlobalCreateModal: React.FC = () => {
  const {
    createModalType,
    closeCreateModal,
    members,
    createTask,
    createCalendarEvent,
    createPost,
    createApproval,
    uploadFile,
    createSharedNote,
    currentUser,
  } = useWorkspace();

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('To Do');
  const [taskAssigneeId, setTaskAssigneeId] = useState(currentUser.id);
  const [taskDueDate, setTaskDueDate] = useState('2026-09-15');
  const [taskLabel, setTaskLabel] = useState('Operations');

  // Meeting form state
  const [mtgTitle, setMtgTitle] = useState('');
  const [mtgDate, setMtgDate] = useState('2026-09-12');
  const [mtgStartTime, setMtgStartTime] = useState('14:00');
  const [mtgEndTime, setMtgEndTime] = useState('15:00');
  const [mtgLocation, setMtgLocation] = useState('Auditorium B & Meet');

  // Announcement form state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postRequiresAck, setPostRequiresAck] = useState(false);

  // Approval form state
  const [apprTitle, setApprTitle] = useState('');
  const [apprType, setApprType] = useState<'Budget' | 'Creative' | 'Software' | 'Payment' | 'Policy'>('Budget');
  const [apprAmount, setApprAmount] = useState('₹5,000');
  const [apprDesc, setApprDesc] = useState('');

  // File upload state
  const [fileName, setFileName] = useState('');
  const [fileFolder, setFileFolder] = useState('Event Planning');

  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('Operations');
  const [noteContent, setNoteContent] = useState('');

  if (!createModalType) return null;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const assignee = members.find((m) => m.id === taskAssigneeId) || currentUser;
    createTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      status: taskStatus,
      priority: taskPriority,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeInitials: assignee.avatarInitials,
      dueDate: taskDueDate,
      label: taskLabel,
    });
    closeCreateModal();
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mtgTitle.trim()) return;
    createCalendarEvent({
      title: mtgTitle.trim(),
      date: mtgDate,
      startTime: mtgStartTime,
      endTime: mtgEndTime,
      location: mtgLocation,
      type: 'meeting',
      requiredAttendees: [currentUser.id],
      optionalAttendees: [],
      description: 'Scheduled via quick create',
    });
    closeCreateModal();
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    createPost({
      title: postTitle.trim(),
      content: postContent.trim() || 'Please review announcement details.',
      type: 'Announcement',
      pinned: true,
      requiresAcknowledgment: postRequiresAck,
    });
    closeCreateModal();
  };

  const handleApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apprTitle.trim()) return;
    createApproval({
      title: apprTitle.trim(),
      type: apprType,
      amount: apprType === 'Budget' || apprType === 'Payment' ? apprAmount : undefined,
      dueDate: '2026-09-18',
      currentStep: 'Club President Review',
      reviewers: ['Aisha Khan'],
      description: apprDesc.trim() || 'Requisition submitted for team authorization.',
    });
    closeCreateModal();
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    const ext = fileName.includes('.') ? fileName.split('.').pop() || 'pdf' : 'pdf';
    uploadFile({
      name: fileName.includes('.') ? fileName.trim() : `${fileName.trim()}.pdf`,
      folder: fileFolder,
      size: '1.2 MB',
      extension: ext,
      type: ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'doc' : 'other',
    });
    closeCreateModal();
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    createSharedNote({
      title: noteTitle.trim(),
      category: noteCategory,
      content: noteContent.trim() || `# ${noteTitle}\n\nStart typing documentation here...`,
      isFavorite: false,
    });
    closeCreateModal();
  };

  return (
    <div
      id="global-create-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeCreateModal}
    >
      <div
        id="global-create-dialog"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-global-create"
          onClick={closeCreateModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Task Form */}
        {createModalType === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Create New Task</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Task Title *
              </label>
              <input
                id="input-new-task-title"
                type="text"
                required
                placeholder="e.g. Confirm workshop registration flow"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                id="input-new-task-desc"
                rows={2}
                placeholder="Key goals, deliverables, and acceptance criteria..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignee
                </label>
                <select
                  id="select-new-task-assignee"
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  id="select-new-task-priority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Status
                </label>
                <select
                  id="select-new-task-status"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  id="input-new-task-due"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Tag
                </label>
                <input
                  id="input-new-task-label"
                  type="text"
                  value={taskLabel}
                  onChange={(e) => setTaskLabel(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-submit-create-task"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {/* Meeting Form */}
        {createModalType === 'meeting' && (
          <form onSubmit={handleMeetingSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Schedule Meeting</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meeting Title *
              </label>
              <input
                id="input-new-mtg-title"
                type="text"
                required
                placeholder="e.g. Innovation Workshop Sprint Sync"
                value={mtgTitle}
                onChange={(e) => setMtgTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={mtgDate}
                  onChange={(e) => setMtgDate(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={mtgStartTime}
                  onChange={(e) => setMtgStartTime(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={mtgEndTime}
                  onChange={(e) => setMtgEndTime(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location or Video Link
              </label>
              <input
                type="text"
                value={mtgLocation}
                onChange={(e) => setMtgLocation(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-submit-create-meeting"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Book Meeting
              </button>
            </div>
          </form>
        )}

        {/* Announcement Form */}
        {createModalType === 'announcement' && (
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Broadcast Announcement</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Headline *
              </label>
              <input
                id="input-new-ann-title"
                type="text"
                required
                placeholder="e.g. Critical: Venue security permits submitted"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Body Content
              </label>
              <textarea
                rows={3}
                placeholder="Detailed announcement context for the team..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="check-req-ack"
                type="checkbox"
                checked={postRequiresAck}
                onChange={(e) => setPostRequiresAck(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <label htmlFor="check-req-ack" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                Require team members to explicitly click Acknowledge
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-submit-create-announcement"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Broadcast
              </button>
            </div>
          </form>
        )}

        {/* Approval Form */}
        {createModalType === 'approval' && (
          <form onSubmit={handleApprovalSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">New Approval Request</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Request Title *
              </label>
              <input
                id="input-new-appr-title"
                type="text"
                required
                placeholder="e.g. Approve Catering Quote for Demo Day"
                value={apprTitle}
                onChange={(e) => setApprTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={apprType}
                  onChange={(e) => setApprType(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                >
                  <option value="Budget">Budget</option>
                  <option value="Payment">Payment</option>
                  <option value="Creative">Creative / Design</option>
                  <option value="Software">Software Tool</option>
                  <option value="Policy">Club Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (if applicable)
                </label>
                <input
                  type="text"
                  value={apprAmount}
                  onChange={(e) => setApprAmount(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Context & Business Justification
              </label>
              <textarea
                rows={2}
                placeholder="Why is this requested, which vendors were compared..."
                value={apprDesc}
                onChange={(e) => setApprDesc(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-submit-create-approval"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}

        {/* File Form */}
        {createModalType === 'file' && (
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Upload Repository Document</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                File Name *
              </label>
              <input
                id="input-new-file-name"
                type="text"
                required
                placeholder="e.g. October_Workshop_Logistics.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destination Folder
              </label>
              <select
                value={fileFolder}
                onChange={(e) => setFileFolder(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              >
                <option value="Event Planning">Event Planning</option>
                <option value="Marketing">Marketing</option>
                <option value="Sponsorship">Sponsorship</option>
                <option value="Meeting Materials">Meeting Materials</option>
                <option value="Club Policies">Club Policies</option>
                <option value="Design Assets">Design Assets</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50 dark:bg-slate-800/40">
              <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Simulated upload pipeline active (PDF, DOCX, XLSX, ZIP, PNG)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Files will be indexed in local team storage</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-submit-upload-file"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              >
                Upload File
              </button>
            </div>
          </form>
        )}

        {/* Note Form */}
        {createModalType === 'note' && (
          <form onSubmit={handleNoteSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Create Shared Note</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Note Title *
              </label>
              <input
                id="input-new-note-title"
                type="text"
                required
                placeholder="e.g. Volunteer Orientation Briefing"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Wiki Category
              </label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              >
                <option value="Operations">Operations</option>
                <option value="Events">Events</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Content (Markdown supported)
              </label>
              <textarea
                rows={3}
                placeholder="Add overview, bullets, checklists, or meeting summaries..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-submit-create-note"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Create Document
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
