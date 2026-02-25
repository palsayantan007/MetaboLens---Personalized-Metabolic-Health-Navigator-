import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, TrendingDown, ActivitySquare } from 'lucide-react';

interface RiskFactor {
  marker: string;
  value: number;
  type: 'elevated' | 'reduced';
}

interface PersonaData {
  id: string;
  name: string;
  health_state: string;
  risk_factors?: RiskFactor[];
}

export default function RiskFactorPanel({ personaId }: { personaId: string }) {
  const [data, setData] = useState<PersonaData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!personaId) return;
    setLoading(true);
    axios.get(`http://localhost:8000/api/personas/${personaId}`)
      .then((res) => {
        setData(res.data.persona);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load persona data", err);
        setLoading(false);
      });
  }, [personaId]);

  if (!personaId || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4 opacity-50">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
        <p className="text-slate-400 font-medium">Analyzing Latent Space...</p>
      </div>
    );
  }

  if (!data || !data.risk_factors) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-5 rounded-xl flex items-center justify-between border border-white/5 shadow-inner">
        <div>
          <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Clinical Phenotype</h3>
          <p className="font-heading font-semibold text-lg text-white drop-shadow-sm">{data.health_state}</p>
        </div>
        <div className="bg-[#0f172a] rounded-xl p-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-cyan-500/20">
          <ActivitySquare className="text-cyan-400" size={24} />
        </div>
      </div>
      
      <div className="space-y-4 pt-2">
        {data.risk_factors.map((factor, idx) => {
          // Normalize value for progress bar width (max expected SHAP magnitude ~3.0)
          const absValue = Math.abs(factor.value);
          const percent = Math.min(100, (absValue / 3.0) * 100);
          const isElevated = factor.type === 'elevated';

          return (
            <div key={idx} className="relative group">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-200 text-sm flex items-center gap-2">
                  {isElevated ? <TrendingUp size={14} className="text-red-400" /> : <TrendingDown size={14} className="text-emerald-400" />}
                  {factor.marker}
                </span>
                <span className="text-xs font-bold text-slate-400 tracking-wider">
                  SHAP <span className={isElevated ? "text-red-400" : "text-emerald-400"}>{factor.value > 0 ? '+' : ''}{factor.value.toFixed(2)}</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                  className={`h-full rounded-full ${
                    isElevated 
                      ? 'bg-gradient-to-r from-red-500/50 to-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' 
                      : 'bg-gradient-to-r from-emerald-500/50 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
