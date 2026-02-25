'use client';

import { useState } from 'react';
import { RiskFactor } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface RiskFactorPanelProps {
  riskFactors: RiskFactor[];
}

export function RiskFactorPanel({ riskFactors }: RiskFactorPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayFactors = showAll ? riskFactors : riskFactors.slice(0, 5);
  const maxImpact = Math.max(...riskFactors.map(f => f.impact_score), 1);

  return (
    <Card className="h-full">
      <div className="p-6">
        <CardHeader
          title="Key Risk Factors"
          subtitle="Biomarkers with highest impact on your health state"
          icon={<BarChart3 className="w-5 h-5" />}
          action={
            <Badge variant="info" size="sm">
              SHAP Analysis
            </Badge>
          }
        />

        <div className="space-y-3">
          {displayFactors.map((factor, index) => {
            const isExpanded = expandedIndex === index;
            const isElevated = factor.direction === 'elevated';

            return (
              <div
                key={factor.biomarker_name}
                className={cn(
                  'rounded-xl border transition-all duration-200',
                  isElevated ? 'border-danger-200 bg-danger-50/30' : 'border-primary-200 bg-primary-50/30',
                  isExpanded && 'shadow-md'
                )}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-healthcare-400">#{index + 1}</span>
                      <span className="font-semibold text-healthcare-900">{factor.biomarker_name}</span>
                      <Badge
                        variant={isElevated ? 'danger' : 'info'}
                        size="sm"
                        icon={isElevated ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      >
                        {factor.direction}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-healthcare-700">
                        {factor.impact_score.toFixed(1)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-healthcare-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-healthcare-400" />
                      )}
                    </div>
                  </div>

                  {/* Impact Bar */}
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isElevated ? 'bg-danger-400' : 'bg-primary-400'
                      )}
                      style={{ width: `${(factor.impact_score / maxImpact) * 100}%` }}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-healthcare-100 mt-2">
                    <div className="pt-3 space-y-3">
                      <p className="text-sm text-healthcare-600">{factor.explanation}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-healthcare-500">
                        <div className="flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          <span>SHAP Value: {factor.shap_value.toFixed(4)}</span>
                        </div>
                        {factor.reference_range && (
                          <div>
                            Reference: {factor.reference_range[0]} – {factor.reference_range[1]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show More/Less */}
        {riskFactors.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All ${riskFactors.length} Factors`}
          </button>
        )}
      </div>
    </Card>
  );
}
