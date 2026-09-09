import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Pin,
  Heart,
  ThumbsUp,
  Rocket,
  Check,
  Plus,
  Send,
  Sparkles,
  Share2,
  Users,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DiscussionPost } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';

export const DiscussionsPage: React.FC = () => {
  const {
    discussions,
    currentUser,
    createPost,
    toggleLikePost,
    acknowledgePost,
    addPostComment,
    openCreateModal,
  } = useWorkspace();

  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [activeExpandedPostId, setActiveExpandedPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [postId: string]: string }>({});

  const channels = ['All', 'Announcements', 'General', 'Events', 'Questions'];

  const filteredPosts = discussions.filter((post) => {
    if (selectedChannel === 'All') return true;
    return post.type === selectedChannel;
  });

  const handleSendComment = (postId: string) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;
    addPostComment(postId, text.trim());
    setReplyText({ ...replyText, [postId]: '' });
  };

  return (
    <div id="discussions-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Discussions & Announcements
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {discussions.length} threads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Asynchronous discussions, official announcements, and team questions.
          </p>
        </div>

        <button
          id="btn-new-discussion"
          onClick={() => openCreateModal('announcement')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion / Announcement</span>
        </button>
      </div>

      {/* Channel Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {channels.map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedChannel === ch
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {ch === 'Announcements' && '📢 '}
            {ch}
          </button>
        ))}
      </div>

      {/* Discussion Threads List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const hasUserAcknowledged = post.acknowledgedBy.includes(currentUser.id);
          const isExpanded = activeExpandedPostId === post.id;

          return (
            <div
              key={post.id}
              className={`p-5 rounded-xl border transition-all ${
                post.pinned
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    initials={post.authorInitials}
                    name={post.authorName}
                    size="sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {post.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">• {post.createdAt}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">#{post.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {post.title}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </p>

              {/* Mandatory Acknowledgment Banner */}
              {post.requiresAcknowledgment && (
                <div className="mb-4 p-3 rounded-lg border border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Bell className="w-4 h-4 shrink-0" />
                    <span>
                      Formal acknowledgment required ({post.acknowledgedBy.length} team members confirmed)
                    </span>
                  </div>
                  <button
                    onClick={() => acknowledgePost(post.id)}
                    disabled={hasUserAcknowledged}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                      hasUserAcknowledged
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{hasUserAcknowledged ? 'Acknowledged' : 'I Acknowledge'}</span>
                  </button>
                </div>
              )}

              {/* Reactions & Comment Expand Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {/* Reaction buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors ${
                      post.userLiked
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>👍</span>
                    <span className="font-semibold text-[11px]">{post.likes}</span>
                  </button>
                </div>

                {/* Comments trigger */}
                <button
                  onClick={() => setActiveExpandedPostId(isExpanded ? null : post.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} replies</span>
                </button>
              </div>

              {/* Expanded Comments Thread */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="space-y-2.5">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No replies yet. Be the first to chime in!</p>
                    ) : (
                      post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5 text-xs">
                          <UserAvatar
                            initials={c.authorInitials}
                            name={c.authorName}
                            size="xs"
                            className="mt-0.5"
                          />
                          <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                              <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add reply input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write a response..."
                      value={replyText[post.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      className="flex-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
