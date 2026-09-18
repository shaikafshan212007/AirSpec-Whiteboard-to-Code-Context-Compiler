import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Cpu, 
  Activity, 
  Scan, 
  Layers, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import type { BoundingBox, Telemetry } from '../types';

interface IncomingStreamPaneProps {
  transcript: string;
  isStreamingTranscript: boolean;
  activeWordIndex: number;
  isProcessing: boolean;
  telemetry: Telemetry;
  boundingBoxes: BoundingBox[];
  activeScenario: 'none' | 'voice' | 'whiteboard' | 'custom';
  onTriggerScenarioA: () => void;
  onTriggerScenarioB: () => void;
  onCustomPromptSubmit: (text: string) => void;
}

export const IncomingStreamPane: React.FC<IncomingStreamPaneProps> = ({
  transcript,
  isStreamingTranscript,
  activeWordIndex,
  isProcessing,
  telemetry,
  boundingBoxes,
  activeScenario,
  onTriggerScenarioA,
  onTriggerScenarioB,
  onCustomPromptSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'simulate'>('stream');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);
  const [customInput, setCustomInput] = useState('');
  
  // Audio waveform canvas animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isVoiceActive = (isStreamingTranscript || isProcessing) && !isMicMuted;
      const numBars = 36;
      const barWidth = canvas.width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        let height: number;
        if (isVoiceActive) {
          const wave1 = Math.sin(phase + i * 0.35);
          const wave2 = Math.cos(phase * 1.5 + i * 0.2);
          const intensity = Math.abs(wave1 * wave2);
          height = Math.max(6, intensity * (canvas.height - 10));
        } else {
          height = 4 + Math.sin(phase * 0.5 + i * 0.4) * 3;
        }

        const x = i * (barWidth + 2);
        const y = (canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        if (isVoiceActive) {
          grad.addColorStop(0, '#FF7A00');
          grad.addColorStop(0.5, '#F59E0B');
          grad.addColorStop(1, '#06B6D4');
        } else {
          grad.addColorStop(0, '#334155');
          grad.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 3);
        ctx.fill();
      }

      phase += isVoiceActive ? 0.15 : 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isStreamingTranscript, isProcessing, isMicMuted]);

  const words = transcript.split(' ');

  return (
    <aside className="w-full lg:w-[36%] flex flex-col gap-4 border-r border-white/10 p-4 bg-[#090d16]/70 overflow-y-auto max-h-[calc(100vh-65px)]">
      
      {/* Tab Switcher: Live Stream vs Simulate Phone Ingestion */}
      <div className="flex items-center justify-between p-1 rounded-xl bg-slate-950/80 border border-white/10">
        <button
          onClick={() => setActiveTab('stream')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'stream'
              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-amber-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#ff7a00]" />
          <span>Live Ingestion Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('simulate')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'simulate'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simulate Phone Drop</span>
        </button>
      </div>

      {activeTab === 'simulate' && (
        <div className="p-3.5 rounded-2xl bg-[#0c121e] border border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#ff7a00]" />
              iQOO 13 Handshake Simulator
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              Wi-Fi 7 Direct Ready
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Trigger simulated captures directly from the phone lock-screen widget or whiteboard scanner:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onTriggerScenarioA}
              disabled={isProcessing}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Mic className="w-3.5 h-3.5 text-[#ff7a00]" />
                <span>Voice Brainstorm</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                "Rate limiter auth route by Friday -&gt; Alex"
              </p>
            </button>

            <button
              onClick={onTriggerScenarioB}
              disabled={isProcessing}
              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Scan className="w-3.5 h-3.5 text-cyan-400" />
                <span>Whiteboard OCR</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                Architecture wireframe -&gt; 3 Tasks + Mermaid PRD
              </p>
            </button>
          </div>

          {/* Custom voice input box */}
          <div className="mt-1">
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Custom Voice Prompt Ingestion:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. Migrate user sessions to Redis Sentinel..."
                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <button
                onClick={() => {
                  if (customInput.trim()) {
                    onCustomPromptSubmit(customInput.trim());
                    setCustomInput('');
                  }
                }}
                disabled={!customInput.trim() || isProcessing}
                className="px-3 py-1.5 rounded-lg bg-[#ff7a00] hover:bg-[#ff8c1a] disabled:opacity-40 text-black font-bold text-xs transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Ingestion Card */}
      <div className={`p-4 rounded-2xl bg-[#0c121e] border transition-all duration-300 ${
        isStreamingTranscript ? 'border-amber-500/50 shadow-lg shadow-orange-500/10' : 'border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isStreamingTranscript ? 'bg-amber-500 text-black animate-pulse' : 'bg-slate-800 text-amber-400'}`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block">Audio Ingestion Pipe</span>
              <span className="text-[10px] font-mono text-slate-400">
                {isStreamingTranscript ? 'Receiving 16kHz PCM Stream' : 'Idle Listening (Office Kit Mic)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
              isStreamingTranscript 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isStreamingTranscript ? 'bg-amber-400' : 'bg-slate-500'}`}></span>
              {isStreamingTranscript ? 'MIC ACTIVE' : 'MIC READY'}
            </span>

            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/5 hover:border-white/20 text-slate-400 hover:text-slate-200 transition"
            >
              {isMicMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Audio Waveform Canvas & VU Meter */}
        <div className="h-20 w-full bg-slate-950/90 rounded-xl p-2.5 border border-white/10 flex flex-col justify-between relative overflow-hidden mb-3 shadow-inner">
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isStreamingTranscript ? 'bg-[#ff7a00] shadow-[0_0_8px_#ff7a00] animate-ping' : 'bg-slate-600'}`}></span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                {isStreamingTranscript ? 'PCM 16kHz • Stereo Direct' : 'Channel Standby'}
              </span>
            </div>

            {/* LED VU Meter Bar */}
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-2.5 rounded-xs ${isStreamingTranscript ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-800'}`}></span>
              <span className={`w-1.5 h-2.5 rounded-xs ${isStreamingTranscript ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-800'}`}></span>
              <span className={`w-1.5 h-2.5 rounded-xs ${isStreamingTranscript ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-800'}`}></span>
              <span className={`w-1.5 h-2.5 rounded-xs ${isStreamingTranscript ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-800'}`}></span>
              <span className={`w-1.5 h-2.5 rounded-xs ${isStreamingTranscript ? 'bg-[#ff7a00] shadow-[0_0_6px_#ff7a00]' : 'bg-slate-800'}`}></span>
              <span className={`w-1.5 h-2.5 rounded-xs ${isStreamingTranscript ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : 'bg-slate-800'}`}></span>
              <span className="text-[9px] font-mono text-slate-400 ml-1">
                {isStreamingTranscript ? '-12.4 dB' : '-∞ dB'}
              </span>
            </div>
          </div>

          <div className="w-full h-9 flex items-center justify-center relative">
            <canvas ref={canvasRef} width={320} height={36} className="w-full h-full" />
          </div>

          {/* Subtly illuminated bottom baseline */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff7a00]/40 to-transparent"></div>
        </div>

        {/* Real-time Transcription Box */}
        <div className="bg-slate-950/90 rounded-xl p-3 border border-white/10 min-h-[85px] flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Whisper-Tiny Offline STT
              </span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/60">
              Latency: 14ms
            </span>
          </div>

          <div className="text-xs font-mono leading-relaxed text-slate-300 min-h-[40px]">
            {transcript ? (
              <>
                {words.map((word, idx) => {
                  const isCurrent = isStreamingTranscript && idx === activeWordIndex;
                  const isPast = idx < activeWordIndex || !isStreamingTranscript;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mr-1.5 transition-all duration-150 ${
                        isCurrent
                          ? 'text-amber-300 bg-amber-500/20 px-1 rounded font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : isPast
                          ? 'text-slate-100'
                          : 'text-slate-500'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
                {isStreamingTranscript && (
                  <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse align-middle"></span>
                )}
              </>
            ) : (
              <span className="text-slate-500 italic">Waiting for incoming voice memo or drop...</span>
            )}
          </div>
        </div>
      </div>

      {/* Whiteboard Vision Card */}
      <div className={`p-4 rounded-2xl bg-[#0c121e] border transition-all duration-300 ${
        activeScenario === 'whiteboard' ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block">Whiteboard Vision Scanner</span>
              <span className="text-[10px] font-mono text-slate-400">
                Spatial OCR &amp; Architecture Recognizer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>OCR: {telemetry.ocrAccuracy}</span>
          </div>
        </div>

        {/* Visualizer Area with Scanned Wireframe & Bounding Boxes */}
        <div className="relative w-full h-52 bg-slate-950 rounded-xl overflow-hidden border border-white/10 group cursor-crosshair shadow-inner">
          
          {/* Animated Laser Scanning Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-scanline pointer-events-none z-20"></div>

          {/* Futuristic HUD Corner Reticle Brackets */}
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none z-10"></div>
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none z-10"></div>
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none z-10"></div>
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none z-10"></div>

          {/* Stylized Architectural Wireframe SVG Background */}
          <svg className="w-full h-full" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connection Lines between nodes with glowing dashed accents */}
            <path d="M 70 85 L 110 85" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" className="opacity-80" />
            <path d="M 195 60 L 220 40" stroke="#FF7A00" strokeWidth="2" strokeDasharray="4 4" className="opacity-80" />
            <path d="M 195 110 L 220 130" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 4" className="opacity-80" />

            {/* Ingress node */}
            <rect x="20" y="55" width="50" height="60" rx="8" fill="#1e293b" stroke="#06B6D4" strokeWidth="1.5" className="shadow-lg" />
            <text x="45" y="85" fill="#e2e8f0" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CLIENT</text>
            <text x="45" y="96" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">INGRESS</text>

            {/* Gateway node */}
            <rect x="110" y="45" width="85" height="80" rx="8" fill="#0f172a" stroke="#FF7A00" strokeWidth="2" />
            <text x="152" y="78" fill="#FF7A00" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AUTH GATEWAY</text>
            <text x="152" y="90" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">(Envoy Proxy)</text>

            {/* Redis node */}
            <rect x="220" y="20" width="70" height="45" rx="6" fill="#064e3b" stroke="#10B981" strokeWidth="1.5" />
            <text x="255" y="42" fill="#10B981" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">REDIS STORE</text>
            <text x="255" y="52" fill="#a7f3d0" fontSize="6" fontFamily="monospace" textAnchor="middle">Token Bucket</text>

            {/* Database node */}
            <rect x="220" y="105" width="70" height="50" rx="6" fill="#2e1065" stroke="#8B5CF6" strokeWidth="1.5" />
            <text x="255" y="128" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">POSTGRES DB</text>
            <text x="255" y="138" fill="#ddd6fe" fontSize="6" fontFamily="monospace" textAnchor="middle">User Auth State</text>
          </svg>

          {/* Interactive Bounding Box Overlays */}
          {boundingBoxes.map((box) => {
            const isSelected = selectedBox?.id === box.id;
            return (
              <div
                key={box.id}
                onClick={() => setSelectedBox(box)}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                  borderColor: box.color,
                }}
                className={`absolute border-2 rounded-lg transition-all cursor-pointer group z-10 ${
                  isSelected ? 'bg-cyan-500/20 shadow-lg ring-2 ring-cyan-400' : 'bg-black/25 hover:bg-black/45'
                }`}
              >
                <div 
                  style={{ backgroundColor: box.color }}
                  className="absolute -top-3 left-1 text-[8px] font-mono font-bold text-black px-1.5 py-0.2 rounded shadow"
                >
                  {box.label}
                </div>

                <div className="absolute -bottom-3 right-1 text-[7px] font-mono bg-black/80 text-cyan-200 px-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {Math.round(box.confidence * 100)}%
                </div>
              </div>
            );
          })}

          {/* Camera lens reticle overlay */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Q-ENGINE OCR V4</span>
          </div>

          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm z-10">
            Topology: {boundingBoxes.length} System Nodes
          </div>
        </div>

        {/* Selected Node Details pill */}
        {selectedBox && (
          <div className="mt-2.5 p-2 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between text-[11px] font-mono text-slate-300 shadow-md">
            <span>Node: <strong className="text-cyan-400">{selectedBox.label}</strong></span>
            <span className="text-emerald-400">Confidence: {(selectedBox.confidence * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* On-Device SLM Processing Banner */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 ${
        isProcessing 
          ? 'bg-gradient-to-r from-orange-950/40 via-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/20' 
          : 'bg-[#0c121e] border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isProcessing ? 'bg-cyan-400 text-black animate-spin' : 'bg-slate-800/80 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'}`}>
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
                {isProcessing ? 'On-Device NPU Execution' : 'Snapdragon 8 Elite NPU'}
                <span className="text-[9px] font-mono px-1 rounded bg-orange-500/20 text-[#ff9f43] border border-orange-500/30">
                  Q-Engine
                </span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {telemetry.modelLLM}
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-[10px]">
            <span className="text-cyan-300 font-bold block">{telemetry.npuLatencyMs}ms Latency</span>
            <span className="text-emerald-400">0 KB Air-Gapped</span>
          </div>
        </div>

        {isProcessing ? (
          <div className="space-y-1.5 mt-2.5">
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-[#ff7a00] via-cyan-400 to-emerald-400 h-full w-full animate-pulse"></div>
            </div>
            <p className="text-[10px] font-mono text-cyan-300 animate-pulse text-center">
              Parsing JSON AST tokens via quantized INT4 weights...
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
            <span>Quantization: <strong className="text-slate-300">{telemetry.quantization}</strong></span>
            <span>Throughput: <strong className="text-cyan-400">{telemetry.throughputTokensPerSec} tok/s</strong></span>
          </div>
        )}
      </div>

    </aside>
  );
};
