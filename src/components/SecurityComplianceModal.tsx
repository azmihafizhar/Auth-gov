import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  FileCheck2, 
  CheckCircle2, 
  ExternalLink, 
  Building2, 
  KeyRound, 
  Cpu 
} from 'lucide-react';
import { sound } from '../utils/sound';

interface SecurityComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'id' | 'en';
}

export const SecurityComplianceModal: React.FC<SecurityComplianceModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-cyan-700/60 shadow-2xl p-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'id' ? 'Arsitektur Keamanan & Kepatuhan Regulasi' : 'Security Architecture & Compliance'}
              </h3>
              <p className="text-xs text-slate-400">
                Landasan hukum dan standar kriptografi nasional INApas (GovTech Indonesia)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4 text-xs">
          {/* Legal Mandate */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-900/50 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>Amanat Regulasi Republik Indonesia</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Peraturan Presiden No. 82 Tahun 2023</strong> menugaskan Perum Percetakan Uang Republik Indonesia (PERURI) sebagai Penyelenggara Keterpaduan Ekosistem Layanan Digital Pemerintah Indonesia (GovTech Indonesia), bekerja sama erat dengan Kementerian PAN-RB, Kemkominfo, dan Ditjen Dukcapil Kemendagri.
            </p>
          </div>

          {/* Security Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Zero-Trust Architecture</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Tidak ada entitas yang dipercaya secara implisit. Setiap pertukaran data diverifikasi dinamis melalui mutual TLS dan token bertanda tangan kriptografis.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Hardware Security Module (HSM)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Kunci sertifikasi digital warga disimpan dalam modul fisik HSM bersertifikasi FIPS 140-2 Level 3 di Pusat Data Nasional (PDN).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Sertifikasi BSrE BSSN</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sertifikat elektronik resmi diterbitkan oleh Balai Sertifikasi Elektronik Badan Siber dan Sandi Negara (BSrE BSSN) yang memiliki kekuatan hukum mengikat.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Standar Global ISO 18013-5</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Format identitas kependudukan digital (IKD) kompatibel dengan standar dompet mDL dan W3C Verifiable Credentials untuk interoperabilitas global.
              </p>
            </div>
          </div>

          {/* Privacy & Anti-Surveillance Statement */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 space-y-1 text-[11px]">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022)</span>
            </div>
            <p className="text-slate-300">
              Pengguna memiliki hak kendali penuh atas kredensial mereka. Data tidak pernah dibagikan ke pihak ketiga tanpa persetujuan eksplisit pengguna (*explicit user consent*).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
