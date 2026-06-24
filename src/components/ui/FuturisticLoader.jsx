import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

export const FuturisticLoader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("SYSTEM_INIT");
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Generate random HUD lines
    const interval = setInterval(() => {
      setLines(prev => [`> 0x${Math.floor(Math.random()*10000).toString(16).toUpperCase()}`, ...prev.slice(0, 4)]);
    }, 100);

    const progress = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(progress);
          clearInterval(interval);
          setStatus("COMPLETE");
          setTimeout(onComplete, 800);
          return 100;
        }
        if (prev === 30) setStatus("LOADING_MODULES");
        if (prev === 60) setStatus("VERIFYING_CORE");
        if (prev === 90) setStatus("FINALIZING");
        return prev + 1;
      });
    }, 20);
    return () => { clearInterval(progress); clearInterval(interval); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center text-emerald-500 font-mono overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* HUD Container - Scaled Up */}
      <div className="relative flex flex-col items-center justify-center w-full h-full max-w-3xl scale-125">
        
        {/* Spinning Rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-emerald-500/20 border-t-emerald-500/80 animate-[spin_4s_linear_infinite]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/10 border-b-emerald-500/50 animate-[spin_6s_linear_infinite_reverse]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-emerald-500/10 animate-[spin_10s_linear_infinite]"></div>

        {/* Center Content */}
        <div className="flex flex-col items-center z-10 p-12 bg-slate-950/80 backdrop-blur-sm rounded-full border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <Cpu size={80} className="text-emerald-400 animate-pulse mb-6" />
          <div className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-700">
            {count}%
          </div>
          <div className="text-sm tracking-[0.3em] text-emerald-400/70 mt-2">{status}</div>
        </div>

        {/* Decor: Scanning Line */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[100px] w-full animate-[ping_3s_linear_infinite]"></div>

        {/* Decor: Data Stream */}
        <div className="absolute bottom-20 right-20 text-xs text-emerald-500/60 flex flex-col items-end font-mono">
          {lines.map((line, i) => (
            <div key={i} className="opacity-70">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
