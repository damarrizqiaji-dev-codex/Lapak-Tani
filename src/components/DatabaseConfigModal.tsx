import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck,
  Server
} from 'lucide-react';
import { 
  getCustomSupabaseConfig, 
  saveCustomSupabaseConfig, 
  clearCustomSupabaseConfig,
  isSupabaseConfigured 
} from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getCustomSupabaseConfig();
      setUrl(config.url || '');
      setAnonKey(config.key || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Mohon isi URL dan Anon Key Supabase terlebih dahulu.',
      });
      return;
    }

    // Save temporarily
    saveCustomSupabaseConfig(url, anonKey);
    setTesting(true);
    setTestResult(null);

    const res = await supabaseService.testConnection();
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      onConfigSaved();
    }
  };

  const handleClear = () => {
    clearCustomSupabaseConfig();
    const fresh = getCustomSupabaseConfig();
    setUrl(fresh.url);
    setAnonKey(fresh.key);
    setTestResult({
      success: true,
      message: 'Konfigurasi dikembalikan ke pengaturan default platform.',
    });
    onConfigSaved();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col max-h-[92vh] pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-0"
        >
          {/* Header */}
          <div className="p-4 bg-[#1e5128] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-[16px] leading-tight">
                  Koneksi Database Cloud (Supabase)
                </h3>
                <p className="text-[12px] text-emerald-200">
                  Data panen &amp; transaksi tersimpan aman dan live
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleTestAndSave} className="p-5 overflow-y-auto space-y-4 text-[13px]">
            {/* Status Card */}
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isSupabaseConfigured()
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {isSupabaseConfigured() ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-[12px] leading-relaxed">
                <span className="font-bold block">
                  {isSupabaseConfigured() ? 'Database Siap Digunakan' : 'Perlu Kunci Supabase'}
                </span>
                {isSupabaseConfigured() 
                  ? 'Aplikasi telah memiliki kredensial aktif. Data panen, penawaran harga, dan akad transaksi akan tersinkronisasi langsung ke database PostgreSQL.'
                  : 'Masukkan URL dan Anon Key dari dashboard Supabase Anda agar data tersimpan nyata dan dapat diakses dari perangkat mana pun.'}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#0f2316] block">
                Supabase Project URL:
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-[13px] focus:outline-hidden focus:border-[#1e5128] focus:ring-1 focus:ring-[#1e5128]"
              />
              <span className="text-[11px] text-[#64748b]">
                Ditemukan di Supabase Dashboard → Project Settings → API
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0f2316] block">
                Supabase Public Anon Key:
              </label>
              <textarea
                rows={3}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] font-mono text-[11px] focus:outline-hidden focus:border-[#1e5128] focus:ring-1 focus:ring-[#1e5128]"
              />
              <span className="text-[11px] text-[#64748b]">
                Kunci publik aman untuk client-side (Project API Keys: <code className="bg-slate-100 px-1 py-0.5 rounded">anon / public</code>)
              </span>
            </div>

            {/* Test Connection Feedback */}
            {testResult && (
              <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span className="text-[12px] leading-tight font-medium">
                  {testResult.message}
                </span>
              </div>
            )}

            {/* Tips & SQL Schema helper */}
            <div className="bg-[#f8faf9] p-3.5 rounded-xl border border-[#e2e8f0] space-y-2 text-[12px]">
              <span className="font-bold text-[#0f2316] flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#1e5128]" />
                Langkah Cepat di Supabase:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[#52525b]">
                <li>Buka <strong>supabase.com</strong> dan buat proyek baru gratis.</li>
                <li>Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda.</li>
                <li>Salin isi file <code className="font-mono bg-slate-200 px-1 rounded">supabase/schema.sql</code> dari repositori dan klik <strong>Run</strong>.</li>
                <li>Salin URL &amp; Anon Key ke form di atas, lalu klik <strong>Uji &amp; Simpan</strong>.</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] font-semibold text-[#64748b] hover:text-[#0f2316] hover:underline cursor-pointer"
              >
                Reset Default
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#cbd5e1] font-semibold text-[#52525b] hover:bg-slate-50 transition cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={testing}
                  className="px-5 py-2 rounded-xl bg-[#1e5128] hover:bg-[#163f1f] text-white font-bold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menguji...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Uji &amp; Hubungkan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
