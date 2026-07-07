import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { 
  MetricState, 
  HistoricalDataPoint, 
  Alert, 
  Forecast, 
  LogEntry, 
  SystemSettings 
} from '../types';

interface MetricsContextType {
  metrics: MetricState;
  history: HistoricalDataPoint[];
  alerts: Alert[];
  forecasts: Forecast[];
  logs: LogEntry[];
  isStressTesting: boolean;
  startStressTest: () => void;
  stopStressTest: () => void;
  clearAlerts: () => void;
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  triggerMockAlert: (severity: 'Critical' | 'Warning' | 'Info', message: string) => void;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SystemSettings = {
  cpuThreshold: 80,
  memoryThreshold: 80,
  diskThreshold: 85,
  refreshInterval: 1000,
  predictionWindow: 30,
  enableNotifications: true,
  darkMode: true,
};

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  const isAuthenticated = !!token;

  const [metrics, setMetrics] = useState<MetricState>({
    cpu: 0, cpuTemp: 0, cpuSpeed: 0, memory: 0, memoryUsed: 0, memoryTotal: 256,
    disk: 0, networkUp: 0, networkDown: 0, responseTime: 0, healthScore: 100, status: 'Healthy',
  });

  const [history, setHistory] = useState<HistoricalDataPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Setup Axios interceptor
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Setup Socket
  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io('http://localhost:5000/live', {
      auth: { token },
      transports: ['websocket', 'polling'] // Add polling as fallback
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      addLog('System', 'Connected to Foresight Backend', 'info');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      addLog('System', 'Connection error to backend', 'error');
    });

    newSocket.on('metrics:update', (data: any) => {
      setMetrics((prev) => ({ ...prev, ...data }));
      
      const timeStr = new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory((prev) => {
        const next = [...prev, {
          timestamp: timeStr,
          cpu: data.cpu,
          memory: data.memory,
          networkUp: data.networkUp,
          networkDown: data.networkDown,
          disk: data.disk,
          responseTime: data.responseTime,
        }];
        return next.slice(-30); // keep last 30 points
      });
    });

    newSocket.on('prediction:update', (data: Forecast) => {
      setForecasts((prev) => {
        const exists = prev.find(p => p.metric === data.metric && p.timeframe === data.timeframe);
        if (exists) {
          return prev.map(p => (p.metric === data.metric && p.timeframe === data.timeframe ? data : p));
        }
        return [...prev, data];
      });
    });

    newSocket.on('alert:new', (data: Alert) => {
      setAlerts((prev) => [data, ...prev]);
      addLog('Alert', `New Alert: ${data.message}`, data.severity === 'Critical' ? 'error' : 'warning');
    });

    newSocket.on('anomaly:detected', (data: LogEntry) => {
      setLogs((prev) => [data, ...prev].slice(0, 200));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const addLog = (category: 'System' | 'Prediction' | 'Alert' | 'Stress', message: string, level: 'info' | 'warning' | 'error') => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      category,
      message,
      level,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 200));
  };

  const loginUser = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const startStressTest = async () => {
    try {
      await axios.post('http://localhost:5000/api/stress-test/start');
      setIsStressTesting(true);
      addLog('Stress', 'Started stress test', 'warning');
    } catch (err) {
      console.error(err);
    }
  };

  const stopStressTest = async () => {
    try {
      await axios.post('http://localhost:5000/api/stress-test/stop');
      setIsStressTesting(false);
      addLog('Stress', 'Stopped stress test', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const triggerMockAlert = (severity: 'Critical' | 'Warning' | 'Info', message: string) => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      severity,
      message,
      node: 'mock-node',
      category: 'Simulated',
      resolved: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <MetricsContext.Provider
      value={{
        metrics,
        history,
        alerts,
        forecasts,
        logs,
        isStressTesting,
        startStressTest,
        stopStressTest,
        clearAlerts,
        settings,
        updateSettings,
        triggerMockAlert,
        login: loginUser,
        logout: logoutUser,
        isAuthenticated
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};
