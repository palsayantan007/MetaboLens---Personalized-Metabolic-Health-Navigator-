"""
Embedding service for MetaboLens
"""
import numpy as np
from typing import List, Optional, Tuple
from ..models.schemas import BiomarkerPanel, Embedding, ClusterAssignment
from .data_service import DataService


class EmbeddingService:
    """Handles embedding retrieval and cluster assignment"""
    
    def __init__(self):
        self.data_service = DataService()
        self._embedding_dim = 64  # Using UMAP-reduced embeddings
    
    def validate_biomarkers(self, biomarkers: BiomarkerPanel) -> Tuple[bool, List[str]]:
        """Validate biomarker panel structure and values"""
        errors = []
        
        # Check cytokines count
        if len(biomarkers.cytokines) != 103:
            errors.append(f"Expected 103 cytokines, got {len(biomarkers.cytokines)}")
        
        # Check clinical markers count
        if len(biomarkers.clinical_markers) != 14:
            errors.append(f"Expected 14 clinical markers, got {len(biomarkers.clinical_markers)}")
        
        # Check for NaN/Inf values
        all_values = biomarkers.cytokines + biomarkers.clinical_markers
        for i, v in enumerate(all_values):
            if np.isnan(v) or np.isinf(v):
                errors.append(f"Invalid value at position {i}: {v}")
        
        return len(errors) == 0, errors
    
    def normalize_biomarkers(self, biomarkers: BiomarkerPanel) -> np.ndarray:
        """Normalize biomarker values using z-score normalization"""
        values = np.array(biomarkers.to_array())
        
        # Simple z-score normalization
        mean = np.mean(values)
        std = np.std(values)
        if std > 0:
            normalized = (values - mean) / std
        else:
            normalized = values - mean
            
        return normalized
    
    def generate_embedding(self, biomarkers: BiomarkerPanel) -> Embedding:
        """
        Generate embedding from biomarker panel.
        In production, this would use the trained contrastive model.
        For this prototype, we use a mapping approach based on normalized features.
        """
        # Normalize input
        normalized = self.normalize_biomarkers(biomarkers)
        
        # Generate pseudo-embedding based on feature statistics
        # This simulates what the contrastive model would produce
        embedding_vector = self._generate_pseudo_embedding(normalized)
        
        # Get 2D position
        position = self.data_service.get_2d_position(embedding_vector)
        
        return Embedding(
            vector=embedding_vector.tolist(),
            timestamp=biomarkers.timestamp,
            patient_id=biomarkers.patient_id,
            health_map_position=position
        )
    
    def _generate_pseudo_embedding(self, normalized_features: np.ndarray) -> np.ndarray:
        """
        Generate a pseudo-embedding that maps to existing cluster space.
        Uses a combination of feature statistics to create meaningful embeddings.
        """
        np.random.seed(int(np.sum(np.abs(normalized_features)) * 1000) % 2**31)
        
        # Create embedding based on feature patterns
        embedding = np.zeros(self._embedding_dim)
        
        # Cytokine features (first 103)
        cytokine_features = normalized_features[:103]
        clinical_features = normalized_features[103:]
        
        # Encode cytokine patterns
        cytokine_mean = np.mean(cytokine_features)
        cytokine_std = np.std(cytokine_features)
        cytokine_max = np.max(cytokine_features)
        
        # Encode clinical patterns  
        clinical_mean = np.mean(clinical_features)
        clinical_std = np.std(clinical_features)
        
        # Build embedding dimensions
        for i in range(self._embedding_dim):
            if i < 20:
                # Cytokine-dominant dimensions
                idx = (i * 5) % 103
                embedding[i] = cytokine_features[idx] * 0.5 + cytokine_mean + np.random.normal(0, 0.1)
            elif i < 40:
                # Mixed dimensions
                embedding[i] = cytokine_mean * 0.3 + clinical_mean * 0.3 + np.random.normal(0, 0.2)
            elif i < 55:
                # Clinical-dominant dimensions
                idx = (i - 40) % 14
                embedding[i] = clinical_features[idx] * 0.5 + clinical_mean + np.random.normal(0, 0.1)
            else:
                # Interaction dimensions
                embedding[i] = (cytokine_std + clinical_std) * 0.5 + np.random.normal(0, 0.3)
        
        # Scale to match existing embedding space
        embedding = embedding * 2 + 5
        
        return embedding
    
    def assign_cluster(self, embedding: Embedding) -> ClusterAssignment:
        """Assign embedding to nearest cluster using nearest neighbor"""
        emb_vector = np.array(embedding.vector)
        
        # Find nearest cluster centroid
        best_cluster = 0
        best_distance = float('inf')
        
        for cluster_id in range(self.data_service.num_clusters):
            centroid = self.data_service.get_cluster_centroid(cluster_id)
            if centroid is not None:
                distance = np.linalg.norm(emb_vector - centroid)
                if distance < best_distance:
                    best_distance = distance
                    best_cluster = cluster_id
        
        # Calculate confidence based on distance
        # Smaller distance = higher confidence
        confidence = max(0.0, min(1.0, 1.0 - (best_distance / 20.0)))
        
        # Get cluster description
        cluster_info = self.data_service.get_cluster_description(best_cluster)
        
        return ClusterAssignment(
            cluster_id=best_cluster,
            cluster_name=cluster_info['name'],
            confidence=round(confidence, 3),
            description=cluster_info['description'],
            is_healthy=cluster_info['is_healthy']
        )
    
    def get_embedding_from_sample(self, sample_id: str) -> Optional[Embedding]:
        """Get embedding for an existing sample"""
        emb_vector = self.data_service.get_embedding_by_sample(sample_id)
        if emb_vector is None:
            return None
        
        position = self.data_service.get_2d_position(emb_vector)
        
        return Embedding(
            vector=emb_vector.tolist(),
            health_map_position=position
        )
    
    def batch_generate_embeddings(self, biomarkers_list: List[BiomarkerPanel]) -> List[Embedding]:
        """Generate embeddings for multiple biomarker panels"""
        return [self.generate_embedding(b) for b in biomarkers_list]
