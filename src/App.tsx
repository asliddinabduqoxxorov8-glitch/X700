/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { DjangoExplorer } from './components/DjangoExplorer';
import { OnboardingModal } from './components/OnboardingModal';
import { ChatMessage, UserProfile, AppSettings, ConversationMemory } from './types';
import { speechService } from './services/speech';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  isRegistered: false,
  registeredAt: '',
  currentMood: 'xursand',
  interests: ['IT va Dasturlash', 'Psixologiya va Hayot', 'Kitoblar va Adabiyot'],
  style: 'Iliq va do‘stona',
};

const DEFAULT_MEMORY: ConversationMemory = {
  userName: '',
  currentTopic: 'Tanishuv va samimiy muloqot',
  emotionalState: 'xotirjam',
  importantFacts: [],
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  voiceEnabled: true,
  autoPlayVoice: false,
  voiceModel: 'Kore',
  speechRate: 1.0,
  fontSize: 'medium',
  temperature: 0.8,
};

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('x700_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [memory, setMemory] = useState<ConversationMemory>(() => {
    try {
      const saved = localStorage.getItem('x700_memory');
      return saved ? JSON.parse(saved) : DEFAULT_MEMORY;
    } catch {
      return DEFAULT_MEMORY;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('x700_app_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('x700_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-1',
        role: 'assistant',
        text: 'Salom! Men X_700 😊 Siz bilan tanishganimdan juda xursandman. Bugun kuningiz qanday o‘tdi?',
        timestamp: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        detectedMood: 'xursand',
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<
    'chat' | 'profile' | 'settings' | 'django'
  >('chat');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(!userProfile.isRegistered);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('x700_user_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('x700_app_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('x700_memory', JSON.stringify(memory));
    } catch {}
  }, [memory]);

  useEffect(() => {
    try {
      localStorage.setItem('x700_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Handle onboarding completion
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setMemory((prev) => ({
      ...prev,
      userName: newProfile.name,
      emotionalState: newProfile.currentMood || 'xursand',
      currentTopic: 'Tanishuv va samimiy muloqot',
    }));
    setShowLanding(false);
    setActiveTab('chat');

    // Add a warm personalized welcome message from X_700
    const welcomeMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      text: `Tanishganimdan juda mamnunman, ${newProfile.name}! 😊 Men sizning ${newProfile.interests.slice(0, 2).join(' va ')} kabi qiziqishlaringizni eslab qoldim. Xohlagan mavzuingizda, kuningiz yoki his-tuyg‘ularingiz haqida bemalol suhbatlashishimiz mumkin. Bugun nimalar bilan bandsiz?`,
      timestamp: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      detectedMood: newProfile.currentMood || 'xursand',
    };

    setMessages((prev) => [...prev, welcomeMsg]);
  };

  // Reset all data
  const handleResetAll = () => {
    if (
      window.confirm(
        'Barcha suhbatlar va profilingiz o‘chirib yuboriladi. Rozimisiz?'
      )
    ) {
      speechService.stop();
      localStorage.removeItem('x700_user_profile');
      localStorage.removeItem('x700_app_settings');
      localStorage.removeItem('x700_chat_messages');
      localStorage.removeItem('x700_memory');
      setUserProfile(DEFAULT_PROFILE);
      setMemory(DEFAULT_MEMORY);
      setSettings(DEFAULT_SETTINGS);
      setMessages([
        {
          id: 'init-1',
          role: 'assistant',
          text: 'Salom! Men X_700 😊 Siz bilan tanishganimdan juda xursandman. Avval ismingizni bilsam bo‘ladimi?',
          timestamp: new Date().toLocaleTimeString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          detectedMood: 'xotirjam',
        },
      ]);
      setShowLanding(true);
      setActiveTab('chat');
    }
  };

  return (
    <div
      className={`min-h-screen ${
        settings.theme === 'light'
          ? 'bg-slate-100 text-slate-900'
          : 'bg-[#090d16] text-slate-100'
      } flex flex-col`}
    >
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setShowLanding(false);
          setActiveTab(tab);
        }}
        userProfile={userProfile}
        settings={settings}
        setSettings={setSettings}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {showLanding ? (
          <LandingView
            userProfile={userProfile}
            onStartChat={() => {
              if (!userProfile.isRegistered) {
                setIsOnboardingOpen(true);
              } else {
                setShowLanding(false);
                setActiveTab('chat');
              }
            }}
            onOpenDjango={() => {
              setShowLanding(false);
              setActiveTab('django');
            }}
          />
        ) : (
          <>
            {activeTab === 'chat' && (
              <ChatView
                messages={messages}
                setMessages={setMessages}
                userProfile={userProfile}
                settings={settings}
                memory={memory}
                setMemory={setMemory}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                messages={messages}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                setSettings={setSettings}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                onResetAll={handleResetAll}
              />
            )}

            {activeTab === 'django' && <DjangoExplorer />}
          </>
        )}
      </main>

      {/* Onboarding Survey / Ism kiritish modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
