'use client';

import { useState } from 'react';
import { AnalysisResult, HealthMapData, PersonaSummary } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskScoreCard } from './RiskScoreCard';
import { ClusterInfoCard } from './ClusterInfoCard';
import { RiskFactorPanel } from './RiskFactorPanel';
import { RecommendationsPanel } from './RecommendationsPanel';
import { HealthMapVisualizer } from '@/components/charts/HealthMapVisualizer';
import { generateReport } from '@/lib/api';
import { 
  FileText, 
  Download, 
  Share2, 
  Printer,
  Activity,
  Brain,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  analysis: AnalysisResult;
  healthMapData: HealthMapData | null;
  selectedPersona?: PersonaSummary;
}

export function Dashboard({ analysis, healthMapData, selectedPersona }: DashboardProps) {
  const [exportingPdf, setExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      const blob = await generateReport(analysis, selectedPersona?.name);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `metabolens_report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score - Takes more space */}
        <div className="lg:col-span-5">
          <RiskScoreCard riskScore={analysis.risk_score} />
        </div>

        {/* Cluster Info */}
        <div className="lg:col-span-4">
          <ClusterInfoCard cluster={analysis.cluster} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <div className="p-6 flex flex-col h-full">
              <CardHeader
                title="Actions"
                subtitle="Export & share results"
                icon={<FileText className="w-5 h-5" />}
              />

              <div className="flex-1 flex flex-col justify-center space-y-3">
                <Button
                  onClick={handleExportPdf}
                  isLoading={exportingPdf}
                  leftIcon={<Download className="w-4 h-4" />}
                  className="w-full"
                >
                  Download PDF Report
                </Button>
                
                <Button
                  variant="secondary"
                  leftIcon={<Printer className="w-4 h-4" />}
                  className="w-full"
                  onClick={() => window.print()}
                >
                  Print Summary
                </Button>

                <Button
                  variant="ghost"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  className="w-full"
                >
                  Share with Provider
                </Button>
              </div>

              <p className="text-xs text-healthcare-400 text-center mt-3">
                Generates clinician-ready reports
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Analysis Insights Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">AI Analysis Complete</h3>
            <p className="text-primary-100 text-sm mt-1">
              Analyzed 117 biomarkers across cytokine and clinical profiles. 
              {analysis.top_risk_factors.length} key factors identified.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">103</div>
              <div className="text-primary-200 text-xs">Cytokines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">14</div>
              <div className="text-primary-200 text-xs">Clinical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.recommendations.length}</div>
              <div className="text-primary-200 text-xs">Recommendations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Health Map */}
        {healthMapData && (
          <HealthMapVisualizer
            healthMapData={healthMapData}
            patientPosition={analysis.health_map_position}
            clusterId={analysis.cluster.cluster_id}
          />
        )}

        {/* Risk Factors */}
        <RiskFactorPanel riskFactors={analysis.top_risk_factors} />
      </div>

      {/* Recommendations - Full Width */}
      <RecommendationsPanel recommendations={analysis.recommendations} />

      {/* Technical Details Footer */}
      <Card className="bg-healthcare-50/50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-healthcare-900">Analysis Details</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-healthcare-500 mb-1">Embedding Dimensions</p>
              <p className="font-medium text-healthcare-800">64-D (UMAP reduced)</p>
            </div>
            <div>
              <p className="text-healthcare-500 mb-1">Clustering Method</p>
              <p className="font-medium text-healthcare-800">HDBSCAN</p>
            </div>
            <div>
              <p className="text-healthcare-500 mb-1">Explainability</p>
              <p className="font-medium text-healthcare-800">SHAP Values</p>
            </div>
            <div>
              <p className="text-healthcare-500 mb-1">Data Source</p>
              <p className="font-medium text-healthcare-800">{analysis.data_source_label}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
