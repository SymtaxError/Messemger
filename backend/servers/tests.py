from django.test import RequestFactory, TestCase
from users.models import User, UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ServerView

class TestServers(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        user = User.objects.create_user(email='test@test.ru', password='12345')
        UserProfile.objects.create_profile(user, 'Ilia', 'Muravev')

        user = User.objects.create_user(email='test1@test.ru', password='qwerty')
        UserProfile.objects.create_profile(user, 'Rostislav', 'Shatskiy')

    def get_access_token(self, payload):
        request = self.factory.post('/jwt/login/', data=payload)
        response = TokenObtainPairView.as_view()(request)
        return response.data['access']

    def test_user_can_create_group_chat(self):
        payload = {
            'email': 'test@test.ru',
            'password': '12345'
        }
        auth_token = self.get_access_token(payload)
        data = {
            'name': 'My awesome conference'
        }
        request = self.factory.post('/servers/list/', data=data)
        request.META['HTTP_AUTHORIZATION'] = 'JWT {}'.format(auth_token)
        response = ServerView.as_view()(request)
        self.assertEqual(response.status_code, 201)

    def test_user_can_create_dialog(self):
        payload = {
            'email': 'test1@test.ru',
            'password': 'qwerty'
        }
        auth_token = self.get_access_token(payload)
        data = {
            'name': 'OUR dialog',
            'tag': 'test#1'
        }
        request = self.factory.post('/servers/list/', data=data)
        request.META['HTTP_AUTHORIZATION'] = 'JWT {}'.format(auth_token)
        response = ServerView.as_view()(request)
        self.assertEqual(response.status_code, 201)