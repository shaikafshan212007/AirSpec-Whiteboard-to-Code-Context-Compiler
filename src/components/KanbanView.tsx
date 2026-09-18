import React from 'react';
import { 
  Mic, 
  PenTool, 
  ArrowRight, 
  ArrowLeft,
  Trash2,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskStatus, Priority } from '../types';

interface KanbanViewProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  searchQuery: string;
  selectedPriority: string;
  selectedSource: string;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onUpdateStatus,
  onDeleteTask,
  searchQuery,
  selectedPriority,
  selectedSource,
}) => {
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesSource = selectedSource === 'all' || task.source === selectedSource;

    return matchesSearch && matchesPriority && matchesSource;
  });

  const columns: { id: TaskStatus; title: string; color: string; badgeBg: string; dotColor: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-amber-500/30', badgeBg: 'bg-amber-500/10 text-amber-300 border border-amber-500/20', dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' },
    { id: 'in_progress', title: 'In Progress', color: 'border-cyan-500/30', badgeBg: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20', dotColor: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' },
    { id: 'done', title: 'Done', color: 'border-emerald-500/30', badgeBg: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20', dotColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' },
  ];

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-950/70 border border-rose-500/50 text-rose-300 flex items-center gap-1 shadow-sm shadow-rose-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            HIGH P0
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1 shadow-sm shadow-amber-900/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            MED P1
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 shadow-sm shadow-cyan-900/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            LOW P2
          </span>
        );
    }
  };

  const getSourceBadge = (source: string, label: string) => {
    if (source === 'voice') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300">
          <Mic className="w-3 h-3 text-[#ff7a00]" />
          <span>{label || '[Voice Memo]'}</span>
        </span>
      );
    }
    if (source === 'whiteboard') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/30 text-cyan-300">
          <PenTool className="w-3 h-3 text-cyan-400" />
          <span>{label || '[Whiteboard]'}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/80 border border-white/10 text-slate-300">
        <Layers className="w-3 h-3 text-slate-400" />
        <span>{label || '[Manual]'}</span>
      </span>
    );
  };

  const getPriorityAccentBorder = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-[3px] border-l-rose-500';
      case 'medium':
        return 'border-l-[3px] border-l-amber-500';
      case 'low':
        return 'border-l-[3px] border-l-cyan-400';
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Sprint Velocity Progress Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0b0f19]/90 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            Sprint Execution Velocity:
          </span>
          <div className="w-36 h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">
            {doneTasks}/{totalTasks} ({progressPercent}%)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> P0 High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> P1 Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> P2 Low
          </span>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {columns.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl bg-gradient-to-b from-[#0e1322] to-[#090d16] border border-white/10 p-3.5 min-h-[450px] shadow-lg shadow-black/40 overflow-hidden"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
                    {col.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${col.badgeBg}`}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {columnTasks.length === 0 ? (
                    <div className="h-36 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl text-slate-500 text-xs font-mono text-center p-3 bg-white/[0.01]">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <Layers className="w-4 h-4 text-slate-600" />
                      </div>
                      <span>No tasks in {col.title}</span>
                      <span className="text-[10px] mt-1 text-slate-600">Simulate mobile drop to populate</span>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        className={`p-3.5 rounded-xl bg-[#111726]/90 backdrop-blur-sm border transition-all duration-200 group hover:border-white/20 hover:shadow-xl hover:-translate-y-0.5 ${getPriorityAccentBorder(task.priority)} ${
                          task.highlighted
                            ? 'border-orange-500/70 shadow-lg shadow-orange-500/20 bg-gradient-to-b from-[#162035] to-[#0f1626]'
                            : 'border-white/10'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1.5 mb-2.5">
                          {getSourceBadge(task.source, task.sourceLabel)}
                          {getPriorityBadge(task.priority)}
                        </div>

                        {/* Task Title */}
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors leading-snug">
                          {task.title}
                        </h4>

                        {/* Task Description */}
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3 font-sans">
                          {task.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {task.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/90 border border-white/5 text-slate-400 group-hover:border-white/10 transition"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer: Assignee & Move Controls */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                          {/* Assignee */}
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
                              />
                              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-black"></span>
                            </div>
                            <div className="leading-none">
                              <span className="text-[10px] font-medium text-slate-300 block">
                                {task.assignee.name}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {task.timeEstimate} est
                              </span>
                            </div>
                          </div>

                          {/* Action buttons to move between columns */}
                          <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => onUpdateStatus(task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                                title="Move back"
                                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 text-xs transition"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {col.id !== 'done' && (
                              <button
                                onClick={() => onUpdateStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                                title="Move forward"
                                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 text-xs transition"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteTask(task.id)}
                              title="Delete task"
                              className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-white/10 text-xs transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
