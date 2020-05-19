from django.db import models
from django.contrib.auth.models import AbstractBaseUser
#from .managers import CustomerManager

class Customer(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', unique=True)
    password = models.CharField(verbose_name='password', max_length=128)
    is_superuser = models.BooleanField(default=False)
    first_name = models.CharField(verbose_name='first name', max_length=30)
    last_name = models.CharField(verbose_name='last name', max_length=30)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    picture = models.ImageField(verbose_name='picture', upload_to='avatars/', null=True, blank=True)

#   objects = CustomerManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['is_superuser", "-email"]

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
        full_name = "{0} {1}".format(self.first_name, self.last_name)
        return full_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this user
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)

# Create your models here.
