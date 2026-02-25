import axios from 'axios';
import type {
  AnalysisResult,
  PersonaSummary,
  Persona,
  HealthMapData,
  TemporalAnalysis,
  ModelInfo,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const response = await api.get('/health');
  return response.data;
}

export async function analyzePersona(personaId: string): Promise<AnalysisResult> {
  const response = await api.get(`/personas/${personaId}/analysis`);
  return response.data;
}

export async function getPersonas(): Promise<PersonaSummary[]> {
  const response = await api.get('/personas');
  return response.data;
}

export async function getPersona(personaId: string): Promise<Persona> {
  const response = await api.get(`/personas/${personaId}`);
  return response.data;
}

export async function getHealthMapData(): Promise<HealthMapData> {
  const response = await api.get('/health-map');
  return response.data;
}

export async function getTemporalAnalysis(personaId: string): Promise<TemporalAnalysis> {
  const response = await api.post(`/temporal-analysis?persona_id=${personaId}`);
  return response.data;
}

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await api.get('/model-info');
  return response.data;
}

export async function generateReport(analysisResult: AnalysisResult, patientName?: string): Promise<Blob> {
  const response = await api.post('/reports/generate', {
    analysis_result: analysisResult,
    patient_name: patientName || 'Demo Patient',
  }, {
    responseType: 'blob',
  });
  return response.data;
}
