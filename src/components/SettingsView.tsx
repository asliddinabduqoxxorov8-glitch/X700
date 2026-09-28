import React from 'react';
import { AppSettings, UserProfile } from '../types';
import {
  Volume2,
  Moon,
  Sun,
  Sliders,
  Shield,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { speechService } from '../services/speech';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  userProfile,
  setUserProfile,
  onResetAll,
}) => {
  const handleTestVoice = () => {
    speechService.speakWithBrowser(
      `Salom ${userProfile.name || 'do‘stim'}! Men X_700. Ovoz sozlamalaringiz sinovdan o‘tdi.`,
      { rate: settings.speechRate }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <div className="border-b border-purple-500/20 pb-4">
        <h2 className="text-2xl font-bold text-white mb-1">Sozlamalar</h2>
        <p className="text-xs text-slate-400">
          X_700 ovozi, ko‘rinishi va muloqot rejimini o‘zingizga moslang
        </p>
      </div>

      {/* Voice & Audio Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Volume2 className="w-5 h-5 text-purple-400" />
          <span>Ovozli Xabar va TTS Sozlamalari</span>
        </div>

        {/* Voice Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Ovozli javoblarni yoqish
            </div>
            <div className="text-[11px] text-slate-400">
              X_700 javoblarini audio shaklida tinglash imkoniyati
            </div>
          </div>
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                voiceEnabled: !prev.voiceEnabled,
              }))
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              settings.voiceEnabled ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto Play Voice */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Javob kelishi bilan avtomatik o‘qish
            </div>
            <div className="text-[11px] text-slate-400">
              Yangi xabar kelishi bilan ovozli ijro etiladi
            </div>
          </div>
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                autoPlayVoice: !prev.autoPlayVoice,
              }))
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              settings.autoPlayVoice ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                settings.autoPlayVoice ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Voice Model Selector */}
        <div className="py-2 border-b border-slate-800">
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Ovoz modeli va ohangi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'Kore',
                name: 'Kore (Gemini)',
                desc: 'Mayin va tabiiy ayol ovozi',
              },
              {
                id: 'Aoede',
                name: 'Aoede (Gemini)',
                desc: 'Quvnoq va muloyim ohang',
              },
              {
                id: 'web-speech',
                name: 'Brauzer Nutqi',
                desc: 'Tezkor mahalliy nutq',
              },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    voiceModel: v.id as any,
                  }))
                }
                className={`p-3 rounded-xl border text-left transition ${
                  settings.voiceModel === v.id
                    ? 'bg-purple-600/30 border-purple-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-100">{v.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Speech Rate Slider */}
        <div className="py-2">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-200">Nutq tezligi</span>
            <span className="text-purple-300 font-bold">
              {settings.speechRate.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.4"
            step="0.05"
            value={settings.speechRate}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                speechRate: parseFloat(e.target.value),
              }))
            }
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Sokin (0.8x)</span>
            <span>Standart (1.0x)</span>
            <span>Tezkor (1.4x)</span>
          </div>
        </div>

        <button
          onClick={handleTestVoice}
          className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-xs text-purple-200 font-medium transition flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Ovozni sinab ko‘rish</span>
        </button>
      </div>

      {/* Interface and Theme */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <span>Tashqi Ko‘rinish & Interfeys</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Mavzu (Theme)
            </div>
            <div className="text-[11px] text-slate-400">
              Hozirda zamonaviy premium Dark rejim faol
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, theme: 'dark' }))
              }
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                settings.theme === 'dark'
                  ? 'bg-purple-600 text-white font-medium'
                  : 'text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Tungi</span>
            </button>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, theme: 'light' }))
              }
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                settings.theme === 'light'
                  ? 'bg-purple-600 text-white font-medium'
                  : 'text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Kunduzgi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security and Ethics Note */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <Shield className="w-5 h-5" />
          <span>Xavfsizlik va Odob Qoidalari</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          X_700 sizning shaxsiy maʼlumotlaringizni hurmat qiladi. U o‘zini
          haqiqiy inson yoki romantik sherik deb hisoblamaydi, nosog‘lom
          bog‘liqlik shakllantirmaydi va barcha suhbatlar samimiy va xavfsiz
          do‘stlik tamoyillariga asoslangan.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-rose-300">
            Maʼlumotlarni qayta tiklash
          </div>
          <div className="text-[11px] text-slate-400">
            Barcha suhbatlar va profil xotirasini butunlay tozalash
          </div>
        </div>
        <button
          onClick={onResetAll}
          className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Tozalash va yangilash</span>
        </button>
      </div>
    </div>
  );
};
