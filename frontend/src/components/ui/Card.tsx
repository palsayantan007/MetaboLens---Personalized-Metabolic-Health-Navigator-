'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-healthcare-100 shadow-soft',
        hover && 'transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer',
        paddingSizes[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-healthcare-900">{title}</h3>
          {subtitle && <p className="text-sm text-healthcare-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
