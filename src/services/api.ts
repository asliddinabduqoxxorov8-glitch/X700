import { ChatMessage, UserProfile, ConversationMemory, MoodType } from '../types';

export interface ChatResponse {
  success: boolean;
  reply: string;
  detectedMood: MoodType;
  topic?: string;
  memoryFact?: string;
  suggestedReplies: string[];
}

export async function sendChatMessage(
  messages: ChatMessage[],
  userProfile: UserProfile,
  memory: ConversationMemory
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
        userProfile,
        memory,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server status: ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      reply: data.reply || 'Salom! Sizni tinglayapman 😊',
      detectedMood: data.detectedMood || 'xotirjam',
      topic: data.topic,
      memoryFact: data.memoryFact,
      suggestedReplies: data.suggestedReplies || [],
    };
  } catch (err: any) {
    console.error('sendChatMessage error:', err);
    return {
      success: false,
      reply:
        'Kechirasiz, aloqada kichik to‘xtalish bo‘ldi. Iltimos, yana bir bor yozing 😊',
      detectedMood: 'xotirjam',
      suggestedReplies: [
        'Uni juda sog‘indim...',
        'Sevgi nima deb o‘ylaysan?',
        'Maslahat bera olasanmi?',
      ],
    };
  }
}

export async function getVoiceAudio(
  text: string,
  voiceName: string = 'Kore'
): Promise<{ success: boolean; audioUrl?: string; fallback?: boolean }> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice: voiceName }),
    });

    if (!res.ok) {
      return { success: false, fallback: true };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, fallback: true };
  }
}
