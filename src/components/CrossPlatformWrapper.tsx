import React from 'react';
import { Wifi, Battery, Signal, ChevronLeft, MoreHorizontal, Sparkles } from 'lucide-react';
import { PlatformMode } from '../types';

interface CrossPlatformWrapperProps {
  platformMode: PlatformMode;
  children: React.ReactNode;
}

export const CrossPlatformWrapper: React.FC<CrossPlatformWrapperProps> = ({
  platformMode,
  children
}) => {
  if (platformMode === 'desktop-web') {
    return <div className="w-full">{children}</div>;
  }

  const isIos = platformMode === 'mobile-ios';
  const isAndroid = platformMode === 'mobile-android';
  const isTablet = platformMode === 'tablet';

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full flex justify-center py-4 sm:py-8 px-2">
      {/* Device Frame */}
      <div
        className={`relative transition-all duration-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 sm:border-8 ${
          isIos
            ? 'w-full max-w-[410px] aspect-[9/19.5] rounded-[50px] border-slate-700 bg-slate-950 ring-1 ring-slate-600'
            : isAndroid
            ? 'w-full max-w-[400px] aspect-[9/19] rounded-[42px] border-slate-800 bg-slate-950 ring-1 ring-slate-700'
            : 'w-full max-w-[820px] aspect-[4/3] rounded-[36px] border-slate-800 bg-slate-950 ring-1 ring-slate-700'
        } overflow-hidden flex flex-col`}
      >
        {/* Hardware Top Bar (Status bar & Dynamic Island / Punch Hole) */}
        <div className="relative z-30 pt-3 px-6 pb-1 bg-slate-950 text-white flex items-center justify-between text-xs select-none">
          {/* Left: Time */}
          <span className="font-semibold tracking-tight text-[11px] sm:text-xs font-mono">
            {currentTime}
          </span>

          {/* Center Hardware Notch / Island */}
          {isIos && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-6 w-24 bg-black rounded-full border border-slate-800 flex items-center justify-between px-2 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-blue-900/60" />
            </div>
          )}

          {isAndroid && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-3.5 w-3.5 bg-black rounded-full border border-slate-800 shadow-inner" />
          )}

          {isTablet && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-2 w-2 rounded-full bg-slate-800" />
          )}

          {/* Right: Telemetry (Signal, Wifi, Battery) */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3 text-cyan-400" />
            <Wifi className="w-3 h-3 text-cyan-400" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">100%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Device Frame Inner Screen Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-950 text-slate-100 scrollbar-none">
          {children}
        </div>

        {/* Hardware Bottom Bar (iOS Home indicator / Android navigation bar) */}
        <div className="relative z-30 py-2 bg-slate-950 flex items-center justify-center select-none">
          {isIos ? (
            <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
          ) : isAndroid ? (
            <div className="w-20 h-1 bg-slate-500 rounded-full" />
          ) : (
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};
