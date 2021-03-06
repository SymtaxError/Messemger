# Generated by Django 3.0.5 on 2020-06-03 10:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('servers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Desk',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=30, verbose_name='desk title')),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='desk_creator', to=settings.AUTH_USER_MODEL)),
                ('server', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='servers.Server', verbose_name='server')),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL, verbose_name='users')),
            ],
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('id_on_desk', models.IntegerField(blank=True, null=True, verbose_name='position on desk')),
                ('title', models.CharField(max_length=30, verbose_name='table title')),
                ('desk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todos.Desk', verbose_name='desk')),
            ],
            options={
                'ordering': ['id_on_desk'],
            },
        ),
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('id_on_table', models.IntegerField(blank=True, null=True, verbose_name='position on table')),
                ('title', models.CharField(max_length=30, verbose_name='desk title')),
                ('date_expiration', models.DateField(blank=True, null=True, verbose_name='date expiration')),
                ('is_done', models.BooleanField(default=False, verbose_name='done flag')),
                ('assignees', models.ManyToManyField(to=settings.AUTH_USER_MODEL, verbose_name='assignees')),
                ('desk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todos.Desk', verbose_name='desk')),
                ('labels', models.ManyToManyField(to='servers.Label', verbose_name='labels')),
                ('table', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todos.Table', verbose_name='table')),
            ],
            options={
                'ordering': ['id_on_table'],
            },
        ),
    ]
