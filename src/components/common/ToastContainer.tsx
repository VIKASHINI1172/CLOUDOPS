import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspace();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notifications-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
        };

        const borderStyles = {
          success: 'border-emerald-200 dark:border-emerald-800/80',
          info: 'border-indigo-200 dark:border-indigo-800/80',
          warning: 'border-amber-200 dark:border-amber-800/80',
          error: 'border-rose-200 dark:border-rose-800/80',
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg bg-white dark:bg-slate-900 border text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200 ${borderStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              id={`close-toast-${toast.id}`}
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
