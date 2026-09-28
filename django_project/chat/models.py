from django.db import models
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
