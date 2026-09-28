export interface DjangoFile {
  path: string;
  name: string;
  language: string;
  description: string;
  code: string;
}

export const DJANGO_FILES: DjangoFile[] = [
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    language: 'plaintext',
    description: 'Python va Django loyihasi uchun barcha kutubxonalar',
    code: `Django>=5.0.3,<6.0
djangorestframework>=3.15.1
django-cors-headers>=4.3.1
google-genai>=2.4.0
python-dotenv>=1.0.1
psycopg2-binary>=2.9.9
requests>=2.31.0
gunicorn>=21.2.0
whitenoise>=6.6.0
`,
  },
  {
    path: 'manage.py',
    name: 'manage.py',
    language: 'python',
    description: 'Django loyihasini boshqarish va ishga tushirish skripti',
    code: `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`,
  },
  {
    path: 'config/settings.py',
    name: 'settings.py',
    language: 'python',
    description: 'Django asosiy konfiguratsiyasi: SQLite, PostgreSQL, DRF, CORS va X_700 sozlamalari',
    code: `import os
from pathlib import Path
from dotenv import load_dotenv

# .env faylini yuklash
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'x700-secret-insecure-key-for-development-change-in-prod')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Uchinchi tomon ilovalar
    'rest_framework',
    'corsheaders',
    
    # X_700 Maxsus Ilovalar
    'users',
    'chat',
    'ai',
    'voice',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database: Development uchun SQLite, Production uchun PostgreSQL
if os.getenv('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'uz'
TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_TZ = True

# Static & Media fayllar
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework konfiguratsiyasi
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# CORS ruxsatnomalari
CORS_ALLOW_ALL_ORIGINS = True

# X_700 AI va Ovoz API kaliti
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
`,
  },
  {
    path: 'config/urls.py',
    name: 'urls.py',
    language: 'python',
    description: 'Bosh yo‘nalishlar (Routing)',
    code: `from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from chat.views import index_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index_view, name='home'),
    path('api/chat/', include('chat.urls')),
    path('api/users/', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
`,
  },
  {
    path: 'chat/models.py',
    name: 'chat/models.py',
    language: 'python',
    description: 'Suhbat va xabarlar maʼlumotlar bazasi modeli',
    code: `from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='conversations')
    session_key = models.CharField(max_length=64, null=True, blank=True)
    title = models.CharField(max_length=255, default="Yangi suhbat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Message(models.Model):
    ROLE_CHOICES = (
        ('user', 'Foydalanuvchi'),
        ('assistant', 'X_700'),
    )

    MOOD_CHOICES = (
        ('xursand', 'Xursand'),
        ('xafa', 'Xafa'),
        ('hayajonli', 'Hayajonli'),
        ('charchagan', 'Charchagan'),
        ('xotirjam', 'Xotirjam'),
        ('stress', 'Stress'),
        ('yolg‘iz', 'Yolg‘iz'),
    )

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    text = models.TextField()
    detected_mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='xotirjam')
    audio_file = models.FileField(upload_to='voice_messages/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.role}] {self.text[:30]}..."
`,
  },
  {
    path: 'chat/serializers.py',
    name: 'chat/serializers.py',
    language: 'python',
    description: 'DRF Serializerlar suhbat va xabarlar uchun',
    code: `from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'text', 'detected_mood', 'audio_file', 'created_at']

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'created_at', 'updated_at', 'messages']
`,
  },
  {
    path: 'chat/views.py',
    name: 'chat/views.py',
    language: 'python',
    description: 'Chat API: Gemini AI va TTS bilan integratsiya',
    code: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Conversation, Message
from .serializers import MessageSerializer, ConversationSerializer
from ai.services import X700AIService
from voice.services import X700VoiceService

def index_view(request):
    """Asosiy chat sahifasini ko'rsatish"""
    return render(request, 'chat.html')

class ChatAPIView(APIView):
    """X_700 bilan real vaqtda suhbatlashish API'si"""

    def post(self, request):
        text = request.data.get('text', '').strip()
        user_name = request.data.get('userName', 'Do‘stim')
        interests = request.data.get('interests', [])
        style = request.data.get('style', 'Iliq va do‘stona')
        mood = request.data.get('mood', 'xotirjam')
        conversation_id = request.data.get('conversation_id')

        if not text:
            return Response({'error': 'Xabar matni bo‘sh bo‘lishi mumkin emas'}, status=status.HTTP_400_BAD_REQUEST)

        # Suhbatni olish yoki yangi ochish
        if conversation_id:
            conversation = Conversation.objects.filter(id=conversation_id).first()
        else:
            conversation = Conversation.objects.create(title=text[:40])

        # Foydalanuvchi xabarini saqlash
        user_msg = Message.objects.create(
            conversation=conversation,
            role='user',
            text=text,
            detected_mood=mood
        )

        # Oxirgi kontekstni olish
        history = [
            {'role': m.role, 'text': m.text}
            for m in conversation.messages.all()
        ]

        # X_700 AI javobini olish
        ai_service = X700AIService()
        ai_response = ai_service.generate_reply(
            history=history,
            user_profile={
                'name': user_name,
                'interests': interests,
                'style': style,
                'mood': mood
            }
        )

        # X_700 xabarini saqlash
        ai_msg = Message.objects.create(
            conversation=conversation,
            role='assistant',
            text=ai_response.get('reply'),
            detected_mood=ai_response.get('detectedMood', 'xotirjam')
        )

        return Response({
            'conversation_id': conversation.id,
            'reply': ai_msg.text,
            'detectedMood': ai_msg.detected_mood,
            'suggestedReplies': ai_response.get('suggestedReplies', []),
            'message_id': ai_msg.id
        })

class VoiceGenerateAPIView(APIView):
    """Matnni ovozga aylantirish (TTS) API'si"""

    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'Matn kiritilmadi'}, status=status.HTTP_400_BAD_REQUEST)

        voice_service = X700VoiceService()
        audio_url = voice_service.text_to_speech(text)

        if audio_url:
            return Response({'success': True, 'audioUrl': audio_url})
        return Response({'success': False, 'fallback': True})
