from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from .models import NewsPost

class NewsPostManager(BaseUserManager):
    def create_news_post(self, title, text, author, **kwargs):
        news_post = self.model(title=title, text=text, author=author)
        news_post.save(using=self.db)
        return news_post
