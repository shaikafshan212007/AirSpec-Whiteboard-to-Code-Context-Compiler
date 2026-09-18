export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type ContextSource = 'voice' | 'whiteboard' | 'manual';

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: Assignee;
  source: ContextSource;
  sourceLabel: string;
  tags: string[];
  createdAt: string;
  timeEstimate: string;
  dueDate?: string;
  confidenceScore?: number;
  highlighted?: boolean;
}

export interface BoundingBox {
  id: string;
  label: string;
  x: number; // percentage
  y: number;
  width: number;
  height: number;
  confidence: number;
  color: string;
}

export interface Telemetry {
  npuLatencyMs: number;
  cloudEgressBytes: number;
  modelSTT: string;
  modelLLM: string;
  quantization: string;
  ocrAccuracy: string;
  throughputTokensPerSec: number;
}

export interface OfficeKitPayload {
  device: string;
  connection: string;
  syncTimestamp: string;
  telemetry: Telemetry;
  tasks: Task[];
  prdSpec: string;
}
