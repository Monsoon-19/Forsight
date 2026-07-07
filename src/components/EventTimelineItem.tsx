import React from 'react';
import { LogEntry } from '../types';
import { Terminal, Brain, AlertTriangle, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface EventTimelineItemProps {
  log: LogEntry;
}

export const EventTimelineItem: React.FC<EventTimelineItemProps> = ({ log }) => {
  // Category styles configuration
  const categoryStyles = {
    System: {
      color: 'text-sky-400 border-sky-900/30',
      bg: 'bg-sky-950/20',
      icon: Terminal,
    },
    Prediction: {
      color: 'text-indigo-400 border-indigo-900/30',
      bg: 'bg-indigo-950/20',
      icon: Brain,
    },
    Alert: {
      color: 'text-amber-400 border-amber-900/30',
      bg: 'bg-amber-950/20',
      icon: ShieldAlert,
    },
    Stress: {
      color: 'text-rose-400 border-rose-900/30',
      bg: 'bg-rose-950/20',
      icon: Flame,
    },
  };

  const style = categoryStyles[log.category] || categoryStyles.System;
  const CategoryIcon = style.icon;

  const levelColorMap = {
    info: 'text-[#dce3ef]',
    warning: 'text-amber-400',
    error: 'text-rose-400 font-medium',
  };

  const textClass = levelColorMap[log.level] || 'text-[#dce3ef]';

  return (
    <div className="group flex items-start gap-4 py-2 border-b border-[#2a2e38]/30 hover:bg-[#151c24]/20 px-3 -mx-3 rounded transition-colors text-left">
      {/* Timestamp in monospace font */}
      <span className="font-mono text-[11px] text-[#8c909f] w-18 pt-0.5 shrink-0 select-none">
        {log.timestamp}
      </span>

      {/* Category Indicator Tag */}
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] uppercase font-bold shrink-0 ${style.color} ${style.bg} font-sans`}>
        <CategoryIcon className="w-3 h-3" />
        <span>{log.category}</span>
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 font-mono text-[11px] leading-relaxed">
        <p className={`${textClass} break-all truncate group-hover:text-white transition-colors`}>
          {log.message}
        </p>
      </div>
    </div>
  );
};
