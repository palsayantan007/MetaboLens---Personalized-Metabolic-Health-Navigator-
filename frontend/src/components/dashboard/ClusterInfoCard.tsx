'use client';

import { ClusterAssignment } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ClusterInfoCardProps {
  cluster: ClusterAssignment;
}

export function ClusterInfoCard({ cluster }: ClusterInfoCardProps) {
  return (
    <Card className="h-full">
      <div className="p-6">
        <CardHeader
          title="Health Classification"
          subtitle="AI-determined metabolic state"
          icon={<Layers className="w-5 h-5" />}
        />

        {/* Cluster Name & Status */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center',
            cluster.is_healthy ? 'bg-success-100' : 'bg-warning-100'
          )}>
            {cluster.is_healthy ? (
              <CheckCircle2 className="w-6 h-6 text-success-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-warning-600" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-healthcare-900">{cluster.cluster_name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={cluster.is_healthy ? 'success' : 'warning'} size="sm">
                Cluster #{cluster.cluster_id}
              </Badge>
              <Badge variant={cluster.is_healthy ? 'success' : 'warning'} size="sm">
                {cluster.is_healthy ? 'Healthy State' : 'Requires Attention'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-healthcare-600 mb-4 leading-relaxed">
          {cluster.description}
        </p>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-healthcare-500">Classification Confidence</span>
            <span className="text-sm font-semibold text-primary-600">
              {(cluster.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <Progress
            value={cluster.confidence * 100}
            variant="default"
            size="md"
          />
          <p className="text-xs text-healthcare-400">
            Based on similarity to {cluster.cluster_id === 0 ? 'healthy baseline' : 'known patterns'} in training data
          </p>
        </div>
      </div>
    </Card>
  );
}
