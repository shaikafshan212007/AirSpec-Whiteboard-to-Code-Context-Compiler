import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  FileText, 
  Download, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface MarkdownPrdViewProps {
  content: string;
  onCopy: () => void;
  onExport: () => void;
  copied: boolean;
}

export const MarkdownPrdView: React.FC<MarkdownPrdViewProps> = ({
  content,
  onCopy,
  onExport,
  copied,
}) => {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0b0f19] border border-white/10 p-5 overflow-hidden shadow-xl shadow-black/40">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-[#ff7a00] border border-orange-500/20 shadow-sm shadow-orange-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Generated Technical PRD Specification
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-900/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Gemma-2B Synth
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Auto-synthesized from iQOO 13 Whiteboard &amp; Voice Ingestion • Zero Cloud Egress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex rounded-xl bg-[#0d131f] border border-white/10 p-1 shadow-inner">
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                viewMode === 'rendered' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold shadow-md shadow-orange-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rendered Spec
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                viewMode === 'raw' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold shadow-md shadow-orange-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1424] hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy .md</span>
              </>
            )}
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-black font-bold text-xs font-mono shadow-md shadow-cyan-500/20 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        {viewMode === 'raw' ? (
          <pre className="p-4 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {content}
          </pre>
        ) : (
          <div className="space-y-6 text-slate-200">
            
            {/* Header metadata pill */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-300">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Local SLM Engine: <strong>Gemma-2B (INT4)</strong></span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Air-Gapped: <strong>0 KB Egress</strong></span>
              </div>
              <div className="text-slate-400">
                Latency: <span className="text-[#ff7a00]">32ms</span>
              </div>
            </div>

            {/* Document Header */}
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                PRD: Distributed Authentication &amp; Resilient Rate Limiter
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Generated by ContextSnap Offline Engine • iQOO 13 On-Device SLM
              </p>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#ff7a00]">
                1. Executive Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#111726] p-3.5 rounded-xl border border-white/5">
                During the mobile whiteboard sync session via Office Kit, the architecture team sketched a resilient token bucket rate limiter directly upstream of our authentication service. The system throttles abusive credential-stuffing attempts while guaranteeing sub-5ms lookup latency for legitimate developer traffic.
              </p>
            </div>

            {/* Section 2: Architecture Diagram (Interactive SVG & Mermaid) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400">
                  2. Architecture Flowchart (Mermaid.js Synthesized)
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Live Topological View</span>
              </div>

              {/* Rendered SVG Architecture Diagram */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 overflow-x-auto">
                <svg className="w-full min-w-[580px] h-48" viewBox="0 0 600 160">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" />
                    </marker>
                    <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF7A00" />
                    </marker>
                  </defs>

                  {/* Connecting lines */}
                  <line x1="90" y1="80" x2="155" y2="80" stroke="#06B6D4" strokeWidth="2" markerEnd="url(#arrow)" />
                  <line x1="280" y1="65" x2="350" y2="45" stroke="#FF7A00" strokeWidth="2" markerEnd="url(#arrow-amber)" />
                  <line x1="280" y1="95" x2="350" y2="115" stroke="#06B6D4" strokeWidth="2" markerEnd="url(#arrow)" />
                  <line x1="475" y1="115" x2="520" y2="115" stroke="#8B5CF6" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* Client Node */}
                  <g>
                    <rect x="10" y="55" width="80" height="50" rx="10" fill="#1e293b" stroke="#06B6D4" strokeWidth="1.5" />
                    <text x="50" y="80" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Clients</text>
                    <text x="50" y="94" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">HTTPS</text>
                  </g>

                  {/* Envoy Auth Gateway Node */}
                  <g>
                    <rect x="160" y="45" width="120" height="70" rx="10" fill="#0f172a" stroke="#FF7A00" strokeWidth="2" />
                    <text x="220" y="75" fill="#FF7A00" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Auth Gateway</text>
                    <text x="220" y="90" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">(Envoy Proxy)</text>
                    <text x="220" y="103" fill="#cbd5e1" fontSize="8" fontFamily="monospace" textAnchor="middle">RateLimit Filter</text>
                  </g>

                  {/* Redis Token Bucket */}
                  <g>
                    <rect x="355" y="20" width="120" height="50" rx="8" fill="#064e3b" stroke="#10B981" strokeWidth="1.5" />
                    <text x="415" y="45" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Redis Cluster</text>
                    <text x="415" y="58" fill="#a7f3d0" fontSize="8" fontFamily="monospace" textAnchor="middle">Token Bucket (Lua)</text>
                  </g>

                  {/* Auth Microservice */}
                  <g>
                    <rect x="355" y="90" width="120" height="50" rx="8" fill="#1e1b4b" stroke="#6366F1" strokeWidth="1.5" />
                    <text x="415" y="115" fill="#a5b4fc" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Auth Service</text>
                    <text x="415" y="128" fill="#818cf8" fontSize="8" fontFamily="monospace" textAnchor="middle">JWT Verification</text>
                  </g>

                  {/* PostgreSQL */}
                  <g>
                    <rect x="525" y="90" width="65" height="50" rx="8" fill="#2e1065" stroke="#8B5CF6" strokeWidth="1.5" />
                    <text x="557" y="115" fill="#c084fc" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">User DB</text>
                    <text x="557" y="128" fill="#ddd6fe" fontSize="7" fontFamily="monospace" textAnchor="middle">Postgres</text>
                  </g>
                </svg>

                {/* Mermaid Code Snippet Preview */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Mermaid representation: flow LR Client -- Envoy -- Redis/Postgres</span>
                  <span className="text-[#ff7a00]">Synced via Office Kit</span>
                </div>
              </div>
            </div>

            {/* Section 3: Technical Specifications & Quota Rules Table */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-400">
                3. Technical Specifications &amp; Quota Rules
              </h3>
              
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111726]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 font-mono text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="px-3 py-2.5">Route Target</th>
                      <th className="px-3 py-2.5">Limit Window</th>
                      <th className="px-3 py-2.5">Burst Capacity</th>
                      <th className="px-3 py-2.5">Storage Backend</th>
                      <th className="px-3 py-2.5">Action on Exceed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    <tr className="hover:bg-white/5">
                      <td className="px-3 py-2 font-bold text-amber-300">/api/v1/auth/login</td>
                      <td className="px-3 py-2 text-slate-300">5 req / sec</td>
                      <td className="px-3 py-2 text-slate-300">10 requests</td>
                      <td className="px-3 py-2 text-cyan-300">Redis In-Memory</td>
                      <td className="px-3 py-2 text-rose-400">HTTP 429 + Retry-After</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-3 py-2 font-bold text-amber-300">/api/v1/auth/refresh</td>
                      <td className="px-3 py-2 text-slate-300">20 req / sec</td>
                      <td className="px-3 py-2 text-slate-300">40 requests</td>
                      <td className="px-3 py-2 text-cyan-300">Redis Replica</td>
                      <td className="px-3 py-2 text-rose-400">HTTP 429</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-3 py-2 font-bold text-amber-300">/api/v1/auth/register</td>
                      <td className="px-3 py-2 text-slate-300">2 req / min</td>
                      <td className="px-3 py-2 text-slate-300">3 requests</td>
                      <td className="px-3 py-2 text-cyan-300">Redis Master</td>
                      <td className="px-3 py-2 text-rose-400">HTTP 429 + Captcha</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Key Implementation Checklist */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-400">
                4. Key Implementation Checklist
              </h3>
              <div className="space-y-1.5 text-xs font-mono bg-[#111726] p-3.5 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 text-emerald-300">
                  <input type="checkbox" defaultChecked className="accent-emerald-500 rounded" />
                  <span>Transmit architecture schema via iQOO 13 Office Kit P2P Wi-Fi Direct.</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="accent-[#ff7a00] rounded" />
                  <span>Implement sliding window token bucket algorithm using atomic Redis EVAL Lua script.</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="accent-[#ff7a00] rounded" />
                  <span>Inject X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers.</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="accent-[#ff7a00] rounded" />
                  <span>Export Prometheus counter metrics (ratelimit_requests_total&#123;status="rejected"&#125;).</span>
                </label>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
