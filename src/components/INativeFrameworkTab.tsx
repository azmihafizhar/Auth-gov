import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Layers, 
  Copy, 
  Check, 
  Play, 
  Smartphone, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Globe2, 
  KeyRound, 
  FileJson, 
  Zap,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/sound';

interface INativeFrameworkTabProps {
  lang: 'id' | 'en';
}

type SDKPlatform = 'react-native' | 'flutter' | 'android-kotlin' | 'ios-swift' | 'web-pwa';
type APIEndpoint = 'auth-token' | 'biometric-challenge' | 'credential-ikd' | 'emeterai-sign';

export const INativeFrameworkTab: React.FC<INativeFrameworkTabProps> = ({ lang }) => {
  const [selectedSdk, setSelectedSdk] = useState<SDKPlatform>('react-native');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>('auth-token');
  const [apiExecuting, setApiExecuting] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const sdkCodeSnippets: Record<SDKPlatform, { title: string; filename: string; code: string }> = {
    'react-native': {
      title: 'React Native / Expo SDK',
      filename: 'InapasIntegration.tsx',
      code: `import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { 
  INApasClient, 
  INApasScope, 
  INApasLivenessResult 
} from '@inapas/inative-react-native';

const inapas = new INApasClient({
  clientId: 'APP-GOVTECH-ID-2026',
  environment: 'production', // or 'sandbox'
  redirectUri: 'inapas-app://oauth-callback',
  enableHardwareSecurityModule: true
});

export const CitizenLoginScreen = () => {
  const [citizenData, setCitizenData] = useState(null);

  const handleLoginWithINApas = async () => {
    try {
      // 1. Trigger Native Face Liveness Verification
      const liveness: INApasLivenessResult = await inapas.biometric.verifyLiveness({
        challenges: ['BLINK', 'HEAD_ROTATION', 'SMILE'],
        antiSpoofingThreshold: 0.98
      });

      if (!liveness.isSuccess) {
        Alert.alert('Gagal', 'Verifikasi wajah gagal.');
        return;
      }

      // 2. Authorize with OpenID Connect (SSO)
      const session = await inapas.auth.authorize({
        scopes: [
          INApasScope.NIK,
          INApasScope.IDENTITY_WALLET,
          INApasScope.BIOMETRIC_STATUS
        ],
        biometricToken: liveness.token
      });

      // 3. Access Verified Indonesian Citizen Credential
      const ikd = await inapas.wallet.getCredential('id.go.dukcapil.ikd');
      setCitizenData(ikd);
      Alert.alert('Sukses', \`Selamat datang \${ikd.nama} (NIK: \${ikd.nik})\`);
    } catch (error) {
      console.error('INative Error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Masuk dengan INApas (INative)" onPress={handleLoginWithINApas} />
    </View>
  );
};`
    },
    'flutter': {
      title: 'Flutter Dart SDK',
      filename: 'inapas_service.dart',
      code: `import 'package:flutter/material.dart';
import 'package:inapas_inative/inapas_inative.dart';

class InapasAuthService {
  final _client = InapasClient(
    clientId: 'FLUTTER-GOV-ID-2026',
    config: InapasConfig(
      zeroTrustMode: true,
      enableSecureEnclave: true,
      dukcapilSyncOnDemand: true,
    ),
  );

  /// Authenticate citizen and retrieve IKD Digital Wallet
  Future<CitizenProfile?> authenticateCitizen(BuildContext context) async {
    try {
      // Step 1: Execute Native Biometric Liveness
      final liveness = await _client.biometrics.verify(
        promptMessage: 'Arahkan wajah untuk verifikasi INApas',
        timeoutSeconds: 30,
      );

      if (!liveness.verified) {
        throw Exception('Deteksi keaslian wajah tidak lolos');
      }

      // Step 2: Request Verifiable Credentials (KTP & KK Digital)
      final authResult = await _client.requestCredentials([
        CredentialType.ktpDigital,
        CredentialType.npwp16Digit,
        CredentialType.bpjsKesehatan,
      ]);

      return authResult.citizenProfile;
    } on InapasException catch (e) {
      debugPrint('INative Error: \${e.code} - \${e.message}');
      return null;
    }
  }
}`
    },
    'android-kotlin': {
      title: 'Android Native (Kotlin)',
      filename: 'INApasActivity.kt',
      code: `package id.go.inapas.example

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import id.go.inapas.inative.InapasManager
import id.go.inapas.inative.model.BiometricChallenge
import id.go.inapas.inative.model.CredentialRequest

class INApasActivity : AppCompatActivity() {

    private val inapasClient by lazy {
        InapasManager.Builder(this)
            .setClientId("ANDROID-NATIVE-2026")
            .setUseAndroidKeystore(true)
            .setNfcCardReaderEnabled(true) // Physical e-KTP NFC scanning
            .build()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Execute Cross-Platform Native Flow
        inapasClient.launchVerificationFlow(
            activity = this,
            challenge = BiometricChallenge.FULL_LIVENESS,
            onSuccess = { credentials ->
                val nik = credentials.nik
                val digitalSignature = credentials.bsreSignature
                // Proceed with verified citizen session
            },
            onFailure = { error ->
                // Handle retry or fallback
            }
        )
    }
}`
    },
    'ios-swift': {
      title: 'iOS Native (Swift)',
      filename: 'INApasManager.swift',
      code: `import Foundation
import InapasINativeSDK
import LocalAuthentication

@MainActor
final class INApasAuthManager: ObservableObject {
    private let client = InapasClient(
        clientId: "IOS-NATIVE-2026",
        keychainAccessGroup: "group.id.go.inapas.wallet",
        secureEnclaveRequired: true
    )

    func verifyCitizenIdentity() async throws -> CitizenCredential {
        // 1. Verify with Apple Secure Enclave & Face ID
        let biometricVerified = try await client.biometric.authenticate(
            reason: "Verifikasi Satu Identitas Digital Indonesia"
        )
        guard biometricVerified else {
            throw InapasError.biometricMismatch
        }

        // 2. Fetch signed W3C Verifiable Presentation
        let presentation = try await client.wallet.present(
            credentialTypes: [.ktpDigital, .digitalSignature]
        )
        
        return presentation
    }
}`
    },
    'web-pwa': {
      title: 'Web & PWA SDK (TypeScript)',
      filename: 'inapas-web.ts',
      code: `import { createInapasClient, InapasWebConfig } from '@inapas/inative-web';

const inapas = createInapasClient({
  clientId: 'WEB-PWA-GOVTECH-2026',
  endpoint: 'https://inapas.go.id/api/v1',
  pwaOfflineCache: true,
  zeroTrustHeaders: true
});

// Single Sign-On 1-Click Authentication
export async function authenticateWithINApas() {
  const session = await inapas.auth.signInWithPopup({
    scopes: ['openid', 'nik', 'ktp_digital', 'biometric_level_3'],
    display: 'popup'
  });

  console.log('ID Token:', session.idToken);
  console.log('Citizen Profile:', session.user);
  return session;
}`
    }
  };

  const handleCopyCode = () => {
    sound.playTap();
    navigator.clipboard.writeText(sdkCodeSnippets[selectedSdk].code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const executeApiEndpoint = () => {
    sound.playTap();
    setApiExecuting(true);
    setApiResponse(null);
    setResponseTime(null);

    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + 38);
      setResponseTime(elapsed);
      setApiExecuting(false);
      sound.playSuccess();

      let mockData = {};
      if (selectedEndpoint === 'auth-token') {
        mockData = {
          status: 'SUCCESS_200',
          token_type: 'Bearer',
          expires_in: 7200,
          id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBlcnVyaS1jYS0yMDI2In0.eyJzdWIiOiIzMTc0MDUxODA5OTIwMDAzIiwibmFtZSI6IlJBREVOIEFSWUEgV0lKQVlBIiwibG9hIjoiaGlnaC1sZXZlbC0zIiwiaXNzIjoiaHR0cHM6Ly9pbmFwYXMuZ28uaWQiLCJpYXQiOjE3Mjc2ODgwMDB9',
          scope: 'openid profile nik identity_wallet biometric_verified',
          dukcapil_hash: 'd8a9e710bcf2e77b612c6a0c5f2419c836'
        };
      } else if (selectedEndpoint === 'biometric-challenge') {
        mockData = {
          challenge_id: 'CHALLENGE_9281734_INA',
          anti_spoofing: {
            liveness_passed: true,
            confidence: 0.999,
            spoof_probability: 0.001
          },
          dukcapil_match: {
            nik: '3174051809920003',
            biometric_score: 99.8,
            verification_status: 'VERIFIED_OFFICIAL'
          },
          loa_level: 'LEVEL_3_HIGH'
        };
      } else if (selectedEndpoint === 'credential-ikd') {
        mockData = {
          credential_type: 'IndonesianDigitalKTP',
          standard: 'ISO 18013-5 mDL & W3C VC',
          issuer: 'Ditjen Dukcapil Kementerian Dalam Negeri RI',
          subject: {
            nik: '3174051809920003',
            nama: 'RADEN ARYA WIJAYA',
            status_perkawinan: 'KAWIN',
            kewarganegaraan: 'WNI',
            berlaku_hingga: 'SEUMUR HIDUP'
          },
          signature: {
            algorithm: 'SHA256withRSA',
            ca: 'BSrE BSSN Peruri GovTech'
          }
        };
      } else {
        mockData = {
          document_id: 'DOC-AGREEMENT-2026-ID',
          emeterai_status: 'STAMPED_VALID',
          meterai_serial: 'SN-PERURI-2026-9812491',
          nominal: 'Rp 10.000',
          timestamp: new Date().toISOString(),
          legal_compliance: 'UU ITE No. 1 Tahun 2024 & UU Meterai'
        };
      }

      setApiResponse(JSON.stringify(mockData, null, 2));
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-800/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>INative Cross-Platform Framework</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-mono">
                  v2.4.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Unified Native Bridge untuk integrasi Identitas Digital Nasional (React Native, Flutter, Kotlin, Swift, Web PWA)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playSuccess();
            alert('File inative.config.json berhasil di-download!\nTemplate siap digunakan untuk integrasi proyek cross-platform.');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh SDK Config</span>
        </button>
      </div>

      {/* Cross-Platform Architecture Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Biometric Hardware</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Akses langsung Android BiometricPrompt & iOS LocalAuthentication
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Trust Vault</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Penyimpanan kunci privat di Hardware Security Module & Secure Enclave
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Zap className="w-4 h-4" />
            <span>NFC e-KTP Reader</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dukungan pembacaan chip fisik ISO-7816 untuk registrasi offline
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
            <Globe2 className="w-4 h-4" />
            <span>W3C VC & mDL</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Standar internasional ISO 18013-5 & OpenID for Verifiable Presentation
          </p>
        </div>
      </div>

      {/* Interactive Code Playground */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        {/* Playground Tab Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {(
              [
                ['react-native', 'React Native'],
                ['flutter', 'Flutter'],
                ['android-kotlin', 'Android (Kotlin)'],
                ['ios-swift', 'iOS (Swift)'],
                ['web-pwa', 'Web / PWA']
              ] as [SDKPlatform, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  sound.playTap();
                  setSelectedSdk(key);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSdk === key
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {sdkCodeSnippets[selectedSdk].filename}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="p-4 sm:p-5 bg-slate-950 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed max-h-96">
          <pre>{sdkCodeSnippets[selectedSdk].code}</pre>
        </div>
      </div>

      {/* Interactive REST API Sandbox */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Live API Testing Sandbox</h3>
              <p className="text-[11px] text-slate-400">
                Uji langsung endpoint backend GovTech INA DIGITAL / Dukcapil
              </p>
            </div>
          </div>

          <button
            onClick={executeApiEndpoint}
            disabled={apiExecuting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 disabled:opacity-50"
          >
            {apiExecuting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Kirim Permintaan (Send Request)</span>
              </>
            )}
          </button>
        </div>

        {/* Endpoint Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            ['auth-token', 'POST /v1/oauth/token', 'OIDC Token Exchange'],
            ['biometric-challenge', 'POST /v1/biometric/verify', 'Liveness Check & Match'],
            ['credential-ikd', 'GET /v1/credentials/ikd', 'W3C Verifiable KTP'],
            ['emeterai-sign', 'POST /v1/peruri/emeterai/sign', 'Peruri e-Meterai Seal']
          ].map(([id, path, desc]) => (
            <button
              key={id}
              onClick={() => {
                sound.playTap();
                setSelectedEndpoint(id as APIEndpoint);
                setApiResponse(null);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedEndpoint === id
                  ? 'bg-cyan-950/80 border-cyan-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-mono text-[11px] font-bold text-cyan-300 truncate">{path}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{desc}</div>
            </button>
          ))}
        </div>

        {/* Live Response Box */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Response Payload</span>
              {responseTime !== null && (
                <span className="text-emerald-400 font-semibold">
                  200 OK ({responseTime}ms)
                </span>
              )}
            </div>
            <span className="text-slate-500">application/json</span>
          </div>

          {apiResponse ? (
            <pre className="text-cyan-300 max-h-60 overflow-y-auto leading-relaxed">
              {apiResponse}
            </pre>
          ) : (
            <div className="py-6 text-center text-slate-500">
              Pilih endpoint dan klik &quot;Kirim Permintaan&quot; untuk menjalankan tes API.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
