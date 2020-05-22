from django.db import models
from customers.models import Customer
from django.utils import timezone

class Server(models.Model):
    unique_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=50)
    picture = models.ImageField(verbose_name='picture', upload_to='avatars/', null=True, blank=true)
    users = models.ManyToManyField(Customer, verbose_name='customers')


class Message(models.Model):
    id = models.IntegerField(unique=True)
    server = models.ForeignKey(Server, verbose_name="server", \
    on_delete=models.CASCADE)
    owner = models.ForeignKey(Customer, verbose_name="customer", \
    on_delete=models.CASCADE)
    text = models.CharField(max_length=280, verbose_name="message")
    date_published = models.DateTimeField(verbose_name="date published", \
    default=timezone.now)
    labels = models.ManyToManyField('Label', verbose_name='labels')

    class Meta:
        ordering = ['pub_date']

    def __str__(self):
        return self.text

# Create your models here.
