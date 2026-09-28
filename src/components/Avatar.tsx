import React from 'react';
import { MoodType } from '../types';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  mood?: MoodType;
  showStatus?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  isSpeaking = false,
  mood = 'xotirjam',
  showStatus = true,
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const statusSizeMap = {
    sm: 'w-2.5 h-2.5 bottom-0 right-0',
    md: 'w-3 h-3 bottom-0.5 right-0.5',
    lg: 'w-3.5 h-3.5 bottom-1 right-1',
    xl: 'w-4.5 h-4.5 bottom-1.5 right-1.5',
  };

  // Color theme according to mood
  const moodBorder: Record<MoodType, string> = {
    xursand: 'border-amber-400/80 shadow-amber-500/30',
    soginch: 'border-pink-400/80 shadow-pink-500/30',
    sevgi: 'border-rose-400/80 shadow-rose-500/30',
    xafa: 'border-blue-400/80 shadow-blue-500/30',
    hayajonli: 'border-fuchsia-400/80 shadow-fuchsia-500/30',
    charchagan: 'border-slate-400/80 shadow-slate-500/30',
    xotirjam: 'border-emerald-400/80 shadow-emerald-500/30',
    stress: 'border-rose-400/80 shadow-rose-500/30',
    'yolg‘iz': 'border-indigo-400/80 shadow-indigo-500/30',
    minnatdor: 'border-pink-400/80 shadow-pink-500/30',
    hayron: 'border-purple-400/80 shadow-purple-500/30',
  };

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      {/* Outer Glow Ring when speaking */}
      {isSpeaking && (
        <span className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-75 blur-sm animate-pulse" />
      )}

      {/* Main Avatar Frame */}
      <div
        className={`relative ${sizeMap[size]} rounded-full p-0.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 shadow-md ${
          isSpeaking ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-950 scale-105 transition-transform' : ''
        }`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-white/20 relative flex items-center justify-center">
          {/* Stylized Modern AI Female Companion Face Vector */}
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#701a75" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#e879f9" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fbcfe8" />
              </linearGradient>
              <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>

            {/* Background Glow */}
            <circle cx="60" cy="60" r="60" fill="url(#bgGrad)" />

            {/* Futuristic Headpiece / Hair back */}
            <path
              d="M 25 65 C 20 28, 100 28, 95 65 C 92 88, 88 105, 88 105 L 32 105 C 32 105, 28 88, 25 65 Z"
              fill="url(#hairGrad)"
              opacity="0.8"
            />

            {/* Shoulders / Clothing */}
            <path
              d="M 18 120 C 25 98, 45 92, 60 92 C 75 92, 95 98, 102 120 Z"
              fill="#0f172a"
            />
            {/* Cyber collar line */}
            <path
              d="M 40 102 C 50 110, 70 110, 80 102"
              fill="none"
              stroke="#e879f9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Neck */}
            <rect x="52" y="74" width="16" height="22" rx="4" fill="url(#skinGrad)" />

            {/* Face Oval */}
            <ellipse cx="60" cy="62" rx="24" ry="28" fill="url(#skinGrad)" />

            {/* Stylized Hair Fringe / Bangs */}
            <path
              d="M 36 45 C 48 35, 72 35, 84 45 C 80 54, 76 56, 70 50 C 65 60, 55 58, 48 48 C 42 56, 38 52, 36 45 Z"
              fill="url(#hairGrad)"
            />

            {/* Left Eye */}
            <ellipse cx="49" cy="62" rx="4.5" ry="5.5" fill="#0f172a" />
            <circle cx="50" cy="61" r="3" fill="url(#eyeGrad)" />
            <circle cx="51.5" cy="59.5" r="1.2" fill="#ffffff" />
            {/* Eyelash */}
            <path d="M 43 57 Q 49 53 55 57" stroke="#3b0764" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Right Eye */}
            <ellipse cx="71" cy="62" rx="4.5" ry="5.5" fill="#0f172a" />
            <circle cx="72" cy="61" r="3" fill="url(#eyeGrad)" />
            <circle cx="73.5" cy="59.5" r="1.2" fill="#ffffff" />
            {/* Eyelash */}
            <path d="M 65 57 Q 71 53 77 57" stroke="#3b0764" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Soft Cheek Blush */}
            <ellipse cx="44" cy="69" rx="4" ry="2.2" fill="#f43f5e" opacity="0.45" />
            <ellipse cx="76" cy="69" rx="4" ry="2.2" fill="#f43f5e" opacity="0.45" />

            {/* Cute Smile / Mouth */}
            {isSpeaking ? (
              <ellipse cx="60" cy="74" rx="4" ry="3" fill="#be123c" />
            ) : (
              <path
                d="M 54 73 Q 60 78 66 73"
                fill="none"
                stroke="#be123c"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* Cyber Tiara Sparkle */}
            <circle cx="60" cy="38" r="2.5" fill="#38bdf8" />
            <line x1="60" y1="33" x2="60" y2="43" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="55" y1="38" x2="65" y2="38" stroke="#38bdf8" strokeWidth="0.8" />
          </svg>
        </div>
      </div>

      {/* Online indicator */}
      {showStatus && (
        <span
          className={`absolute ${statusSizeMap[size]} rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse`}
          title="X_700 onlayn"
        />
      )}
    </div>
  );
};
