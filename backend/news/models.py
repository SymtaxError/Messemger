from django.db import models
from users.models import User
from news.managers import NewsPostManager

class NewsPost(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=100)
    text = models.CharField(max_length=512)
    date_published = models.DateTimeField("date published", auto_now_add=True)
    author = models.ForeignKey(
        User,
        verbose_name='author',
        on_delete=models.CASCADE
    )
    
    objects = NewsPostManager()

    class Meta:
        ordering = ['-date_published']

    def update(self, **kwargs):
        for item in kwargs.items():
            self.__dict__[item[0]] = item[1]
        self.save()
