"""
Analysis service for MetaboLens - risk scoring and recommendations
"""
import numpy as np
from typing import List, Tuple
from ..models.schemas import (
    BiomarkerPanel, Embedding, ClusterAssignment, 
    RiskScore, RiskFactor, Intervention
)
from .data_service import DataService


# Biomarker names for the 103 cytokines and 14 clinical markers
CYTOKINE_NAMES = [
    "IL-1β", "IL-1ra", "IL-2", "IL-4", "IL-5", "IL-6", "IL-7", "IL-8", "IL-9", "IL-10",
    "IL-12p70", "IL-13", "IL-15", "IL-17A", "IL-17F", "IL-18", "IL-21", "IL-22", "IL-23", "IL-27",
    "IFN-α", "IFN-β", "IFN-γ", "TNF-α", "TNF-β", "TGF-β1", "TGF-β2", "TGF-β3", "GM-CSF", "G-CSF",
    "M-CSF", "VEGF", "PDGF-BB", "FGF-basic", "EGF", "HGF", "NGF", "BDNF", "CCL2/MCP-1", "CCL3/MIP-1α",
    "CCL4/MIP-1β", "CCL5/RANTES", "CCL11/Eotaxin", "CCL17/TARC", "CCL19/MIP-3β", "CCL20/MIP-3α", 
    "CCL21/SLC", "CCL22/MDC", "CXCL1/GRO-α", "CXCL5/ENA-78", "CXCL8/IL-8", "CXCL9/MIG", 
    "CXCL10/IP-10", "CXCL11/I-TAC", "CXCL12/SDF-1α", "CX3CL1/Fractalkine", "sCD40L", "sIL-2Rα",
    "sTNF-R1", "sTNF-R2", "sIL-6R", "sgp130", "Leptin", "Adiponectin", "Resistin", "Visfatin",
    "Chemerin", "Omentin", "RBP4", "FGF21", "GDF15", "Follistatin", "Activin A", "BMP-2",
    "BMP-4", "BMP-7", "Osteopontin", "Osteoprotegerin", "RANKL", "Sclerostin", "DKK-1",
    "Wnt-3a", "Wnt-5a", "Angiopoietin-1", "Angiopoietin-2", "Endothelin-1", "PAI-1", "tPA",
    "vWF", "Thrombomodulin", "P-Selectin", "E-Selectin", "ICAM-1", "VCAM-1", "MMP-1", "MMP-2",
    "MMP-3", "MMP-9", "TIMP-1", "TIMP-2", "CRP", "SAA", "Ferritin"
]

CLINICAL_MARKER_NAMES = [
    "Fasting Glucose", "HbA1c", "Fasting Insulin", "HOMA-IR", "BMI",
    "Systolic BP", "Diastolic BP", "Total Cholesterol", "LDL-C", "HDL-C",
    "Triglycerides", "ALT", "AST", "Creatinine"
]

# Reference ranges for clinical markers
CLINICAL_REFERENCE_RANGES = {
    "Fasting Glucose": (70, 100),
    "HbA1c": (4.0, 5.6),
    "Fasting Insulin": (2.6, 24.9),
    "HOMA-IR": (0.5, 2.5),
    "BMI": (18.5, 24.9),
    "Systolic BP": (90, 120),
    "Diastolic BP": (60, 80),
    "Total Cholesterol": (125, 200),
    "LDL-C": (0, 100),
    "HDL-C": (40, 60),
    "Triglycerides": (0, 150),
    "ALT": (7, 56),
    "AST": (10, 40),
    "Creatinine": (0.7, 1.3)
}

