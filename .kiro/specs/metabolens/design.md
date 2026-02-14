# Design Document: MetaboLens - Personalized Metabolic Health Navigator

## Overview

MetaboLens is a web-based AI platform that transforms complex biomarker panels into actionable health insights. The system uses a pre-trained multi-modal contrastive learning model to generate 128-dimensional embeddings from patient biomarker data, then provides interpretable visualizations, risk assessments, and personalized recommendations.

The architecture follows a three-tier design:
1. **Backend API**: Python-based service handling model inference, data processing, and business logic
2. **Model Layer**: Pre-trained contrastive learning model with SHAP explainability
3. **Frontend UI**: React-based single-page application with interactive visualizations

The system is designed as a research prototype for hackathon demonstration, using only synthetic or publicly available data (NHANES dataset).

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │  Health Map  │  │   Reports    │     │
│  │  Component   │  │  Visualizer  │  │  Generator   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │ REST API
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (FastAPI)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Analysis   │  │  Embedding   │  │    Report    │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Model Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Contrastive  │  │    SHAP      │  │   HDBSCAN    │     │
│  │    Model     │  │  Explainer   │  │  Clustering  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Synthetic   │  │    NHANES    │  │   Persona    │     │
│  │    Data      │  │    Data      │  │    Store     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User inputs biomarker panel or selects demo persona
2. Frontend sends data to Backend API
3. Backend validates and normalizes biomarker data
4. Model Layer generates 128D embedding
5. SHAP explainer calculates feature importance
6. HDBSCAN assigns cluster and confidence score
7. Backend calculates risk score and generates recommendations
8. Frontend renders visualizations and explanations
9. Optional: Generate PDF report

### Technology Stack

**Backend:**
- Python 3.9+
- FastAPI for REST API
- PyTorch for model inference
- SHAP for explainability
- scikit-learn for clustering and preprocessing
- UMAP for dimensionality reduction
- ReportLab for PDF generation

**Frontend:**
- React 18+
- D3.js for Health Map visualization
- Recharts for temporal progression charts
- Tailwind CSS for styling
- Axios for API communication

**Model:**
- Pre-trained contrastive learning model (PyTorch)
- Input: 117 features (103 cytokines + 14 clinical markers)
- Output: 128-dimensional embedding
- Trained on 1,982 samples from 64 subjects

## Components and Interfaces

### Backend API Endpoints

#### POST /api/analyze
Performs complete health analysis on biomarker panel.

**Request:**
```json
{
  "biomarkers": {
    "cytokines": [float × 103],
    "clinical_markers": [float × 14]
  },
  "patient_id": "string (optional)",
  "timestamp": "ISO 8601 datetime (optional)"
}
```

**Response:**
```json
{
  "embedding": [float × 128],
  "cluster": {
    "id": int,
    "name": "string",
    "confidence": float,
    "description": "string"
  },
  "risk_score": {
    "value": float,
    "level": "low|moderate|high",
    "confidence_interval": [float, float]
  },
  "top_risk_factors": [
    {
      "biomarker": "string",
      "shap_value": float,
      "impact_score": float,
      "direction": "elevated|reduced",
      "explanation": "string"
    }
  ],
  "recommendations": [
    {
      "priority": int,
      "intervention": "string",
      "rationale": "string",
      "target_biomarkers": ["string"]
    }
  ],
  "health_map_position": {
    "x": float,
    "y": float
  }
}
```

#### GET /api/personas
Returns list of demo personas.

**Response:**
```json
{
  "personas": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "health_state": "string"
    }
  ]
}
```

