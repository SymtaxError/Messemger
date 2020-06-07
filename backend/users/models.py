from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.core.mail import send_mail
from .managers import UserManager, ProfileManager
from backend.settings import MEDIA_ROOT, AUTH_USER_MODEL
import os

def get_upload_path(instance, filename):
    """Describes the path where loaded images are saved."""
    return os.path.join(MEDIA_ROOT, 'users', str(instance.user.email), 'avatars', filename)

class User(AbstractBaseUser):
    """User is a basic model that is used for registration and authorization.
    It has email, password, is_superuser fields and a special manager for 
    interacting with stored in db objects."""
    email = models.EmailField(verbose_name='email address', unique=True)
    password = models.CharField(verbose_name='password', max_length=128)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['is_superuser', '-email']
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_username(self):
        """ Returns part of user email before '@' - his username."""
        username = self.email[:self.email.find('@')]
        return username

    def email_user(self, subject, message, from_email=None, **kwargs):
        """ Allows writing an email to user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self):
        """ Returns string representation of user - its full name."""
        return UserProfile.objects.get(user=self).get_full_name()

    def get_tag(self):
        return UserProfile.objects.get(user=self).tag

class UserProfile(models.Model):
    """ UserProfile is an extended model for storing information about users.
    It has such fields as user, first_name, date_joined, tag (a unique 
    identifier), avatar, status, friends. Interacting with objects stored in
    database is provided by ProfileManager."""
    user = models.OneToOneField(
        AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='user',
    )
    first_name = models.CharField(verbose_name='first name', max_length=30)
    last_name = models.CharField(verbose_name='last name', max_length=30)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    tag = models.CharField(max_length=128)
    avatar = models.ImageField(verbose_name='profile avatar', upload_to=get_upload_path,
        null=True, blank=True)
    status = models.CharField(max_length=1000, blank=True, null=True)
    friends = models.ManyToManyField(
        AUTH_USER_MODEL,
        related_name='friends',
        verbose_name='friends'
    )

    objects = ProfileManager()

    def get_full_name(self):
        """ Returns first_name plus last_name."""
        full_name = f"{self.first_name} {self.last_name}"
        return full_name

    def update_tag(self):
        """ Allows updating users tag if his username was edited."""
        self.tag = self.user.get_username() + '#' + str(self.user.id)
        self.save()

    def update_status(self, new_status):
        """ Allows updating user status."""
        self.status = new_status
        self.save()

    def update(self, **kwargs):
        """Allows updating information about user."""
        for item in kwargs.items():
            if item[0] == 'email':
                self.user.email = item[1]
                self.user.save()
                self.update_tag()
            elif item[0] == 'tag':
                continue
            else:
                self.__dict__[item[0]] = item[1]
        self.save()
