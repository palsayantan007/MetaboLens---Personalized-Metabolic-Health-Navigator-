from .data_loader import data_store
import pandas as pd
import numpy as np

class PersonaService:
    def __init__(self):
        # We define 5 representative personas mapped directly to clusters from `cluster_summary.csv`
        # Based on the research paper:
        # Clusters 0-7: Normal glucose tolerance (Healthy)
        # Clusters 8-17: Prediabetic / Intermediate
        # Clusters 18-27: Diabetic (Severe)
        self.persona_definitions = [
            {
                "id": "p1", "name": "Healthy Baseline", "cluster": 0, "health_state": "Normal Glucose Tolerance",
                "risk_factors": [{"marker": "Fasting Glucose", "value": -0.8, "type": "reduced"}, {"marker": "IL-10", "value": 0.5, "type": "elevated"}, {"marker": "HbA1c", "value": -0.6, "type": "reduced"}]
            },
            {
                "id": "p2", "name": "Pre-diabetic", "cluster": 9, "health_state": "Intermediate Risk",
                "risk_factors": [{"marker": "Insulin Resistance (SSPG)", "value": 1.2, "type": "elevated"}, {"marker": "IL-6", "value": 0.8, "type": "elevated"}, {"marker": "TNF-a", "value": 0.4, "type": "elevated"}]
            },
            {
                "id": "p3", "name": "Immune Dysregulation", "cluster": 14, "health_state": "Discordant Phenotype",
                "risk_factors": [{"marker": "Th17 Cytokines", "value": 2.1, "type": "elevated"}, {"marker": "CRP", "value": 1.5, "type": "elevated"}, {"marker": "Adiponectin", "value": -1.2, "type": "reduced"}]
            },
            {
                "id": "p4", "name": "Metabolic Syndrome", "cluster": 19, "health_state": "High Risk Progression",
                "risk_factors": [{"marker": "Triglycerides", "value": 1.8, "type": "elevated"}, {"marker": "HbA1c", "value": 1.3, "type": "elevated"}, {"marker": "IL-1b", "value": 1.1, "type": "elevated"}]
            },
            {
                "id": "p5", "name": "Severe Diabetic", "cluster": 27, "health_state": "Severe Insulin Resistance",
                "risk_factors": [{"marker": "Fasting Glucose", "value": 2.5, "type": "elevated"}, {"marker": "HbA1c", "value": 2.8, "type": "elevated"}, {"marker": "IL-6", "value": 2.2, "type": "elevated"}]
            }
        ]
    
    def get_all_personas(self):
        return self.persona_definitions

    def get_persona_data(self, persona_id: str):
        persona = next((p for p in self.persona_definitions if p["id"] == persona_id), None)
        if not persona:
            return None
        
        # Load the 64d embedding data
        data = data_store.embeddings_64d
        if data is None:
            return {"error": "Embeddings data not loaded"}
        
        # In the provided dataset, 'cluster' column denotes the HDBSCAN assignment
        if 'cluster' in data.columns:
            # Pick a representative sample (e.g., the first one in the dataset) from this cluster
            cluster_samples = data[data['cluster'] == persona['cluster']]
            if not cluster_samples.empty:
                sample = cluster_samples.iloc[0].to_dict()
                return {
                    "persona": persona,
                    "sample_data": sample
                }
        
        return {"error": "Cluster data unmapped in current dataset"}

persona_service = PersonaService()
