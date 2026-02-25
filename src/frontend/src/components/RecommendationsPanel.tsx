import { CheckCircle2, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecommendationsPanel({ personaId }: { personaId: string }) {
  if (!personaId) return null;

  const getRecs = () => {
    switch(personaId) {
      case 'p1':
        return [
          { type: 'good', title: 'Routine Maintenance', text: 'Maintain current healthy diet and exercise routine.' },
          { type: 'info', title: 'Screening required', text: 'Schedule next preventative screening in 12 months.' }
        ];
      case 'p2':
        return [
          { type: 'warn', title: 'Lifestyle Intervention', text: 'High risk of advancing to metabolic syndrome. Implement rigorous lifestyle intervention (diet/exercise).' },
          { type: 'action', title: 'Pharmacology', text: 'Consider early-stage pharmacological intervention (e.g., Metformin) if HbA1c remains > 5.7.' }
        ];
      case 'p3':
        return [
          { type: 'warn', title: 'Discordant Phenotype', text: 'Severe immune dysregulation despite moderate clinical markers.' },
          { type: 'action', title: 'Diagnostics', text: 'Investigate underlying source of inflammation (CRP/Th17 elevated). Screen for occult infections.' }
        ];
      case 'p4':
        return [
          { type: 'action', title: 'Therapeutics', text: 'Initiate statin therapy for triglyceride management immediately.' },
          { type: 'warn', title: 'Clinical Referral', text: 'Referral to dietary specialist and structured weight management program.' }
        ];
      case 'p5':
        return [
          { type: 'action', title: 'Aggressive Intervention', text: 'Initiate insulin therapy and dual oral agents. Continuous glucose monitoring (CGM) recommended.' },
          { type: 'warn', title: 'Complication Screening', text: 'Screen for microvascular complications (retinopathy, neuropathy, nephropathy).' }
        ];
      default:
        return [];
    }
  }

  const recs = getRecs();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-semibold flex items-center gap-2 text-slate-200">
          Clinical Action Plan
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] bg-white/5 px-3 py-1.5 rounded-full border border-white/10">Tailored Intelligence</span>
      </div>
      
      <div className="space-y-4">
        {recs.map((rec, i) => {
          let styleMap = {
            bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]", iconColor: "text-blue-400"
          };
          if (rec.type === 'good') styleMap = { bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-[0_0_15px_rgba(52,211,153,0.1)]", iconColor: "text-emerald-400" };
          if (rec.type === 'warn') styleMap = { bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-[0_0_15px_rgba(251,191,36,0.1)]", iconColor: "text-amber-400" };
          if (rec.type === 'action') styleMap = { bg: "bg-red-500/10", border: "border-red-500/20", glow: "shadow-[0_0_15px_rgba(248,113,113,0.15)]", iconColor: "text-red-400" };

          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-4 rounded-xl border relative overflow-hidden group hover:-translate-y-0.5 transition-all cursor-default ${styleMap.bg} ${styleMap.border} ${styleMap.glow}`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 blur-2xl opacity-50 rounded-full" style={{ backgroundColor: styleMap.iconColor.replace('text-', '') }}></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className={`mt-0.5 p-2 rounded-lg bg-[#0f172a]/50 border ${styleMap.border}`}>
                  {rec.type === 'good' && <CheckCircle2 className={styleMap.iconColor} size={18} />}
                  {rec.type === 'warn' && <AlertTriangle className={styleMap.iconColor} size={18} />}
                  {rec.type === 'action' && <ArrowRight className={styleMap.iconColor} size={18} />}
                  {rec.type === 'info' && <Info className={styleMap.iconColor} size={18} />}
                </div>
                <div>
                  <h4 className="text-slate-200 font-semibold text-sm mb-1">{rec.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{rec.text}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