# Interventions database
INTERVENTION_DATABASE = {
    "IL-6": [
        Intervention(
            priority=1,
            intervention_text="Consider anti-inflammatory dietary modifications",
            rationale="IL-6 is a key inflammatory cytokine; omega-3 fatty acids and Mediterranean diet patterns can help reduce levels",
            target_biomarkers=["IL-6", "CRP"],
            evidence_level="moderate"
        )
    ],
    "TNF-α": [
        Intervention(
            priority=1,
            intervention_text="Increase physical activity with focus on aerobic exercise",
            rationale="Regular aerobic exercise has been shown to reduce TNF-α levels and improve metabolic health",
            target_biomarkers=["TNF-α", "IL-6"],
            evidence_level="strong"
        )
    ],
    "IL-17A": [
        Intervention(
            priority=2,
            intervention_text="Consider gut microbiome assessment and probiotic supplementation",
            rationale="IL-17A/Th17 imbalance often relates to gut dysbiosis; targeted probiotics may help restore balance",
            target_biomarkers=["IL-17A", "IL-17F", "IL-22"],
            evidence_level="emerging"
        )
    ],
    "Fasting Glucose": [
        Intervention(
            priority=1,
            intervention_text="Implement structured carbohydrate management program",
            rationale="Elevated fasting glucose indicates impaired glucose regulation; dietary intervention is first-line treatment",
            target_biomarkers=["Fasting Glucose", "HbA1c", "HOMA-IR"],
            evidence_level="strong"
        )
    ],
    "HOMA-IR": [
        Intervention(
            priority=1,
            intervention_text="Combine resistance training with dietary modifications",
            rationale="Insulin resistance responds well to muscle-building exercise and reduced refined carbohydrate intake",
            target_biomarkers=["HOMA-IR", "Fasting Insulin"],
            evidence_level="strong"
        )
    ],
    "CRP": [
        Intervention(
            priority=2,
            intervention_text="Evaluate and address underlying inflammatory sources",
            rationale="Elevated CRP indicates systemic inflammation; identify root causes such as diet, stress, or infection",
            target_biomarkers=["CRP", "IL-6"],
            evidence_level="moderate"
        )
    ],
    "Triglycerides": [
        Intervention(
            priority=2,
            intervention_text="Reduce refined carbohydrates and increase omega-3 intake",
            rationale="High triglycerides often respond to dietary fat quality changes and carbohydrate reduction",
            target_biomarkers=["Triglycerides", "HDL-C"],
            evidence_level="strong"
        )
    ],
    "HDL-C": [
        Intervention(
            priority=3,
            intervention_text="Increase aerobic exercise duration and intensity",
            rationale="HDL cholesterol levels improve with regular cardiovascular exercise",
            target_biomarkers=["HDL-C"],
            evidence_level="strong"
        )
    ]
}

# Default interventions
DEFAULT_INTERVENTIONS = [
    Intervention(
        priority=3,
        intervention_text="Schedule follow-up assessment in 3-6 months",
        rationale="Regular monitoring allows tracking of health trajectory and intervention effectiveness",
        target_biomarkers=[],
        evidence_level="standard"
    ),
    Intervention(
        priority=4,
        intervention_text="Consider comprehensive lifestyle assessment",
        rationale="Sleep, stress, and activity patterns all influence metabolic health",
        target_biomarkers=[],
        evidence_level="moderate"
    )
]


