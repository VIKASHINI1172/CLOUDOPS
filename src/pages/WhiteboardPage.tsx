import React, { useState } from 'react';
import {
  PenTool,
  Plus,
  Trash2,
  Download,
  Square,
  Sparkles,
  Move,
  Check,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface StickyNote {
  id: string;
  title: string;
  color: 'yellow' | 'pink' | 'blue' | 'green';
  author: string;
}

export const WhiteboardPage: React.FC = () => {
  const { currentUser, showToast } = useWorkspace();

  const [notes, setNotes] = useState<StickyNote[]>([
    {
      id: 'st-1',
      title: 'Should we switch to Discord or Slack for club member chat?',
      color: 'yellow',
      author: 'Aisha Khan',
    },
    {
      id: 'st-2',
      title: 'Blocker: Still waiting on dean approval for weekend lab access',
      color: 'pink',
      author: 'Rohan Mehta',
    },
    {
      id: 'st-3',
      title: 'Idea: Invite Google Cloud DevRel for AI workshop keynote',
      color: 'blue',
      author: 'Priya Sharma',
    },
    {
      id: 'st-4',
      title: 'Food sponsor confirmed 150 discount codes for hackathon',
      color: 'green',
      author: 'Maya Lin',
    },
  ]);

  const [newText, setNewText] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'pink' | 'blue' | 'green'>('yellow');

  const colorStyles = {
    yellow: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-100 dark:border-amber-700',
    pink: 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/70 dark:text-rose-100 dark:border-rose-700',
    blue: 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950/70 dark:text-sky-100 dark:border-sky-700',
    green: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-100 dark:border-emerald-700',
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const note: StickyNote = {
      id: `st-${Date.now()}`,
      title: newText.trim(),
      color: selectedColor,
      author: currentUser.name,
    };
    setNotes([...notes, note]);
    setNewText('');
    showToast('Sticky Note Placed', 'Note added to collaborative whiteboard.', 'success');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div id="whiteboard-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ideation Whiteboard
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {notes.length} stickies
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Freeform canvas for brainstorming sprint themes, hackathon track ideas, and design sprints.
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Exported Snapshot', 'Whiteboard state saved to browser storage.', 'info');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Save Snapshot</span>
        </button>
      </div>

      {/* Creation Ribbon */}
      <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Type an idea, blocker, or discussion note..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 min-w-[240px] text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        />

        {/* Color pickers */}
        <div className="flex items-center gap-1.5">
          {(['yellow', 'pink', 'blue', 'green'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                selectedColor === c ? 'scale-110 border-slate-900 dark:border-white' : 'border-transparent'
              } ${
                c === 'yellow'
                  ? 'bg-amber-300'
                  : c === 'pink'
                  ? 'bg-rose-300'
                  : c === 'blue'
                  ? 'bg-sky-300'
                  : 'bg-emerald-300'
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Post Sticky Note</span>
        </button>
      </form>

      {/* Sticky Board Canvas Grid */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 min-h-[500px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-xl border-2 shadow-sm transition-all hover:shadow-md flex flex-col justify-between min-h-[170px] ${colorStyles[note.color]}`}
            >
              <p className="text-xs font-medium leading-relaxed whitespace-pre-line">
                {note.title}
              </p>

              <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] opacity-80">
                <span>By {note.author.split(' ')[0]}</span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="hover:text-rose-600 dark:hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
