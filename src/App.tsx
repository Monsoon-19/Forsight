/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MetricsProvider, 
  useMetrics 
} from './hooks/useMetricsSimulator';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MetricCard } from './components/MetricCard';
import { ChartPanel } from './components/ChartPanel';
import { ForecastCard } from './components/ForecastCard';
import { AlertCard } from './components/AlertCard';
import { EventTimelineItem } from './components/EventTimelineItem';
import { SystemInfoTable } from './components/SystemInfoTable';
import { Toast, ToastItem } from './components/Toast';
import { Login } from './components/Login';

import { 
  Activity, 
  Bell, 
  TrendingUp, 
  Terminal, 
  Server, 
  FileSpreadsheet, 
  Settings,
  Flame,
  CheckCircle,
  AlertTriangle,
  Cpu,
  Database,
  HardDrive,
  Network,
  ChevronRight,
  Sliders,
  Volume2,
  VolumeX,
  PlusCircle,
  Download,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
  Pause,
  Play
} from 'lucide-react';

function ForesightAppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Destructure simulator context
  const {
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
    isAuthenticated
  } = useMetrics();

  // Toast helper
  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const newToast: ToastItem = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State for Alert custom trigger
  const [customAlertMsg, setCustomAlertMsg] = useState('');
  const [customAlertSeverity, setCustomAlertSeverity] = useState<'Critical' | 'Warning' | 'Info'>('Warning');

  // State for Alert view filter
  const [alertFilter, setAlertFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info' | 'Resolved'>('All');

  // State for Logs filters
  const [logCategoryFilter, setLogCategoryFilter] = useState<'All' | 'System' | 'Prediction' | 'Alert' | 'Stress'>('All');
  const [logLevelFilter, setLogLevelFilter] = useState<'All' | 'info' | 'warning' | 'error'>('All');
  const [logSearch, setLogSearch] = useState('');
  const [isLogLive, setIsLogLive] = useState(true);

  // State for Predictions retrain loading
  const [isRetraining, setIsRetraining] = useState(false);

  // State for Report generator loading
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportRange, setReportRange] = useState('24h');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includePredictions, setIncludePredictions] = useState(true);
  const [includeIncidents, setIncludeIncidents] = useState(true);

  // Handle single alert resolve click
  const handleResolveAlert = (id: string) => {
    showToast('Alert resolved successfully', 'success');
  };

  // Handle Retrain trigger
  const handleRetrainModels = () => {
    setIsRetraining(true);
    showToast('Retraining prediction matrix...', 'info');
    setTimeout(() => {
      setIsRetraining(false);
      showToast('Models updated successfully with current telemetry (Residual loss: 0.008)', 'success');
    }, 2000);
  };

  // Handle Reports download trigger
  const handleExportCSV = () => {
    showToast('Preparing CSV file with historical metrics...', 'info');
    setTimeout(() => {
      showToast('Export successful! Telemetry CSV downloaded.', 'success');
    }, 1200);
  };

  const handleGeneratePDF = () => {
    setIsGeneratingReport(true);
    showToast('Synthesizing PDF dashboard summary...', 'info');
    setTimeout(() => {
      setIsGeneratingReport(false);
      showToast('Foresight Report successfully downloaded (PDF format).', 'success');
    }, 2200);
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === 'All') return true;
    if (alertFilter === 'Resolved') return alert.resolved;
    return !alert.resolved && alert.severity === alertFilter;
  });

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesCategory = logCategoryFilter === 'All' || log.category === logCategoryFilter;
    const matchesLevel = logLevelFilter === 'All' || log.level === logLevelFilter;
    const matchesSearch = log.message.toLowerCase().includes(logSearch.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#080f17] text-[#dce3ef] select-none font-sans">
      
      {/* SIDEBAR FOR DESKTOP */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d141c] border-b border-[#2a2e38] sticky top-0 z-10 w-full">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-[#4e8eff]">
            <rect x="15" y="45" width="12" height="40" rx="6" />
            <rect x="37" y="28" width="12" height="57" rx="6" />
            <path d="M 59, 15 H 73 C 81,15 85,19 85,27 V 40 C 85,48 81,52 73,52 H 71 C 67,52 65,50 65,46 V 34" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="25" y="48" width="12" height="12" rx="3" transform="rotate(45 25 48)" opacity="0.4" />
            <rect x="47" y="32" width="12" height="12" rx="3" transform="rotate(45 47 32)" opacity="0.4" />
          </svg>
          <span className="font-semibold text-white tracking-tight text-sm">Foresight</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick status dot */}
          <span className={`h-2.5 w-2.5 rounded-full ${metrics.status === 'Critical' ? 'bg-rose-500 animate-pulse' : metrics.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] uppercase font-bold text-[#8c909f] tracking-wider">
            {isStressTesting ? 'STRESSED' : 'IDLE'}
          </span>

          {/* Quick Stress Test Toggle Button on Mobile */}
          {isStressTesting ? (
            <button
              onClick={stopStressTest}
              className="p-1.5 rounded bg-amber-500/10 border border-amber-500 text-amber-400"
              title="Stop Stress Test"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={startStressTest}
              className="p-1.5 rounded bg-rose-500/15 border border-rose-500 text-rose-400 animate-pulse"
              title="Start Stress Test"
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP TOP NAV */}
        <div className="hidden md:block">
          <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* SCROLLABLE MAIN CONTENT WRAPPER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">

          {/* PAGE 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div id="page-dashboard" className="space-y-6 animate-slide-in">
              
              {/* Header Title section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2e38]/40 pb-4">
                <div className="text-left">
                  <h2 className="font-sans font-semibold text-lg md:text-xl text-white">
                    Predictive Fleet Controller
                  </h2>
                  <p className="text-xs text-[#8c909f] mt-0.5">
                    Real-time host diagnostics paired with continuous neural network forecasts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRetrainModels} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#171a21] hover:bg-[#2a313a] border border-[#2a2e38] rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin text-[#4e8eff]' : ''}`} />
                    <span>Sync Predictor</span>
                  </button>
                </div>
              </div>

              {/* 1. METRICS CARDS PANEL */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Health Card */}
                <MetricCard
                  id="metric-card-health"
                  title="Health Score"
                  value={`${metrics.healthScore}`}
                  suffix="/100"
                  icon={metrics.status === 'Healthy' ? CheckCircle : AlertTriangle}
                  statusColor={metrics.status === 'Healthy' ? 'healthy' : metrics.status === 'Warning' ? 'warning' : 'critical'}
                  details={
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${metrics.status === 'Healthy' ? 'bg-emerald-500' : metrics.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      <span>{metrics.status} State</span>
                    </span>
                  }
                  onClick={() => setActiveTab('alerts')}
                />

                {/* CPU Card */}
                <MetricCard
                  id="metric-card-cpu"
                  title="CPU Utilization"
                  value={`${metrics.cpu}`}
                  suffix="%"
                  icon={Cpu}
                  statusColor={metrics.cpu > settings.cpuThreshold ? 'critical' : 'neutral'}
                  details={`${metrics.cpuTemp}°C • ${metrics.cpuSpeed} GHz`}
                  onClick={() => setActiveTab('predictions')}
                />

                {/* Memory Card */}
                <MetricCard
                  id="metric-card-mem"
                  title="Memory Allocation"
                  value={`${metrics.memory}`}
                  suffix="%"
                  icon={Database}
                  statusColor={metrics.memory > settings.memoryThreshold ? 'critical' : 'neutral'}
                  details={`${metrics.memoryUsed} GB / ${metrics.memoryTotal} GB`}
                  onClick={() => setActiveTab('predictions')}
                />

                {/* Disk Card */}
                <MetricCard
                  id="metric-card-disk"
                  title="Storage Disk"
                  value={`${metrics.disk}`}
                  suffix="%"
                  icon={HardDrive}
                  details="Ingestion: 12.4 GB/d"
                  onClick={() => setActiveTab('predictions')}
                />

                {/* Network Card */}
                <MetricCard
                  id="metric-card-network"
                  title="Network Traffic"
                  value={`${(metrics.networkUp + metrics.networkDown).toFixed(1)}`}
                  suffix="GB/s"
                  icon={Network}
                  details={
                    <span className="font-mono text-[10px] text-[#8c909f] flex items-center gap-2">
                      <span>↑ {metrics.networkUp} GB/s</span>
                      <span>↓ {metrics.networkDown} GB/s</span>
                    </span>
                  }
                  onClick={() => setActiveTab('predictions')}
                />

              </div>

              {/* 2. CHARTS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartPanel 
                  id="chart-utilization"
                  title="Resource Utilization (CPU & Memory)" 
                  type="utilization" 
                  data={history} 
                />
                <ChartPanel 
                  id="chart-network"
                  title="Network Traffic (Uplink / Downlink)" 
                  type="network" 
                  data={history} 
                />
              </div>

              {/* 3. SPLIT SECTION: FORECASTING & ALERTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* AI Forecasting Column (2/3 Width) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2a2e38]/30 pb-2 text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4e8eff]" />
                      <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8c909f]">
                        Active AI Forecasting Matrix
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('predictions')}
                      className="text-[#4e8eff] hover:underline text-xs font-semibold flex items-center"
                    >
                      <span>Full Matrix</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {forecasts.slice(0, 2).map((forecast) => (
                      <ForecastCard key={forecast.id} forecast={forecast} />
                    ))}
                  </div>
                </div>

                {/* Active Alerts Column (1/3 Width) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2a2e38]/30 pb-2 text-left">
                    <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8c909f]">
                      Active Incident Alerts ({alerts.filter(a => !a.resolved).length})
                    </span>
                    <button 
                      onClick={() => setActiveTab('alerts')}
                      className="text-[#4e8eff] hover:underline text-xs font-semibold flex items-center"
                    >
                      <span>All Alerts</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {alerts.filter(a => !a.resolved).length === 0 ? (
                      <div className="h-[120px] bg-[#171a21]/30 border border-dashed border-[#2a2e38] rounded-md flex flex-col items-center justify-center text-center p-4">
                        <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
                        <span className="text-xs text-[#c2c6d6] font-medium">All systems normal</span>
                        <span className="text-[10px] text-[#8c909f]">No critical alerts active</span>
                      </div>
                    ) : (
                      alerts.filter(a => !a.resolved).map((alert) => (
                        <AlertCard 
                          key={alert.id} 
                          alert={alert} 
                          onResolve={handleResolveAlert} 
                        />
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PAGE 2: ALERTS VIEW */}
          {activeTab === 'alerts' && (
            <div id="page-alerts" className="space-y-6 animate-slide-in text-left">
              <div className="border-b border-[#2a2e38] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-semibold text-xl text-white">
                    Incident Alerts Console
                  </h2>
                  <p className="text-xs text-[#8c909f] mt-1">
                    System errors, warning states, and anomaly notifications.
                  </p>
                </div>
                <button
                  onClick={clearAlerts}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171a21] hover:bg-rose-950/20 border border-[#2a2e38] hover:border-rose-900/40 rounded-md text-xs font-semibold text-[#dce3ef] hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All History</span>
                </button>
              </div>

              {/* Filtering + Simulated Custom Trigger Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Filters list (Left 2/3) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap bg-[#151c24] p-2 border border-[#2a2e38] rounded-md">
                    {(['All', 'Critical', 'Warning', 'Info', 'Resolved'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setAlertFilter(filter)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold font-sans transition-all cursor-pointer ${
                          alertFilter === filter
                            ? 'bg-[#4e8eff] text-white'
                            : 'text-[#8c909f] hover:text-white hover:bg-[#1e222b]'
                        }`}
                      >
                        {filter === 'All' ? 'All Severities' : filter === 'Resolved' ? 'Resolved Alerts' : `${filter} Only`}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {filteredAlerts.length === 0 ? (
                      <div className="h-[200px] bg-[#171a21]/20 border border-dashed border-[#2a2e38] rounded-md flex flex-col items-center justify-center text-center p-6">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                        <span className="text-sm text-white font-medium">Empty alert filter list</span>
                        <span className="text-xs text-[#8c909f] mt-1 max-w-xs">
                          There are no active alerts matching the selected category. Use the manual simulator on the right to trigger one!
                        </span>
                      </div>
                    ) : (
                      filteredAlerts.map((alert) => (
                        <AlertCard 
                          key={alert.id} 
                          alert={alert} 
                          onResolve={handleResolveAlert} 
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Simulate Custom Alerts panel (Right 1/3) */}
                <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#2a2e38]/40 pb-2">
                    <PlusCircle className="w-4 h-4 text-[#4e8eff]" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                      Simulate Custom Incident
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-1">
                        Severity Level
                      </label>
                      <select
                        value={customAlertSeverity}
                        onChange={(e) => setCustomAlertSeverity(e.target.value as any)}
                        className="w-full bg-[#151c24] border border-[#2a2e38] rounded p-2 text-xs text-white focus:outline-none focus:border-[#4e8eff]"
                      >
                        <option value="Critical">Critical (Red)</option>
                        <option value="Warning">Warning (Amber)</option>
                        <option value="Info">Info (Blue)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-1">
                        Alert Message Details
                      </label>
                      <textarea
                        value={customAlertMsg}
                        onChange={(e) => setCustomAlertMsg(e.target.value)}
                        placeholder="e.g., Disk sector block corruption on node worker-02"
                        className="w-full h-20 bg-[#151c24] border border-[#2a2e38] rounded p-2 text-xs text-white placeholder-[#8c909f]/40 focus:outline-none focus:border-[#4e8eff] resize-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!customAlertMsg.trim()) {
                          showToast('Please specify an alert message details', 'warning');
                          return;
                        }
                        triggerMockAlert(customAlertSeverity, customAlertMsg);
                        setCustomAlertMsg('');
                        showToast('Custom simulation alert dispatched', 'success');
                      }}
                      className="w-full py-2 bg-[#4e8eff] hover:bg-[#005ac3] text-white rounded text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Trigger Mock Alert</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PAGE 3: PREDICTIONS VIEW */}
          {activeTab === 'predictions' && (
            <div id="page-predictions" className="space-y-6 animate-slide-in text-left">
              <div className="border-b border-[#2a2e38] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-semibold text-xl text-white">
                    Predictive Forecasting Engine
                  </h2>
                  <p className="text-xs text-[#8c909f] mt-1">
                    Continuous autoregressive forecasts based on multivariate neural metrics history.
                  </p>
                </div>
                <button
                  onClick={handleRetrainModels}
                  disabled={isRetraining}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#4e8eff] hover:bg-[#005ac3] rounded-md text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
                  <span>Retrain Predictor Model</span>
                </button>
              </div>

              {/* Predictions grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {forecasts.map((forecast) => (
                  <ForecastCard key={forecast.id} forecast={forecast} />
                ))}
              </div>

              {/* Model Diagnostics block */}
              <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#2a2e38]/40 pb-2">
                  <Sparkles className="w-4 h-4 text-[#4e8eff]" />
                  <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                    Foresight Predictive Model Diagnostics
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                  <div>
                    <span className="block text-[10px] text-[#8c909f] uppercase tracking-wider mb-1">
                      Neural Network Model Architecture
                    </span>
                    <span className="text-xs font-semibold text-white block">
                      Temporal Convolutional Network (TCN)
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-[#8c909f] uppercase tracking-wider mb-1">
                      Historical Forecast Accuracy
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-400 block">
                      98.42% (MAE: 0.012)
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-[#8c909f] uppercase tracking-wider mb-1">
                      Retraining Sequence Interval
                    </span>
                    <span className="font-sans text-xs text-white block">
                      Every 30 minutes (Auto-sync)
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-[#8c909f] uppercase tracking-wider mb-1">
                      Prediction Horizon Window
                    </span>
                    <span className="font-mono text-xs text-white block">
                      {settings.predictionWindow} minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: LOGS TIMELINE VIEW */}
          {activeTab === 'logs' && (
            <div id="page-logs" className="space-y-6 animate-slide-in text-left">
              <div className="border-b border-[#2a2e38] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-semibold text-xl text-white">
                    Interactive Events Timeline
                  </h2>
                  <p className="text-xs text-[#8c909f] mt-1">
                    Streaming system console logs, alerts trigger sequence, and predictions residuals.
                  </p>
                </div>
                
                {/* Control buttons */}
                <div className="flex items-center gap-2 font-sans">
                  <button
                    onClick={() => setIsLogLive(!isLogLive)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171a21] hover:bg-[#2e353e] border border-[#2a2e38] rounded-md text-xs font-semibold text-[#dce3ef] transition-colors cursor-pointer"
                  >
                    {isLogLive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#4e8eff]" />
                        <span>Pause Stream</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resume Stream</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-[#151c24] border border-[#2a2e38] rounded-md p-4 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between font-sans">
                  
                  {/* Category filters */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-[#8c909f] uppercase tracking-wider self-center mr-2">
                      Category:
                    </span>
                    {(['All', 'System', 'Prediction', 'Alert', 'Stress'] as const).map((category) => (
                      <button
                        key={category}
                        onClick={() => setLogCategoryFilter(category)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                          logCategoryFilter === category
                            ? 'bg-[#192029] text-white border-b-2 border-[#4e8eff]'
                            : 'text-[#8c909f] hover:text-white hover:bg-[#1e222b]'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Level filters */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-[#8c909f] uppercase tracking-wider self-center mr-2">
                      Severity:
                    </span>
                    {(['All', 'info', 'warning', 'error'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setLogLevelFilter(lvl)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                          logLevelFilter === lvl
                            ? 'bg-[#192029] text-white border-b-2 border-amber-500'
                            : 'text-[#8c909f] hover:text-white hover:bg-[#1e222b]'
                        }`}
                      >
                        {lvl === 'All' ? 'All Levels' : lvl}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Text search input */}
                <div className="relative font-sans">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Terminal className="h-4 w-4 text-[#8c909f]" />
                  </span>
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Search messages logs, process ids..."
                    className="w-full bg-[#0d141c] border border-[#2a2e38] rounded-md pl-9 pr-4 py-1.5 text-xs text-[#dce3ef] placeholder-[#8c909f]/50 focus:outline-none focus:border-[#4e8eff] transition-colors"
                  />
                </div>
              </div>

              {/* Streaming Terminal window */}
              <div className="bg-[#080f17] border border-[#2a2e38] rounded-md p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                <div className="space-y-1">
                  {!isLogLive && (
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded p-2.5 mb-3 text-xs text-amber-400 font-sans text-center">
                      Log stream paused. Resuming will sync all buffered diagnostic blocks.
                    </div>
                  )}

                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-20 text-[#8c909f] font-mono text-xs">
                      No matching timeline events found. Try resetting filters.
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <EventTimelineItem key={log.id} log={log} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5: SYSTEM INFO */}
          {activeTab === 'system-info' && (
            <div id="page-system-info" className="animate-slide-in">
              <SystemInfoTable />
            </div>
          )}

          {/* PAGE 6: REPORTS EXPORT VIEW */}
          {activeTab === 'reports' && (
            <div id="page-reports" className="space-y-6 animate-slide-in text-left">
              <div className="border-b border-[#2a2e38] pb-4">
                <h2 className="font-sans font-semibold text-xl text-white">
                  Telemetry Report Builder
                </h2>
                <p className="text-xs text-[#8c909f] mt-1 font-sans">
                  Generate and download customized CSV or PDF logs summaries for infrastructure auditing.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                
                {/* Configuration form */}
                <div className="lg:col-span-2 bg-[#171a21] border border-[#2a2e38] rounded-md p-5 space-y-6">
                  
                  {/* Select range */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider font-bold">
                      Historical Aggregation Range
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: '1h', label: 'Last 1 Hour' },
                        { id: '24h', label: 'Last 24 Hours' },
                        { id: '7d', label: 'Last 7 Days' },
                      ].map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setReportRange(range.id)}
                          className={`py-2 px-3 border rounded text-xs font-semibold font-sans transition-all cursor-pointer ${
                            reportRange === range.id
                              ? 'bg-[#4e8eff]/15 text-[#4e8eff] border-[#4e8eff]'
                              : 'bg-[#151c24] text-[#8c909f] border-[#2a2e38] hover:text-white'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Report structure checklist */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider font-bold">
                      Report Modules Checklist
                    </label>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-[#151c24] hover:bg-[#192029] rounded border border-[#2a2e38] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeMetrics}
                          onChange={(e) => setIncludeMetrics(e.target.checked)}
                          className="rounded border-[#2a2e38] bg-[#0d141c] text-[#4e8eff] focus:ring-[#4e8eff] h-4 w-4"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">Metrics Summary</p>
                          <p className="text-[10px] text-[#8c909f]">CPU, Memory, storage volumes, and bandwidth parameters.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-[#151c24] hover:bg-[#192029] rounded border border-[#2a2e38] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includePredictions}
                          onChange={(e) => setIncludePredictions(e.target.checked)}
                          className="rounded border-[#2a2e38] bg-[#0d141c] text-[#4e8eff] focus:ring-[#4e8eff] h-4 w-4"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">Forecasting & AI Predictions</p>
                          <p className="text-[10px] text-[#8c909f]">Confidence thresholds, predicted breeches, and model diagnostics.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-[#151c24] hover:bg-[#192029] rounded border border-[#2a2e38] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeIncidents}
                          onChange={(e) => setIncludeIncidents(e.target.checked)}
                          className="rounded border-[#2a2e38] bg-[#0d141c] text-[#4e8eff] focus:ring-[#4e8eff] h-4 w-4"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">Incident & Trigger History</p>
                          <p className="text-[10px] text-[#8c909f]">Chronological alert records, acknowledgments, and unresolved logs.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-[#2a2e38]/40">
                    <button
                      onClick={handleExportCSV}
                      className="flex-1 py-2.5 bg-[#151c24] hover:bg-[#1e222b] border border-[#2a2e38] text-white rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Telemetry CSV</span>
                    </button>
                    
                    <button
                      onClick={handleGeneratePDF}
                      disabled={isGeneratingReport}
                      className="flex-1 py-2.5 bg-[#4e8eff] hover:bg-[#005ac3] text-white rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGeneratingReport ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating Summary...</span>
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Generate PDF Report</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Audit helper info panel */}
                <div className="bg-[#171a21]/50 border border-[#2a2e38] rounded-md p-5 h-fit space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#2a2e38]/40 pb-2">
                    <Server className="w-4 h-4 text-[#4e8eff]" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                      Compliance Auditing
                    </span>
                  </div>
                  <p className="text-xs text-[#c2c6d6] leading-relaxed">
                    Reports compiled here are signed with cryptographically verifiable keys and comply with SOC-2 and ISO-27001 diagnostic logging requirements.
                  </p>
                  <p className="text-xs text-[#8c909f] leading-relaxed">
                    Need automated scheduling? Check settings to activate cron-based reports dispatch to secure webhook recipients.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* PAGE 7: SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div id="page-settings" className="space-y-6 animate-slide-in text-left">
              <div className="border-b border-[#2a2e38] pb-4">
                <h2 className="font-sans font-semibold text-xl text-white">
                  Console Parameters & Settings
                </h2>
                <p className="text-xs text-[#8c909f] mt-1 font-sans">
                  Configure real-time thresholds, simulation parameters, and alert notifications toggles.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                
                {/* Left block: threshold sliders */}
                <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#2a2e38]/40 pb-2">
                    <Sliders className="w-4 h-4 text-[#4e8eff]" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                      Diagnostic Alert Thresholds
                    </span>
                  </div>

                  {/* CPU Threshold */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#8c909f]">CPU Warning/Critical Trigger</span>
                      <span className="font-mono font-semibold text-[#4e8eff]">{settings.cpuThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={settings.cpuThreshold}
                      onChange={(e) => updateSettings({ cpuThreshold: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#151c24] rounded-lg appearance-none cursor-pointer accent-[#4e8eff]"
                    />
                  </div>

                  {/* Memory Threshold */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#8c909f]">Memory Warning/Critical Trigger</span>
                      <span className="font-mono font-semibold text-[#4ae183]">{settings.memoryThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={settings.memoryThreshold}
                      onChange={(e) => updateSettings({ memoryThreshold: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#151c24] rounded-lg appearance-none cursor-pointer accent-[#4ae183]"
                    />
                  </div>

                  {/* Disk Threshold */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#8c909f]">Disk Capacity Warning Trigger</span>
                      <span className="font-mono font-semibold text-[#ffb955]">{settings.diskThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="98"
                      value={settings.diskThreshold}
                      onChange={(e) => updateSettings({ diskThreshold: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#151c24] rounded-lg appearance-none cursor-pointer accent-[#ffb955]"
                    />
                  </div>

                </div>

                {/* Right block: Toggles and preferences */}
                <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#2a2e38]/40 pb-2">
                    <Settings className="w-4 h-4 text-[#4e8eff]" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                      General Preferences
                    </span>
                  </div>

                  {/* Refresh rate */}
                  <div className="space-y-2">
                    <label className="block text-xs text-[#8c909f]">
                      Telemetry Refresh Rate Interval
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 500, label: '0.5s' },
                        { value: 1000, label: '1.0s' },
                        { value: 2000, label: '2.0s' },
                        { value: 5000, label: '5.0s' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => updateSettings({ refreshInterval: item.value })}
                          className={`py-1.5 rounded text-xs font-semibold border font-sans transition-all cursor-pointer ${
                            settings.refreshInterval === item.value
                              ? 'bg-[#4e8eff]/10 text-[#4e8eff] border-[#4e8eff]'
                              : 'bg-[#151c24] text-[#8c909f] border-[#2a2e38] hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prediction Window */}
                  <div className="space-y-2">
                    <label className="block text-xs text-[#8c909f]">
                      AI Prediction Window Horizon
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 10, label: '10 Min' },
                        { value: 30, label: '30 Min' },
                        { value: 60, label: '60 Min' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => updateSettings({ predictionWindow: item.value })}
                          className={`py-1.5 rounded text-xs font-semibold border font-sans transition-all cursor-pointer ${
                            settings.predictionWindow === item.value
                              ? 'bg-[#4e8eff]/10 text-[#4e8eff] border-[#4e8eff]'
                              : 'bg-[#151c24] text-[#8c909f] border-[#2a2e38] hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* System Toggles */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs text-white font-medium">Desktop Alerts Notifications</span>
                        <span className="block text-[10px] text-[#8c909f]">Pop notification banners for high priority alarms.</span>
                      </div>
                      <button
                        onClick={() => updateSettings({ enableNotifications: !settings.enableNotifications })}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          settings.enableNotifications ? 'bg-[#4e8eff]' : 'bg-[#2a2e38]'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs text-white font-medium">Acoustic Audio Warning</span>
                        <span className="block text-[10px] text-[#8c909f]">Sound audible warning alarms on critical threshold breech.</span>
                      </div>
                      <button
                        onClick={() => showToast('Acoustic alarm enabled', 'info')}
                        className="p-1.5 rounded bg-[#151c24] hover:bg-[#1e222b] border border-[#2a2e38]"
                      >
                        <Volume2 className="w-4 h-4 text-[#8c909f] hover:text-white" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </main>

        {/* MOBILE RESPONSIVE BOTTOM NAVIGATION TAB BAR */}
        <nav 
          id="mobile-bottom-nav" 
          className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d141c] border-t border-[#2a2e38] flex items-center justify-around py-2.5 z-25 text-[#8c909f]"
        >
          {[
            { id: 'dashboard', name: 'Dashboard', icon: Activity },
            { id: 'alerts', name: 'Alerts', icon: Bell },
            { id: 'predictions', name: 'Predict', icon: TrendingUp },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  isActive ? 'text-[#4e8eff]' : 'hover:text-[#dce3ef]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-sans font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* FLOATING TOAST NOTIFICATIONS POPUP CONTAINER */}
        <div 
          id="toast-container" 
          className="fixed bottom-4 md:bottom-6 right-4 md:right-8 flex flex-col gap-2.5 z-50 pointer-events-auto"
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <MetricsProvider>
      <ForesightAppContent />
    </MetricsProvider>
  );
}
