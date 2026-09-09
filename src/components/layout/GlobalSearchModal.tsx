import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  CheckSquare,
  FileText,
  MessageSquare,
  Video,
  FileCode,
  Users,
  ShieldCheck,
  Scale,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    files,
    discussions,
    meetings,
    sharedNotes,
    members,
    approvals,
    decisions,
    navigate,
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search through all entities
  const taskResults = tasks
    .filter((t) => !cleanQuery || t.title.toLowerCase().includes(cleanQuery) || t.description.toLowerCase().includes(cleanQuery))
    .map((t) => ({
      id: t.id,
      type: 'Task' as const,
      route: 'tasks',
      title: t.title,
      subtitle: `${t.status} • ${t.priority} priority • Assigned to ${t.assigneeName}`,
      icon: <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />,
    }));

  const fileResults = files
    .filter((f) => !cleanQuery || f.name.toLowerCase().includes(cleanQuery) || f.folder.toLowerCase().includes(cleanQuery))
    .map((f) => ({
      id: f.id,
      type: 'File' as const,
      route: 'files',
      title: f.name,
      subtitle: `${f.folder} • ${f.size} • Uploaded by ${f.uploadedBy}`,
      icon: <FileText className="w-4 h-4 text-emerald-500 shrink-0" />,
    }));

  const discussionResults = discussions
    .filter((d) => !cleanQuery || d.title.toLowerCase().includes(cleanQuery) || d.content.toLowerCase().includes(cleanQuery))
    .map((d) => ({
      id: d.id,
      type: 'Discussion' as const,
      route: 'discussions',
      title: d.title,
      subtitle: `${d.type} by ${d.authorName} • ${d.repliesCount} replies`,
      icon: <MessageSquare className="w-4 h-4 text-purple-500 shrink-0" />,
    }));

  const meetingResults = meetings
    .filter((m) => !cleanQuery || m.title.toLowerCase().includes(cleanQuery) || m.agenda.toLowerCase().includes(cleanQuery) || m.aiSummary.toLowerCase().includes(cleanQuery))
    .map((m) => ({
      id: m.id,
      type: 'Meeting' as const,
      route: 'meeting-notes',
      title: m.title,
      subtitle: `${m.date} • ${m.participants.length} attendees • ${m.actionItems.length} action items`,
      icon: <Video className="w-4 h-4 text-indigo-500 shrink-0" />,
    }));

  const noteResults = sharedNotes
    .filter((n) => !cleanQuery || n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery))
    .map((n) => ({
      id: n.id,
      type: 'Note' as const,
      route: 'shared-notes',
      title: n.title,
      subtitle: `Wiki in ${n.category} • Edited by ${n.lastEditedBy}`,
      icon: <FileCode className="w-4 h-4 text-amber-500 shrink-0" />,
    }));

  const memberResults = members
    .filter((m) => !cleanQuery || m.name.toLowerCase().includes(cleanQuery) || m.position.toLowerCase().includes(cleanQuery) || m.email.toLowerCase().includes(cleanQuery))
    .map((m) => ({
      id: m.id,
      type: 'Member' as const,
      route: 'members',
      title: m.name,
      subtitle: `${m.position} • ${m.role} • ${m.status}`,
      icon: <Users className="w-4 h-4 text-rose-500 shrink-0" />,
    }));

  const approvalResults = approvals
    .filter((a) => !cleanQuery || a.title.toLowerCase().includes(cleanQuery) || a.requestedByName.toLowerCase().includes(cleanQuery))
    .map((a) => ({
      id: a.id,
      type: 'Approval' as const,
      route: 'approvals',
      title: a.title,
      subtitle: `${a.status} • Requested by ${a.requestedByName} (${a.amount || 'N/A'})`,
      icon: <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />,
    }));

  const decisionResults = decisions
    .filter((d) => !cleanQuery || d.text.toLowerCase().includes(cleanQuery) || d.decidedBy.toLowerCase().includes(cleanQuery))
    .map((d) => ({
      id: d.id,
      type: 'Decision' as const,
      route: 'decisions',
      title: d.text,
      subtitle: `Decided by ${d.decidedBy} on ${d.date}`,
      icon: <Scale className="w-4 h-4 text-orange-500 shrink-0" />,
    }));

  const allResults = [
    ...taskResults,
    ...fileResults,
    ...discussionResults,
    ...meetingResults,
    ...noteResults,
    ...approvalResults,
    ...decisionResults,
    ...memberResults,
  ];

  const filteredResults = activeCategory === 'all'
    ? allResults
    : allResults.filter((r) => r.type.toLowerCase() === activeCategory.toLowerCase());

  const handleSelect = (route: string) => {
    navigate(route);
    setIsSearchOpen(false);
  };

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="global-search-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search tasks, files, notes, meetings, members, approvals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base border-none outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto text-xs bg-slate-50/50 dark:bg-slate-900/50">
          {['all', 'task', 'file', 'discussion', 'meeting', 'note', 'approval', 'decision', 'member'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md capitalize whitespace-nowrap transition-colors font-medium ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for "{query}". Try a different keyword or category.
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                id={`search-res-${item.type.toLowerCase()}-${item.id}`}
                onClick={() => handleSelect(item.route)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {item.type}
                      </span>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 font-medium gap-1 pl-2">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{filteredResults.length} matching entries across workspace</span>
          <span>Tip: Press ⌘K anywhere to search</span>
        </div>
      </div>
    </div>
  );
};
