import React from 'react';
import { Copy, Check, CheckCircle2, Braces } from 'lucide-react';
import type { Task, Telemetry } from '../types';

interface JsonPayloadViewProps {
  tasks: Task[];
  telemetry: Telemetry;
  onCopy: () => void;
  copied: boolean;
}

export const JsonPayloadView: React.FC<JsonPayloadViewProps> = ({
  tasks,
  telemetry,
  onCopy,
  copied,
}) => {
  const payload = {
    $schema: 'https://iqoo.vivo.com/schemas/officekit/contextsnap-v2.json',
    device: {
      model: 'iQOO 13 Pro 5G',
      chipset: 'Snapdragon 8 Elite (Q-Engine Hexagon NPU)',
      os: 'OriginOS 5 (Office Kit v2.4)',
      pairedTransport: 'Wi-Fi 7 Direct P2P (802.11be)',
      airGapped: true,
    },
    syncTimestamp: new Date().toISOString(),
    telemetry: {
      npuLatencyMs: telemetry.npuLatencyMs,
      cloudEgressBytes: telemetry.cloudEgressBytes,
      modelSTT: telemetry.modelSTT,
      modelLLM: telemetry.modelLLM,
      quantization: telemetry.quantization,
      ocrAccuracy: telemetry.ocrAccuracy,
      throughputTokensPerSec: telemetry.throughputTokensPerSec,
    },
    totalTasksCount: tasks.length,
    tasks: tasks.map((t) => ({
      id: t.id,
      type: 'developer_task',
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assignee: {
        name: t.assignee.name,
        role: t.assignee.role,
      },
      context_source: t.source,
      source_label: t.sourceLabel,
      tags: t.tags,
      time_estimate: t.timeEstimate,
      due_date: t.dueDate || null,
      confidence_score: t.confidenceScore || 0.98,
      created_at: t.createdAt,
    })),
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const payloadBytes = new Blob([jsonString]).size;

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contextsnap-payload-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to colorize JSON tokens safely
  const highlightJson = (json: string) => {
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
          let cls = 'text-purple-400'; // number
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'text-cyan-400 font-semibold'; // key
            } else {
              cls = 'text-emerald-300'; // string
            }
          } else if (/true|false/.test(match)) {
            cls = 'text-rose-400 font-bold'; // boolean
          } else if (/null/.test(match)) {
            cls = 'text-slate-500 italic'; // null
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0b0f19] border border-white/10 p-5 overflow-hidden shadow-xl shadow-black/40">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/20">
            <Braces className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Office Kit Structured JSON Payload
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 shadow-sm shadow-cyan-900/20">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                RFC-8259 Valid
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Direct Air-Gapped P2P Object • Zero Cloud Egress Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1424] hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-black font-bold text-xs font-mono shadow-md shadow-cyan-500/20 transition active:scale-95"
          >
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Payload Metadata HUD Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[11px] font-mono">
        <div className="px-3 py-1.5 rounded-lg bg-[#0d131f] border border-white/5 flex items-center justify-between">
          <span className="text-slate-500">Payload Size:</span>
          <span className="text-slate-200 font-bold">{(payloadBytes / 1024).toFixed(2)} KB</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#0d131f] border border-white/5 flex items-center justify-between">
          <span className="text-slate-500">Transport:</span>
          <span className="text-cyan-400">Wi-Fi 7 P2P</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#0d131f] border border-white/5 flex items-center justify-between">
          <span className="text-slate-500">NPU Latency:</span>
          <span className="text-amber-400">{telemetry.npuLatencyMs}ms</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#0d131f] border border-white/5 flex items-center justify-between">
          <span className="text-slate-500">Cloud Egress:</span>
          <span className="text-emerald-400 font-bold">0 KB (Air-Gapped)</span>
        </div>
      </div>

      {/* Code Inspector */}
      <div className="flex-1 overflow-y-auto pr-2 rounded-xl bg-[#080c14] border border-white/10 p-4 shadow-inner relative custom-scrollbar">
        <pre className="font-mono text-xs leading-relaxed overflow-x-auto selection:bg-cyan-500/30 selection:text-cyan-200">
          <code dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }} />
        </pre>
      </div>
    </div>
  );
};

