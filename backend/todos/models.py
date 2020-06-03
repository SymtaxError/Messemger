from django.db import models
from servers.models import Server, Label
from users.models import User

class Desk(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=30, verbose_name='desk title')
    users = models.ManyToManyField(User, verbose_name='users')
    server = models.ForeignKey(
        Server,
        verbose_name="server",
        on_delete=models.CASCADE
    )
    creator = models.ForeignKey(
        User,
        related_name='desk_creator',
        on_delete=models.CASCADE
    )

class Table(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    id_on_desk = models.IntegerField(verbose_name='position on desk', null=True, blank=True)
    title = models.CharField(max_length=30, verbose_name='table title')
    desk = models.ForeignKey(
        Desk,
        verbose_name="desk",
        on_delete=models.CASCADE
    )
    class Meta:
        ordering = ['id_on_desk']

class Card(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    id_on_table = models.IntegerField(verbose_name='position on table', null=True, blank=True)
    title = models.CharField(max_length=30, verbose_name='desk title')
    assignees = models.ManyToManyField(User, verbose_name='assignees')
    date_expiration = models.DateField(verbose_name='date expiration', null=True, blank=True)
    is_done = models.BooleanField(verbose_name='done flag', default=False)
    table = models.ForeignKey(
        Table,
        verbose_name="table",
        on_delete=models.CASCADE
    )
    desk = models.ForeignKey(
        Desk,
        verbose_name="desk",
        on_delete=models.CASCADE
    )
    labels = models.ManyToManyField(Label, verbose_name='labels')
    class Meta:
        ordering = ['id_on_table']
