from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.core.mail import send_mail
from .managers import UserManager
from backend.settings import MEDIA_ROOT
import os

def get_upload_path(instance, filename):
    return os.path.join(MEDIA_ROOT, 'users', str(instance.email), 'avatars', filename)

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', unique=True)
    password = models.CharField(verbose_name='password', max_length=128)
    is_superuser = models.BooleanField(default=False)
    first_name = models.CharField(verbose_name='first name', max_length=30)
    last_name = models.CharField(verbose_name='last name', max_length=30)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    picture = models.ImageField(verbose_name='picture', upload_to=get_upload_path, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['is_superuser', '-email']
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_username(self):
        '''
        Returns part of email without source address (part before @)
        '''
        username = self.email[:self.email.find('@')]
        return username

    def get_full_name(self):
        '''
        Returns the first_name and the last_name with a space between them.
        '''
        full_name = f"{self.first_name} {self.last_name}"
        return full_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this user
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)