import os
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

        # Try gemini-3.8-flash, fallback to gemini-3.1-flash-lite
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
