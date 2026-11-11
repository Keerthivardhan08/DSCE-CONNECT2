import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  roleIcon?: React.ReactNode;
}

const COLOR_PALETTE = [
  'from-indigo-600 to-indigo-700',
  'from-violet-600 to-purple-700',
  'from-pink-600 to-rose-700',
  'from-cyan-600 to-teal-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-blue-600 to-indigo-700',
  'from-rose-600 to-red-700'
];

function getInitials(name: string): string {
  if (!name) return 'U';
  const clean = name.replace(/\(.*?\)/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradientFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 'md',
  color,
  className = '',
  roleIcon
}) => {
  const initials = getInitials(name);
  const gradient = getGradientFromName(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-lg font-extrabold',
    xl: 'w-20 h-20 text-2xl font-black'
  }[size];

  return (
    <div
      className={`relative rounded-2xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 select-none bg-gradient-to-tr ${gradient} ${sizeClasses} ${className}`}
      style={color ? { backgroundColor: color } : undefined}
      title={name}
    >
      <span>{initials}</span>
      {roleIcon && (
        <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm text-slate-800 dark:text-slate-100">
          {roleIcon}
        </span>
      )}
    </div>
  );
};
