# Implementation Plan: MetaboLens - Personalized Metabolic Health Navigator

## Overview

This implementation plan breaks down the MetaboLens platform into discrete coding tasks. The system consists of a Python FastAPI backend for model inference and analysis, and a React/TypeScript frontend for visualization and user interaction. The implementation follows an incremental approach, building core functionality first, then adding analysis features, visualizations, and finally report generation.

## Tasks

- [ ] 1. Set up project structure and development environment
  - Create backend directory structure (api/, models/, services/, tests/)
  - Create frontend directory structure (src/components/, src/services/, src/types/)
  - Set up Python virtual environment with FastAPI, PyTorch, SHAP, scikit-learn, UMAP
  - Initialize React project with TypeScript, D3.js, Recharts, Tailwind CSS
  - Configure testing frameworks (pytest for backend, Jest for frontend)
  - Create .gitignore and environment configuration files
  - _Requirements: 18.3, 18.4_

- [ ] 2. Implement core data models and validation
  - [ ] 2.1 Create Python data models for biomarker panels, embeddings, and analysis results
    - Implement BiomarkerPanel class with validation methods
    - Implement Embedding, ClusterAssignment, RiskScore, RiskFactor classes
    - Implement TemporalAnalysis and TemporalPoint classes
    - Add serialization methods (to_dict, from_dict) for API responses
    - _Requirements: 1.1, 1.3, 2.4, 3.1, 3.2, 5.1, 5.3_
  
  - [ ]* 2.2 Write property test for input structure validation
    - **Property 1: Input Structure Validation**
    - **Validates: Requirements 1.1**
  
  - [ ]* 2.3 Write property test for output validation
    - **Property 4: Output Validation**
    - **Validates: Requirements 2.1, 2.5, 5.1, 6.3**
  
  - [ ]* 2.4 Write unit tests for data model edge cases
    - Test missing value handling
    - Test out-of-range value flagging
    - Test serialization/deserialization
    - _Requirements: 1.2, 1.3_

- [ ] 3. Implement model loading and embedding generation
  - [ ] 3.1 Create EmbeddingService for model inference
    - Load pre-trained contrastive learning model (PyTorch)
    - Implement normalize_biomarkers() using training preprocessing
    - Implement generate_embedding() for single biomarker panel
    - Implement batch_generate_embeddings() for multiple panels
    - Add input validation and error handling
    - _Requirements: 1.4, 2.1, 2.3, 2.5, 16.1, 16.2_
  
  - [ ]* 3.2 Write property test for normalization consistency
    - **Property 3: Normalization Consistency**
    - **Validates: Requirements 1.4**
  
  - [ ]* 3.3 Write property test for missing value handling
    - **Property 2: Missing Value Handling**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.4 Write unit tests for embedding generation
    - Test with known biomarker panels
    - Test inference time performance
    - Test error handling for model failures
    - _Requirements: 2.2, 16.2_

- [ ] 4. Implement clustering and health state assignment
  - [ ] 4.1 Create clustering module with HDBSCAN
    - Load pre-trained HDBSCAN clustering model
    - Implement assign_cluster() to find nearest cluster
    - Calculate confidence scores based on distance to cluster centroid
    - Create cluster descriptions (healthy baseline, pre-diabetic, metabolic syndrome, etc.)
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 4.2 Write property test for cluster assignment
    - **Property 6: Cluster Assignment Uniqueness**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ]* 4.3 Write property test for explanation completeness
    - **Property 7: Explanation Completeness**
    - **Validates: Requirements 3.3, 6.4**
  
  - [ ]* 4.4 Write unit tests for clustering edge cases
    - Test embeddings far from all clusters
    - Test embeddings on cluster boundaries
    - _Requirements: 3.1, 3.2_

- [ ] 5. Implement SHAP explainability and risk factor identification
  - [ ] 5.1 Create SHAP analysis module
    - Initialize SHAP explainer with background data
    - Implement explain_features() to calculate SHAP values for all 117 features
    - Implement identify_top_risk_factors() to extract top 10 biomarkers
    - Normalize SHAP values to 0-100 impact scores
    - Determine direction (elevated/reduced) relative to healthy reference
    - Generate plain-language explanations for each risk factor
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 5.2 Write property test for SHAP analysis completeness
    - **Property 12: SHAP Analysis Completeness**
    - **Validates: Requirements 6.1, 6.2**
  
  - [ ]* 5.3 Write property test for risk factor direction labeling
    - **Property 13: Risk Factor Direction Labeling**
    - **Validates: Requirements 6.5**
  
  - [ ]* 5.4 Write unit tests for SHAP edge cases
    - Test with all-zero SHAP values
    - Test with extreme SHAP values
    - Test fallback when SHAP calculation fails
    - _Requirements: 16.2_

