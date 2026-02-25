import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function RecommendationsPanel({ personaId }: { personaId: string }) {
  if (!personaId) return null;

  // Mock rules engine mapping based on persona states
  const getRecs = () => {
    switch(personaId) {
      case 'p1':
        return [
          { type: 'good', text: 'Maintain current healthy diet and exercise routine.' },
          { type: 'info', text: 'Schedule next preventative screening in 12 months.' }
        ];
      case 'p2':
        return [
          { type: 'warn', text: 'High risk of advancing to metabolic syndrome. Implement rigorous lifestyle intervention (diet/exercise).' },
          { type: 'info', text: 'Monitor fasting glucose every 3 months.' },
          { type: 'action', text: 'Consider early-stage pharmacological intervention (e.g., Metformin) if HbA1c remains > 5.7.' }
        ];
      case 'p3':
        return [
          { type: 'warn', text: 'Discordant phenotype detected: severe immune dysregulation despite moderate clinical markers.' },
          { type: 'action', text: 'Investigate underlying source of inflammation (CRP/Th17 elevated). Screen for occult infections or autoimmune precursors.' },
          { type: 'info', text: 'Dietary focus: anti-inflammatory protocol with high omega-3/omega-6 ratio.' }
        ];
      case 'p4':
        return [
          { type: 'warn', text: 'Established Metabolic Syndrome. High cardiovascular risk.' },
          { type: 'action', text: 'Initiate statin therapy for triglyceride management.' },
          { type: 'info', text: 'Referral to dietary specialist and structured weight management program.' }
        ];
      case 'p5':
        return [
          { type: 'warn', text: 'Severe Insulin Resistance. Immediate aggressive intervention required.' },
          { type: 'action', text: 'Initiate insulin therapy and dual oral agents. Continuous glucose monitoring (CGM) recommended.' },
          { type: 'action', text: 'Screen for microvascular complications (retinopathy, neuropathy, nephropathy).' }
        ];
      default:
        return [];
    }
  }

  const recs = getRecs();

  return (
    <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
      <h2 className="text-xl font-semibold mb-4">Clinical Recommendations</h2>
      <div className="space-y-3">
        {recs.map((rec, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
            rec.type === 'good' ? 'bg-green-500/10 border-green-500/20 text-green-100' :
            rec.type === 'warn' ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' :
            rec.type === 'action' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
            'bg-blue-500/10 border-blue-500/20 text-blue-100'
          }`}>
            <div className="mt-0.5 shrink-0">
              {rec.type === 'good' && <CheckCircle2 className="text-green-400" size={18} />}
              {rec.type === 'warn' && <AlertTriangle className="text-amber-400" size={18} />}
              {rec.type === 'action' && <ArrowRight className="text-red-400" size={18} />}
              {rec.type === 'info' && <div className="w-4 h-4 rounded-full bg-blue-400/50 border border-blue-400"></div>}
            </div>
            <p className="text-sm font-medium">{rec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