class AnalysisService:
    """Performs health analysis, risk scoring, and recommendation generation"""
    
    def __init__(self):
        self.data_service = DataService()
    
    def calculate_risk_score(
        self, 
        embedding: Embedding, 
        cluster: ClusterAssignment,
        biomarkers: BiomarkerPanel = None
    ) -> RiskScore:
        """Calculate disease progression risk score"""
        
        # Base risk from cluster health status
        if cluster.is_healthy:
            base_risk = 0.15
        else:
            # Higher risk for more severe health states
            health_state = self.data_service.get_cluster_description(cluster.cluster_id).get('health_state', 'unknown')
            state_risk_map = {
                'healthy': 0.15,
                'improving': 0.35,
                'pre-diabetic': 0.45,
                'immune_dysregulation': 0.55,
                'metabolic_syndrome': 0.65,
                'severe': 0.80,
                'uncertain': 0.50
            }
            base_risk = state_risk_map.get(health_state, 0.50)
        
        # Adjust based on cluster confidence
        # Lower confidence = more uncertainty = slight risk increase
        confidence_adjustment = (1 - cluster.confidence) * 0.1
        
        # Calculate final risk
        risk_value = min(1.0, max(0.0, base_risk + confidence_adjustment))
        
        # Add some variation based on embedding
        emb_std = np.std(embedding.vector)
        risk_value = min(1.0, risk_value + (emb_std - 1.0) * 0.05)
        
        # Determine risk level
        level = RiskScore.get_level(risk_value)
        
        # Calculate confidence interval (wider for lower confidence)
        ci_width = 0.15 * (1 - cluster.confidence + 0.5)
        ci_lower = max(0.0, risk_value - ci_width)
        ci_upper = min(1.0, risk_value + ci_width)
        
        return RiskScore(
            value=round(risk_value, 3),
            level=level,
            confidence_interval=(round(ci_lower, 3), round(ci_upper, 3)),
            contributing_factors=[]
        )
    
    def calculate_shap_values(self, biomarkers: BiomarkerPanel) -> List[RiskFactor]:
        """
        Calculate SHAP-like importance values for biomarkers.
        In production, this would use actual SHAP with the trained model.
        """
        risk_factors = []
        
        # Combine all biomarker names
        all_names = CYTOKINE_NAMES + CLINICAL_MARKER_NAMES
        all_values = biomarkers.to_array()
        
        # Calculate normalized z-scores as proxy for importance
        mean_val = np.mean(all_values)
        std_val = np.std(all_values)
        
        if std_val > 0:
            z_scores = (np.array(all_values) - mean_val) / std_val
        else:
            z_scores = np.zeros(len(all_values))
        
        # Create risk factors for all biomarkers
        for i, (name, value, z) in enumerate(zip(all_names, all_values, z_scores)):
            # SHAP value is roughly the z-score * impact factor
            shap_value = z * np.abs(z) * 0.1
            
            # Impact score normalized to 0-100
            impact = min(100, max(0, np.abs(z) * 25))
            
            # Direction
            direction = "elevated" if z > 0 else "reduced"
            
            # Reference range for clinical markers
            ref_range = None
            if name in CLINICAL_REFERENCE_RANGES:
                ref_range = CLINICAL_REFERENCE_RANGES[name]
            
            # Generate explanation
            if np.abs(z) > 2:
                severity = "significantly"
            elif np.abs(z) > 1:
                severity = "moderately"
            else:
                severity = "slightly"
            
            explanation = f"{name} is {severity} {direction} compared to healthy reference population."
            
            risk_factors.append(RiskFactor(
                biomarker_name=name,
                shap_value=round(shap_value, 4),
                impact_score=round(impact, 1),
                direction=direction,
                explanation=explanation,
                reference_range=ref_range
            ))
        
        return risk_factors
    
    def get_top_risk_factors(self, risk_factors: List[RiskFactor], n: int = 10) -> List[RiskFactor]:
        """Get top N risk factors by absolute SHAP value"""
        sorted_factors = sorted(risk_factors, key=lambda x: abs(x.shap_value), reverse=True)
        return sorted_factors[:n]
    
    def generate_recommendations(
        self, 
        risk_factors: List[RiskFactor], 
        cluster: ClusterAssignment
    ) -> List[Intervention]:
        """Generate personalized intervention recommendations"""
        recommendations = []
        used_priorities = set()
        
        # Get top risk factors
        top_factors = self.get_top_risk_factors(risk_factors, 5)
        
        # Match risk factors to interventions
        for factor in top_factors:
            biomarker = factor.biomarker_name
            if biomarker in INTERVENTION_DATABASE:
                for intervention in INTERVENTION_DATABASE[biomarker]:
                    if intervention.priority not in used_priorities:
                        recommendations.append(intervention)
                        used_priorities.add(intervention.priority)
                        break
        
        # Add default interventions if needed
        for intervention in DEFAULT_INTERVENTIONS:
            if len(recommendations) < 5 and intervention.priority not in used_priorities:
                recommendations.append(intervention)
                used_priorities.add(intervention.priority)
        
        # Sort by priority
        recommendations = sorted(recommendations, key=lambda x: x.priority)[:5]
        
        return recommendations
    
    def analyze_temporal(
        self, 
        embeddings: List[Embedding],
        clusters: List[ClusterAssignment],
        risk_scores: List[RiskScore]
    ) -> Tuple[float, str, str]:
        """Analyze temporal progression of health state"""
        if len(embeddings) < 2:
            return 0.0, "stable", "Insufficient data for temporal analysis."
        
        # Calculate velocity as change in risk score
        risk_values = [rs.value for rs in risk_scores]
        velocity = (risk_values[-1] - risk_values[0]) / len(risk_values)
        
        # Determine direction
        if velocity < -0.05:
            direction = "improving"
            trend = "Health trajectory shows positive improvement over time."
        elif velocity > 0.05:
            direction = "declining"
            trend = "Health trajectory indicates increasing risk. Intervention recommended."
        else:
            direction = "stable"
            trend = "Health state has remained relatively stable over the measurement period."
        
        return velocity, direction, trend