- [ ] 6. Implement risk scoring and prediction
  - [ ] 6.1 Create risk scoring module
    - Implement calculate_risk_score() using validated biological pathways
    - Map risk scores to low/moderate/high categories
    - Calculate confidence intervals using bootstrap or model uncertainty
    - Implement temporal risk incorporation for patients with history
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 6.2 Write property test for risk score categorization
    - **Property 9: Risk Score Categorization**
    - **Validates: Requirements 5.3**
  
  - [ ]* 6.3 Write property test for temporal risk incorporation
    - **Property 10: Temporal Risk Incorporation**
    - **Validates: Requirements 5.4**
  
  - [ ]* 6.4 Write property test for confidence interval presence
    - **Property 11: Confidence Interval Presence**
    - **Validates: Requirements 5.5**
  
  - [ ]* 6.5 Write unit tests for risk scoring
    - Test with known healthy and at-risk embeddings
    - Test temporal vs non-temporal risk calculation
    - _Requirements: 5.1, 5.4_

- [ ] 7. Checkpoint - Ensure core analysis pipeline works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement recommendation generation
  - [ ] 8.1 Create intervention recommendation module
    - Implement generate_recommendations() based on top risk factors
    - Create evidence-based intervention templates for common biomarker patterns
    - Prioritize recommendations by potential impact (SHAP magnitude)
    - Ensure 3-5 recommendations per patient
    - Add disclaimer text for all recommendations
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 8.2 Write property test for intervention generation
    - **Property 16: Intervention Generation**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [ ]* 8.3 Write unit tests for recommendation quality
    - Test recommendations for different risk factor patterns
    - Verify disclaimer text is always present
    - _Requirements: 8.4_

- [ ] 9. Implement temporal analysis and progression tracking
  - [ ] 9.1 Create temporal analysis module
    - Implement analyze_temporal_pattern() for multiple timepoints
    - Calculate velocity (rate of change in embedding space)
    - Determine direction (improving/stable/declining)
    - Detect movement toward at-risk zones
    - Generate trend analysis text
    - _Requirements: 7.1, 7.4, 7.5, 15.3_
  
  - [ ]* 9.2 Write property test for temporal visualization completeness
    - **Property 14: Temporal Visualization Completeness**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
  
  - [ ]* 9.3 Write property test for at-risk trajectory warning
    - **Property 15: At-Risk Trajectory Warning**
    - **Validates: Requirements 7.5**
  
  - [ ]* 9.4 Write property test for temporal trajectory prediction
    - **Property 27: Temporal Trajectory Prediction**
    - **Validates: Requirements 15.3**
  
  - [ ]* 9.5 Write unit tests for temporal analysis
    - Test with 2, 3, and 5+ timepoints
    - Test with improving and declining trajectories
    - _Requirements: 7.4, 15.3_

- [ ] 10. Implement UMAP visualization and health map generation
  - [ ] 10.1 Create visualization service for health map
    - Load or generate reference UMAP projection from training data
    - Implement project_to_2d() to map embeddings to 2D coordinates
    - Generate health map reference data with cluster boundaries
    - Define healthy zones and at-risk zones
    - Prepare trajectory data for temporal visualization
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 7.2_
  
  - [ ]* 10.2 Write property test for health map rendering completeness
    - **Property 8: Health Map Rendering Completeness**
    - **Validates: Requirements 4.2, 4.3, 4.5**
  
  - [ ]* 10.3 Write unit tests for UMAP projection
    - Test projection consistency
    - Test with edge case embeddings
    - Test fallback when projection fails
    - _Requirements: 16.3_

- [ ] 11. Implement persona management and demo data
  - [ ] 11.1 Create persona data and loading system
    - Define 5 personas: healthy baseline, pre-diabetic, metabolic syndrome, immune dysregulation, improving trajectory
    - Generate synthetic biomarker data for each persona
    - Create temporal history for progression personas
    - Implement Persona.load_all() and persona retrieval
    - Add synthetic data labels to all persona outputs
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 11.1, 11.2_
  
  - [ ]* 11.2 Write property test for persona loading
    - **Property 20: Persona Loading**
    - **Validates: Requirements 10.2**
  
  - [ ]* 11.3 Write property test for synthetic data labeling
    - **Property 21: Synthetic Data Labeling**
    - **Validates: Requirements 10.5, 11.2**
  
  - [ ]* 11.4 Write unit tests for persona validation
    - Verify all 5 personas exist
    - Verify each produces distinct cluster assignments
    - Verify temporal personas show progression
    - _Requirements: 10.1, 10.3_

