# Requirements Document: MetaboLens - Personalized Metabolic Health Navigator

## Introduction

MetaboLens is an AI-powered platform that translates complex biomarker panels into actionable patient insights using multi-modal contrastive learning. The system processes 103 cytokines, 14 clinical markers, and temporal data to generate personalized health assessments, risk predictions, and intervention recommendations. This is a research prototype designed for a healthcare AI hackathon, using synthetic or publicly available data only.

## Glossary

- **System**: The MetaboLens platform
- **Biomarker_Panel**: A collection of 103 cytokine measurements and 14 clinical markers from a single patient sample
- **Embedding**: A 128-dimensional vector representation of a patient's metabolic health state
- **Contrastive_Model**: The trained multi-modal contrastive learning model that generates embeddings
- **Health_Map**: A UMAP visualization showing patient positions in metabolic health landscape
- **Cluster**: A group of similar health states discovered through HDBSCAN clustering
- **Risk_Score**: A numerical value (0-1) indicating disease progression probability
- **SHAP_Value**: Shapley Additive exPlanations value indicating feature importance
- **Temporal_Pattern**: A sequence of embeddings showing health state changes over time
- **Intervention**: An actionable recommendation based on discriminative biomarkers
- **Clinician_Report**: A professional PDF document summarizing patient health assessment
- **Patient**: An individual whose biomarker data is being analyzed
- **Clinician**: A healthcare provider using the system for patient assessment
- **Persona**: A representative patient story used for demonstration purposes

## Requirements

### Requirement 1: Biomarker Data Processing

**User Story:** As a patient, I want to input my biomarker panel data, so that I can receive a personalized health assessment.

#### Acceptance Criteria

1. WHEN a Biomarker_Panel is provided, THE System SHALL validate that it contains 103 cytokine measurements and 14 clinical markers
2. WHEN a Biomarker_Panel contains missing values, THE System SHALL handle them appropriately and document the handling method
3. WHEN a Biomarker_Panel contains out-of-range values, THE System SHALL flag them and proceed with analysis
4. THE System SHALL normalize biomarker values using the same preprocessing applied during model training
5. WHEN biomarker data is processed, THE System SHALL complete preprocessing within 100 milliseconds

### Requirement 2: Embedding Generation

**User Story:** As a system component, I want to generate embeddings from biomarker panels, so that I can represent patient health states in a standardized format.

#### Acceptance Criteria

1. WHEN a normalized Biomarker_Panel is provided, THE Contrastive_Model SHALL generate a 128-dimensional Embedding
2. THE System SHALL complete embedding generation within 1 second
3. WHEN generating an Embedding, THE System SHALL use the trained model with 0.747 silhouette score
4. THE System SHALL store Embeddings with associated timestamps for temporal analysis
5. WHEN an Embedding is generated, THE System SHALL validate that all 128 dimensions contain valid numerical values

### Requirement 3: Health State Explanation

**User Story:** As a patient, I want to understand my current health state in plain language, so that I can comprehend complex biomarker results without medical training.

#### Acceptance Criteria

1. WHEN an Embedding is generated, THE System SHALL assign it to the nearest Cluster
2. WHEN a Cluster assignment is made, THE System SHALL provide a confidence score between 0 and 1
3. THE System SHALL generate a plain-language description of the health state associated with each Cluster
4. WHEN explaining health state, THE System SHALL avoid medical jargon and use accessible language
5. THE System SHALL include a clear limitation statement that this is a research prototype requiring clinical validation

### Requirement 4: Health Map Visualization

**User Story:** As a patient, I want to see where I am positioned on a health map, so that I can visualize my metabolic health relative to healthy and at-risk states.

#### Acceptance Criteria

1. THE System SHALL generate a 2D Health_Map using UMAP dimensionality reduction
2. WHEN displaying the Health_Map, THE System SHALL show the patient's current position as a distinct marker
3. WHEN displaying the Health_Map, THE System SHALL color-code regions by Cluster assignment
4. THE System SHALL display healthy reference ranges and at-risk zones on the Health_Map
5. WHEN a user interacts with the Health_Map, THE System SHALL provide tooltips with cluster information
6. THE System SHALL render the Health_Map within 2 seconds

### Requirement 5: Risk Prediction

