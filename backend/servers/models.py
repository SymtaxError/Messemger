from django.db import models
from users.models import User
from .managers import ServerManager, MessageManager
from backend.settings import MEDIA_ROOT
import os

def get_upload_path(instance, filename):
    return os.path.join(MEDIA_ROOT, 'servers', str(instance.id), 'avatars', filename)

class Server(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(
        User,
        related_name='creator',
        on_delete=models.CASCADE
    )
    picture = models.ImageField(
        'picture',
        upload_to=get_upload_path,
        null=True,
        blank=True
    )
    users = models.ManyToManyField(User, verbose_name='users')
    DIALOG = 'D'
    CHAT = 'C'
    CHAT_TYPE_CHOICES = (
        (DIALOG, 'Dialog'),
        (CHAT, 'Chat')
    )
    type_chat = models.CharField(
        'type',
        max_length=1,
        choices=CHAT_TYPE_CHOICES,
        default=DIALOG
    )
    objects = ServerManager()

    def update(self, **kwargs):
        for item in kwargs.items():
            self.__dict__[item[0]] = item[1]
        self.save()

class Message(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    server = models.ForeignKey(
        Server, 
        verbose_name="server",
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        User,
        verbose_name="user",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=280, verbose_name="message")
    date_published = models.DateTimeField(
        "date published",
        auto_now_add=True
    )
    labels = models.ManyToManyField('Label', verbose_name='labels')

    objects = MessageManager()

    class Meta:
        ordering = ['-date_published']

    def __str__(self):
        return self.text

class Label(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    text = models.CharField(max_length=30)
    RED = 'R'
    ORANGE = 'O'
    YELLOW = 'Y'
    GREEN = 'G'
    LIGHT_BLUE = 'L'
    BLUE = 'B'
    VIOLET = 'V'
    NO_COLOR = 'N'
    COLOR_TYPE_CHOICES = (
        (NO_COLOR, 'No color'),
        (RED, 'Red'),
        (ORANGE, 'Orange'),
        (YELLOW, 'Yellow'),
        (GREEN, 'Green'),
        (LIGHT_BLUE, 'Light blue'),
        (BLUE, 'Blue'),
        (VIOLET, 'Violet')
    )
    color = models.CharField(
        'color',
        max_length=1,
        choices=COLOR_TYPE_CHOICES,
        default=NO_COLOR
    )
