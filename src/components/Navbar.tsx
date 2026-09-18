import React, { useState } from 'react';
import { 
  Zap, 
  Smartphone, 
  Cpu, 
  Radio, 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  Mic, 
  PenTool, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onTriggerScenarioA: () => void;
  onTriggerScenarioB: () => void;
  onOpenCustomModal: () => void;
  onReset: () => void;
  onExportMarkdown: () => void;
  onCopyPayload: () => void;
  isProcessing: boolean;
  copiedPayload: boolean;
  taskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onTriggerScenarioA,
  onTriggerScenarioB,
  onOpenCustomModal,
  onReset,
  onExportMarkdown,
  onCopyPayload,
  isProcessing,
  copiedPayload,
  taskCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070a11]/90 backdrop-blur-xl px-4 lg:px-6 py-3 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand & Bridge Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#f59e0b] shadow-lg shadow-orange-500/20 text-white font-bold">
            <Zap className="w-5 h-5 fill-white text-white" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 ring-2 ring-[#070a11]">
              <span className="text-[9px] font-extrabold text-black">Q</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ContextSnap
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-[#ff9f43] font-semibold">
                iQOO 13 Bridge
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Offline Receiver • <span className="text-[#ff7a00] font-semibold">{taskCount} tasks synced</span>
            </p>
          </div>
        </div>

        {/* Status Indicators: iQOO 13 Paired & Local Engine */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Paired Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Smartphone className="w-3.5 h-3.5" />
            <span>iQOO 13 Paired <strong className="text-emerald-300 font-semibold">(Office Kit Active)</strong></span>
          </div>

          {/* Local Engine Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Local Engine: <strong>Gemma-2B / Whisper-Tiny</strong></span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[10px] text-cyan-200 border border-cyan-800">
              Offline NPU
            </span>
          </div>

          {/* Zero Cloud Egress Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-slate-400 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>0 KB Cloud Egress</span>
          </div>
        </div>

        {/* Quick Action Buttons & Dropdown */}
        <div className="flex items-center gap-2">
          
          {/* Main Action: Simulate Office Kit Sync Drop */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all duration-200 ${
                isProcessing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-r from-[#ff7a00] to-[#f59e0b] hover:from-[#ff8c1a] hover:to-[#fbbf24] text-white shadow-orange-500/20 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Radio className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>NPU Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Office Kit Sync Drop</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d131f] border border-white/15 p-2 shadow-2xl shadow-black/80 z-50 backdrop-blur-2xl"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/10 flex justify-between">
                  <span>Select Simulated Event</span>
                  <span className="text-[#ff7a00]">Office Kit v2.4</span>
                </div>

                {/* Scenario A */}
                <button
                  onClick={onTriggerScenarioA}
                  className="w-full text-left p-2.5 mt-1 rounded-xl hover:bg-white/5 transition flex items-start gap-3 group border border-transparent hover:border-amber-500/20"
                >
                  <div className="p-2 rounded-lg bg-amber-500/10 text-[#ff7a00] group-hover:bg-amber-500/20">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 flex items-center gap-1.5">
                      Scenario A: Voice Brainstorm
                      <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300">P0 Task</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      "Implement rate limiter on auth route by Friday, assigned to Alex."
                    </p>
                  </div>
                </button>

                {/* Scenario B */}
                <button
                  onClick={onTriggerScenarioB}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition flex items-start gap-3 group border border-transparent hover:border-cyan-500/20"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center gap-1.5">
                      Scenario B: Whiteboard Capture
                      <span className="text-[10px] px-1 rounded bg-cyan-500/20 text-cyan-300">Architecture</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Scanned architecture diagram -&gt; Extracts Mermaid PRD &amp; 3 Backend Tasks.
                    </p>
                  </div>
                </button>

                {/* Custom Trigger */}
                <button
                  onClick={onOpenCustomModal}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition flex items-start gap-3 group border-t border-white/5"
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">
                      Custom Inflow Simulation
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Enter custom voice text or drop custom architecture sketch.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick Copy Payload */}
          <button
            onClick={onCopyPayload}
            title="Copy Office Kit JSON Payload"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs transition"
          >
            {copiedPayload ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Payload</span>
              </>
            )}
          </button>

          {/* Export Markdown */}
          <button
            onClick={onExportMarkdown}
            title="Export PRD as .md"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .md</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={onReset}
            title="Reset to default state"
            className="p-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/20 text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
