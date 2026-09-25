import React, { useState } from 'react';
import { 
  X, 
  Check, 
  UserPlus, 
  ShieldCheck, 
  UserCheck, 
  Fingerprint, 
  MapPin, 
  Briefcase 
} from 'lucide-react';
import { CitizenProfile } from '../types';
import { SAMPLE_CITIZENS } from '../data/mockData';
import { sound } from '../utils/sound';

interface CitizenSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCitizen: CitizenProfile;
  onSelectCitizen: (citizen: CitizenProfile) => void;
  lang: 'id' | 'en';
}

export const CitizenSwitcherModal: React.FC<CitizenSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeCitizen,
  onSelectCitizen,
  lang
}) => {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customNama, setCustomNama] = useState('');
  const [customNik, setCustomNik] = useState('');
  const [customPekerjaan, setCustomPekerjaan] = useState('');
  const [customKota, setCustomKota] = useState('JAKARTA SELATAN');

  if (!isOpen) return null;

  const handleSelect = (citizen: CitizenProfile) => {
    sound.playTap();
    onSelectCitizen(citizen);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNama || !customNik) return;

    sound.playSuccess();
    const newCitizen: CitizenProfile = {
      ...SAMPLE_CITIZENS[0],
      id: `custom-${Date.now()}`,
      nik: customNik.padStart(16, '0'),
      nama: customNama.toUpperCase(),
      pekerjaan: customPekerjaan.toUpperCase() || 'WIRASWASTA',
      kabKota: customKota.toUpperCase(),
      provinsi: 'DKI JAKARTA',
      qrHash: `INAPAS-CUSTOM-${customNik}`,
      registeredDate: new Date().toLocaleDateString('id-ID')
    };

    onSelectCitizen(newCitizen);
    setIsCreatingCustom(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-700/60 shadow-2xl p-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'id' ? 'Ganti Profil Warga (Simulasi Identitas)' : 'Switch Citizen Profile'}
              </h3>
              <p className="text-xs text-slate-400">
                Pilih profil warga terdaftar untuk menguji fitur IKD, SSO, dan dompet identitas
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

        {/* Content */}
        {!isCreatingCustom ? (
          <div className="py-4 space-y-3">
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {SAMPLE_CITIZENS.map((c) => {
                const isSelected = c.nik === activeCitizen.nik;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.photoUrl}
                        alt={c.nama}
                        className="w-11 h-11 rounded-xl object-cover border border-cyan-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{c.nama}</h4>
                          {c.roleTag && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-600/40 text-blue-300 font-mono">
                              {c.roleTag}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-cyan-400 mt-0.5">
                          NIK: {c.nik}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {c.kabKota}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {c.pekerjaan}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pl-2">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setIsCreatingCustom(true);
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-cyan-700/60 hover:border-cyan-400 bg-cyan-950/20 text-cyan-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Profil Warga Baru (Kustom)</span>
            </button>
          </div>
        ) : (
          /* Form to create custom citizen */
          <form onSubmit={handleCreateCustom} className="py-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Nama Lengkap Sesuai KTP:</label>
              <input
                type="text"
                required
                value={customNama}
                onChange={(e) => setCustomNama(e.target.value)}
                placeholder="misal: AHMAD FAUZI"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500 font-semibold uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Nomor Induk Kependudukan (NIK 16 Digit):</label>
              <input
                type="text"
                required
                maxLength={16}
                value={customNik}
                onChange={(e) => setCustomNik(e.target.value.replace(/\D/g, ''))}
                placeholder="misal: 3171012304950002"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 outline-none focus:border-cyan-500 font-mono tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Kota/Kabupaten:</label>
                <input
                  type="text"
                  value={customKota}
                  onChange={(e) => setCustomKota(e.target.value)}
                  placeholder="JAKARTA PUSAT"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pekerjaan:</label>
                <input
                  type="text"
                  value={customPekerjaan}
                  onChange={(e) => setCustomPekerjaan(e.target.value)}
                  placeholder="WIRASWASTA"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500 uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-bold text-white hover:brightness-110 shadow-md"
              >
                Simpan & Aktifkan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
