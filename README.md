# MetaboLens - Personalized Metabolic Health Navigator

AI-powered platform that transforms complex biomarker panels into actionable health insights using multi-modal contrastive learning.

![Research Prototype](https://img.shields.io/badge/Status-Research%20Prototype-orange)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## Overview

MetaboLens is a research prototype developed for healthcare AI demonstration. It processes 103 cytokines and 14 clinical markers to:

- Generate 128-dimensional health state embeddings
- Classify patients into 28 distinct metabolic health clusters
- Calculate disease progression risk scores
- Identify top contributing biomarkers (SHAP analysis)
- Provide personalized intervention recommendations
- Visualize health trajectories over time

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/api/health

## Features

### Health Assessment Dashboard
- Real-time risk score visualization with confidence intervals
- Interactive health map showing position relative to population
- Top 10 risk factors with impact scores
- Personalized recommendations based on biomarker patterns

### Demo Personas
5 representative patient stories:
1. **Alex Chen** - Healthy Baseline
2. **Maria Rodriguez** - Pre-diabetic
3. **James Wilson** - Metabolic Syndrome
4. **Sarah Johnson** - Immune Dysregulation
5. **David Kim** - Improving Trajectory

### Technical Capabilities
- Multi-modal contrastive learning model
- HDBSCAN clustering (28 clusters, 0.747 silhouette score)
- UMAP dimensionality reduction for visualization
- SHAP-based explainability
- PDF report generation

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                     │
│  Dashboard │ HealthMap │ RiskFactors │ Recommendations      │
│  Professional Healthcare UI │ D3.js Visualizations          │
└─────────────────────────────────────────────────────────────┘
                            │ REST API
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  EmbeddingService │ AnalysisService │ PersonaService        │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  embeddings.csv │ cluster_summary.csv │ Synthetic Personas   │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analyze` | POST | Analyze biomarker panel |
| `/api/personas` | GET | List demo personas |
| `/api/personas/{id}` | GET | Get persona details |
| `/api/personas/{id}/analysis` | GET | Get persona analysis |
| `/api/health-map` | GET | Get health map data |
| `/api/reports/generate` | POST | Generate PDF report |
| `/api/model-info` | GET | Get model metrics |

## Data Sources

- **Embeddings**: 1,982 pre-computed samples from 64 subjects
- **Clusters**: 28 HDBSCAN-discovered health state clusters
- **Reference Data**: NHANES ranges for clinical markers
- **Personas**: Synthetically generated for demonstration

## Model Information

| Metric | Value |
|--------|-------|
| Model Type | Multi-modal Contrastive Learning |
| Training Samples | 1,982 from 64 subjects |
| Silhouette Score | 0.747 |
| Number of Clusters | 28 |
| Input Features | 117 (103 cytokines + 14 clinical) |
| Embedding Dimensions | 256 → 64 (UMAP) |

## Important Disclaimers

⚠️ **Research Prototype**: This system is designed for demonstration and research purposes only.

⚠️ **Not for Clinical Use**: Results require clinical validation before any medical decision-making.

⚠️ **Synthetic Data**: All patient personas use synthetic data generated for demonstration.

## License

MIT License - See LICENSE file for details.

## Acknowledgments

- iHMP (Integrative Human Microbiome Project) for prediabetes cohort reference
- NHANES for clinical marker reference ranges
- Developed for Healthcare AI Hackathon demonstration
