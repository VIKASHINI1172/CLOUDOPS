import React, { useState } from 'react';
import {
  Vote,
  Plus,
  CheckCircle,
  BarChart2,
  Users,
  X,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  creator: string;
  createdAt: string;
  status: 'Open' | 'Closed';
  options: PollOption[];
  votedUserIds: string[];
  userVoteId?: string;
}

export const PollsPage: React.FC = () => {
  const { currentUser, showToast } = useWorkspace();

  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 'poll-1',
      question: 'Which theme should we choose for the Fall 2026 Hackathon?',
      creator: 'Aisha Khan',
      createdAt: 'Yesterday',
      status: 'Open',
      votedUserIds: ['m-2', 'm-3'],
      options: [
        { id: 'opt-1', text: 'AI for Climate & Sustainability', votes: 12 },
        { id: 'opt-2', text: 'Next-Gen Autonomous Robotics', votes: 8 },
        { id: 'opt-3', text: 'Fintech & Decentralized Ledger Systems', votes: 5 },
      ],
    },
    {
      id: 'poll-2',
      question: 'Preferred day for weekly executive committee standup sync?',
      creator: 'Rohan Mehta',
      createdAt: '3 days ago',
      status: 'Open',
      votedUserIds: [],
      options: [
        { id: 'opt-a', text: 'Tuesdays at 18:00', votes: 7 },
        { id: 'opt-b', text: 'Wednesdays at 17:30', votes: 11 },
        { id: 'opt-c', text: 'Thursdays at 19:00', votes: 4 },
      ],
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');

  const handleVote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        if (p.votedUserIds.includes(currentUser.id)) {
          showToast('Already Voted', 'You have already recorded your vote in this poll.', 'info');
          return p;
        }
        showToast('Vote Counted', 'Your response has been registered!', 'success');
        return {
          ...p,
          votedUserIds: [...p.votedUserIds, currentUser.id],
          userVoteId: optionId,
          options: p.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      })
    );
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !option1.trim() || !option2.trim()) return;

    const opts: PollOption[] = [
      { id: `opt-${Date.now()}-1`, text: option1.trim(), votes: 0 },
      { id: `opt-${Date.now()}-2`, text: option2.trim(), votes: 0 },
    ];
    if (option3.trim()) {
      opts.push({ id: `opt-${Date.now()}-3`, text: option3.trim(), votes: 0 });
    }

    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question: question.trim(),
      creator: currentUser.name,
      createdAt: 'Just now',
      status: 'Open',
      votedUserIds: [],
      options: opts,
    };

    setPolls([newPoll, ...polls]);
    setIsCreateOpen(false);
    setQuestion('');
    setOption1('');
    setOption2('');
    setOption3('');
    showToast('Poll Launched', 'Team members can now cast their votes.', 'success');
  };

  return (
    <div id="polls-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Team Consensus & Polls
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {polls.length} active votes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Democratic decision-making for executive budgets, schedule selections, and club initiatives.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Consensus Poll</span>
        </button>
      </div>

      {/* Polls List */}
      <div className="space-y-5">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
          const hasVoted = poll.votedUserIds.includes(currentUser.id);

          return (
            <div
              key={poll.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {poll.status} Poll
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {poll.question}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Proposed by {poll.creator} • {poll.createdAt} • {totalVotes} total responses
                  </p>
                </div>

                {hasVoted && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" /> Voted
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="mt-4 space-y-3">
                {poll.options.map((opt) => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const isUserSelection = poll.userVoteId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !hasVoted && handleVote(poll.id, opt.id)}
                      className={`p-3 rounded-xl border transition-all ${
                        !hasVoted ? 'cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30' : ''
                      } ${
                        isUserSelection
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-800 dark:text-slate-200">{opt.text}</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {pct}% ({opt.votes})
                        </span>
                      </div>

                      {/* Percentage bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUserSelection ? 'bg-indigo-600' : 'bg-slate-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Poll Modal */}
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Poll</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Poll Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Which keynote speaker should we sponsor?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choice Option 1 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Option 1"
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choice Option 2 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Option 2"
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choice Option 3 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Option 3"
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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
                  Launch Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
