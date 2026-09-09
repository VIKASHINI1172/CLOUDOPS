import React, { useState } from 'react';
import {
  Heart,
  Award,
  Sparkles,
  Plus,
  ThumbsUp,
  X,
  Send,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { UserAvatar } from '../components/common/UserAvatar';

interface KudosItem {
  id: string;
  senderName: string;
  senderInitials: string;
  recipientName: string;
  recipientInitials: string;
  recipientBg: string;
  badge: string;
  message: string;
  claps: number;
  createdAt: string;
}

export const KudosPage: React.FC = () => {
  const { members, currentUser, showToast } = useWorkspace();

  const [kudosList, setKudosList] = useState<KudosItem[]>([
    {
      id: 'kd-1',
      senderName: 'Aisha Khan',
      senderInitials: 'AK',
      recipientName: 'Vikram Patel',
      recipientInitials: 'VP',
      recipientBg: 'bg-teal-600',
      badge: '🌟 Above & Beyond',
      message: 'Huge appreciation for turning around the semester audit report in under 24 hours ahead of the dean meeting!',
      claps: 14,
      createdAt: '2 hours ago',
    },
    {
      id: 'kd-2',
      senderName: 'Maya Lin',
      senderInitials: 'ML',
      recipientName: 'Priya Sharma',
      recipientInitials: 'PS',
      recipientBg: 'bg-emerald-600',
      badge: '🛠️ Code Wizard',
      message: 'Integrated the real-time registration websocket flawlessly for our live hackathon portal!',
      claps: 19,
      createdAt: 'Yesterday',
    },
    {
      id: 'kd-3',
      senderName: 'Rohan Mehta',
      senderInitials: 'RM',
      recipientName: 'Maya Lin',
      recipientInitials: 'ML',
      recipientBg: 'bg-amber-600',
      badge: '💡 Creative Genius',
      message: 'The new branding deck and 3D event key art looks incredible! Sponsors are raving about the deck.',
      claps: 11,
      createdAt: '3 days ago',
    },
  ]);

  const [isSendOpen, setIsSendOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(members[1]?.id || '');
  const [badge, setBadge] = useState('🌟 Above & Beyond');
  const [message, setMessage] = useState('');

  const badges = [
    '🌟 Above & Beyond',
    '🛠️ Code Wizard',
    '💡 Creative Genius',
    '🚀 Speed Demon',
    '🤝 True Team Player',
    '❤️ Lifesaver',
  ];

  const handleClap = (id: string) => {
    setKudosList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, claps: k.claps + 1 } : k))
    );
  };

  const handleSendKudos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const recipient = members.find((m) => m.id === recipientId) || members[0];
    const newKudos: KudosItem = {
      id: `kd-${Date.now()}`,
      senderName: currentUser.name,
      senderInitials: currentUser.avatarInitials,
      recipientName: recipient.name,
      recipientInitials: recipient.avatarInitials,
      recipientBg: recipient.avatarBg,
      badge,
      message: message.trim(),
      claps: 1,
      createdAt: 'Just now',
    };

    setKudosList([newKudos, ...kudosList]);
    setIsSendOpen(false);
    setMessage('');
    showToast('Kudos Sent!', `Recognition posted for ${recipient.name}.`, 'success');
  };

  return (
    <div id="kudos-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Peer Recognition & Kudos
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Team Culture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Celebrate exceptional contributions, late-night heroics, and collaborative breakthroughs.
          </p>
        </div>

        <button
          onClick={() => setIsSendOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Send Team Kudos</span>
        </button>
      </div>

      {/* Kudos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kudosList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badge & timestamp */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                  {item.badge}
                </span>
                <span className="text-[10px] text-slate-400">{item.createdAt}</span>
              </div>

              {/* Recipient info */}
              <div className="flex items-center gap-3 my-2">
                <UserAvatar
                  initials={item.recipientInitials}
                  size="md"
                  bgClass={item.recipientBg}
                />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Awarded To</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.recipientName}
                  </h3>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                "{item.message}"
              </p>
            </div>

            {/* Sender and Clap button */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                From <strong>{item.senderName}</strong>
              </span>

              <button
                onClick={() => handleClap(item.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                <span>👏</span>
                <span className="text-[11px] font-bold">{item.claps}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Send Kudos Modal */}
      {isSendOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsSendOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Send Kudos to Teammate
              </h3>
              <button onClick={() => setIsSendOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendKudos} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient *
                </label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recognition Badge *
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {badges.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Personal Shoutout Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What awesome contribution or support did they deliver?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSendOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Shoutout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
