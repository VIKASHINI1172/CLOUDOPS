import React from 'react';
import { UserStatus } from '../../types';

interface UserAvatarProps {
  initials: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bgClass?: string;
  status?: UserStatus;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  initials,
  name,
  size = 'md',
  bgClass = 'bg-indigo-600',
  status,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm font-medium',
    lg: 'w-11 h-11 text-base font-semibold',
    xl: 'w-16 h-16 text-xl font-bold',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  const statusColorClasses: Record<UserStatus, string> = {
    Online: 'bg-emerald-500',
    Focusing: 'bg-purple-500',
    'In a meeting': 'bg-amber-500',
    Away: 'bg-yellow-400',
    Offline: 'bg-slate-400',
  };

  return (
    <div
      id={name ? `avatar-${name.toLowerCase().replace(/\s+/g, '-')}` : undefined}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full text-white font-medium select-none shadow-xs ${bgClass} ${sizeClasses[size]} ${className}`}
      title={name || initials}
    >
      {initials}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-900 ${statusSizeClasses[size]} ${statusColorClasses[status]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