**User Story:** As a clinician, I want to see disease progression risk scores, so that I can prioritize patients who need intervention.

#### Acceptance Criteria

1. WHEN an Embedding is generated, THE System SHALL calculate a Risk_Score between 0 and 1
2. WHEN calculating Risk_Score, THE System SHALL use validated biological pathway signatures (Th1/Th17 immune markers)
3. THE System SHALL categorize Risk_Score into low (0-0.33), moderate (0.34-0.66), and high (0.67-1.0) risk levels
4. WHEN Temporal_Patterns are available, THE System SHALL incorporate trajectory information into Risk_Score calculation
5. THE System SHALL display confidence intervals for Risk_Score predictions

### Requirement 6: Risk Factor Identification

**User Story:** As a patient, I want to know which biomarkers are driving my health state, so that I can understand what factors to focus on.

#### Acceptance Criteria

1. WHEN an Embedding is generated, THE System SHALL calculate SHAP_Values for all input biomarkers
2. THE System SHALL identify the top 10 biomarkers with highest absolute SHAP_Values
3. WHEN displaying risk factors, THE System SHALL show impact scores normalized to 0-100 scale
4. THE System SHALL provide plain-language explanations for each identified risk factor
5. THE System SHALL indicate whether each biomarker is elevated or reduced relative to healthy reference

### Requirement 7: Temporal Progression Tracking

**User Story:** As a patient, I want to see how my health state has changed over time, so that I can track the effectiveness of interventions.

#### Acceptance Criteria

1. WHEN multiple Embeddings exist for a Patient, THE System SHALL create a Temporal_Pattern visualization
2. THE System SHALL display movement in embedding space as a trajectory on the Health_Map
3. WHEN displaying temporal progression, THE System SHALL show timestamps for each measurement
4. THE System SHALL calculate velocity and direction of health state changes
5. WHEN trajectory shows movement toward at-risk zones, THE System SHALL highlight this with visual warnings

### Requirement 8: Personalized Recommendations

**User Story:** As a patient, I want to receive actionable interventions, so that I can take steps to improve my metabolic health.

#### Acceptance Criteria

1. WHEN risk factors are identified, THE System SHALL generate personalized Interventions based on discriminative biomarkers
2. THE System SHALL provide 3-5 specific, actionable recommendations per patient
3. WHEN generating Interventions, THE System SHALL prioritize recommendations by potential impact
4. THE System SHALL include clear disclaimers that recommendations are not medical advice
5. THE System SHALL base Interventions on evidence-based pathways validated in the training data

### Requirement 9: Clinician Report Generation

**User Story:** As a clinician, I want to generate professional reports, so that I can document patient assessments and share findings with care teams.

#### Acceptance Criteria

1. WHEN a clinician requests a report, THE System SHALL generate a Clinician_Report in PDF format
2. THE Clinician_Report SHALL include patient demographics, biomarker summary, cluster assignment, risk score, and top risk factors
3. THE Clinician_Report SHALL include the Health_Map visualization with patient position
4. WHEN Temporal_Patterns exist, THE Clinician_Report SHALL include progression timeline
5. THE System SHALL generate the Clinician_Report within 5 seconds
6. THE Clinician_Report SHALL include clear limitation statements and validation requirements

### Requirement 10: Demo Persona Management

**User Story:** As a hackathon presenter, I want to showcase 5 representative patient personas, so that I can demonstrate the system's capabilities across different health states.

#### Acceptance Criteria

1. THE System SHALL include 5 pre-configured Personas representing different metabolic health states
2. WHEN a Persona is selected, THE System SHALL load synthetic biomarker data and display complete analysis
3. THE System SHALL include personas for: healthy baseline, pre-diabetic, metabolic syndrome, immune dysregulation, and improving trajectory
4. WHEN switching between Personas, THE System SHALL complete the transition within 1 second
5. THE System SHALL clearly label all persona data as synthetic for demonstration purposes

### Requirement 11: Data Source Compliance

**User Story:** As a responsible AI developer, I want to ensure all data is synthetic or publicly available, so that I comply with privacy regulations and ethical standards.

#### Acceptance Criteria

