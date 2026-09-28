import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Download } from 'lucide-react';
import { speechService } from '../services/speech';
import { getVoiceAudio } from '../services/api';

interface VoicePlayerProps {
  text: string;
  cachedAudioUrl?: string;
  autoPlay?: boolean;
  voiceName?: string;
  onAudioReady?: (url: string) => void;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  text,
  cachedAudioUrl,
  autoPlay = false,
  voiceName = 'Kore',
  onAudioReady,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(cachedAudioUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && !isPlaying) {
      handlePlay();
    }
    return () => {
      speechService.stop();
    };
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    // If we already have audio URL
    if (audioUrl) {
      setIsPlaying(true);
      const audio = speechService.playAudioUrl(
        audioUrl,
        () => {
          setIsPlaying(false);
        },
        playbackSpeed
      );
      setCurrentAudio(audio);
      return;
    }

    // Try fetching TTS audio from server
    setIsLoading(true);
    try {
      const res = await getVoiceAudio(text, voiceName);
      setIsLoading(false);

      if (res.success && res.audioUrl) {
        setAudioUrl(res.audioUrl);
        onAudioReady?.(res.audioUrl);
        setIsPlaying(true);
        const audio = speechService.playAudioUrl(
          res.audioUrl,
          () => {
            setIsPlaying(false);
          },
          playbackSpeed
        );
        setCurrentAudio(audio);
      } else {
        // Fallback to browser Web Speech API
        playBrowserSpeech();
      }
    } catch (err) {
      setIsLoading(false);
      playBrowserSpeech();
    }
  };

  const playBrowserSpeech = () => {
    setIsPlaying(true);
    const spoken = speechService.speakWithBrowser(text, {
      rate: playbackSpeed,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
    });
    if (!spoken) {
      setIsPlaying(false);
    }
  };

  const toggleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackSpeed(nextSpeed);
    if (currentAudio) {
      currentAudio.playbackRate = nextSpeed;
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200">
      {/* Play/Pause Button */}
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className={`p-1.5 rounded-lg transition flex items-center justify-center shrink-0 ${
          isPlaying
            ? 'bg-purple-600 text-white shadow-sm'
            : 'bg-purple-900/60 hover:bg-purple-700/80 text-purple-200'
        }`}
        title={isPlaying ? 'To‘xtatish' : 'Ovozli eshitish'}
      >
        {isLoading ? (
          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current" />
        )}
      </button>

      {/* Voice indicator or animated wave */}
      <div className="flex items-center gap-1 min-w-[70px]">
        {isPlaying ? (
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 bg-pink-400 rounded-full wave-bar" />
            <span className="w-1 bg-purple-400 rounded-full wave-bar" />
            <span className="w-1 bg-indigo-400 rounded-full wave-bar" />
            <span className="w-1 bg-pink-400 rounded-full wave-bar" />
            <span className="w-1 bg-purple-400 rounded-full wave-bar" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
            <Volume2 className="w-3.5 h-3.5 opacity-80" />
            <span>Ovozli javob</span>
          </div>
        )}
      </div>

      {/* Speed toggle */}
      <button
        onClick={toggleSpeed}
        className="px-1.5 py-0.5 rounded bg-purple-900/40 hover:bg-purple-800/60 text-[10px] font-semibold text-purple-300 tracking-wider transition"
        title="Ovoz tezligi"
      >
        {playbackSpeed}x
      </button>

      {/* Download button if wav is ready */}
      {audioUrl && (
        <a
          href={audioUrl}
          download="X_700_ovozli_javob.wav"
          className="p-1 rounded text-purple-400 hover:text-purple-200 transition ml-auto"
          title="Audioni yuklab olish (.wav)"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
