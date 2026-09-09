import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  Sparkles,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { CalendarEvent } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';

export const CalendarPage: React.FC = () => {
  const {
    events: calendarEvents,
    tasks,
    members,
    createCalendarEvent,
    deleteCalendarEvent,
    currentUser,
    openCreateModal,
  } = useWorkspace();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // Sept (0-indexed: 8)
  const [currentYear, setCurrentYear] = useState(2026);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Filters
  const [showTasks, setShowTasks] = useState(true);
  const [showMeetings, setShowMeetings] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);

  // "Find a Time" smart scheduler modal
  const [isFindTimeOpen, setIsFindTimeOpen] = useState(false);
  const [selectedFindMembers, setSelectedFindMembers] = useState<string[]>([
    members[0]?.id || '',
    members[1]?.id || '',
  ]);
  const [findDuration, setFindDuration] = useState('45');
  const [suggestedSlot, setSuggestedSlot] = useState<{
    date: string;
    time: string;
    score: string;
  } | null>(null);

  // Event detail modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Month labels
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  // Generate 35 calendar cells (September 2026 starts on Tuesday, day 2)
  const daysInMonth = 30; // Sept has 30 days
  const startDayOfWeek = 2; // 0=Sun, 1=Mon, 2=Tue
  const days = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ day: 31 - startDayOfWeek + 1 + i, currentMonth: false, monthOffset: -1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, currentMonth: true, monthOffset: 0 });
  }
  const remaining = 35 - days.length;
  for (let r = 1; r <= remaining; r++) {
    days.push({ day: r, currentMonth: false, monthOffset: 1 });
  }

  // Find slot algorithm simulation
  const handleCalculateBestSlot = () => {
    setSuggestedSlot({
      date: '2026-09-14',
      time: '14:30 - 15:15',
      score: '100% attendance fit (No conflicts detected)',
    });
  };

  const handleBookSuggestedSlot = () => {
    if (!suggestedSlot) return;
    createCalendarEvent({
      title: 'Sync: Scheduled via AI Time Finder',
      date: suggestedSlot.date,
      startTime: suggestedSlot.time.split(' - ')[0],
      endTime: suggestedSlot.time.split(' - ')[1],
      location: 'Meet Virtual Room',
      type: 'meeting',
      requiredAttendees: selectedFindMembers,
      optionalAttendees: [],
      description: 'Scheduled with optimal team availability.',
    });
    setIsFindTimeOpen(false);
    setSuggestedSlot(null);
  };

  return (
    <div id="calendar-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calendar</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {monthNames[currentMonthIndex]} {currentYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate sprints, event milestones, and team meeting schedules.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Find a time modal trigger */}
          <button
            id="btn-open-find-time"
            onClick={() => {
              setIsFindTimeOpen(true);
              handleCalculateBestSlot();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Find a Time</span>
          </button>

          <button
            id="btn-schedule-event"
            onClick={() => openCreateModal('meeting')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Book Meeting</span>
          </button>
        </div>
      </div>

      {/* Navigation & View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs">
        {/* Month Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white px-2">
            {monthNames[currentMonthIndex]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentMonthIndex(8);
              setCurrentYear(2026);
            }}
            className="ml-2 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showMeetings}
              onChange={(e) => setShowMeetings(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Meetings
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showTasks}
              onChange={(e) => setShowTasks(e.target.checked)}
              className="w-3.5 h-3.5 text-rose-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Task Deadlines
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showMilestones}
              onChange={(e) => setShowMilestones(e.target.checked)}
              className="w-3.5 h-3.5 text-emerald-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Milestones
            </span>
          </label>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['month', 'week', 'day'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                viewMode === m
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-2 bg-slate-50 dark:bg-slate-800/40">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200/80 dark:divide-slate-800">
            {days.map((item, index) => {
              const formattedDay = String(item.day).padStart(2, '0');
              const dateKey = `2026-09-${formattedDay}`;

              // Events on this day
              const dayEvents = calendarEvents.filter((ev) => ev.date === dateKey && showMeetings);
              const dayTasks = tasks.filter((t) => t.dueDate === dateKey && showTasks);

              const isToday = item.currentMonth && item.day === 12; // arbitrary today in demo

              return (
                <div
                  key={index}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    !item.currentMonth
                      ? 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600'
                      : 'bg-white dark:bg-slate-900'
                  } ${isToday ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-indigo-600 text-white'
                          : item.currentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {item.day}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Badges on this day */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 truncate cursor-pointer hover:opacity-80 transition-opacity"
                        title={ev.title}
                      >
                        🕒 {ev.startTime} {ev.title}
                      </div>
                    ))}

                    {dayTasks.map((tsk) => (
                      <div
                        key={tsk.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 truncate"
                        title={`Task Due: ${tsk.title}`}
                      >
                        📋 Due: {tsk.title}
                      </div>
                    ))}
                  </div>

                  <div className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK & DAY VIEW placeholder presentation */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <CalendarIcon className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {viewMode === 'week' ? 'Week Agenda Schedule' : 'Daily Chronological Timeline'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Viewing week of September 7 - September 13, 2026. All tasks and synchronized meetings are mapped to hourly time slots.
          </p>

          <div className="max-w-2xl mx-auto space-y-3 text-left text-xs">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">{ev.title}</span>
                  <span className="text-slate-500 text-xs">
                    {ev.date} • {ev.startTime} - {ev.endTime} • {ev.location}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-semibold"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SMART "FIND A TIME" MODAL */}
      {isFindTimeOpen && (
        <div
          id="find-time-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsFindTimeOpen(false)}
        >
          <div
            id="find-time-dialog"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Smart Meeting Scheduler
                  </h3>
                  <p className="text-xs text-slate-500">Cross-reference team calendars and busy blocks</p>
                </div>
              </div>
              <button
                onClick={() => setIsFindTimeOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Select Attendees */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Required Attendees
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((m) => {
                    const isChecked = selectedFindMembers.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedFindMembers(selectedFindMembers.filter((id) => id !== m.id));
                          } else {
                            setSelectedFindMembers([...selectedFindMembers, m.id]);
                          }
                        }}
                        className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <UserAvatar initials={m.avatarInitials} size="xs" bgClass={m.avatarBg} />
                        <span className="truncate flex-1 font-medium">{m.name}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duration select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Duration
                </label>
                <select
                  value={findDuration}
                  onChange={(e) => setFindDuration(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                >
                  <option value="15">15 mins (Quick Standup)</option>
                  <option value="30">30 mins (Sync / Check-in)</option>
                  <option value="45">45 mins (Sprint Planning)</option>
                  <option value="60">60 mins (Workshop / Demo)</option>
                </select>
              </div>

              {/* Suggested slot banner */}
              {suggestedSlot && (
                <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                    <Sparkles className="w-4 h-4" /> Recommended Open Window
                  </div>
                  <div className="text-slate-900 dark:text-white font-semibold text-sm">
                    {suggestedSlot.date} at {suggestedSlot.time}
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5">
                    {suggestedSlot.score}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-5">
              <button
                onClick={() => setIsFindTimeOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="btn-book-suggested-slot"
                onClick={handleBookSuggestedSlot}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Book This Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div
          id="event-detail-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            id="event-detail-dialog"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                {selectedEvent.type}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {selectedEvent.title}
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  {selectedEvent.date} • {selectedEvent.startTime} - {selectedEvent.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{selectedEvent.requiredAttendees.length} Attendees RSVP'd</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed mb-5">
              {selectedEvent.description || 'No additional notes provided.'}
            </p>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  deleteCalendarEvent(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                Cancel Event
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
