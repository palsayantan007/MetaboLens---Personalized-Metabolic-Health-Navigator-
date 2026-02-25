"""
Persona service for MetaboLens - demo patient stories
"""
import numpy as np
from datetime import datetime, timedelta
from typing import List, Optional
from ..models.schemas import (
    BiomarkerPanel, Embedding, ClusterAssignment, RiskScore,
    Persona, PersonaSummary, TemporalPoint
)
from .data_service import DataService
from .embedding_service import EmbeddingService
from .analysis_service import AnalysisService


class PersonaService:
    """Manages demo personas representing different health states"""
    
    def __init__(self):
        self.data_service = DataService()
        self.embedding_service = EmbeddingService()
        self.analysis_service = AnalysisService()
        self._personas: List[Persona] = []
        self._initialize_personas()
    
    def _initialize_personas(self):
        """Create 5 representative personas from real cluster data"""
        
        # Define persona configurations
        persona_configs = [
            {
                "id": "healthy-baseline",
                "name": "Alex Chen",
                "description": "32-year-old fitness enthusiast with excellent metabolic health",
                "health_state": "healthy",
                "target_cluster": 0,  # Healthy Baseline cluster
                "risk_level": "low"
            },
            {
                "id": "pre-diabetic",
                "name": "Maria Rodriguez",
                "description": "48-year-old with early signs of insulin resistance and pre-diabetic markers",
                "health_state": "pre-diabetic",
                "target_cluster": 3,  # Early Insulin Resistance cluster
                "risk_level": "moderate"
            },
            {
                "id": "metabolic-syndrome",
                "name": "James Wilson",
                "description": "55-year-old with metabolic syndrome showing multiple risk factors",
                "health_state": "metabolic_syndrome",
                "target_cluster": 5,  # Metabolic Syndrome cluster
                "risk_level": "high"
            },
            {
                "id": "immune-dysregulation",
                "name": "Sarah Johnson",
                "description": "41-year-old with elevated inflammatory markers and Th17 imbalance",
                "health_state": "immune_dysregulation",
                "target_cluster": 4,  # Immune Activation cluster
                "risk_level": "moderate"
            },
            {
                "id": "improving-trajectory",
                "name": "David Kim",
                "description": "45-year-old showing positive response to lifestyle intervention",
                "health_state": "improving",
                "target_cluster": 6,  # Active Recovery cluster
                "risk_level": "moderate"
            }
        ]
        
        for config in persona_configs:
            persona = self._create_persona(config)
            if persona:
                self._personas.append(persona)
    
    def _create_persona(self, config: dict) -> Optional[Persona]:
        """Create a persona from configuration"""
        try:
            # Get representative sample from target cluster
            cluster_id = config['target_cluster']
            samples = self.data_service.get_samples_by_cluster(cluster_id, limit=10)
            
            if samples.empty:
                # Fallback to any available cluster
                samples = self.data_service.embeddings.sample(1)
            
            # Get embedding from first sample
            sample = samples.iloc[0]
            emb_cols = [c for c in samples.columns if c.startswith('emb_')]
            emb_vector = sample[emb_cols].values
            
            # Create embedding
            position = self.data_service.get_2d_position(emb_vector)
            embedding = Embedding(
                vector=emb_vector.tolist(),
                health_map_position=position
            )
            
            # Create synthetic biomarkers based on health state
            biomarkers = self._generate_biomarkers(config['health_state'], config['risk_level'])
            
            # Get cluster assignment
            cluster_info = self.data_service.get_cluster_description(cluster_id)
            cluster = ClusterAssignment(
                cluster_id=cluster_id,
                cluster_name=cluster_info['name'],
                confidence=0.85,
                description=cluster_info['description'],
                is_healthy=cluster_info['is_healthy']
            )
            
            # Calculate risk score
            risk_score = self._calculate_persona_risk(config['risk_level'])
            
            # Generate temporal history for improving trajectory persona
            history = []
            if config['id'] == 'improving-trajectory':
                history = self._generate_temporal_history(cluster_id, emb_vector)
            
            return Persona(
                id=config['id'],
                name=config['name'],
                description=config['description'],
                health_state=config['health_state'],
                biomarkers=biomarkers,
                embedding=embedding,
                cluster=cluster,
                risk_score=risk_score,
                history=history
            )
            
        except Exception as e:
            print(f"Error creating persona {config['id']}: {e}")
            return None
    
    def _generate_biomarkers(self, health_state: str, risk_level: str) -> BiomarkerPanel:
        """Generate synthetic biomarkers based on health state"""
        np.random.seed(hash(health_state) % 2**31)
        
        # Base values with normal distribution
        cytokines = np.random.normal(50, 15, 103).tolist()
        
        # Clinical marker base values (realistic ranges)
        clinical_base = {
            'healthy': [85, 5.2, 8, 1.2, 22, 115, 75, 180, 90, 55, 100, 25, 22, 0.9],
            'pre-diabetic': [105, 6.0, 15, 2.8, 27, 130, 82, 210, 130, 42, 180, 35, 28, 1.0],
            'metabolic_syndrome': [125, 6.8, 22, 4.5, 32, 145, 92, 245, 160, 35, 250, 55, 45, 1.1],
            'immune_dysregulation': [95, 5.6, 12, 2.0, 25, 125, 80, 195, 110, 48, 140, 40, 35, 0.95],
            'improving': [98, 5.8, 11, 2.2, 26, 125, 78, 200, 115, 50, 135, 32, 28, 0.95]
        }
        
        clinical = clinical_base.get(health_state, clinical_base['healthy'])
        
        # Add noise to clinical markers
        clinical = [v + np.random.normal(0, v * 0.05) for v in clinical]
        
        # Adjust cytokines based on health state
        if health_state == 'immune_dysregulation':
            # Elevate inflammatory cytokines (IL-6, TNF-α, IL-17A, etc.)
            cytokines[5] *= 1.8   # IL-6
            cytokines[23] *= 1.6  # TNF-α
            cytokines[13] *= 2.0  # IL-17A
            cytokines[100] *= 1.5 # CRP
        elif health_state == 'metabolic_syndrome':
            cytokines[5] *= 1.5   # IL-6
            cytokines[23] *= 1.4  # TNF-α
            cytokines[62] *= 1.3  # Leptin
        elif health_state == 'pre-diabetic':
            cytokines[5] *= 1.3   # IL-6
            cytokines[62] *= 1.2  # Leptin
        
        return BiomarkerPanel(
            cytokines=cytokines,
            clinical_markers=clinical,
            timestamp=datetime.now()
        )
    
    def _calculate_persona_risk(self, risk_level: str) -> RiskScore:
        """Calculate risk score based on risk level"""
        risk_map = {
            'low': (0.18, 0.12, 0.25),
            'moderate': (0.52, 0.42, 0.62),
            'high': (0.78, 0.68, 0.88)
        }
        
        value, ci_low, ci_high = risk_map.get(risk_level, (0.5, 0.4, 0.6))
        
        return RiskScore(
            value=value,
            level=RiskScore.get_level(value),
            confidence_interval=(ci_low, ci_high),
            contributing_factors=[]
        )
    
    def _generate_temporal_history(self, current_cluster: int, current_embedding: np.ndarray) -> List[TemporalPoint]:
        """Generate temporal history showing improvement"""
        history = []
        base_time = datetime.now() - timedelta(days=180)
        
        # Create 4 historical timepoints showing improvement
        risk_progression = [0.72, 0.62, 0.52, 0.42]  # Decreasing risk
        
        for i, risk_value in enumerate(risk_progression):
            timestamp = base_time + timedelta(days=i * 45)
            
            # Perturb embedding slightly
            perturbed_emb = current_embedding + np.random.normal(0, 0.5, len(current_embedding))
            position = self.data_service.get_2d_position(perturbed_emb)
            
            embedding = Embedding(
                vector=perturbed_emb.tolist(),
                timestamp=timestamp,
                health_map_position=position
            )
            
            # Historical cluster (higher risk earlier)
            hist_cluster = current_cluster + (3 - i)
            cluster_info = self.data_service.get_cluster_description(min(hist_cluster, 27))
            
            cluster = ClusterAssignment(
                cluster_id=hist_cluster,
                cluster_name=cluster_info['name'],
                confidence=0.80,
                description=cluster_info['description'],
                is_healthy=False
            )
            
            risk_score = RiskScore(
                value=risk_value,
                level=RiskScore.get_level(risk_value),
                confidence_interval=(risk_value - 0.1, risk_value + 0.1),
                contributing_factors=[]
            )
            
            history.append(TemporalPoint(
                timestamp=timestamp,
                embedding=embedding,
                health_map_position=position,
                cluster=cluster,
                risk_score=risk_score
            ))
        
        return history
    
    def get_all_personas(self) -> List[PersonaSummary]:
        """Get summary of all personas"""
        return [
            PersonaSummary(
                id=p.id,
                name=p.name,
                description=p.description,
                health_state=p.health_state
            )
            for p in self._personas
        ]
    
    def get_persona(self, persona_id: str) -> Optional[Persona]:
        """Get full persona by ID"""
        for persona in self._personas:
            if persona.id == persona_id:
                return persona
        return None
    
    def get_persona_analysis(self, persona_id: str) -> Optional[dict]:
        """Get complete analysis for a persona"""
        persona = self.get_persona(persona_id)
        if not persona:
            return None
        
        # Calculate SHAP values
        risk_factors = self.analysis_service.calculate_shap_values(persona.biomarkers)
        top_factors = self.analysis_service.get_top_risk_factors(risk_factors, 10)
        
        # Generate recommendations
        recommendations = self.analysis_service.generate_recommendations(risk_factors, persona.cluster)
        
        return {
            'persona': persona,
            'top_risk_factors': top_factors,
            'recommendations': recommendations
        }
