'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PatientSelector } from '@/components/dashboard/PatientSelector';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Loading, LoadingDashboard } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getPersonas, analyzePersona, getHealthMapData, getModelInfo } from '@/lib/api';
import type { PersonaSummary, AnalysisResult, HealthMapData, ModelInfo } from '@/types';
import { AlertTriangle, RefreshCw, Server, X } from 'lucide-react';

export default function Home() {
  const [personas, setPersonas] = useState<PersonaSummary[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [healthMapData, setHealthMapData] = useState<HealthMapData | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [personasData, healthMap] = await Promise.all([
        getPersonas(),
        getHealthMapData(),
      ]);

      setPersonas(personasData);
      setHealthMapData(healthMap);

      if (personasData.length > 0) {
        await handlePersonaSelect(personasData[0].id);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Unable to connect to the MetaboLens backend. Please ensure the server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = async (personaId: string) => {
    try {
      setAnalyzing(true);
      setError(null);
      setSelectedPersonaId(personaId);

      const analysis = await analyzePersona(personaId);
      setAnalysisResult(analysis);
    } catch (err) {
      console.error('Error analyzing persona:', err);
      setError('Failed to analyze patient data. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleModelInfoClick = async () => {
    if (!modelInfo) {
      try {
        const info = await getModelInfo();
        setModelInfo(info);
      } catch (err) {
        console.error('Failed to load model info:', err);
      }
    }
    setShowModelInfo(true);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loading size="lg" text="Initializing MetaboLens..." />
            <p className="text-sm text-healthcare-400 mt-4">
              Loading patient profiles and health map data
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error && !analysisResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center">
            <div className="p-8">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8 text-danger-600" />
              </div>
              <h2 className="text-xl font-bold text-healthcare-900 mb-2">Connection Error</h2>
              <p className="text-healthcare-500 mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={loadInitialData} leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Retry Connection
                </Button>
                <p className="text-xs text-healthcare-400">
                  Make sure the backend is running: <code className="bg-healthcare-100 px-2 py-1 rounded">uvicorn app.main:app --port 8000</code>
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-healthcare-50 via-white to-primary-50/30">
      <Header onModelInfoClick={handleModelInfoClick} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-healthcare-900 mb-2">
              Metabolic Health Dashboard
            </h1>
            <p className="text-healthcare-500">
              AI-powered analysis of biomarker data using multi-modal contrastive learning
            </p>
          </div>

          {/* Patient Selector */}
          <div className="mb-8">
            <PatientSelector
              personas={personas}
              selectedId={selectedPersonaId}
              onSelect={handlePersonaSelect}
              disabled={analyzing}
            />
          </div>

          {/* Analysis Loading */}
          {analyzing && (
            <div className="mb-8">
              <LoadingDashboard />
            </div>
          )}

          {/* Error Banner */}
          {error && analysisResult && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
              <p className="text-danger-700 flex-1">{error}</p>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </div>
          )}

          {/* Dashboard */}
          {analysisResult && !analyzing && (
            <Dashboard
              analysis={analysisResult}
              healthMapData={healthMapData}
              selectedPersona={personas.find((p) => p.id === selectedPersonaId)}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Model Info Modal */}
      {showModelInfo && modelInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-healthcare-900">Model Information</h2>
                <button
                  onClick={() => setShowModelInfo(false)}
                  className="p-2 hover:bg-healthcare-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-healthcare-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Model Type" value={modelInfo.model_type} />
                <InfoItem label="Training Samples" value={modelInfo.training_samples} />
                <InfoItem label="Silhouette Score" value={modelInfo.silhouette_score.toFixed(3)} />
                <InfoItem label="Number of Clusters" value={String(modelInfo.num_clusters)} />
                <InfoItem
                  label="Input Features"
                  value={`${modelInfo.input_features.total} (${modelInfo.input_features.cytokines} cytokines + ${modelInfo.input_features.clinical_markers} clinical)`}
                />
                <InfoItem
                  label="Embedding Dimensions"
                  value={`${modelInfo.embedding_dim_original} → ${modelInfo.embedding_dim_final}`}
                />
                <InfoItem label="Clustering Method" value={modelInfo.clustering_method} />
                <InfoItem label="Preprocessing" value={modelInfo.preprocessing_method} />
              </div>

              <div className="mt-6 pt-6 border-t border-healthcare-100">
                <h3 className="font-semibold text-healthcare-900 mb-2">Validated Pathways</h3>
                <div className="flex flex-wrap gap-2">
                  {modelInfo.validated_pathways.map((pathway) => (
                    <span
                      key={pathway}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                    >
                      {pathway}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-healthcare-100">
                <h3 className="font-semibold text-healthcare-900 mb-2">Limitations</h3>
                <ul className="space-y-1">
                  {modelInfo.limitations.map((limitation, i) => (
                    <li key={i} className="text-sm text-healthcare-600 flex items-start gap-2">
                      <span className="text-warning-500 mt-0.5">•</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-healthcare-500 mb-1">{label}</p>
      <p className="font-medium text-healthcare-900">{value}</p>
    </div>
  );
}
