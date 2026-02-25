'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    default: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-healthcare-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-healthcare-500">
          <span>{value.toFixed(1)}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  variant = 'default',
  showLabel = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-healthcare-900">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}
