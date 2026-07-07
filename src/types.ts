export type Severity = 'Critical' | 'Warning' | 'Info';

export interface MetricState {
  cpu: number;
  cpuTemp: number;
  cpuSpeed: number;
  memory: number;
  memoryUsed: number;
  memoryTotal: number;
  disk: number;
  networkUp: number; // in GB/s or MB/s
  networkDown: number; // in GB/s or MB/s
  responseTime: number; // in ms
  healthScore: number;
  status: 'Healthy' | 'Warning' | 'Critical';
}

export interface HistoricalDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  networkUp: number;
  networkDown: number;
  disk: number;
  responseTime: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: Severity;
  message: string;
  node: string;
  category: string;
  resolved: boolean;
}

export interface Forecast {
  id: string;
  metric: 'cpu' | 'memory' | 'disk' | 'network';
  name: string;
  prediction: string;
  predictedValue: number;
  confidence: number; // e.g. 0.89
  trend: 'Rising' | 'Falling' | 'Stable';
  risk: 'Low' | 'Moderate' | 'High' | 'Critical';
  timeframe: string;
  details: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  category: 'System' | 'Prediction' | 'Alert' | 'Stress';
  message: string;
  level: 'info' | 'warning' | 'error';
}

export interface SystemSettings {
  cpuThreshold: number;
  memoryThreshold: number;
  diskThreshold: number;
  refreshInterval: number; // in ms
  predictionWindow: number; // in minutes
  enableNotifications: boolean;
  darkMode: boolean;
}
