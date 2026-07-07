import React from 'react';
import { Forecast } from '../types';
import { Brain, TrendingUp, TrendingDown, MoveRight, HelpCircle, AlertTriangle } from 'lucide-react';

interface ForecastCardProps {
  id?: string;
  forecast: Forecast;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ id, forecast }) => {
  // Map risk levels to visual tokens
  const riskStyles = {
    Low: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-900/50', dot: 'bg-emerald-500' },
    Moderate: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900/50', dot: 'bg-amber-500' },
    High: { text: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-900/50', dot: 'bg-orange-500' },
    Critical: { text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-900/50', dot: 'bg-rose-500' },
  };

  const trendIcons = {
    Rising: { icon: TrendingUp, color: 'text-rose-400', arrow: '↗' },
    Falling: { icon: TrendingDown, color: 'text-emerald-400', arrow: '↘' },
    Stable: { icon: MoveRight, color: 'text-[#8c909f]', arrow: '→' },
  };

  const style = riskStyles[forecast.risk] || riskStyles.Low;
  const trendInfo = trendIcons[forecast.trend] || trendIcons.Stable;
  const TrendIconComponent = trendInfo.icon;

  return (
    <div
      id={id || `forecast-card-${forecast.id}`}
      className="bg-[#171a21]/50 border border-[#2a2e38] rounded-md p-4 flex flex-col hover:border-slate-500/20 transition-all duration-300"
    >
      {/* Header section with Name and Risk Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#4e8eff]" />
          <h4 className="font-sans font-semibold text-white text-sm">
            {forecast.name}
          </h4>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-wider font-bold ${style.bg} ${style.border} ${style.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          <span>{forecast.risk} Risk</span>
        </div>
      </div>

      {/* Main predictions grid info */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-left border-y border-[#2a2e38]/30 py-3">
        <div>
          <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#8c909f] mb-1">
            PREDICTED IN {forecast.timeframe.toUpperCase()}
          </span>
          <span className="font-mono text-base font-semibold text-white">
            {forecast.predictedValue}%
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#8c909f] mb-1">
            CONFIDENCE
          </span>
          <span className="font-mono text-base font-semibold text-white">
            {forecast.confidence.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#8c909f] mb-1">
            TREND
          </span>
          <span className={`font-sans text-xs font-semibold flex items-center gap-1 ${trendInfo.color}`}>
            <TrendIconComponent className="w-3.5 h-3.5" />
            <span>{forecast.trend} {trendInfo.arrow}</span>
          </span>
        </div>
      </div>

      {/* Details explanation row */}
      <div className="text-[11px] text-[#c2c6d6] font-sans flex items-start gap-1.5 leading-normal">
        <AlertTriangle className="w-3 h-3 shrink-0 text-[#8c909f]/80 mt-0.5" />
        <p className="text-left">{forecast.details}</p>
      </div>
    </div>
  );
};