#### GET /api/personas/{persona_id}
Returns complete biomarker data for a persona.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "biomarkers": {
    "cytokines": [float × 103],
    "clinical_markers": [float × 14]
  },
  "history": [
    {
      "timestamp": "ISO 8601",
      "biomarkers": {...}
    }
  ]
}
```

#### POST /api/temporal-analysis
Analyzes temporal progression for a patient.

**Request:**
```json
{
  "patient_id": "string",
  "timepoints": [
    {
      "timestamp": "ISO 8601",
      "biomarkers": {...}
    }
  ]
}
```

**Response:**
```json
{
  "trajectory": [
    {
      "timestamp": "ISO 8601",
      "embedding": [float × 128],
      "health_map_position": {"x": float, "y": float},
      "cluster": {...},
      "risk_score": {...}
    }
  ],
  "velocity": float,
  "direction": "improving|stable|declining",
  "trend_analysis": "string"
}
```

#### POST /api/reports/generate
Generates PDF clinician report.

**Request:**
```json
{
  "analysis_result": {...},
  "patient_info": {
    "name": "string (optional)",
    "id": "string",
    "demographics": {...}
  },
  "include_temporal": boolean
}
```

**Response:**
```json
{
  "report_url": "string",
  "generated_at": "ISO 8601"
}
```

#### GET /api/health-map
Returns reference health map data for visualization.

**Response:**
```json
{
  "reference_points": [
    {
      "x": float,
      "y": float,
      "cluster": int,
      "is_healthy": boolean
    }
  ],
  "cluster_boundaries": [...],
  "healthy_zone": {...},
  "at_risk_zones": [...]
}
```

### Core Services

#### EmbeddingService
Handles model inference and embedding generation.

**Methods:**
- `generate_embedding(biomarkers: BiomarkerPanel) -> np.ndarray`: Generates 128D embedding
- `validate_biomarkers(biomarkers: BiomarkerPanel) -> ValidationResult`: Validates input data
- `normalize_biomarkers(biomarkers: BiomarkerPanel) -> np.ndarray`: Applies preprocessing
- `batch_generate_embeddings(biomarkers_list: List[BiomarkerPanel]) -> List[np.ndarray]`: Batch processing

#### AnalysisService
Performs health state analysis and risk assessment.

**Methods:**
- `assign_cluster(embedding: np.ndarray) -> ClusterAssignment`: Assigns health state cluster
- `calculate_risk_score(embedding: np.ndarray, cluster: int) -> RiskScore`: Computes risk
- `explain_features(biomarkers: BiomarkerPanel, embedding: np.ndarray) -> List[RiskFactor]`: SHAP analysis
- `generate_recommendations(risk_factors: List[RiskFactor], cluster: int) -> List[Intervention]`: Creates interventions
- `analyze_temporal_pattern(embeddings: List[np.ndarray], timestamps: List[datetime]) -> TemporalAnalysis`: Trajectory analysis

#### VisualizationService
Prepares data for frontend visualizations.

**Methods:**
- `project_to_2d(embedding: np.ndarray) -> Tuple[float, float]`: UMAP projection
- `get_health_map_data() -> HealthMapData`: Returns reference map
- `prepare_temporal_chart(trajectory: TemporalAnalysis) -> ChartData`: Formats timeline data

#### ReportService
Generates PDF clinician reports.

**Methods:**
- `generate_report(analysis: AnalysisResult, patient_info: PatientInfo) -> bytes`: Creates PDF
- `render_health_map(position: Tuple[float, float]) -> Image`: Renders map visualization
- `format_biomarker_table(risk_factors: List[RiskFactor]) -> Table`: Creates summary table

### Frontend Components

#### Dashboard Component
Main view displaying all health metrics.

**Props:**
- `analysisResult: AnalysisResult`
- `onPersonaSelect: (personaId: string) => void`
- `onExport: () => void`

**State:**
- Current analysis result
- Selected persona
- Loading states

#### HealthMapVisualizer Component
Interactive UMAP visualization.

**Props:**
- `patientPosition: {x: number, y: number}`
- `referenceData: HealthMapData`
- `trajectory: TemporalPoint[] (optional)`

**Features:**
- D3.js scatter plot with zoom/pan
- Color-coded clusters
- Patient marker with label
- Trajectory line for temporal data
- Tooltips on hover

#### RiskFactorPanel Component
Displays top biomarkers driving health state.

**Props:**
- `riskFactors: RiskFactor[]`
- `maxDisplay: number`

**Features:**
- Horizontal bar chart showing impact scores
- Color coding (red for elevated, blue for reduced)
- Plain-language explanations
- Expandable details

#### TemporalProgressionChart Component
Timeline showing health state changes.

**Props:**
- `trajectory: TemporalAnalysis`

**Features:**
- Line chart with risk score over time
- Markers for each measurement
- Trend indicators
- Date labels

#### RecommendationsPanel Component
Displays personalized interventions.

**Props:**
- `recommendations: Intervention[]`

**Features:**
- Prioritized list
- Expandable rationale
- Target biomarker tags
- Disclaimer text

## Data Models

### BiomarkerPanel
```python
class BiomarkerPanel:
    cytokines: np.ndarray  # shape: (103,)
    clinical_markers: np.ndarray  # shape: (14,)
    timestamp: datetime
    patient_id: Optional[str]
    
    def validate(self) -> bool:
        """Validates data completeness and ranges"""
        
    def to_array(self) -> np.ndarray:
        """Concatenates into single array (117,)"""
