import React from 'react';
import { Server, Cpu, Database, HardDrive, Wifi, ShieldAlert } from 'lucide-react';

export const SystemInfoTable: React.FC = () => {
  return (
    <div id="system-info-container" className="space-y-6 text-left">
      
      {/* Description header */}
      <div className="border-b border-[#2a2e38] pb-4">
        <h2 className="font-sans font-semibold text-xl text-white">
          System Architecture & Information
        </h2>
        <p className="text-xs text-[#8c909f] mt-1 font-sans">
          Static configuration and hardware details for the primary control plane.
        </p>
      </div>

      {/* Grid for Host, Processor, and Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Host Overview */}
        <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#2a2e38]/40 pb-2">
              <Server className="w-4 h-4 text-[#4e8eff]" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                Host Overview
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Hostname
                </span>
                <span className="font-mono text-xs text-[#dce3ef] font-semibold">
                  ctl-plane-alpha-01
                </span>
              </div>
              
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Operating System
                </span>
                <span className="font-sans text-xs text-[#dce3ef] font-semibold">
                  Ubuntu 22.04.3 LTS
                </span>
              </div>
              
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Kernel Version
                </span>
                <span className="font-mono text-xs text-[#dce3ef]">
                  6.2.0-1018-gcp
                </span>
              </div>
              
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Uptime
                </span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  142d 18h 45m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Processor */}
        <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#2a2e38]/40 pb-2">
              <Cpu className="w-4 h-4 text-[#4e8eff]" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                Processor
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Model
                </span>
                <span className="font-sans text-xs text-[#dce3ef] font-semibold block">
                  Intel(R) Xeon(R) Platinum 8481C
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                    Cores
                  </span>
                  <span className="font-mono text-xs text-[#dce3ef] font-semibold">
                    64 vCPU (32 Physical)
                  </span>
                </div>
                
                <div>
                  <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                    Architecture
                  </span>
                  <span className="font-mono text-xs text-[#dce3ef]">
                    x86_64
                  </span>
                </div>
                
                <div>
                  <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                    Base Clock
                  </span>
                  <span className="font-mono text-xs text-[#dce3ef]">
                    2.70 GHz
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5 flex flex-col justify-between lg:col-span-2">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#2a2e38]/40 pb-2">
              <Database className="w-4 h-4 text-[#4e8eff]" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
                Memory Information
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Total RAM
                </span>
                <span className="font-mono text-xs text-white font-semibold">
                  256 GB DDR5 ECC
                </span>
              </div>
              
              <div>
                <span className="block text-[10px] font-sans text-[#8c909f] uppercase tracking-wider mb-0.5">
                  Swap Total
                </span>
                <span className="font-mono text-xs text-white font-semibold">
                  8 GB
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mounted Storage Table */}
      <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-[#2a2e38]/40 pb-2">
          <HardDrive className="w-4 h-4 text-[#4e8eff]" />
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
            Mounted Storage
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#2a2e38]">
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/4">
                  Mount Point
                </th>
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/3">
                  Device
                </th>
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/6">
                  Type
                </th>
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/4 text-right">
                  Capacity
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-[#dce3ef] divide-y divide-[#2a2e38]/20">
              <tr className="hover:bg-[#151c24]/30">
                <td className="py-2.5 font-semibold text-[#4e8eff]">/</td >
                <td className="py-2.5">/dev/nvme0n1p1</td>
                <td className="py-2.5 text-[#8c909f]">ext4</td>
                <td className="py-2.5 text-right text-white font-semibold">512 GB</td>
              </tr>
              <tr className="hover:bg-[#151c24]/30">
                <td className="py-2.5 font-semibold text-[#4e8eff]">/data</td>
                <td className="py-2.5">zpool01</td>
                <td className="py-2.5 text-[#8c909f]">zfs</td>
                <td className="py-2.5 text-right text-white font-semibold">4.0 TB</td>
              </tr>
              <tr className="hover:bg-[#151c24]/30">
                <td className="py-2.5 font-semibold text-[#4e8eff]">/var/log</td>
                <td className="py-2.5">/dev/sdb1</td>
                <td className="py-2.5 text-[#8c909f]">xfs</td>
                <td className="py-2.5 text-right text-white font-semibold">1.0 TB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Interfaces Table */}
      <div className="bg-[#171a21] border border-[#2a2e38] rounded-md p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-[#2a2e38]/40 pb-2">
          <Wifi className="w-4 h-4 text-[#4e8eff]" />
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-white">
            Network Interfaces
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#2a2e38]">
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/4">
                  Interface
                </th>
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/4">
                  State
                </th>
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/3">
                  MAC Address
                </th>
                <th className="py-2.5 text-[10px] font-bold text-[#8c909f] uppercase tracking-wider w-1/4 text-right">
                  IPv4 Address
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-[#dce3ef] divide-y divide-[#2a2e38]/20">
              <tr className="hover:bg-[#151c24]/30">
                <td className="py-2.5 font-semibold text-white">eth0</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 text-[10px] font-semibold border border-emerald-900/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>UP</span>
                  </span>
                </td>
                <td className="py-2.5 text-[#8c909f]">42:01:0a:80:00:03</td>
                <td className="py-2.5 text-right font-semibold">10.128.0.3/32</td>
              </tr>
              <tr className="hover:bg-[#151c24]/30">
                <td className="py-2.5 font-semibold text-white">docker0</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 text-[10px] font-semibold border border-emerald-900/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>UP</span>
                  </span>
                </td>
                <td className="py-2.5 text-[#8c909f]">02:42:0b:39:a1:4c</td>
                <td className="py-2.5 text-right font-semibold">172.17.0.1/16</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
