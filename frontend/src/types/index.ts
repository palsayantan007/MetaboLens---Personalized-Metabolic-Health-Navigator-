// API Types for MetaboLens

export interface BiomarkerPanel {
  cytokines: number[];
  clinical_markers: number[];
  timestamp?: string;
  patient_id?: string;
}

export interface Embedding {
  vector: number[];
  timestamp?: string;
  patient_id?: string;
  health_map_position?: [number, number];
}

export interface ClusterAssignment {
  cluster_id: number;
  cluster_name: string;
  confidence: number;
  description: string;
  is_healthy: boolean;
}

export interface RiskScore {
  value: number;
  level: 'low' | 'moderate' | 'high';
  confidence_interval: [number, number];
  contributing_factors: string[];
}

export interface RiskFactor {
  biomarker_name: string;
  shap_value: number;
  impact_score: number;
  direction: 'elevated' | 'reduced';
  explanation: string;
  reference_range?: [number, number];
}

export interface Intervention {
  priority: number;
  intervention_text: string;
  rationale: string;
  target_biomarkers: string[];
  evidence_level: string;
}

export interface HealthMapPoint {
  x: number;
  y: number;
  cluster_id: number;
  is_healthy: boolean;
  sample_id?: string;
}

export interface HealthMapData {
  reference_points: HealthMapPoint[];
  cluster_info: Record<string, ClusterInfo>;
  healthy_clusters: number[];
  at_risk_clusters: number[];
}

export interface ClusterInfo {
  name: string;
  description: string;
  is_healthy: boolean;
  health_state: string;
}

export interface TemporalPoint {
  timestamp: string;
  embedding: Embedding;
  health_map_position: [number, number];
  cluster: ClusterAssignment;
  risk_score: RiskScore;
}

export interface TemporalAnalysis {
  timepoints: TemporalPoint[];
  velocity: number;
  direction: 'improving' | 'stable' | 'declining';
  trend_analysis: string;
}

export interface PersonaSummary {
  id: string;
  name: string;
  description: string;
  health_state: string;
}

export interface Persona extends PersonaSummary {
  biomarkers: BiomarkerPanel;
  embedding: Embedding;
  cluster: ClusterAssignment;
  risk_score: RiskScore;
  history: TemporalPoint[];
}

export interface AnalysisResult {
  embedding: Embedding;
  cluster: ClusterAssignment;
  risk_score: RiskScore;
  top_risk_factors: RiskFactor[];
  recommendations: Intervention[];
  health_map_position: [number, number];
  data_source_label: string;
  disclaimer: string;
}

export interface ModelInfo {
  model_type: string;
  training_samples: string;
  silhouette_score: number;
  validation_silhouette: number;
  num_clusters: number;
  embedding_dim_original: number;
  embedding_dim_final: number;
  preprocessing_method: string;
  clustering_method: string;
  input_features: {
    cytokines: number;
    clinical_markers: number;
    total: number;
  };
  validated_pathways: string[];
  data_sources: string[];
  limitations: string[];
}
