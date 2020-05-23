from django.db import models
from customers.models import Customer
from django.utils import timezone

class Server(models.Model):
    unique_id = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=50)
    picture = models.ImageField(
        'picture',
        upload_to='avatars/',
        null=True,
        blank=True
    )
    customers = models.ManyToManyField(Customer, verbose_name='customers')
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

class Message(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    server = models.ForeignKey(
        Server, 
        verbose_name="server",
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        Customer,
        verbose_name="customer",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=280, verbose_name="message")
    date_published = models.DateTimeField(
        "date published",
        default=timezone.now
    )
    labels = models.ManyToManyField('Label', verbose_name='labels')

    class Meta:
        ordering = ['date_published']

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
     
# Create your models here.
