import pandas as pd
import os
import json

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))

class DataLoader:
    def __init__(self):
        self.embeddings_256d = None
        self.embeddings_64d = None
        self.cluster_summary = None
        self.performance_metrics = None
        self._load_data()

    def _load_data(self):
        try:
            # The cluster output file is actually pre-processed existing data
            cluster_path = os.path.join(DATA_DIR, "cluster_summary.csv")
            if os.path.exists(cluster_path):
                self.cluster_summary = pd.read_csv(cluster_path)
            
            emb_64d_path = os.path.join(DATA_DIR, "embeddings.csv")
            if os.path.exists(emb_64d_path):
                self.embeddings_64d = pd.read_csv(emb_64d_path)
            
            emb_256d_path = os.path.join(DATA_DIR, "embeddings_original_256d.csv")
            if os.path.exists(emb_256d_path):
                self.embeddings_256d = pd.read_csv(emb_256d_path)
                
            metrics_path = os.path.join(DATA_DIR, "performance_metrics.json")
            if os.path.exists(metrics_path):
                with open(metrics_path, "r") as f:
                    self.performance_metrics = json.load(f)

            print("Data loaded successfully.")
        except Exception as e:
            print(f"Error loading data: {e}")

# Provide a singleton instance
data_store = DataLoader()
