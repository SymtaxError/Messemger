from django.db import models
from django.contrib.auth.base_user import BaseUserManager

class NewsPostManager(BaseUserManager):
    """Provides interacting with NewsPost objects stored in database."""
    def create_news_post(self, title, text, author, **kwargs):
        """Creates a new post."""
        news_post = self.model(title=title, text=text, author=author)
        news_post.save(using=self.db)
        return news_post