- [ ] 12. Implement FastAPI backend endpoints
  - [ ] 12.1 Create API endpoints for analysis and data access
    - Implement POST /api/analyze endpoint
    - Implement GET /api/personas and GET /api/personas/{id} endpoints
    - Implement POST /api/temporal-analysis endpoint
    - Implement GET /api/health-map endpoint
    - Add request validation and error handling
    - Add CORS configuration for frontend
    - _Requirements: 16.1, 16.4, 18.3_
  
  - [ ]* 12.2 Write integration tests for API endpoints
    - Test end-to-end analysis flow
    - Test persona loading
    - Test temporal analysis
    - Test error responses
    - _Requirements: 16.1, 16.2_
  
  - [ ]* 12.3 Write property test for error handling
    - **Property 28: Error Handling**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.5**
  
  - [ ]* 12.4 Write property test for input validation
    - **Property 29: Input Validation Before Processing**
    - **Validates: Requirements 16.4**

- [ ] 13. Checkpoint - Ensure backend API is functional
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement React frontend dashboard component
  - [ ] 14.1 Create main Dashboard component
    - Set up component structure with state management
    - Implement persona selector dropdown
    - Create layout for health metrics display
    - Add loading states and error boundaries
    - Implement data fetching from backend API
    - _Requirements: 13.1, 13.2, 16.3_
  
  - [ ]* 14.2 Write unit tests for Dashboard component
    - Test rendering with mock data
    - Test persona selection
    - Test loading and error states
    - _Requirements: 13.1_

- [ ] 15. Implement health map visualization component
  - [ ] 15.1 Create HealthMapVisualizer component with D3.js
    - Set up D3.js scatter plot with zoom and pan
    - Render reference points color-coded by cluster
    - Render patient position as distinct marker
    - Add cluster boundary visualization
    - Implement interactive tooltips on hover
    - Render temporal trajectory as connected line
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 7.2, 13.2_
  
  - [ ]* 15.2 Write unit tests for HealthMapVisualizer
    - Test rendering with various data configurations
    - Test tooltip interactions
    - Test trajectory rendering
    - _Requirements: 4.5_
  
  - [ ]* 15.3 Write property test for tooltip availability
    - **Property 24: Tooltip Availability**
    - **Validates: Requirements 13.3**

- [ ] 16. Implement risk factor and recommendations panels
  - [ ] 16.1 Create RiskFactorPanel component
    - Display top risk factors as horizontal bar chart
    - Color-code by direction (red for elevated, blue for reduced)
    - Show impact scores (0-100)
    - Display plain-language explanations
    - Add expandable details section
    - _Requirements: 6.3, 6.4, 6.5, 13.2_
  
  - [ ] 16.2 Create RecommendationsPanel component
    - Display interventions as prioritized list
    - Show rationale and target biomarkers
    - Add disclaimer text prominently
    - Make recommendations expandable
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [ ]* 16.3 Write unit tests for risk and recommendation panels
    - Test rendering with various risk factors
    - Test color coding consistency
    - Verify disclaimer is always present
    - _Requirements: 8.4, 13.2_
  
  - [ ]* 16.4 Write property test for color coding consistency
    - **Property 23: Color Coding Consistency**
    - **Validates: Requirements 13.2**

- [ ] 17. Implement temporal progression visualization
  - [ ] 17.1 Create TemporalProgressionChart component
    - Use Recharts to display risk score timeline
    - Show markers for each measurement with timestamps
    - Display trend indicators (improving/stable/declining)
    - Add visual warnings for at-risk trajectories
    - Format dates appropriately
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ]* 17.2 Write unit tests for temporal chart
    - Test with various trajectory patterns
    - Test warning display for at-risk trends
    - Test date formatting
    - _Requirements: 7.3, 7.5_

- [ ] 18. Implement model transparency and documentation displays
  - [ ] 18.1 Create ModelInfoPanel component
    - Display model performance metrics (0.747 silhouette score)
    - Show training data information (1,982 samples, 64 subjects)
    - Display validated biological pathways (Th1/Th17)
    - Add link to detailed model documentation
    - Show limitation statements prominently
    - _Requirements: 3.5, 11.4, 14.1, 14.2, 14.4, 14.5_
  
  - [ ]* 18.2 Write property test for prediction uncertainty display
    - **Property 25: Prediction Uncertainty Display**
    - **Validates: Requirements 14.3**
  
  - [ ]* 18.3 Write unit tests for model info display
    - Verify all required information is present
    - Verify limitation statements are visible
    - _Requirements: 3.5, 11.4_

