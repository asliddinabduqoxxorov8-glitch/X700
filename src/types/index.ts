export type Role = 'user' | 'assistant';

export type MoodType =
  | 'xursand'
  | 'soginch'
  | 'sevgi'
  | 'xafa'
  | 'hayajonli'
  | 'charchagan'
  | 'xotirjam'
  | 'stress'
  | 'yolg‘iz'
  | 'minnatdor'
  | 'hayron';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
  detectedMood?: MoodType;
  topic?: string;
  audioUrl?: string;
  isAudioLoading?: boolean;
}

export interface ConversationMemory {
  userName: string;
  currentTopic: string;
  emotionalState: string;
  importantFacts: string[];
  relationshipNotes?: string;
  lastUpdated?: string;
}

export interface UserProfile {
  name: string;
  isRegistered: boolean;
  registeredAt: string;
  currentMood: MoodType;
  interests: string[];
  style: 'Iliq va do‘stona' | 'Yengil va hazilkash' | 'Falsafiy va chuqur' | 'Dalda beruvchi va mehrli';
  notes?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
  autoPlayVoice: boolean;
  voiceModel: 'Kore' | 'Aoede' | 'web-speech';
  speechRate: number; // 0.8 to 1.4
  fontSize: 'small' | 'medium' | 'large';
  temperature: number; // 0.2 to 1.0
}
