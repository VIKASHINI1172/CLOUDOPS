import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Users,
  Plus,
  MapPin,
  CheckCircle,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';

interface Shift {
  id: string;
  eventName: string;
  role: string;
  date: string;
  time: string;
  location: string;
  slotsNeeded: number;
  assignedMemberIds: string[];
}

export const ShiftsPage: React.FC = () => {
  const { members, currentUser, showToast } = useWorkspace();

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 'sh-1',
      eventName: 'Fall Innovation Fest 2026',
      role: 'Welcome & Registration Booth Lead',
      date: '2026-09-18',
      time: '09:00 - 12:30',
      location: 'Student Union Plaza Front Gate',
      slotsNeeded: 2,
      assignedMemberIds: [members[0]?.id || 'm-1'],
    },
    {
      id: 'sh-2',
      eventName: 'Fall Innovation Fest 2026',
      role: 'Stage & AV Equipment Logistics',
      date: '2026-09-18',
      time: '12:00 - 16:00',
      location: 'Auditorium Main Hall',
      slotsNeeded: 3,
      assignedMemberIds: [members[1]?.id || 'm-2', members[2]?.id || 'm-3'],
    },
    {
      id: 'sh-3',
      eventName: 'Campus Tech Expo',
      role: 'Sponsorship VIP Liaison',
      date: '2026-09-22',
      time: '13:00 - 17:00',
      location: 'Science & Engineering Atrium',
      slotsNeeded: 2,
      assignedMemberIds: [members[4]?.id || 'm-5'],
    },
    {
      id: 'sh-4',
      eventName: 'Orientation Club Fair',
      role: 'Demonstration & VR Station Operator',
      date: '2026-09-25',
      time: '10:00 - 14:00',
      location: 'Courtyard Booth #14',
      slotsNeeded: 2,
      assignedMemberIds: [],
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDate, setNewDate] = useState('2026-09-20');
  const [newTime, setNewTime] = useState('10:00 - 13:00');
  const [newLocation, setNewLocation] = useState('Campus Quad');
  const [newSlots, setNewSlots] = useState(2);

  const handleClaimShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;
        if (s.assignedMemberIds.includes(currentUser.id)) {
          showToast('Shift Relinquished', 'You have unassigned yourself from this volunteer shift.', 'info');
          return {
            ...s,
            assignedMemberIds: s.assignedMemberIds.filter((id) => id !== currentUser.id),
          };
        }
        if (s.assignedMemberIds.length >= s.slotsNeeded) {
          showToast('Shift Full', 'This volunteer slot is already at max capacity.', 'warning');
          return s;
        }
        showToast('Shift Confirmed', 'You are officially registered for this volunteer slot!', 'success');
        return {
          ...s,
          assignedMemberIds: [...s.assignedMemberIds, currentUser.id],
        };
      })
    );
  };

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newRole.trim()) return;
    const newShift: Shift = {
      id: `sh-${Date.now()}`,
      eventName: newEventName.trim(),
      role: newRole.trim(),
      date: newDate,
      time: newTime,
      location: newLocation.trim(),
      slotsNeeded: Number(newSlots),
      assignedMemberIds: [],
    };
    setShifts([newShift, ...shifts]);
    setIsCreateOpen(false);
    showToast('Shift Published', 'New shift slot added to volunteer roster.', 'success');
  };

  return (
    <div id="shifts-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shift Scheduling
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {shifts.length} active shifts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate on-site event shifts, booth staffing, and volunteer coverage.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shift Slot</span>
        </button>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shifts.map((shift) => {
          const isUserAssigned = shift.assignedMemberIds.includes(currentUser.id);
          const isFull = shift.assignedMemberIds.length >= shift.slotsNeeded;

          return (
            <div
              key={shift.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {shift.eventName}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {shift.assignedMemberIds.length}/{shift.slotsNeeded} Staffed
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {shift.role}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.location}</span>
                  </div>
                </div>

                {/* Assigned members avatars */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Confirmed Volunteers
                  </span>
                  <div className="flex items-center gap-2">
                    {shift.assignedMemberIds.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No volunteers assigned yet</span>
                    ) : (
                      shift.assignedMemberIds.map((id) => {
                        const m = members.find((mem) => mem.id === id);
                        return m ? (
                          <div key={id} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs">
                            <UserAvatar initials={m.avatarInitials} size="xs" bgClass={m.avatarBg} />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{m.name.split(' ')[0]}</span>
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleClaimShift(shift.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isUserAssigned
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
                      : isFull
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isUserAssigned ? 'Relinquish Slot' : isFull ? 'Slot Full' : 'Volunteer for Shift'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Shift Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Event Volunteer Shift
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Demo Day Showcase"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Speaker Escort"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Slots Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSlots}
                    onChange={(e) => setNewSlots(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Publish Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
