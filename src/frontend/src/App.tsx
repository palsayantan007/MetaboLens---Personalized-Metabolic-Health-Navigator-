import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Activity, LayoutDashboard, FileUp } from 'lucide-react';
import { useState } from "react";
import HealthMap from "./components/HealthMap";
import RiskFactorPanel from "./components/RiskFactorPanel";
import RecommendationsPanel from "./components/RecommendationsPanel";
import TemporalProgressionChart from "./components/TemporalProgressionChart";

function Dashboard() {
  const [selectedPersona, setSelectedPersona] = useState("p1");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Patient Overview
        </h1>
        <select 
          className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          value={selectedPersona}
          onChange={(e) => setSelectedPersona(e.target.value)}
        >
          <option value="p1">Patient A: Healthy Baseline</option>
          <option value="p2">Patient B: Pre-diabetic</option>
          <option value="p3">Patient C: Immune Dysregulation</option>
          <option value="p4">Patient D: Metabolic Syndrome</option>
          <option value="p5">Patient E: Severe Diabetic</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Activity className="text-cyan-400"/> Health Map (UMAP)</h2>
          <HealthMap />
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Top Risk Factors (SHAP)</h2>
           <RiskFactorPanel personaId={selectedPersona} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemporalProgressionChart personaId={selectedPersona} />
        <RecommendationsPanel personaId={selectedPersona} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col">
          <div className="flex items-center gap-3 px-2 mb-10 mt-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              M
            </div>
            <span className="font-bold text-xl tracking-wide">MetaboLens</span>
          </div>
          
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 text-cyan-400">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 transition-colors">
              <FileUp size={18} />
              <span>Data Ingestion Portal</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<div className="text-center text-slate-400 mt-20">CSV Upload Widget Coming Soon...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
