import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from './Avatar';
import { VoicePlayer } from './VoicePlayer';
import {
  ChatMessage,
  UserProfile,
  AppSettings,
  ConversationMemory,
  MoodType,
} from '../types';
import { sendChatMessage, getVoiceAudio } from '../services/api';
import { speechService } from '../services/speech';
import {
  Send,
  Mic,
  MicOff,
  Smile,
  Trash2,
  Sparkles,
  Download,
  Volume2,
  Heart,
  Brain,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  userProfile: UserProfile;
  settings: AppSettings;
  memory: ConversationMemory;
  setMemory: React.Dispatch<React.SetStateAction<ConversationMemory>>;
  onOpenOnboarding: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  setMessages,
  userProfile,
  settings,
  memory,
  setMemory,
  onOpenOnboarding,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType>(
    userProfile.currentMood || 'xotirjam'
  );

  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    'Bugun uni juda sog‘indim...',
    'Men bir insonni yoqtirib qoldim, lekin aytolmayapman...',
    'Sevgi nima deb o‘ylaysan?',
    'Romantik xabar yozishga yordam ber 💌',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech recognition setup (Speech-to-text)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'uz-UZ';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        'Brauzeringizda ovozni matnga aylantirish (Speech Recognition) qo‘llab-quvvatlanmaydi. Matn ko‘rinishida yozishingiz mumkin.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  };

  // Find the last assistant message
  const lastAIMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant');

  // Dedicated "Ovozli javob" handler: speaks or plays audio of the latest response
  const handlePlayLatestVoice = async () => {
    if (!lastAIMessage) return;

    if (speechService.isPlaying()) {
      speechService.stop();
      return;
    }

    if (lastAIMessage.audioUrl) {
      speechService.playAudioUrl(
        lastAIMessage.audioUrl,
        undefined,
        settings.speechRate
      );
      return;
    }

    // Generate speech
    const res = await getVoiceAudio(lastAIMessage.text, settings.voiceModel);
    if (res.success && res.audioUrl) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === lastAIMessage.id ? { ...m, audioUrl: res.audioUrl } : m
        )
      );
      speechService.playAudioUrl(res.audioUrl, undefined, settings.speechRate);
    } else {
      speechService.speakWithBrowser(lastAIMessage.text, {
        rate: settings.speechRate,
      });
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend || isLoading) return;

    if (customText === undefined) {
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(newMessages, userProfile, memory);
      setIsLoading(false);

      if (response.detectedMood) {
        setActiveMood(response.detectedMood);
      }

      if (response.suggestedReplies && response.suggestedReplies.length > 0) {
        setSuggestedReplies(response.suggestedReplies);
      }

      // Update Conversation Memory dynamically
      setMemory((prev) => {
        const updatedFacts = [...prev.importantFacts];
        if (response.memoryFact && !updatedFacts.includes(response.memoryFact)) {
          updatedFacts.push(response.memoryFact);
        }
        return {
          ...prev,
          currentTopic: response.topic || prev.currentTopic,
          emotionalState: response.detectedMood || prev.emotionalState,
          importantFacts: updatedFacts,
          lastUpdated: new Date().toLocaleTimeString('uz-UZ'),
        };
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        detectedMood: response.detectedMood,
        topic: response.topic,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If auto-play voice is enabled
      if (settings.voiceEnabled && settings.autoPlayVoice) {
        speechService.speakWithBrowser(response.reply, {
          rate: settings.speechRate,
        });
      }
    } catch (err) {
      setIsLoading(false);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text:
          'Kechirasiz, kichik texnik to‘xtalish bo‘ldi. Iltimos, yana bir bor yozing 😊',
        timestamp: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Barcha suhbat tarixini tozalashni xohlaysizmi?')) {
      speechService.stop();
      const initialGreeting: ChatMessage = {
        id: '1',
        role: 'assistant',
        text: `Salom, ${
          userProfile.name || 'do‘stim'
        }! 😊 Yangi suhbatimizni boshlaymiz. Qalbingizda qanday hislar bor? Nimalar haqida suhbatlashamiz?`,
        timestamp: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        detectedMood: 'xotirjam',
      };
      setMessages([initialGreeting]);
      setMemory((prev) => ({
        ...prev,
        currentTopic: 'Yangi suhbat',
        emotionalState: 'xotirjam',
      }));
    }
  };

  const handleExportChat = () => {
    const textContent = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${
            m.role === 'user' ? userProfile.name || 'Foydalanuvchi' : 'X_700'
          }: ${m.text}`
      )
      .join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `X_700_Suhbat_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const emojis = ['😊', '❤️', '🌸', '🥺', '✨', '💖', '☕', '💡', '🌹', '💌'];

  // Quick Relationship & Love prompts
  const lovePrompts = [
    { label: '❤️ Sog‘inch', text: 'Bugun uni juda sog‘indim...' },
    {
      label: '💌 Izhor maslahati',
      text: 'Men bir insonni yoqtirib qoldim, lekin unga qanday aytishni bilmayapman...',
    },
    { label: '✨ Sevgi nima?', text: 'X_700, sen uchun sevgi nima o‘zi?' },
    {
      label: '🌹 Romantik xat',
      text: 'Menga sevgan insonimga yozish uchun samimiy, chiroyli romantik xabar yozib ber.',
    },
    {
      label: '💔 Qalb yarasi',
      text: 'Munosabatlarimda ko‘nglim og‘ridi, menga dalda ber...',
    },
    {
      label: '💑 Uchrashuv hayajoni',
      text: 'Ertaga u bilan birinchi uchrashuvimiz (date). Juda hayajondaman!',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-2 md:px-4 py-2">
      {/* Chat Sub-header */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl glass-panel border border-purple-500/20 mb-2">
        <div className="flex items-center gap-3">
          <Avatar size="sm" mood={activeMood} isSpeaking={isLoading} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">X_700</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-medium border border-pink-500/30 flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400 fill-current" />
                <span>
                  {activeMood === 'soginch' && 'Sog‘inch & Mehr'}
                  {activeMood === 'sevgi' && 'Sevgi & Romantika'}
                  {activeMood === 'xursand' && 'Quvnoq'}
                  {activeMood === 'xotirjam' && 'Xotirjam'}
                  {activeMood === 'charchagan' && 'Hamdard'}
                  {activeMood === 'hayajonli' && 'Ilhomlangan'}
                  {activeMood === 'xafa' && 'Dalda beruvchi'}
                  {activeMood === 'stress' && 'Tinchlantiruvchi'}
                  {activeMood === 'yolg‘iz' && 'Yoningizda'}
                  {!['soginch', 'sevgi', 'xursand', 'xotirjam', 'charchagan', 'hayajonli', 'xafa', 'stress', 'yolg‘iz'].includes(activeMood) && 'Samimiy'}
                </span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {memory.currentTopic ? `Mavzu: ${memory.currentTopic}` : 'Samimiy muloqot'}
            </span>
          </div>
        </div>

        {/* Action icons & Memory toggle */}
        <div className="flex items-center gap-1.5">
          {/* Quick Voice Answer Button */}
          {lastAIMessage && (
            <button
              onClick={handlePlayLatestVoice}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md transition"
              title="Oxirgi javobni ovozli eshitish"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ovozli javob</span>
            </button>
          )}

          {/* Memory drawer toggle */}
          <button
            onClick={() => setShowMemoryPanel(!showMemoryPanel)}
            className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition ${
              showMemoryPanel
                ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                : 'glass-card border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="X_700 xotirasi va konteksti"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] hidden md:inline">Xotira</span>
          </button>

          <button
            onClick={handleExportChat}
            className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Suhbatni saqlab olish (.txt)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 transition"
            title="Chatni tozalash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Memory Panel Drawer (Context Tracker) */}
      {showMemoryPanel && (
        <div className="glass-panel p-3 rounded-2xl border border-purple-500/30 mb-2 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-purple-500/20">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-pink-400" />
              <span>X_700 Suhbat Xotirasi (Conversation Memory)</span>
            </span>
            <button
              onClick={() => setShowMemoryPanel(false)}
              className="text-slate-400 hover:text-white"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block font-medium">Joriy Mavzu:</span>
              <span className="text-pink-300 font-semibold">
                {memory.currentTopic || 'Umumiy muloqot'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block font-medium">Hissiy Holat:</span>
              <span className="text-purple-300 font-semibold capitalize">
                {memory.emotionalState || 'Xotirjam'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block font-medium">Eslab qolingan faktlar:</span>
              <span className="text-emerald-300 font-semibold">
                {memory.importantFacts.length > 0
                  ? `${memory.importantFacts.length} ta muhim fakt`
                  : 'Suhbat davomida to‘planmoqda'}
              </span>
            </div>
          </div>

          {memory.importantFacts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {memory.importantFacts.map((fact, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-200"
                >
                  ✓ {fact}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Love & Relationship Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 mb-1 no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Heart className="w-3 h-3 fill-current" />
          <span>Mavzular:</span>
        </span>
        {lovePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.text)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-pink-500/20 text-purple-200 text-[11px] font-medium transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 md:px-3 py-3 space-y-4">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 md:gap-3.5 ${
                isAI ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* AI Avatar */}
              {isAI && <Avatar size="sm" mood={msg.detectedMood || activeMood} />}

              {/* Message Bubble */}
              <div
                className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl p-3.5 md:p-4 text-xs md:text-sm leading-relaxed shadow-lg ${
                  isAI
                    ? 'glass-card border border-purple-500/25 text-slate-100 rounded-tl-sm'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-tr-sm'
                }`}
              >
                {/* Header label for AI */}
                {isAI && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-purple-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      X_700
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {/* Message Body */}
                <div className="whitespace-pre-wrap select-text">
                  {msg.text}
                </div>

                {/* Voice Player (only for AI messages) */}
                {isAI && (
                  <VoicePlayer
                    text={msg.text}
                    cachedAudioUrl={msg.audioUrl}
                    voiceName={settings.voiceModel}
                    onAudioReady={(url) => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === msg.id ? { ...m, audioUrl: url } : m
                        )
                      );
                    }}
                  />
                )}

                {/* User Message Timestamp */}
                {!isAI && (
                  <div className="text-right text-[10px] text-purple-200/70 mt-1">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {/* User Icon */}
              {!isAI && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
                  {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <Avatar size="sm" mood="xotirjam" isSpeaking={true} />
            <div className="glass-card border border-purple-500/30 px-4 py-3 rounded-2xl rounded-tl-sm text-xs text-purple-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="ml-1 text-[11px] text-slate-300">
                X_700 samimiy javob tayyorlamoqda...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Quick Chips */}
      {suggestedReplies.length > 0 && !isLoading && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-1 no-scrollbar shrink-0">
          {suggestedReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(reply)}
              className="shrink-0 px-3 py-1 rounded-xl bg-purple-950/50 hover:bg-purple-900/70 border border-purple-500/30 text-purple-200 text-xs transition"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="relative glass-panel rounded-2xl border border-purple-500/30 p-2 md:p-3 mt-1 shadow-xl shrink-0">
        {/* Emoji Selector Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-2 mb-2 p-2 rounded-2xl glass-panel border border-purple-500/30 flex items-center gap-1 shadow-xl bg-slate-950/90 z-20">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="p-1.5 hover:bg-purple-900/40 rounded-lg text-lg transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Emoji button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-xl hover:bg-purple-900/40 text-slate-400 hover:text-purple-300 transition"
            title="Emoji qo‘shish"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Voice Input (Speech to Text) */}
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'hover:bg-purple-900/40 text-slate-400 hover:text-purple-300'
            }`}
            title={
              isListening ? 'Ovoz yozilmoqda...' : 'Ovoz bilan yozish (Mikrofon)'
            }
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  120
                )}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? 'Gapiring, eshitayapman...'
                  : `${userProfile.name || 'Do‘stim'}, biror narsa yozing...`
              }
              className="w-full max-h-32 py-2 px-3 bg-transparent text-white placeholder-slate-500 focus:outline-none resize-none text-xs md:text-sm leading-relaxed"
            />
          </div>

          {/* Send button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition transform active:scale-95"
            title="Xabar yuborish (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
