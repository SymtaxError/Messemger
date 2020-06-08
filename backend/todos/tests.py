from django.test import RequestFactory, TestCase
from users.models import User, UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import DeskListView
from servers.models import Server

class TestToDo(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        user = User.objects.create_user(email='test@test.ru', password='12345')
        UserProfile.objects.create_profile(user, 'Ilia', 'Muravev')
        Server.objects.create_server('Test server', user, 'C')

    def get_access_token(self, payload):
        request = self.factory.post('/jwt/login/', data=payload)
        response = TokenObtainPairView.as_view()(request)
        return response.data['access']

    def test_user_can_create_desk_on_server(self):
        payload = {
            'email': 'test@test.ru',
            'password': '12345'
        }
        auth_token = self.get_access_token(payload)
        data = {
            'title': 'My awesome desk',
            'server_id': 1
        }
        request = self.factory.post('/todos/list/', data=data)
        request.META['HTTP_AUTHORIZATION'] = 'JWT {}'.format(auth_token)
        response = DeskListView.as_view()(request)
        self.assertEqual(response.status_code, 201)
