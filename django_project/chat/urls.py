from django.urls import path
from .views import ChatAPIView, VoiceGenerateAPIView

urlpatterns = [
    path('send/', ChatAPIView.as_view(), name='chat-send'),
    path('voice/', VoiceGenerateAPIView.as_view(), name='chat-voice'),
]
