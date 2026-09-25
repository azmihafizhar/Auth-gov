import React, { useState } from 'react';
import QRCode from 'qrcode';
import { 
  Wallet, 
  ShieldCheck, 
  QrCode as QrIcon, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Lock, 
  FileCheck, 
  Share2, 
  X,
  CreditCard,
  PlusCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { CredentialCard, CitizenProfile } from '../types';
import { sound } from '../utils/sound';

interface IdentityWalletTabProps {
  credentials: CredentialCard[];
  citizen: CitizenProfile;
  lang: 'id' | 'en';
}

export const IdentityWalletTab: React.FC<IdentityWalletTabProps> = ({ credentials, citizen, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCard, setSelectedCard] = useState<CredentialCard | null>(null);
  const [modalQrUrl, setModalQrUrl] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  const categories = ['Semua', 'Kependudukan', 'Pajak & Keuangan', 'Kesehatan', 'Transportasi', 'Pendidikan & Legal'];

  const filteredCredentials = selectedCategory === 'Semua' 
    ? credentials 
    : credentials.filter(c => c.category === selectedCategory);

  const handleOpenCard = async (card: CredentialCard) => {
    sound.playTap();
    setSelectedCard(card);
    try {
      const url = await QRCode.toDataURL(card.qrPayload, {
        width: 240,
        margin: 1,
        color: { dark: '#0c2438', light: '#ffffff' }
      });
      setModalQrUrl(url);
    } catch {
      // ignore
    }
  };

  const handleSyncDukcapil = () => {
    sound.playTap();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      sound.playSuccess();
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3000);
    }, 1200);
  };

  const getColorClasses = (colorTheme: CredentialCard['colorTheme']) => {
    switch (colorTheme) {
      case 'blue':
        return 'from-blue-900/60 to-slate-900 border-blue-500/40 text-blue-300';
      case 'cyan':
        return 'from-cyan-900/60 to-slate-900 border-cyan-500/40 text-cyan-300';
      case 'emerald':
        return 'from-emerald-900/60 to-slate-900 border-emerald-500/40 text-emerald-300';
      case 'amber':
        return 'from-amber-900/60 to-slate-900 border-amber-500/40 text-amber-300';
      case 'indigo':
        return 'from-indigo-900/60 to-slate-900 border-indigo-500/40 text-indigo-300';
      case 'rose':
        return 'from-rose-900/60 to-slate-900 border-rose-500/40 text-rose-300';
      default:
        return 'from-slate-900 to-slate-950 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Wallet Banner & Sync Status */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-500/50">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'id' ? 'Identity Wallet (Dompet Kredensial)' : 'Digital Identity Wallet'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'id' 
                  ? 'Kredensial resmi terverifikasi Ditjen Dukcapil & GovTech Indonesia' 
                  : 'Official verified credentials from Dukcapil & GovTech Indonesia'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncDukcapil}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white text-xs font-medium transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron Dukcapil'}</span>
          </button>
        </div>
      </div>

      {/* Sync Success Toast */}
      {syncToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kredensial berhasil diverifikasi langsung dengan basis data nasional Ditjen Dukcapil & BSSN!</span>
          </div>
          <button onClick={() => setSyncToast(false)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playTap();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCredentials.map((card) => {
          const colorClass = getColorClasses(card.colorTheme);
          return (
            <div
              key={card.id}
              onClick={() => handleOpenCard(card)}
              className={`group relative rounded-2xl bg-gradient-to-br ${colorClass} border p-4 sm:p-5 cursor-pointer hover:border-cyan-400/70 hover:shadow-xl hover:shadow-cyan-950/40 transition-all`}
            >
              {/* Top Row: Issuer Logo & Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/90 font-mono font-bold tracking-wider text-slate-200 border border-slate-700">
                    {card.issuerLogoText}
                  </span>
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[180px]">
                    {card.issuer}
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{card.status}</span>
                </div>
              </div>

              {/* Title & Card Number */}
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <div className="font-mono text-xs text-slate-300 tracking-wider mt-0.5">
                  {card.cardNumber}
                </div>
              </div>

              {/* Card Footer: Holder & Valid Thru */}
              <div className="flex items-end justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Pemegang Kartu:</div>
                  <div className="font-semibold text-slate-100 uppercase truncate max-w-[200px]">
                    {card.holderName}
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400">Berlaku:</div>
                    <div className="font-mono font-medium text-amber-300 text-[11px]">
                      {card.validThru}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:bg-cyan-900/60 group-hover:border-cyan-500/50 transition-colors">
                    <QrIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Credential Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-700/60 shadow-2xl p-5 text-white overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-600/40 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCard.title}</h3>
                  <p className="text-xs text-slate-400">{selectedCard.issuer}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4">
              {/* QR and Verification Seal */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="relative p-2 bg-white rounded-lg shadow-md">
                  {modalQrUrl ? (
                    <img src={modalQrUrl} alt="QR Verifikasi" className="w-28 h-28 object-contain" />
                  ) : (
                    <div className="w-28 h-28 bg-slate-200 animate-pulse rounded" />
                  )}
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-mono font-bold">
                    TEROTORISASI
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="font-semibold text-white">Verifikasi Kredensial Digital</div>
                  <p className="text-[11px] text-slate-400">
                    Tunjukkan kode QR ini kepada petugas pelayanan publik atau pindai dengan aplikasi pembaca resmi.
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Enkripsi ISO 18013-5 mDL Compliant</span>
                  </div>
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Rincian Informasi Kredensial:
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {selectedCard.details.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-slate-200 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400">
                <div className="text-slate-500 mb-0.5">Tanda Tangan Digital BSrE BSSN (Hash):</div>
                <div className="text-cyan-300 truncate">{selectedCard.securityHash}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => {
                  sound.playSuccess();
                  navigator.clipboard.writeText(selectedCard.cardNumber);
                  alert(`Nomor ${selectedCard.title} disalin: ${selectedCard.cardNumber}`);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Salin Nomor
              </button>
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:brightness-110 transition-all"
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
