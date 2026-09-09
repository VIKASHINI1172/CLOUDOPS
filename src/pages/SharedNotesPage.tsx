import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Star,
  Trash2,
  Folder,
  Edit3,
  Check,
  Share2,
  Copy,
  BookOpen,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { SharedNote } from '../types';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const SharedNotesPage: React.FC = () => {
  const {
    sharedNotes,
    createSharedNote,
    updateSharedNote,
    deleteSharedNote,
    openCreateModal,
  } = useWorkspace();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(sharedNotes[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<SharedNote | null>(null);

  const activeNote =
    sharedNotes.find((n) => n.id === selectedNoteId) || sharedNotes[0];

  const toggleFavoriteNote = (id: string, currentFav: boolean) => {
    updateSharedNote(id, { isFavorite: !currentFav });
  };

  const categories = ['All', 'Operations', 'Events', 'Finance', 'Marketing'];

  const filteredNotes = sharedNotes.filter((note) => {
    if (activeCategory === 'All') return true;
    return note.category === activeCategory;
  });

  const handleCopyMarkdown = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    alert('Markdown content copied to clipboard!');
  };

  return (
    <div id="shared-notes-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shared Notes & Wiki
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {sharedNotes.length} articles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal team documentation, operational playbooks, and knowledge-base guidelines.
          </p>
        </div>

        <button
          id="btn-new-shared-note"
          onClick={() => openCreateModal('note')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note / Wiki Doc</span>
        </button>
      </div>

      {/* Main Split Layout: Wiki Index (Left) & Document Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Category Filter & Note Cards */}
        <div className="lg:col-span-4 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes list */}
          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote && activeNote.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {note.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteNote(note.id, note.isFavorite);
                      }}
                      className="text-slate-300 hover:text-amber-500"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          note.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {note.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {note.content.replace(/#|\*|`/g, '')}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{note.lastEditedBy}</span>
                    <span>{note.lastEditedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Document Content / Editor */}
        {activeNote && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Note Header & Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {activeNote.category}
                  </span>
                  <span>•</span>
                  <span>Author: {activeNote.lastEditedBy}</span>
                  <span>•</span>
                  <span>Updated {activeNote.lastEditedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Copy Markdown"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Preview Mode' : 'Edit Document'}</span>
                  </button>
                  <button
                    onClick={() => setNoteToDelete(activeNote)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title display/edit */}
              {!isEditing ? (
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {activeNote.title}
                </h2>
              ) : (
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateSharedNote(activeNote.id, { title: e.target.value })}
                  className="w-full text-xl font-bold text-slate-900 dark:text-white mb-4 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              )}

              {/* Document Body */}
              {!isEditing ? (
                <div className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans space-y-2">
                  {activeNote.content}
                </div>
              ) : (
                <textarea
                  rows={16}
                  value={activeNote.content}
                  onChange={(e) => updateSharedNote(activeNote.id, { content: e.target.value })}
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Footer tip */}
            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>All changes automatically sync to local team cache</span>
              <span>Markdown formatting enabled</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(noteToDelete)}
        title="Delete Document"
        message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
        confirmLabel="Delete Note"
        isDestructive={true}
        onConfirm={() => {
          if (noteToDelete) {
            deleteSharedNote(noteToDelete.id);
            setNoteToDelete(null);
          }
        }}
        onCancel={() => setNoteToDelete(null)}
      />
    </div>
  );
};
