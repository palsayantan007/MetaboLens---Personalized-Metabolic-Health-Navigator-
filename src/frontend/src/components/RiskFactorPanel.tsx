import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

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

  if (!personaId) {
    return <div className="text-slate-500 flex justify-center items-center h-full">Please retrieve or select a patient...</div>;
  }

  if (loading) {
    return <div className="text-slate-500 flex justify-center items-center h-full">Loading analysis...</div>;
  }

  if (!data || !data.risk_factors) {
    return <div className="text-slate-500 flex justify-center items-center h-full">No risk factor data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-700">
        <div>
          <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-wider">Health State</h3>
          <p className="font-semibold text-lg">{data.health_state}</p>
        </div>
        <div className="bg-slate-900 rounded-full p-2 h-10 w-10 flex items-center justify-center border border-cyan-500/30">
          <AlertCircle className="text-cyan-400" size={20} />
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <h4 className="text-sm text-slate-400 uppercase tracking-wide font-semibold mb-3">Top SHAP Biomarkers</h4>
        {data.risk_factors.map((factor, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <span className="font-medium">{factor.marker}</span>
            <div className={`flex items-center gap-2 px-2 py-1 rounded text-sm font-semibold ${
              factor.type === 'elevated' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
            }`}>
              {factor.type === 'elevated' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(factor.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
