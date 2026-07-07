import React from 'react';
import { 
  Activity, 
  Bell, 
  TrendingUp, 
  Terminal, 
  Server, 
  FileSpreadsheet, 
  Settings,
  ShieldCheck,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { useMetrics } from '../hooks/useMetricsSimulator';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { metrics, isStressTesting } = useMetrics();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'alerts', name: 'Alerts', icon: Bell, badge: true },
    { id: 'predictions', name: 'Predictions', icon: TrendingUp },
    { id: 'logs', name: 'Logs', icon: Terminal },
    { id: 'system-info', name: 'System Info', icon: Server },
    { id: 'reports', name: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Map health state to colors
  const statusColors = {
    Healthy: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/50', dot: 'bg-emerald-500' },
    Warning: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50', dot: 'bg-amber-500' },
    Critical: { text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-800/50', dot: 'bg-rose-500' },
  };

  const status = metrics.status;
  const colors = statusColors[status];

  return (
    <aside 
      id="sidebar" 
      className="hidden md:flex flex-col w-64 bg-[#0d141c] border-r border-[#2a2e38] h-screen sticky top-0 text-[#dce3ef] select-none"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[#2a2e38] flex items-center gap-3">
        {/* Custom SVG logo matching the uploaded asset */}
        <div className="w-8 h-8 flex items-center justify-center text-[#4e8eff]">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-7 h-7">
            {/* Left Bar */}
            <rect x="15" y="45" width="12" height="40" rx="6" />
            {/* Middle Bar */}
            <rect x="37" y="28" width="12" height="57" rx="6" />
            {/* Right Bar and curve */}
            <path d="M 59, 15 H 73 C 81,15 85,19 85,27 V 40 C 85,48 81,52 73,52 H 71 C 67,52 65,50 65,46 V 34" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Floating Connection dots */}
            <rect x="25" y="48" width="12" height="12" rx="3" transform="rotate(45 25 48)" opacity="0.4" />
            <rect x="47" y="32" width="12" height="12" rx="3" transform="rotate(45 47 32)" opacity="0.4" />
          </svg>
        </div>
        <div>
          <h1 className="font-sans font-semibold text-lg leading-tight tracking-tight text-white">
            Foresight
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8c909f] font-medium">
            AI-Infrastructure
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-sans text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#192029] text-white border-l-2 border-[#4e8eff] pl-2.5'
                  : 'text-[#c2c6d6] hover:bg-[#151c24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#4e8eff]' : 'text-[#8c909f]'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && status === 'Critical' && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stress Test Indicator & Status Pill */}
      <div className="p-4 border-t border-[#2a2e38] space-y-3">
        {isStressTesting && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-rose-950/20 border border-rose-900/40 text-rose-400 text-xs font-sans animate-pulse">
            <Flame className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            <span className="font-medium">Workload Stress Active</span>
          </div>
        )}

        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border ${colors.bg} ${colors.border} transition-all duration-300`}>
          <span className={`h-2.5 w-2.5 rounded-full ${colors.dot} shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#8c909f] leading-none mb-0.5">
              System Status
            </p>
            <p className={`text-xs font-semibold ${colors.text} leading-none`}>
              {status}
            </p>
          </div>
        </div>

        {/* User avatar signature */}
        <div className="flex items-center gap-3 pt-2 pl-1 border-t border-[#2a2e38]/40">
          <div className="w-7 h-7 rounded-full bg-[#192029] border border-[#2a2e38] overflow-hidden flex items-center justify-center">
            {/* Generate user initial block */}
            <span className="text-[11px] font-bold text-[#4e8eff]">UM</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-medium text-white truncate leading-none mb-0.5">
              Upendra Murmu
            </p>
            <p className="text-[9px] font-mono text-[#8c909f] truncate leading-none">
              operator@ctl-plane
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
