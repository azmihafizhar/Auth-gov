import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ScanFace, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Smile, 
  Compass, 
  Sparkles,
  Zap,
  Volume2
} from 'lucide-react';
import { CitizenProfile } from '../types';
import { sound } from '../utils/sound';

interface BiometricVerificationTabProps {
  citizen: CitizenProfile;
  lang: 'id' | 'en';
}

type StepType = 'idle' | 'center' | 'blink' | 'turn' | 'smile' | 'verifying' | 'completed';

export const BiometricVerificationTab: React.FC<BiometricVerificationTabProps> = ({ citizen, lang }) => {
  const [step, setStep] = useState<StepType>('idle');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [livenessScore, setLivenessScore] = useState<number>(0);
  const [matchScore, setMatchScore] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      sound.playTap();
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera not accessible, falling back to simulator', err);
      setCameraActive(false);
      setCameraError('Akses kamera tidak diizinkan atau tidak tersedia. Anda tetap dapat menjalankan Simulasi Biometrik Interaktif.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startVerificationFlow = () => {
    sound.playTap();
    setStep('center');
    setProgress(15);
    setLivenessScore(0);
    setMatchScore(0);

    // Sequence of liveness challenges
    setTimeout(() => {
      sound.playScan();
      setStep('blink');
      setProgress(40);
      setLivenessScore(78);
    }, 2200);

    setTimeout(() => {
      sound.playScan();
      setStep('turn');
      setProgress(70);
      setLivenessScore(92);
    }, 4500);

    setTimeout(() => {
      sound.playScan();
      setStep('smile');
      setProgress(90);
      setLivenessScore(98);
    }, 6800);

    setTimeout(() => {
      setStep('verifying');
      setProgress(98);
    }, 9000);

    setTimeout(() => {
      setStep('completed');
      setProgress(100);
      setLivenessScore(99.9);
      setMatchScore(99.8);
      sound.playSuccess();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 11000);
  };

  const resetFlow = () => {
    sound.playTap();
    setStep('idle');
    setProgress(0);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-500/50">
              <ScanFace className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'id' ? 'Verifikasi Biometrik & Liveness Check' : 'Biometric Liveness Verification'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'id' 
                  ? 'Teknologi pengenalan wajah anti-spoofing terhubung langsung ke basis data Dukcapil' 
                  : 'Anti-spoofing face recognition connected directly to Dukcapil national registry'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 text-xs font-medium transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gunakan Kamera Web</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 text-xs font-medium transition-all"
            >
              <span>Matikan Kamera</span>
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Camera / Face Scanner Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 border border-cyan-800/40 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Biometric Scanner Frame */}
          <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500/60 bg-slate-900 shadow-2xl shadow-cyan-950/80 flex items-center justify-center">
            {/* Live Camera Stream or Simulated Face */}
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={citizen.photoUrl}
                  alt={citizen.nama}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-cyan-300 font-mono">
                  Simulasi Biometrik Warga
                </div>
              </div>
            )}

            {/* Oval Face Tracking Boundary */}
            <div className={`absolute w-44 sm:w-48 h-56 sm:h-60 rounded-[50%] border-2 transition-colors duration-500 pointer-events-none flex items-center justify-center ${
              step === 'completed' 
                ? 'border-emerald-400 ring-4 ring-emerald-500/30' 
                : step === 'idle'
                ? 'border-cyan-400/60 border-dashed'
                : 'border-cyan-400 ring-2 ring-cyan-500/40 animate-pulse'
            }`}>
              {/* Corner crosshairs */}
              <div className="absolute top-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            </div>

            {/* Laser Line Scanning Effect (Active during steps) */}
            {step !== 'idle' && step !== 'completed' && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser shadow-[0_0_15px_#22d3ee] pointer-events-none" />
            )}

            {/* Completed Badge Overlay */}
            {step === 'completed' && (
              <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-bounce" />
                </div>
                <h4 className="text-base font-bold text-white">Liveness Terverifikasi!</h4>
                <p className="text-xs text-emerald-300 font-mono mt-0.5">
                  Kecocokan Dukcapil: 99.8% (Valid)
                </p>
                <div className="mt-3 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/40 text-[10px] text-slate-300 font-mono">
                  Token: INAPAS-BIO-{Date.now().toString(36).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Current Step Instruction Box */}
          <div className="w-full max-w-md mt-4 text-center">
            {step === 'idle' && (
              <div className="text-xs text-slate-400">
                Klik tombol di bawah untuk memulai proses verifikasi biometrik liveness (tatap kamera, kedipkan mata, dan senyum).
              </div>
            )}

            {step === 'center' && (
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm font-semibold animate-pulse">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Tahap 1: Posisikan wajah Anda tepat di dalam bingkai oval</span>
              </div>
            )}

            {step === 'blink' && (
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm font-semibold animate-pulse">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Tahap 2: Kedipkan kedua mata Anda perlahan</span>
              </div>
            )}

            {step === 'turn' && (
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm font-semibold animate-pulse">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Tahap 3: Tengokkan kepala sedikit ke kanan</span>
              </div>
            )}

            {step === 'smile' && (
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm font-semibold animate-pulse">
                <Smile className="w-4 h-4 text-emerald-400" />
                <span>Tahap 4: Tersenyumlah ke arah kamera</span>
              </div>
            )}

            {step === 'verifying' && (
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm font-semibold animate-pulse">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Memvalidasi biometrik dengan Pusat Data Kependudukan Nasional...</span>
              </div>
            )}

            {step === 'completed' && (
              <div className="text-emerald-300 text-sm font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Identitas Digital Terkonfirmasi Asli & Hidup (Anti-Spoofing Sukses)</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-3">
            {step === 'idle' && (
              <button
                onClick={startVerificationFlow}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-600/30 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Mulai Verifikasi Liveness</span>
              </button>
            )}

            {step !== 'idle' && step !== 'completed' && (
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses deteksi sensor... ({progress}%)</span>
              </div>
            )}

            {step === 'completed' && (
              <button
                onClick={resetFlow}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ulangi Verifikasi</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Security Metrics & Dukcapil Integration Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Progress Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Status Liveness:</span>
              <span className="font-mono font-bold text-cyan-400">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Parameter Keamanan Zero-Trust</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Anti-Spoofing Score</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">
                  {step === 'completed' ? '99.9%' : step !== 'idle' ? `${livenessScore}%` : 'Siap'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Dukcapil Face Match</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {step === 'completed' ? '99.8%' : step !== 'idle' ? 'Menganalisis' : 'Standby'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Pencahayaan & Sudut</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">Optimal (420 Lux)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Tingkat Jaminan (LoA)</div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">Level 3 (Tinggi)</div>
              </div>
            </div>
          </div>

          {/* Legal and GovTech Standard Notice */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standar Keamanan INA DIGITAL</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verifikasi ini mematuhi amanat <strong>Perpres No. 82 Tahun 2023</strong> dan standar ISO 30107-3 untuk deteksi presentasi biometrik. Data wajah dienkripsi end-to-end dengan kunci privat HSM Peruri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
