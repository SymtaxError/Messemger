from django.db import models


# Create your models here.

class Card(models.Model):
    title = models.CharField(max_length=30, verbose_name='desk title')
    assignees = models.ManyToManyField('customers.Customer')
    date_expiration = models.DateField(verbose_name='date expiration')
    is_done = models.BooleanField(verbose_name='done flag')