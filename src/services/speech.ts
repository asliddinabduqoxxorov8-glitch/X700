/**
 * Speech synthesis & audio management for X_700
 */

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private isBrowserSpeaking: boolean = false;

  // Speak via Web Speech API (fallback / client-side)
  public speakWithBrowser(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ): boolean {
    if (!('speechSynthesis' in window)) {
      return false;
    }

    this.stop();

    // Clean text: strip markdown characters and emojis for smoother speech
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.15; // Slightly higher pitch for female companion tone

    // Try finding Uzbek or compatible voice
    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find(
      (v) => v.lang.startsWith('uz') || v.lang.startsWith('tr') || v.name.toLowerCase().includes('female')
    );
    if (uzVoice) {
      utterance.voice = uzVoice;
    }

    utterance.onstart = () => {
      this.isBrowserSpeaking = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.isBrowserSpeaking = false;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.isBrowserSpeaking = false;
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  // Play audio from base64/URL
  public playAudioUrl(
    url: string,
    onEnded?: () => void,
    rate: number = 1.0
  ): HTMLAudioElement {
    this.stop();
    const audio = new Audio(url);
    audio.playbackRate = rate;
    this.currentAudio = audio;

    audio.onended = () => {
      this.currentAudio = null;
      onEnded?.();
    };

    audio.onerror = () => {
      this.currentAudio = null;
      onEnded?.();
    };

    audio.play().catch((err) => {
      console.warn('Playback error:', err);
      onEnded?.();
    });

    return audio;
  }

  // Stop any playing sound
  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isBrowserSpeaking = false;
    }
  }

  public isPlaying(): boolean {
    return (
      (this.currentAudio !== null && !this.currentAudio.paused) ||
      this.isBrowserSpeaking
    );
  }
}

export const speechService = new SpeechService();
