'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'default', size = 'md', className, icon }: BadgeProps) {
  const variants = {
    default: 'bg-healthcare-100 text-healthcare-700 border-healthcare-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-danger-50 text-danger-700 border-danger-200',
    info: 'bg-primary-50 text-primary-700 border-primary-200',
    outline: 'bg-transparent text-healthcare-600 border-healthcare-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function RiskBadge({ level }: { level: 'low' | 'moderate' | 'high' }) {
  const config = {
    low: { label: 'Low Risk', variant: 'success' as const, icon: '✓' },
    moderate: { label: 'Moderate Risk', variant: 'warning' as const, icon: '⚡' },
    high: { label: 'High Risk', variant: 'danger' as const, icon: '⚠' },
  };

  const { label, variant, icon } = config[level];

  return (
    <Badge variant={variant} icon={<span>{icon}</span>}>
      {label}
    </Badge>
  );
}
