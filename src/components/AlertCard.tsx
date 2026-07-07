import React from 'react';
import { Alert } from '../types';
import { AlertTriangle, ShieldCheck, CheckCircle2, Clock, Server } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onResolve }) => {
  const severityStyles = {
    Critical: {
      border: 'border-rose-900/60 hover:border-rose-500/30',
      bg: 'bg-rose-950/20',
      text: 'text-rose-400',
      icon: AlertTriangle,
      dot: 'bg-rose-500',
    },
    Warning: {
      border: 'border-amber-900/60 hover:border-amber-500/30',
      bg: 'bg-amber-950/20',
      text: 'text-amber-400',
      icon: AlertTriangle,
      dot: 'bg-amber-500',
    },
    Info: {
      border: 'border-[#2a2e38] hover:border-slate-500/20',
      bg: 'bg-[#151c24]',
      text: 'text-sky-400',
      icon: Clock,
      dot: 'bg-sky-500',
    },
  };

  const currentStyle = severityStyles[alert.severity] || severityStyles.Info;
  const AlertIcon = currentStyle.icon;

  return (
    <div
      id={`alert-card-${alert.id}`}
      className={`border rounded-md p-4 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        alert.resolved 
          ? 'border-[#2a2e38]/50 bg-[#151c24]/30 opacity-60' 
          : `${currentStyle.border} ${currentStyle.bg}`
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 text-left">
        {/* Severity Icon Indicator */}
        <div className={`mt-0.5 p-1.5 rounded bg-[#0d141c] border border-[#2a2e38] ${alert.resolved ? 'text-[#8c909f]' : currentStyle.text}`}>
          {alert.resolved ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertIcon className="w-4 h-4" />
          )}
        </div>

        {/* Core details */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              alert.resolved 
                ? 'bg-[#192029] text-[#8c909f]' 
                : alert.severity === 'Critical' 
                ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' 
                : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
            }`}>
              {alert.resolved ? 'RESOLVED' : alert.severity}
            </span>
            <span className="text-xs font-mono text-[#8c909f] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {alert.timestamp}
            </span>
            <span className="text-xs font-mono text-[#8c909f] flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              {alert.node}
            </span>
          </div>
          <p className={`text-sm font-medium ${alert.resolved ? 'text-[#8c909f]' : 'text-white'}`}>
            {alert.message}
          </p>
        </div>
      </div>

      {/* Action panel */}
      <div className="flex items-center justify-end">
        {alert.resolved ? (
          <span className="text-[11px] font-sans font-semibold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Cleared</span>
          </span>
        ) : (
          onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              className="px-3 py-1 text-xs font-semibold rounded bg-[#192029] hover:bg-[#2e353e] text-[#dce3ef] border border-[#2a2e38] transition-all duration-150 cursor-pointer"
            >
              Acknowledge
            </button>
          )
        )}
      </div>
    </div>
  );
};
