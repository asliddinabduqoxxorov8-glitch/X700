import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { UserProfile, MoodType } from '../types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Heart,
  Smile,
  Compass,
  MessageCircle,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(userProfile.name || '');
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    userProfile.currentMood || 'xursand'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    userProfile.interests || ['IT va Texnologiyalar', 'Psixologiya']
  );
  const [selectedStyle, setSelectedStyle] = useState<
    UserProfile['style']
  >(userProfile.style || 'Iliq va do‘stona');

  if (!isOpen) return null;

  const moodsList: { id: MoodType; label: string; emoji: string }[] = [
    { id: 'xursand', label: 'Quvnoq & Yaxshi', emoji: '😊' },
    { id: 'xotirjam', label: 'Xotirjam & Sokin', emoji: '🌿' },
    { id: 'hayajonli', label: 'Hayajonli & Yangilik', emoji: '✨' },
    { id: 'charchagan', label: 'Biroz charchagan', emoji: '☕' },
    { id: 'stress', label: 'Stress / Band', emoji: '🤯' },
    { id: 'xafa', label: 'Biroz maʼyus', emoji: '🥺' },
  ];

  const interestOptions = [
    'IT va Dasturlash',
    'Psixologiya va Hayot',
    'Kitoblar va Adabiyot',
    'Musiqa va Sanʼat',
    'Kundalik Suhbatlar',
    'Biznes va Karyera',
    'Sayohat va Madaniyat',
    'Falsafa va Koinot',
  ];

  const styleOptions: UserProfile['style'][] = [
    'Iliq va do‘stona',
    'Yengil va hazilkash',
    'Falsafiy va chuqur',
    'Dalda beruvchi va mehrli',
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = () => {
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim() || 'Do‘stim',
      currentMood: selectedMood,
      interests: selectedInterests,
      style: selectedStyle,
      isRegistered: true,
      registeredAt: userProfile.registeredAt || new Date().toISOString(),
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-purple-500/30 p-6 md:p-8 shadow-2xl shadow-purple-950/80 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Avatar and Greeting */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar size="lg" mood={selectedMood} isSpeaking={step === 1} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>X_700 bilan tanishuv</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                  : step > i
                  ? 'w-4 bg-purple-600'
                  : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Ismingiz */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Salom! Men X_700 😊
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Siz bilan tanishganimdan juda xursandman! Suhbatimiz samimiy va
                qulay bo‘lishi uchun, avval ismingizni bilsam bo‘ladimi?
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                Ismingiz yoki sizni qanday atay:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Sardor, Madina, Jasur..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name.trim()) setStep(2);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition text-sm"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Davom etish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Hozirgi kayfiyatingiz */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-1">
                Ajoyib, {name}! ✨
              </h3>
              <p className="text-xs text-slate-300">
                Bugun o‘zingizni qanday his qilyapsiz? Men sizning kayfiyatingizga
                moslashishni istayman.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-3">
              {moodsList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    selectedMood === m.id
                      ? 'bg-purple-600/30 border-purple-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium transition"
              >
                Orqaga
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <span>Davom etish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Qiziqishlar */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-1">
                Qiziqishlaringiz qanday? 🎯
              </h3>
              <p className="text-xs text-slate-300">
                O‘zingiz yoqtirgan bir nechta mavzuni tanlang. X_700 bularni eslab
                qoladi!
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 py-1">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleInterest(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                        : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-3 h-3 text-pink-300" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium transition"
              >
                Orqaga
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <span>Davom etish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Suhbat uslubi */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-1">
                Qanday suhbatni yoqtirasiz? 💬
              </h3>
              <p className="text-xs text-slate-300">
                X_700 siz bilan qaysi ohangda suhbatlashishini istaysiz?
              </p>
            </div>

            <div className="space-y-2 my-2">
              {styleOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition ${
                    selectedStyle === st
                      ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{st}</span>
                  {selectedStyle === st && (
                    <CheckCircle className="w-4 h-4 text-pink-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium transition"
              >
                Orqaga
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-600/40 flex items-center justify-center gap-2 hover:opacity-95 transition"
              >
                <span>Suhbatni boshlash 🚀</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
