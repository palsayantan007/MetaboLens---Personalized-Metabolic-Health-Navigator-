"""
API endpoints for MetaboLens
"""
import base64
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from ..models.schemas import (
    AnalysisRequest, AnalysisResult, PersonaSummary, Persona,
    HealthMapData, HealthMapPoint, ReportRequest, ReportResponse,
    TemporalAnalysis, TemporalPoint
)
from ..services import (
    DataService, EmbeddingService, AnalysisService, 
    PersonaService, ReportService
)

router = APIRouter(prefix="/api", tags=["MetaboLens API"])

# Initialize services
data_service = DataService()
embedding_service = EmbeddingService()
analysis_service = AnalysisService()
persona_service = PersonaService()
report_service = ReportService()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_biomarkers(request: AnalysisRequest):
    """
    Perform complete health analysis on biomarker panel.
    Returns embedding, cluster assignment, risk score, top risk factors, and recommendations.
    """
    try:
        # Validate biomarkers
        is_valid, errors = embedding_service.validate_biomarkers(request.biomarkers)
        if not is_valid:
            raise HTTPException(status_code=400, detail=f"Invalid biomarkers: {errors}")
        
        # Generate embedding
        embedding = embedding_service.generate_embedding(request.biomarkers)
        
        # Assign cluster
        cluster = embedding_service.assign_cluster(embedding)
        
        # Calculate risk score
        risk_score = analysis_service.calculate_risk_score(embedding, cluster, request.biomarkers)
        
        # Calculate SHAP values and get top risk factors
        all_risk_factors = analysis_service.calculate_shap_values(request.biomarkers)
        top_risk_factors = analysis_service.get_top_risk_factors(all_risk_factors, 10)
        
        # Generate recommendations
        recommendations = analysis_service.generate_recommendations(all_risk_factors, cluster)
        
        return AnalysisResult(
            embedding=embedding,
            cluster=cluster,
            risk_score=risk_score,
            top_risk_factors=top_risk_factors,
            recommendations=recommendations,
            health_map_position=embedding.health_map_position
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/personas", response_model=List[PersonaSummary])
async def get_personas():
    """Get list of demo personas"""
    return persona_service.get_all_personas()


@router.get("/personas/{persona_id}", response_model=Persona)
async def get_persona(persona_id: str):
    """Get complete biomarker data for a persona"""
    persona = persona_service.get_persona(persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found")
    return persona


@router.get("/personas/{persona_id}/analysis")
async def get_persona_analysis(persona_id: str):
    """Get complete analysis for a persona including risk factors and recommendations"""
    result = persona_service.get_persona_analysis(persona_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found")
    
    persona = result['persona']
    
    return AnalysisResult(
        embedding=persona.embedding,
        cluster=persona.cluster,
        risk_score=persona.risk_score,
        top_risk_factors=result['top_risk_factors'],
        recommendations=result['recommendations'],
        health_map_position=persona.embedding.health_map_position
    )


@router.get("/health-map", response_model=HealthMapData)
async def get_health_map():
    """Get reference health map data for visualization"""
    points = data_service.get_health_map_points()
    
    # Convert to HealthMapPoint objects
    health_map_points = [
        HealthMapPoint(
            x=p['x'],
            y=p['y'],
            cluster_id=p['cluster_id'],
            is_healthy=p['is_healthy'],
            sample_id=p['sample_id']
        )
        for p in points
    ]
    
    # Get cluster info
    cluster_info = {}
    for cluster_id in range(-1, data_service.num_clusters):
        info = data_service.get_cluster_description(cluster_id)
        cluster_info[str(cluster_id)] = info
    
    return HealthMapData(
        reference_points=health_map_points,
        cluster_info=cluster_info,
        healthy_clusters=data_service.get_healthy_clusters(),
        at_risk_clusters=data_service.get_at_risk_clusters()
    )


@router.post("/temporal-analysis", response_model=TemporalAnalysis)
async def analyze_temporal(persona_id: str):
    """Analyze temporal progression for a persona with history"""
    persona = persona_service.get_persona(persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found")
    
    if not persona.history:
        raise HTTPException(status_code=400, detail="No temporal history available for this persona")
    
    # Extract data from history
    embeddings = [tp.embedding for tp in persona.history]
    clusters = [tp.cluster for tp in persona.history]
    risk_scores = [tp.risk_score for tp in persona.history]
    
    # Analyze temporal pattern
    velocity, direction, trend = analysis_service.analyze_temporal(embeddings, clusters, risk_scores)
    
    return TemporalAnalysis(
        timepoints=persona.history,
        velocity=velocity,
        direction=direction,
        trend_analysis=trend
    )


@router.post("/reports/generate")
async def generate_report(request: ReportRequest):
    """Generate PDF clinician report"""
    try:
        # Generate PDF
        pdf_bytes = report_service.generate_report(
            analysis=request.analysis_result,
            patient_name=request.patient_name,
            patient_id=request.patient_id,
            temporal_data=request.temporal_data
        )
        
        # Return as downloadable PDF
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=metabolens_report_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@router.get("/model-info")
async def get_model_info():
    """Get model performance metrics and information"""
    metrics = data_service.performance_metrics
    
    return {
        "model_type": "Multi-modal Contrastive Learning",
        "training_samples": "1,982 samples from 64 subjects",
        "silhouette_score": metrics.get('baseline_silhouette', 0.747),
        "validation_silhouette": metrics.get('validation_silhouette', 0.559),
        "num_clusters": metrics.get('n_clusters', 28),
        "embedding_dim_original": metrics.get('embedding_dim_original', 256),
        "embedding_dim_final": metrics.get('embedding_dim_final', 64),
        "preprocessing_method": metrics.get('preprocessing_method', 'UMAP-64'),
        "clustering_method": metrics.get('clustering_method', 'HDBSCAN (optimized)'),
        "input_features": {
            "cytokines": 103,
            "clinical_markers": 14,
            "total": 117
        },
        "validated_pathways": ["Th1/Th17 immune signatures", "Glucose metabolism", "Inflammatory response"],
        "data_sources": ["Synthetic data", "NHANES reference ranges"],
        "limitations": [
            "Research prototype requiring clinical validation",
            "Trained on limited subject population",
            "Not intended for diagnostic use"
        ]
    }


@router.get("/clusters")
async def get_clusters():
    """Get all cluster information"""
    clusters = {}
    for cluster_id in range(-1, data_service.num_clusters):
        info = data_service.get_cluster_description(cluster_id)
        clusters[cluster_id] = info
    return {"clusters": clusters}
