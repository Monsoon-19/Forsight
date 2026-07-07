import React from 'react';
import { Search, Bell, User, Flame, Play, Square, Settings, RefreshCw } from 'lucide-react';
import { useMetrics } from '../hooks/useMetricsSimulator';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab }) => {
  const { 
    isStressTesting, 
    startStressTest, 
    stopStressTest, 
    metrics, 
    alerts 
  } = useMetrics();

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <header 
      id="top-nav" 
      className="bg-[#0d141c]/90 backdrop-blur-md border-b border-[#2a2e38] px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-10 w-full"
    >
      {/* Left section: Search Bar */}
      <div className="flex items-center flex-1 max-w-md gap-3">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#8c909f]" />
          </span>
          <input
            type="text"
            placeholder="Search resources, alerts, or queries..."
            className="w-full bg-[#151c24] border border-[#2a2e38] rounded-md pl-9 pr-4 py-1.5 text-xs text-[#dce3ef] placeholder-[#8c909f]/60 focus:outline-none focus:border-[#4e8eff] transition-colors"
          />
        </div>
      </div>

      {/* Right section: Control Actions & Utilities */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* State Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151c24] border border-[#2a2e38]">
            <span className={`h-1.5 w-1.5 rounded-full ${isStressTesting ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#8c909f]">
              {isStressTesting ? 'STRESSED' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Stress Test Controller Buttons (PRIMARY INTERACTIVE CALL) */}
        {isStressTesting ? (
          <button
            id="stop-stress-btn"
            onClick={stopStressTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500 text-amber-400 font-sans text-xs font-semibold tracking-wide transition-all duration-150 shadow-[0_0_10px_rgba(245,158,11,0.1)] cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>Stop Stress Test</span>
          </button>
        ) : (
          <button
            id="start-stress-btn"
            onClick={startStressTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500 text-rose-400 font-sans text-xs font-semibold tracking-wide transition-all duration-150 shadow-[0_0_10px_rgba(239,68,68,0.1)] cursor-pointer animate-pulse"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Start Stress Test</span>
          </button>
        )}

        {/* Vertical divider */}
        <div className="h-4 w-[1px] bg-[#2a2e38] hidden sm:block" />

        {/* Alerts tab button shortcut with dynamic count badge */}
        <button 
          id="top-nav-alerts-shortcut"
          onClick={() => setActiveTab('alerts')}
          className="relative p-1.5 rounded-md hover:bg-[#151c24] text-[#8c909f] hover:text-white transition-colors"
          title="Active Alerts"
        >
          <Bell className="w-4.5 h-4.5" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-rose-500 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-[#0d141c]">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Settings button shortcut */}
        <button 
          id="top-nav-settings-shortcut"
          onClick={() => setActiveTab('settings')}
          className="p-1.5 rounded-md hover:bg-[#151c24] text-[#8c909f] hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>

        {/* User avatar signature header details */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#192029] border border-[#2a2e38] flex items-center justify-center text-[#4e8eff] hover:border-[#4e8eff] transition-colors cursor-pointer">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
