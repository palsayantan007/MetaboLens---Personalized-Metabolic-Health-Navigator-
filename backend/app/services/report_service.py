"""
Report generation service for MetaboLens - PDF clinician reports
"""
import io
from datetime import datetime
from typing import Optional
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from ..models.schemas import AnalysisResult, TemporalAnalysis


class ReportService:
    """Generates PDF clinician reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1e3a5f')
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#2563eb')
        ))
        
        self.styles.add(ParagraphStyle(
            name='Disclaimer',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.gray,
            alignment=TA_CENTER,
            spaceBefore=20
        ))
    
    def generate_report(
        self,
        analysis: AnalysisResult,
        patient_name: str = "Demo Patient",
        patient_id: Optional[str] = None,
        temporal_data: Optional[TemporalAnalysis] = None
    ) -> bytes:
        """Generate PDF report from analysis result"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # Title
        story.append(Paragraph("MetaboLens Health Assessment", self.styles['CustomTitle']))
        story.append(Paragraph(
            f"<b>Research Prototype Report</b><br/>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            self.styles['Normal']
        ))
        story.append(Spacer(1, 20))
        
        # Patient Information
        story.append(Paragraph("Patient Information", self.styles['SectionHeader']))
        patient_data = [
            ["Patient Name:", patient_name],
            ["Patient ID:", patient_id or "N/A"],
            ["Data Source:", analysis.data_source_label],
            ["Report Date:", datetime.now().strftime('%Y-%m-%d')]
        ]
        patient_table = Table(patient_data, colWidths=[2*inch, 4*inch])
        patient_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(patient_table)
        story.append(Spacer(1, 15))
        
        # Health State Summary
        story.append(Paragraph("Health State Summary", self.styles['SectionHeader']))
        
        # Risk score color
        risk_color = self._get_risk_color(analysis.risk_score.level)
        
        summary_data = [
            ["Cluster Assignment:", analysis.cluster.cluster_name],
            ["Cluster Confidence:", f"{analysis.cluster.confidence:.1%}"],
            ["Risk Score:", f"{analysis.risk_score.value:.2f} ({analysis.risk_score.level.upper()})"],
            ["Confidence Interval:", f"[{analysis.risk_score.confidence_interval[0]:.2f} - {analysis.risk_score.confidence_interval[1]:.2f}]"]
        ]
        summary_table = Table(summary_data, colWidths=[2*inch, 4*inch])
        summary_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TEXTCOLOR', (1, 2), (1, 2), risk_color),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 10))
        
        # Cluster description
        story.append(Paragraph(
            f"<i>{analysis.cluster.description}</i>",
            self.styles['Normal']
        ))
        story.append(Spacer(1, 15))
        
        # Top Risk Factors
        story.append(Paragraph("Top Risk Factors", self.styles['SectionHeader']))
        
        if analysis.top_risk_factors:
            risk_header = ["Biomarker", "Impact", "Direction", "Explanation"]
            risk_rows = [risk_header]
            
            for factor in analysis.top_risk_factors[:10]:
                risk_rows.append([
                    factor.biomarker_name,
                    f"{factor.impact_score:.1f}",
                    factor.direction.upper(),
                    factor.explanation[:50] + "..." if len(factor.explanation) > 50 else factor.explanation
                ])
            
            risk_table = Table(risk_rows, colWidths=[1.5*inch, 0.8*inch, 0.8*inch, 3.2*inch])
            risk_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0e7ff')),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(risk_table)
        story.append(Spacer(1, 15))
        
        # Recommendations
        story.append(Paragraph("Personalized Recommendations", self.styles['SectionHeader']))
        
        for i, rec in enumerate(analysis.recommendations, 1):
            story.append(Paragraph(
                f"<b>{i}. {rec.intervention_text}</b>",
                self.styles['Normal']
            ))
            story.append(Paragraph(
                f"<i>Rationale: {rec.rationale}</i>",
                self.styles['Normal']
            ))
            if rec.target_biomarkers:
                story.append(Paragraph(
                    f"Target biomarkers: {', '.join(rec.target_biomarkers)}",
                    self.styles['Normal']
                ))
            story.append(Spacer(1, 8))
        
        # Temporal Analysis (if available)
        if temporal_data:
            story.append(Paragraph("Temporal Progression", self.styles['SectionHeader']))
            story.append(Paragraph(
                f"Direction: <b>{temporal_data.direction.upper()}</b><br/>"
                f"Velocity: {temporal_data.velocity:.3f}<br/>"
                f"{temporal_data.trend_analysis}",
                self.styles['Normal']
            ))
            story.append(Spacer(1, 15))
        
        # Model Information
        story.append(Paragraph("Model Information", self.styles['SectionHeader']))
        model_info = [
            ["Model Type:", "Multi-modal Contrastive Learning"],
            ["Training Samples:", "1,982 samples from 64 subjects"],
            ["Silhouette Score:", "0.747"],
            ["Clusters:", "28 health state clusters"],
            ["Input Features:", "103 cytokines + 14 clinical markers"]
        ]
        model_table = Table(model_info, colWidths=[2*inch, 4*inch])
        model_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(model_table)
        story.append(Spacer(1, 20))
        
        # Disclaimer
        story.append(Paragraph(
            "<b>IMPORTANT DISCLAIMER</b><br/>" + analysis.disclaimer +
            "<br/>This report is generated from a research prototype and should not be used for clinical decision-making without proper validation.",
            self.styles['Disclaimer']
        ))
        
        # Build PDF
        doc.build(story)
        
        buffer.seek(0)
        return buffer.getvalue()
    
    def _get_risk_color(self, level: str) -> colors.Color:
        """Get color for risk level"""
        color_map = {
            'low': colors.HexColor('#16a34a'),
            'moderate': colors.HexColor('#ca8a04'),
            'high': colors.HexColor('#dc2626')
        }
        return color_map.get(level, colors.black)
