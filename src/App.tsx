import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { 
  Task, 
  TaskStatus, 
  Telemetry, 
  BoundingBox
} from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_MARKDOWN_PRD, 
  INITIAL_TELEMETRY, 
  INITIAL_BOUNDING_BOXES,
  SCENARIO_A_AUDIO_TRANSCRIPT,
  SCENARIO_A_TASK,
  SCENARIO_B_TASKS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { IncomingStreamPane } from './components/IncomingStreamPane';
import { ExecutiveWorkspacePane } from './components/ExecutiveWorkspacePane';
import { NewTaskModal } from './components/NewTaskModal';
import { CustomInflowModal } from './components/CustomInflowModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [prdContent, setPrdContent] = useState<string>(INITIAL_MARKDOWN_PRD);
  const [telemetry, setTelemetry] = useState<Telemetry>(INITIAL_TELEMETRY);
  const [boundingBoxes] = useState<BoundingBox[]>(INITIAL_BOUNDING_BOXES);

  // Streaming & simulation state
  const [transcript, setTranscript] = useState<string>(
    'Waiting for incoming voice memo or Office Kit drop...'
  );
  const [isStreamingTranscript, setIsStreamingTranscript] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<'none' | 'voice' | 'whiteboard' | 'custom'>('none');

  // Modals & clipboard state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [isCustomInflowModalOpen, setIsCustomInflowModalOpen] = useState<boolean>(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const streamTimerRef = useRef<number | null>(null);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF7A00', '#F59E0B', '#06B6D4', '#10B981'],
    });
  };

  // SCENARIO A: Voice Brainstorm Inflow
  const handleTriggerScenarioA = useCallback(() => {
    if (isProcessing || isStreamingTranscript) return;

    setActiveScenario('voice');
    setTranscript(SCENARIO_A_AUDIO_TRANSCRIPT);
    setIsStreamingTranscript(true);
    setActiveWordIndex(0);

    const words = SCENARIO_A_AUDIO_TRANSCRIPT.split(' ');
    let currentWord = 0;

    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    streamTimerRef.current = setInterval(() => {
      currentWord++;
      setActiveWordIndex(currentWord);

      if (currentWord >= words.length) {
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
        setIsStreamingTranscript(false);
        setIsProcessing(true);

        // Update telemetry for on-device inference
        setTelemetry((prev) => ({
          ...prev,
          npuLatencyMs: 28,
          throughputTokensPerSec: 72.1,
        }));

        // Simulate local NPU JSON token parsing
        setTimeout(() => {
          setIsProcessing(false);

          // Add Scenario A task if not already added
          setTasks((prev) => {
            const exists = prev.some((t) => t.id === SCENARIO_A_TASK.id);
            if (exists) {
              return prev.map((t) =>
                t.id === SCENARIO_A_TASK.id ? { ...t, highlighted: true } : t
              );
            }
            return [SCENARIO_A_TASK, ...prev];
          });

          triggerConfetti();
          addToast(
            'success',
            'Voice Brainstorm Ingested (Office Kit)',
            'Gemma-2B extracted High P0 task for Alex: "Implement rate limiter on /api/v1/auth" (Due Friday).'
          );
        }, 1200);
      }
    }, 120);
  }, [isProcessing, isStreamingTranscript]);

  // SCENARIO B: Whiteboard Vision Capture Inflow
  const handleTriggerScenarioB = useCallback(() => {
    if (isProcessing) return;

    setActiveScenario('whiteboard');
    setIsProcessing(true);

    addToast(
      'info',
      'Whiteboard Capture Received',
      'Scanning architectural wireframe with Q-Engine Vision OCR...'
    );

    // Simulate OCR node highlight and token extraction
    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        npuLatencyMs: 34,
        ocrAccuracy: '99.1%',
        throughputTokensPerSec: 69.8,
      }));

      // Ingest Scenario B Tasks
      setTasks((prev) => {
        const newIds = new Set(SCENARIO_B_TASKS.map((t) => t.id));
        const filtered = prev.filter((t) => !newIds.has(t.id));
        return [...SCENARIO_B_TASKS, ...filtered];
      });

      setIsProcessing(false);
      triggerConfetti();

      addToast(
        'success',
        'Architecture PRD & Tasks Generated',
        'Extracted 4 system nodes: Created Envoy Gateway, Redis Token Bucket, and Prometheus tasks.'
      );
    }, 1500);
  }, [isProcessing]);

  // CUSTOM VOICE INFLOW
  const handleCustomVoiceSubmit = (text: string) => {
    setActiveScenario('custom');
    setTranscript(text);
    setIsStreamingTranscript(true);
    setActiveWordIndex(0);

    const words = text.split(' ');
    let currentWord = 0;

    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    streamTimerRef.current = setInterval(() => {
      currentWord++;
      setActiveWordIndex(currentWord);

      if (currentWord >= words.length) {
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
        setIsStreamingTranscript(false);
        setIsProcessing(true);

        setTimeout(() => {
          setIsProcessing(false);
          const newTask: Task = {
            id: `task-custom-voice-${Date.now()}`,
            title: text.length > 50 ? `${text.substring(0, 50)}...` : text,
            description: `Generated from custom voice transcript: "${text}". Extracted offline via local Whisper-Tiny + Gemma-2B.`,
            status: 'todo',
            priority: text.toLowerCase().includes('urgent') || text.toLowerCase().includes('friday') ? 'high' : 'medium',
            assignee: {
              name: 'Alex Rivera',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
              role: 'AI / Edge Lead',
            },
            source: 'voice',
            sourceLabel: '[Voice Memo]',
            tags: ['#voice-drop', '#office-kit', '#slm'],
            createdAt: 'Just now',
            timeEstimate: '3h',
            confidenceScore: 0.98,
            highlighted: true,
          };

          setTasks((prev) => [newTask, ...prev]);
          triggerConfetti();
          addToast('success', 'Custom Voice Inflow Parsed', `Added: "${newTask.title}"`);
        }, 1000);
      }
    }, 100);
  };

  // CUSTOM WHITEBOARD INFLOW
  const handleCustomWhiteboardSubmit = (title: string, desc: string) => {
    setIsProcessing(true);
    setActiveScenario('custom');

    setTimeout(() => {
      setIsProcessing(false);
      const newTask: Task = {
        id: `task-custom-wb-${Date.now()}`,
        title: title,
        description: desc || 'Extracted from mobile whiteboard capture via Office Kit vision bridge.',
        status: 'todo',
        priority: 'high',
        assignee: {
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
          role: 'Firmware & Transport Lead',
        },
        source: 'whiteboard',
        sourceLabel: '[Whiteboard]',
        tags: ['#architecture', '#vision-ocr', '#p2p'],
        createdAt: 'Just now',
        timeEstimate: '5h',
        confidenceScore: 0.97,
        highlighted: true,
      };

      setTasks((prev) => [newTask, ...prev]);
      triggerConfetti();
      addToast('success', 'Custom Vision Node Ingested', `Added: "${title}"`);
    }, 1200);
  };

  // Kanban update / delete
  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, highlighted: false } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('info', 'Task Removed', 'Task deleted from Kanban board.');
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    addToast('success', 'Task Created', `Added: "${newTask.title}"`);
  };

  // Export utilities
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(prdContent);
    setCopiedMarkdown(true);
    addToast('success', 'Copied to Clipboard', 'PRD markdown specification copied.');
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([prdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ContextSnap_PRD_Spec.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'File Exported', 'Saved as ContextSnap_PRD_Spec.md');
  };

  const handleCopyPayload = () => {
    const payload = {
      device: 'iQOO 13 Pro 5G',
      transport: 'Office Kit Wi-Fi 7 Direct',
      syncTime: new Date().toISOString(),
      tasks,
      telemetry,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setCopiedJson(true);
    addToast('success', 'Office Kit Payload Copied', 'JSON payload copied to clipboard.');
    setTimeout(() => {
      setCopiedPayload(false);
      setCopiedJson(false);
    }, 2000);
  };

  const handleReset = () => {
    setTasks(INITIAL_TASKS);
    setPrdContent(INITIAL_MARKDOWN_PRD);
    setTelemetry(INITIAL_TELEMETRY);
    setTranscript('Waiting for incoming voice memo or Office Kit drop...');
    setActiveScenario('none');
    addToast('info', 'Reset Complete', 'Restored default demonstration workspace.');
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        onTriggerScenarioA={handleTriggerScenarioA}
        onTriggerScenarioB={handleTriggerScenarioB}
        onOpenCustomModal={() => setIsCustomInflowModalOpen(true)}
        onReset={handleReset}
        onExportMarkdown={handleExportMarkdown}
        onCopyPayload={handleCopyPayload}
        isProcessing={isProcessing}
        copiedPayload={copiedPayload}
        taskCount={tasks.length}
      />

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Pane: Incoming Stream & Device Hub (35% width) */}
        <IncomingStreamPane
          transcript={transcript}
          isStreamingTranscript={isStreamingTranscript}
          activeWordIndex={activeWordIndex}
          isProcessing={isProcessing}
          telemetry={telemetry}
          boundingBoxes={boundingBoxes}
          activeScenario={activeScenario}
          onTriggerScenarioA={handleTriggerScenarioA}
          onTriggerScenarioB={handleTriggerScenarioB}
          onCustomPromptSubmit={handleCustomVoiceSubmit}
        />

        {/* Right Pane: Executive Artifacts & Workspace (65% width) */}
        <ExecutiveWorkspacePane
          tasks={tasks}
          prdContent={prdContent}
          telemetry={telemetry}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTask={handleDeleteTask}
          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          onCopyMarkdown={handleCopyMarkdown}
          onExportMarkdown={handleExportMarkdown}
          onCopyJson={handleCopyPayload}
          copiedMarkdown={copiedMarkdown}
          copiedJson={copiedJson}
        />

      </div>

      {/* Modals & Feedback Toasts */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      <CustomInflowModal
        isOpen={isCustomInflowModalOpen}
        onClose={() => setIsCustomInflowModalOpen(false)}
        onSubmitVoice={handleCustomVoiceSubmit}
        onSubmitWhiteboard={handleCustomWhiteboardSubmit}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default App;