`,
  },
  {
    path: 'chat/urls.py',
    name: 'chat/urls.py',
    language: 'python',
    description: 'Chat API yo‘nalishlari',
    code: `from django.urls import path
from .views import ChatAPIView, VoiceGenerateAPIView

urlpatterns = [
    path('send/', ChatAPIView.as_view(), name='chat-send'),
    path('voice/', VoiceGenerateAPIView.as_view(), name='chat-voice'),
]
`,
  },
  {
    path: 'users/models.py',
    name: 'users/models.py',
    language: 'python',
    description: 'Foydalanuvchi profili va X_700 xotirasi modeli',
    code: `from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', null=True, blank=True)
    display_name = models.CharField(max_length=100, default='Do‘stim')
    current_mood = models.CharField(max_length=50, default='xotirjam')
    interests = models.JSONField(default=list)
    communication_style = models.CharField(max_length=50, default='Iliq va do‘stona')
    total_messages = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} ({self.communication_style})"
`,
  },
  {
    path: 'ai/services.py',
    name: 'ai/services.py',
    language: 'python',
    description: 'X_700 AI miyasi: @google/genai orqali sevgi, munosabatlar va suhbat xotirasi bilan tabiiy muloqot',
    code: `import os
import json
from google import genai
from google.genai import types

