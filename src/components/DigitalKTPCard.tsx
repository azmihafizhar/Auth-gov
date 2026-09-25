import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  RotateCw, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  QrCode as QrIcon, 
  Download, 
  Fingerprint, 
  Lock, 
  Sparkles, 
  Cpu, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { CitizenProfile } from '../types';
import { sound } from '../utils/sound';

interface DigitalKTPCardProps {
  citizen: CitizenProfile;
  lang: 'id' | 'en';
}

export const DigitalKTPCard: React.FC<DigitalKTPCardProps> = ({ citizen, lang }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedNik, setCopiedNik] = useState(false);
  const [hideSensitive, setHideSensitive] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate QR Code with rotating TOTP dynamic timestamp
  useEffect(() => {
    const generateDynamicQR = async () => {
      try {
        const payload = JSON.stringify({
          iss: 'GOVTECH-ID-PERURI',
          sub: citizen.nik,
          name: citizen.nama,
          loa: 'LEVEL_3_HIGH',
          ts: Math.floor(Date.now() / 60000), // rotates every 60s
          nonce: Math.random().toString(36).substring(7),
          sig: 'BSrE-PERURI-VALIDATED'
        });
        const url = await QRCode.toDataURL(payload, {
          width: 220,
          margin: 1,
          color: {
            dark: '#032030',
            light: '#ffffff'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };

    generateDynamicQR();
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          generateDynamicQR();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [citizen]);

  const handleCopyNik = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(citizen.nik);
    sound.playTap();
    setCopiedNik(true);
    setTimeout(() => setCopiedNik(false), 2000);
  };

  const handleFlipCard = () => {
    sound.playTap();
    setIsFlipped(!isFlipped);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const maskNik = (nik: string) => {
    if (!hideSensitive) return nik;
    return nik.substring(0, 6) + '******' + nik.substring(12);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Controls Header */}
      <div className="w-full max-w-xl flex items-center justify-between mb-3 px-1 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-mono">IKD LIVE</span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1 text-slate-300 font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            QR refresh: {secondsRemaining}s
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setHideSensitive(!hideSensitive)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Sembunyikan/Buka Data NIK"
          >
            {hideSensitive ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{hideSensitive ? 'Tampilkan' : 'Privasi'}</span>
          </button>

          <button
            onClick={handleFlipCard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-800/80 hover:bg-cyan-900/60 text-cyan-300 hover:text-white transition-all shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Lihat Depan' : 'Putar Belakang'}</span>
          </button>
        </div>
      </div>

      {/* The 3D Flip Card Container */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleFlipCard}
        className="w-full max-w-xl cursor-pointer perspective-1000 select-none group"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        <div 
          className={`relative w-full aspect-[1.586/1] rounded-2xl transition-transform duration-700 transform-style-preserve-3d shadow-2xl shadow-cyan-950/50 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= FRONT SIDE (KTP INDONESIA) ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0c2e47] via-[#091f33] to-[#04101e] p-4 sm:p-5 text-white flex flex-col justify-between">
            {/* Holographic dynamic shimmer overlay */}
            <div className="absolute inset-0 pointer-events-none holo-gradient animate-holo opacity-20 mix-blend-overlay" />

            {/* Subtle Garuda & Guilloche Pattern Background Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-cyan-300 to-transparent" />
            
            {/* Garuda Emblem Watermark Background */}
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-48 sm:w-60 h-48 sm:h-60 pointer-events-none opacity-10 flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-amber-200">
                <path d="M50 5 L60 30 L85 30 L65 45 L72 70 L50 55 L28 70 L35 45 L15 30 L40 30 Z" />
              </svg>
            </div>

            {/* KTP Header */}
            <div className="relative z-10 text-center border-b border-cyan-700/40 pb-1.5 sm:pb-2">
              <div className="text-[10px] sm:text-xs font-bold tracking-wider text-amber-400 uppercase">
                REPUBLIK INDONESIA
              </div>
              <div className="text-[11px] sm:text-sm font-extrabold tracking-wide uppercase text-slate-100">
                PROVINSI {citizen.provinsi}
              </div>
              <div className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-cyan-300">
                {citizen.kabKota}
              </div>

              {/* Hologram Badge right top */}
              <div className="absolute right-0 top-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>IKD VALID</span>
              </div>
            </div>

            {/* NIK Bar */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm border border-cyan-800/60 rounded-lg px-2.5 sm:px-3 py-1 my-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">NIK :</span>
                <span className="text-xs sm:text-base font-extrabold font-mono tracking-wider text-cyan-300">
                  {maskNik(citizen.nik)}
                </span>
              </div>
              <button
                onClick={handleCopyNik}
                className="p-1 rounded hover:bg-cyan-800/40 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Salin NIK"
              >
                {copiedNik ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Main Content: Demographic Data + Photo & QR */}
            <div className="relative z-10 flex-1 grid grid-cols-12 gap-2 sm:gap-3 items-center overflow-hidden">
              {/* Left Details (8 cols) */}
              <div className="col-span-8 space-y-0.5 sm:space-y-1 text-[9px] sm:text-[11px] leading-tight">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Nama</span>
                  <span className="col-span-8 font-bold text-white uppercase truncate">{citizen.nama}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Tempat/Tgl Lahir</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase truncate">
                    {citizen.tempatLahir}, {citizen.tanggalLahir}
                  </span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Jenis Kelamin</span>
                  <span className="col-span-8 font-semibold text-slate-200">
                    {citizen.jenisKelamin} <span className="ml-2 text-slate-400">Gol. Darah:</span> <span className="font-bold text-amber-300">{citizen.golonganDarah}</span>
                  </span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Alamat</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase truncate">{citizen.alamat}</span>
                </div>
                <div className="grid grid-cols-12 pl-2">
                  <span className="col-span-4 text-slate-400 font-normal">RT/RW</span>
                  <span className="col-span-8 font-mono text-slate-200">{citizen.rtRw}</span>
                </div>
                <div className="grid grid-cols-12 pl-2">
                  <span className="col-span-4 text-slate-400 font-normal">Kel/Desa</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase truncate">{citizen.kelDesa}</span>
                </div>
                <div className="grid grid-cols-12 pl-2">
                  <span className="col-span-4 text-slate-400 font-normal">Kecamatan</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase truncate">{citizen.kecamatan}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Agama</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase">{citizen.agama}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Status Kawin</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase">{citizen.statusPerkawinan}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Pekerjaan</span>
                  <span className="col-span-8 font-semibold text-slate-200 uppercase truncate">{citizen.pekerjaan}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Kewarganegaraan</span>
                  <span className="col-span-8 font-bold text-emerald-400 uppercase">{citizen.kewarganegaraan}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-400 font-medium">Berlaku Hingga</span>
                  <span className="col-span-8 font-extrabold text-amber-300 uppercase">{citizen.berlakuHingga}</span>
                </div>
              </div>

              {/* Right Side: Official Citizen Photo & Hologram Stamp (4 cols) */}
              <div className="col-span-4 flex flex-col items-center justify-center gap-1 sm:gap-2">
                <div className="relative w-20 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden border-2 border-cyan-400/60 shadow-lg bg-blue-900/60 group-hover:border-cyan-300 transition-colors">
                  <img
                    src={citizen.photoUrl}
                    alt={citizen.nama}
                    className="w-full h-full object-cover"
                  />
                  {/* Digital Hologram Stamp over photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-1">
                    <span className="text-[7px] sm:text-[9px] font-mono text-cyan-300 text-center font-bold tracking-tight">
                      DUKCAPIL RI
                    </span>
                  </div>
                  {/* Subtle Fingerprint watermark */}
                  <Fingerprint className="absolute top-1 right-1 w-4 h-4 text-cyan-300/40 pointer-events-none" />
                </div>

                <div className="text-[8px] sm:text-[9px] font-mono text-slate-400 text-center">
                  {citizen.kabKota}
                  <div className="text-cyan-400 font-semibold">{citizen.registeredDate}</div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Smart Chip & Biometric Seal */}
            <div className="relative z-10 flex items-center justify-between pt-1 border-t border-cyan-800/40 text-[9px] sm:text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[9px]">NFC ISO-7816 / IKD Chip</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GovTech Indonesia • INApas</span>
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE (DIGITAL SECURITY & QR) ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden rotate-y-180 border border-cyan-500/40 bg-gradient-to-br from-[#051322] via-[#091f33] to-[#04101e] p-4 sm:p-5 text-white flex flex-col justify-between">
            <div className="absolute inset-0 pointer-events-none holo-gradient animate-holo opacity-15 mix-blend-overlay" />

            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-cyan-800/50 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-900/60 border border-cyan-500/50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">IDENTITAS KEPENDUDUKAN DIGITAL</div>
                  <div className="text-[10px] text-cyan-300 font-mono">Ditjen Dukcapil Kemendagri & PERURI</div>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>LoA Level 3</span>
              </div>
            </div>

            {/* Center Content: Large Dynamic Security QR Code */}
            <div className="flex items-center justify-between gap-4 my-2">
              <div className="flex flex-col items-center">
                <div className="relative p-2 rounded-xl bg-white shadow-xl shadow-cyan-950/80 border border-cyan-400/40">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code IKD" className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-200 animate-pulse rounded" />
                  )}
                  {/* Rotating countdown ring */}
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] font-mono font-bold shadow-md">
                    {secondsRemaining}s
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-2">Kode QR Dinamis 60 Detik</span>
              </div>

              {/* Security Specs */}
              <div className="flex-1 space-y-1.5 text-[10px] sm:text-xs">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 text-[9px] font-mono">Otoritas Sertifikat Digital:</div>
                  <div className="font-semibold text-slate-200">BSrE - Badan Siber dan Sandi Negara</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 text-[9px] font-mono">Biometrik Match Score:</div>
                  <div className="font-bold text-emerald-400 font-mono">{citizen.biometricScore}% Terverifikasi Wajah</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 text-[9px] font-mono">Standar Global:</div>
                  <div className="font-medium text-cyan-300 font-mono">ISO 18013-5 mDL / W3C VC</div>
                </div>
              </div>
            </div>

            {/* Bottom Cryptographic Stamp */}
            <div className="pt-2 border-t border-cyan-800/40 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span className="truncate max-w-[280px]">HASH: {citizen.qrHash}</span>
              <span className="text-cyan-400">Klik untuk membalik kartu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Shortcuts */}
      <div className="w-full max-w-xl grid grid-cols-3 gap-2 mt-3">
        <button
          onClick={handleFlipCard}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-slate-200 text-xs font-medium transition-all"
        >
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Putar Kartu</span>
        </button>

        <button
          onClick={handleCopyNik}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-slate-200 text-xs font-medium transition-all"
        >
          {copiedNik ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{copiedNik ? 'Tersalin' : 'Salin NIK'}</span>
        </button>

        <button
          onClick={() => {
            sound.playSuccess();
            alert(`Sertifikat IKD Terunduh:\nNIK: ${citizen.nik}\nNama: ${citizen.nama}\nPenerbit: Ditjen Dukcapil RI\nKeaslian: Terverifikasi Digital BSrE`);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-700/60 hover:border-cyan-400 text-cyan-300 text-xs font-medium transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh IKD</span>
        </button>
      </div>
    </div>
  );
};
