import React, { useState } from 'react';
import {
  Copy,
  Sparkles,
  CheckCircle2,
  Layers,
  Calendar,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface OperationalTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedDuration: string;
  deliverablesCount: number;
  items: string[];
}

export const TemplatesPage: React.FC = () => {
  const { createTask, showToast, currentUser } = useWorkspace();
  const [instantiatingId, setInstantiatingId] = useState<string | null>(null);

  const templates: OperationalTemplate[] = [
    {
      id: 'tpl-1',
      title: 'Hackathon Organization Sprint',
      category: 'Events',
      description: 'End-to-end blueprint for managing a 48-hour student hackathon, from venue security to sponsor swag.',
      estimatedDuration: '6 Weeks',
      deliverablesCount: 6,
      items: [
        'Secure campus auditorium permit & AV crew',
        'Launch registration portal & participant Discord',
        'Draft Tier 1 & 2 sponsorship prospectus deck',
        'Procure catering quotes for meals & midnight pizza',
        'Design participant lanyard badges & t-shirts',
        'Publish judging rubrics & mentor schedules',
      ],
    },
    {
      id: 'tpl-2',
      title: 'New Member Onboarding Kit',
      category: 'People & Culture',
      description: 'Streamlined induction checklist for new club recruits, assigning mentors and grant repository access.',
      estimatedDuration: '1 Week',
      deliverablesCount: 4,
      items: [
        'Invite new recruit to CloudOps Workspace & Slack',
        'Pair member with executive committee buddy',
        'Conduct 30-minute orientation briefing',
        'Assign first starter backlog task',
      ],
    },
    {
      id: 'tpl-3',
      title: 'Corporate Sponsorship Drive',
      category: 'Finance',
      description: 'Framework for outreach to technology companies, grant proposals, and contract sign-offs.',
      estimatedDuration: '3 Weeks',
      deliverablesCount: 4,
      items: [
        'Compile target company alumni list',
        'Send introductory email sequence with club deck',
        'Schedule discovery calls with campus recruiters',
        'Submit corporate invoices & tax receipt forms',
      ],
    },
    {
      id: 'tpl-4',
      title: 'Annual Executive Election Protocol',
      category: 'Governance',
      description: 'Democratic transition blueprint for electing new student president and vice presidents.',
      estimatedDuration: '2 Weeks',
      deliverablesCount: 5,
      items: [
        'Publish candidate nomination forms',
        'Review academic eligibility for applicants',
        'Host town hall debate in campus theater',
        'Run authenticated voting election poll',
        'Execute handover documentation & sign-off',
      ],
    },
  ];

  const handleInstantiate = async (template: OperationalTemplate) => {
    setInstantiatingId(template.id);
    await new Promise((res) => setTimeout(res, 600));

    // Create tasks from blueprint
    template.items.forEach((taskTitle, idx) => {
      createTask({
        title: `[${template.title.split(' ')[0]}] ${taskTitle}`,
        description: `Generated from ${template.title} template blueprint.`,
        status: 'To Do',
        priority: idx === 0 ? 'High' : 'Medium',
        assigneeId: currentUser.id,
        assigneeName: currentUser.name,
        assigneeInitials: currentUser.avatarInitials,
        dueDate: '2026-09-25',
        label: template.category,
      });
    });

    setInstantiatingId(null);
    showToast(
      'Blueprint Instantiated!',
      `${template.items.length} tasks generated and added to the Task Board.`,
      'success'
    );
  };

  return (
    <div id="templates-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Operational Templates
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Blueprints
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Turnkey playbooks to instantly bootstrap hackathons, sponsorships, and team recruitment.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => {
          const isBusy = instantiatingId === tpl.id;
          return (
            <div
              key={tpl.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-slate-400">Est. {tpl.estimatedDuration}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Checklist Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Included Deliverables ({tpl.items.length})
                  </span>
                  <div className="space-y-1.5">
                    {tpl.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  id={`btn-use-template-${tpl.id}`}
                  onClick={() => handleInstantiate(tpl)}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                  <span>{isBusy ? 'Instantiating Sprint...' : 'Instantiate Blueprint'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