```

### Embedding
```python
class Embedding:
    vector: np.ndarray  # shape: (128,)
    timestamp: datetime
    patient_id: str
    source_biomarkers: BiomarkerPanel
    
    def distance_to(self, other: Embedding) -> float:
        """Calculates Euclidean distance"""
```

### ClusterAssignment
```python
class ClusterAssignment:
    cluster_id: int
    cluster_name: str
    confidence: float  # 0-1
    description: str
    is_healthy: bool
    
    def to_dict(self) -> dict:
        """Serializes for API response"""
```

### RiskScore
```python
class RiskScore:
    value: float  # 0-1
    level: str  # "low", "moderate", "high"
    confidence_interval: Tuple[float, float]
    contributing_factors: List[str]
    
    def get_level(self) -> str:
        """Maps value to risk level"""
```

### RiskFactor
```python
class RiskFactor:
    biomarker_name: str
    shap_value: float
    impact_score: float  # 0-100
    direction: str  # "elevated", "reduced"
    explanation: str
    reference_range: Optional[Tuple[float, float]]
    
    def format_for_display(self) -> dict:
        """Formats for frontend"""
```

### Intervention
```python
class Intervention:
    priority: int
    intervention_text: str
    rationale: str
    target_biomarkers: List[str]
    evidence_level: str
    
    def to_dict(self) -> dict:
        """Serializes for API response"""
```

### TemporalAnalysis
```python
class TemporalAnalysis:
    timepoints: List[TemporalPoint]
    velocity: float
    direction: str  # "improving", "stable", "declining"
    trend_analysis: str
    
    def calculate_velocity(self) -> float:
        """Computes rate of change in embedding space"""
```

### TemporalPoint
```python
class TemporalPoint:
    timestamp: datetime
    embedding: Embedding
    health_map_position: Tuple[float, float]
    cluster: ClusterAssignment
    risk_score: RiskScore
```

### Persona
```python
class Persona:
    id: str
    name: str
    description: str
    health_state: str
    biomarkers: BiomarkerPanel
    history: List[TemporalPoint]
    
    @staticmethod
    def load_all() -> List[Persona]:
        """Loads all demo personas"""
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

**Consolidation Opportunities:**
1. Properties 2.1, 2.5, 5.1 all validate output dimensions/ranges - can combine into "Output Validation"
2. Properties 3.2, 5.3, 6.3 all validate score ranges - can combine into "Score Range Validation"
3. Properties 3.3, 6.4 both check for non-empty explanations - can combine into "Explanation Completeness"
4. Properties 9.2, 9.3, 9.6 all check report content - can combine into "Report Completeness"
5. Properties 6.1, 6.2 both relate to SHAP analysis - can combine into "SHAP Analysis Completeness"
6. Properties 4.2, 4.3, 4.5 all relate to health map rendering - can combine into "Health Map Rendering"
7. Properties 7.1, 7.2, 7.3 all relate to temporal visualization - can combine into "Temporal Visualization Completeness"
8. Properties 16.1, 16.2, 16.3, 16.5 all relate to error handling - can combine into "Error Handling"
9. Properties 17.2, 17.3 both relate to export completeness - can combine into "Export Completeness"

**Unique Properties to Retain:**
- Input validation (1.1, 1.4, 16.4)
- Missing value handling (1.2)
- Embedding storage round-trip (2.4)
- Cluster assignment (3.1)
- Temporal risk incorporation (5.4)
- Confidence intervals (5.5)
- Intervention generation (8.1, 8.2, 8.3)
- PDF generation (9.1)
- Persona loading (10.2)
- Data source labeling (11.2)
- Color consistency (13.2)
- Tooltip availability (13.3)
- Prediction uncertainty display (14.3)
- Multi-modal integration (15.1)
- Temporal trajectory prediction (15.3)

### Correctness Properties

Property 1: Input Structure Validation
*For any* biomarker panel input, the system should validate that it contains exactly 103 cytokine measurements and 14 clinical markers before processing.
**Validates: Requirements 1.1**

