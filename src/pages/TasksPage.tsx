import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Kanban,
  List,
  UserCheck,
  Calendar as CalendarIcon,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  User as UserIcon,
  Eye,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    members,
    currentUser,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    openCreateModal,
  } = useWorkspace();

  const [activeView, setActiveView] = useState<'kanban' | 'list' | 'mytasks'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  // Selected task for detail/edit drawer
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);

  // New comment state in drawer
  const [newCommentText, setNewCommentText] = useState('');
  // New checklist item state
  const [newChecklistText, setNewChecklistText] = useState('');

  // Delete confirmation
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesLabel = selectedLabel === 'all' || task.label === selectedLabel;
    const matchesMyTasks = activeView !== 'mytasks' || task.assigneeId === currentUser.id;

    return matchesSearch && matchesPriority && matchesLabel && matchesMyTasks;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === 'priority') {
      const pOrder: Record<TaskPriority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return pOrder[b.priority] - pOrder[a.priority];
    }
    return a.title.localeCompare(b.title);
  });

  const columns: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

  const allLabels = Array.from(new Set(tasks.map((t) => t.label))).filter(Boolean);

  const handleToggleChecklist = (taskId: string, checkId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.checklist) return;
    const updatedChecklist = task.checklist.map((item) =>
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );
    const completedCount = updatedChecklist.filter((c) => c.completed).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);

    updateTask(taskId, { checklist: updatedChecklist, progress });
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, checklist: updatedChecklist, progress });
    }
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newChecklistText.trim()) return;
    const newItem = {
      id: `cl-${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false,
    };
    const updatedChecklist = [...(selectedTask.checklist || []), newItem];
    const completedCount = updatedChecklist.filter((c) => c.completed).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);

    updateTask(selectedTask.id, { checklist: updatedChecklist, progress });
    setSelectedTask({ ...selectedTask, checklist: updatedChecklist, progress });
    setNewChecklistText('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorInitials: currentUser.avatarInitials,
      content: newCommentText.trim(),
      createdAt: 'Just now',
    };
    const updatedComments = [...(selectedTask.comments || []), newComment];
    updateTask(selectedTask.id, {
      comments: updatedComments,
      commentsCount: updatedComments.length,
    });
    setSelectedTask({
      ...selectedTask,
      comments: updatedComments,
      commentsCount: updatedComments.length,
    });
    setNewCommentText('');
  };

  const handleMockAttachmentUpload = () => {
    if (!selectedTask) return;
    const mockFile = {
      id: `att-${Date.now()}`,
      name: `Specification_Document_${Math.floor(Math.random() * 100)}.pdf`,
      size: '1.2 MB',
    };
    const updatedAttachments = [...(selectedTask.attachments || []), mockFile];
    updateTask(selectedTask.id, {
      attachments: updatedAttachments,
      attachmentsCount: updatedAttachments.length,
    });
    setSelectedTask({
      ...selectedTask,
      attachments: updatedAttachments,
      attachmentsCount: updatedAttachments.length,
    });
  };

  return (
    <div id="tasks-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tasks</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {tasks.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage sprints, cross-functional deliverables, and board progress.
          </p>
        </div>

        {/* View Switcher & New Task Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
            <button
              id="view-kanban-btn"
              onClick={() => setActiveView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              id="view-list-btn"
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              id="view-mytasks-btn"
              onClick={() => setActiveView('mytasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'mytasks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>My Tasks</span>
            </button>
          </div>

          <button
            id="btn-tasks-new-task"
            onClick={() => openCreateModal('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar - fully responsive across mobile and desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks by title, description, or assignee..."
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

        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Priority filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs rounded-xl border border-white/10 bg-white/5 p-1.5 text-indigo-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all" className="bg-[#0a0b16] text-white">All Priorities</option>
              <option value="Urgent" className="bg-[#0a0b16] text-white">Urgent</option>
              <option value="High" className="bg-[#0a0b16] text-white">High</option>
              <option value="Medium" className="bg-[#0a0b16] text-white">Medium</option>
              <option value="Low" className="bg-[#0a0b16] text-white">Low</option>
            </select>
          </div>

          {/* Label filter */}
          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            className="text-xs rounded-xl border border-white/10 bg-white/5 p-1.5 text-indigo-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all" className="bg-[#0a0b16] text-white">All Labels</option>
            {allLabels.map((lbl) => (
              <option key={lbl} value={lbl} className="bg-[#0a0b16] text-white">
                {lbl}
              </option>
            ))}
          </select>

          {/* Sort order */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-xl border border-white/10 bg-white/5 p-1.5 text-indigo-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="dueDate" className="bg-[#0a0b16] text-white">Due Date</option>
              <option value="priority" className="bg-[#0a0b16] text-white">Priority</option>
              <option value="title" className="bg-[#0a0b16] text-white">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {(activeView === 'kanban' || activeView === 'mytasks') && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
          {columns.map((column) => {
            const columnTasks = sortedTasks.filter((t) => t.status === column);
            return (
              <div
                key={column}
                id={`kanban-col-${column.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col min-w-[240px] max-h-[75vh]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {column}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreateModal('task')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    title="Add task to column"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Cards Column */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      No tasks in {column}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        id={`task-card-${task.id}`}
                        onClick={() => setSelectedTask(task)}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group relative"
                      >
                        {/* Top row: Label & Priority */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                            {task.label}
                          </span>
                          <PriorityBadge priority={task.priority} />
                        </div>

                        {/* Title & description */}
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Checklist progress bar if present */}
                        {task.checklist && task.checklist.length > 0 && (
                          <div className="mt-2.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                              <span>Checklist</span>
                              <span>
                                {task.checklist.filter((c) => c.completed).length}/{task.checklist.length}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${task.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer: Assignee & Meta indicators */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                          <div className="flex items-center gap-1.5">
                            <UserAvatar
                              initials={task.assigneeInitials}
                              name={task.assigneeName}
                              size="xs"
                            />
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[80px]">
                              {task.assigneeName.split(' ')[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                            {task.commentsCount > 0 && (
                              <span className="flex items-center gap-0.5" title={`${task.commentsCount} comments`}>
                                <MessageSquare className="w-3 h-3" />
                                {task.commentsCount}
                              </span>
                            )}
                            {task.attachmentsCount > 0 && (
                              <span className="flex items-center gap-0.5" title={`${task.attachmentsCount} attachments`}>
                                <Paperclip className="w-3 h-3" />
                                {task.attachmentsCount}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 font-mono">
                              {task.dueDate.substring(5)}
                            </span>
                          </div>
                        </div>

                        {/* Quick column switcher controls */}
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate">Move status:</span>
                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => changeTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {columns.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {activeView === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Task Title</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{task.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{task.description}</div>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="p-3.5">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <UserAvatar initials={task.assigneeInitials} size="xs" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{task.assigneeName}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{task.dueDate}</td>
                    <td className="p-3.5 text-slate-500 font-medium">#{task.label}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTaskToDelete(task);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Detail Drawer */}
      {selectedTask && (
        <div
          id="task-detail-drawer-backdrop"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => {
            setSelectedTask(null);
            setIsEditingTask(false);
          }}
        >
          <div
            id="task-detail-drawer"
            className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col overflow-y-auto text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer top controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-400 uppercase tracking-wider">#{selectedTask.label}</span>
                <span>•</span>
                <span>Created recently</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  id="btn-edit-task-toggle"
                  onClick={() => setIsEditingTask(!isEditingTask)}
                  className="px-2.5 py-1 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingTask ? 'Done' : 'Edit'}</span>
                </button>
                <button
                  id="btn-delete-task-trigger"
                  onClick={() => setTaskToDelete(selectedTask)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditingTask(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Presence Indicator */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs mb-4">
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>
                <strong>Rohan Mehta</strong> and <strong>Priya Sharma</strong> are viewing this task
              </span>
            </div>

            {/* Title & Description editing */}
            {!isEditingTask ? (
              <div className="space-y-2 mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedTask.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setSelectedTask({ ...selectedTask, title: newTitle });
                    updateTask(selectedTask.id, { title: newTitle });
                  }}
                  className="w-full text-base font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
                <textarea
                  rows={3}
                  value={selectedTask.description}
                  onChange={(e) => {
                    const newDesc = e.target.value;
                    setSelectedTask({ ...selectedTask, description: newDesc });
                    updateTask(selectedTask.id, { description: newDesc });
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              </div>
            )}

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs mb-5">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Status</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as TaskStatus;
                    changeTaskStatus(selectedTask.id, newStatus);
                    setSelectedTask({ ...selectedTask, status: newStatus });
                  }}
                  className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  {columns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Priority</span>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => {
                    const newPriority = e.target.value as TaskPriority;
                    updateTask(selectedTask.id, { priority: newPriority });
                    setSelectedTask({ ...selectedTask, priority: newPriority });
                  }}
                  className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Assignee</span>
                <select
                  value={selectedTask.assigneeId}
                  onChange={(e) => {
                    const member = members.find((m) => m.id === e.target.value);
                    if (member) {
                      updateTask(selectedTask.id, {
                        assigneeId: member.id,
                        assigneeName: member.name,
                        assigneeInitials: member.avatarInitials,
                      });
                      setSelectedTask({
                        ...selectedTask,
                        assigneeId: member.id,
                        assigneeName: member.name,
                        assigneeInitials: member.avatarInitials,
                      });
                    }
                  }}
                  className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Due Date</span>
                <input
                  type="date"
                  value={selectedTask.dueDate}
                  onChange={(e) => {
                    const newDueDate = e.target.value;
                    updateTask(selectedTask.id, { dueDate: newDueDate });
                    setSelectedTask({ ...selectedTask, dueDate: newDueDate });
                  }}
                  className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Checklist Section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Checklist ({(selectedTask.checklist || []).filter((c) => c.completed).length}/
                  {(selectedTask.checklist || []).length})
                </h4>
              </div>

              <div className="space-y-1.5 mb-2">
                {(selectedTask.checklist || []).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(selectedTask.id, item.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add item..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Attachments Section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Attachments ({(selectedTask.attachments || []).length})
                </h4>
                <button
                  onClick={handleMockAttachmentUpload}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  + Upload Mock File
                </button>
              </div>

              <div className="space-y-1.5">
                {(selectedTask.attachments || []).map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700 dark:text-slate-200">{att.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{att.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Thread */}
            <div className="flex-1 mb-5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Comments ({(selectedTask.comments || []).length})
              </h4>

              <div className="space-y-3 mb-3">
                {(selectedTask.comments || []).map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs">
                    <UserAvatar initials={c.authorInitials} size="xs" className="shrink-0 mt-0.5" />
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or mention @member..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Edit History Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Last edited by {selectedTask.lastEditedBy}</span>
              <span>{selectedTask.lastEditedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action will remove the task and its history from the workspace.`}
        confirmLabel="Delete Task"
        isDestructive={true}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            if (selectedTask?.id === taskToDelete.id) setSelectedTask(null);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
