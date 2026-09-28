import React from 'react';
import {
  MessageSquare,
  User,
  Settings,
  Code2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserProfile, AppSettings } from '../types';

interface NavbarProps {
  activeTab: 'chat' | 'profile' | 'settings' | 'django';
  setActiveTab: (tab: 'chat' | 'profile' | 'settings' | 'django') => void;
  userProfile: UserProfile;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  settings,
  setSettings,
  onOpenOnboarding,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('chat')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                X_700
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-wide">
                X_700
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI Hamroh
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Samimiy virtual suhbatdosh</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
              activeTab === 'chat'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Suhbat</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
              activeTab === 'profile'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <User className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">
              {userProfile.name ? userProfile.name : 'Profil'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
              activeTab === 'settings'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Sozlamalar</span>
          </button>

          <button
            onClick={() => setActiveTab('django')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
              activeTab === 'django'
                ? 'bg-amber-600/25 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-amber-200 hover:bg-amber-950/20'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Django Kodlari</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Voice Toggle */}
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                voiceEnabled: !prev.voiceEnabled,
              }))
            }
            className={`p-2 rounded-xl border transition ${
              settings.voiceEnabled
                ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={
              settings.voiceEnabled
                ? 'Ovozli javoblar faol'
                : 'Ovozli javoblar o‘chirilgan'
            }
          >
            {settings.voiceEnabled ? (
              <Volume2 className="w-4 h-4 text-pink-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* User badge / Re-intro */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-purple-500/20 text-xs text-slate-300 transition"
            title="Tanishuvni qayta o'tkazish"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="max-w-[80px] md:max-w-[120px] truncate font-medium">
              {userProfile.name || 'Tanishish'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