Property 2: Missing Value Handling
*For any* biomarker panel with missing values, the system should handle them without crashing and produce valid output with documented handling method.
**Validates: Requirements 1.2**

Property 3: Normalization Consistency
*For any* biomarker panel, normalization should produce values in the expected range using the same preprocessing as model training.
**Validates: Requirements 1.4**

Property 4: Output Validation
*For any* valid biomarker input, the generated embedding should be exactly 128 dimensions with all valid numerical values (no NaN, no Inf), risk scores should be in [0, 1], and impact scores should be in [0, 100].
**Validates: Requirements 2.1, 2.5, 5.1, 6.3**

Property 5: Embedding Storage Round-Trip
*For any* embedding that is stored with a timestamp, retrieving it should return the same embedding vector and associated timestamp.
**Validates: Requirements 2.4**

Property 6: Cluster Assignment Uniqueness
*For any* embedding, the system should assign it to exactly one cluster with a confidence score in [0, 1].
**Validates: Requirements 3.1, 3.2**

Property 7: Explanation Completeness
*For any* cluster assignment or risk factor, the system should provide a non-empty plain-language explanation.
**Validates: Requirements 3.3, 6.4**

Property 8: Health Map Rendering Completeness
*For any* patient position and health map data, the rendered visualization should include: a distinct patient marker at the correct position, color-coded cluster regions, and interactive tooltips for all points.
**Validates: Requirements 4.2, 4.3, 4.5**

Property 9: Risk Score Categorization
*For any* risk score value, the categorization should correctly map to low (0-0.33), moderate (0.34-0.66), or high (0.67-1.0) risk levels.
**Validates: Requirements 5.3**

Property 10: Temporal Risk Incorporation
*For any* patient with multiple timepoints, the risk score calculated with temporal data should differ from the risk score calculated using only the latest timepoint.
**Validates: Requirements 5.4**

Property 11: Confidence Interval Presence
*For any* risk score prediction, the system should provide associated confidence interval bounds.
**Validates: Requirements 5.5**

Property 12: SHAP Analysis Completeness
*For any* embedding, SHAP values should be calculated for all 117 input features, and the top 10 biomarkers should be correctly sorted by absolute SHAP value.
**Validates: Requirements 6.1, 6.2**

Property 13: Risk Factor Direction Labeling
*For any* identified risk factor, the system should indicate whether the biomarker is "elevated" or "reduced" relative to healthy reference.
**Validates: Requirements 6.5**

Property 14: Temporal Visualization Completeness
*For any* patient with multiple embeddings, the system should create a temporal visualization showing: connected trajectory on health map, timestamps for each point, and calculated velocity/direction.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

Property 15: At-Risk Trajectory Warning
*For any* temporal trajectory moving toward at-risk zones (increasing risk score over time), the system should display visual warnings.
**Validates: Requirements 7.5**

Property 16: Intervention Generation
*For any* set of identified risk factors, the system should generate 3-5 personalized interventions sorted by priority/impact.
**Validates: Requirements 8.1, 8.2, 8.3**

Property 17: PDF Report Generation
*For any* analysis result, the system should generate a valid PDF clinician report.
**Validates: Requirements 9.1**

Property 18: Report Completeness
*For any* generated clinician report, it should include all required sections: patient demographics, biomarker summary, cluster assignment, risk score, top risk factors, health map visualization, and limitation statements.
**Validates: Requirements 9.2, 9.3, 9.6**

Property 19: Temporal Report Content
*For any* clinician report where temporal data exists, the report should include a progression timeline.
**Validates: Requirements 9.4**

Property 20: Persona Loading
*For any* pre-configured persona, selecting it should load synthetic biomarker data and produce a complete analysis with all standard outputs.
**Validates: Requirements 10.2**

Property 21: Synthetic Data Labeling
*For any* persona or demo data display, the system should clearly label the data as synthetic for demonstration purposes.
**Validates: Requirements 10.5, 11.2**

Property 22: Loading Indicator Display
*For any* operation exceeding 500 milliseconds, the system should display a loading indicator.
**Validates: Requirements 12.5**

Property 23: Color Coding Consistency
*For any* risk level display, the color should match the defined scheme: green for low risk, yellow for moderate risk, red for high risk.
**Validates: Requirements 13.2**

