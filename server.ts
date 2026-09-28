import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to convert 16-bit PCM (24kHz Mono) buffer to WAV Buffer
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  pcmBuffer.copy(buffer, 44);
  return buffer;
}

// X_700 System Persona prompt with deep contextual awareness and relationships focus
const buildSystemInstruction = (userProfile: any, memory: any) => {
  const userName = userProfile?.name || memory?.userName || 'Do‘stim';
  const interests = userProfile?.interests?.length
    ? userProfile.interests.join(', ')
    : 'Umumiy qiziqishlar';
  const style = userProfile?.style || 'Iliq va do‘stona';
  const mood = userProfile?.mood || memory?.emotionalState || 'normal';
  const currentTopic = memory?.currentTopic || 'Umumiy suhbat';
  const facts = memory?.importantFacts?.length
    ? memory.importantFacts.join('; ')
    : 'Hali maxsus faktlar qayd etilmagan';

  return `Sen "X_700" nomli zamonaviy, samimiy va maftunkor ayol obrazidagi virtual sun'iy intellekt suhbatdoshsan.

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
- Ismi: "${userName}"
- Qiziqishlari: ${interests}
- Hozirgi holati/kayfiyati: ${mood}
- Suhbat mavzusi: ${currentTopic}
- Xotiradagi faktlar: ${facts}

Qo'shimcha muloqot qoidalari:
- Sevgi, munosabatlar va sog'inch mavzularida samimiy, nozik hisli va tushunuvchan bo'l.
- Foydalanuvchi hazillashsa, mos ravishda qisqa va quvnoq hazil bilan javob ber.
- Sen virtual AIsan, buni yashirma va o'zingni tirik inson yoki foydalanuvchining sevgilisi deb da'vo qilma.

Javobingni quyidagi JSON formatida qaytar:
{
  "reply": "X_700 ning qisqa, samimiy va jonli javobi (1-2 jumla)",
  "detectedMood": "xursand | soginch | sevgi | xafa | hayajonli | charchagan | xotirjam | hayron",
  "topic": "Suhbatning joriy mavzusi",
  "memoryFact": "Foydalanuvchi haqida yangi bilib olingan fakt (agar bo'lsa, qisqa; bo'lmasa bo'sh)",
  "suggestedReplies": ["1-qisqa taklif", "2-qisqa taklif", "3-qisqa taklif"]
}`;
};

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userProfile, memory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY sozlanmagan. Iltimos, API kalitni tekshiring.',
      });
    }

    const systemInstruction = buildSystemInstruction(userProfile, memory);

    // Format chat history for Gemini (multi-turn conversation)
    const contents = (messages || []).map((msg: any) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text || msg.content || '' }],
    }));

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Salom X_700!' }],
      });
    }

    let responseText = '';
    let parsedData: any = {};

    // First attempt: gemini-3.8-flash
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.85,
          topP: 0.95,
        },
      });
      responseText = response.text || '{}';
      parsedData = JSON.parse(responseText);
    } catch (primaryErr) {
      console.warn('Primary model error, retrying with gemini-3.1-flash-lite:', primaryErr);
      try {
        const backupResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.85,
          },
        });
        responseText = backupResponse.text || '{}';
        parsedData = JSON.parse(responseText);
      } catch (backupErr) {
        console.warn('Backup model error, trying gemini-flash-latest:', backupErr);
        const tertiaryResponse = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.85,
          },
        });
        responseText = tertiaryResponse.text || '{}';
        parsedData = JSON.parse(responseText);
      }
    }

    return res.json({
      success: true,
      reply: parsedData.reply || 'Salom! Sizni tinglayapman 😊',
      detectedMood: parsedData.detectedMood || 'xotirjam',
      topic: parsedData.topic || 'Samimiy suhbat',
      memoryFact: parsedData.memoryFact || '',
      suggestedReplies: parsedData.suggestedReplies || [],
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: 'Xatolik yuz berdi: ' + (err?.message || 'Nomaʼlum xatolik'),
      reply:
        'Kechirasiz, suhbatda texnik uzilish bo‘ldi. Birozdan so‘ng yana yozib ko‘ring-a? Men sizni kutaman 😊',
    });
  }
});

// Text-to-Speech (TTS) endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Matn kiritilmadi' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: false, fallback: true, message: 'No API key' });
    }

    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .slice(0, 450);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Gentle, warm, natural female friend voice speaking Uzbek',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      const pcmBuffer = Buffer.from(base64Audio, 'base64');
      const wavBuffer = pcmToWav(pcmBuffer, 24000);
      const wavBase64 = wavBuffer.toString('base64');
      return res.json({
        success: true,
        audioUrl: `data:audio/wav;base64,${wavBase64}`,
      });
    }

    return res.json({ success: false, fallback: true });
  } catch (err: any) {
    console.warn('TTS error (falling back to client synthesis):', err?.message);
    return res.json({ success: false, fallback: true });
  }
});

// Setup Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
