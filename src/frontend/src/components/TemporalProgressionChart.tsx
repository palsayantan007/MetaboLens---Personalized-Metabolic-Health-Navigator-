import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TemporalProgressionChart({ personaId }: { personaId: string }) {
  if (!personaId) return null;

  const getHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let baseScore = 0;
    let trend = 0; 
    if (personaId === 'p1') { baseScore = 12; trend = 0.2; }
    if (personaId === 'p2') { baseScore = 28; trend = 2.5; }
    if (personaId === 'p3') { baseScore = 45; trend = 1.8; }
    if (personaId === 'p4') { baseScore = 62; trend = 2.8; }
    if (personaId === 'p5') { baseScore = 80; trend = 1.2; }

    return months.map((m, i) => {
      const randomNoise = (Math.random() - 0.5) * 6;
      const score = Math.max(0, Math.min(100, baseScore + (trend * i) + randomNoise));
      return { month: m, riskScore: parseFloat(score.toFixed(1)) };
    });
  };

  const data = getHistoricalData();
  const strokeColor = personaId === 'p1' ? '#34d399' : personaId === 'p2' ? '#fbbf24' : '#f87171'; // emerald, amber, red

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-semibold flex items-center gap-2 text-slate-200">
          Progression Trajectory
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] bg-white/5 px-3 py-1.5 rounded-full border border-white/10">12 Month Cohort</span>
      </div>
      
      <div className="flex-1 w-full relative -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} tickCount={5} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="riskScore" 
              name="Risk Index"
              stroke={strokeColor} 
              strokeWidth={4}
              fill="url(#colorRisk)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor, style: { filter: `drop-shadow(0px 0px 8px ${strokeColor})`} }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
