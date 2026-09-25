import React from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Tablet, 
  UserCheck, 
  Globe2, 
  Lock,
  Download,
  Share2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PlatformMode, CitizenProfile } from '../types';
import { sound } from '../utils/sound';

interface HeaderProps {
  platformMode: PlatformMode;
  onPlatformChange: (mode: PlatformMode) => void;
  activeCitizen: CitizenProfile;
  onOpenCitizenSwitcher: () => void;
  lang: 'id' | 'en';
  onToggleLang: () => void;
  onInstallPwa: () => void;
  isPwaInstalled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  platformMode,
  onPlatformChange,
  activeCitizen,
  onOpenCitizenSwitcher,
  lang,
  onToggleLang,
  onInstallPwa,
  isPwaInstalled
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-900/30">
      {/* Top Gov Ribbon */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 px-4 py-1 text-[11px] text-slate-300 flex items-center justify-between border-b border-red-800/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide text-white">REPUBLIK INDONESIA</span>
          <span className="text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">INA DIGITAL &bull; GovTech Indonesia &bull; PERURI</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <Lock className="w-3 h-3" /> Zero-Trust ISO 27001
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-300 font-mono">BSrE BSSN Certified</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-amber-500/20" />
              {/* Stylized Garuda/Seal Symbol */}
              <div className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 flex items-center">
                INA
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950">
              <CheckCircle2 className="h-2.5 w-2.5 text-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                INA<span className="text-cyan-400">pas</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono font-medium">
                INative v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {lang === 'id' ? 'Satu Identitas Digital Indonesia' : 'National Digital Identity of Indonesia'}
            </p>
          </div>
        </div>

        {/* Platform Viewport Switcher (Center) */}
        <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <div className="text-[10px] uppercase font-mono px-2 text-slate-400 font-semibold tracking-wider">
            Framework View:
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onPlatformChange('desktop-web');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platformMode === 'desktop-web'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Desktop Web Portal"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Web Portal</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onPlatformChange('mobile-ios');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platformMode === 'mobile-ios'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="iOS iPhone Frame (INative iOS)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iOS App</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onPlatformChange('mobile-android');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platformMode === 'mobile-android'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Android Pixel Frame (INative Android)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onPlatformChange('tablet');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platformMode === 'tablet'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Tablet / Gov Kiosk Frame"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet/Kiosk</span>
          </button>
        </div>

        {/* Right Actions: Citizen Switcher, Language & PWA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Citizen Pill */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenCitizenSwitcher();
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-800/40 hover:border-cyan-500/70 transition-all text-left group"
            title="Klik untuk ganti profil warga / NIK demo"
          >
            <img
              src={activeCitizen.photoUrl}
              alt={activeCitizen.nama}
              className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40 group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {activeCitizen.nama}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">
                NIK: {activeCitizen.nik.slice(0, 6)}...{activeCitizen.nik.slice(-4)}
              </div>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />
          </button>

          {/* Lang Switch */}
          <button
            onClick={() => {
              sound.playTap();
              onToggleLang();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Switch Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono uppercase">{lang}</span>
          </button>

          {/* PWA Install Button */}
          <button
            onClick={() => {
              sound.playTap();
              onInstallPwa();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 hover:text-white text-xs font-medium transition-all shadow-sm"
            title="Install INApas Progressive Web App"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isPwaInstalled ? 'PWA Terpasang' : 'Pasang App'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
