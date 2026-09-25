import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ScanLine, 
  QrCode as QrIcon, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  Camera, 
  UserCheck, 
  Building, 
  Train, 
  Plane,
  Sparkles,
  Lock,
  X
} from 'lucide-react';
import { CitizenProfile } from '../types';
import { sound } from '../utils/sound';

interface QRFacePassTabProps {
  citizen: CitizenProfile;
  lang: 'id' | 'en';
}

export const QRFacePassTab: React.FC<QRFacePassTabProps> = ({ citizen, lang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'generate' | 'scan'>('generate');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [selectedGate, setSelectedGate] = useState<'general' | 'airport' | 'transit'>('general');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    valid: boolean;
    subject: string;
    nik: string;
    issuer: string;
    verifiedAt: string;
    statusText: string;
  } | null>(null);

  // Generate QR Code with 60-second rotation
  useEffect(() => {
    const updateQR = async () => {
      try {
        const payload = JSON.stringify({
          type: 'INAPAS_QR_FACE_PASS',
          nik: citizen.nik,
          name: citizen.nama,
          gate: selectedGate,
          exp: Math.floor(Date.now() / 1000) + 60,
          token: `QRFACE-${Date.now().toString(36)}-${citizen.nik.slice(-4)}`
        });
        const url = await QRCode.toDataURL(payload, {
          width: 260,
          margin: 1,
          color: { dark: '#041c2c', light: '#ffffff' }
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    updateQR();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          updateQR();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [citizen, selectedGate]);

  const handleSimulateScan = (type: 'valid' | 'expired') => {
    sound.playTap();
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (type === 'valid') {
        sound.playSuccess();
        setScanResult({
          valid: true,
          subject: citizen.nama,
          nik: citizen.nik,
          issuer: 'Ditjen Dukcapil RI & Peruri CA',
          verifiedAt: new Date().toLocaleTimeString('id-ID'),
          statusText: 'AKSES DIIZINKAN (Autentik & Terverifikasi BSrE)'
        });
      } else {
        sound.playBeep();
        setScanResult({
          valid: false,
          subject: 'Kredensial Tidak Dikenal',
          nik: '3201************',
          issuer: 'Tidak Tersertifikasi',
          verifiedAt: new Date().toLocaleTimeString('id-ID'),
          statusText: 'AKSES DITOLAK (Token Kedaluwarsa / Tanda Tangan Tidak Cocok)'
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-500/50">
              <QrIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'id' ? 'QR Face & Gerbang Otomatis (Pass)' : 'QR Face & Turnstile Pass'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'id'
                  ? 'Akses gerbang gedung kementerian, transportasi umum, dan autogate bandara tanpa kontak'
                  : 'Contactless autogate access for government offices, transit, and airport checkpoints'}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sound.playTap();
              setActiveSubTab('generate');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'generate'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tampilkan QR Face
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setActiveSubTab('scan');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'scan'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pindai Kredensial
          </button>
        </div>
      </div>

      {activeSubTab === 'generate' ? (
        /* ================= GENERATE QR FACE PASS ================= */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* QR Pass Card (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-700/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Holographic header stripe */}
            <div className="w-full pb-3 border-b border-cyan-800/40 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-cyan-300 font-mono tracking-wider">
                  INApas QR FACE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono">
                  AKTIF
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rotasi: {countdown}s</span>
              </div>
            </div>

            {/* QR with embedded face badge */}
            <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-cyan-950/80 border border-cyan-400/50">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="QR Face Pass" className="w-56 h-56 sm:w-64 sm:h-64 object-contain" />
              ) : (
                <div className="w-56 h-56 bg-slate-200 animate-pulse rounded-xl" />
              )}

              {/* Center Face Avatar Chip */}
              <div className="absolute inset-0 m-auto w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl pointer-events-none">
                <img
                  src={citizen.photoUrl}
                  alt={citizen.nama}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>

              {/* Glowing countdown bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-b-2xl transition-all duration-1000"
                style={{ width: `${(countdown / 60) * 100}%` }}
              />
            </div>

            {/* Citizen Details */}
            <div className="w-full mt-4 text-center space-y-1">
              <h3 className="text-base font-bold text-white uppercase">{citizen.nama}</h3>
              <p className="text-xs font-mono text-cyan-300">NIK: {citizen.nik}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-cyan-800 text-[11px] text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terverifikasi Biometrik (LoA Level 3)</span>
              </div>
            </div>
          </div>

          {/* Gate Selector & Instructions (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pilih Gerbang / Tujuan Akses:
              </h4>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    sound.playTap();
                    setSelectedGate('general');
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedGate === 'general'
                      ? 'bg-cyan-950/80 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold">Gedung Kementerian & Pelayanan</div>
                    <div className="text-[10px] text-slate-400">Turnstile KemenPAN-RB, BKN, Ditjen Pajak</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    sound.playTap();
                    setSelectedGate('airport');
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedGate === 'airport'
                      ? 'bg-cyan-950/80 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Plane className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold">Autogate Bandara Internasional</div>
                    <div className="text-[10px] text-slate-400">Pemeriksaan Imigrasi Tanpa Antre di CGK/DPS</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    sound.playTap();
                    setSelectedGate('transit');
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedGate === 'transit'
                      ? 'bg-cyan-950/80 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Train className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold">Gerbang Transit LRT / MRT Jakarta</div>
                    <div className="text-[10px] text-slate-400">Integrasi Pembayaran & Verifikasi Kartu Warga</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Instruction pill */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200">Cara Penggunaan di Gerbang:</div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Dekatkan layar ponsel ke pemindai optik turnstile/gerbang.</li>
                <li>Tatap kamera turnstile untuk validasi biometrik wajah instan.</li>
                <li>Palang pintu akan otomatis terbuka dalam waktu &lt; 0.5 detik.</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        /* ================= SCAN CREDENTIAL PASS ================= */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Scanner Viewport (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-cyan-500/70 bg-slate-900 flex items-center justify-center">
              {/* Scan target grid */}
              <div className="absolute inset-4 border border-cyan-400/40 rounded-xl pointer-events-none" />
              <ScanLine className="w-16 h-16 text-cyan-400/40" />

              {/* Scanning laser sweep */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser shadow-[0_0_15px_#22d3ee]" />
              )}
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Arahkan kamera ke Kode QR IKD atau pilih simulasi uji verifikasi kredensial di samping.
            </p>
          </div>

          {/* Test Scanner Controls & Results (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Simulasi Uji Verifikasi Petugas:
              </h4>

              <div className="space-y-2">
                <button
                  onClick={() => handleSimulateScan('valid')}
                  disabled={scanning}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 text-white text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Uji Pindai Kredensial Resmi (Valid)</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <button
                  onClick={() => handleSimulateScan('expired')}
                  disabled={scanning}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 hover:bg-rose-900/60 text-rose-200 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Uji Pindai Token Palsu / Kedaluwarsa</span>
                  </div>
                  <X className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>

            {/* Scan Result Card */}
            {scanResult && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2.5 animate-fade-in ${
                  scanResult.valid
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    {scanResult.valid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <span>{scanResult.statusText}</span>
                  </div>
                </div>

                <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-slate-800">
                  <div>Subjek: <span className="font-bold uppercase text-white">{scanResult.subject}</span></div>
                  <div>NIK: <span className="text-cyan-300">{scanResult.nik}</span></div>
                  <div>Penerbit: <span className="text-slate-300">{scanResult.issuer}</span></div>
                  <div>Waktu Verifikasi: <span className="text-slate-400">{scanResult.verifiedAt}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
