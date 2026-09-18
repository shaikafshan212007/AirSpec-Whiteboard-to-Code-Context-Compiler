import React, { useState } from 'react';
import { 
  Kanban, 
  FileText, 
  Braces, 
  Search, 
  Plus
} from 'lucide-react';
import type { Task, TaskStatus, Telemetry } from '../types';
import { KanbanView } from './KanbanView';
import { MarkdownPrdView } from './MarkdownPrdView';
import { JsonPayloadView } from './JsonPayloadView';

interface ExecutiveWorkspacePaneProps {
  tasks: Task[];
  prdContent: string;
  telemetry: Telemetry;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
  onCopyMarkdown: () => void;
  onExportMarkdown: () => void;
  onCopyJson: () => void;
  copiedMarkdown: boolean;
  copiedJson: boolean;
}

export const ExecutiveWorkspacePane: React.FC<ExecutiveWorkspacePaneProps> = ({
  tasks,
  prdContent,
  telemetry,
  onUpdateStatus,
  onDeleteTask,
  onOpenNewTaskModal,
  onCopyMarkdown,
  onExportMarkdown,
  onCopyJson,
  copiedMarkdown,
  copiedJson,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'prd' | 'json'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  return (
    <main className="flex-1 flex flex-col p-4 bg-[#070a11] overflow-hidden max-h-[calc(100vh-65px)]">
      
      {/* Top Header: View Switcher & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
        
        {/* Left View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0b0f19] border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
              activeTab === 'kanban'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'kanban' ? 'bg-black/30 text-black' : 'bg-slate-800 text-slate-300'
            }`}>
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
              activeTab === 'prd'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown PRD Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
              activeTab === 'json'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Braces className="w-3.5 h-3.5" />
            <span>JSON Payload</span>
          </button>
        </div>

        {/* Right Controls: Search, Filters & Add Task */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'kanban' && (
            <>
              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, tags, assignees..."
                  className="pl-8 pr-8 py-1.5 rounded-lg bg-[#0d131f] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 w-44 md:w-56 transition"
                />
                <span className="absolute right-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-500 pointer-events-none">
                  /
                </span>
              </div>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0d131f] border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500/60 transition cursor-pointer hover:border-white/20"
              >
                <option value="all">All Priorities</option>
                <option value="high">High (P0)</option>
                <option value="medium">Medium (P1)</option>
                <option value="low">Low (P2)</option>
              </select>

              {/* Source Filter */}
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0d131f] border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/60 transition cursor-pointer hover:border-white/20"
              >
                <option value="all">All Sources</option>
                <option value="voice">Voice Memo</option>
                <option value="whiteboard">Whiteboard</option>
                <option value="manual">Manual</option>
              </select>

              {/* Add Task Button */}
              <button
                onClick={onOpenNewTaskModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-xs shadow-md shadow-orange-500/25 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Task</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'kanban' && (
          <KanbanView
            tasks={tasks}
            onUpdateStatus={onUpdateStatus}
            onDeleteTask={onDeleteTask}
            searchQuery={searchQuery}
            selectedPriority={selectedPriority}
            selectedSource={selectedSource}
          />
        )}

        {activeTab === 'prd' && (
          <MarkdownPrdView
            content={prdContent}
            onCopy={onCopyMarkdown}
            onExport={onExportMarkdown}
            copied={copiedMarkdown}
          />
        )}

        {activeTab === 'json' && (
          <JsonPayloadView
            tasks={tasks}
            telemetry={telemetry}
            onCopy={onCopyJson}
            copied={copiedJson}
          />
        )}
      </div>

    </main>
  );
};

