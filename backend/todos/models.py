from django.db import models
from ..servers.models import Server
from ..customers.models import Customer


class Desk(models.Model):
    title = models.CharField(max_length=30, verbose_name='desk title')
    server = models.ForeignKey(
        Server,
        verbose_name="server",
        on_delete=models.CASCADE
    )
    creator = models.ForeignKey(
        Customer,
        verbose_name='creator',
        on_delete=models.SET_DEFAULT,
        default="DELETED"
    )


class Table(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=30, verbose_name='desk title')
    desk = models.ForeignKey(
        Desk,
        verbose_name="desk",
        on_delete=models.CASCADE
    )
    creator = models.ForeignKey(
        Customer,
        verbose_name='creator',
        on_delete=models.SET_DEFAULT,
        default="DELETED"
    )


class Card(models.Model):
    title = models.CharField(max_length=30, verbose_name='desk title')
    assignees = models.ManyToManyField(Customer)
    date_expiration = models.DateField(verbose_name='date expiration')
    is_done = models.BooleanField(verbose_name='done flag')
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
    creator = models.ForeignKey(
        Customer,
        verbose_name='creator',
        on_delete=models.SET_DEFAULT,
        default="DELETED"
    )
