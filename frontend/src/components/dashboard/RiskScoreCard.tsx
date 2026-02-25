'use client';

import { RiskScore } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/Progress';
import { RiskBadge } from '@/components/ui/Badge';
import { cn, getRiskColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, ShieldAlert } from 'lucide-react';

interface RiskScoreCardProps {
  riskScore: RiskScore;
}

export function RiskScoreCard({ riskScore }: RiskScoreCardProps) {
  const percentage = riskScore.value * 100;
  const variant = riskScore.level === 'low' ? 'success' : riskScore.level === 'moderate' ? 'warning' : 'danger';

  const getIcon = () => {
    switch (riskScore.level) {
      case 'low':
        return <ShieldCheck className="w-5 h-5" />;
      case 'moderate':
        return <TrendingUp className="w-5 h-5" />;
      case 'high':
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  const getMessage = () => {
    switch (riskScore.level) {
      case 'low':
        return 'Your metabolic health indicators are within optimal ranges.';
      case 'moderate':
        return 'Some markers suggest early metabolic changes requiring attention.';
      case 'high':
        return 'Multiple risk factors detected. Clinical consultation recommended.';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className={cn(
          'absolute inset-0 opacity-5',
          riskScore.level === 'low' && 'bg-gradient-to-br from-success-500 to-success-600',
          riskScore.level === 'moderate' && 'bg-gradient-to-br from-warning-500 to-warning-600',
          riskScore.level === 'high' && 'bg-gradient-to-br from-danger-500 to-danger-600'
        )}
      />

      <div className="relative p-6">
        <CardHeader
          title="Risk Assessment"
          subtitle="Disease progression probability"
          icon={getIcon()}
        />

        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <CircularProgress
            value={percentage}
            size={140}
            strokeWidth={12}
            variant={variant}
          />

          {/* Details */}
          <div className="flex-1 space-y-4">
            {/* Risk Badge */}
            <RiskBadge level={riskScore.level} />

            {/* Message */}
            <p className="text-sm text-healthcare-600">{getMessage()}</p>

            {/* Confidence Interval */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-healthcare-500">Confidence Range</span>
                <span className="font-medium text-healthcare-700">
                  {(riskScore.confidence_interval[0] * 100).toFixed(0)}% – {(riskScore.confidence_interval[1] * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative h-2 bg-healthcare-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'absolute h-full rounded-full',
                    riskScore.level === 'low' && 'bg-success-200',
                    riskScore.level === 'moderate' && 'bg-warning-200',
                    riskScore.level === 'high' && 'bg-danger-200'
                  )}
                  style={{
                    left: `${riskScore.confidence_interval[0] * 100}%`,
                    width: `${(riskScore.confidence_interval[1] - riskScore.confidence_interval[0]) * 100}%`,
                  }}
                />
                <div
                  className="absolute w-1 h-full bg-healthcare-900 rounded-full"
                  style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
