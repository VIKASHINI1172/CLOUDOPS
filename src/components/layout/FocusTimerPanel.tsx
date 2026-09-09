import React, { useState } from 'react';
import { Play, Pause, Square, Sparkles, Clock, X, CheckCircle2 } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const FocusTimerPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    tasks,
    isFocusMode,
    isFocusRunning,
    focusTimeRemaining,
    activeFocusTask,
    startFocusTimer,
    pauseFocusTimer,
    stopFocusTimer,
    focusSessions,
  } = useWorkspace();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeFocusTask?.id || '');
  const [customMinutes, setCustomMinutes] = useState<number>(25);

  if (!isOpen) return null;

  const minutes = Math.floor(focusTimeRemaining / 60);
  const seconds = focusTimeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = customMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - focusTimeRemaining) / totalSeconds) * 100));

  const handleStart = () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    startFocusTimer(task ? { id: task.id, title: task.title } : undefined, customMinutes);
  };

  return (
    <div
      id="focus-timer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="focus-timer-dialog"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Focus Mode & Pomodoro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Eliminate distractions and track deep work</p>
            </div>
          </div>
          <button
            id="btn-close-focus-timer"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer display */}
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-5">
          <div className="text-5xl font-mono font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            {formattedTime}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3 max-w-xs">
            <div
              className="bg-purple-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="mt-3 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            {isFocusRunning ? 'Session active: distraction-free mode' : isFocusMode ? 'Paused' : 'Ready to focus'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {!isFocusRunning ? (
            <button
              id="btn-start-focus"
              onClick={handleStart}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/20 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              {focusTimeRemaining < customMinutes * 60 && focusTimeRemaining > 0 ? 'Resume' : 'Start Focus'}
            </button>
          ) : (
            <button
              id="btn-pause-focus"
              onClick={pauseFocusTimer}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
            >
              <Pause className="w-4 h-4 fill-current" />
              Pause
            </button>
          )}

          <button
            id="btn-stop-focus"
            onClick={stopFocusTimer}
            disabled={!isFocusMode && focusTimeRemaining === customMinutes * 60}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Square className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Focus Task Selector */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Task to Focus On (Optional)
            </label>
            <select
              id="select-focus-task"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isFocusRunning}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">General Focus / Administrative</option>
              {tasks
                .filter((t) => t.status !== 'Done')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.status}] {t.title} ({t.priority})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Duration Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setCustomMinutes(mins);
                    if (!isFocusRunning) startFocusTimer(undefined, mins);
                  }}
                  className={`py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    customMinutes === mins
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Completed sessions this week */}
        {focusSessions.length > 0 && (
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Completed Sessions ({focusSessions.length})
            </h4>
            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
              {focusSessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                >
                  <span className="truncate">{s.taskTitle}</span>
                  <span className="text-[11px] text-slate-400 shrink-0 ml-2">{s.durationMinutes}m completed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
