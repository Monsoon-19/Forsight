import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { HistoricalDataPoint } from '../types';
import { Maximize2, MoreHorizontal } from 'lucide-react';

interface ChartPanelProps {
  id?: string;
  title: string;
  type: 'utilization' | 'network' | 'latency' | 'generic';
  data: HistoricalDataPoint[];
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  id,
  title,
  type,
  data,
}) => {
  // Custom tooltip styles matching Grafana style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e222b] border border-[#2a2e38] p-3 rounded-sm shadow-md font-mono text-xs">
          <p className="text-[#8c909f] mb-1.5 font-sans font-medium text-[10px] uppercase tracking-wider">{label}</p>
          <div className="space-y-1">
            {payload.map((pld: any) => (
              <div key={pld.name} className="flex items-center gap-4 justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pld.color }} />
                  <span className="text-[#c2c6d6] font-sans">{pld.name}:</span>
                </span>
                <span className="font-semibold text-white">
                  {pld.value} {type === 'network' ? 'GB/s' : type === 'latency' ? 'ms' : '%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id={id}
      className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 flex flex-col h-[320px] hover:border-slate-500/30 transition-all duration-300"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8c909f]">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <button className="text-[#8c909f] hover:text-white p-1 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recharts Wrapper */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'utilization' ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4e8eff" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4e8eff" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ae183" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4ae183" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e38" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#8c909f" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#8c909f" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
                fontFamily="JetBrains Mono"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={20} 
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ 
                  fontSize: '11px', 
                  fontFamily: 'Inter', 
                  paddingTop: '10px',
                  color: '#8c909f'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                name="CPU" 
                stroke="#4e8eff" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorCpu)" 
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                name="Memory" 
                stroke="#4ae183" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorMemory)" 
              />
            </AreaChart>
          ) : type === 'network' ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNetUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb955" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ffb955" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorNetDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#aec6ff" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#aec6ff" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e38" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#8c909f" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#8c909f" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={20} 
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ 
                  fontSize: '11px', 
                  fontFamily: 'Inter', 
                  paddingTop: '10px',
                  color: '#8c909f'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="networkDown" 
                name="RX Downlink" 
                stroke="#aec6ff" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorNetDown)" 
              />
              <Area 
                type="monotone" 
                dataKey="networkUp" 
                name="TX Uplink" 
                stroke="#ffb955" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorNetUp)" 
              />
            </AreaChart>
          ) : (
            // Latency chart
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#aec6ff" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#aec6ff" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e38" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#8c909f" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#8c909f" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={20} 
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ 
                  fontSize: '11px', 
                  fontFamily: 'Inter', 
                  paddingTop: '10px',
                  color: '#8c909f'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="responseTime" 
                name="Response Time" 
                stroke="#aec6ff" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorLatency)" 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
