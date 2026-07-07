import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  details?: string | React.ReactNode;
  statusColor?: 'healthy' | 'warning' | 'critical' | 'neutral';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  suffix,
  icon: Icon,
  details,
  statusColor = 'neutral',
  onClick,
}) => {
  // Map status colors to border and accent colors
  const statusClasses = {
    healthy: 'border-emerald-500/20 text-emerald-400',
    warning: 'border-amber-500/20 text-amber-400',
    critical: 'border-rose-500/20 text-rose-400',
    neutral: 'border-[#2a2e38] text-white',
  };

  const statusBg = {
    healthy: 'bg-emerald-950/10',
    warning: 'bg-amber-950/10',
    critical: 'bg-rose-950/10',
    neutral: 'bg-transparent',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-[#171a21] border ${statusClasses[statusColor]} ${statusBg[statusColor]} rounded-md p-5 flex flex-col justify-between hover:border-slate-500/40 transition-all duration-300 min-h-[110px] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8c909f] leading-none">
          {title}
        </span>
        <Icon className="w-4 h-4 text-[#8c909f]" />
      </div>

      {/* Main Metric Value Row */}
      <div className="my-3 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold tracking-tight text-[#dce3ef]">
          {value}
        </span>
        {suffix && (
          <span className="text-xs font-mono text-[#8c909f]">
            {suffix}
          </span>
        )}
      </div>

      {/* Bottom Sub-details Row */}
      <div className="text-xs text-[#8c909f] font-sans truncate">
        {details}
      </div>
    </div>
  );
};
