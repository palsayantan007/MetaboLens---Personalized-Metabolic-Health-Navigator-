# MetaboLens Backend

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- `GET /api/health` - Health check
- `POST /api/analyze` - Analyze biomarker panel
- `GET /api/personas` - List demo personas
- `GET /api/personas/{id}` - Get persona details
- `GET /api/personas/{id}/analysis` - Get persona analysis
- `GET /api/health-map` - Get health map data
- `POST /api/reports/generate` - Generate PDF report
- `GET /api/model-info` - Get model metrics