1. THE System SHALL use only synthetic data or publicly available datasets (NHANES)
2. WHEN displaying any patient data, THE System SHALL include a clear label indicating data source
3. THE System SHALL not store or process any real patient health information
4. THE System SHALL include prominent disclaimers that this is a research prototype
5. THE System SHALL document all data sources and generation methods in system documentation

### Requirement 12: Performance Requirements

**User Story:** As a hackathon presenter, I want the system to respond quickly, so that I can deliver a smooth demonstration without technical delays.

#### Acceptance Criteria

1. THE System SHALL complete end-to-end analysis (input to visualization) within 3 seconds
2. THE System SHALL maintain inference time under 1 second for embedding generation
3. WHEN rendering visualizations, THE System SHALL display initial content within 2 seconds
4. THE System SHALL handle concurrent requests from multiple demo users without degradation
5. THE System SHALL provide loading indicators for operations exceeding 500 milliseconds

### Requirement 13: User Interface Requirements

**User Story:** As a patient, I want an intuitive and clean interface, so that I can navigate the system without confusion.

#### Acceptance Criteria

1. THE System SHALL provide a dashboard view showing all key metrics on a single screen
2. THE System SHALL use consistent color coding (green for healthy, yellow for moderate risk, red for high risk)
3. WHEN displaying technical information, THE System SHALL provide tooltips with explanations
4. THE System SHALL be responsive and functional on desktop browsers (minimum 1280x720 resolution)
5. THE System SHALL follow accessibility guidelines for color contrast and text readability

### Requirement 14: Model Transparency

**User Story:** As a clinician, I want to understand the model's capabilities and limitations, so that I can appropriately interpret results.

#### Acceptance Criteria

1. THE System SHALL display model performance metrics (0.747 silhouette score, sample size, validation results)
2. THE System SHALL provide access to model documentation explaining the contrastive learning approach
3. WHEN displaying predictions, THE System SHALL show confidence intervals or uncertainty estimates
4. THE System SHALL clearly state that the model is trained on 1,982 samples from 64 subjects
5. THE System SHALL include information about validated biological pathways (Th1/Th17 signatures)

### Requirement 15: Competitive Differentiation Features

**User Story:** As a hackathon presenter, I want to highlight unique capabilities, so that I can demonstrate competitive advantages.

#### Acceptance Criteria

1. THE System SHALL integrate immune markers (cytokines), metabolic markers, and temporal data in a unified analysis
2. THE System SHALL use multi-modal contrastive learning (not standard classification or regression)
3. THE System SHALL predict disease trajectories based on temporal patterns (not just current state)
4. THE System SHALL provide biological pathway enrichment validation in the documentation
5. THE System SHALL clearly articulate these differentiators in the user interface and presentation materials

### Requirement 16: Error Handling and Validation

**User Story:** As a system user, I want clear error messages when something goes wrong, so that I can understand and resolve issues.

#### Acceptance Criteria

1. WHEN invalid biomarker data is provided, THE System SHALL return a descriptive error message
2. WHEN the model fails to generate an embedding, THE System SHALL log the error and display a user-friendly message
3. WHEN visualization rendering fails, THE System SHALL display a fallback view with available data
4. THE System SHALL validate all user inputs before processing
5. WHEN errors occur, THE System SHALL not expose technical stack traces to end users

### Requirement 17: Export and Sharing Capabilities

**User Story:** As a patient, I want to export my health assessment, so that I can share it with my healthcare provider.

#### Acceptance Criteria

1. THE System SHALL provide an export function for patient health summaries in PDF format
2. THE System SHALL include all visualizations in exported reports
3. WHEN exporting data, THE System SHALL include generation timestamp and data source labels
4. THE System SHALL allow users to download raw embedding data in CSV format
5. THE System SHALL complete export operations within 3 seconds

### Requirement 18: System Architecture Requirements

**User Story:** As a system architect, I want clear separation between model inference, data processing, and presentation layers, so that the system is maintainable and extensible.

#### Acceptance Criteria

1. WHEN the model is updated, THE System SHALL continue functioning without changes to the UI layer
2. WHEN visualization components are modified, THE System SHALL continue functioning without changes to the model layer
3. THE System SHALL use a RESTful API for communication between frontend and backend
4. THE System SHALL implement proper error boundaries between architectural layers
5. THE System SHALL document all API endpoints and data contracts