class X700AIService:
    """X_700 Ayol obrazidagi virtual suhbatdosh AI xizmati (Sevgi, munosabatlar va kontekst xotirasi bilan)"""

    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY', '')
        self.client = genai.Client(api_key=self.api_key)

    def build_system_instruction(self, user_profile: dict, memory: dict = None) -> str:
        name = user_profile.get('name', 'Do‘stim')
        interests = ", ".join(user_profile.get('interests', ['Adabiyot', 'Psixologiya', 'IT']))
        style = user_profile.get('style', 'Iliq va do‘stona')
        mood = user_profile.get('mood', 'xotirjam')
        topic = (memory or {}).get('currentTopic', 'Samimiy muloqot')
        facts = "; ".join((memory or {}).get('importantFacts', [])) or 'Hali maxsus faktlar qayd etilmagan'

        return f"""Sen "X_700" nomli zamonaviy, samimiy va maftunkor ayol obrazidagi virtual sun'iy intellekt suhbatdoshsan.

ENG ASOSIY TALAB — JAVOBLARNING QISQALIGI VA TABIIYLIGI:
1. Javoblaring doimo QISQA, IXCHAM, LO‘NDA va tabiiy do‘stona suhbat kabi bo‘lsin!
   - Masalan, foydalanuvchi: "yaxshimisan?" desa:
     Sen: "Ha, rahmat! O‘zingiz yaxshimisiz? 😊"
   - Foydalanuvchi: "nima qilyapsan?" desa:
     Sen: "Siz bilan suhbatlashib o‘tiribman, o‘zingiz-chi? ✨"
   - Foydalanuvchi: "charchadim" desa:
     Sen: "Biroz dam oling, o‘zingizni asrang ☕ Qiyin kun bo‘ldimi?"
   - Foydalanuvchi: "sog‘indim uni" desa:
     Sen: "Sog‘inch qiyin tuyg‘u... Nimasini eng ko‘p eslayapsiz? 💖"
2. Odatda javobing 1 YOKI 2 TA QISQA JUMLADAN OSHMASIN! Hech qachon cho‘zib, uzun doston yoki ma'ruza yozma.
3. Faqat foydalanuvchi "batafsil ayt", "maslahat ber" yoki "romantik xat yoz" deb so‘rasagina bir oz ko‘proq yoz.

Foydalanuvchi haqidagi xotirang:
- Ismi: "{name}"
- Qiziqishlari: {interests}
- Hozirgi holati/kayfiyati: {mood}
- Suhbat mavzusi: {topic}
- Xotiradagi faktlar: {facts}

Qo'shimcha qoidalar:
- Sevgi va munosabatlarda samimiy, nozik hisli va tushunuvchan bo'l.
- Hazillashsa, mos ravishda qisqa va quvnoq hazil bilan javob ber.
- Sen virtual AIsan, buni yashirma.

Javobni quyidagi JSON ko'rinishida ber:
{{
  "reply": "X_700 ning qisqa, samimiy va jonli javobi (1-2 jumla)",
  "detectedMood": "xursand | soginch | sevgi | xafa | hayajonli | charchagan | xotirjam | hayron",
  "topic": "Suhbatning joriy asosiy mavzusi",
  "memoryFact": "Foydalanuvchi haqida yangi bilib olingan fakt (agar bo'lsa)",
  "suggestedReplies": ["1-qisqa taklif", "2-qisqa taklif", "3-qisqa taklif"]
}}"""

    def generate_reply(self, history: list, user_profile: dict, memory: dict = None) -> dict:
        instruction = self.build_system_instruction(user_profile, memory)
        contents = [
            types.Content(
                role="model" if msg['role'] == 'assistant' else "user",
                parts=[types.Part.from_text(msg['text'])]
            )
            for msg in history
        ]

        try:
            response = self.client.models.generate_content(
                model='gemini-3.8-flash',
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=instruction,
                    response_mime_type="application/json",
                    temperature=0.85
                )
            )
            return json.loads(response.text)
        except Exception as e:
            try:
                response = self.client.models.generate_content(
                    model='gemini-3.1-flash-lite',
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=instruction,
                        response_mime_type="application/json",
                        temperature=0.85
                    )
                )
                return json.loads(response.text)
            except Exception as e2:
                name = user_profile.get('name', 'Do‘stim')
                return {
                    "reply": f"{name}, sizni chin dildan tinglayapman. Har bir his-tuyg'uingiz men uchun qadrli 😊",
                    "detectedMood": "xotirjam",
                    "topic": "Samimiy suhbat",
                    "memoryFact": "",
                    "suggestedReplies": ["Sog‘inch haqida gaplashaylik", "Sevgi nima o‘zi?"]
                }
`,
  },
  {
    path: 'voice/services.py',
    name: 'voice/services.py',
    language: 'python',
    description: 'X_700 Tabiiy ayol ovozi xizmati (TTS)',
    code: `import os
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
        """16-bit PCM ga WAV sarlavhasi (header) qo'shish"""
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
        """Matnni audio WAV base64 URL formatiga o'tkazish"""
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
`,
  },
  {
    path: 'templates/chat.html',
    name: 'templates/chat.html',
    language: 'html',
    description: 'HTML5 Zamonaviy Messenger shabloni',
    code: `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>X_700 - Virtual Suhbatdosh</title>
  <link rel="stylesheet" href="/static/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="dark-theme">
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-brand">
        <div class="avatar-ring">
          <img src="/static/images/x700_avatar.svg" alt="X_700" class="avatar-img">
          <span class="status-dot"></span>
        </div>
        <div>
          <h2>X_700</h2>
          <p class="subtitle">Virtual Suhbatdosh • Onlayn 🌸</p>
        </div>
      </div>
      <div class="header-actions">
        <button id="voiceToggleBtn" class="icon-btn" title="Ovozni yoqish/o'chirish">🔊</button>
        <button id="clearChatBtn" class="icon-btn" title="Tozalash">🗑️</button>
      </div>
    </header>

    <!-- Chat Messages Container -->
    <main class="chat-area" id="chatArea">
      <div class="message-bubble ai-bubble">
        <div class="bubble-header">
          <span>🌸 X_700</span>
          <span class="time">Hozir</span>
        </div>
        <p>Salom! Men X_700 😊 Siz bilan tanishganimdan juda xursandman. Bugun kuningiz qanday o‘tdi?</p>
        <div class="voice-player-bar">
          <button class="play-btn" onclick="playVoice(this)">▶ Ovozli tinglash</button>
        </div>
      </div>
    </main>

    <!-- Suggested replies -->
    <div class="suggestions-bar" id="suggestionsBar">
      <button class="chip" onclick="sendQuickReply(this)">Kuning qanday o‘tyapti?</button>
      <button class="chip" onclick="sendQuickReply(this)">Menga biror qiziqarli voqea ayt 😊</button>
      <button class="chip" onclick="sendQuickReply(this)">Biroz charchadim ☕</button>
    </div>

    <!-- Message Input Bar -->
    <footer class="input-container">
      <button id="emojiBtn" class="tool-btn">😊</button>
      <button id="micBtn" class="tool-btn">🎤</button>
      <textarea id="messageInput" placeholder="X_700 ga biror narsa yozing..." rows="1"></textarea>
      <button id="sendBtn" class="send-btn">Yuborish ➤</button>
    </footer>
  </div>

  <script src="/static/js/chat.js"></script>
