import React, { useState } from 'react';
import { X, Mic, PenTool, Sparkles, Zap } from 'lucide-react';

interface CustomInflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitVoice: (text: string) => void;
  onSubmitWhiteboard: (title: string, desc: string) => void;
}

export const CustomInflowModal: React.FC<CustomInflowModalProps> = ({
  isOpen,
  onClose,
  onSubmitVoice,
  onSubmitWhiteboard,
}) => {
  const [mode, setMode] = useState<'voice' | 'whiteboard'>('voice');
  const [voiceText, setVoiceText] = useState('');
  const [sketchTitle, setSketchTitle] = useState('Redis Sentinel Cluster Architecture');
  const [sketchDesc, setSketchDesc] = useState('3 master nodes with automatic failover and client-side pub/sub invalidation bus.');

  if (!isOpen) return null;

  const quickVoicePresets = [
    "Alex, make sure we implement circuit breaker pattern on the auth gateway before staging release.",
    "Sarah, please verify that the Wi-Fi Direct socket handles MTU packet fragmentation under 40ms.",
    "Elena, update the developer HUD color tokens to comply with WCAG AAA dark contrast guidelines.",
  ];

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceText.trim()) return;
    onSubmitVoice(voiceText.trim());
    onClose();
  };

  const handleWhiteboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sketchTitle.trim()) return;
    onSubmitWhiteboard(sketchTitle.trim(), sketchDesc.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d131f] border border-white/15 p-6 shadow-2xl shadow-black">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                Office Kit Inflow Simulator
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Simulate arbitrary inputs from paired iQOO 13 device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inflow Mode Selector */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10 mt-4 mb-4">
          <button
            onClick={() => setMode('voice')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-bold transition ${
              mode === 'voice'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Brainstorm Inflow</span>
          </button>

          <button
            onClick={() => setMode('whiteboard')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-bold transition ${
              mode === 'whiteboard'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Whiteboard Vision Drop</span>
          </button>
        </div>

        {mode === 'voice' ? (
          <form onSubmit={handleVoiceSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Custom Speech Transcript:
              </label>
              <textarea
                rows={3}
                required
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Type spoken brainstorm, e.g., 'Team, we need to test OAuth token expiration by tomorrow...'"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                Or click a quick scenario preset:
              </span>
              <div className="space-y-1.5">
                {quickVoicePresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVoiceText(preset)}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-amber-500/30 text-[11px] text-slate-300 transition"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!voiceText.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-[#ff7a00] hover:bg-[#ff8c1a] disabled:opacity-40 shadow-lg shadow-orange-500/20 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Voice Drop</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleWhiteboardSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Architecture Diagram Node Title:
              </label>
              <input
                type="text"
                required
                value={sketchTitle}
                onChange={(e) => setSketchTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Extracted Architectural Spec / Bounding Annotations:
              </label>
              <textarea
                rows={3}
                value={sketchDesc}
                onChange={(e) => setSketchDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              SLM will extract component topologies, generate PRD requirements, and inject actionable backlog tickets.
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!sketchTitle.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 shadow-lg shadow-cyan-500/20 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Vision Drop</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

