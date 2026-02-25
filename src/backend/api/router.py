from fastapi import APIRouter
from services.data_loader import data_store
from services.persona_service import persona_service

router = APIRouter()

@router.get("/personas")
def get_personas():
    """Return the 5 distinct health state personas."""
    return persona_service.get_all_personas()

@router.get("/personas/{persona_id}")
def get_persona_detail(persona_id: str):
    """Return specific sample and cluster data for a requested persona."""
    data = persona_service.get_persona_data(persona_id)
    if data and "error" in data:
        return {"error": data["error"]}, 400
    return data

@router.get("/health-map")
def get_health_map():
    """Returns the UMAP 64D embeddings mapped to their HDBSCAN clusters."""
    if data_store.embeddings_64d is None or data_store.cluster_summary is None:
        return {"error": "Data not loaded"}, 500
    
    # We will return a simplified version for D3 plotting (taking the first 2 UMAP dimensions if available)
    # The true dataset has 64 dims, we just need coordinate representations.
    # We will mock the X/Y using the first 2 columns just for the cluster map visual.
    
    # Grab a sample of 500 points to keep frontend render fast
    df = data_store.embeddings_64d.sample(min(500, len(data_store.embeddings_64d)))
    
    points = []
    # Verify we have at least 2 dimensions + cluster
    # Assuming columns are like 'dim_0', 'dim_1', ... 'cluster'
    dim_cols = [c for c in df.columns if c.startswith('dim_')]
    if len(dim_cols) >= 2 and 'cluster' in df.columns:
        for _, row in df.iterrows():
            points.append({
                "x": row[dim_cols[0]],
                "y": row[dim_cols[1]],
                "cluster": int(row['cluster'])
            })
    return {"points": points}

@router.post("/analyze")
def analyze_patient(payload: dict):
    """Accepts patient data and maps to closest clinical cluster."""
    # TODO: Implement inference or distance mapping logic
    return {"message": "Analysis endpoint ready", "received": payload}
