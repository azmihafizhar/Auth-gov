import React, { useState } from 'react';
import { 
  KeyRound, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  X, 
  Check, 
  Layers, 
  Search,
  Building2,
  FileCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  History
} from 'lucide-react';
import { GovService, CitizenProfile, VerificationLog } from '../types';
import { sound } from '../utils/sound';

interface SSOPortalTabProps {
  services: GovService[];
  citizen: CitizenProfile;
  logs: VerificationLog[];
  onAddLog: (log: VerificationLog) => void;
  lang: 'id' | 'en';
}

export const SSOPortalTab: React.FC<SSOPortalTabProps> = ({
  services,
  citizen,
  logs,
  onAddLog,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<GovService | null>(null);
  const [authorizing, setAuthorizing] = useState(false);
  const [authSuccessData, setAuthSuccessData] = useState<{ token: string; expiresAt: string } | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunchSSO = (service: GovService) => {
    sound.playTap();
    setSelectedService(service);
    setAuthSuccessData(null);
  };

  const handleConfirmAuthorize = () => {
    sound.playTap();
    setAuthorizing(true);

    setTimeout(() => {
      setAuthorizing(false);
      sound.playSuccess();
      const token = `INAPAS-SSO-JWT-${Math.random().toString(36).substring(2, 10).toUpperCase()}.${Date.now().toString(36)}`;
      setAuthSuccessData({
        token,
        expiresAt: '2 jam ke depan (Auto-refresh)'
      });

      if (selectedService) {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          timestamp: 'Baru saja',
          serviceName: selectedService.name,
          action: 'Single Sign-On (SSO)',
          credentialUsed: 'Identitas Digital (IKD)',
          status: 'Berhasil',
          location: `${citizen.kabKota}, ${citizen.provinsi}`,
          deviceType: 'INative Unified Client'
        };
        onAddLog(newLog);
      }
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-950/90 border border-indigo-500/50">
              <KeyRound className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'id' ? 'Portal Layanan Terpadu (SSO INApas)' : 'Single Sign-On (SSO) Portal'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'id'
                  ? 'Satu akun tunggal untuk masuk ke seluruh portal kementerian & lembaga negara'
                  : 'One single digital identity for all government ministries and public portals'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTap();
              setShowLogModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Riwayat Akses ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari layanan (misal: INAku, DJP Pajak, Paspor, Korlantas, Bansos, BPJS)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-cyan-950/30"
          >
            <div>
              {/* Agency Tag & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 font-mono text-cyan-300 font-semibold truncate max-w-[200px]">
                  {service.agency}
                </span>

                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {service.status}
                </span>
              </div>

              {/* Service Title */}
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {service.description}
              </p>

              {/* Scopes Tag */}
              <div className="mt-3 flex flex-wrap gap-1">
                {service.scopes.map((scope, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                {service.usersCount}
              </span>

              <button
                onClick={() => handleLaunchSSO(service)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all"
              >
                <span>Masuk SSO</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SSO Consent & Authorization Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-600/50 shadow-2xl p-5 text-white">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Otorisasi INApas SSO</h3>
                  <div className="text-[10px] text-cyan-400 font-mono">OpenID Connect 1.0</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!authSuccessData ? (
              <div className="py-4 space-y-4">
                {/* Service info banner */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-sm">
                    {selectedService.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedService.name}</h4>
                    <p className="text-[10px] text-slate-400">{selectedService.agency}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  Aplikasi ini meminta izin untuk mengakses data profil resmi Anda dari <strong>Ditjen Dukcapil Kemendagri</strong>:
                </p>

                {/* Scopes checklist */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  {selectedService.scopes.map((scope, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{scope}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Status Verifikasi Biometrik (LoA Level 3)</span>
                  </div>
                </div>

                {/* Citizen identity confirmation */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-800/40 text-[11px] flex items-center gap-2 text-slate-300">
                  <img
                    src={citizen.photoUrl}
                    alt={citizen.nama}
                    className="w-8 h-8 rounded-md object-cover border border-cyan-500/40"
                  />
                  <div>
                    <span className="font-bold text-white">{citizen.nama}</span>
                    <div className="font-mono text-[10px] text-cyan-400">NIK: {citizen.nik}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmAuthorize}
                    disabled={authorizing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                  >
                    {authorizing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengotorisasi...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Setujui & Lanjutkan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="py-4 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">Login Berhasil!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Anda telah terhubung ke <strong>{selectedService.name}</strong> dengan identitas terverifikasi.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-left space-y-1">
                  <div className="text-slate-500">ID Token (OIDC Standard):</div>
                  <div className="text-cyan-300 break-all">{authSuccessData.token}</div>
                  <div className="text-slate-500 pt-1">Kedaluwarsa: {authSuccessData.expiresAt}</div>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:brightness-110 shadow-md transition-all"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Logs Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Riwayat Autentikasi & Verifikasi</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-white">{log.serviceName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                      {log.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{log.action} • {log.credentialUsed}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>{log.location}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
