from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Conversation, Message
from ai.services import X700AIService
from voice.services import X700VoiceService

def index_view(request):
    return render(request, 'chat.html')

class ChatAPIView(APIView):
    def post(self, request):
        text = request.data.get('text', '').strip()
        user_name = request.data.get('userName', 'Do‘stim')
        interests = request.data.get('interests', [])
        style = request.data.get('style', 'Iliq va do‘stona')
        mood = request.data.get('mood', 'xotirjam')
        conversation_id = request.data.get('conversation_id')

        if not text:
            return Response({'error': 'Xabar matni bo‘sh bo‘lishi mumkin emas'}, status=status.HTTP_400_BAD_REQUEST)

        if conversation_id:
            conversation = Conversation.objects.filter(id=conversation_id).first()
        else:
            conversation = Conversation.objects.create(title=text[:40])

        user_msg = Message.objects.create(
            conversation=conversation,
            role='user',
            text=text,
            detected_mood=mood
        )

        history = [
            {'role': m.role, 'text': m.text}
            for m in conversation.messages.all()
        ]

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
    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'Matn kiritilmadi'}, status=status.HTTP_400_BAD_REQUEST)

        voice_service = X700VoiceService()
        audio_url = voice_service.text_to_speech(text)

        if audio_url:
            return Response({'success': True, 'audioUrl': audio_url})
        return Response({'success': False, 'fallback': True})
