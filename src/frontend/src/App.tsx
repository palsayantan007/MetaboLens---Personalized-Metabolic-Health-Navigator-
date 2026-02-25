import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, FileUp, Settings, Bell, ChevronDown, UserRound } from 'lucide-react';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import HealthMap from "./components/HealthMap";
import RiskFactorPanel from "./components/RiskFactorPanel";
import RecommendationsPanel from "./components/RecommendationsPanel";
import TemporalProgressionChart from "./components/TemporalProgressionChart";

function TopBar({ selectedPersona, setSelectedPersona }: any) {
  return (
    <header className="h-20 glass-panel border-b-0 border-x-0 border-t-0 border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 w-full mb-8 rounded-b-3xl">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl tracking-tight heading-gradient drop-shadow-sm font-semibold">
          Patient Nexus
        </h1>
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        <span className="text-sm text-cyan-400 font-medium px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">Live Analysis</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <select 
            className="appearance-none bg-[#0f172a]/80 backdrop-blur-md text-slate-100 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all cursor-pointer font-medium hover:bg-[#1e293b]"
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
          >
            <option value="p1">Patient A: Healthy Baseline [ID: US-0023]</option>
            <option value="p2">Patient B: Pre-diabetic [ID: US-1149]</option>
            <option value="p3">Patient C: Immune Dysregulation [ID: US-4201]</option>
            <option value="p4">Patient D: Metabolic Syndrome [ID: US-8822]</option>
            <option value="p5">Patient E: Severe Diabetic [ID: US-9913]</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-cyan-400 transition-colors" size={16} />
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <button className="p-2.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative isolate">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] cursor-pointer">
            <div className="bg-[#0f172a] w-full h-full rounded-full flex items-center justify-center">
              <UserRound size={18} className="text-indigo-200" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const location = useLocation();
  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Ingestion Portal", path: "/upload", icon: FileUp },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="w-72 glass-panel border-r border-y-0 border-l-0 border-white/5 p-6 shrink-0 flex flex-col justify-between h-screen fixed left-0 top-0 z-20">
      <div>
        <div className="flex items-center gap-4 mb-14 mt-4 px-2">
          <div className="relative isolate">
            <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-40 rounded-full"></div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg relative z-10 border border-white/20">
              <Activity className="text-white" size={24} strokeWidth={2.5}/>
            </div>
          </div>
          <span className="font-heading font-bold text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            MetaboLens
          </span>
        </div>
        
        <div className="space-y-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link key={link.name} to={link.path} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <div className={clsx(
                  "relative flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 z-10 font-medium",
                  isActive ? "text-cyan-300" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-indigo-400/30 transition-colors"></div>
        <h4 className="text-indigo-300 font-semibold mb-1 text-sm">Model Status</h4>
        <p className="text-xs text-slate-400">Contrastive Network: <span className="text-green-400">Online</span></p>
        <p className="text-xs text-slate-400 mt-1">Embeddings version: v1.0.4</p>
      </div>
    </nav>
  );
}

function Dashboard() {
  const [selectedPersona, setSelectedPersona] = useState("p1");

  return (
    <div className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
      <TopBar selectedPersona={selectedPersona} setSelectedPersona={setSelectedPersona} />
      
      <main className="flex-1 overflow-y-auto px-8 pb-12 w-full max-w-[1600px] mx-auto scrollbar-hide">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          {/* Main Visuals Box */}
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-1 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 group-hover:opacity-100 opacity-50 transition-opacity"></div>
              <div className="bg-[#0b1120] rounded-xl p-6 h-full border border-white/5 relative z-10">
                <div className="flex items-centerjustify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2 text-slate-200">
                    <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <Activity className="text-cyan-400" size={18}/>
                    </div>
                    Latent Health Map (UMAP)
                  </h2>
                </div>
                <div className="h-[450px]">
                  <HealthMap />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-1 shadow-2xl relative overflow-hidden">
              <div className="bg-[#0b1120] rounded-xl p-6 h-full border border-white/5 relative z-10">
                <TemporalProgressionChart personaId={selectedPersona} />
              </div>
            </div>
          </div>

          {/* Right Column Analysis */}
          <div className="space-y-6 flex flex-col">
            <div className="glass-panel rounded-2xl p-1 shadow-2xl relative overflow-hidden flex-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
              <div className="bg-[#0b1120]/80 rounded-xl p-6 h-full border border-white/5 relative z-10 flex flex-col">
                <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
                  Top Risk Factors (SHAP)
                </h2>
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <RiskFactorPanel personaId={selectedPersona} />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-1 shadow-2xl relative overflow-hidden">
               <div className="bg-[#0b1120]/80 rounded-xl p-6 h-full border border-white/5 relative z-10">
                  <RecommendationsPanel personaId={selectedPersona} />
               </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#090e17] text-slate-100 overflow-hidden relative">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={
            <div className="flex-1 ml-72 flex flex-col items-center justify-center">
               <div className="glass-panel p-12 rounded-3xl text-center max-w-xl">
                 <FileUp size={64} className="mx-auto text-cyan-500/50 mb-6" strokeWidth={1} />
                 <h2 className="text-2xl font-heading mb-4 text-white">Ingestion Portal</h2>
                 <p className="text-slate-400">CSV upload interface parsing 103 cytokines and clinical markers is under construction.</p>
               </div>
            </div>
          } />
          <Route path="/settings" element={<div className="flex-1 ml-72"></div>} />
        </Routes>
      </div>
    </Router>
  );
}
