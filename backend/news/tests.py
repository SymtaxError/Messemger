from django.test import RequestFactory, TestCase
from users.models import User, UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import NewsPostView

class TestNews(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        user = User.objects.create_superuser(email='test@test.ru', password='12345')
        UserProfile.objects.create_profile(user, 'Ilia', 'Muravev')

        user = User.objects.create_user(email='test1@test.ru', password='qwerty')
        UserProfile.objects.create_profile(user, 'Rostislav', 'Shatskiy')

    def get_access_token(self, payload):
        request = self.factory.post('/jwt/login/', data=payload)
        response = TokenObtainPairView.as_view()(request)
        return response.data['access']

    def test_superuser_can_post_news(self):
        payload = {
            'email': 'test@test.ru',
            'password': '12345'
        }
        auth_token = self.get_access_token(payload)
        topic = {
            'title': 'Summertime!!!',
            'text': 'Today is the first day of summer. My congratulations!'
        }
        request = self.factory.post('/news/', data=topic)
        request.META['HTTP_AUTHORIZATION'] = 'JWT {}'.format(auth_token)
        response = NewsPostView.as_view()(request)
        self.assertEqual(response.status_code, 201)

    def test_common_user_can_not_post_news(self):
        payload = {
            'email': 'test1@test.ru',
            'password': 'qwerty'
        }
        auth_token = self.get_access_token(payload)
        topic = {
            'title': 'Summertime!!!',
            'text': 'Today is the first day of summer. My congratulations!'
        }
        request = self.factory.post('/news/', data=topic)
        request.META['HTTP_AUTHORIZATION'] = 'JWT {}'.format(auth_token)
        response = NewsPostView.as_view()(request)
        self.assertEqual(response.status_code, 403)