# X_700 - Zamonaviy Sun’iy Intellektli Virtual Suhbatdosh

**X_700** — ayol obrazidagi zamonaviy, samimiy va hissiyotlarni tushunadigan sunʼiy intellektli virtual suhbatdosh tizimi.

---

## 🌸 1. Umumiy Tavsif
- **Nomi:** X_700
- **Obrazi:** Mehribon, maftunkor, nozik hazilga ega va hurmatli ayol virtual suhbatdosh.
- **Tili:** Tabiiy va jonli o‘zbek tili (lotin yozuvida).
- **Hissiyotlar:** Foydalanuvchining ruhiy holatini (quvonch, xafalik, charchoq, stress, hayajon) tushunadi va mehr bilan dalda beradi.
- **Ovozli aloqa:** Matnni tabiiy ayol ovoziga aylantirish (TTS) va eshitish (Play/Pause, tezlik nazorati).
- **Xavfsizlik:** O‘zini tirik inson deb yolg‘on daʼvo qilmaydi, nosog‘lom bog‘liqlik shakllantirmaydi, 100% axloqiy va xavfsiz.

---

## 🛠 2. Loyiha Arxitekturasi

Ushbu loyiha 2 xil formatda to‘liq qo‘llab-quvvatlanadi:
1. **Live Interactive Web App (AI Studio / Node.js + Express + React):** Brauzer orqali to‘g‘ridan-to‘g‘ri sinab ko‘rish va muloqot qilish uchun.
2. **Backend (Python 3.10+ / Django 5 + Django REST Framework):** Mustaqil server, Windows va Linuxda ishga tushirish uchun.

### Papka tuzilishi:
```
X_700/
├── manage.py                # Django boshqaruv fayli
├── config/                  # Asosiy loyiha sozlamalari
│   ├── settings.py          # SQLite / PostgreSQL, DRF, CORS
│   ├── urls.py              # Asosiy routing
│   └── wsgi.py
├── chat/                    # Suhbat ilovasi
│   ├── models.py            # Conversation va Message modellari
│   ├── serializers.py       # DRF serializerlar
│   ├── views.py             # ChatAPIView, VoiceGenerateAPIView
│   └── urls.py
├── users/                   # Foydalanuvchi va profil
│   ├── models.py            # UserProfile (qiziqishlar, uslub, xotira)
│   └── urls.py
├── ai/                      # Sun'iy intellekt moduli
│   └── services.py          # @google/genai bilan X_700 prompt boshqaruvi
├── voice/                   # Ovoz moduli
│   └── services.py          # Gemini TTS va WAV audio generatsiyasi
├── templates/               # HTML5 shablonlar
│   └── chat.html
├── static/                  # CSS va JS resurslar
│   ├── css/style.css
│   └── js/chat.js
├── requirements.txt         # Python kutubxonalari
└── README.md                # Qo‘llanma
```

---

## 💻 3. Windows Tizimida Bosqichma-bosqich O‘rnatish

### 1-qadam: Python-ni tekshirish
Windows CMD yoki PowerShell oynasini oching:
```powershell
python --version
```
*(Agar Python o‘rnatilmagan bo‘lsa, python.org saytidan Python 3.10 yoki undan yangisini yuklab oling. O‘rnatishda **"Add Python to PATH"** katakchasini belgilashni unutmang).*

### 2-qadam: Virtual muhit (venv) yaratish va faollashtirish
Loyiha papkasida:
```powershell
python -m venv venv
venv\Scripts\activate
```

### 3-qadam: Kerakli kutubxonalarni o‘rnatish
```powershell
pip install -r requirements.txt
```

### 4-qadam: .env faylini sozlash
Loyihaning ildiz papkasida `.env` fayli yarating va quyidagilarni kiriting:
```env
SECRET_KEY=x700_super_secret_production_key_2026
DEBUG=True
GEMINI_API_KEY=SIZNING_GEMINI_API_KALITINGIZ
```

### 5-qadam: Maʼlumotlar bazasini yangilash (Migratsiya)
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 6-qadam: Serverni ishga tushirish
```powershell
python manage.py runserver
```

Brauzeringizda quyidagi manzilni oching:
👉 `http://127.0.0.1:8000`

---

## 🌸 X_700 bilan yaxshi suhbat tilaymiz!