Property 24: Tooltip Availability
*For any* technical term or complex visualization element, the system should provide an explanatory tooltip.
**Validates: Requirements 13.3**

Property 25: Prediction Uncertainty Display
*For any* prediction (risk score, cluster assignment), the system should display confidence intervals or uncertainty estimates.
**Validates: Requirements 14.3**

Property 26: Multi-Modal Data Integration
*For any* analysis, the system should incorporate all three data types: immune markers (cytokines), metabolic markers (clinical), and temporal data (when available).
**Validates: Requirements 15.1**

Property 27: Temporal Trajectory Prediction
*For any* patient with temporal data (2+ timepoints), the system should generate trajectory predictions, not just current state assessment.
**Validates: Requirements 15.3**

Property 28: Error Handling
*For any* invalid input, model failure, or rendering error, the system should return descriptive error messages without exposing technical stack traces, and provide fallback views when possible.
**Validates: Requirements 16.1, 16.2, 16.3, 16.5**

Property 29: Input Validation Before Processing
*For any* user input, the system should perform validation before processing.
**Validates: Requirements 16.4**

Property 30: Export Completeness
*For any* exported report or data file, it should include all visualizations, generation timestamps, and data source labels.
**Validates: Requirements 17.2, 17.3**

## Error Handling

### Input Validation Errors

**Invalid Biomarker Structure:**
- Error Code: `INVALID_BIOMARKER_STRUCTURE`
- Message: "Biomarker panel must contain exactly 103 cytokine measurements and 14 clinical markers. Received: {actual_counts}"
- HTTP Status: 400
- Recovery: User must provide correctly structured data

**Out-of-Range Values:**
- Error Code: `OUT_OF_RANGE_VALUES`
- Message: "The following biomarkers have out-of-range values: {biomarker_list}. Analysis will proceed with flagged values."
- HTTP Status: 200 (warning, not error)
- Recovery: Continue processing with warnings

**Missing Required Fields:**
- Error Code: `MISSING_REQUIRED_FIELDS`
- Message: "Required fields missing: {field_list}"
- HTTP Status: 400
- Recovery: User must provide missing fields

### Model Inference Errors

**Model Loading Failure:**
- Error Code: `MODEL_LOAD_FAILED`
- Message: "Failed to load contrastive learning model. Please contact support."
- HTTP Status: 500
- Recovery: Retry request; if persistent, check model file integrity

**Embedding Generation Failure:**
- Error Code: `EMBEDDING_GENERATION_FAILED`
- Message: "Unable to generate embedding for provided biomarkers. Please verify input data quality."
- HTTP Status: 500
- Recovery: Log error details; return user-friendly message; suggest data validation

**SHAP Calculation Failure:**
- Error Code: `SHAP_CALCULATION_FAILED`
- Message: "Feature importance analysis unavailable. Core analysis results are still valid."
- HTTP Status: 200 (partial success)
- Recovery: Return analysis without SHAP explanations; log error for investigation

### Visualization Errors

**UMAP Projection Failure:**
- Error Code: `UMAP_PROJECTION_FAILED`
- Message: "Health map visualization unavailable. Other analysis results are still valid."
- HTTP Status: 200 (partial success)
- Recovery: Return analysis without health map; provide fallback cluster description

**Chart Rendering Failure:**
- Error Code: `CHART_RENDERING_FAILED`
- Message: "Unable to render {chart_type}. Data is available in tabular format."
- HTTP Status: 200 (partial success)
- Recovery: Provide data in alternative format (table, JSON)

### Report Generation Errors

**PDF Generation Failure:**
- Error Code: `PDF_GENERATION_FAILED`
- Message: "Unable to generate PDF report. Please try again or export data in CSV format."
- HTTP Status: 500
- Recovery: Offer alternative export formats; log error details

**Missing Report Data:**
- Error Code: `INCOMPLETE_REPORT_DATA`
- Message: "Some report sections unavailable due to incomplete analysis. Partial report generated."
- HTTP Status: 200 (partial success)
- Recovery: Generate report with available sections; clearly mark missing sections

### Data Access Errors

**Persona Not Found:**
- Error Code: `PERSONA_NOT_FOUND`
- Message: "Requested persona '{persona_id}' not found. Available personas: {persona_list}"
- HTTP Status: 404
- Recovery: User selects valid persona from list

