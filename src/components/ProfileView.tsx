import React, { useState } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { Avatar } from './Avatar';
import {
  User,
  Heart,
  Calendar,
  MessageSquare,
  Sparkles,
  Edit3,
  Bookmark,
  Activity,
  Smile,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  messages: ChatMessage[];
  onOpenOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  setUserProfile,
  messages,
  onOpenOnboarding,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

  const totalUserMessages = messages.filter((m) => m.role === 'user').length;
  const totalAIMessages = messages.filter((m) => m.role === 'assistant').length;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserProfile((prev) => ({ ...prev, name: tempName.trim() }));
      setIsEditingName(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Top Banner Profile Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 p-1 shadow-xl shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl font-extrabold text-white">
              {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-400 text-white text-base focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {userProfile.name || 'Mehmon'}
                  </h2>
                  <button
                    onClick={() => {
                      setTempName(userProfile.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white transition"
                    title="Ismni tahrirlash"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-medium border border-pink-500/30">
                X_700 Do‘sti 💖
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Suhbat uslubi:{' '}
              <span className="text-purple-300 font-semibold">
                {userProfile.style || 'Iliq va do‘stona'}
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Aʼzolik:{' '}
                {userProfile.registeredAt
                  ? new Date(userProfile.registeredAt).toLocaleDateString('uz-UZ')
                  : 'Bugun'}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                Jami xabarlar: {totalUserMessages + totalAIMessages}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenOnboarding}
            className="shrink-0 px-4 py-2 rounded-xl glass-card hover:bg-purple-900/40 text-purple-200 text-xs font-medium border border-purple-500/30 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Tanishuvni yangilash</span>
          </button>
        </div>
      </div>

      {/* Stats and Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* X_700 Xotirasi (User Interests) */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-pink-400" />
              <span>X_700 Xotirasidagi Qiziqishlar</span>
            </h3>
            <span className="text-xs text-purple-400">
              {userProfile.interests.length} ta mavzu
            </span>
          </div>

          <p className="text-xs text-slate-400">
            X_700 quyidagi mavzularda siz bilan suhbatlashishni yaxshi ko‘radi va
            muloqotda bularni inobatga oladi:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {userProfile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Emotion Statistics */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Suhbatlar Hissiy Ko‘rsatkichi</span>
            </h3>
            <span className="text-xs text-emerald-400">Ijobiy muloqot</span>
          </div>

          <p className="text-xs text-slate-400">
            Muloqot davomida X_700 sizning hissiy holatingizni tahlil qilib,
            sizga hamdardlik bildiradi.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Quvonch va mamnuniyat</span>
                <span className="text-purple-300 font-semibold">85%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[85%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Xotirjamlik va ilhom</span>
                <span className="text-emerald-300 font-semibold">90%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[90%] h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Dalda va qo‘llab-quvvatlash</span>
                <span className="text-amber-300 font-semibold">95%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[95%] h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
