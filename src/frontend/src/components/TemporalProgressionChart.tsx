// Remove React block, just empty or remove line

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TemporalProgressionChart({ personaId }: { personaId: string }) {
  if (!personaId) return null;

  // Mock historical data generation based on current state
  const getHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let baseScore = 0;
    let trend = 0; // positive is worsening

    if (personaId === 'p1') { baseScore = 10; trend = 0.5; }
    if (personaId === 'p2') { baseScore = 30; trend = 2; }
    if (personaId === 'p3') { baseScore = 50; trend = 1.5; }
    if (personaId === 'p4') { baseScore = 60; trend = 3; }
    if (personaId === 'p5') { baseScore = 80; trend = 1; }

    return months.map((m, i) => {
      // Create a wavy trend leading up to the current severity
      const randomNoise = (Math.random() - 0.5) * 5;
      const score = Math.max(0, Math.min(100, baseScore + (trend * i) + randomNoise));
      return { month: m, riskScore: parseFloat(score.toFixed(1)) };
    });
  };

  const data = getHistoricalData();

  // Determine color based on current severity
  const strokeColor = personaId === 'p1' ? '#4ade80' : personaId === 'p2' ? '#fbbf24' : '#f87171';
  const fillColor = personaId === 'p1' ? 'rgba(74, 222, 128, 0.2)' : personaId === 'p2' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(248, 113, 113, 0.2)';

  return (
    <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">12-Month Progression Trajectory</h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">Overall Risk Score</span>
      </div>
      <div className="h-4/5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
              itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="riskScore" 
              name="Metabolic Risk Score"
              stroke={strokeColor} 
              strokeWidth={3}
              fill={fillColor} 
              activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