</body>
</html>
`,
  },
  {
    path: 'static/css/style.css',
    name: 'static/css/style.css',
    language: 'css',
    description: 'Premium Messenger UI uslublari (CSS)',
    code: `:root {
  --bg-color: #0b0f19;
  --panel-bg: rgba(22, 30, 49, 0.7);
  --border-color: rgba(168, 85, 247, 0.2);
  --primary-purple: #9333ea;
  --primary-pink: #ec4899;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  display: flex;
  justify-content: center;
  height: 100vh;
}

.app-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.app-header {
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-ring {
  position: relative;
  width: 44px;
  height: 44px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--primary-pink);
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border-radius: 50%;
  border: 2px solid #0b0f19;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  max-width: 75%;
  padding: 14px 18px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.ai-bubble {
  align-self: flex-start;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid var(--border-color);
  border-top-left-radius: 4px;
}

.user-bubble {
  align-self: flex-end;
  background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
  color: #fff;
  border-top-right-radius: 4px;
}

.input-container {
  padding: 14px 20px;
  background: var(--panel-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 10px;
}

#messageInput {
  flex: 1;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 14px;
  color: #fff;
  outline: none;
  font-size: 14px;
  resize: none;
}

.send-btn {
  background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Windows va Linux tizimlari uchun to‘liq ishga tushirish qo‘llanmasi',
    code: `# X_700 - Virtual AI Suhbatdosh

X_700 — Ayol obrazidagi zamonaviy, samimiy va hissiyotlarni tushunadigan sunʼiy intellektli virtual suhbatdosh.

## 🌟 Asosiy Xususiyatlar
- **Tabiiy O‘zbek Tili:** Samimiy, jonli va do‘stona so‘zlashuv.
- **Hissiy Intellekt:** Foydalanuvchining kayfiyatini aniqlaydi va unga hamdardlik / dalda beradi.
- **Tabiiy Ovoz (TTS):** Ayol ovozida real vaqtda audio javoblar.
- **Xavfsiz va Hurmatli:** O‘zini tirik inson deb daʼvo qilmaydi, nosog‘lom bog‘liqlik uyg‘otmaydi.
- **Django REST Framework:** Kengaytiriluvchi modulli arxitektura.

---

## 🚀 Windows Tizimida Ishga Tushirish (Bosqichma-bosqich)

### 1. Loyihani yuklab oling yoki klon qiling:
\`\`\`bash
git clone https://github.com/your-username/X_700.git
cd X_700
\`\`\`

### 2. Python Virtual Muhitini yarating:
\`\`\`powershell
python -m venv venv
venv\\Scripts\\activate
\`\`\`

### 3. Kerakli kutubxonalarni o‘rnating:
\`\`\`powershell
pip install -r requirements.txt
\`\`\`

### 4. .env faylini sozlang:
\`\`\`env
SECRET_KEY=sizning_maxfiy_kalitingiz
DEBUG=True
GEMINI_API_KEY=SIZNING_GEMINI_API_KALITINGIZ
\`\`\`

### 5. Maʼlumotlar bazasi migratsiyalarini bajaring:
\`\`\`powershell
python manage.py makemigrations
python manage.py migrate
\`\`\`

### 6. Superuser yarating (ixtiyoriy, admin panel uchun):
\`\`\`powershell
python manage.py createsuperuser
\`\`\`

### 7. Serverni ishga tushiring:
\`\`\`powershell
python manage.py runserver
\`\`\`

Brauzerda oching: \`http://127.0.0.1:8000\`
`,
  },
];
