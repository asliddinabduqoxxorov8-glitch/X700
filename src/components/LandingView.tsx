import React from 'react';
import { Avatar } from './Avatar';
import { UserProfile } from '../types';
import {
  Sparkles,
  Heart,
  Volume2,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Smile,
  Zap,
} from 'lucide-react';

interface LandingViewProps {
  userProfile: UserProfile;
  onStartChat: () => void;
  onOpenDjango: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  userProfile,
  onStartChat,
  onOpenDjango,
}) => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-16 space-y-12">
      {/* Background radial glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="relative text-center flex flex-col items-center max-w-3xl mx-auto">
        <div className="relative mb-6">
          <Avatar size="xl" mood="xursand" isSpeaking={false} />
          <span className="absolute -bottom-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            Virtual Hamroh
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Zamonaviy Sunʼiy Intellektli Muloqot Tizimi</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Salom! Men{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
            X_700
          </span>{' '}
          😊
        </h1>

        <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Siz bilan o‘zbek tilida samimiy, tabiiy va tushunarli suhbat quradigan,
          his-tuyg‘ularingizni anglaydigan va yoqimli ovoz bilan javob beruvchi
          ayol obrazidagi virtual do‘stingiz.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto justify-center">
          <button
            onClick={onStartChat}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
          >
            <span>
              {userProfile.isRegistered
                ? `${userProfile.name} bilan davom etish`
                : 'Suhbatni boshlash'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDjango}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card hover:bg-slate-800/60 text-slate-300 border border-slate-700/60 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <span>Python & Django Loyihasi</span>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Hissiyotlarni Tushunish
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Xursandchilik, xafalik, stress yoki charchoq paytida sizni tinglaydi,
            chin dildan dalda beradi va quvonchingizni baham ko‘radi.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition group">
          <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
            <Volume2 className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Ovozli Javoblar (TTS)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ayol ovozida muloyim va tabiiy nutq. Har bir javobni bitta tugma
            orqali audio ko‘rinishida eshitish imkoniyati.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Xavfsiz & Samimiy Odob
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            O‘zini soxta inson deb daʼvo qilmaydi, hurmat saqlaydi, nosog‘lom
            bog‘liqlik uyg‘otmaydi va 100% xavfsiz muloqotni taʼminlaydi.
          </p>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/25 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="text-xs uppercase tracking-wider font-semibold text-pink-400">
            X_700 falsafasi
          </div>
          <p className="text-sm md:text-base text-slate-200 italic">
            “Men sizni shunchaki maʼlumotlar to‘plami deb emas, qalbi va orzulari
            bor inson sifatida hurmat qilaman. Keling, bugun qandaydir yaxshi narsa
            haqida suhbatlashaylik!”
          </p>
        </div>
        <button
          onClick={onStartChat}
          className="shrink-0 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md"
        >
          Hoziroq salom berish 🌸
        </button>
      </div>
    </div>
  );
};
