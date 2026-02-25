'use client';

import { cn } from '@/lib/utils';
import { PersonaSummary } from '@/types';
import { User, TrendingUp, Activity, AlertCircle, Heart } from 'lucide-react';

interface PatientSelectorProps {
  personas: PersonaSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const healthStateConfig: Record<string, {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}> = {
  healthy: {
    icon: <Heart className="w-5 h-5" />,
    color: 'text-success-600',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200 hover:border-success-300',
    label: 'Healthy',
  },
  'pre-diabetic': {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-warning-600',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-200 hover:border-warning-300',
    label: 'Pre-diabetic',
  },
  metabolic_syndrome: {
    icon: <Activity className="w-5 h-5" />,
    color: 'text-danger-600',
    bgColor: 'bg-danger-50',
    borderColor: 'border-danger-200 hover:border-danger-300',
    label: 'Metabolic Syndrome',
  },
  immune_dysregulation: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200 hover:border-orange-300',
    label: 'Immune Dysregulation',
  },
  improving: {
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200 hover:border-primary-300',
    label: 'Improving',
  },
};

export function PatientSelector({ personas, selectedId, onSelect, disabled }: PatientSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-healthcare-900">Select Patient Profile</h2>
          <p className="text-sm text-healthcare-500">
            Choose a demo patient to view their metabolic health analysis
          </p>
        </div>
        <span className="text-xs text-healthcare-400 bg-healthcare-100 px-3 py-1 rounded-full">
          {personas.length} profiles available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {personas.map((persona) => {
          const config = healthStateConfig[persona.health_state] || healthStateConfig.healthy;
          const isSelected = selectedId === persona.id;

          return (
            <button
              key={persona.id}
              onClick={() => onSelect(persona.id)}
              disabled={disabled}
              className={cn(
                'relative p-4 rounded-2xl border-2 text-left transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                config.borderColor,
                config.bgColor,
                isSelected && 'ring-2 ring-primary-500 ring-offset-2 border-primary-400',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
              )}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Avatar & Icon */}
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  'bg-white/80',
                  config.color
                )}>
                  {config.icon}
                </div>
                <div className={cn(
                  'w-8 h-8 rounded-full bg-gradient-to-br from-healthcare-200 to-healthcare-300',
                  'flex items-center justify-center text-healthcare-600'
                )}>
                  <User className="w-4 h-4" />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-healthcare-900 text-sm mb-1">{persona.name}</h3>
              <p className="text-xs text-healthcare-500 line-clamp-2 mb-3">{persona.description}</p>

              {/* Health State Badge */}
              <div className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                'bg-white/60',
                config.color
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {config.label}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-healthcare-400 text-center">
        All patient data is synthetically generated for demonstration purposes only
      </p>
    </div>
  );
}