**Temporal Data Insufficient:**
- Error Code: `INSUFFICIENT_TEMPORAL_DATA`
- Message: "Temporal analysis requires at least 2 timepoints. Received: {count}"
- HTTP Status: 400
- Recovery: Provide current state analysis only; inform user of temporal requirements

### Error Logging Strategy

All errors should be logged with:
- Timestamp
- Error code
- User-facing message
- Technical details (stack trace, input data summary)
- Request ID for tracing
- User ID (if applicable)

Critical errors (5xx) should trigger alerts for immediate investigation.

## Testing Strategy

### Dual Testing Approach

MetaboLens requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests** focus on:
- Specific example cases (e.g., healthy baseline persona produces expected cluster)
- Edge cases (empty biomarker values, extreme outliers)
- Integration points (API endpoint contracts, database queries)
- Error conditions (invalid inputs, model failures)
- UI component rendering with specific props

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs (e.g., embeddings always 128D)
- Input validation across wide range of generated data
- Output constraints (score ranges, data structure)
- Round-trip properties (storage/retrieval, serialization)
- Invariants (normalization preserves relative ordering)

### Property-Based Testing Configuration

**Framework:** Hypothesis (Python) for backend, fast-check (TypeScript) for frontend

**Test Configuration:**
- Minimum 100 iterations per property test
- Seed-based reproducibility for debugging
- Shrinking enabled to find minimal failing cases
- Timeout: 60 seconds per property test

**Tagging Convention:**
Each property test must include a comment referencing the design property:
```python
# Feature: metabolens, Property 1: Input Structure Validation
@given(biomarker_panel=biomarker_strategy())
def test_input_structure_validation(biomarker_panel):
    ...
```

### Test Coverage Requirements

**Backend Coverage:**
- Model inference: 90%+ code coverage
- API endpoints: 100% endpoint coverage
- Data validation: 100% validation rule coverage
- Error handling: All error codes tested

**Frontend Coverage:**
- Component rendering: 80%+ coverage
- User interactions: All critical paths tested
- Visualization: Snapshot tests for key states
- Error boundaries: All error states tested

### Integration Testing

**API Integration Tests:**
- End-to-end flow: biomarker input → analysis → visualization data
- Persona loading and switching
- Report generation with all sections
- Error handling across API boundaries

**UI Integration Tests:**
- Dashboard loads with persona data
- Health map renders with patient position
- Temporal progression displays correctly
- Export functionality produces valid files

### Performance Testing

While not property-based, performance requirements should be validated:
- Embedding generation: <1 second (benchmark with 100 samples)
- End-to-end analysis: <3 seconds (benchmark with 50 samples)
- Report generation: <5 seconds (benchmark with 20 samples)
- Health map rendering: <2 seconds (benchmark with 10 samples)

### Demo Validation Testing

**Persona Validation:**
- All 5 personas load successfully
- Each persona produces distinct cluster assignments
- Temporal personas show progression
- All visualizations render for each persona

**Presentation Flow:**
- Persona switching <1 second
- No errors during typical demo sequence
- All differentiating features visible and functional

### Continuous Testing

**Pre-commit:**
- Unit tests for changed files
- Linting and type checking

**CI Pipeline:**
- All unit tests
- All property-based tests
- Integration tests
- Build validation

**Pre-release:**
- Full test suite
- Performance benchmarks
- Demo validation
- Accessibility audit

### Test Data Strategy

**Synthetic Data Generation:**
- Use Hypothesis strategies to generate valid biomarker panels
- Ensure generated data covers full range of expected values
- Include edge cases (missing values, outliers, boundary conditions)

**Persona Data:**
- 5 hand-crafted personas with known characteristics
- Validated against expected cluster assignments
- Temporal data for progression demonstration

**NHANES Data:**
- Use publicly available NHANES dataset for realistic distributions
- Anonymized and aggregated only
- Document data source and access method

### Mocking Strategy

**Model Mocking:**
- Mock model inference for fast unit tests
- Use real model for integration tests
- Provide deterministic outputs for reproducible tests

**External Dependencies:**
- Mock PDF generation library for unit tests
- Mock UMAP for fast visualization tests
- Use real implementations for integration tests

This testing strategy ensures both correctness (through property-based testing) and practical functionality (through unit and integration testing), while maintaining fast feedback loops for development.
