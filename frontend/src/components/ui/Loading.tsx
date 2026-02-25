'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
      {text && <p className="text-sm text-healthcare-500 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-2xl border border-healthcare-100 shadow-soft p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-healthcare-100 rounded-xl" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-healthcare-100 rounded" />
          <div className="h-3 w-24 bg-healthcare-100 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-healthcare-100 rounded" />
        <div className="h-3 w-3/4 bg-healthcare-100 rounded" />
        <div className="h-3 w-1/2 bg-healthcare-100 rounded" />
      </div>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
}
