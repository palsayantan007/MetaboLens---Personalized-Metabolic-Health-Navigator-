import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRiskColor(level: 'low' | 'moderate' | 'high'): string {
  const colors = {
    low: '#10b981',
    moderate: '#f59e0b',
    high: '#ef4444',
  };
  return colors[level];
}

export function getRiskGradient(level: 'low' | 'moderate' | 'high'): string {
  const gradients = {
    low: 'from-success-500 to-success-600',
    moderate: 'from-warning-500 to-warning-600',
    high: 'from-danger-500 to-danger-600',
  };
  return gradients[level];
}
