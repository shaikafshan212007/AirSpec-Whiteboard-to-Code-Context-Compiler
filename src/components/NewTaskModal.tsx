import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Task, Priority, TaskStatus, ContextSource } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [source, setSource] = useState<ContextSource>('manual');
  const [assigneeName, setAssigneeName] = useState('Alex Rivera');
  const [tagsInput, setTagsInput] = useState('#backend, #api');
  const [timeEstimate, setTimeEstimate] = useState('3h');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignees: Record<string, { avatar: string; role: string }> = {
      'Alex Rivera': {
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        role: 'AI / Edge Lead',
      },
      'Sarah Chen': {
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        role: 'Firmware & Transport Lead',
      },
      'Marcus Dev': {
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
        role: 'Security Engineer',
      },
      'Elena Rostova': {
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        role: 'Staff Product Designer',
      },
    };

    const assignee = {
      name: assigneeName,
      avatar: assignees[assigneeName]?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      role: assignees[assigneeName]?.role || 'Core Developer',
    };

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newTask: Task = {
      id: `task-manual-${Date.now()}`,
      title,
      description,
      status,
      priority,
      assignee,
      source,
      sourceLabel: source === 'voice' ? '[Voice Memo]' : source === 'whiteboard' ? '[Whiteboard]' : '[Manual Drop]',
      tags: tags.length > 0 ? tags : ['#dev', '#feature'],
      createdAt: 'Just now',
      timeEstimate: timeEstimate || '2h',
      confidenceScore: 1.0,
      highlighted: true,
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d131f] border border-white/15 p-6 shadow-2xl shadow-black">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-[#ff7a00]">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">
              Create Developer Task
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Task Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Circuit Breaker for Auth API"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Description / Context:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed architecture requirements or implementation details..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Priority:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
              >
                <option value="high">High (P0 - Blocker)</option>
                <option value="medium">Medium (P1 - Target)</option>
                <option value="low">Low (P2 - Nice to have)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Initial Column:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Assignee:
              </label>
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
              >
                <option value="Alex Rivera">Alex Rivera (AI / Edge Lead)</option>
                <option value="Sarah Chen">Sarah Chen (Firmware Lead)</option>
                <option value="Marcus Dev">Marcus Dev (Security Eng)</option>
                <option value="Elena Rostova">Elena Rostova (Designer)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Origin Context:
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as ContextSource)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
              >
                <option value="voice">Voice Memo [iQOO Mic]</option>
                <option value="whiteboard">Whiteboard [Q-Engine]</option>
                <option value="manual">Manual Drop [Desktop]</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Tags (comma separated):
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="#backend, #auth"
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Effort Estimate:
              </label>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                placeholder="e.g. 4h, 2d"
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-[#ff7a00] hover:bg-[#ff8c1a] shadow-lg shadow-orange-500/20 transition"
            >
              Commit Task to Board
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

