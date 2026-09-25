/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Wallet, 
  ScanFace, 
  KeyRound, 
  QrCode, 
  Code2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Smartphone, 
  ChevronRight,
  Info,
  ExternalLink,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Header } from './components/Header';
import { DigitalKTPCard } from './components/DigitalKTPCard';
import { IdentityWalletTab } from './components/IdentityWalletTab';
import { BiometricVerificationTab } from './components/BiometricVerificationTab';
import { SSOPortalTab } from './components/SSOPortalTab';
import { QRFacePassTab } from './components/QRFacePassTab';
import { INativeFrameworkTab } from './components/INativeFrameworkTab';
import { CitizenSwitcherModal } from './components/CitizenSwitcherModal';
import { SecurityComplianceModal } from './components/SecurityComplianceModal';
import { CrossPlatformWrapper } from './components/CrossPlatformWrapper';
import { 
  PlatformMode, 
  ActiveTab, 
  CitizenProfile, 
  CredentialCard, 
  GovService, 
  VerificationLog 
} from './types';
import { SAMPLE_CITIZENS, INITIAL_CREDENTIALS, GOV_SERVICES, INITIAL_LOGS } from './data/mockData';
import { sound } from './utils/sound';

export default function App() {
  const [platformMode, setPlatformMode] = useState<PlatformMode>('desktop-web');
  const [activeTab, setActiveTab] = useState<ActiveTab>('identity');
  const [activeCitizen, setActiveCitizen] = useState<CitizenProfile>(SAMPLE_CITIZENS[0]);
  const [credentials, setCredentials] = useState<CredentialCard[]>(INITIAL_CREDENTIALS);
  const [services] = useState<GovService[]>(GOV_SERVICES);
  const [logs, setLogs] = useState<VerificationLog[]>(INITIAL_LOGS);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Sync credentials holder name whenever citizen changes
  useEffect(() => {
    setCredentials((prev) =>
      prev.map((c) => ({
        ...c,
        holderName: c.id === 'cred-kk' ? `${activeCitizen.nama} (Kepala Keluarga)` : activeCitizen.nama,
        cardNumber: c.id === 'cred-ktp' ? activeCitizen.nik : c.cardNumber
      }))
    );
  }, [activeCitizen]);

  const handleAddLog = (newLog: VerificationLog) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleInstallPwa = () => {
    sound.playSuccess();
    setIsPwaInstalled(true);
    alert('Aplikasi INApas siap digunakan dalam mode native offline (PWA installed).');
  };

  const tabs = [
    { id: 'identity', label: lang === 'id' ? 'KTP Digital (IKD)' : 'Digital ID', icon: CreditCard },
    { id: 'wallet', label: lang === 'id' ? 'Identity Wallet' : 'Wallet', icon: Wallet, count: credentials.length },
    { id: 'biometric', label: lang === 'id' ? 'Verifikasi Biometrik' : 'Biometrics', icon: ScanFace },
    { id: 'sso', label: lang === 'id' ? 'Layanan Terpadu (SSO)' : 'SSO Services', icon: KeyRound, count: services.length },
    { id: 'qrpass', label: lang === 'id' ? 'QR Face Pass' : 'QR Pass', icon: QrCode },
    { id: 'inative-sdk', label: lang === 'id' ? 'INative Framework SDK' : 'INative SDK', icon: Code2, isHighlight: true }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'identity':
        return (
          <div className="space-y-6">
            {/* Quick Hero Introduction */}
            <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Identitas Kependudukan Digital (IKD) Resmi Ditjen Dukcapil</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {lang === 'id' ? 'Satu Identitas Digital untuk Seluruh Warga' : 'One National Digital Identity'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {lang === 'id'
                  ? 'Kartu KTP digital berenkripsi tinggi dengan chip NFC ISO-7816, QR dinamis, dan verifikasi biometrik terhubung ke GovTech Indonesia.'
                  : 'High-security encrypted digital national identity card with dynamic rotating QR and live biometric verification.'}
              </p>
            </div>

            {/* The 3D Digital KTP Card */}
            <DigitalKTPCard citizen={activeCitizen} lang={lang} />

            {/* Quick Feature Grid Below Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto pt-2">
              <div 
                onClick={() => {
                  sound.playTap();
                  setActiveTab('biometric');
                }}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 group-hover:bg-cyan-900 transition-colors">
                    <ScanFace className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">99.8% Match</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Biometrik Liveness</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Verifikasi wajah anti-spoofing terhubung langsung ke Dukcapil Kemendagri.
                </p>
              </div>

              <div 
                onClick={() => {
                  sound.playTap();
                  setActiveTab('wallet');
                }}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-950 text-blue-400 group-hover:bg-blue-900 transition-colors">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono font-semibold">{credentials.length} Dokumen</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Identity Wallet</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  KTP, Kartu Keluarga, NPWP 16 digit, BPJS Kesehatan, dan SIM terintegrasi.
                </p>
              </div>

              <div 
                onClick={() => {
                  sound.playTap();
                  setActiveTab('sso');
                }}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 group-hover:bg-indigo-900 transition-colors">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono font-semibold">SSO Portal</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Layanan Terpadu</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Satu akun tunggal ke INAku, INAgov, Pajak, Paspor, Korlantas, dan Bansos.
                </p>
              </div>
            </div>
          </div>
        );
      case 'wallet':
        return <IdentityWalletTab credentials={credentials} citizen={activeCitizen} lang={lang} />;
      case 'biometric':
        return <BiometricVerificationTab citizen={activeCitizen} lang={lang} />;
      case 'sso':
        return (
          <SSOPortalTab
            services={services}
            citizen={activeCitizen}
            logs={logs}
            onAddLog={handleAddLog}
            lang={lang}
          />
        );
      case 'qrpass':
        return <QRFacePassTab citizen={activeCitizen} lang={lang} />;
      case 'inative-sdk':
        return <INativeFrameworkTab lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#071320] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        platformMode={platformMode}
        onPlatformChange={(mode) => setPlatformMode(mode)}
        activeCitizen={activeCitizen}
        onOpenCitizenSwitcher={() => setIsCitizenModalOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'id' ? 'en' : 'id')}
        onInstallPwa={handleInstallPwa}
        isPwaInstalled={isPwaInstalled}
      />

      {/* Main Framework Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Navigation Tabs (Top Bar) */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 pb-4 overflow-x-auto scrollbar-none border-b border-cyan-900/30 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playTap();
                  setActiveTab(tab.id as ActiveTab);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-[1.02]'
                    : tab.isHighlight
                    ? 'bg-slate-900/90 text-cyan-300 border border-cyan-600/50 hover:bg-cyan-950/70'
                    : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.isHighlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-cyan-900 text-cyan-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Viewport Render: Wrapped in Mobile / Tablet / Desktop simulator */}
        <CrossPlatformWrapper platformMode={platformMode}>
          {renderActiveTabContent()}
        </CrossPlatformWrapper>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-cyan-900/30 bg-slate-950/90 py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs">
              INA
            </div>
            <div>
              <div className="text-white font-bold">
                INApas &bull; INA DIGITAL &bull; GovTech Indonesia
              </div>
              <div className="text-[11px] text-slate-400">
                Penyelenggara Keterpaduan Ekosistem Layanan Digital Nasional &bull; Perum Percetakan Uang RI (PERURI)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => {
                sound.playTap();
                setIsSecurityModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-cyan-300 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standar Keamanan & Perpres No. 82/2023</span>
            </button>

            <span className="text-slate-700">|</span>

            <button
              onClick={() => {
                sound.playTap();
                setIsCitizenModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Ganti Profil Warga ({activeCitizen.nama.split(' ')[0]})</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Citizen Switcher Modal */}
      <CitizenSwitcherModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        activeCitizen={activeCitizen}
        onSelectCitizen={(c) => setActiveCitizen(c)}
        lang={lang}
      />

      {/* Security & Compliance Modal */}
      <SecurityComplianceModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
