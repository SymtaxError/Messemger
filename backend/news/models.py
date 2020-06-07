from django.db import models
from users.models import User
from news.managers import NewsPostManager

class NewsPost(models.Model):
    """ NewsPost is a class that describes objects used for news list page. 
    Each post has an id, title, text, publishing date and author. Interacting
    with stored in db objects is provided by NewsPostManager."""
    id = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=100)
    text = models.CharField(max_length=4294967296)
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
        """ Updates information in newspost fields."""
        for item in kwargs.items():
            self.__dict__[item[0]] = item[1]
        self.save()
