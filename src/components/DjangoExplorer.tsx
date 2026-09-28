import React, { useState } from 'react';
import { DJANGO_FILES, DjangoFile } from '../data/djangoCodebase';
import {
  FileCode,
  Copy,
  Check,
  FolderTree,
  Terminal,
  Download,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DjangoExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DjangoFile>(DJANGO_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'files' | 'architecture' | 'windows-guide'>('files');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const combined = DJANGO_FILES.map(
      (f) => `================== ${f.path} ==================\n\n${f.code}\n\n`
    ).join('\n');
    const blob = new Blob([combined], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'X_700_Django_Loyihasi_Barcha_Fayllar.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Python + Django + REST Framework Arxitekturasi</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            X_700 Django Loyihasi Fayllari
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Loyiha uchun to‘liq tayyorlangan Django backend, modellar, serializerlar, Gemini AI & TTS xizmatlari
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('files')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeView === 'files'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            Fayllar ({DJANGO_FILES.length})
          </button>
          <button
            onClick={() => setActiveView('windows-guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeView === 'windows-guide'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            Windows Qo‘llanma
          </button>
          <button
            onClick={handleDownloadAll}
            className="p-2 rounded-xl glass-card hover:bg-slate-800 text-amber-300 transition"
            title="Barcha kodlarni bitta faylda yuklab olish"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeView === 'windows-guide' ? (
        /* Windows Setup Guide */
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <Terminal className="w-5 h-5" />
            <span>Windows Tizimida Bosqichma-bosqich O‘rnatish va Ishga Tushirish</span>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300">1-qadam: Python o‘rnatilganligini tekshirish</span>
              <pre className="p-3 bg-black/60 rounded-xl text-emerald-400 font-mono overflow-x-auto">
python --version
# Agar o'rnatilmagan bo'lsa, python.org saytidan Python 3.10+ yuklab oling va "Add Python to PATH" katakchasini belgilang.
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300">2-qadam: Virtual muhit (venv) yaratish va faollashtirish</span>
              <pre className="p-3 bg-black/60 rounded-xl text-emerald-400 font-mono overflow-x-auto">
python -m venv venv
venv\Scripts\activate
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300">3-qadam: Kutubxonalarni o‘rnatish</span>
              <pre className="p-3 bg-black/60 rounded-xl text-emerald-400 font-mono overflow-x-auto">
pip install -r requirements.txt
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300">4-qadam: .env fayliga Gemini API kalitini yozish</span>
              <pre className="p-3 bg-black/60 rounded-xl text-emerald-400 font-mono overflow-x-auto">
SECRET_KEY=x700_super_secret_django_key_2026
DEBUG=True
GEMINI_API_KEY=SIZNING_GEMINI_API_KALITINGIZ
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300">5-qadam: Maʼlumotlar bazasini migratsiya qilish va serverni yoqish</span>
              <pre className="p-3 bg-black/60 rounded-xl text-emerald-400 font-mono overflow-x-auto">
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
              </pre>
              <p className="text-slate-300 text-xs">
                Brauzerda oching: <code className="text-pink-300">http://127.0.0.1:8000</code>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Files Explorer */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* File List */}
          <div className="md:col-span-4 glass-panel p-3 rounded-2xl border border-purple-500/20 space-y-1 max-h-[600px] overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-amber-400" />
              <span>X_700 Papka Tuzilishi</span>
            </div>

            {DJANGO_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{file.path}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* File Content / Code Viewer */}
          <div className="md:col-span-8 glass-panel rounded-2xl border border-purple-500/20 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-amber-300">
                  {selectedFile.path}
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedFile.description}
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxa olish</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-auto bg-slate-950/90 font-mono text-xs text-slate-200 leading-relaxed select-text">
              <pre>
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
