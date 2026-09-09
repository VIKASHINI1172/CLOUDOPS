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
      className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 md:pt-20 px-2 sm:px-4 pb-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="global-search-container"
        className="bg-[#0a0b16]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] max-w-2xl w-full overflow-hidden text-[#e0e0ff] flex flex-col max-h-[92vh] sm:max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header - fully responsive */}
        <div className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 border-b border-white/10 gap-2 sm:gap-3 shrink-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search tasks, files, notes, meetings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base border-none outline-none placeholder:text-indigo-300/40 text-white min-w-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-indigo-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="sm:hidden text-xs font-mono text-indigo-300 hover:text-white px-2.5 py-1 rounded-full bg-white/5 border border-white/10 transition-colors shrink-0"
          >
            Close
          </button>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-indigo-300 shrink-0">
            ESC
          </span>
        </div>

        {/* Category filters - touch scrollable */}
        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border-b border-white/10 overflow-x-auto text-xs bg-white/5 shrink-0 scrollbar-none">
          {['all', 'task', 'file', 'discussion', 'meeting', 'note', 'approval', 'decision', 'member'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full capitalize whitespace-nowrap transition-all font-mono text-xs ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] border border-indigo-400/50'
                  : 'text-indigo-300/70 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results list - responsive item cards */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1 divide-y divide-white/5">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-indigo-300/50 font-mono">
              NO TELEMETRY MATCHES FOR "{query.toUpperCase()}"
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                id={`search-res-${item.type.toLowerCase()}-${item.id}`}
                onClick={() => handleSelect(item.route)}
                className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left hover:bg-white/10 transition-colors group gap-2"
              >
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5 group-hover:border-indigo-500/40 transition-colors">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-indigo-300/60 bg-white/5 px-1.5 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                      <h4 className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] sm:text-xs text-indigo-200/60 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-[11px] sm:text-xs text-indigo-400 group-hover:text-indigo-300 shrink-0 font-mono gap-1">
                  <span className="hidden sm:inline">Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] font-mono text-indigo-300/60 shrink-0">
          <span>{filteredResults.length} matching entries across cluster</span>
          <span className="hidden sm:inline">Tip: Press ⌘K anywhere to search</span>
        </div>
      </div>
    </div>
  );
};