- [ ] 19. Implement loading indicators and UI polish
  - [ ] 19.1 Add loading states throughout UI
    - Create LoadingSpinner component
    - Add loading indicators for operations >500ms
    - Implement skeleton screens for data loading
    - Add smooth transitions between states
    - _Requirements: 12.5_
  
  - [ ]* 19.2 Write property test for loading indicator display
    - **Property 22: Loading Indicator Display**
    - **Validates: Requirements 12.5**
  
  - [ ]* 19.3 Write unit tests for loading states
    - Test loading indicators appear appropriately
    - Test transitions between loading and loaded states
    - _Requirements: 12.5_

- [ ] 20. Checkpoint - Ensure frontend UI is functional
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Implement PDF report generation
  - [ ] 21.1 Create ReportService for PDF generation
    - Set up ReportLab for PDF creation
    - Implement generate_report() with all required sections
    - Render health map visualization as image in PDF
    - Create biomarker summary table
    - Add temporal progression chart (when available)
    - Include limitation statements and disclaimers
    - Add generation timestamp and data source labels
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6, 17.2, 17.3_
  
  - [ ] 21.2 Create POST /api/reports/generate endpoint
    - Accept analysis result and patient info
    - Generate PDF using ReportService
    - Return PDF as downloadable file
    - _Requirements: 9.1, 9.5_
  
  - [ ]* 21.3 Write property test for PDF report generation
    - **Property 17: PDF Report Generation**
    - **Validates: Requirements 9.1**
  
  - [ ]* 21.4 Write property test for report completeness
    - **Property 18: Report Completeness**
    - **Validates: Requirements 9.2, 9.3, 9.6**
  
  - [ ]* 21.5 Write property test for temporal report content
    - **Property 19: Temporal Report Content**
    - **Validates: Requirements 9.4**
  
  - [ ]* 21.6 Write unit tests for report generation
    - Test with and without temporal data
    - Test error handling for generation failures
    - Verify PDF is valid and readable
    - _Requirements: 9.5, 16.2_

- [ ] 22. Implement export functionality in frontend
  - [ ] 22.1 Add export buttons and handlers
    - Create export button in Dashboard
    - Implement PDF report download
    - Implement CSV export for raw embedding data
    - Add export confirmation and error handling
    - _Requirements: 17.1, 17.4_
  
  - [ ]* 22.2 Write property test for export completeness
    - **Property 30: Export Completeness**
    - **Validates: Requirements 17.2, 17.3**
  
  - [ ]* 22.3 Write unit tests for export functionality
    - Test PDF download
    - Test CSV download
    - Test error handling
    - _Requirements: 17.1, 17.4_

- [ ] 23. Implement multi-modal data integration validation
  - [ ]* 23.1 Write property test for multi-modal data integration
    - **Property 26: Multi-Modal Data Integration**
    - **Validates: Requirements 15.1**
  
  - [ ]* 23.2 Write integration test for complete analysis pipeline
    - Test that cytokines, clinical markers, and temporal data are all used
    - Verify competitive differentiators are functional
    - _Requirements: 15.1, 15.3_

- [ ] 24. Implement embedding storage and retrieval
  - [ ] 24.1 Add embedding persistence layer
    - Create simple file-based or SQLite storage for embeddings
    - Implement store_embedding() with timestamp
    - Implement retrieve_embeddings() for patient history
    - _Requirements: 2.4_
  
  - [ ]* 24.2 Write property test for embedding storage round-trip
    - **Property 5: Embedding Storage Round-Trip**
    - **Validates: Requirements 2.4**
  
  - [ ]* 24.3 Write unit tests for storage operations
    - Test storing and retrieving embeddings
    - Test querying by patient ID and timestamp
    - _Requirements: 2.4_

- [ ] 25. Final integration and end-to-end testing
  - [ ]* 25.1 Write end-to-end tests for complete user flows
    - Test: Select persona → View analysis → Generate report
    - Test: Load temporal persona → View progression → Export data
    - Test: All 5 personas load and analyze correctly
    - Test: Error handling across full stack
    - _Requirements: 10.2, 10.3, 16.1, 16.2, 16.3_
  
  - [ ]* 25.2 Perform demo validation testing
    - Verify all 5 personas work in demo
    - Verify persona switching is fast (<1 second)
    - Verify all competitive differentiators are visible
    - Verify no errors during typical demo sequence
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 26. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation follows an incremental approach: core models → analysis → visualization → reports
- Checkpoints ensure validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and integration points
- Backend uses Python with FastAPI, PyTorch, SHAP, scikit-learn, UMAP
- Frontend uses React with TypeScript, D3.js, Recharts, Tailwind CSS
- All demo data is synthetic or from publicly available NHANES dataset
- System includes prominent disclaimers that this is a research prototype
