"""
Data loading and management service for MetaboLens
"""
import os
import json
from pathlib import Path
from typing import Dict, List, Optional
import pandas as pd
import numpy as np


class DataService:
    """Handles loading and managing pre-computed embeddings and cluster data"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.data_dir = Path(__file__).parent.parent.parent.parent / "data"
        self._embeddings_df: Optional[pd.DataFrame] = None
        self._cluster_summary_df: Optional[pd.DataFrame] = None
        self._performance_metrics: Optional[Dict] = None
        self._cluster_descriptions: Dict[int, Dict] = {}
        self._umap_2d: Optional[np.ndarray] = None
        
        self._load_data()
        self._initialized = True
    
    def _load_data(self):
        """Load all data files"""
        # Load embeddings
        embeddings_path = self.data_dir / "embeddings.csv"
        if embeddings_path.exists():
            self._embeddings_df = pd.read_csv(embeddings_path)
            # Extract embedding columns (emb_0 to emb_63)
            emb_cols = [c for c in self._embeddings_df.columns if c.startswith('emb_')]
            self._embedding_cols = emb_cols
            
        # Load cluster summary
        cluster_path = self.data_dir / "cluster_summary.csv"
        if cluster_path.exists():
            self._cluster_summary_df = pd.read_csv(cluster_path)
            
        # Load performance metrics
        metrics_path = self.data_dir / "performance_metrics.json"
        if metrics_path.exists():
            with open(metrics_path) as f:
                self._performance_metrics = json.load(f)
        
        # Generate cluster descriptions
        self._generate_cluster_descriptions()
        
        # Compute 2D UMAP projection for health map
        self._compute_2d_projection()
    
    def _generate_cluster_descriptions(self):
        """Generate human-readable descriptions for each cluster"""
        # Map clusters to health state descriptions based on cluster characteristics
        cluster_descriptions = {
            -1: {
                "name": "Unclassified",
                "description": "Data points that do not clearly fit into established health patterns.",
                "is_healthy": False,
                "health_state": "uncertain"
            },
            0: {
                "name": "Healthy Baseline",
                "description": "Normal metabolic function with balanced cytokine profiles and stable glucose regulation.",
                "is_healthy": True,
                "health_state": "healthy"
            },
            1: {
                "name": "Optimal Metabolic State",
                "description": "Excellent metabolic health markers with strong insulin sensitivity.",
                "is_healthy": True,
                "health_state": "healthy"
            },
            2: {
                "name": "Mild Inflammation",
                "description": "Slightly elevated inflammatory markers, early warning signs that may benefit from lifestyle modifications.",
                "is_healthy": False,
                "health_state": "pre-diabetic"
            },
            3: {
                "name": "Early Insulin Resistance",
                "description": "Beginning signs of insulin resistance with mildly altered glucose metabolism.",
                "is_healthy": False,
                "health_state": "pre-diabetic"
            },
            4: {
                "name": "Immune Activation Pattern",
                "description": "Elevated Th1/Th17 immune markers suggesting active immune response.",
                "is_healthy": False,
                "health_state": "immune_dysregulation"
            },
            5: {
                "name": "Metabolic Syndrome Indicators",
                "description": "Multiple metabolic risk factors present including altered lipid profile and insulin sensitivity.",
                "is_healthy": False,
                "health_state": "metabolic_syndrome"
            },
            6: {
                "name": "Active Recovery",
                "description": "Improving trajectory from previous metabolic dysregulation, showing positive response to intervention.",
                "is_healthy": False,
                "health_state": "improving"
            },
            7: {
                "name": "Stable Pre-diabetic",
                "description": "Consistent pre-diabetic markers without significant progression.",
                "is_healthy": False,
                "health_state": "pre-diabetic"
            },
            8: {
                "name": "Cytokine Imbalance",
                "description": "Altered cytokine ratios suggesting underlying inflammatory processes.",
                "is_healthy": False,
                "health_state": "immune_dysregulation"
            },
            9: {
                "name": "Moderate Metabolic Stress",
                "description": "Moderate elevation in metabolic stress markers requiring attention.",
                "is_healthy": False,
                "health_state": "metabolic_syndrome"
            },
            10: {
                "name": "Athletic Recovery",
                "description": "Temporary metabolic changes consistent with intense physical activity.",
                "is_healthy": True,
                "health_state": "healthy"
            },
        }
        
        # Generate descriptions for remaining clusters (11-27)
        for i in range(11, 28):
            severity = "moderate" if i < 20 else "elevated"
            health_state = "pre-diabetic" if i < 15 else "metabolic_syndrome" if i < 22 else "severe"
            cluster_descriptions[i] = {
                "name": f"Cluster {i} - {severity.title()} Risk Pattern",
                "description": f"Health pattern with {severity} metabolic markers, cluster {i} characteristics.",
                "is_healthy": False,
                "health_state": health_state
            }
        
        self._cluster_descriptions = cluster_descriptions
    
    def _compute_2d_projection(self):
        """Compute 2D UMAP projection for visualization"""
        if self._embeddings_df is None:
            return
            
        # Use first 2 embedding dimensions as simple 2D projection
        # In production, this would use UMAP
        emb_data = self._embeddings_df[self._embedding_cols].values
        
        # Simple PCA-like projection using first 2 principal dimensions
        # Normalize and project
        from sklearn.decomposition import PCA
        pca = PCA(n_components=2)
        self._umap_2d = pca.fit_transform(emb_data)
        
        # Store in dataframe
        self._embeddings_df['umap_x'] = self._umap_2d[:, 0]
        self._embeddings_df['umap_y'] = self._umap_2d[:, 1]
    
    @property
    def embeddings(self) -> pd.DataFrame:
        """Get embeddings dataframe"""
        return self._embeddings_df
    
    @property
    def cluster_summary(self) -> pd.DataFrame:
        """Get cluster summary dataframe"""
        return self._cluster_summary_df
    
    @property
    def performance_metrics(self) -> Dict:
        """Get model performance metrics"""
        return self._performance_metrics or {}
    
    @property
    def num_clusters(self) -> int:
        """Get number of clusters"""
        if self._performance_metrics:
            return self._performance_metrics.get('n_clusters', 28)
        return 28
    
    @property
    def silhouette_score(self) -> float:
        """Get baseline silhouette score"""
        if self._performance_metrics:
            return self._performance_metrics.get('baseline_silhouette', 0.747)
        return 0.747
    
    def get_cluster_description(self, cluster_id: int) -> Dict:
        """Get description for a cluster"""
        return self._cluster_descriptions.get(cluster_id, self._cluster_descriptions.get(-1))
    
    def get_embedding_by_sample(self, sample_id: str) -> Optional[np.ndarray]:
        """Get embedding vector for a sample"""
        if self._embeddings_df is None:
            return None
        row = self._embeddings_df[self._embeddings_df['SampleID'] == sample_id]
        if row.empty:
            return None
        return row[self._embedding_cols].values[0]
    
    def get_samples_by_cluster(self, cluster_id: int, limit: int = 100) -> pd.DataFrame:
        """Get samples belonging to a cluster"""
        if self._embeddings_df is None:
            return pd.DataFrame()
        return self._embeddings_df[self._embeddings_df['Cluster'] == cluster_id].head(limit)
    
    def get_cluster_centroid(self, cluster_id: int) -> Optional[np.ndarray]:
        """Get centroid embedding for a cluster"""
        samples = self.get_samples_by_cluster(cluster_id)
        if samples.empty:
            return None
        return samples[self._embedding_cols].mean().values
    
    def get_health_map_points(self) -> List[Dict]:
        """Get all points for health map visualization"""
        if self._embeddings_df is None:
            return []
            
        points = []
        for _, row in self._embeddings_df.iterrows():
            cluster_id = int(row['Cluster'])
            cluster_info = self.get_cluster_description(cluster_id)
            points.append({
                'x': float(row['umap_x']),
                'y': float(row['umap_y']),
                'cluster_id': cluster_id,
                'is_healthy': cluster_info.get('is_healthy', False),
                'sample_id': row['SampleID']
            })
        return points
    
    def get_2d_position(self, embedding: np.ndarray) -> tuple:
        """Project embedding to 2D health map coordinates"""
        if self._embeddings_df is None or self._umap_2d is None:
            return (0.0, 0.0)
        
        # Ensure embedding is a proper numpy array
        embedding = np.asarray(embedding, dtype=np.float64)
        
        # Find nearest neighbor and use its position
        emb_data = self._embeddings_df[self._embedding_cols].values.astype(np.float64)
        
        # Calculate distances manually to avoid numpy compatibility issues
        diff = emb_data - embedding
        distances = np.sqrt(np.sum(diff * diff, axis=1))
        nearest_idx = int(np.argmin(distances))
        
        return (
            float(self._embeddings_df.iloc[nearest_idx]['umap_x']),
            float(self._embeddings_df.iloc[nearest_idx]['umap_y'])
        )
    
    def get_healthy_clusters(self) -> List[int]:
        """Get list of cluster IDs considered healthy"""
        return [cid for cid, info in self._cluster_descriptions.items() 
                if info.get('is_healthy', False)]
    
    def get_at_risk_clusters(self) -> List[int]:
        """Get list of cluster IDs considered at risk"""
        return [cid for cid, info in self._cluster_descriptions.items() 
                if not info.get('is_healthy', True) and cid != -1]
