export type PlatformMode = 'desktop-web' | 'mobile-ios' | 'mobile-android' | 'tablet';

export type ActiveTab = 'identity' | 'wallet' | 'biometric' | 'sso' | 'qrpass' | 'inative-sdk' | 'security';

export interface CitizenProfile {
  id: string;
  nik: string; // 16 digits
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // DD-MM-YYYY
  jenisKelamin: 'LAKI-LAKI' | 'PEREMPUAN';
  golonganDarah: 'A' | 'B' | 'AB' | 'O' | '-';
  alamat: string;
  rtRw: string;
  kelDesa: string;
  kecamatan: string;
  kabKota: string;
  provinsi: string;
  agama: string;
  statusPerkawinan: 'BELUM KAWIN' | 'KAWIN' | 'CERAI HIDUP' | 'CERAI MATI';
  pekerjaan: string;
  kewarganegaraan: 'WNI' | 'WNA';
  berlakuHingga: 'SEUMUR HIDUP';
  roleTag?: string; // e.g. "ASN / PNS", "Warga Negara"
  email: string;
  phone: string;
  photoUrl: string;
  ikdStatus: 'TERVERIFIKASI TINGGI' | 'TERVERIFIKASI MENENGAH';
  biometricScore: number;
  qrHash: string;
  registeredDate: string;
  familyMembersCount: number;
  noKk: string;
}

export interface CredentialCard {
  id: string;
  title: string;
  issuer: string;
  issuerLogoText: string;
  category: 'Kependudukan' | 'Pajak & Keuangan' | 'Kesehatan' | 'Transportasi' | 'Pendidikan & Legal';
  cardNumber: string;
  holderName: string;
  validThru: string;
  status: 'Aktif' | 'Perlu Pembaruan' | 'Tersertifikasi';
  colorTheme: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan';
  details: { label: string; value: string }[];
  qrPayload: string;
  securityHash: string;
}

export interface GovService {
  id: string;
  name: string;
  code: string;
  agency: string;
  category: 'Layanan Utama' | 'Pajak & Keuangan' | 'Kesehatan' | 'Transportasi' | 'Bantuan Sosial' | 'Administrasi Negara' | 'Pendidikan & Legal';
  description: string;
  scopes: string[];
  icon: string;
  usersCount: string;
  status: 'Operasional' | 'Beta' | 'Perawatan';
  isPopular?: boolean;
}

export interface VerificationLog {
  id: string;
  timestamp: string;
  serviceName: string;
  action: string;
  credentialUsed: string;
  status: 'Berhasil' | 'Ditolak' | 'Dalam Proses';
  location: string;
  deviceType: string;
}
