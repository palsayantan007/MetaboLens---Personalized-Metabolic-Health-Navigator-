'use client';

import { useState } from 'react';
import { Intervention } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  ChevronRight, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: Intervention[];
}

const priorityConfig: Record<number, {
  label: string;
  variant: 'danger' | 'warning' | 'info' | 'default';
  icon: React.ReactNode;
}> = {
  1: { label: 'High Priority', variant: 'danger', icon: <Zap className="w-4 h-4" /> },
  2: { label: 'Recommended', variant: 'warning', icon: <Target className="w-4 h-4" /> },
  3: { label: 'Consider', variant: 'info', icon: <Clock className="w-4 h-4" /> },
  4: { label: 'Optional', variant: 'default', icon: <CheckCircle className="w-4 h-4" /> },
};

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <Card>
      <div className="p-6">
        <CardHeader
          title="Personalized Recommendations"
          subtitle="AI-generated intervention suggestions based on your biomarker profile"
          icon={<Lightbulb className="w-5 h-5" />}
          action={
            <span className="text-sm text-healthcare-400">
              {recommendations.length} recommendations
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => {
            const config = priorityConfig[rec.priority] || priorityConfig[4];
            const isExpanded = expandedId === index;

            return (
              <div
                key={index}
                className={cn(
                  'group rounded-2xl border border-healthcare-200 bg-white transition-all duration-200',
                  'hover:shadow-md hover:border-healthcare-300',
                  isExpanded && 'ring-2 ring-primary-500 border-primary-300'
                )}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : index)}
                  className="w-full p-5 text-left"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={config.variant} size="sm" icon={config.icon}>
                      {config.label}
                    </Badge>
                    <span className="text-xs text-healthcare-400">#{index + 1}</span>
                  </div>

                  {/* Intervention Text */}
                  <h4 className="font-semibold text-healthcare-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {rec.intervention_text}
                  </h4>

                  {/* Target Biomarkers */}
                  {rec.target_biomarkers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rec.target_biomarkers.slice(0, 3).map((biomarker) => (
                        <span
                          key={biomarker}
                          className="px-2 py-0.5 text-xs bg-healthcare-100 text-healthcare-600 rounded-md"
                        >
                          {biomarker}
                        </span>
                      ))}
                      {rec.target_biomarkers.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-healthcare-100 text-healthcare-600 rounded-md">
                          +{rec.target_biomarkers.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expand Indicator */}
                  <div className="flex items-center text-sm text-primary-600 font-medium">
                    <span>{isExpanded ? 'Show less' : 'Learn more'}</span>
                    <ChevronRight className={cn(
                      'w-4 h-4 ml-1 transition-transform',
                      isExpanded && 'rotate-90'
                    )} />
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-healthcare-100">
                    <div className="pt-4 space-y-3">
                      <div>
                        <h5 className="text-xs font-semibold text-healthcare-500 uppercase tracking-wider mb-1">
                          Rationale
                        </h5>
                        <p className="text-sm text-healthcare-600">{rec.rationale}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-healthcare-400">
                        <span>Evidence Level:</span>
                        <Badge variant="outline" size="sm">{rec.evidence_level}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-warning-50 rounded-xl border border-warning-200">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning-800">Important Notice</p>
              <p className="text-sm text-warning-700 mt-1">
                These recommendations are generated by an AI research prototype and are not medical advice. 
                Always consult with qualified healthcare professionals before making changes to your health regimen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
