"""
Pydantic models for MetaboLens API
"""
from datetime import datetime
from typing import List, Optional, Tuple
from pydantic import BaseModel, Field


class BiomarkerPanel(BaseModel):
    """Collection of 103 cytokine measurements and 14 clinical markers"""
    cytokines: List[float] = Field(..., min_length=103, max_length=103)
    clinical_markers: List[float] = Field(..., min_length=14, max_length=14)
    timestamp: Optional[datetime] = None
    patient_id: Optional[str] = None

    def to_array(self) -> List[float]:
        """Concatenates into single array (117 features)"""
        return self.cytokines + self.clinical_markers


class Embedding(BaseModel):
    """128-dimensional vector representation of patient health state"""
    vector: List[float] = Field(..., min_length=64, max_length=256)
    timestamp: Optional[datetime] = None
    patient_id: Optional[str] = None
    health_map_position: Optional[Tuple[float, float]] = None


class ClusterAssignment(BaseModel):
    """Health state cluster assignment result"""
    cluster_id: int
    cluster_name: str
    confidence: float = Field(..., ge=0, le=1)
    description: str
    is_healthy: bool


class RiskScore(BaseModel):
    """Disease progression risk assessment"""
    value: float = Field(..., ge=0, le=1)
    level: str  # "low", "moderate", "high"
    confidence_interval: Tuple[float, float]
    contributing_factors: List[str] = []

    @staticmethod
    def get_level(value: float) -> str:
        """Maps value to risk level"""
        if value <= 0.33:
            return "low"
        elif value <= 0.66:
            return "moderate"
        return "high"


class RiskFactor(BaseModel):
    """Individual biomarker contributing to health state"""
    biomarker_name: str
    shap_value: float
    impact_score: float = Field(..., ge=0, le=100)
    direction: str  # "elevated", "reduced"
    explanation: str
    reference_range: Optional[Tuple[float, float]] = None


class Intervention(BaseModel):
    """Actionable recommendation based on discriminative biomarkers"""
    priority: int
    intervention_text: str
    rationale: str
    target_biomarkers: List[str]
    evidence_level: str = "research"


class HealthMapPoint(BaseModel):
    """Single point on the health map visualization"""
    x: float
    y: float
    cluster_id: int
    is_healthy: bool
    sample_id: Optional[str] = None


class HealthMapData(BaseModel):
    """Reference health map data for visualization"""
    reference_points: List[HealthMapPoint]
    cluster_info: dict
    healthy_clusters: List[int]
    at_risk_clusters: List[int]


class TemporalPoint(BaseModel):
    """Single timepoint in temporal analysis"""
    timestamp: datetime
    embedding: Embedding
    health_map_position: Tuple[float, float]
    cluster: ClusterAssignment
    risk_score: RiskScore


class TemporalAnalysis(BaseModel):
    """Analysis of health state changes over time"""
    timepoints: List[TemporalPoint]
    velocity: float
    direction: str  # "improving", "stable", "declining"
    trend_analysis: str


class PersonaSummary(BaseModel):
    """Summary info for persona listing"""
    id: str
    name: str
    description: str
    health_state: str


class Persona(BaseModel):
    """Representative patient story for demonstration"""
    id: str
    name: str
    description: str
    health_state: str
    biomarkers: BiomarkerPanel
    embedding: Embedding
    cluster: ClusterAssignment
    risk_score: RiskScore
    history: List[TemporalPoint] = []


class AnalysisRequest(BaseModel):
    """Request body for analysis endpoint"""
    biomarkers: BiomarkerPanel
    patient_id: Optional[str] = None
    timestamp: Optional[datetime] = None


class AnalysisResult(BaseModel):
    """Complete health analysis result"""
    embedding: Embedding
    cluster: ClusterAssignment
    risk_score: RiskScore
    top_risk_factors: List[RiskFactor]
    recommendations: List[Intervention]
    health_map_position: Tuple[float, float]
    data_source_label: str = "Synthetic/Research Data"
    disclaimer: str = "This is a research prototype. Results require clinical validation."


class ReportRequest(BaseModel):
    """Request body for report generation"""
    analysis_result: AnalysisResult
    patient_name: Optional[str] = "Demo Patient"
    patient_id: Optional[str] = None
    include_temporal: bool = False
    temporal_data: Optional[TemporalAnalysis] = None


class ReportResponse(BaseModel):
    """Response from report generation"""
    report_url: str
    generated_at: datetime
