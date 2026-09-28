import os
import base64
import struct
from google import genai
from google.genai import types

class X700VoiceService:
    """X_700 uchun tabiiy ayol ovozidagi TTS xizmati"""

    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY', '')
        self.client = genai.Client(api_key=self.api_key)

    def pcm_to_wav(self, pcm_data: bytes, sample_rate=24000) -> bytes:
        num_channels = 1
        bits_per_sample = 16
        byte_rate = sample_rate * num_channels * bits_per_sample // 8
        block_align = num_channels * bits_per_sample // 8
        data_size = len(pcm_data)

        header = struct.pack(
            '<4sI4s4sIHHIIHH4sI',
            b'RIFF',
            36 + data_size,
            b'WAVE',
            b'fmt ',
            16,
            1,
            num_channels,
            sample_rate,
            byte_rate,
            block_align,
            bits_per_sample,
            b'data',
            data_size
        )
        return header + pcm_data

    def text_to_speech(self, text: str, voice_name: str = 'Kore') -> str:
        try:
            response = self.client.models.generate_content(
                model='gemini-3.8-flash-lite-tts',
                contents=text[:400],
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
                        )
                    )
                )
            )

            raw_pcm = response.candidates[0].content.parts[0].inline_data.data
            pcm_bytes = base64.b64decode(raw_pcm)
            wav_bytes = self.pcm_to_wav(pcm_bytes, 24000)
            b64_wav = base64.b64encode(wav_bytes).decode('utf-8')
            return f"data:audio/wav;base64,{b64_wav}"
        except Exception as e:
            print("Voice generation error:", e)
            return None
